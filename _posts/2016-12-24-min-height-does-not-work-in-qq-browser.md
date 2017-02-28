---
layout: post
tilte: min-height auto property doesn't work in qq browsers 
tags:
- min-height  
- qq browsers 
excerpt: If you use min-height auto in qq browsers the same as wechat browsers. 
---

Min-height will not work when your code like:

{% highlight ruby linenos %}
  div
    min-height 100%
    @media (max-width: $response-phone)
       width auto
       min-height auto
{% endhighlight %}

so the solution is use `display table` like:

{% highlight ruby linenos %}
  div
     display table
     height inherit
     width 100%
     height auto
     min-height: auto
{% endhighlight %}
