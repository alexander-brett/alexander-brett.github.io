---
title: A New Pattern for Apex Triggers
tags: [SFDC, Apex]
---

_This is going to be a pretty long post. If you want the meaty bit, scroll down to 'Solving the problem by using object-orientation properly'_

## A brief history of trigger patterns

### 1: The anti-pattern

I feel like an organisation or developer will go through different stages as they learn better ways of dealing with Apex Triggers. A rookie developer in a simple instance with only 501 training might write triggers that look like this:

```java
trigger QuoteTaxUpdate on Quote (before insert, before update) {
  for (Quote q : Trigger.new) {
    if(Trigger.isInsert || Trigger.oldMap.get(q.Id).Value__c != q.Value__c) {
      q.Tax__c = TaxCalculator.calculateTaxes(q);
      // ... more logic goes here
    }
  }
}
```

```java
trigger QuoteRelatedOpportunityUpdate on Quote (after insert, after update) {
  for (Quote q : Trigger.new) {
    // Do Stuff
  }
}
```

There are several major problems with this approach:

- Having multiple triggers on the same object means that it's hard to isolate the code file causing problematic behaviour
- It can be hard to debug complex interactions between triggered processes
- Once you hit a couple of hundred objects with a handful of processes on each, you have a huge number of source code files to track

### 2: One trigger per object

With this in mind, the tendancy is to combine triggers so that each object has precisely one trigger class:

```java
trigger QuoteTrigger on Quote (before insert, before update, after insert, after update) {
  if (Trigger.isBefore) {
    if (Trigger.isInsert) {
      //Do some things
    } else if (Trigger.isUpdate) {
      //Do other things
    }
  } else if (Trigger.isAfter) {
    if (Trigger.isInsert) {
      // More stuff
    } else if (Trigger.isUpdate) {
      // You're getting the hang of this...
    }
  }
}
```

Having now refactored your code into some beautiful, well-organised triggers, you notice that the stuff you're doing in the Before Update and Before Insert is close enough that you want a method to parameterise - but you can't have methods in triggers. Additionally, this makes it very difficult to unit test a trigger. All this leads to:

### 3: The Trigger Handler

You move your logic into its own class, defin

```java
public class QuoteTriggerHandler {
  public static void onBeforeUpdate () {
    sharedMethod();
  }
  
  public static void onAfterUpdate () {
    sharedMethod();
  }
  
  // ...
  
  public sharedMethod(){
    if (Trigger.isInsert) {
      // logic goes here
    }
  }
}
```

This is great, because you can have some unit tests, some shared methods, and so on and so forth. However, you often find that you're looping through the records once to choose which ones to update the taxes on, again to work out the new owner, a third time for some dynamic sharing rules, and before long you run through the 'total lines of code executed in one transaction' governor limit (or your customers complain about your Quotes taking agonising seconds to save).

### 4: The Advanced Trigger Handler

How do we fix this? We need some _architecture_. Let's set it up so that we only iterate over the records once to ascertain which ones are appropriate to our needs, then each process will need to iterate over fewer records. Once you've got more than a couple of jobs, this really pays off. Additionally, it's very easy to create shared and testable logic like this, because you require that each process has its own method which you can unit test to your heart's content.

```java
public class QuoteTriggerHandler {
	private List<Quote> QuotesForTaxUpdate = new List<Quote>();
	private List<Quote> QuotesForOpportunityOwnerUpdate = new List<Quote>();
	// more lists

	private Boolean DoTaxUpdate = false;
	private Boolean DoOpportunityOwnerUpdate;
	// more toggles

	public void onBeforeUpdate () {
		DoTaxUpdate = true;
		chooseRecords();
		doLogic();
	}

	public void onAfterInsert () {
		DoOpportunityUpdate = true;
		chooseRecords();
		doLogic();
	}

	public void chooseRecords () {
		for (Quote q : Trigger.new) {
			if (DoTaxUpdate && /*conditions*/) {
				QuotesForTaxUpdate.add(q);
			}
			if (DoOpportunityUpdate && /*conditions*/) {
				QuotesForOpportunityUpdate.add(q);
			}
		}
	}

	public void doLogic () {
		if (DoTaxUpdate)
			TaxUpdateLogic(QuotesForTaxUpdate);
		if (DoOpportunityUpdate) 
			OpportunityUpdateLogic(QuotesForOpportunityUpdate);
	}
}
```

