define(function(require,exports,module){
    // 指滑轮播图构造函数
  function Carouselfinger(id){
      // 自己的dom元素
      this.dom = document.getElementById(id);
      // console.log(this.dom);
      // 自己的ul
      this.unit = document.querySelector("#unit");
      // 自己所有的li
      this.lis = document.querySelectorAll("#unit li");
      // li的长度
      this.lilength = this.lis.length;
      // 自己所有的图片
      this.imgs = document.querySelectorAll("#unit li img");
      // 屏幕的宽度
      this.w = document.documentElement.clientWidth;
      this.h = $(window).height();
      // 信号量
      this.nowidx = 0;
      // 当图片加载完毕之后，让轮播图（ul）显示
      // 计数，加载图片
      var count = 0;
      var self = this;
      for(var i = 0; i < this.lilength; i++){
        this.imgs[i].onload = function(){
              count++;
            if(count == self.lilength){
              // 让ul显示
              self.unit.style.display = "block";
              // 让图片的高等于自己的dom的高
              self.dom.style.height = this.h;
            };
        };
      };
      // 轮播图的宽度
      this.width = this.w;
      // 加载完毕之后，设置所有图片的初始位置
      for(var i = 1; i <= this.lilength - 1; i++){
          this.lis[i].style.transform = "translate("+ this.width +"px)";
          this.lis[i].style.webkitTransform = "translate("+ this.width +"px)";
      }

      // 绑定监听 用dom二级事件
      // 开始触摸
      this.dom.addEventListener("touchstart", function(event){
           // 调用自己的方法
           self.touchstarthandler(event);
      }, true);
      // 开始移动
      this.dom.addEventListener("touchmove", function(event){
           // 调用自己的方法
           self.touchmovehandler(event);
      }, true);
      // 触摸结束
      this.dom.addEventListener("touchend", function(event){
           // 调用自己的方法
           self.touchendhandler(event);
      }, true);
      
      // 窗口重置事件
      window.addEventListener("resize", function(event){
          // 重新获得宽度
          self.width = parseInt(window.getComputedStyle(self.dom)["width"]);
          // 给图片编号 先判断号码是否超过图片数量，
          var next = self.nowidx + 1 <= self.lilength - 1 ? self.nowidx + 1 : 0;
          var prev = self.nowidx - 1 >= 0 ? self.nowidx - 1 : self.lilength - 1;
          // 获得所有元素的初始位置
          for(var i = 0; i <= self.lilength - 1; i++){
             self.lis[i].style.transition = "none";
             self.lis[i].style.transform = "translateX("+ self.width +"px)";
             self.lis[i].style.webkitTransform = "translateX("+ self.width +"px)";
          }
          // 让中间图片瞬移到相应的位置
          self.lis[self.nowidx].style.transform = "translateX(0)";
          // 获取高度
          self.dom.style.height = parseInt(window.getComputedStyle(self.lis[0])["height"]); 
      }, true);

  }

  // 开始触摸事件
  Carouselfinger.prototype.touchstarthandler = function(event){
       // 阻止默认事件
       event.preventDefault();
       var finger = event.touches[0];
       // 记录开始坐标
       this.startX = finger.clientX;
       // 记录开始还触摸的时间
       this.startTime = event.timeStamp;
  }

  // 开始移动事件
  Carouselfinger.prototype.touchmovehandler = function(event){
        // 阻止默认事件
      event.preventDefault();
      var finger = event.touches[0];
      // 得到偏移量
      this.dX = finger.clientX - this.startX;
      // 给图片编号 先判断号码是否超过图片数量，
      var next = this.nowidx + 1 <= this.lilength - 1 ? this.nowidx + 1 : 0;
      var prev = this.nowidx - 1 >= 0 ? this.nowidx - 1 : this.lilength - 1;

      // 给图片去掉过渡
      this.lis[this.nowidx].style.transition = "none";
      this.lis[next].style.transition = "none";
      this.lis[prev].style.transition = "none";
      // 编完号之后让图片移动
      this.lis[this.nowidx].style.transform = "translate("+ this.dX +"px)";
      this.lis[next].style.transform = "translate("+ (this.width + this.dX) +"px)";
      this.lis[prev].style.transform = "translate("+ (-this.width + this.dX) +"px)";

      // 编完号之后让图片移动 兼容写法
      this.lis[this.nowidx].style.webkitTransform = "translate("+ this.dX +"px)";
      this.lis[next].style.webkitTransform = "translate("+ (this.width + this.dX) +"px)";
      this.lis[prev].style.webkitTransform = "translate("+ (-this.width + this.dX) +"px)";
  }

  // 触摸结束事件
  Carouselfinger.prototype.touchendhandler = function(event){
      // 阻止默认事件
      event.preventDefault();
      var finger = event.touches[0];
      // 得到总的触摸时间
      this.d = event.timeStamp - this.startTime;
      // 给图片编号 先判断号码是否超过图片数量，
      var next = this.nowidx + 1 <= this.lilength - 1 ? this.nowidx + 1 : 0;
      var prev = this.nowidx - 1 >= 0 ? this.nowidx - 1 : this.lilength - 1;
      // 触摸结束后判断dX值是否超过图片的中线，如果超过则滑动成功
      // 如果用户的触摸时间小于200，也判断滑动成功
      // 判断向左滑动 向左滑动的时候不考虑上一张了
      if(this.dX < -this.width / 2 || this.d < 200 && this.dX < -20){
          // 向左滑动成功
          // 设置过渡
          if(this.d > 200){
             this.lis[this.nowidx].style.transition = "all 0.3s ease 0s";
             this.lis[next].style.transition = "all 0.3s ease 0s";
          }else{
             this.lis[this.nowidx].style.transition = "all 0.1s ease 0s";
             this.lis[next].style.transition = "all 0.1s ease 0s";
          };

          // 让图片移动
          this.lis[this.nowidx].style.transform = "translateX("+ -this.width +"px)";
          this.lis[next].style.transform = "translateX("+ 0 +"px)";

          // 让图片移动 兼容写法
          this.lis[this.nowidx].style.webkitTransform = "translateX("+ -this.width +"px)";
          this.lis[next].style.webkitTransform = "translateX("+ 0 +"px)";
          // 改变信号量
          this.nowidx = next;
      }else if(this.dX < 0){
          // 向左滑动没有成功
          this.lis[this.nowidx].style.transition = "all 0.3s ease 0s";
          this.lis[next].style.transition = "all 0.3s ease 0s";

          // 让图片移动
          this.lis[this.nowidx].style.transform = "translateX("+ 0 +"px)";
          this.lis[next].style.transform = "translateX("+ this.width +"px)";

          // 让图片移动 兼容写法
          this.lis[this.nowidx].style.webkitTransform = "translateX("+ 0 +"px)";
          this.lis[next].style.webkitTransform = "translateX("+ this.width +"px)";
      }else if(this.dX > this.width / 2 || this.d < 200 && this.dX > -20){
          // 向右滑动成功
          // 设置过渡
          if(this.d > 200){
             this.lis[this.nowidx].style.transition = "all 0.3s ease 0s";
             this.lis[prev].style.transition = "all 0.3s ease 0s";
          }else{
             this.lis[this.nowidx].style.transition = "all 0.1s ease 0s";
             this.lis[prev].style.transition = "all 0.1s ease 0s";
          };

          // 让图片移动
          this.lis[this.nowidx].style.transform = "translateX("+ this.width +"px)";
          this.lis[prev].style.transform = "translateX("+ 0 +"px)";

          // 让图片移动 兼容写法
          this.lis[this.nowidx].style.webkitTransform = "translateX("+ this.width +"px)";
          this.lis[prev].style.webkitTransform = "translateX("+ 0 +"px)";
          // 改变信号量
          this.nowidx = prev;
      }else if(this.dX > 0){
          // 向右滑动没有成功
          this.lis[this.nowidx].style.transition = "all 0.3s ease 0s";
          this.lis[prev].style.transition = "all 0.3s ease 0s";

          // 让图片移动
          this.lis[this.nowidx].style.transform = "translateX("+ 0 +"px)";
          this.lis[prev].style.transform = "translateX("+ -this.width +"px)";

          // 让图片移动 兼容写法
          this.lis[this.nowidx].style.webkitTransform = "translateX("+ 0 +"px)";
          this.lis[prev].style.webkitTransform = "translateX("+ -this.width +"px)";
      }

    }
   // 暴露接口
   module.exports = Carouselfinger;
})
