var Base = {};

Base.config={
	 'defaultIndex'	:	0							//默认屏
	,'winW'			:	$(window).width()			//窗宽
	,'winH'			:	$(window).height()			//窗高
	,'appSize'		:	{'big':90,'small':60}		//图标大小%
	,'appPos'		:	{'left':50,'top':25}		//第一个图标的偏移量
	,'appOrder'		:	'y'							//图标排列方式,横向:x	纵向:y
	,'appIcoSize'	:	'big'						//图标大小,  大图标:big  小图标:small
	//,'taskBarH'		:	64							//任务栏高度
	,'deskTopW'		:	$(window).width()-68		//APP容器宽度
	,'deskTopH'		:	$(window).height()-30		//APP容器高度
	,'dockPos'		:	'left'						//应用码头位置left,top,right
	,'currentApp'	:	null
	,'taskBarApp'	:	null
};

//初始化
Base.sysInit = function(){
	//this转向,当函数中有定时器和事件绑定函数时,使用_this
	var _this=this;
	$(window).bind('load',function(){
		if ($.browser.msie){
			$.dialog({
				content	:	'Please Update Your Broswer',
				title	:	'Oops,IE Browser',
				width	:	350,
				height	:	150	,
				max		:	false,
				min		:	false,
				resize	:	false,
				ok		:	function(){ window.location.href='https://www.google.com/intl/zh-TW/chrome/browser/' }
			});
			return false;
		};
		
		//确定几个变量(属性)的上次记录Cookie
		//排序方式
		_this.config.appOrder =	getCookie('appOrder')?getCookie('appOrder'):'y';
		//图标大小
		_this.config.appIcoSize	= getCookie('appIcoSize')?getCookie('appIcoSize'):'big';
		//码头位置
		//_this.config.dockPos = getCookie('dockPos')?getCookie('dockPos'):'left';
		
		//创建图标
		_this.createApp();
		//?
		_this.loadInit();
		//?
		_this.manage();
		//给码头加拖拽功能
		//_this.dockBarDrag();
		//版本更新小窗
		$.dialog({
			id: 'msg',
			time:5,
			zIndex:2,
			title: 'Hello World',
			content: '2013/8/8',
			width: 200,
			height: 100,
			left: '100%',
			top: '100%',
			fixed: true,
			drag: false,
			min: false,
			max: false
		});
	});
	
	//窗口重置
	$(window).bind('resize',function(){
		_this.winResize();
	});	
};
//init函数执行完毕


//创建应用?桌面图标
Base.createApp=function(){

	var _this				=	this
		//空的桌面
		,desktopsContainer 	=	$('<div class="desktopsContainer desk_left" ></div>')
		//空的码头
		,dockBar 		  	=	$('<div class="dockBar"></div>')
		,topBar		  		=	$('<div class="topbar-mod"></div>')
		//应用数据引入进来
		,appData 			=	data.app
		,applength 			=	appData.length
		//图标路径
		,imgSrc 			=	'image/appIco/'
		,_left 				=	_this.config.appPos.left
		,_top 				=	_this.config.appPos.top;
	//填充桌面数据
	for(var i=1;i<6;i++){
		//cookie设置了默认big
		var appListContainer=	$('<div class="appListContainer folder_bg_'+i+' '+(_this.config.appIcoSize=='small'?'small':'')+'" ></div>')
		   	,app			=	null
		   	,pos			=	null
			,deskTopH		=	_this.config.deskTopH		//app容器尺寸
			,deskTopW		=	_this.config.deskTopW
			,left			=	_this.config.appPos.left	//
			,top			=	_this.config.appPos.top
			,bigSize		=	_this.config.appSize.big
			,smallSize		=	_this.config.appSize.small
			,order			=	_this.config.appOrder
			,icoSize		=	_this.config.appIcoSize;
		
		for(var j=0;j<applength;j++){
			var id='app_'+appData[j].colum+'_'+createRandomNum();
			//判断是否在当前屏,不在当前屏,略过直接执行重置偏移量和append
			if(appData[j].colum != i) continue;
			
			//给应用Icon赋值
			app = $('<div url="'+appData[j].url+'" height="'+appData[j].height+'" width="'+appData[j].width+'" id="'+id+'" type="'+appData[j].type+'" class="app" style="left:'+_left+'px;top:'+_top+'px"><span class="appIco"><img src="'+imgSrc+appData[j].appIco+'"></span><span class="appName">'+appData[j].appName+'</span></div>');
			//计算app的偏移量 ,这个函数很重要!
			pos=countAppPos(order,icoSize,_left,_top,left,top,deskTopW,deskTopH,bigSize,smallSize);
			_left =	 pos.left;
			_top  =	 pos.top;
			appListContainer.append(app);
			//console.log(pos.left + ':::'+pos.top)
			//判断当前app是否为文件夹
			if(appData[j].data){
				var quick_view_container=$(data.template.folder);
				quick_view_container.attr('id',id);
				for(var n=0,folderData=appData[j].data;n<folderData.length;n++){
					app = $('<div url="'+folderData[n].url+'" height="'+folderData[n].height+'" width="'+folderData[n].width+'" id="app_'+folderData[n].colum+'_'+createRandomNum()+'" type="'+folderData[n].type+'" class="app"><span class="appIco"><img src="'+imgSrc+folderData[n].appIco+'"></span><span class="appName">'+folderData[n].appName+'</span></div>');
					quick_view_container.find('.quick_view_container_list').append(app);
				};
				$('body').append(quick_view_container);
			};
		};
		_left =	_this.config.appPos.left,		//分屏时候重置偏移量
		_top  =	_this.config.appPos.top;
		desktopsContainer.append(appListContainer);
		
	};
	
	
	//填充码头数据
	for(var i=0;i<applength;i++){
		if(appData[i].colum != 'dock') continue;
		var app = $('<div url="'+appData[i].url+'" height="'+appData[i].height+'" width="'+appData[i].width+'" id="app_'+appData[i].colum+'_'+createRandomNum()+'" type="'+appData[i].type+'" class="app"><span class="appIco"><img src="'+imgSrc+appData[i].appIco+'"></span><span class="appName">'+appData[i].appName+'</span></div>');
		dockBar.append(app);	
	}
	
	//填充任务栏
	//var oTitle = $('<h1>'+_this.config.currentApp.appName+'</h1>');
	var oTitle = $('<h1>Ubuntu</h1>');
	var oTools = $('<ul class="topbar-tools"></ul>');
	
	var oTopbarEmail = $('<li class="topbar-email"><i class="icon xs email"></i></li>');
	var oTopbarCalendar = $('<li class="topbar-calendar"></li>');
	var oTopbarExit = $('<li class="topbar-exit"><i class="icon xs setting"></i></li>');
	oTools.append(oTopbarEmail).append(oTopbarCalendar).append(oTopbarExit);
	
	
	$('body').append(topBar.append(oTitle).append(oTools)).append(desktopsContainer).append(dockBar.append(data.template.dockTool));
	
	
};

