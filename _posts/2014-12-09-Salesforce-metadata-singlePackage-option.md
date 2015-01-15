---
title: The singlePackage option in Salesforce.com metadata deployments
date: 2014-12-09
---

I've been working on a metadata client application for Salesforce.com to completely replace ant, because once you reach a certain level of complexity, ant really doesn't cut it anymore! However, I found that when deploying a large .zip file (130MB of data compressed to 19MB using deflate with compression level 9) my deployments were taking far, far longer than the equivalent ant deployment of the same files.

In fact, the deployment would hang in the 'waiting' status for over an hour before starting to make progress. I finally found the solution by essentially iterating over every combination of deployment options in my SOAP call, and thought I'd write a quick post in case anybody else needs to fix the issue.

The problem occurred when deploying a package using this file structure, without the singlepackage option set.

```
zip root
|  unpackaged
|  |  classes
|  |  | files
|  |  | ...
|  |  triggers
|  |  | files
|  |  | ...
|  |  ...
|  |  package.xml
```

I found that by setting singlePackage=true and re-arranging the zip file as follows, I was able to completely eliminate the time spent hung in 'waiting'.

```
zip root
|  classes
|  | files
|  | ...
|  triggers
|  | files
|  | ...
|  ...
|  package.xml
```

I hope somebody else stumbling across this issue finds this and it helps!