---
layout: post
tilte: Front-End interview answers 
tags:
- interview 
excerpt: Some collection of Front-End interview answers 
---

##Question: Make a method to find special item in object.

##Answer:

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

##Question:

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
- Add a li text is '<v2ex.com/>' after 500th li
- Show li num in current list when click any li

##Answear

{% highlight javascript linenos %}
  // init DOM structure
  var list = document.getElementById('list');
  var fragment = document.createDocumentFragment();

  void function() {
    var li;
    for(var i =0; i <=10000; i++) {
      if(i === 1) {
        li = make(['li','#1']);
        fragment.appendChild(li);
      } else if(i === 4) {
        li = make(['li',['ul',['li','#4']]]);
        fragment.appendChild(li);
      } else if(i === 9998) {
        li = make(['li',['a',{href:'//test.com'}, '#9998']]);
        fragment.appendChild(li);
      } else {
        li = make(['li',`#${i}`]);
        fragment.appendChild(li);
      }
    }
    list.appendChild(fragment);
  } ();

  // add class
  list.className += 'bar';

  // remove items, 1-base
  var li10 = document.querySelector('#list > li:nth-of-type(11)');
  li10.parentNode.removeChild(li10);

  // because after del a node
  var li500 = document.querySelector('#list > li:nth-of-type(501)');
  var newItem = make(['li','<test.com/>']);
  li500.appendChild(make(['li','<test.com/>']))

  list.addEventListener('click', function(e) {
    var target = e.target || e.srcElement;

    // clicked list ul
    if(target.id === list) return ;

    // back to parent if not li 
    while(target.nodeName !== 'LI') {
      target = target.parentNode;
    }

    var parentUl = target.parentNode;
    var children = parentUl.childNodes;
    var count = 0;
    var node;

    for(var i =0; i < children.length; i++ ) {
      node = children[i];
      if(node.nodeName === 'LI') count++;
      if(node === target) {
        alert(`No. ${count} of current list`);
        break;
      }
    }
  });

  function make(desc) {
    if(!Array.isArray) desc = [...desc];
    // get first element
    var el = desc.shift();
    for(var i = 0; i < desc.length; i++;) {
      // check if it's array then recursion
      if(Array.isArray(desc[i])) {
        el.appendChild(make.call(this, desc[i]));
      } else if(
        typeof desc[i] === 'Object'
        && desc[i] !== null
        && !Array.isArray(desc[i])
      ) {
        for (var attr in desc[i]) {
          el[attr] = desc[i][attr];
        }
      } else {
        el.appendChild(document.createTextNode(desc[i]));
      }
    }
    retrun el;
  }
{% endhighlight %}
