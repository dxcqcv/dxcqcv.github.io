---
layout: post
tilte: Front-End interview answers 
tags:
- interview 
excerpt: Some collection of Front-End interview answers 
---

Question: Make a method to find special item in object.

Answer:

{% highlight javascript linenos %}
  var obj = {
  a: {
  b: {
  c: 'hi',
     d: {
  e:'hi'
     }
     },
  l1: { t:123,t2:'hi',t3:'hi'},
      l2: 345
     },
  test: {oo:'OO'}
  };

  function demo(obj, tar, path = [], i = {
  count: 0
  }, isConsole = true,last = null) {
    // update path
    path = path.slice();

    for (let key in obj) {
      // if found tar will update path, but last does not update
      console.log('last: ' + last + ' path: ' +path.slice().pop());
      if(last !== path.slice().pop()) path.pop();
      let str = obj[key];
      if (typeof str === 'string' && ~str.indexOf(tar)) {
        //if(path.pop() == last) path.pop();            
        path.push(key);
        i.count++;
        console.log(path.join('->'), obj[key]);
      }
      if (typeof obj[key] === 'object') {
        // make new path to recursive
        let arr = path.slice();
        arr.push(key);
        demo(obj[key], tar, arr, i, false, key);

      }
    }
    if (isConsole && i.count > 0) {
      console.log(i.count);
    }
  }
  demo(obj,'hi');
{% endhighlight %}
