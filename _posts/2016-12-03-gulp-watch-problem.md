---
layout: post
title: Gulp 4 alpha watch only work once
tags:
- gulp 4
- gulp task watch
excerpt: The problem is gulp-4 watch only work once after first run 
---

Someone say this problem cause OS, specify Linux-like OS ubuntu etc, and add `**` to path can fix it, like

{% highlight javascript linenos %}
  gulp.task('watch', function () {
      gulp.watch( './**/test.js', gulp.series('es6') );
      console.log('Running watch...');
  }); 
{% endhighlight %}

But the solution does not work on me, do not know why, sad~
