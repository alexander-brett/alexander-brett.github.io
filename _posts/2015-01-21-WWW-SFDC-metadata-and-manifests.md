---
title: WWW::SFDC - Metadata, Manifests and Zip Files
tags: [Perl, SFDC]
---

In my last post I provided a brief introduction to [WWW::SFDC](https://github.com/alexander-brett/WWW-SFDC), a Perl wrapper around Salesforce's API interfaces. Today I thought I'd look slightly more in-depth at [WWW::SFDC::Metadata](https://github.com/alexander-brett/WWW-SFDC/blob/master/lib/WWW/SFDC/Metadata.pm), [WWW::SFDC::Manifest](https://github.com/alexander-brett/WWW-SFDC/blob/master/lib/WWW/SFDC/Manifest.pm), and [WWW::SFDC::Zip](https://github.com/alexander-brett/WWW-SFDC/blob/master/lib/WWW/SFDC/Zip.pm), and how they interact with each other.

The motivation for including the Manifest and Zip modules in addition to the core API interaction modules was that even after a mechanism is provided for interfacing with the metadata API, the fact remains that `deploy` and `retrieve` accept and return `.zip` files as base64-encoded strings, and `deploy` requires a `package.xml` file which is populated according to a stringent set of rules, and so on: writing the logic around these has consumed a large proportion of my time as a tooling developer, and will be the same for every use case, so it makes sense to tie these in to the API interface.

The idea behind the Manifest object is to make it extremely easy to juggle lists of files, `package.xml` manifest files, and the inputs and outputs of the metadata API  calls. For instance, the simplest way to generate empty manifest files is now:

```perl
WWW::SFDC::Manifest->new()->writeToFile('src/package.xml');
```

If we want to generate a custom package based on a list of modified files can look something like this:

```perl
my @filesToAdd = `git diff --name-only release master`;
WWW::SFDC::Manifest->new()->addList(@filesToAdd);
```

The last major problem that this package solves is the generation of a list of files, given a package, bearing in mind that certain metadata types require `-meta.xml` files, and others are in folders. To build a valid `.zip` file for deployment, you need to know _exactly_ which files to include, and you can do this thus:

```perl
WWW::SFDC::Zip::makezip(
  'src/',
  WWW::SFDC::Manifest->new()->readFromFile('src/package.xml')->getFileList(),
  'package.xml';
);
```

This object then plays extremely well with the metadata API functions. If you want to retrieve every file in your org, you'd normally need to write out a `package.xml` including every document and email template you cared about. With the `listMetadata` call, you can just list the folders you care about, and you can chain this call with the appropriate manifest methods, to get extremely powerful one-liners such as:

```perl
WWW::SFDC::Zip::unzip(
  'src/',
  WWW::SFDC::Metadata->instance()->retrieveMetadata(
    WWW::SFDC::Manifest->new()->readFromFile('manifests/basic.xml')->add(
      WWW::SFDC::Metadata->instance()->listMetadata(
        {type => 'Document', folder => 'Developer_Documents'},
        {type => 'Document', folder => 'Documents'},
        {type => 'Document', folder => 'Invoices'},
        {type => 'Document', folder => 'Lead_Images'},
        {type => 'Document', folder => 'Logos'},
        {type => 'Document', folder => 'Tab_Images'},
        {type => 'EmailTemplate', folder => 'Asset'},
        {type => 'EmailTemplate', folder => 'Contact_User'},
        {type => 'EmailTemplate', folder => 'Error_Reporting'},
        {type => 'EmailTemplate', folder => 'Marketing_Templates'},
        {type => 'EmailTemplate', folder => 'Support_Templates'},
        {type => 'Report', folder => 'Merge_Reports'},
        {type => 'Report', folder => 'Finance_Reports'},
      )
    )->manifest()
  )
);
```

And once you've done this, you can deploy them all again like this:

```perl
WWW::SFDC::Metadata->instance()->deployMetadata(
  WWW::SFDC::Zip::makezip(
    'src/',
    WWW::SFDC::Manifest->new()->readFromFile('src/package.xml')->getFileList(),
    'package.xml';
  ),
  {
    singlePackage => 'true',
    $IS_VALIDATE ? checkOnly => 'true' : (),
    rollbackOnError => 'true',
  }
);
```

Of course, if you dynamically regenerate your `package.xml`, you probably won't check it into source control, and you don't want to take it as the truth when working out what to deploy. I actually construct my zip file like this:

```perl
WWW::SFDC::Zip::makezip(
  'src/',
  WWW::SFDC::Manifest->new()->addList(`git ls-files src/`)->getFileList(),
  'package.xml';
);
```

One final element of note is that `WWW::SFDC::Zip::unzip` accepts an optional third parameter: a function reference, applied to each file retrieved before being written to disk. I use this to achieve profile compression (see my recent post on that topic) like this:

```perl
sub _compressProfile {
  my $content = shift;
  my @lines = split /^/, $content;
  for (@lines) {
    s/\r//g;			            # remove all CR characters
    s/\t/    /g;		          # replace all tabs with 4 spaces
    if (/^\s/) {		          # ignore the the xml root node
      s/\n//;                 # remove newlines
      s/^    (?=<(?!\/))/\n/;	# insert newlines where appropriate
      s/^(    )+//;		        # trim remaining whitespace
    }
  }
  return join "", @lines;
}

sub _retrieveTimeMetadataChanges {
  my ($path, $content) = @_;
  $content = _compressProfile $content if $path =~ /\.profile|\.permissionset/;
  return $content
}

MAIN: {
  WWW::SFDC::Zip::unzip(
    'src/',
    WWW::SFDC::Metadata->instance()->retrieveMetadata($manifest->manifest()),
    &_retrieveTimeMetadataChanges
  );
}
```

I think that covers the main uses for those modules, and to those like me who have been grappling for months with the quirks of the ant deployment tool, the benefits of using a real programming language to achieve these tasks with minimum fuss are really obvious.
