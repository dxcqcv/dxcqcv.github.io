---
layout: post
tilte: Gemfile requires Y error
---

I got error when I updated jekyll to 3.0

> like You have already activated X, but your Gemfile requires Y 

This is very annoying and fixed it for whole afternoon.

## the solution
1. test `bundle exec jekyll` instead of just `jekyll` 
2. then change gulpfile 

``` javascript
const child = require('child_process');
gulp.task('jekyll', () => {
  const jekyll = child.spawn('bundle', ['exec','jekyll','build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);
});
```