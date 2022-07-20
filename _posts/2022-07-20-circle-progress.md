---
layout: post
title: Make a circle progress in WeChat Mini Program 
tags:
- WeChat Mini-Program 
excerpt: Make a custom circle progress in WeChat Mini Program 
---

WeChat office only support simple `progress` component, So we DIY a `circle-progress` component

`index.js` of `circle-progress`

```
// components/circle-progress/circle-progress.js
Component({
  runTimerid:0,// timeout id
  /**
   * props of component 
   */
  properties: {
    percent: {
      type:Number,
      value:0,
      observer: function(newVal, oldVal) {
        console.log('call observer')
        this.draw(newVal)
      }
    }
  },

  /**
   * init data 
   */
  data: {
    oldText:'',
    percentage:'',
    animTime: ''
  }, 


  /**
   * method of component 
   */
  methods: {
    // make circle method  
    run(c, w, h) {
      let that = this;

      const num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI;
    
      if(!that.ctx2) return


      that.ctx2.strokeStyle = "#09bb07";
      that.ctx2.lineWidth = 16;
      that.ctx2.lineCap = "butt";
      that.ctx2.arc(w, h, w - 8, -0.5 * Math.PI, num);
      that.ctx2.stroke();

      that.ctx2.beginPath();

      that.ctx2.font = 180; // notice no quote
      that.ctx2.fillStyle = "#ffffff";
      that.ctx2.fillText(that.data.oldText + "%", w, h);
      that.ctx2.fillStyle = "#b2b2b2"; // grey
      that.ctx2.textAlign = "center";
      that.ctx2.textBaseline = "middle";
      that.ctx2.fillText(c + "%", w, h);
      that.ctx2.stroke();
      that.setData({oldText:c})
    },
    // animation method 
    canvasTap(start, end, time, w, h) {
      let that = this;
      start++;
      if(start > end) {
        return false;
      }
      that.run(start, w, h);

      that.runTimerid = setTimeout(function () {
        that.canvasTap(start, end, time, w, h)
      }, time)
    },
    draw(percent) {
      const id = 'test'
      const animTime = 500
      if(percent > 100){

        return
      }  
      if(!this.ctx2) {
        const init = (res) => {

          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          this.ctx2 = ctx
        }
				// need call `in(this)` method
        wx.createSelectorQuery().in(this)
          .select('#test')
          .fields({node:true,size:true})
          .exec(init.bind(this))
      }

      let oldPercentValue = this.data.percentage
      this.setData({
        percentage: percent,
        animTime: animTime
      })
      const time = this.data.animTime / (this.data.percentage - oldPercentValue);

      const query = wx.createSelectorQuery().in(this)
      query.select('#test').boundingClientRect((res) => {

        if(percent === 0){
          this.ctx2.clearRect(0,0,res.width,res.height) 
        }

        const w = parseInt(res.width / 2)
        const h = parseInt(res.height / 2)
        if(this.runTimerid) clearTimeout(this.runTimerid)
        this.canvasTap(oldPercentValue, percent, time, w, h)
      }).exec()

    },

  }
})

```

`index.wxml` of `circle-progress`

```
<view class="canvasBox">
  <!--outside circle-->
  <view class="bigCircle"></view>

  <!--inner circle-->
  <view class="littleCircle"></view>

  <canvas type="2d" canvas-id="test"  id="test" class="canvas"></canvas>
</view>
```

`circle-progress`的`index.wxss`

```
/* components/circle-progress/circle-progress.wxss */
.canvasBox {
  height: 500rpx;
  position: relative;
  background-color: white;
}

/* 外部灰色的圆 */
.bigCircle {
  width: 420rpx;
  height: 420rpx;
  border-radius: 50%;
  position: absolute;
  top:0;bottom:0;left: 0;right:0;
  margin:auto auto;
  background-color: #f2f2f2;
}

/* 内部白色的圆 */
.littleCircle {
  width: 350rpx;
  height: 350rpx;
  border-radius: 50%;
  position: absolute;
  top: 0;bottom: 0;left: 0;right: 0;
  margin: auto auto;
  background-color: white;
}

.canvas {
  width: 420rpx;
  height: 420rpx;
  position: absolute;
  top: 0;bottom: 0;left: 0;right: 0;
  margin: auto auto;
  z-index: 99;
}
```


call `circle-progress`

```
	<circle-progress percent="{{percentValue}}" />
```