//加载其他项
Base.loadInit=function(){
	var _this		=	this
		,deskTopPos	=	null;
	
	//dockBar修改位置,默认为left
	changeDockPos();

	//desk位置
	deskTopPos = countDeskTopPos();											//计算app容器高宽
	console.log(deskTopPos);//Object {width: 1612, height: 490} 
	
	$('body').append($(data.template.navBar)).append($(data.template.bodyPaper)).append($(data.template.taskBar));
	$('body').append($(data.template.bodyPaper));
	appDrag($('.navBar'));															//绑定nav拖拽事件%	
	$('.bodyPaper').height(_this.config.winH).width(_this.config.winW);					//调整桌面壁纸
	
	//$('.navBar .nav_num').eq(_this.config.defaultIndex).addClass('current');
	$('.desktopsContainer').width(deskTopPos.width).height(deskTopPos.height);
	$('.appListContainer').eq(_this.config.defaultIndex).addClass('deskCurrent').siblings().css('left',_this.config.winW); //默认显示屏幕,其他在屏幕外
	
	//桌面设置
	//$('.dock-tool-setting').bind('click',function(){setDeskTop()});
	//背景设置
	//$('.dock-tool-style').bind('click',function(){setBackground()});
	
	//顶部工具
	$('.topbar-exit').bind('click',function(){
		exitUbuntu();
	});
	
	$(window).bind('beforeunload',function(){
		//return "leave or?";
	});
	
	//右键菜单
	$(document).bind('contextmenu',function(e){
		_this.createConTextMenu(data.menu.bodyMenu,e,'bodyMenu');	
		//阻止默认右键菜单	
		return false;
	});
	
	//右键菜单
	$('.dockBar').bind('contextmenu',function(e){
		//当管理时候不执行右键
		if(!$('.manageClose').length){
			_this.createConTextMenu(data.menu.dockMenu,e,'dockMenu');
			//初始化时候判断当前位置
			switch(_this.config.dockPos)
			{
				case 'left':
					console.log('1111')
					$('.dockBarLeft').prepend($('.dockBarLeft').siblings().find('i'));
					break;
				case 'right':
					$('.dockBarRight').prepend($('.dockBarRight').siblings().find('i'));
					break;
				case 'top':
					$('.dockBarTop').prepend($('.dockBarTop').siblings().find('i'));
					break;
			};
		};
		return false;
	});
	//排除add按钮
	$('.app[type!="add"]').each(function(){
		appDrag($(this));
		$(this).bind('contextmenu',function(e){
			_this.config.currentApp = $(this);
			_this.createConTextMenu(data.menu.appMenu,e,'appMenu');	
			return false;
		});
		if($(this).attr('type') != 'folder')
		{
			$(this).bind('click',function(){
				_this.config.currentApp = $(this);
				openAppFun();
			})
		};
		
	});
	//add按钮禁止拖拽
	$('.app[type="add"]').bind('mousedown',function(){
		return false;
	});
	
	//预览文件夹
	$('.app[type="folder"]').each(function(){
		$(this).bind('click',function(){
			_this.config.currentApp = $(this);
			appViewFolder($(this));	
		});
		$(this).bind('contextmenu',function(e){
			_this.config.currentApp = $(this);
			_this.createConTextMenu(data.menu.folderMenu,e,'folderMenu');
			$('.quick_view_container').hide();	
			return false;
		});
		
	});
	
	
	//关闭右键
	$(document).bind('click',function(){
		$('.conTextContainer').hide();
		
		if(!_this.config.currentApp || _this.config.currentApp.attr('type') != 'folder')
		{
			$('.quick_view_container').hide();
		}
		_this.config.currentApp	= null;
	});
};

//窗口缩放
Base.winResize = function(){
	var _this		=	this
		,deskTopPos	=	null;
	_this.config.winW		=	$(window).width();	
	_this.config.winH		=	$(window).height();
	_this.config.deskTopW	=	$(window).width()-73						//APP容器宽度
	_this.config.deskTopH	=	$(window).height()-64-30
	deskTopPos 				=	 countDeskTopPos();							//计算app容器高宽
	$('.bodyPaper').height(_this.config.winH).width(_this.config.winW);		//调整桌面壁纸
	$('.desktopsContainer').width(deskTopPos.width).height(deskTopPos.height);
	$('.appListContainer').eq(_this.config.defaultIndex).addClass('deskCurrent').siblings().css('left',_this.config.winW);
	Base.appOrder(Base.config.appOrder);
	if($('.manageClose').length)
	{
		$('.desktopsContainer').width(_this.config.winW).height(_this.config.winH-82);
		$('.appListContainer').width(_this.config.winW/5).height(_this.config.winH-82);
	}	
};

//管理图标
Base.manage=function(){
	var _this=this;
	//切换屏幕
	$('.navBar .nav_num').bind('click',function(){
		
		$(this).addClass('current').siblings('.nav_num').removeClass('current');//数字状态
		var index=$(this).index()-1;//当前索引值
		//判断索引值是否当前屏幕
		if($('.deskCurrent').index()!=index)
		{
			$('.deskCurrent').animate({left:-_this.config.winW},200,function(){
				$(this).css('left',_this.config.winW).removeClass('deskCurrent');	
			});
			$('.appListContainer').eq(index).animate({left:0},200,function(){
				$(this).addClass('deskCurrent');	
			})	
		};
		_this.config.defaultIndex=index;
	});
	//打开管理
	$('.navBar .nav_manage').bind('click',function(){
		//判断是否处于动画中
		if(!$('.shadeBg').is(":animated")){
			$('.shadeBg').animate({opacity:0.2});//背景变深
		}
		showDeskTop();//显示桌面
		$('.dock-toollist').hide();
		$('.app[type="add"]').hide();
		$('body').append('<a class="manageClose"></a>');//生成退出按钮
		$('.navBar').hide();//隐藏导航栏
		$('.dockBar').addClass('dockManage');//dock添加类名
		$('.desktopsContainer').addClass('manage').width(_this.config.winW).height(_this.config.winH-82);//添加manage类名
		$('.appListContainer').width(_this.config.winW/5).height(_this.config.winH-82);//桌面缩放
		$('.taskBar').hide();
		//关闭管理		
		$('.manageClose').bind('click',function(){
			if(!$('.shadeBg').is(":animated")){
				$('.shadeBg').animate({opacity:0});//背景变深
			}
			$('.dock-toollist').show();
			$('.app[type="add"]').show();
			$(this).remove();//移除退出菜单
			$('.navBar').show();//导航栏显示
			$('.dockBar').removeClass('dockManage');//移除类名
			$('.desktopsContainer').removeClass('manage');//移除类名
			$('.desktopsContainer').width(_this.config.deskTopW).height(_this.config.deskTopH);//桌面还原
			$('.taskBar').show();
		});
	});		
};
/**********************
 * 功能：图标排列		 *
 * 参数:order:排列类型 *
 * 时间:2013/03/08   *
 ********************/
