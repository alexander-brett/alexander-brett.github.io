---
title: 'How to not suck at using async/await in C#'
tags: [CSharp]
---

In 2012 Microsoft released C# 5.0, which [introduced the async and await keywords](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-version-history#c-version-50):
> C# changed the game again by baking asynchrony into the language as a first-class participant

This is the future. Not only are other major languages following C#'s lead in implementing the [Task Asynchrony Pattern](https://docs.microsoft.com/en-us/dotnet/standard/asynchronous-programming-patterns/task-based-asynchronous-pattern-tap), but more and more C# libraries are being written in a way that takes advantage of Tasks to offer non-blocking APIs - not least System.HttpClient. Programming using TAP can make better use of resources by allowing methods to yield threads to other tasks when blocked, and it can make callback and promise based programming vastly easier to write, read and understand. To get more of an idea of what [teary-eyed idealogues](https://www.red-gate.com/simple-talk/dotnet/net-framework/the-net-4-5-asyncawait-feature-in-promise-and-practice/) are saying, read [some best practices](https://msdn.microsoft.com/en-us/magazine/jj991977.aspx) - and then take a step back.

The async/await keywords and tasks are by no means trivial to get right. There are some obvious and slightly less obvious pitfalls which you'll want to avoid, and this blog post is the crash course you need to avoid embarrassing yourself at work, and have developers who have spent the last 25 years bashing their heads against explicit threading deadlocks go off on boring rants at you about how these newfangled language features will get us all in trouble...

Here is what you need to know.

## 1. Consider whether you need TAP, and integrate it thoughtfully if you do

Asynchronous and parallel programming can be harder than it's worth. The Task Parallel Library often does not play well with legacy code at all, since many of the easy mistakes fall at the boundary between Task-based and non-Task-based code, and juggling threads AND tasks can become a headache really fast.

However, if you have decided that callback- or promise-based or parallel programming is a benefit in your new (or relatively small) application, do prefer the TPL over explicit threads! Your code will be much simpler to understand, and much much easier to test. The ideal situation is an app that has been designed from the ground up as a series of asynchronous operations, for instance a data pipeline or server.

## 2. Understand the difference between single- and multiple-threaded schedulers

The TPL uses a Task Scheduler to keep track of which tasks are waiting and in progress at any time, and kick off waiting tasks when possible. Task Schedulers operate in two modes: single and multiple-threaded. In UI applications and ASP.net servers, the main thread operates in a Single Thread Apartment, which means that the Task Scheduler will only schedule tasks on the main thread. When there is only one thread to share between all scheduled tasks, it is much easier to deadlock than if there are multiple threads kicking around: in fact, without taking great care, this will happen a great deal!

This demands that you be aware of what mode the code you're writing will run in - and you must bear in mind that if you're writing library code of any time, it's almost certain that down the line it will be consumed in a single-threaded environment.

## 3. Recognise the classic TPL single-threaded deadlock

