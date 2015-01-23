---
title: Why Perl for Salesforce Tools?
tags: [Perl, SFDC]
---

This explanation is going to take the form of a long story.

When I started writing developer tools for Salesforce.com, I got hold of the ant salesforce deployment library and went wild with it, with the ant `zip` task, loads of `exec` calls to git, and some extreme contortions to allow me to switch manifest files depending on whether we wanted to retrieve everything or just _everything a developer normally needs_. I quickly hit some situations where ant just wasn't expressive enough for my needs:

- Deploying to multiple environments and adding a `-v` for validation flag prompted me to write [this post](http://alexander-brett.co.uk/2014/08/19/Javascript-for-SFDC-Deployments.html) about mixing in some javascript with my ant.
- Our QA org has some different outbound message endpoints from production. Since the GNU coreutils are installed alongside git, using perl for this was a no-brainer:

```xml
<exec executable="perl">
	<arg value="-i.bak"/>
	<arg value="-pe"/>
	<arg value="s/&lt;endpointUrl&gt;https:\\\/\\\/.*\\.sophos\\.com\\\/&lt;endpointUrl&gt;https:\\\/\\\/${endpoint}\/"/>
	<arg value="src/workflows/*.workflow"/>
</exec>
```

Once I'd got over these, I found that I needed to convert a list of files into a `package.xml` file. This turned out to be far too complicated for inline scripting or a perl one-liner, so I wrote a separate javascript file called list2xml.js and called it like:

```xml
<script src="lib/list2xml.js"
            input="${fileList}"
            outputProperty="${xmlBody}" />
```

However, the javascript I wrote for this turned out to have _terrible_ performance. To process a file you need to:

- strip off any `src/` prefix
- split up the file path
- remove the file extension
- get the metadata type (for a folder called `classes/` the metadata type is `ApexClass`, for instance) which is effectively a hash lookup
- store each component name against its metadata type
- dedupe the resulting arrays
- write out the xml string

This is quite a lot of string manipulation and array munging, and javascript is not great at this, especially running in Nashorn/JDK1.8. I had quite a few developers sitting me about how long all this was taking, so eventually I realised I needed to reimplement it in some faster language. Given the performance hit was in string processing, I came to the obvious conclusion: no language has faster string processing than Perl, and all my users already had it installed! The reimplemented list2xml eventually became [manifest.pm](https://github.com/alexander-brett/WWW-SFDC/blob/master/lib/WWW/SFDC/Manifest.pm).

After coming across a few of each of these situations, my codebase was a mess of xml with intermingled javascript, perl system calls, and perl and javascript files. Not only was it inconsistent, it was also entirely untested and essentially untestable, since ant is not designed for heavy lifting and as such has no testing framework, and nor does javascript (well, it probably does, but not a well-known and easy-to-use one). My users were back at my desk demanding fewer bugs.

My boss and I sat down to examine the options: we wanted ease of development and maintenance, high performance and a robust unit testing framework as a minimum. We narrowed the selection down to C# and Perl because of the skills available, and then did a head-to-head on a string processing algorithm; not only did Perl come out conclusively faster, it also had the advantage of not requiring a compilation stage, being usable for our contractors on their macs, and already having critical pain areas implemented in it.

I also found that juggling several different APIs at once was a pleasure using Perl, as was unit testing; I'm feeling pretty happy about the interface I've written to the metadata API, and I'm going to demonstrate some really powerful uses for the other APIs over the next couple of weeks. 

I was pretty apprehensive about Perl before I started to use it in earnest; most of the reactions I get to it are along the lines of "It's a write-only language", "It isn't maintainable", "It's out-of-date" and so on; but I've found that it's quite easy. and in fact quite fun, to write highly performant, highly legible, well-documented and unit tested code.
