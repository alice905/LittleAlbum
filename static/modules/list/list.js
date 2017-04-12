// 定义列表页面
define(function(require,exports,moduel){
	require('modules/list/list.css');
	var List = Backbone.View.extend({
		// 绑定事件
		events : {
			// 搜一搜按钮绑定事件
			'tap .search span' : "showSearchView",
			// 返回顶部绑定事件
			'tap .go-top' : 'goTop',
			// 给所有的分类元素绑定事件
			'tap .type li' : 'showTypeView'
		},
		// 定义模板
		tpl : _.template("<a href='#layer/<%=id%>'><img style='<%=style%>' src='<%=url%>'/></a>"),
		// 定义两个变量保存盒子的高度
		leftHeight : 0,
		rightHeight : 0,
		// 定义构造函数
		// 构造函数内有初始化dom的方法，当有新的集合添加进集合的时候
		// ，渲染视图 渲染视图就要拉取数据
		initialize : function(){
		   // 备份this
           var self = this;
           // 初始化dom ,定义一个方法
           this.initDom();
           // 监听集合的变化的时候 渲染
           this.listenTo(this.collection,'add',function(model,collection,options){
           	   // 第一个是模型实例化对象 
           	   // 第二个是集合实例化对象
           	   // 第三个是一些配置
           	   // console.log(arguments);
               // 根据监听到的变化(根据model实例化对象参数)渲染视图
               this.render(model);
           });
           // 拉取数据
           this.getData();
           // 定义窗口滚动事件
           $(window).on('scroll',function(){
           	   if($('body').height() < $(window).scrollTop() + $(window).height() + 200){
                   // 加载页面实际上就是请求数据
                   self.getData();
           	   };
           	   // 显示返回顶部
           	   self.goBack();
           });
		},
		// 初始化dom
		initDom : function(){
			 this.leftContainer = this.$el.find('.left-container');
			 this.rightContainer = this.$el.find('.right-container');
		},
		// 过滤方法
		modulefilter : function(model){
			return this.collection.filter(function(module,index,models){
				return module.get('title').indexOf(model);
			});
		},
		// 定义渲染视图的方法
		render : function(model,title){
			// 备份this
			var self = this;
			// 根据title得到模型
			if(title === 'title'){
                return (function(model){
                   var models = self.modulefilter(model);
                   	_.each(models,function(model){
                        // 得到模板
						 var tpl = self.tpl;
						 // 获取模型的高度和宽度
						 var modelHeight = model.get('viewHeight');
						 var modelWidth = model.get('viewWidth');
						 // 获取数据
						 var data = {
						 	 id : model.get('id'),
						 	 url : model.get('url'),
						 	 style : "width:" + modelWidth + ";height:" + modelHeight + ";"
						 };
						 // 格式化模板，填充数据
						 var html = tpl(data);
						 // 渲染视图 判断两边的高度，往高度低的那一面追加
						 if(self.leftHeight > self.rightHeight){
						     self.renderRight(html,modelHeight);
						 }else{
						     self.renderLeft(html,modelHeight);	
						 };
        	        });               
                })(model);
			}
			// 根据模型得到模型
			return (function(model){
				 // 得到模板
				 var tpl = self.tpl;
				 // 获取模型的高度和宽度
				 var modelHeight = model.get('viewHeight');
				 var modelWidth = model.get('viewWidth');
				 // 获取数据
				 var data = {
				 	 id : model.get('id'),
				 	 url : model.get('url'),
				 	 style : "width:" + modelWidth + ";height:" + modelHeight + ";"
				 };
				 // 格式化模板，填充数据
				 var html = tpl(data);
				 // 渲染视图 判断两边的高度，往高度低的那一面追加
				 if(self.leftHeight > self.rightHeight){
				     self.renderRight(html,modelHeight);
				 }else{
				     self.renderLeft(html,modelHeight);	
				 };
			})(model);
		},
		// 左边渲染视图
		renderLeft : function(html,modelHeight){
             this.leftContainer.append(html);
             // 保存自己这边的高度
             this.leftHeight += modelHeight + 6;
		},
		// 右边渲染视图
		renderRight : function(html,modelHeight){
			this.rightContainer.append(html);
			// 保存右边的高度
			this.rightHeight += modelHeight + 6;
		},
		// 拉取数据
		getData : function(){
			// 通过collection的fetchData方法拉取数据
            this.collection.fetchData();
		},
		// 返回顶部
		goBack : function(){
			 if($(window).scrollTop() > 300){
			 	this.$el.find('.go-top').show();
			 }else{
			 	this.$el.find('.go-top').hide();
			 };
		},
		// 返回顶部点击事件
		goTop : function(){
			window.scrollTo(0,0)
		},
		// 搜一搜按钮绑定事件
		// 获得input的值
		inputVal : function(){
			return this.$el.find('.search input').val();
		},
		// 检测输入的是否合法
		checkInpVal : function(val){
			// 判断输入的内容是否为空，或者是否是空白符
			if(/^\s*$/.test(val)){
				alert("请输入搜索内容！！！");
				return false;
			};
			return true;
		},
		// 根据关键字搜索集合中符合条件的模型
		// val 表示搜索的关键字
		// type表示搜索的类型
		// 返回的值是个模型实例化数组
		searchCollection : function(val,type){
           // 过滤集合中符合条件的类型
           return this.collection.filter(function(model,index,models){
           	   if(type === 'type'){
           	   	   return model.get('type') == val;
           	   };
           	   return model.get('title').indexOf(val) > -1;
           });
		},
        // 清除容器内容
        clearBox : function(){
        	// 清除dom元素
        	this.rightContainer.html('');
        	this.leftContainer.html('');
            // 清除高度
            this.leftHeight = 0;
            this.rightHeight = 0;
        },
        // 更新视图
        Updetrender : function(modelArray){
        	// 备份this
        	var self = this;
        	_.each(modelArray,function(model){
        		// 渲染视图
        		self.render(model);
        	});
        },
        // 点击搜一搜按钮绑定事件 调用以上方法 搜索
		showSearchView : function(){
           // 获取input输入的值
           var InpVal = this.inputVal();
           // 检测输入的值是否合法
           if(!this.checkInpVal(InpVal)){
           	   return;
           };
           // 如果输入合法，去除首尾空白符
           InpVal = InpVal.replace(/^\s+|\s+$/g,'');
           // 如果合法就过滤集合，找到符合条件的模型
           var models = this.searchCollection(InpVal);
           // 清除视图
           this.clearBox();
           // 渲染视图
           this.Updetrender(models);
		},
		// 给所有的分类元素绑定事件 
		// 得到li元素data-id
		LIID : function(dom){
			return $(dom).attr('data-id');
		},
		//  点击li元素调用这个方法
		showTypeView : function(e){
			// 得到id
			var id = this.LIID(e.target);
			// 根据id过滤模型实例化对象
			// 如果'type' == type 就让它的id等于type
			var models = this.searchCollection(id,'type');
			// 清除视图
			this.clearBox();
			// 渲染视图
			this.Updetrender(models);
		}
	});
	// 暴露接口
	moduel.exports = List;
})