Base.appOrder = function(order){
	var _this		=	this
	    ,_left		=	_this.config.appPos.left		//读取配置左偏移量
		,_top		=	_this.config.appPos.top		//读取配置上偏移量
		,deskTopH	=	_this.config.deskTopH		//app容器尺寸
		,deskTopW	=	_this.config.deskTopW
		,left		=	_this.config.appPos.left	//
		,top		=	_this.config.appPos.top
		,bigSize	=	_this.config.appSize.big
		,smallSize	=	_this.config.appSize.small
		,order		=	_this.config.appOrder
		,icoSize	=	_this.config.appIcoSize
		,colum		=	_this.config.defaultIndex
		,pos		=	null;
	//先遍历5屏的container
	$('.appListContainer').each(function(i){
		//如果是当前屏时候动画切换
		if(colum==i)
		{
			$(this).find('.app').each(function(){
				if(!$(this).is(":animated")){
					$(this).animate({top:_top,left:_left},350);
				};
				pos=countAppPos(order,icoSize,_left,_top,left,top,deskTopW,deskTopH,bigSize,smallSize);
				_left=pos.left;
				_top=pos.top;	
			});
		}
		else
		{
			$(this).find('.app').each(function(){
				$(this).css({top:_top,left:_left});	
				pos=countAppPos(order,icoSize,_left,_top,left,top,deskTopW,deskTopH,bigSize,smallSize);
				_left=pos.left;
				_top=pos.top;	
			});
		};
		//还原偏移量
		_left = left;
		_top  =	top;
	});
	
};
/*****************************************************
 * 功能：根据类名绑定右键菜单事件									 *
 * 时间：2013年3月8号									 *
 *****************************************************/
