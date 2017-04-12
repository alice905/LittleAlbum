// 定义一个模块
define(function(require,exports,moduel){
	// 引入集合模块
	var imgCollection = require('collection');
	// 实例化集合
	var Imgcollection = new imgCollection();
	// 引入首页视图、layer视图和列表视图
    var Index = require('index');
	var List = require('list');
	var Layer = require('layer');
	// 实例化index、layer和list视图
	// 传入dom对象
	var index = new Index({
		// 定义容器元素
		el : $("#app"),
        // 将集合与视图绑定
        collection : Imgcollection
	});
    var layer = new Layer({
    	// 定义容器元素
    	el : $("#app"),
    	// 将集合与视图绑定
    	collection : Imgcollection
    });
    var list = new List({
    	el : $("#app"),
    	// 将集合与视图绑定
    	collection : Imgcollection
    });
	// 写路由
	// 第一步 写路由类
	var router = Backbone.Router.extend({
		// 定义路由规则
		routes : {
			 // 显示列表页
			 'list/:title' : 'showList',
			 // 大图页
			 'layer/:id' : 'showLayer',
             // 显示首页
             '*index' : 'showIndex'
		},
		// 显示首页
		showIndex : function(){
			layer.$el.find('.list').css('display', 'none');
			layer.$el.find('.layer').css('display', 'none');
			// index.render();
		},
		// 显示列表页的方法
		showList : function(title){
			layer.$el.find('.index').css('display', 'none');
			layer.$el.find('.layer').css('display', 'none');
			// 显示列表而
			layer.$el.find('.list').css('display', 'block')
			// list渲染自己页面
			list.render(title,'title');
		},
		// 显示大图页方法
		showLayer : function(id){ 
			// layer渲染自己页面
			layer.render(id);
			layer.$el.find('.layer').show();
		}
	});
	// 实例化路由对象
	var routerClass = new router();
	// 在暴露的接口中开启路由 暴露接口
	moduel.exports = function(){
		Backbone.history.start();
	}
})