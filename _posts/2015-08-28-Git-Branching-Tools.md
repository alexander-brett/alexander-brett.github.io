---
title: Tools for effective branching structures in git
tags: [Git]
---

Creating a good git branching structure is a difficult process. There are many considerations to be juggled, including: 

- Is this easily understandable to developers and PMs, including those who may not have prior experience with git?
- Is it easy to trace a single change to the branch, developer and ticket for which it was made?
- Is it possible to roll back changes which introduce issues?
- Will this scale out to several large teams of developers, and does it need to?

In addition, when working with specific systems, for instance Salesforce.com or CPAN, the sandboxing and release processes suitable for those systems introduce additional requirements around the branching structure.

In fact, the principal trade-off to be made is that a branch model which produces a very clear and traceable result will, in general, require a higher level of fluency with git for all participants.

This article is an exploration of different techniques that can be used to build the branching structure your organisation needs; it's important to note that there is no one true branching structure, and that anybody who says that there is is wrong!

NB: If you feel that something in this article needs improvement, please feel free to open a pull request

#The trivial structure

The simplest possible branching model has one developer working on one feature at a time. When the feature is complete, you tag a release, and continue working on the same branch. This looks like this:

       v0          v1
        |           |
    o---o---o---o---o---o

This works well for personal projects, but obviously falls down as soon as you need to switch the priorities on features, fix a bug in an existing feature before resuming work on the in-progress one, or collaborate with anybody else. Nonetheless, it's important to realise that git branching structures don't, in fact, have to include multiple branches.

# Branching

In order to work on multiple features at once, or get a bugfix done quickly, you can start to use multiple branches, merging changes as appropriate. This works as follows:

1. You're working on a feature:

             v0    myFeature
              |       |
          o---o---o---o

2. You need to fix a bug, so you create a new branch starting at the last release

              v0   myFeature
              |       | myBugfix
          o---o---o---o   |
               \----------o

3. When you've finished the bug, you release that branch

              v0   myFeature
              |       | v0.1
          o---o---o---o   |
               \----------o


4. You merge the new release into your own branch

              v0              myFeature
              |         v0.1  |
          o---o---o---o---|---*
               \----------o--/
                              ^merge commit

5. When you finish your feature, you release your branch

              v0                 v1
              |          v0.1     |
          o---o---o---o---|---*---o
               \----------o--/


# Master

Using tags for releases works really well from a release-management and version history point of view, but it can get a bit fiddly as a developer - you have to constantly check which tag is the most recent, and ensuring that you're branching and merging the right commits can get a little tedious. If you're the only one working on the project, it's probably not going to get to complicated, because you may well have only a couple of branches at once, and you'll create each release and therefore be in a better position to remember what's going on. However, once you have more than one person able to make releases, or you get several branches, you'll want to handle this potential complexity.

At this point, having a master branch is really useful. Whenever you release, you ensure that master points at that commit. In that way, each time you switch branch, making sure it's up-to-date with the latest release is simply a matter of merging in master. When you're dealing with a master branch, your branching diagrams look a little different:


1. You're working on a feature

              master
            v0 |  
             \ /     myFeature
          o---o        |
               \---o---o  

2. You need to fix a bug, so you create a new branch starting at the last release

              master
            v0 |  
             \ /     myFeature
          o---o         |  myBugfix
               \        |   |
                \---o---o   |
                 \----------o
3. When you've finished the bug, you release that branch by merging into master

                             master
             v0                | v0.1
              |   myFeature    |/
          o---o---------|------*          
               \        |     /^merge commit
                \---o---o    /
                 \----------o
4. You merge the new release into your own branch

                           master
             v0              | v0.1
              |              |/
          o---o--------------*  myFeature
               \            / \ /
                \---o---o--/---*
                 \--------o
5. When you finish your feature, you release your branch.

             v0            v0.1 v1 master
              |              |   | /
          o---o--------------*---*
               \            / \ /
                \---o---o--/---*
                 \--------o

# Fast-Forward

The downside of introducing the master branch like this is that we've introduced two extra merge commits compared to the previous version - and in fact, half of the commits since `v0` are merge commits! This does serious damage to our ability to see quickly and easily what changes have been introduced and when. Fortunately, we don't always need to do a merge - git has an ability to fast-forward, which means that, when there is nothing to merge, the branch is moved to point to a different commit, without any new commit being added.

