define(function(require,exports,module){
	 // 引用图片模块
	 var imgModel = require('imgModel');
	 // 创建集合
	 var imgCollection = Backbone.Collection.extend({
	 	 // 集合与模型有关联
	 	 model : imgModel,
	 	 // 定义id
	 	 imgId : 0,
	 	 // 异步请求数据 定义一个fetchdata方法
	 	 fetchData : function(){
	 	 	// 备份this
	 	 	var self = this;
	 	 	 	// 请求数据
			$.get('data/imageList.json',function(res){
				 if(res && res.errno === 0){
				 	 // 将数据顺序
                     res.data.sort(function(){
                     	 return Math.random() > .5 ? 1 : -1;
                     });
                     // 遍历data设置id属性
					for(var i = 0; i < res.data.length; i++){
						  res.data[i].id = ++self.imgId;
					}
				 	 // 保存数据 需要映射到集合实例化对象的models数组里
				 	 self.add(res.data);
				 }
			});

	 	 }
	 });
    // 暴露接口
    module.exports = imgCollection;
     
})
	