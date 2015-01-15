---
title: How and why to compress your Salesforce.com profiles
date: 2015-01-15
---

## Why compressing your profiles is a good idea

When handling Salesforce.com metadata, especially attempting to store it in source control, it doesn't take long to notice the following:

 - Profiles are big. In fact, they contain 3-10 lines for every Apex Class, Visualforce Page, Object, Field, App, and so on, and so forth. Before long you've got thousands of lines, which means...
 - It's difficult to commit changes to a profile, because you've got to scroll down to line 10243 to check that that's the change you meant.
 - It takes ages to diff your profiles because they take up many megabytes on disk.
 - Profiles are vulnerable to merge errors because git's standard diff algorithm doesn't respect xml structure, and good luck finding an algorithm which does which can handle such huge files.

I work with a large salesforce installation with about 110 profiles and 30 permissionsets, each of which is some 25,000 lines long, and they take up 120mb on disk. These are real problems for my organisation, and I had to come up with a solution. I realised that there's no reason to have exactly what you retrieve from Salesforce.com stored on disk. You can apply retrieve-time transformations to your code so long as:

 - Whatever you store is still deployable.
 - The tools used to retrieve your metadata are uniform across your organisation.

I write developer tools for my colleagues, so I am in a position to guarantee the latter. As for the former, all you have to do is **remove a lot of line breaks**. The idea is to transform this:

```xml
    <applicationVisibilities>
        <application>Order_Management</application>
        <default>false</default>
        <visible>true</visible>
    </applicationVisibilities>
    <applicationVisibilities>
        <application>SendGrid</application>
        <default>false</default>
        <visible>true</visible>
    </applicationVisibilities>
    <applicationVisibilities>
        <application>Territory_Management</application>
        <default>false</default>
        <visible>true</visible>
    </applicationVisibilities>
    <applicationVisibilities>
        <application>standard__AppLauncher</application>
        <default>false</default>
        <visible>true</visible>
    </applicationVisibilities>
    <applicationVisibilities>
        <application>standard__Chatter</application>
        <default>false</default>
        <visible>true</visible>
    </applicationVisibilities>
    <applicationVisibilities>
        <application>standard__Community</application>
        <default>false</default>
        <visible>true</visible>
    </applicationVisibilities>
    <applicationVisibilities>
        <application>standard__Content</application>
        <default>false</default>
        <visible>true</visible>
    </applicationVisibilities>
```

into this:

```xml
<applicationVisibilities><application>Order_Management</application><default>false</default><visible>true</visible></applicationVisibilities>
<applicationVisibilities><application>SendGrid</application><default>false</default><visible>true</visible></applicationVisibilities>
<applicationVisibilities><application>Territory_Management</application><default>false</default><visible>true</visible></applicationVisibilities>
<applicationVisibilities><application>standard__AppLauncher</application><default>false</default><visible>true</visible></applicationVisibilities>
<applicationVisibilities><application>standard__Chatter</application><default>false</default><visible>true</visible></applicationVisibilities>
<applicationVisibilities><application>standard__Community</application><default>false</default><visible>true</visible></applicationVisibilities>
<applicationVisibilities><application>standard__Content</application><default>false</default><visible>true</visible></applicationVisibilities>
```

The key idea is that each metadata component, whether an application, a custom field, a visualforce page or anything else, gets precisely one line in the resulting document, which means:

 - Any addition, deletion or modification of a component changes exactly one line
 - The addition or removal of lines is guaranteed to result in well-formed XML which is deployable.
 - Merges are much, much easier to perform.
 - Since `git diff` works line-by-line and we're reducing the file from 25,000 to 2,500 lines, we gain a huge increase in efficiency when working with git.
 - We get back about 500kb of disk space per file.

For really tiny Salesforce instances, this might be overkill, but you can see that once you get big enough, this makes a real impact.

##How to do this compression

I produced an extremely simple Perl script to carry out this compression. Why Perl?

 - Unmatched string processing ability
 - Perl 5.8.8 comes bundled with a git installation on windows

Save this file as `profileCompress.pl`:

```perl
BEGIN { $\ = undef; }
s/\r//g;                  # remove all CR characters
s/\t/    /g;              # replace all tabs with 4 spaces
if (/^\s/) {              # ignore the the xml root node
  s/\n//;                 # remove newlines
  s/^    (?=<(?!\/))/\n/; # insert newlines where appropriate
  s/^(    )+//;		      # trim remaining whitespace
}
```

Then every time you do a retrieve, invoke it with `perl -i.bak -p profileCompress.pl src/profiles/*.profile src/permissionsets/*.permissionset`. The obvious disclaimer about backing up your code first because it might get mangled and I can't take any responsibility for that applies!

I handle this by adding 

```xml
<exec executable = "perl">
	<arg value = "-pi.bak"/>
	<arg value = "${lib.dir}/script/profileCompress.pl"/>
	<arg value = "${src.dir}/profiles/*.profile"/>
	<arg value = "${src.dir}/permissionsets/*.permissionset"/>
</exec>
```

to my ant script right after I retrieve, once I've stored all of my stuff inside the folders stored in those variables.