---
title: Writing Salesforce ant deployment tasks using Javascript
date: 2014-08-19
---
#Writing Salesforce ant deployment tasks using Javascript

##19-08-2014

The Force.com deployment tool is a .jar file defining some extra tasks such as `sf:deploy`
and `sf:retrieve`. Examining the example build.xml file we see several calls of the form:

~~~xml
<sf:retrieve 
    username="${sf.username}"
    password="${sf.password}"
    serverurl="${sf.serverurl}"
    maxPoll="${sf.maxPoll}"
    retrieveTarget="retrieveOutput"
    packageNames="MyPkg"/>
    
<sf:bulkRetrieve
    username="${sf.username}"
    password="${sf.password}"
    serverurl="${sf.serverurl}"
    maxPoll="${sf.maxPoll}"
    metadataType="${sf.metadataType}"
    retrieveTarget="retrieveUnpackaged"/>
~~~
In a mature development team with several different sandboxes, you may end up wanting to
retrieve and deploy from any of several different sandboxes, with or without the bulk API,
with or without running all tests[^1]. If you tried to use ant to write logic to decide
between them, you'd end up with a great many targets, each with only a slight permutation
to the others. What we want to do is make these decisions using Javascript, which will
make the code shorter, easier-to-read, and more flexible. We'll use JDK1.8, and specifically
the Nashorn Javascript engine.

Let's start with the simplest possible build.xml file:

~~~xml
<project name="ant javascript example">
    <property file="build.properties"/>
    <target name="deploy">
        <sf:deploy 
            username="${sf.username}"
            password="${sf.password}"
            serverurl="${sf.serverurl}"
            maxPoll="${sf.maxPoll}"
            deployRoot="mypkg"
            rollbackOnError="true"/>
    </target>
</project>
~~~

and a similarly trivial build.properties file:

~~~
sf.username  = user@example.com
sf.password  = passwordToken
sf.serverurl = https://login.salesforce.com
sf.maxPoll   = 200
~~~

The first thing I want to do is add an optional 'validate' flag to my deployment such that when it is set, we only perform a dry-run. The idea is that when you call `ant deploy -Dv=1` the deploy task gets the `checkonly="true"` attribute added. One way to do this natively is:

~~~xml
<project name="ant javascript example">
    <property file="build.properties"/>
    <target name="deploy"
            depends="dryrun,wetrun" >
    </target>
    
    <target name="dryrun"
            if="v">
        <sf:deploy 
            username="${sf.username}"
            password="${sf.password}"
            serverurl="${sf.serverurl}"
            maxPoll="${sf.maxPoll}"
            deployRoot="mypkg"
            checkonly="true"/>
    </target>
    
    <target name="wetrun"
            unless="v">
        <sf:deploy 
            username="${sf.username}"
            password="${sf.password}"
            serverurl="${sf.serverurl}"
            maxPoll="${sf.maxPoll}"
            deployRoot="mypkg"/>
    </target>
</project>
~~~

This code is over twice as long, and it's much harder to follow the flow of what's happening,
and if I subsequently need to add another flag such as `-Dt=1` to add `runAllTests = "true"`,
I'll double my code again[^2]. Luckily, ant has our back. 

Let's rip open ant-salesforce.jar and see what's inside:

* com
    * salesforce
        * ant
            * BulkRetrieveTask
            * CompileAndTest
            * Configuration
            * ConnectionFactory
            * DeployTask
            * DescribeMetadataTask
            * ListMetadataTask
            * RetrieveTask
            * SFDCAntTask
            * SFDCMDAPIAntTask
            * SFDCMDAPIAntTaskRunner
            * ZipUtil

`DeployTask` looks quite promising, and we can easily ascertain that `DeployTask` extends
`SFDCMDAPIAntTask`, which extends `SFDCAntTask`, which extends `Task`,
and glancing through those classes to find appropriate getters and setters, we can write:

~~~xml
<project name="ant javascript example">
    <property file="build.properties"/>
    
    <target name="deploy">
        <deployscript/>
    </target>
    
    <scriptdef name="deployscript" language="javascript">
      var task = java.lang.Class.forName("com.salesforce.ant.DeployTask").newInstance();
      task.setTaskName("SF deploy");
      task.setPassword(project.getProperty("sf.password"));
      task.setUsername(project.getProperty("sf.username"));
      task.setServerURL(project.getProperty("sf.serverurl"));
      task.setDeployRoot("myPkg");
      task.setProject(project);
      task.setMaxPoll(project.getProperty("sf.maxpoll"));
      
      if (project.getProperty("v")) task.setCheckOnly(true);
      if (project.getProperty("t")) task.setRunAllTests(true);
      
      task.execute();
    </scriptdef>
</project>
~~~
Now it's clear how we can improve and extend this functionality: next, let's imagine that we might want to deploy to any of arbitrarily many environments (for instance, you're a sysadmin with dev, QA, and production instances). We want to be able to call `ant deploy -De=<env>`. Let's rewrite our build.properties file...

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

...and adapt our deploy task to use this new format:

~~~xml
<project name="ant javascript example">
    <property file="build.properties"/>
    
    <target name="deploy">
        <deployscript/>
    </target>
    
    <scriptdef name="deployscript" language="javascript">
      <![CDATA[
        var env  = project.getProperty("e");
        username = project.getProperty(env + ".username");
        password = project.getProperty(env + ".password");
        url      = project.getProperty(env + ".url");
        
        if (!(username && password && url)) {
            fail = project.createTask("fail");
            fail.setMessage("Either you didn't specify an environment, or the specified "
              + "environment didn't have the correct properties defined in "
              + "build.properties.local.");
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
      ]]>
    </scriptdef>
</project>
~~~

There are lots of other options to be explored here, but I think this should provide a solid starting point for making powerful deployment scripts that help get the job done.


[^1]: By default the run all tests flag is quite broken when you have managed packages, in that it runs tests from all namespaces. I'll write up a solution to that issue in a later post.

[^2]: There is a more efficient and complicated way to do this by setting extra properties using `<condition/>`, but javascript still beats it.