---
layout: post
tilte: permalink conflict in github pages 
tags:
- permalink
- github pages
- jekyll
excerpt: The problem is if your permalink has the same path with github repo, you'll get 404 error pages.
---

I have a permalink like

{% highlight javascript linenos %}
  permalink:       /blog/:categories/:title/
{% endhighlight %}

and I have a github repo name `blog`

Boo~~

404 pages~~

so the solution is to change the github repo name, over. thx github.