The [single](https://blog.stephencleary.com/2012/07/dont-block-on-async-code.html) [most](https://olitee.com/2015/01/c-async-await-common-deadlock-scenario/) [talked](https://social.technet.microsoft.com/wiki/contents/articles/23103.c-avoiding-deadlock-in-asyncawait.aspx) [about](https://www.filipekberg.se/2013/04/03/dont-deadlock-with-async-and-await/) [issue](https://medium.com/bynder-tech/c-why-you-should-use-configureawait-false-in-your-library-code-d7837dce3d7f) in the Thread Parallel Library is how easy it is to cause a deadlock in a single-threaded scheduler. For an in-depth explanation, you can read any of those blog posts, but the basic idea is that the UI thread schedules a task to be run on the first free thread and then blocks to wait for it - consuming the only available thread!

The solution in every case that this comes up is to ensure that the continuation (the part of the code after the asynchronous call) is permitted to run in a different context from async call itself.

In order to demonstrate this, we will use the DedicatedThreadSynchronisationContext [from this StackOverflow post](https://stackoverflow.com/questions/1882417/looking-for-an-example-of-a-custom-synchronizationcontext-required-for-unit-tes/31714115#31714115) which reproduces the single-threaded behaviour of UI apps, and allows us to put it under a microscope in some unit tests. With that class in the solution, consider the following code:

```csharp
private static async Task DelayAsync() => await Task.Delay(100);

[Test, Timeout(200)]
public static void ThisWorksFineHonest()
{
    DelayAsync().Wait();
}
```

Because this test is running in a multiple-threaded environment, everything goes fantastically, and the test passes. However, when we queue it on the single-threaded synchronisationcontext, it fails:

```csharp
// thanks to https://stackoverflow.com/questions/40343572/simulate-async-deadlock-in-a-console-application
[Test, Timeout(200)]
public static void DemonstrateFailure()
{
    new DedicatedThreadSynchronisationContext().Send(state =>
    {
        DelayAsync().Wait();
    }, null);
}
```

## 4. Torture test every single async method you write by unit testing it in a single-threaded schedulers

Given we have a way to tame the beast, create a TestHarness:

```csharp
public static void TestAsyncBehaviour(Func<Task> test)
{
    new DedicatedThreadSynchronisationContext().Send(state =>
    {
        test().Wait();
    }, null);
}
```

Now, if the test passes here, we're safe. From here on, all the code examples will use this helper method. In your codebase, you can avoid embarrassing moments by using something like this religiously, and certainly when you think you might want to blame something on Task library counter-intuitiveness it should now be easy reproduce.

## 5. Avoid deadlocks by removing the async and await keywords when redundant

```csharp
public static class AvoidDeadlockByNotUsingAwaitWhenUnneccesary
{
    private static async Task DelayAsync() => await Task.Delay(100);

    [Test, Timeout(200)]
    public static void DemonstrateDeadlock()
    {
        TestHarness.TestAsyncBehaviour(DelayAsync);
    }

    private static Task DelayTask() => Task.Delay(100);

    [Test, Timeout(200)]
    public static void DemonstrateNoDeadlock()
    {
        TestHarness.TestAsyncBehaviour(DelayTask);
    }
}
```

In DemonstrateDeadlock, the use of the await keyword attempts to capture context and yield, while the thread is blocked. This is exactly the deadlock outlined above, but in the second example we fix the deadlock simply by removing unnecessary keywords! The moral of the story - don't use `return await` unless you have enough experience with TPL to know that that's exactly, specifically, precisely what you want. It almost never is.

## 6. Avoid deadlocks by using ConfigureAwait(false)

In the previous example we avoided capturing the context by avoiding the await keyword: in this example, we'll do it by telling the scheduler explicitly that we don't need it.

'''csharp
class AvoidDeadlockByUsingConfigureAwait
{
    private static async Task<object> DelayAsync()
    {
        await Task.Delay(100);
        return new object();
    }

    [Test, Timeout(200)]
    public static void DemonstrateDeadlock()
    {
        TestHarness.TestAsyncBehaviour(DelayAsync);
    }

    private static async Task<object> DelayWithConfigureAwait()
    {
        await Task.Delay(100).ConfigureAwait(false);
        return new object();
    }

    [Test, Timeout(200)]
    public static void DemonstrateNoDeadlock()
    {
        TestHarness.TestAsyncBehaviour(DelayWithConfigureAwait);
    }
}
'''

[this is why](http://blog.stephencleary.com/2012/02/async-and-await.html#avoiding-context) - in fact the whole article is a really great read.

## 7. Understand that await is more-or-less equivalent to ContinueWith()

The following two tests do effectively the same thing - (here is a more detailed blog post about it)[https://blogs.msdn.microsoft.com/pfxteam/2012/01/20/await-synchronizationcontext-and-console-apps/].

```csharp
class AwaitVersusContinueWith
{
    private static Task Method1()
    {
        Console.WriteLine("Method1");
        return Task.Delay(10);
    }

    private static Task Method2()
    {
        Console.WriteLine("Method2");
        return Task.Delay(10);
    }

    [Test]
    public static async Task DemonstrateAwait()
    {
        await Method1();
        await Method2();
    }

    [Test]
    public static async Task DemonstrateContinueWith()
    {            
        await Method1().ContinueWith(task => Method2());
    }
}
```

## 8. Avoid deadlocks by using Continuewith()

This, then, is pretty much the same advice as \#1 - remove the await point and the problem disappears:

```csharp
class RemoveDeadlockByUsingContinueWith
{
    private static async Task<object> DelayAsync()
    {
        await Task.Delay(100);
        return new object();
    }

    [Test, Timeout(200)]
    public static void DemonstrateDeadlock()
    {
        TestHarness.TestAsyncBehaviour(DelayAsync);
    }

    private static Task<object> DelayContinuation()
        => Task.Delay(100).ContinueWith(task => new object());

    [Test, Timeout(200)]
    public static void DemonstrateNoDeadlock()
    {
        TestHarness.TestAsyncBehaviour(DelayContinuation);
    }
}
```

## 9. Realise that Tasks are more synchronous than you think

This is known as [the fast path](https://blogs.msdn.microsoft.com/lucian/2011/04/15/async-ctp-refresh-design-changes/). Essentially, a lot of the time when you call a Task method, some or all of the continuations will execute synchronously, depending on exactly what's going on. `await Task.CompletedTask` will execute synchronously, and if you only have an await keyword halfway down a method, the first lines will execute synchronously before the task yields. If you have a `TaskCompletionSource` and call `SetResult` on it, and there is one continuation associated with the task, then _unless_ you set `TaskContinuationOptions.RunContinuationsAsynchronously` the continuation will probably run synchronously.

If exactly which lines of code execute synchronously or otherwise matters in the application you're writing, it's worth spending a few hours getting a feel for which situations are and are not synchronously executed. In a debugger, you can step through a synchronous chain of operations until it ends, which can be very instructive! Until then, just be careful not to assume that anything you awaited is automatically happening in parallel.

## 10. Handle exceptions well

Sometimes it's not obvious exactly when an exception will be thrown, but it is very importantn to avoid unobserved exceptions. For example, all of the following tests pass:

```csharp
class DoNotSwallowExceptions
{
    public static async Task ThrowException()
    {
        await Task.Delay(10).ConfigureAwait(false);
        throw new Exception();
    }

    [Test]
    public static void DoesNotThrowWhenAsynchronous()
    {
        Assert.DoesNotThrow(() => ThrowException());
    }

    [Test]
    public static void HaveToWaitToGetAnException()
    {
        Assert.Throws<AggregateException>(() => ThrowException().Wait());
    }

    public static async Task ThrowExceptionBeforeAwaiting()
    {
        if ("1".Equals(1.ToString())) throw new Exception();            
        await Task.Delay(10).ConfigureAwait(false);
    }

    [Test]
    public static void DoesNotThrowWhenHappensToBeAsynchronous()
    {
        Assert.DoesNotThrow(() => ThrowExceptionBeforeAwaiting());
    }

    public static Task ThrowExceptionSynchronouslyReturnTask()
    {
        if ("1".Equals(1.ToString())) throw new Exception();            
        return Task.Delay(10);
    }

    [Test]
    public static void ThrowsExceptionWhenHappensToBeSynchronous()
    {
        Assert.Throws<Exception>(() => ThrowExceptionSynchronouslyReturnTask());
    }
}
```
