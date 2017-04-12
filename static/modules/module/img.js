// 定义图片模块
define(function(require,exports,module){
     // 小图片的宽
     var w = ($(window).width() - 6 * 3) / 2;
	 // 创建图片模型
	 // 在模型类中适配对象
	 var imgModel = Backbone.Model.extend({
          initialize : function(obj){
          	// 适配模型数据，要为图片模型添加真实的宽高
			// 求h（图片的高度）
			h = w / obj.width * obj.height;
			// 适配模型
			// 添加宽度
			this.attributes.viewWidth = w;
			this.attributes.viewHeight = h;
          }
	 });

    // 暴露接口
    module.exports = imgModel;
})