## tools of this repo
- write pug(jade) and jekyll to html
- write stylus and postcss to css
- write typescript to js
- drive workflow using gulp and webpack

## publish articles
1. add `.md` into _posts folder

## build
- `gulp`
- remove top blank line of **index.html** and others html files in the _layouts folder    
- `NODE_ENV=production gulp` for production

## TODO
* make a pugjs plugin to fix pug2jade bug, [issues](https://github.com/pugjs/pug/issues/2443)
* make it support jenkins
* support line num in code