So why don't I like this? There are several remaining problems.

- Your trigger handler will probably be somewhere between quite long and REALLY REALLY long. If I've identified a bug in a particular operation, I don't want to sift through a thousand lines of code to find the method implementing that operation, and try to work out whether the bug is there, or in the if clause somewhere inside  `chooseRecords()`  (which is probably a hundred lines long all by itself).
- This pattern is quite complicated, and it's going to take a good while for your new hires to be confident enough to dive into said several-hundred-lines long chunk of code and make changes, out of sheer fear of breaking things.
- You're going to have lots of code which looks similar in the trigger handler for every object, which smells.

## Solving the problem by using object orientation properly

### A rough outline

If you take another look at the example above, you'll see that we've basically created a contract for each `TriggerOperation` (I'm starting to outline the names I'll use in the solution). This is:

- An `OperationName`, which tells people what you're trying to do - for instance, `UpdateTaxes` or `UpdateOpportunityOwners`.
- An `InitialLoopOperation`, which will normally select an appropriate subset of records for your operation
- Some `OperationLogic`, which is executed at the end.

With this is mind, it seems like a `TriggerOperation` would be a very good candidate for creating a generic class, which could then be extended and overridden, but which crucially would define a standard interface. This means that when I know roughly what's gone wrong, I only have one small class to check through for code errors, and when a new developer want to write a new process, he knows where to start without reading reams of documentation and still breaking the build for everyone else.