Base.menuEvent = function(){
	var _this = this;
	//取消二级li点击隐藏
	$('.subMenuItem').bind('click',function(){
		return false;	
	});
	//图标纵向排列y
	$('.settCol').bind('click',function(){
		//执行重绘方法
		setAppOrder('setOrder','y',$(this),$('.setRow'));
	});
	//图标横向排列x
	$('.setRow').bind('click',function(){
		//执行重绘方法
		setAppOrder('setOrder','x',$(this),$('.settCol'));
	});
	//大图标排列
	$('.setBig').bind('click',function(){
		//执行重绘方法
		setAppOrder('setSize',_this.config.appOrder,$(this),$('.setSmall'),'big');
	});
	//小图标排列
	$('.setSmall').bind('click',function(){
		//执行重绘方法
		setAppOrder('setSize',_this.config.appOrder,$(this),$('.setBig'),'small');
	});
	//任务栏停靠-左
	$('.dockBarLeft').bind('click',function(){
		setDockBarPos($(this),'left');
	});
	//任务栏停靠-右
	$('.dockBarRight').bind('click',function(){
		setDockBarPos($(this),'right');
	});
	//任务栏停靠-上
	$('.dockBarTop').bind('click',function(){
		setDockBarPos($(this),'top');
	});
	//文件夹目录预览
	$('.viewFolder').bind('click',function(){
		appViewFolder(_this.config.currentApp);	
	});
	//移动到其他屏幕
	$('.moveDeskTop').bind('click',function(){
		//排除移除到当前屏幕
		$('.appListContainer').eq($(this).index()).find('.app[type="add"]').before(_this.config.currentApp);
		//排序
		_this.appOrder(_this.config.appOrder);
		//提示信息
		ZENG.msgbox.show('APP移动成功', 4, 1000);
		//隐藏菜单
		$('.conTextContainer').hide();
	});
	//移动到码头栏目
	$('.moveDock').bind('click',function(){
		//判断码头app个数
		if($('.dockBar .app').length<6)
		{
			//插入到码头栏
			$('.dockBar').append(_this.config.currentApp);
			//排序
			_this.appOrder(_this.config.appOrder);
		}
		else
		{
			ZENG.msgbox.show('应用码头最多只能放置6个APP', 1, 1000);
		};		
		//隐藏菜单
		$('.conTextContainer').hide();
	});
	//删除应用
	$('.delApp').bind('click',function(){
		var currentApp	= 	_this.config.currentApp
			,id			=	currentApp.attr('id');
		//判断是否是ie
		if(document.all)
		{
			//ie直接删除，透明要出问题
			currentApp.remove();
			Base.appOrder(Base.config.appOrder);//正常排列
			//提示信息
			ZENG.msgbox.show('APP删除成功', 4, 1000);
		}
		else
		{
			//判断是否动画中
			if(!currentApp.is(":animated")){
				//非IE渐变
				currentApp.animate({opacity:0},500,function(){
					currentApp.remove();
					Base.appOrder(_this.config.appOrder);//正常排列
					//提示信息
					ZENG.msgbox.show('APP删除成功', 4, 1000);
				});	
			};
		};
		//判断是否文件夹
		if($('.quick_view_container[id="'+id+'"]').length)
		{
			$('.quick_view_container[id="'+id+'"]').remove();	
		};
		$.dialog({id:id}).close();
	});
	//新建文件夹
	$('.addFolder').bind('click',function(){
		$.dialog({
			id		:	'addfolder',
			title	:	'新建文件夹',
			width	:	350,
   			height	:	150,
   			content	:	data.template.createFolder,
			ok: function () {
				var app						=	null
					,_v						=	$('.folderInput .folderName').val()
					,quick_view_container	=	$(data.template.folder)
					,id						=	'app_'+(Base.config.defaultIndex+1)+'_'+createRandomNum();
    			if(!_v)
				{
					ZENG.msgbox.show('请输入文件夹名称', 1, 1000);
					$('.folderInput .folderName').focus();
					return false;
				};
				app=$('<div class="app" type="folder" id="'+id+'" width="400" height="300" url=""><span class="appIco"><img src="'+$('.folderSelector img').attr('src')+'"></span><span class="appName">'+_v+'</span></div>');
				$('.deskCurrent').find('.app[type="add"]').before(app);//插入到增加app按钮掐前面
				quick_view_container.attr('id',id);
				$('body').append(quick_view_container);
				Base.appOrder(Base.config.appOrder);
				appDrag(app);
				app.bind('click',function(){
					appViewFolder($(this));	
				}).bind('contextmenu',function(e){
					_this.config.currentApp = $(this);
					_this.createConTextMenu(data.menu.folderMenu,e,'folderMenu');	
					return false;
				});
				ZENG.msgbox.show('文件夹添加成功', 4, 1000);
   			},
   			cancelVal: '取消',
			cancel: true,
			max: false,
    		min: false,
			resize:false
		});
		$(".folderSelector").bind('click',function(){
			if(!$('.folderList').is(':visible'))
			{
				$('.folderList').show();		
			};
		 });
		$('.folderList li').bind('click',function(){
			$('.folderSelector img').attr('src',$(this).find('img').attr('src'));
			$('.folderList').hide();	
		});
		//隐藏菜单
		$('.conTextContainer').hide();
	});
	//添加应用
	$('.addApp').bind('click',function(){
		$.dialog({
			id		:	'addapp',
			title	:	'新建应用',
			width	:	430,
   			height	:	230,
   			content	:	'url:addApp.html',
			ok		: function(){
						var frameDocument	=	 getIframeDocument(document.getElementsByTagName('iframe')[0])
							,_name			= 	frameDocument.getElementById('name').value
							,_url			= 	frameDocument.getElementById('url').value
							,_width			= 	frameDocument.getElementById('width').value
							,_height		= 	frameDocument.getElementById('height').value
							,_pos			=	frameDocument.getElementById('deskPos').value
							,app			=	null
							,id				=	'app_'+(_this.config.defaultIndex+1)+'_'+createRandomNum();
						if(!_name || !_url || !_width || !_height)
						{
							ZENG.msgbox.show('请填写完整', 1, 1000);
							return false;
						};
						app=$('<div class="app" type="app" id="'+id+'" width="'+_width+'" height="'+_height+'" url="'+_url+'"><span class="appIco"><img src="image/appIco/ie.png"></span><span class="appName">'+_name+'</span></div>');
						if(_pos == 'dock')
						{
							$('.dockBar').append(app);//插入到码头栏
						}
						else
						{
							$('.appListContainer').eq(_pos).find('.app[type="add"]').before(app);	
						}
						Base.appOrder(_this.config.appOrder);
						appDrag(app);
						app.bind('click',function(){
							_this.config.currentApp = $(this);
							openAppFun();
						}).bind('contextmenu',function(e){
							_this.config.currentApp = $(this);
							_this.createConTextMenu(data.menu.appMenu,e,'appMenu');	
							return false;
						});
						ZENG.msgbox.show('APP添加成功', 4, 1000);
					},
			cancelVal	:	'取消',
			cancel		:	true,
			max			:	false,
    		min			:	false,
			resize		:	false
		});
		//隐藏菜单
		$('.conTextContainer').hide();
	});
	//关于
	$('.about').bind('click',function(){
		var lhgdialoglink = $('#lhgdialoglink')
			,href=lhgdialoglink.attr('href');
		lhgdialoglink.attr('href',href.replace('mac','idialog'));//更改样式
		$.dialog({
			lock	:	true,
			content	:	'姓名:于晓<br/>性别:男<br/>年龄:27<br/>邮箱:yuchav@foxmail.com<br/>现居地:上海',
			title	:	'About me',
			skin	:	'idialog',
			width	:	430,
   			height	:	230	,
			max		:	false,
    		min		:	false,
			resize	:	false,
			close	:	function()
						{
							lhgdialoglink.attr('href',href.replace('idialog','mac'));//还原样式
						}
		});
	});
	
	//锁屏
	$('.lockcolum').bind('click',function(){
		$.dialog({
			lock	:	true,
			content	:	'url:lock.html',
			title	:	'Please Login',
			width	:	350,
   			height	:	150	,
			max		:	false,
    		min		:	false,
			resize	:	false,
			ok		:	function()
						{
							ZENG.msgbox.show('Please Login', 4, 2000);
						},
			cancelVal	:	'取消',
			cancel		:	true
		});	
	});
	
	//壁纸设置
	$('.setBackground').bind('click',function(){
		setBackground();
	});
	
	//桌面设置
	$('.setDeskTop').bind('click',function(){
		setDeskTop();
	});
	
	//桌面设置
	$('.upFile').bind('click',function(){
		ZENG.msgbox.show('正在开发', 4, 2000);
	});
	
	//打开应用
	$('.openApp').bind('click',function(){
		openAppFun();
	});
	
	//删除任务栏
	$('.closeWin').bind('click',function(){
		$.dialog({id:_this.config.taskBarApp.attr('id')}).close();
	});
	//还原
	$('.returnWin').bind('click',function(){
		$.dialog({id:_this.config.taskBarApp.attr('id')}).show();
	});
	//最小
	$('.minWin').bind('click',function(){
		$.dialog({id:_this.config.taskBarApp.attr('id')}).hide();
	});
	//最大化
	$('.maxWin').bind('click',function(){
		$.dialog({id:_this.config.taskBarApp.attr('id')}).show().max();
	});
	//显示桌面
	$('.showDeskTop').bind('click',function(){
		showDeskTop();
	});
	//编辑应用
	$('.editApp').bind('click',function(){
		//。。。。
	})
};
//获取iframe文档对象
var getIframeDocument = function(element) {   
    return  element.contentDocument || element.contentWindow.document;   
};  
/*****************************************************
 * 功能：创建右键菜单									 *
 * 参数：menu:菜单数据,e:鼠标事件对象,className:菜单区域类名 *
 * 时间：2013年3月8号									 *
 *****************************************************/
