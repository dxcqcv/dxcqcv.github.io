declare var require: any;
require('./ga.js');
require('../css/index.styl');
require('../css/font-awesome.css');


/**
 * get all pre tag parent first class 
 */
let addData2Highlight = () => {
  let highlightClass = document.getElementsByClassName('highlight');
  Array.prototype.map.call(highlightClass, (el) => {
    let parentClass = el.parentNode.classList; 
    let dataLang;
    if(parentClass.length > 1) {
      dataLang = parentClass[0].split('-')[1]; 
      el.setAttribute('data-lang',dataLang);
    }
  });
}

window.onload = addData2Highlight;
