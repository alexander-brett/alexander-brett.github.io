---
title: Handling repository rewrites with git
tags: [Git]
---

Let's say you've decided that you need to make a change which changes almost every line in your git repository, for instance if you've realised you've got your line endings all messed up and want to make them uniform. If you're the only developer, or you can close every branch so that you can make your change on one branch only, you're ok. However, if you have dozens of developers working on dozens of branches, you'll come across a problem which is that once you've applied your change, the next time you attempt to merge anything, every single line will come up as a merge conflict in git.

Let's say you have branches A and B, and that each branch has some changes to a file called `foo.txt`, which has CRLF line endings, and you introduce a commit on each branch which changes them to LF. Git sees this as a change on every line in each branch, which means that there is nothing in common with the base commit of those branches, so it simply has nothing to go on when merging.

The good news is that by a little bit of git trickery, you can avoid this situation altogether. In my organisation, we have some branches organised as follows: `master` is our currently-released branch. `develop` is all features which are done, and is branched from master. `qa` is a testing branch and all features are merged into it. Each feature has a branch which is created from develop. I hope this diagram makes the situation clear!

```text

master   --*--------------------------------------*---
            \                                    / \
develop      *-*-*-*-------------*--------------*---*-
                \ \ \           / \            /
QA               \ \ *-----*---/---\-------*--/-------
                  \ \     /   /     \     /  /
feature1           \ *-*-*---*       \   /  /
                    \                 \ /  /
feature2             *----*---*--*-----*--*

```

This means that unless we have a hotfix underway, every branch being worked on is branched from develop, and in general we keep develop merged into each branch as much as possible. The thing that will make this rollout of a huge number of changes possible without breaking everything is creating a point on develop which we ensure is merged into every branch, then, applying our mass change on every branch, without any other commit. This means that every branch gets a commit called something like `apply mass change`. Lastly, we will _pretend that nothing happened_.

Let's go into a bit more detail. In this example, I was trying to compress some profiles and apply whitespace changes at the same time. I'm going to tell it as a story because it works better that way.

##Preparation

I created a branch called, `addGitattributes`. This contained only one change - the addition of a .gitattributes file detailed in my last post. Other than that, it was created from master, so I was guaranteed that it would merge into any branch just fine.

Then, I created a batch script called for instance, `doMassChange.bat`. It looked like this, although yours will vary depending on what you were trying to achieve.

```shell
git reset --hard && ^
git clean -f && ^
git merge origin/addGitattributes && ^
rm .git/index && ^
git reset && ^
git add -u && ^
git commit -m "Whitespace normalisation commit" && ^
compressProfiles.bat && ^
git add -u && ^
git commit -m "Profile compression commit"
```

As you can see, I've chained each command with `&&` which ensures that if one thing breaks, we stop and the developer has a chance to call me over so I can work out what! Lastly, I created a file called `applyMassChangeCleanly.bat` (these names are actually fictional to make it clear what I mean, to be honest) which looked like this:

```shell
git reset --hard && ^
git clean -f && ^
git merge MASS_CHANGE_DEVELOP_BEFORE && ^
doMassChange.bat && ^
git merge -sours MASS_CHANGE_DEVELOP_AFTER
```

The crucial bit is the `-sours` strategy being chosen on the last line. What the ours strategy does is mark the branches as merged, without actually doing a merge. This has all sorts of potential to break things, but because we know we're going from a known state (the tag `MASS_CHANGE_DEVELOP_BEFORE`) and applying identical changes (`doMassChange.bat`), it is in fact perfect for this situation.

I ensured that these two files are propagated onto every branch (you could alternatively distribute them to every developer in another way), and lastly I sent an email to my developers detailing what was going to happen on rollout day.

##Rollout

On rollout day, I got to the office early and made myself a strong coffee, then did the following:

 - Merged master into develop (just to make sure)
 - Tagged develop as `MASS_CHANGE_DEVELOP_BEFORE`
 - Ran doMassChange.bat on develop
 - Ran doMassChange.bat on master
 - Ran `git merge -sours master` on develop
 - Tagged develop as `MASS_CHANGE_DEVELOP_AFTER`
 - Pushed everything (including tags) to the server
 - Ran applyMassChangeCleanly.bat on QA
 - Pushed QA to the server

Then I had another strong coffee.

As the developers got to the office, they did their daily pull of develop and got huge merge conflicts. Then they remembered I'd sent them an email and read it, following which they ran applyMassChangeCleanly.bat on their branches.

And we all lived happily ever after!