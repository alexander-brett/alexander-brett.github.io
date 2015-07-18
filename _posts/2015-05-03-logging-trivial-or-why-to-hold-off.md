---
title: Logging::Trivial - or, why to hold off on that logging module you wrote
tags: [Perl]
---

A while back, I wrote WWW::SFDC as well as a few programs calling it, and I wanted the world's most trivial logging module which still allowed for 5-level (DETAIL, DEBUG, INFO, WARN, ERROR) logging. I couldn't find anything appropriate on cpan, so I rolled my own and called it [Logging::Trivial](https://github.com/alexander-brett/Logging-Trivial).

Now, I was pretty happy with this, and got it all ready to be a grown-up cpan module (my first), so I went on [prepan](http://prepan.org/module/nY4oajhgzM5) and said, guys, what do you think. I wouldn't call it a slap-down, but I got some pretty robust advice not to publish Yet Another Logging Module, and as a result I decided that I'd sit on it - I wouldn't refactor it out until I found a suitable replacement, but I wouldn't publish.

Today I revisited the issue and found [Log4Perl's easy-mode](http://search.cpan.org/~mschilli/Log-Log4perl-1.46/lib/Log/Log4perl/FAQ.pm#What's_the_easiest_way_to_use_Log4perl?), and I'm very pleased because it does exactly what I want, with very, very little rewriting of code. I ran `perl -i.bak -pe 's/Logging::Trivial/Log4Perl ":easy"/; s/DETAIL/TRACE/; s/ERROR/LOGDIE/;'` and was [essentially done](https://github.com/alexander-brett/WWW-SFDC/commit/232c807bbe285525f064e1fcd510a1058bf0659d).

I think the moral of the story is that when you're not quite sure that your solution is going to stand the test of time, wait a while to see whether it does. In my case, it didn't, but I'm better off for that, and so is cpan.