Base.createConTextMenu = function(menu,e,className){
	var imgPath='image/menuIco/',//图标路径
		_left=e.clientX,//鼠标横坐标
		_top=e.clientY;//鼠标纵坐标
	
	//判断是否有生成右边菜单
	if($('.'+className).length==0){
		var conTextContainer='<div class="conTextContainer '+className+'"><ul class="menu">';
		//循环第一级菜单
		for(var i=0;i<menu.length;i++)
		{
			//判断是否有二级菜单
			if(menu[i].subMenu)
			{
				var subMenu=menu[i].subMenu;//获取二级菜单对象
				conTextContainer+='<li class="'+menu[i].className+'"><span>'+(menu[i].ico?'<i><img src="'+imgPath+menu[i].ico+'"/></i>':'')+(menu[i].name?menu[i].name:'')+'</span><div class="subMenuContainer"><ul class="subMenu">';
				//遍历二级菜单
				for(var j=0;j<subMenu.length;j++)
				{
					conTextContainer+='<li class="'+subMenu[j].className+'">'+(subMenu[j].ico?'<i><img src="'+imgPath+subMenu[j].ico+'"/></i>':'')+(subMenu[j].name?subMenu[j].name:'')+'</li>';
				}
				//拼接二级菜单结束标签
				conTextContainer+='</ul></div>';
			}
			else
			{
				//判断是否有name，否则为分割线,并且name空
				conTextContainer+='<li class="'+menu[i].className+'">'+(menu[i].ico?'<i><img src="'+imgPath+menu[i].ico+'"/></i>':'')+(menu[i].name?menu[i].name:'')+'</li>';
			}
		};
		//拼接结束标签
		conTextContainer+='</ul></div>';
		//插入body里面
		$('body').append(conTextContainer);
		//取消在菜单上面右击默认行为
		$('.conTextContainer').bind('contextmenu',function(){
			return false;	
		}).bind('click',function(){
			$(this).hide();	//点击菜单后统一隐藏菜单
		});;
		//分别对菜单绑定事件
		Base.menuEvent();
	};
	//第一步隐藏所有右键菜单
	$('.conTextContainer').hide();
	//第二步根据类名判断位置,是否超出右边屏幕
	if(_left+$('.'+className).width()>=$(window).width())
	{
		//在鼠标左边显示
		_left=_left-$('.'+className).width();
		//判断该菜单下是否有二级菜单
		if($('.'+className).find('.subMenuContainer').length>0)
		{
			//二级菜单定位到左边
			$('.'+className).find('.subMenuContainer').css('left',-145);
		};
	}
	else
	{
		//判断该菜单下是否有二级菜单
		if($('.'+className).find('.subMenuContainer').length>0)
		{
			//没有超出右边屏幕时候还原二级菜单定位在右边
			$('.'+className).find('.subMenuContainer').css('left',140);
		};
	}
	//是否超出屏幕底部
	if(_top+$('.'+className).height()>=$(window).height())
	{
		//菜单在鼠标顶部显示
		_top=_top-$('.'+className).height();
	}
	//更新右键菜单位置
	$('.'+className).css({left:_left,top:_top}).show();
};

/***********************************************
 * 功能：计算大小图标偏移量						   *
 * 参数：icoSize图标大小类型，					   *
 *	  left左偏移量，top上移量，					   *
 *	  appPosTop初始左偏移量，appPosTop初始上偏移量， *
 *	  deskTopW app容器宽度，deskTopH app容器高度，		   *
 *    appBigSize大图标尺寸，appSmallSize小图标尺寸 *
 ***********************************************/
var countAppPos = function(order,icoSize,left,top,appPosLeft,appPosTop,deskTopW,deskTopH,appBigSize,appSmallSize){
	//判断纵向排列
	if(order=='y')
	{
		top+=icoSize=='small'?appSmallSize+appPosTop+5:appBigSize+appPosTop;//25+60+5,90+60
		if(top+(icoSize=='small'?appSmallSize:appBigSize)>deskTopH-(Base.config.dockPos == 'top'?60:0))  //win-64
		{
			top=appPosTop;
			left+=icoSize=='small'?appSmallSize+appPosLeft-20:appBigSize+appPosLeft;//第二列开始距离为60+50-20,90+50小，大左边偏移量
		};
	};
	//判断横向排列,当order为x或者min时候，min为窗口最小时候
	if(order=='x' || order=='min')
	{
		left+=icoSize=='small'?appSmallSize+appPosLeft-20:appBigSize+appPosLeft;//60+50-20,90+50
		if(left+(icoSize=='small'?appSmallSize:appBigSize)>deskTopW)
		{
			left=appPosLeft;
			top+=icoSize=='small'?appSmallSize+appPosTop+5:appBigSize+appPosTop;//第二列开始距离为,25+60+5,90+60-40
		};
	};
	return {'left':left,'top':top};
};

//应用码头栏位置设置
var setDockBarPos = function(element,pos){
	if(Base.config.dockPos != pos)
	{
		Base.config.dockPos = pos;
		setCookie('dockPos',pos,1);
		changeDockPos();
		ZENG.msgbox.show('设置成功', 4, 1000);
		element.prepend(element.siblings().find('i'));
	};
};
/***********************************************************
 * 功能：重绘图标排列										   *
 * 参数：type:排列类型，纵向或大小,order:排序方向,				   *
 *	   append:勾选图标对象,remove:移除图标对象,size:图标大小类型  *
 ***********************************************************/
var setAppOrder=function(type,order,append,remove,size){
	//判断图标排序s
	if(type=='setOrder')
	{
		//判断排列方向
		if(Base.config.appOrder!=order)
		{
			//添加勾选图标
			append.prepend(remove.find('i'));
			//设置全局配置的排列方向
			Base.config.appOrder=order;
			setCookie('appOrder',order,1);
			//重绘图标排列方向
			Base.appOrder(order);
			//提示信息
			ZENG.msgbox.show('设置成功', 4, 1000);
		};
	};
	//判断图标大小
	if(type=='setSize')
	{
		if(Base.config.appIcoSize!=size)
		{
			//添加勾选图标
			append.prepend(remove.find('i'));
			//判断当前图标尺寸
			if(size=='small')
			{
				//增加小图标类名
				$('.appListContainer').addClass(size);
			}
			else
			{
				//移除小图标类名
				$('.appListContainer').removeClass('small');
			}
			//设置图标大小类型
			Base.config.appIcoSize=size;
			setCookie('appIcoSize',size,1);
			//重绘图标排列
			Base.appOrder(order);
			//提示信息
			ZENG.msgbox.show('设置成功', 4, 1000);
		};
	};
	//隐藏菜单
	$('.conTextContainer').hide();
};

/**************************
 * 功能：拖拽
 * 参数：element：拖拽对象
 * 2013/3/21
 ******************************/
