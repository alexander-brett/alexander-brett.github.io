---
title: Running unit tests using WWW::SFDC
tags: [SFDC, Perl]
---

This post is going to start basic and get gradually more complicated - I suggest that you stop once you've satisfied your own requirements! The basic premise is that, in order to keep a consistantly high-quality and deployable set of metadata, we keep a Salesforce.com org up to date with a branch, and nightly (or more often) we run every unit test against it. This makes sure that, even though developers are keeping abreast of the effects their changes have on other parts of the code base and so on, there is one extra highly visible and reportable checksum on quality.

Fortunately, the tooling API makes our job quite easy. If you have simple needs, the following 3 statements should be sufficient for running your tests:

```perl
my $parentJobId = WWW::SFDC::Tooling->instance()->runTestsAsynchronous(
  map {
    $_->{Id}
  } WWW::SFDC::Tooling->instance()->query(
    "Select Id FROM ApexClass WHERE NamespacePrefix = ''"
  )
);

sleep 60 while WWW::SFDC::Tooling->instance()->query(
  "SELECT Id, Status, ApexClassId FROM ApexTestQueueItem"
  . " WHERE ParentJobId = '$parentJobId' AND ("
  . " Status='Queued' OR Status='Processing'"
  . " OR Status='Preparing' OR Status='Holding')"
);

my @results = WWW::SFDC::Tooling->instance()->query(
  "SELECT Id, Outcome, MethodName, Message, StackTrace, ApexClass.Name "
  ."FROM ApexTestResult WHERE AsyncApexJobId = '$parentJobId'"
);
```

However, this is far from a perfect implementation. The first thing to notice is that we're just passing every Apex class into runTestsAsynchronous, which is probably a highly inefficient way to do things (according to my measurements, it adds about 5% to the total time for the tests). It would be more elegant and quicker if we filtered the results of the first query to find tests classes, and, fortunately, we can do this using the SymbolTable field on ApexClass - a class needs to be enqueued if it, or any of its methods, have the `TEST` modifier. This can be achieve thus:

```perl
sub isTestModified {
  my $thing = shift;
  defined $thing->{modifiers} and (
    $thing->{modifiers} eq 'TEST'
    or (
      ref $thing->{modifiers} eq 'ARRAY'
      and grep {$_ eq 'TEST'} @{$thing->{modifiers}}
     )
   );
}

sub filterTests {
  defined $_->{SymbolTable}->{methods} and (
    (
      ref $_->{SymbolTable}->{methods} eq 'ARRAY'
      and grep {isTestModified($_)} @{$_->{SymbolTable}->{methods}}
    ) or (
      ref $_->{SymbolTable}->{methods} eq 'HASH'
      and isTestModified($_->{SymbolTable}->{methods})
    )
  )
}

my $parentJobId = WWW::SFDC::Tooling->instance()->runTestsAsynchronous(
  map { $_->{Id} } grep { filterTests } WWW::SFDC::Tooling->query(
    "Select Id, SymbolTable FROM ApexClass WHERE NamespacePrefix = ''"
  )
);
```

Now, you're pretty happy with how this is working, but sometimes this query seemingly-randomly times out. The reason this happens is that if you have deployed one or more Apex classes since the last compilation, requesting the SymbolTables triggers a behind-the-scenes recompilation of your entire code base, which will take longer that the 120s timeout once you get to a certain size. My solution to this was just a brute-force retry mechanism, which can also mitigate any brief networking issues on the client (it suck if you're halfway through a several-hour test run and you get no results because the was a momentary VPN lapse...), and I achieved it by replacing all the calls to `WWW::SFDC::Tooling->instance()->query()` with `retryQuery()`:

```perl
sub retryQuery {
  my $query = shift;
  my @result;
  for (0..5) {
    eval { @result = WWW::SFDC::Tooling->instance()->query($query); };
    next if $@;
    return (scalar @result == 1 and not defined $result[0] ? undef : @result);
  }
  die "There was an error retrieving the information from Salesforce\nQuery: $query\nError: $@";
}
```

Bear in mind that I've recently modified WWW::SFDC to automatically re-authenticate in the event of a session timeout, which is extremely useful for long test runs!

At this point you feel ready to put your code on a continuous integration server and let it rip. When I did this I ran into a wierd problem where the perl process used up all of the available RAM and started thrashing swap space, taking 7 minutes to even start off the tests; it turns out that the SymbolTable for every class, all at the same time, is quite a mouthful to deserialise. The obvious solution is to query in batches, but the tooling API, as far as I can tell, does not support paged queries in the same way as the Partner API does. Queue more `grep {} map {} grep {}` chaining:

```perl
my $parentJobId = WWW::SFDC::Tooling->instance()->runTestsAsynchronous(
  map { $_->{Id} } grep { filterTests } map {
    retryQuery(
	"SELECT Id, SymbolTable FROM ApexClass WHERE NamespacePrefix = ''"
	. " LIMIT 200 OFFSET $_"
    )
  } grep {
    $_%200 == 0
  } 0..(scalar retryQuery(
    "Select Id FROM ApexClass WHERE NamespacePrefix = ''"
    ) - 1)
);
```

Now we have a robust and efficient way to run all of our unit tests on SFDC. The last thing I wanted to do was to have all of these test results aggregated and reported on with Atlassian Bamboo. Bamboo comes with a build-in JUnit parser, and JUnit has a fairly simple syntax, so for me the path of least resistance was to be a terrible-person and roll my own XML formatter:

```perl
sub jUnitFormat {
  my $result = shift;
  my $className = $$result{ApexClass}{Name};
  my $methodName = $$result{MethodName} eq "<compile>"
     ? "CompileFailed"
     : $$result{MethodName};
  return "<testcase name='$methodName' classname='$className' "
    . "status='$$result{Outcome}'>"
    . (defined $$result{Message}
      ? "<failure><![CDATA[$$result{StackTrace}\n$$result{Message}]]></failure>"
      : "")
    . "</testcase>";
}

{
  open my $fh, ">", $output;
  print $fh join "\n",
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<testsuite name="SFDC Unit Tests">',
    (map {jUnitFormat($_)} @results),
    '</testsuite>';
  close $fh;
}

```

...easy peasy.

I've uploaded the final version as a runnable perl script as [a gist](https://gist.github.com/alexander-brett/36f688a0dd8419d286bc) - I very much encourage you to give it a try, and maybe even help me come up with more improvements.