To be more specific, a fast-forward occurs when one of the commits to be merged is the ancestor of the other, which you can see happening at `v0.1` and `v1` above.

If we allow fast-forward commits, we end up with much more attractive diagrams for steps 3 onwards:

3. When you've finished the bug, you release that branch (nb we fast-forwarded master!)

              v0      master v0.1
              |  myFeature | /
          o---o--------|---o 
               \       |
                \--o---o   

4. You merge the new release into your own branch

              v0   master  v0.1
              |         \ /
          o---o----------o  myFeature
               \          \/
                \--o---o---*

5. When you finish your feature, you release your branch (nb another fast-forward onto master!)

              v0       v0.1 v1  master
              |          |   | /
          o---o----------o---* 
               \            /
                \--o---o---/

It's important to realise that this set of diagrams is identical to the original, with a new branch added and some lines in different places - master is simply 'a branch which will always point to the last release'. In fact, if you are using master in this way, you could choose only ever to fast-forward commits onto it.

# Rebase

I think that merge commits are noise. When you have a branch-based workflow, you're working on a few features simultaneously, and you release regularly, you may end up with 1/3rd or more of your commits being merge commits, and this can mean that when you use `git log` you end up with an effectively unreadable mess. Fortunately, in `rebase` we have a tool that lets us re-arrange our commit history in an extremely readable and pleasant manner. It works exactly the same as above up to step 4, at which point instead of _merging_, we _rebase_, which takes all of the commits we made on our branch and then applies them on top of the target, which means it's as though we just checkout out the latest release and instantaneously developed on top of it. This leaves the history looking like this: 

                 master
              v0  | v0.1
              |   \ /
          o---o----o     myFeature
                    \       |
                     \--o---o

which in turn means that when we release myFeature, we get this:

              v0  v0.1   v1 master
              |    |      \ /
          o---o----o---o---o

...which is extremely easy-to-follow.