var appDrag=function(element){
	element.bind('mousedown',function(e){
		//鼠标和对象的偏移量
		var	returnPos = {
				 'x':element.offset().left
				,'y':element.offset().top
			}
			,diffPos = {
				 'x':e.clientX-returnPos.x
				,'y':e.clientY-returnPos.y
			}
			//,tempPos = {
			//	 'x':0
			//	,'y':0
			//}
			,navBarPos = {
				 'left'		:	$('.navBar').position().left
				,'right'	:	$('.navBar').position().left+$('.navBar').width()
				,'top'		:	$('.navBar').position().top
				,'bottom'	:	$('.navBar').position().top+$('.navBar').height()
			};
		//document.title=element.offset().left;
		//判断是否拖拽导航栏
		if(element.attr('class') != 'navBar')
		{
			var clone = element.clone(true)
				,flag  = false;
			if($('.manageClose').length > 0)
			{
				clone.css({'left':returnPos.x,'top':returnPos.y}).addClass('appManageClone');
			}
			else
			{
				clone.addClass('appClone');
			}
			//clone.css({'left':returnPos.x,'top':returnPos.y})
			$('body').append(clone);
		};
		//开始拖拽
		$(document).bind('mousemove',function(e){
			//鼠标坐标
			var mousePos={
				x:e.clientX,
				y:e.clientY
			},
			//拖拽对象移动距离
			offset={
				x:mousePos.x-diffPos.x,
				y:mousePos.y-diffPos.y
			};
			if(offset.x<=0)
			{
				offset.x=0;
			}
			else if(offset.x+(element.attr('class') == 'navBar'?element.width():clone.width())>Base.config.winW)
			{
				offset.x=Base.config.winW-(element.attr('class') == 'navBar'?element.width():clone.width());
			};
			//判断是否是导航栏
			if(offset.y-(element.attr('class') == 'navBar'?10:0) < 0)
			{
				offset.y=(element.attr('class') == 'navBar'?10:0);
			}
			else if(offset.y+(element.attr('class') == 'navBar'?element.height():clone.height())>Base.config.winH)
			{
				offset.y=Base.config.winH-(element.attr('class') == 'navBar'?element.height():clone.height());
			};
			//移动对象
			if(element.attr('class') == 'navBar')
			{
				element.css({'left':offset.x,'top':offset.y});
			}
			else
			{
				clone.css({'left':offset.x,'top':offset.y}).show();
			};
			//移动到数字切换屏幕拖拽分类
			if(mousePos.x>navBarPos.left && mousePos.x<navBarPos.right && mousePos.y>navBarPos.top && mousePos.y<navBarPos.bottom)
			{
				$('.navBar .nav_num').each(function(i){
					var  l = $(this).offset().left
						,r = $(this).offset().left+$(this).width()
						,t = $(this).offset().top
						,b = $(this).offset().top+$(this).height();
					if(mousePos.x>l && mousePos.x<r && mousePos.y>t && mousePos.y<b)
					{
						$(this).addClass('current').siblings('.nav_num').removeClass('current');//数字状态
						var index=$(this).index()-1;//当前索引值
						//判断索引值是否当前屏幕
						if($('.deskCurrent').index()!=index)
						{
							$('.deskCurrent').css('left',Base.config.winW).removeClass('deskCurrent');	
							$('.appListContainer').eq(index).css('left',0).addClass('deskCurrent');	
						};
						Base.config.defaultIndex = index;
					};
				});
			};
			//IE捕获事件
			if(element[0].setCapture) {
				element[0].setCapture(true);
			};
		});
		
		//结束拖拽
		$(document).bind('mouseup',function(e){
			//拖拽对象移动距离
			var offset={
				x:e.clientX-diffPos.x,
				y:e.clientY-diffPos.y
			};
			//取消绑定事件
			$(this).unbind('mousemove');
			$(this).unbind('mouseup');
			//IE,释放鼠标捕获
			if(element[0].releaseCapture)
			{
				element[0].releaseCapture(true);	
			};
			//判断拖拽导航栏时候
			if(element.attr('class') != 'navBar')
			{
				//管理栏时候拖拽分类,判断是否生成退出管理菜单，避免执行不必要循环
				if($('.manageClose').length > 0)
				{
					$('.appListContainer').each(function(i){
						if(impactTest($('.appListContainer').eq(i)[0],clone[0],'manage'))
						{
							$(this).find('.app[type="add"]').before(element);//插入到增加app按钮掐前面
							return false;
						}
						
					});
					if(impactTest($('.dockBar')[0],clone[0],'manage'))
					{
						if($('.dockBar .app').length<6)
						{
							$('.dockBar').append(element);
						}
						else
						{
							ZENG.msgbox.show('应用码头最多只能放置6个APP', 1, 1000);
						};				
					};
					
				}
				else if(!$('.manageClose').length && offset.x != returnPos.x)
				{
					//获取碰撞到得索引
					var index=findTarget(clone,$('.deskCurrent .app'));
					if(index || index == 0)
					{
						if(index != element.index())
						{
							var target=$('.deskCurrent .app').eq(index);
							target.before(element);
						}
					}
					else if(impactTest($('.dockBar')[0],clone[0]))
					{
						if($('.dockBar .app').length < 6)
						{
							$('.dockBar').append(element);
							Base.appOrder(Base.config.appOrder);
						}
						else
						{
							ZENG.msgbox.show('应用码头最多只能放置6个APP', 1, 1000);
						};				
					}
					else if($('.quick_view_container:visible').length && impactTest($('.quick_view_container:visible')[0],clone[0]))
					{
						//插入到当前打开的缩略图区域
						if(element.attr('type') != 'folder')
						{
							$('.quick_view_container').find('.quick_view_container_list:visible').append(element);
						};
					}
					else
					{
						$('.deskCurrent').find('.app[type="add"]').before(element);
					}
				};
				clone.remove();	
				Base.appOrder(Base.config.appOrder);//正常排列
			};
		});
		//清除文本选中状态
		claerSelection();
		//阻止默认行为
		return false;
	}); 
};

