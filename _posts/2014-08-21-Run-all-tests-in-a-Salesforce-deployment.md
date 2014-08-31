---
---

# Running all tests during a Salesforce.com deployment

## 21-08-2014

Salesforce.com deployments to a production environment require all unit tests to
be run at the time of deployment, and roll back if any of them encounter an
error. This is a desirable behaviour for a continuous integration environment,
but although the deployment tools provide a `runAllTests = true` option for
sandbox deployments, it has the disadvantage that it runs tests in all
namespaces - and depending how many managed packages you have, that could be a
very lengthy process indeed.

Following on from the last post though, it turns out that there is a way to
achieve exactly this behaviour by gratuitous use of javascript within the ant
deploy script. The idea is this: the SFDC deploy task can have nested `runTest`
elements, but natively in ant we can't dynamically generate them. However, if we
can get a list of test classes, we can use javascript to add them to a
dynamically generated deploy task.

This approach does have limitations: you can only use it when you are deploying
every test class on your org, because this won't run tests which aren't in your
deployment, but it will calculate code coverage based on which tests are run.

I'll start where we left off by defining simple build.xml, build.properties, and
deploy.js files:

###build.xml
~~~xml
<project name="ant javascript example">
  <property file="build.properties"/>
  
  <target name="deploy">
    <deployscript/>
  </target>
  
  <scriptdef name="deployscript"
    language="javascript"
    src="deploy.js"/>
</project>
~~~

###deploy.js
~~~javascript
var env  = project.getProperty("e");
username = project.getProperty(env + ".username");
password = project.getProperty(env + ".password");
url      = project.getProperty(env + ".url");

if (!(username && password && url)) {
  fail = project.createTask("fail");
  fail.setMessage("Either you didn't specify an environment, or the specified "
    + "environment didn't have the correct properties defined in build.properties.local.");
  fail.execute();
}

var task = java.lang.Class.forName("com.salesforce.ant.DeployTask").newInstance();
task.setTaskName("SF deploy");
task.setPassword(password);
task.setUsername(username);
task.setServerURL(url);
task.setDeployRoot("myPkg");
task.setProject(project);
task.setMaxPoll(project.getProperty("sf.maxpoll"));

if (project.getProperty("v")) task.setCheckOnly(true);
if (project.getProperty("t")) task.setRunAllTests(true);

task.execute();
~~~

###build.properties
~~~
dev.username  = user@example.com.dev
dev.password  = passwordToken
dev.serverurl = https://test.salesforce.com

qa.username   = user@example.com.qa
qa.password   = passwordToken
qa.serverurl  = https://test.salesforce.com

prod.username = user@example.com
prod.password = passwordToken
prod.serverurl= https://login.salesforce.com

sf.maxPoll   = 200
~~~

Now, we need a way to find all of the test classes. Since I have grep installed
on my computer and it's a great cross-platform solution, I'll use a quick-and-dirty
grep through the files. This assumes you've got all of your classes on your hard
drive in the src/classes directory, which will be the case if you use the eclipse
Force.com IDE or similar, and/or if you use source control. All tests have to be
denoted with @isTest or testMethod, so I'm going to do a search on those terms.
This would catch any file with testMethod in a comment, for instance, so it's
not perfect, but it's pretty good.

Once we've got that output, we'll store it in a variable to use in our javascript
later on.

###build.xml
~~~xml
<project name="ant javascript example">
  <property file="build.properties"/>
  
  <target name="deploy">
    <exec executable = "grep"
      outputproperty = "testClasses">
      <arg value = "-lEr"/>
      <arg value = "@is[tT]est|test[mM]ethod"/>
      <arg value = "src/classes/"/>
    </exec>
    <deployscript/>
  </target>
  
  <scriptdef name="deployscript"
    language="javascript"
    src="deploy.js"/>
</project>
~~~

If we now dive back into the ant-salesforce.jar source code and look in
com/salesforce/ant/DeployTast.class, there's a class called CodeNameElement, and
a method called addRunTest. These are what we need to use to run the tests. Just
like the DeployTask itself, we can instatiate CodeNameElement with
`java.lang.Class.forName().newInstance()`, and add that instance as a child:

~~~javascript
if (project.getProperty("t")) {
  var tests = (project.getProperty(testClasses)|| '').split("\n"));
  
  tests = tests
    .map   (function(e,i,a) {
      return (m = /(\w+)\.cls/.exec(e)) ? m[0] : e; // get just the test names
    }).filter (function(e,i,a) {
      return e  && a.indexOf(e) == i // uniqueness filter 
    });
  
  for each (test in tests) {
    var codeNameElement = java.lang.Class.forName(
        "com.salesforce.ant.DeployTask$CodeNameElement"
      ).newInstance();
    codeNameElement.addText(test);
    task.addRunTest(codeNameElement);
  }
};
~~~

This is really ready for use at this point, but for my own satisfaction we can
make this even more javascript-oriented. If you crack open lib/ant.jar in your
ant installation, you'll see ExecTask.class halfway down. This is the underlying
class for `<exec/>`, and the only thing different about this class is that in
order to append a child '<arg/>' element, you need to use 'createArg().setValue()'.
Putting this into action, we can finish bringing all the logic into javascript -
this javascript works with the build.xml defined at the top of this post.

###deploy.js
~~~javascript
function getTestClasses(){
	var propertyName = "testClassesList";
	var exec = project.createTask("exec");
	exec.setExecutable("grep");
	exec.setOutputproperty(propertyName);
	
	exec.createArg().setValue("-lEr");
	exec.createArg().setValue("@is[tT]est|test[mM]ethod");
	exec.createArg().setValue("src/classes/");
	exec.execute();
	
	var result = project.getProperty(propertyName);
	return (typeof result == "string" ? result.split("\n") : [])
		.map   (function(e,i,a){ return (m = /(\w+)\.cls/.exec(e)) ? m[0] : e;})
		.filter(function(e,i,a){ return a.indexOf(e) == i });
}

(function main(){
  var env  = project.getProperty("e");
  username = project.getProperty(env + ".username");
  password = project.getProperty(env + ".password");
  url      = project.getProperty(env + ".url");
  
  if (!(username && password && url)) {
    fail = project.createTask("fail");
    fail.setMessage("Either you didn't specify an environment, or the specified "
      + "environment didn't have the correct properties defined in build.properties.local.");
    fail.execute();
  }
  
  var task = java.lang.Class.forName("com.salesforce.ant.DeployTask").newInstance();
  task.setTaskName("SF deploy");
  task.setPassword(password);
  task.setUsername(username);
  task.setServerURL(url);
  task.setDeployRoot("myPkg");
  task.setProject(project);
  task.setMaxPoll(project.getProperty("sf.maxpoll"));
  
  if (project.getProperty("v")) task.setCheckOnly(true);
  
  if (project.getProperty("t")) {
    for each (test in getTestClasses()) {
      var codeNameElement = java.lang.Class.forName(
          "com.salesforce.ant.DeployTask$CodeNameElement"
        ).newInstance();
      codeNameElement.addText(test);
      task.addRunTest(codeNameElement);
    }
  };
  
  task.execute();
}());
~~~
