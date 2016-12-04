---
layout: post
tilte: pug-loader cannot be passed data or locals in webpack
tags:
- pug-loader
- webpack
excerpt: pass data with pug-loader will not be worked.
---

If you wanna pass data through `pug-loader` in webpack, you'll get error like something undefined

so you only can use `gulp-pug` to pass data to pug, like

```javascript
/**
 * pug to html
 */
 gulp.task('html',function(){
   return gulp.src('./app/src/html/index.pug')
   .pipe(pug({
     locals: locals
   }))
   .pipe(gulp.dest('./app/dist/html'))
 });
```