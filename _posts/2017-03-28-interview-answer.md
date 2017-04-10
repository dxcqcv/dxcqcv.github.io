---
layout: post
tilte: Front-End interview answers 
tags:
- interview 
excerpt: Some collection of Front-End interview answers 
---

## Question: Make a method to find special item in object.

## Answer:

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

  function findPaths(obj={},tar='',path=[], last=null) {
    // copy path
    path = path.slice();
    // loop object
    for(var k in obj) {
      // check last
      let oldLast = path.slice().pop();
      if(last !== null && last !== oldLast) path.pop();
      // find it
      if(typeof obj[k] === 'string' && ~obj[k].indexOf(tar)) {
        path.push(k);
        console.log(`path is ${path.join('->')}`);
      }
      // no found then recursive
      if(typeof obj[k] === 'object') {
        let arr = path.slice();
        arr.push(k);
        // make k be last ele
        findPaths(obj[k], tar, arr, k);
      }
    }
  }

  findPaths(obj,'hi');
{% endhighlight %}

## Question:

{% highlight javascript linenos %}
  <ul id="list" class="foo">
    <li>#0</li>
    <li>
      <span>#1</span>
    </li>
    <li>#2</li>
    <li>#3</li>
    <li>
      <ul>
        <li>#4</li>
      </ul>
    </li>
      ...
    <li>
      <a href="//v2ex.com">#99998</a>
    </li>
    <li>#99999</li>
    <li>#100000</li>
  </ul>
{% endhighlight %}

- Add a class name bar to ul
- Delete 10th li
- Add a li text is '<test.com/>' after 500th li
- Show li num in current list when click any li

## Answear

{% highlight javascript linenos %}
  // init DOM
  var fragment = document.createDocumentFragment();
  var list = document.createElement('div');
  list.id = 'list';

  // iife
  void function() {
  var li;
  for( var i = 0; i < 10; i++) {
    if(i === 1) {
      li = make(['li',['span',`#${i}`]]);
      fragment.appendChild(li)
    } else if(i === 4) {
      li = make(['li',['ul',['li',`#${i}`]]]);
      fragment.appendChild(li);
    } else if(i === 6) {
      li = make(['li',['a',{href:'//test.com'},`###${i}`]]);
      fragment.appendChild(li);
    }

    else {
      li = make(['li',`#${i}`]);
      fragment.appendChild(li);
    }

  }
  list.appendChild(fragment);
  document.body.appendChild(list);
  }();

  // add class
  list.addClass += 'bar';

  // remove ele
  // nth-of-type is 1-base
  var li3 = list.querySelector('li:nth-of-type(3)');
  li3.parentNode.removeChild(li3);

  // add ele
  var li8 = list.querySelector('li:nth-of-type(8)');
  list.insertBefore(make(['li','<test.com/>']),li8);

  // show li num in current list when clicked
  list.addEventListener('click',liHandle);

  function liHandle(e) {
    var target = e.target || e.srcElement;
    if(target.id === 'list') {
      console.log('not a li');
      retrun;
    }
    while(target.nodeName !== 'LI') {
      target = target.parentNode;
    }
    var parentUI = target.parentNode;
    var children = parentUI.childNodes;
    var count = 0;
    var node;
    for(var i = 0; i < children.length; i++) {
      node = children[i];
      if(node.nodeName === 'LI') {
        count++;
      }
      if(node === target) {
        alert(`NO. ${count} of the current list`);
        break;
      }
    }

  }

  // create DOM
  // arguments is array
  // return DOM element
  function make(desc) {
    if(!Array.isArray(desc)) desc = [...desc];
    var el = document.createElement(desc.shift());
    for(var i = 0; i < desc.length; i++) {
      if(Array.isArray(desc[i])) {
        el.appendChild(make(desc[i]));
      } else if (
        typeof desc[i] === 'object'
        && desc[i] !== null
      ) {
        for(var k in desc[i]) {
          el[k] = desc[i][k];
        }
      } else {
        el.appendChild(document.createTextNode(desc[i]));
      }
    }
    return el;
  }
{% endhighlight %}