//dockBarDrag拖拽
Base.dockBarDrag = function(){
	
	var _this=this
		,element = $(document);
	$('.dockBar').bind('mousedown',function()
	{
		
		//管理菜单时候退出
		if($('.manageClose').length > 0)
		{
			return false;
		};
		var line = $(data.template.line);
		$('body').append(line);
		element.bind('mousemove',function(e)
		{
			claerSelection();
			line.show();
			//鼠标坐标
			var mx  = e.clientX
				,my = e.clientY;
			if(my < 125)
			{
				$('.dockBarBoxTop').addClass('dockBarCurrent').siblings('.dockBarBox').removeClass('dockBarCurrent');
				_this.config.dockPos = 'top';
				setCookie('dockPos','top',1);
			}
			else if(my > 125 && mx < _this.config.winW/2)
			{
				$('.dockBarBoxLeft').addClass('dockBarCurrent').siblings('.dockBarBox').removeClass('dockBarCurrent');
				_this.config.dockPos = 'left';
				setCookie('dockPos','left',1);
			}
			else if(my > 125 && mx > _this.config.winW/2)
			{
				$('.dockBarBoxRight').addClass('dockBarCurrent').siblings('.dockBarBox').removeClass('dockBarCurrent');
				_this.config.dockPos = 'right';
				setCookie('dockPos','right',1);
			};
			
		});	
		element.bind('mouseup',function()
		{
			//取消绑定事件
			$(this).unbind('mousemove');
			$(this).unbind('mouseup');
			line.remove();
			changeDockPos();
			_this.appOrder(_this.config.appOrder);
		});	
		return false;
	});
};

//清除文本选中状态
var claerSelection = function(){
	if (document.selection && document.selection.empty)
	{
		document.selection.empty();  //IE
	}
	else if(window.getSelection)
	{
		window.getSelection().removeAllRanges(); //火狐
	};
}
/**************************
 * 功能：碰撞检测
 * 参数：element1：对象1,：element2：对象2,
 * 2013/3/11
 ******************************/
var impactTest = function(element1,element2,type){
	//对象1的四边距离
	var pos_1={
		l:$(element1).offset().left,//左边距
		t:$(element1).offset().top,//上边距
		r:$(element1).offset().left+$(element1).width(),//左边距包含宽度
		b:$(element1).offset().top+$(element1).height()//上边距包含高度
	},
	//对象2的四边距离
	pos_2={
		l:$(element2).offset().left,//左边距
		t:$(element2).offset().top,//上边距
		r:$(element2).offset().left+$(element2).width(),//左边距包含宽度
		b:$(element2).offset().top+$(element2).height()//上边距包含高度
	}
	//element1.innerHTML=pos_1.t+'<br/>'+pos_1.l+':'+pos_1.r+'<br/>'+pos_1.b
	//element2.innerHTML=pos_2.t+'<br/>'+pos_2.l+':'+pos_2.r+'<br/>'+pos_2.b
	switch(type)
	{
		case 'manage':
			if(pos_1.r>pos_2.r && pos_1.l<pos_2.l && pos_1.b>pos_2.b && pos_1.t<pos_2.t)
			{
				return true;
			}
			else
			{
				return false;
			};
			break;
		default:
			//判断检测
			if(pos_1.r<pos_2.l || pos_1.l>pos_2.r || pos_1.b<pos_2.t ||pos_1.t>pos_2.b)
			{
				return false;
			}
			else
			{
				return true;
			};
			break;
	}
	
};
//获取平方根
var getSqrt = function(element1, element2){
	var a=$(element1).offset().left-$(element2).offset().left;
	var b=$(element1).offset().top-$(element2).offset().top;
	return Math.floor(Math.sqrt(a*a+b*b));//返回计算后的整数
};
/**************************
 * 功能：查找出距离移动最近目标
 * 参数：element：拖拽对象,array:目标元素数组
 * 2013/3/11
 ******************************/
var findTarget=function(element,array){
	
	var n=1000,		//声明一个最大值作为比较
		index=-1;	
	//循环目标元素
	for(var i=0;i<array.length;i++)
	{
		//如果当前拖拽对象和遍历中的相符则跳出本次循环
		if(element[0]==array.eq(i)[0]){
			continue;
		}
		//判断是否和目标元素相碰撞
		if(impactTest(element[0],array.eq(i)[0]))
		{
			//通过平方根获取斜边长度
			var isqrt=getSqrt(element[0],array.eq(i)[0]);
			//array.eq(i)[0].innerHTML=isqrt;
			//通过对比，求出最小值
			if(n>isqrt)
			{
				n=isqrt;
				//索引值复制给当前循环的变量
				index=i;
			};
		};
	};
	//当没有检测到时候返回元素值
	if(index==-1)
	{
		return null;
	}
	else
	{
		//返回索引值
		return index;
	};
};

//dockBar修改位置
var changeDockPos = function(){
	if(Base.config.dockPos == 'left')
	{
		$('.dockBar').removeClass('dockPosRight dockPosTop').addClass('dockPosLeft');
		$('.desktopsContainer').removeClass('desk_right desk_top').addClass('desk_left').height(Base.config.deskTopH).width(Base.config.deskTopW);
	}
	else if(Base.config.dockPos == 'right')
	{
		$('.dockBar').removeClass('dockPosLeft dockPosTop').addClass('dockPosRight');
		$('.desktopsContainer').removeClass('desk_left desk_top').addClass('desk_right').height(Base.config.deskTopH).width(Base.config.deskTopW);
	}
	else if(Base.config.dockPos == 'top')
	{
		$('.dockBar').removeClass('dockPosRight dockPosLeft').addClass('dockPosTop');
		$('.desktopsContainer').removeClass('desk_left desk_right').addClass('desk_top').height(Base.config.deskTopH-60).width(Base.config.winW);
	}
};

//计算app容器高宽
var countDeskTopPos = function(){
	var deskTopW  = 0
		,deskTopH = 0;
	//计算app容器高宽
	switch(Base.config.dockPos)
	{
		case 'left':
			deskTopW = Base.config.deskTopW;
			deskTopH = Base.config.deskTopH;
			break;
		case 'right':
			deskTopW = Base.config.deskTopW;
			deskTopH = Base.config.deskTopH;
			break;
		case 'top':
			deskTopW = Base.config.winW;
			deskTopH = Base.config.deskTopH-60;
			break;
	};
	return {width:deskTopW,height:deskTopH}
}

