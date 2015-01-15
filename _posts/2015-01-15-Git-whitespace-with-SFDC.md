---
title: How to handle whitespace with Salesforce.com and git
date: 2015-01-15
---

A common problem when working in a git repository in a cross-platform environment is end-of-line handling, as testified by the number of stackoverflow questions on the topic! I found that the most useful guide to getting whitespace right in a repository was [github's](https://help.github.com/articles/dealing-with-line-endings/), but that there were some additional concerns when working with Salesforce.com.

Firstly, it's important to bear in mind that SFDC provides all of its text files with unix-style (LF) line endings, and I think that the path of least resistance is to stick with what they provide! However, if you're a windows shop, your developers are probably using tools which introduce windows-style line endings (CRLF) into the files which they touch. The problem with letting this go unchecked is that you are liable to end up with a huge number of merge conflicts which are extremely frustrating, and eventually you put `--ignore-space-change` or `--ignore-whitespace` on every git command.

The first recommendation of github's guide is to set `core.autocrlf=true` and call it a day. However, **you must not do this!** The reason why not is that when you retrieve from SFDC, your static resources are saved as `src/staticresources/foo.resource`, and git does not by default recognise that these are binary files. This means if you just set up `autocrlf`, git will mangle these files by deleting bytes which it thinks are CR characters and are in fact useful information, and then SFDC will stop being able to read the files. 

So the correct solution is to set up a `.gitattributes` file in the root of your git repository which looks a lot like this:

```text
# ensure all salesforce code is normalised to LF upon commit      
*.cls text=auto eol=lf                                            
*.xml text=auto eol=lf                                            
*.profile text=auto eol=lf                                        
*.permissionset text=auto eol=lf                                  
*.layout text=auto eol=lf                                         
*.queue text=auto eol=lf                                          
*.app text=auto eol=lf                                            
*.component text=auto eol=lf                                      
*.email text=auto eol=lf                                          
*.page text=auto eol=lf                                           
*.object text=auto eol=lf                                         
*.report text=auto eol=lf                                         
*.site text=auto eol=lf                                           
*.tab text=auto eol=lf                                            
*.trigger text=auto eol=lf                                        
*.weblink text=auto eol=lf                                        
*.workflow text=auto eol=lf                                       
*.reportType text=auto eol=lf                                     
*.homePageLayout text=auto eol=lf                                 
*.homePageComponent text=auto eol=lf                              
*.labels text=auto eol=lf                                         
*.group text=auto eol=lf                                          
*.quickAction text=auto eol=lf                                    
*.js text=auto eol=lf                                             
*.py text=auto eol=lf                                             
*.pl text=auto eol=lf                                             
*.csv text=auto eol=lf                                            
```

... which is to say, every metadata type which you know is going to be text gets an entry, but those types which might be binary get no entry (or you can add `*.staticresource binary` etc). This probably isn't quite comprehensive depending on your setup, because inside `documents/*/` you can end up with arbitrary file endings - however, normally the files you have there have 'normal' filenames, such as `downArrow.png` or `footer.html`  which git has a chance of being able to recognise as binary or not.

Once you've set up your .gitattributes properly, if you're starting off a new repository you're good to go, but if you're having to apply these changes to a repository which you already have developers working on, you need to be quite careful about rolling them out. I'm going to write a post on that topic soon.