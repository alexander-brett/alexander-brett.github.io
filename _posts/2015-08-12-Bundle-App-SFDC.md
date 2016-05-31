---
title: Bundling App::SFDC for fun and profit
tags: [SFDC,Perl]
---

## Motivation

Whilst installing perl and App::SFDC along with a (quite large) number of dependancies is fun, effective and powerful, it's not always the best solution for Salesforce deployment tools. When you're deploying from throwaway AWS instances or sending your tools to developers in foreign countries who want something that just works now, you may want to provide a ready-to-go bundle of code. Fortunately, programs such as [PerlApp](http://docs.activestate.com/pdk/9.4/PerlApp.html) provide a pretty good way to achieve this.

I'm going to run through how to bundle App::SFDC to a standalone .exe suitable for deploying and retrieving metadata on a windows machine.

## Introduction to PerlApp

The idea behind PerlApp is pretty straightforward: you point it at a script, and it calculates the module dependancies and bundles the perl interpreter along with all required modules into a .exe, which can then be run without a local perl installation - essentially, you run `perlapp --exe SFDC.exe C:\perl64\site\bin\SFDC.pl` .

## Loading prerequisites

Of course, when you do this and run the resulting executable, there are some modules missing - it's hard to detect all of the prerequisites, especially when they're being dynamically loaded in. Examples of this are that [WWW::SFDC](http://search.cpan.org/~abrett/WWW-SFDC/lib/WWW/SFDC.pm) loads in modules by running:

``` perl
for my $module (qw'
    Apex Constants Metadata Partner Tooling
'){
    has $module,
      is => 'ro',
      lazy => 1,
      default => sub {
        my $self = shift;
        require "WWW/SFDC/$module.pm"; ## no critic
        "WWW::SFDC::$module"->new(session => $self);
      };
  }
```

In a similar way, when you create a screen appender for [Log::Log4perl](http://search.cpan.org/~mschilli/Log-Log4perl-1.46/lib/Log/Log4perl.pm) , it quietly loads in Log::Log4perl::Appender::Screen. To fix this sort of issue, we add a few more arguments to perlapp:

``` shell
perlapp  --add MooX::Options::Role^
 --add App::SFDC::Role::^
 --add Log::Log4perl::Appender::Screen^
 --add WWW::SFDC::^
 --exe SFDC.exe C:\perl64\site\bin\SFDC.pl
```

## Fixing SSL certification

Perl isn't great at picking up a system's SSL settings, especially installed certificates - and when the entire purpose of a script is to send HTTPS requests, it's something that you just have to get right - lest you get errors like `500 C:\Users\ALEXAN~1\AppData\Local\Temp\pdk-alexanderbrett/Mozilla/CA/cacert.pem on disk corrupt at /<C:\Dev\App-SFDC\SFDC.exe>WWW/SFDC.pm line 66.`.

One successful workaround I've found to this sort of error, which works whenever curl is installed, is to use curl's Certificate Authority file instead of perl's. You can find this by running `curl -v https://login.salesforce.com >nul` and looking for the lines like:

```
* successfully set certificate verify locations:
*   CAfile: C:\Program Files (x86)\Git\bin\curl-ca-bundle.crt
```

Then, you set `HTTPS_CA_FILE=C:\Program Files (x86)\Git\bin\curl-ca-bundle.crt` and your HTTPS connections start working again. This amount of manual faffing around is more than most developers or AWS images want to do, and fortunately PerlApp has our back again - we can bind in arbitrary files, and specifiy arbitrary environment variables. Let's add more arguments to perlapp:

```
...
--bind certs/cafile.crt[file="C:\Program Files (x86)\Git\bin\curl-ca-bundle.crt",text,mode=666]^
--env HTTPS_CA_FILE=certs/cafile.crt^
...
```

## Binding Retrieve plugins

Since we're going to be wanting to use [App::SFDC::Command::Retrieve](http://search.cpan.org/~abrett/App-SFDC-Metadata-0.19/lib/App/SFDC/Command/Retrieve.pm), we need to make sure the plugins and manifests mentioned are, in fact, included. By default they are installed to the perl `share/` location, and PerlApp won't see them! This is how to bind in the default values:

```
...
--bind manifests/base.xml[file=C:\perl64\site\lib\auto\Share\dist\App-SFDC-Metadata\manifests\base.xml,text,mode=666]^
--bind manifests/all.xml[file=C:\perl64\site\lib\auto\Share\dist\App-SFDC-Metadata\manifests\all.xml,text,mode=666]^
--bind plugins/retrieve.plugins.pm[file=C:\perl64\site\lib\auto\Share\dist\App-SFDC-Metadata\plugins\retrieve.plugins.pm,text,mode=777]^
...
```

We should also ensure any dependencies from `retrieve.plugins.pm` are loaded:

```
...
--scan C:\perl64\site\lib\auto\Share\dist\App-SFDC-Metadata\plugins\retrieve.plugins.pm
...
```

This is the point at which you may want to override these values! If you have specific requirements for your manifests, for the folders you want to retrieve, or anything like that, create your own versions of those files and bundle those in instead.

## Why doesn't it work yet?

This was all great up to [v0.13](https://github.com/sophos/App-SFDC/tree/v0.13), but now this approach stopped working from v0.14 onwards. At that point I moved from a monolithic everything-in-one package approach to a dynamically loading plugin-oriented architecture, which allows anybody to create a command by naming their package `App::SFDC::Command::Foo`. The [code](https://github.com/sophos/App-SFDC/blob/master/lib/App/SFDC.pm) that makes that happen is:

```perl
find
   {
       wanted => sub {push @commands, $1 if m'App/SFDC/Command/(\w*)\.pm'},
       no_chdir => 1
   },
   grep {-e} map {$_.'/App/SFDC'} @INC;
```

...and this approach is completely broken by PerlApp - when running this, you get the error `invalid top directory at /<C:\Dev\App-SFDC\SFDC.exe>File/Find.pm line 472.`, because PerlApp doesn't create any recognisable directory structure for bundled modules - it provides an overloaded version of `require` which gets the required module from somewhere non-obvious.

After trying a few different things, it seems that the simplest way to achieve a nicely-bundled .exe is going to be to write a new script which avoids the pitfalls of detecting commands at runtime. We can, in fact, write a small perl program which writes the script for us (compare the output of this to [SFDC.pl](https://github.com/sophos/App-SFDC/blob/master/script/SFDC.pl) - it's the same idea, but static):

```perl
#!perl
use strict;
use warnings;
use 5.12.0;
use App::SFDC;

my $commandArrayDefinition = 'my @commands = ("'
    . (join '","', @App::SFDC::commands) . '");';

say <<'HEAD';
package SFDC;
use strict;
use warnings;
HEAD

say "use App::SFDC::Command::$_;" for @App::SFDC::commands;

say 'my @commands = ("'
        . (join '","', @App::SFDC::commands)
        . '");';

say <<'BODY';

my $usage = join "\n\n",
    "SFDC: Tools for interacting with Salesforce.com",
    "Available commands:",
    (join "\n", map {"\t$_"} @commands),
    "For more detail, run: SFDC <command> --help";

my $command = shift;
exit 1 unless do {
    if ($command) {
        if (my ($correct_command) = grep {/^$command$/i} @commands) {
            "App::SFDC::Command::$correct_command"->new_with_options->execute();
        } else {
            print $usage;
            0;
        }
    } else {
        print $usage;
    }
}
BODY

__END__
```

## Tying it all together

Using `perl -x` in a batch file, we can combine the perl script-writing script and the call to PerlApp into one easy-to-digest package, by using some syntax like:

``` shell
perl -x %0 > static_SFDC.pl

perlapp ^
 ...
 --info CompanyName=Sophos;LegalCopyright="This software is Copyright (c) 2015 by Sophos Limited https://www.sophos.com/. This is free software, licensed under the MIT (X11) License"^
 --norunlib --force --exe SFDC.exe static_SFDC.pl

goto :endofperl

#!perl
use strict;

...

__END__

:endofperl
```

For a full version, I've created [a gist](https://gist.github.com/alexander-brett/4e52a64722cb3f38dcb3) to play with.
