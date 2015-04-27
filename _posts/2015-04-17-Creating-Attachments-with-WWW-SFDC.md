---
title: Creating attachments with WWW::SFDC
tags: [SFDC,Perl]
---

At my company, we have a problem with attachments; namely, one of the things we have to do most releases is update some mail merge templates which are stored as attachments against Salesforce records. Historically, this has been a great cause for error; at some point the release manager ends up with a sea of .docx files in some directory or other, having to remember which ones she's already uploaded, which ones need to be uploaded against which records, and so on.

Checking these files into source control helped; now, instead of a soup of randomly named files kicking around, at least she knows she has the latest version, and has an easy way to ascertain which ones have changed. It's still a tedious and error-prone manual process though, and one slip-up means that a distributor recieves a million dollars worth of junk on their license schedule.

Fortunately, the correct automation solution is at hand: WWW::SFDC to the rescue. Let's imagine we've been sensible and we've stored a load of .docx and .xslx files inside source control already, and with even more foresight, we have named each file the same as the `Name` on the `Doc_Template__c` record against which we need to store them. What we need to do is `create` `Attachment` records for each changed document against each relevent record.

1. get the changed files:

```sh
git diff --name-only --diff-filter=AM --relative attachments/Doc_Template__c/
# Or, if you'd rather just have everything (for instance, populating a new sandbox)
git ls-files attachments/Doc_Template__c/
```

2. basic perl script setup, including making sure creds are set up:

```perl
use strict;
use warnings;
use Getopt::Long;
use WWW::SFDC::Partner;
use File::Slurp 'read_file';

my %creds = (
  url => 'https://login.salesforce.com'
);

GetOptions
  'p|password:s'    => \$creds{password},
  'url:s'           => \$creds{url},
  'u|username:s'    => \$creds{username};
  
WWW::SFDC::Partner->instance(creds=>\%creds);
```

3. read in the changed files, checking that they exist and trimming whitespace:

```perl
my @filenames = grep {chomp and -e } <>;

exit unless scalar @filenames; # if there aren't any, we have no work to do.
```

4. parse the filenames and read the files. We'll store the file contents as base64-encoded data which is what the Salesforce.com partner API expects up to provide in the body field. Fortunately, SOAP::Lite makes this a breeze, via the SOAP::Data->type() method.

```perl
my @documents = map {
  /([^\/]*)\.(docx|xlsx)$/
    ? +{                             # +{} forces this to be a hashref, rather than an arbitrary code block
        name => $1,
        extension => $2,
        body => SOAP::Data->name(
                body => read_file $_ # read_file is exported by File::Slurp and does what it says on the tin
            )->type('base64')        # prepackaged SOAP::Lite magic.
      }
    : ();                            # return empty list. 
} @filenames;
```

5. we need the IDs of the `Doc_Template__c` records to store these against, so we'll start by constructing a where clause.

```perl
my $whereClause = join " OR ", map { "Name='$$_{name}'" } @documents; # that was easy
```

6. ...and we'll go and execute that query.

```perl
my @parentRecords = WWW::SFDC::Partner->instance()->query(
  "SELECT Id, Name FROM Doc_Template__c WHERE $whereClause"
);
```

7. We're going to need to look up IDs from the name, so we'll create a hash:

```perl
my %parentIds = map { $_->{Name} => $_->{Id} } @parentRecords;
```

8. The interesting bit. From each document, create an `Attachment` suitable for passing into a `create` call.

```perl
my @recordsToCreate = map {
    $parentIds{$_->{name}} # check that the record exists;
    ? +{
        type => 'Attachment',
        ParentId => $parentIds{$_->{name}},
        name => "$$_{name}.$$_{extension}",
        body => $_->{body},
    }
    : ()
} @documents;
```

9. Wrap it all up with a create call

```perl
WWW::SFDC::Partner->instance()->create(@recordsToCreate);
```

10. Put it all together (tada!):

```sh
git diff --name-only --diff-filter=AM --relative attachments/Doc_Template__c/^
 | perl automagic_attachments.pl -u myUsername -p passwordPlusToken
```

Now, this may feel trivial. However, having repeatable, automatic, guaranteed-error-free deployments of templates every month saves up hours of effort on release day, and hours of tracking down bugs later on.
