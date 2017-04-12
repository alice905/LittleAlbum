// 定义列表页面
define(function(require,exports,moduel){
	require('modules/index/index.css');
	var Index = Backbone.View.extend({
		// 绑定事件
		events : {
			// 给搜索按钮绑定事件
			'tap .index .bg .inp span' : "showSecrchView",
			// 给所有分类元素绑定事件
			'tap .index .bg .lie li a' : "showLiView"
		},
		// 定义渲染视图的方法
		render : function(title){
            // 跳转到列表页，让列表页渲染
            window.location.href = 'http://127.0.0.1/baidupicture/#list/'+ title +'';
		},
		// 给所有的分类元素绑定事件
		// 得到li的data-liid
		LIiD : function(dom){
			return $(dom).attr('data-title');
		},
		// 点击li元素调用这个方法
		showLiView : function(e){
			console.log(e.target);
			// 得到id
			var title = this.LIiD(e.target);
			console.log(title);
			this.render(title);
		}
	});
	// 暴露接口
	moduel.exports = Index;
})