The second part of this puzzle is going to have to be a `TriggerOperationDispatcher`, which consumes the `TriggerOperation` implementations and calls their operations as applicable. This class can then be shared between every SObject, reducing duplication and meaning that if you want to add functionality, you can do it once and benefit everywhere (I'll go into this idea more further on).

### Sample Implementation (MKI)

With the introductions out of the way, let's give an outline of the classes. It's going to get very code-heavy hereafter:

```java
// This SHOULD have a type parameter to allow derivation for
// a particular object, but that was deprecated in API v26 :(
public virtual TriggerOperation {
	public abstract void initialLoopOperation (SObject obj);

	public void execute() {
		this.logic();
	}

	// protected means that execute() can access the
	// overridden version in the implementation class
	protected abstract void logic();
}
```

```java
public TriggerOperationDispatcher {

	private List<TriggerOperation> operations = new List<TriggerOperation>();

	private Boolean isUpdate;
	private Boolean isBefore;
	private Map<Id,SObject> oldMap;
	//etc.
	
	public TriggerOperationDispatcher () {
		this(
			Trigger.newMap, Trigger.oldMap, Trigger.isUpdate,
			Trigger.isInsert, Trigger.isDelete, Trigger.isUndelete,
			//etc
		);
	}
	
	// We're going to want to carefully unit test this class, and
	// this constructor is an easy way to simulate trigger conditions
	@testVisible 
	private TriggerOperationDispatcher (Map<Id,SObject> newMap, /*etc*/) {
		this.newMap = newMap;
		//and so on...
	}

	public TriggerOperationDispatcher addOperation (TriggerOperation op) {
		operations.add(op);
		return this; //chainable
	}

	public void dispatch () {
		List<SObject> relevantObjects = (isInsert || isUpdate || isUndelete)
			? newList
			: oldList;
		
		for (SObject obj : relevantObjects)
			for (TriggerOperation op : operations)
				operation.initialLoopOperation(obj);
		
		for (TriggerOperation op : operations)
			operation.execute();
	}
}
```

Let's look at how we'd refactor the `QuoteTrigger` to take account of this:

```java
trigger QuoteTrigger on Quote (before insert, /*blah blah*/) {
	TriggerOperationDispatcher dispatcher = new TriggerOperationDispatcher();
	if (Trigger.isBefore) {
		if (Trigger.isInsert)
			dispatcher.addOperation(new QuoteTaxOperation(Trigger.oldMap))
				.addOperation(new SomeOtherOperation());
		if (Trigger.isUpdate)
			// The rest of this is predictable
	} else if () {
	} //etc.
}
```

and to make our `QuoteTaxOperation`:

```java
public class QuoteTaxOperation : TriggerOperation {
	private List<Quote> QuotesForTaxUpdate;
	private Map<Id,Quote> oldMap;

	public QuoteTaxOperation (Map<Id,Quote> oldMap) {
		this.oldMap = oldMap;
	}
	
	public void override initialLoopOperation (SObject obj) {
		Quote q = (Quote)obj;
		if (oldMap == null || q.Value__c != oldMap.get(q.Id).Value__c)
			QuotesForTaxUpdate.add(q);
	}

	protected void logic () {
		for (Quote q : QuotesForTaxUpdate) {
			calculateTax(q);
		}
	}
}
```

### Turning stuff on and off

Let's say we've just updated a sandbox and we're going to go through every email field and add something to the end, so that our customers don't get spammed whilst we test. We've got an awesome apex script to accomplish this, but if all our trigger run, it'll take forever to perform the update! We need to turn off the operations. Luckily, most of the framework for this is in place.

What we need is:

- A catalogue of operations

```java
public enum TriggerOperationName {
	QUOTE_UPDATE_TAX,
	QUOTE_UPDATE_OPPORTUNITY_OWNER,
	...
}
```

- Each operation to be named

```java
public virtual class TriggerOperation {
	public TriggerOperationName name;
}
```

```java
public class QuoteTaxOperation {
	public QuoteTaxOperation (...) {
		this.name = TriggerOperationName.QUOTE_UPDATE_TAX
		...
	}
	
	...
}
```

- A static variable to store disabled operations

```java
public class TriggerOperationManager {
	private static Set<TriggerOperationName> disabledOperations = new List<TriggerOperationName>();
	
	private static Boolean allOperationsDisabled = false;
	
	public static void disableOperation (TriggerOperationName op) {
		disabledOperations.add(op);

	public static void disableAllOperations () {
		allOperationsDisabled = true;
	}
	
	public static boolean isOperationDisabled (TriggerOperation op) {
		return (allOperationsDisabled || disabledOperations.contains(op.name));
	}
}
```

- A check for whether to use that operation

```java
//in TriggerOperationDispatcher
	public TriggerOperationDispatcher addOperation (TriggerOperation op) {
		if (!TriggerOperationManager.isOperationDisabled(op)) operations.add(op);
		return this; //chainable
	}
```

... well, that was pretty easy. We can now exercise fine-grained control over whether to turn things on or off. Want to do that bulk job from anonymous apex? Chuck `TriggerOperationManager.disableAllOperations()` at the top of your script! Of course, you could also create a custom setting so that operations were disabled on certain profiles (such as your data migration user?) or similar.

This demonstrates the power of using object-oriented patterns well. By using inheritance and by having a single shared dispatcher class, we can achieve powerful org-wide changes with only a couple of dozen lines of code.

###Logging

It's obviously good to know what you've done in a transaction. What if we modified these classes to help us do that, even when we've burnt waaaaaaaay past the 2MB logging limit?

You could create a new object called `Operation_Log__c`, and a custom setting called `Operation_Logging_Settings__c` (to temporarily turn on logging per-profile).

Then, create a class called `TriggerOperationLogger` with a private list of `TriggerOperationName` and methods `markAsExecuted` and `logExecution`. At the end of `TriggerOperationDispatcher.dispatch()`, add a call to `logExecution`, and at the end of `TriggerOperation.execute()` add a call to `markAsExecuted`.

Again, you could achieve powerful and flexible logging of trigger operations across the entire org with only a handful of changes.

## Summary

Most of the apex code I've seen fails to leverage even simple object-oriented concepts such as inheritance, but making use them can lead to elegant and powerful designs which save effort and increase maintainability. Give it a try!

Have I got something wrong? [Propose an edit to this page on GitHub](https://github.com/alexander-brett/alexander-brett.github.io/blob/master/_posts/2015-04-24-a-new-pattern-for-apex-triggers.md).
