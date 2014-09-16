---
title: A Regex for validating XML text
date: 2014-09-16
---

I'm currently working on version 3 of a tool to diff XML files in a content-aware manner, viz. to parse nodes and identify where two nodes are different, rather than just apply a string diff to them. A crucial part of that is that the parsing be fast and robust. 

Every language there is has an XML parsing library, but often they are not as fast as I'd like, or it's difficult to have it return a tree-structure well-suited to writing the diff algorithm, so I decided to write my own.

The route I decided to go down was a recursive regular expression capturing the node's declaration (if any), tagName and properties, and then to extract the child nodes and pass each of them through the regex.

To start with, the possible node types are xml, text, and CDATA:

~~~perl
m{
  (
    \s*<!\[CDATA\[.*?\]\]>
  |
    [^<>&]+                  # Text Node
  |
    \s*<(\w+)>.*?<\/\2>      # XML Node
  )
}xs
~~~

Now let's add support for properties, self-closing tags, and an XML declaration, and name the capture groups:

~~~perl
m{
  (?<outerXML>
    \s*<!\[CDATA\[.*?\]\]>
  |                          # Text Node
    [^<>&]+
  |                          # XML Node
    (?<declaration> \s*<\?.*?\?>)?
    \s*<
    (?<tagName>     \w+)
    (?<properties>  [^>]*?)
    (                        # tag is self-closing...
      \/>
    |                        # ...or has content
      >.*?<\/\g{tagName}>
    )
  )
}xs
~~~

This is great and kind of works ok, but it does fall down when it meets a construct like `<a><a><a></a></a><a></a></a><a></a>` thanks to not being intelligent about searching for a tag's inner XML - we can fix this by using Perl's crazily powerful recursive `(?0)` syntax.

The other downside of this regex as written is that it isn't fast at all - feed it a few thousand lines of XML and it'll really struggle. Fortunately, we can use another powerful perl regex feature, the atomic group `(?> ... )`. This speeds up the match by an order of magnitude for large files. The final version is this:

~~~perl
m{
  (?<outerXML>
    (?>
      \s*<!\[CDATA\[.*?\]\]>
    |                          # Text Node
      [^<>&]+
    |                          # XML Node
      (?<declaration> \s*<\?.*?\?>)?
      \s*<
      (?<tagName>     \w+)
      (?<properties>  [^>]*?)
      (?>                      # tag is self-closing...
        \/>
      |                        # ...or has content
        >
        (?<innerXML> (?0)*\s* )
        <\/\g{tagName}>
      )
    )
  )
}xs
~~~

It happens that although this regex is a way of extracting data from an XML node, it also only matches valid XML, in a speedy way. You can see it in anger as an XML parser in [Node.pm](https://github.com/alexander-brett/xmlDiff.pm/blob/master/xmlDiff/Node.pm).