//创建随机数
var createRandomNum = function(){
	var Range = 9999999999 - 1000000000;   
	var Rand = Math.random();   
	return (1000000000 + Math.round(Rand * Range));   
};
//文件夹预览
var appViewFolder=function(element){
	var id 						= 	element.attr('id')
		,quick_view_container 	= 	$('.quick_view_container[id="'+id+'"]')
		,_left					=	element.offset().left+element.width()
		,_top					=	element.offset().top;
	//计算偏移量
	if(_left+quick_view_container.width()>Base.config.winW)
	{
		_left = element.offset().left-quick_view_container.width();
		quick_view_container.find('.quick_view_arrow').addClass('right');
	}
	else
	{
		quick_view_container.find('.quick_view_arrow').addClass('left');
	};
	quick_view_container.css({'left':_left,'top':_top}).show().siblings('.quick_view_container').hide();
	$('.quick_view_container_open').bind('click',function(){
		Base.config.currentApp = $('.app[id="'+id+'"]');
		openAppFun();	
		$('.quick_view_container').hide();
	});
}

//设置壁纸
var setBackground = function(){
	$.dialog({
		id		:	'paper',
		content	:	'url:paper.html',
		title	:	'壁纸设置',
		width	:	500,
		height	:	400	,
		max		:	false,
		min		:	false,
		resize	:	false
	});	
};

//桌面设置 
var setDeskTop = function(){
	$.dialog({
		id		:	'deskTopSet',
		content	:	'url:deskTopSet.html',
		title	:	'桌面设置',
		width	:	850,
		height	:	400	,
		max		:	false,
		min		:	false,
		resize	:	false,
		ok		:	function()
					{
						var frameDocument	=	getIframeDocument(document.getElementsByTagName('iframe')[0])
							,index			= 	frameDocument.getElementById('index').value
							,order			= 	frameDocument.getElementById('order').value
							,icosize		= 	frameDocument.getElementById('icosize').value
							,dockPos		= 	frameDocument.getElementById('dockPos').value
						//设置默认屏幕
						if(index)
						{
							$('.navBar .nav_num').eq(index).addClass('current').siblings('.nav_num').removeClass('current');//数字状态
							//判断索引值是否当前屏幕
							if($('.deskCurrent').index() != index)
							{
								$('.deskCurrent').css('left',Base.config.winW).removeClass('deskCurrent');	
								$('.appListContainer').eq(index).css('left',0).addClass('deskCurrent');	
							};
							Base.config.defaultIndex = index;
						};
						//设置排序
						if(order)
						{
							if(order == 'y') setAppOrder('setOrder','y',$('.settCol'),$('.setRow'));
							if(order == 'x') setAppOrder('setOrder','x',$('.setRow'),$('.settCol'));
							Base.config.appOrder=order
						};
						//设置图标大小
						if(icosize)
						{
							if(icosize == 'small') setAppOrder('setSize',Base.config.appOrder,$('.setSmall'),$('.setBig'),'small');
							if(icosize == 'big') setAppOrder('setSize',Base.config.appOrder,$('.setBig'),$('.setSmall'),'big');
							Base.config.appIcoSize=icosize;
						};
						//码头栏位置
						if(dockPos)
						{
							if(dockPos == 'left') setDockBarPos($('.dockBarLeft'),'left');
							if(dockPos == 'right') setDockBarPos($('.dockBarRight'),'right');
							if(dockPos == 'top') setDockBarPos($('.dockBarTop'),'top');
						};
						ZENG.msgbox.show('suess', 4, 1000);
					},
		cancelVal	:	'取消',
		cancel		:	true
	});	
	$('.conTextContainer').hide();	
}

var exitUbuntu = function(){
	if(confirm('do you wana leave？')){ 
		window.opener=null;  
		window.open('','_self');  
		window.close();
	}  
}
//显示桌面
var showDeskTop = function(){
	var list = $.dialog.list;
	for( var i in list ){
		list[i].hide();
	};
	$('.taskContainer ul li').removeAttr('open');
};

//打开应用
var openAppFun = function(){
	var currentApp	=	Base.config.currentApp
		,taskBar	=	$('.taskBar')
		,_id		=	currentApp.attr('id')
		,_url		=	currentApp.attr('url')
		,_src		=	currentApp.find('img').attr('src')
		,_width		=	parseInt(currentApp.attr('width'))
		,_height	=	parseInt(currentApp.attr('height'))
		,_content	=	currentApp.attr('type') == 'folder'?$('.quick_view_container[id="'+_id+'"]').find('.quick_view_container_list').html():'url:'+_url
		,_title		=	'<img src="'+_src+'" height="20"/>'+currentApp.find('.appName').text()
		,_li		= 	null;
	
	$.dialog({
		id		:	_id,
		content	:	_content,
		title	:	_title,
		width	:	_width,
		height	:	_height	,
		close	:	function(){
						var c_li	= $('.taskContainer li[id="'+_id+'"]');
						if(!c_li.is(":animated")){
							c_li.css('background','#eee').empty().animate({width:0},350,function(){
								$(this).remove();
							});
						}
					}
	});	
	//为文件夹里面的绑定事件
	if(currentApp.attr('type') == 'folder')
	{
		$('.ui_content .app').each(function(){
			$(this).bind('contextmenu',function(e){
				Base.config.currentApp = $(this);
				Base.createConTextMenu(data.menu.appMenu,e,'appMenu');	
				return false;
			});
			$(this).bind('click',function(){
				Base.config.currentApp = $(this);
				openAppFun();	
			});
		});
	};
	
	//生成任务栏
	if($('.taskContainer li[id="'+_id+'"]').length<1)
	{
		_li=$('<li id="'+_id+'" open="on"><span class="taskIco"><img src="'+_src+'"></span><span class="taskName">'+currentApp.find('.appName').text()+'</span></li>');
		taskBar.find('.taskContainer ul').append(_li);
		//绑定事件
		_li.bind('contextmenu',function(e){
			Base.config.taskBarApp = $(this);
			//$(this).addClass('hover').siblings().removeClass('hover');
			Base.createConTextMenu(data.menu.taskMenu,e,'taskMenu');
			return false;	
		});	
		//双击显示关闭切换
		_li.bind('click',function(){
			if($(this).attr('open'))
			{
				$.dialog({id:_id}).hide();
				$(this).removeAttr('open');
			}
			else
			{
				$.dialog({id:_id}).show();
				$(this).attr('open','on');
			};
		});
	};	
}
//写入cookie
var setCookie = function(name,value,day){
	var date = new Date();
	date.setDate(date.getDate()+day);
	document.cookie=name+'='+value+';expires='+date;
}

//获取cookie
var getCookie = function(name){
	var arr = document.cookie.split('; ');
	for(var i=0;i<arr.length;i++)
	{
		var arr2 = arr[i].split('=');
		if(arr2[0]==name)
		{
			return arr2[1];
		}	
	}
	return '';
}
