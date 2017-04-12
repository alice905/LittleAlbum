// 定义列表页面
define(function(require,exports,moduel){
	// 引入样式文件
	require('modules/layer/layer.css');
	var Carouselfinger = require('lunbotu');
	// console.log(Carouselfinger)
	// 实例化一个轮播图
	// console.log(lun);
	// 获取窗口的高度
	var h = $(window).height();
	// 获取窗口的宽度
	var w = $(window).width();
	var Layer = Backbone.View.extend({
		// 当前图片的id
		imgId : 0,
		// 把id存到一个数组里
		imgIdArray : [],
		events : {
			// 给图片绑定点击事件 切换头部显示
			'tap .layer-container img' : 'toggleTitle',
			// 给图片绑定滑动事件
			// 向左滑动 显示下一张
			'swipeLeft .layer-container img' : 'showNextImg',
			'swipeRight .layer-container img' : 'showPrevImg',
			// 绑定返回点击事件
			'tap .layer .go-back' : 'goBack'
		},
		// 定义模板
		tpl : _.template($("#template").html()),
		// 定义渲染视图的方法
		render : function(modelId){
			var newmodelId=modelId++;
			var oldmodelId=modelId--;
			// 根据id得到模型
			var model = this.collection.get(modelId);
			var newmodel = this.collection.get(newmodelId);
			var oldmodel = this.collection.get(oldmodelId);
			// 如果模型不n存在，我们要跳转到首页
			if(!model){
				location.href = '';
				return;
			};
			// 如果模型存在，存储id
			this.imgId = model.get('id');
			// 缓存这张图片
            this.imgIdArray.push(this.imgId);
			// 得到模板
			var tpl = this.tpl;
			// 得到数据
			var data = {
				 prevurl : oldmodel.get('url'),
				 nexturl : newmodel.get('url'),
				 url : model.get('url'),
				 title : model.get('title'),
				 style : 'line-height:' + h + "px;"
			};
			// 格式化模板 填充数据 
			var html = tpl(data);
			// 渲染视图
			this.$el.find('.layer').html(html);
			var lunbo = new Carouselfinger('lun');
		},
		// 切换头部显示
		toggleTitle : function(){
			this.$el.find('.layer .header').toggleClass('hide');
		},
		// 更新视图
		UpdetView : function(model,newmodel,oldmodel){
			// 更新图片
			this.$el.find('.layer-container #unit .zhong img').attr('src',model.get('url'));
			// 更新title
			this.$el.find('.layer .header h1').html(model.get('title'));
            if(arguments[1] === true){
            	console.log(oldmodel.get('url'))
			     this.$el.find('.layer-container #unit .previmg img').attr('src',oldmodel.get('url'));
            }else if(arguments[2] === true){
			    this.$el.find('.layer-container #unit .nextimg img').attr('src',newmodel.get('url'));
            }
		},
		// 向左滑动是下张
		showNextImg : function(){
			// console.log(this)
			// 备份老信号量le.
			var newimgid = this.imgId;
			console.log(newimgid);
			this.imgId++;
			// console.log(this.imgId);
			// 根据id获取模型
			var newmodel = this.collection.get(newimgid);
			// console.log(oldmodel);
			var model = this.collection.get(this.imgId);
			if(!model){
				alert("已经是最后一张了");
				this.imgId--;
			}else{			
				// 更新视图
				this.UpdetView(model,newmodel,true);
				// 在id数组里push自己的id
				this.imgIdArray.push(this.imgId);
			};
		},
		// 向右滑动是上一张
		showPrevImg : function(){
			var oldimgId = this.imgId;
			this.imgId--;
			// 根据id获取模型
			var oldmodel = this.collection.get(oldimgId);
			var model = this.collection.get(this.imgId);
			if(!model){
				alert("已经是第一张了");
				this.imgId++;
			}else{
				// 更新视图
				this.UpdetView(model,true,oldmodel);
				// 在id数组里push自己的id
				this.imgIdArray.push(this.imgId);
			};
		},
		// 返回方法
		goBack : function(){
			// 第一种方法 可以直接返回
			// location.href = '';
			// history.go(-1);
			// Backbone.history.location.replace('');
			// 判断，如果imgIdArray还存在长度，就渲染
			// 返回列表页
			this.$el.find('.layer').hide();
		}
	});
	// 暴露接口
	moduel.exports = Layer;
})