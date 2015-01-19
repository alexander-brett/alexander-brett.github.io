---
title: Introducing WWW::SFDC - a perl module for Salesforce.com interactions
tags: [SFDC, Perl]
---

I've been working with the 'Force.com migration tool' - an ant wrapper around the Metadata API - for almost a year now, and I've been getting increasingly more frustrated with attempting to coerce ant (a tool for compiling java code) to be a deployment, retrieval, and git integration controller. It just isn't meant for that purpose!

This means that when I have a list of EmailTemplate folders and want to retrieve all the templates within them, I have to spend 200 lines of xml to:

 - use some inline javascript to get the login credentials from a file depending which environment is specified
 - call a cSharp executable to ascertain whether the login credentials are valid, otherwise the user will get frozen out of Salesforce.com because of too many failed login attempts
 - call listMetadata once for each folder, which outputs the results to a file
 - call a perl script to parse those files
 - call another perl script to write the manifest file
 - call retrieve (finally!)

This is a terrible way to operate for any organisation moderately invested in getting a proper handle on SFDC metadata, and is also really difficult to test in any meaningful manner.

The issues I was having with ant inspired me to write a new perl module, [WWW::SFDC](https://github.com/alexander-brett/WWW-SFDC), for interacting with Salesforce.com APIs. The aim is to provide Do-What-I-Mean wrappers around all of the SFDC APIs, such that they all work together and achieving moderately complicated interactions is as quick and easy as possible. The module is only about 40% complete, if you consider 'complete' to mean 'has a wrapper around every function in the Partner, Metadata and Tooling API and is unit tested', but it's got enough to achieve some seriously useful stuff. For instance, the above-mentioned retrieve task can now be accomplished like this:

```perl
WWW::SFDC::Metadata->instance(
    password  => $password,
    username  => $username,
    url       => $url
);

WWW::SFDC::Zip::unzip(
	"src",
	WWW::SFDC::Metadata->instance()->retrieveMetadata(
		WWW::SFDC::Manifest->new()->add(
			WWW::SFDC::Metadata->instance()->listMetadata(
				{type => 'Document', folder => 'Apps'},
				{type => 'Document', folder => 'Developer_Documents'},
				{type => 'Document', folder => 'Documents'},
				{type => 'EmailTemplate', folder => 'Sales_Templates'},
				{type => 'Report', folder => 'Merge_Reports'},
			)
		)
	)
);
```

...which I think is pretty neat. There are some basic examples in [SFDC.pm](https://github.com/alexander-brett/WWW-SFDC/blob/master/lib/WWW/SFDC.pm), and I intend to make some blog posts demonstrating things that I already use this module for. I'm not planning to release in on CPAN until it's more complete, but it is installable from git.

Note that it also currently has a dependency on [Logging::Trivial](https://github.com/alexander-brett/Logging-Trivial): I'm not sure what I'm going to do with this, since it's difficult to differentiate Logging::Trivial amongst all the other logging modules, but it is my favourite! I may eventually rename Logging::Trivial, or change the logging engine to Logging::Minimal.