This is the workflow that I use on my perl modules. The habitual use of rebase during development is not without controversy, however; to be able to rebase accurately and effectively whilst avoid messing up your own and other people's work requires discipline and experience. You have to ensure that you don't rebase a branch which you've pushed to a shared git server, and that when you do rebase you are aware of potential conflicts and the ways to resolve them - because it's less obvious after the fact that when you do a merge. It was [this article](http://endoflineblog.com/gitflow-considered-harmful) which got me thinking about the ways that rebase is in fact a brilliant tool to have up your sleeve, and I do think that on projects with a high enough level of expertise, it should be used.

Another caveat to add at this stage is that rebase is, like all tools, not always appropriate. If your branch is more than a few commits divergent, or if the rate of change is so fast that you're trying to rebase dozens if not hundreds of commits at a time, you may well find that it's more trouble than it's worth; git merges exist for an excellent reason. I think that choosing the best way to incorporate change is largely a matter of doing it several times and getting an intuition for it.

# Rebasing onto a shared branch

Let's say you and another developer both working on some feature, and you've got a branch called myFeature. You actually have at least 5 branches in at least 3 locations:

- On the server, you have myFeature
- On your computer, you have origin/myFeature and myFeature
- On his computer, you have origin/myFeature and myFeature

To start with, all of the branches look the same. However, once you've each done a little work, it can easily look a bit like this:

	server/myFeature   a---b
	                    \   \
	theirs/myFeature     \   d
	                      \
	mine/myFeature         c---e

Now, when I pull from and push to the server, then make another commit, this happens:
    
	server/myFeature   a---b-------*
	                    \   \     / \
	theirs/myFeature     \   d   /   \
	                      \     /     \
	 mine/myFeature        c---e       f

And they do the same, which looks like this:

	server/myFeature   a---b-------*-----*
	                    \   \     / \   / \
	theirs/myFeature     \   d---/---\-/   g
	                      \     /     \
	mine/myFeature         c---e       f

This rapidly becomes messy and has unnecessary merge commits, not to mention being hard to follow. However, what would have happened had we fetched and rebased instead of pulling is the following much neater result:
    
	server/myFeature   a---b---c'--e'--d'
	                                \   \
	theirs/myFeature                 \   g
	                                  \
	 mine/myFeature                    f


Essentially, a competent developer using git should almost always rebase when the commits to be pushed are not yet on a server.

# Pull requests
One good use for merges is that they allow peer-review and attribution of changes. This leads to the idea of a 'pull request' - some contributor sends a message saying

> Please pull[^pull] my branch into your repository

[^pull]: When you remember that pull means fetch then merge, this is a very clear and specific request.

At this point, every git tool out there will show you exactly what has changed and why, enabling you to have confidence in the features they've developed, and it also makes it easy to appreciate their contributions. Pull requests are a crucial tool for collaboration on projects where there is anything other than a small and tightly-knit team.

When you have a pull request based workflow, your master branch will look something like this:

    master     ---*---*---*---
    feature A  o-/   /   /
    feature B  ---o-/   /
    feature C  -o----o-/

This means that every commit on master is a merge commit, and they will probably look something like 'Merge pull request #4 from my-super-special-feature to master'. This does mean that's it's often harder to find the specific commit which introduced a change.

# Develop
At some point you'll be working on a system where you can't simply release several times a week, and releases need to be gathered, tested, signed off, and deployed. Some might argue that this is a pathology, but it's also a fact of life. In this situation, you may well add in a branch for work that's done, but not yet released. Depending on your background, you may want to call this several names, including `stable` and `trunk` - in git, it's called `develop`.

This looks like this:

1. You start with master and develop

        master v0 develop
             \ | /
               o

2.  You do some work on the develop branch using one or more of the above principles:

        v0  master
          \ /      
           o      develop
            \        |
             o---o---o

3. You're ready to release, so you fast-forward master onto develop and tag a release

        v0   master v1 develop
        |         \ | /
        o---o---o---o

4. Rinse & repeat

# Git-Flow

Git-Flow is essentially: having a master branch, a develop branch, and additional feature branches, without using fast-forward or rebase. It ends up looking a bit like this:

	master   --o----------------------*---
	            \                    / \
	develop      \----------*-------*---*
	              \        / \     /  
	feature1       \--o---o   \   /  
	                \          \ /  
	feature2         o----o--o--*

It has the advantage of being able to accommodate reasonably-sized teams of relatively-low expertise, but it also has a fair number of disadvantages - which have been discussed at length everywhere.

# Beyond Git-Flow

Git-Flow starts breaking down once you hit a large number of simultaneous teams; once you hit about 50 feature branches, you spend so much time merging down from develop and there are so many merge commits, that you lose a lot of the benefits of using git to begin with. At this point, it's much easier to set up a branch per epic[^epic] and have the team working on that treat it as a master branch - once the epic is ready for release, that's then released as normal. What this means is you have:

    master   o---------------*---*
              \             /   /
    epic 1     \-#Black Box#   /
                \             /
    epic 2       \-#Black Box#

So, depending on those teams' structures, they may be using anything from an extremely trivial workflow up to a full on mini-Git-Flow. It's at this point that your branching structure starts looking a bit like a fractal.

[^epic]: Or whatever you want to call a related group of features

# Forks

If you're going to treat each team's work on your product to be a separate black box waiting to be pull requested back into the develop or master branch, you may as well get them to work in separate forks - this prevents you from getting a gradual buildup of 300 stale branches where nobody's quite sure who's working on what.

Using forks can also unlock some useful functionality in whatever git server you're using; Atlassian's Stash has a 'fork syncing' feature which allows you to automatically apply any commit which is applied to a branch in a parent repository to all the child forks. It allows each team to set fine-grained permissions and have administrative access, isolates critical infrastructure, and makes setting up continuous integration easier (you just clone the CI environment and point it at a different URL, rather than having to reconfigure all the branches).

# Per-environment branches

Depending on the way you have your continuous integration environments set up, you may want to use a branch to represent test and staging environments. However, you probably won't want to ever merge these branches into anywhere else - tickets that are in for testing are explicity untested, and tickets undergoing UAT are not UAT'd. One successful approach is:

1. A ticket is moved to 'development complete'
2. A pull request is automatically opened to the relevant test environment
3. A build plan detects the pull request and attempts to build and deploy the pull request
4. If the build and deployment is successful, the pull request is automatically merged

Travis CI has a great feature where it automatically detects pull requests and builds them; Atlassian Bamboo has a feature where it can automatically merge branches if a build passes, and they are both good examples of how using even simple git features can save you a lot of work.
