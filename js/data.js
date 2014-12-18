//app和菜单变量
var data={
	//应用列表
	'app':[
		//{'type':'app','colum':1,'appName':'显示桌面','appIco':'user-home.png','url':'','width':1020,'height':600,'system':true},
		{'type':'app','colum':1,'appName':'小蜜蜂','appIco':'WorldOfGoo.png','url':'demo/tinybee.html','width':1020,'height':800},
		{'type':'app','colum':1,'appName':'计算器','appIco':'google-chrome.png','url':'demo/calculator.html','width':1020,'height':600},
		{'type':'folder','colum':1,'appName':'我的文档','appIco':'f_doc.png','url':'','width':500,'height':300,'data':[
			{'type':'app','colum':'folder','appName':'Amazon','appIco':'amazon-mp3-store-source.png','url':'http://www.amazon.cn/','width':500,'height':300},
			{'type':'app','colum':'folder','appName':'Drop box','appIco':'dropbox.png','url':'https://www.dropbox.com/','width':500,'height':300},
		]},
		{'type':'app','colum':1,'appName':'Photoshop','appIco':'Adobe_Photoshop.png','url':'http://pixlr.com/editor/','width':1210,'height':600},
		{'type':'app','colum':1,'appName':'豆瓣电台','appIco':'db.png','url':'http://douban.fm/partner/baidu/doubanradio?bd_user=0&bd_sig=3b9b58c3bd56f6cecc6adc0553dfa771&canvas_pos=search&keyword=%E8%B1%86%E7%93%A3%E7%94%B5%E5%8F%B0','width':425,'height':195},
		{'type':'folder','colum':1,'appName':'测试文件夹','appIco':'folder.png','url':'','width':500,'height':300,'data':[
			{'type':'app','colum':'folder','appName':'Evernote','appIco':'evernote.png','url':'https://app.yinxiang.com/Login.action?targetUrl=%2FHome.action','width':500,'height':700},
			{'type':'app','colum':'folder','appName':'Gmail','appIco':'gmail.png','url':'https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=http://mail.google.com/mail/&scc=1&ltmpl=default&ltmplcache=2','width':500,'height':300},
		]},
		{'type':'app','colum':1,'appName':'分屏器','appIco':'ubuntuone.png','url':'','width':740,'height':400},
		{'type':'app','colum':1,'appName':'壁纸设置','appIco':'camera-photo.png','url':'http://style.qq.com/','width':1020,'height':500},
		{'type':'app','colum':1,'appName':'垃圾箱','appIco':'editdelete.png','url':'','width':980,'height':500,'data':[
			
		]},
		{'type':'app','colum':2,'appName':'youtube','appIco':'youtube.png','url':'404.html','width':927,'height':500},

		{'type':'app','colum':3,'appName':'Vim','appIco':'vim.png','url':'404.html','width':927,'height':500},
	
		{'type':'app','colum':4,'appName':'Calendar','appIco':'evolution-calendar.png','url':'404.html','width':927,'height':500},

		{'type':'app','colum':5,'appName':'Clock','appIco':'clock.png','url':'404.html','width':927,'height':500},
	

		{'type':'app','colum':'dock','appName':'Desktop','appIco':'user-home.png','url':'404.html','width':927,'height':500},
		{'type':'app','colum':'dock','appName':'ubuntuone','appIco':'ubuntuone.png','url':'404.html','width':927,'height':500},
		{'type':'app','colum':'dock','appName':'垃圾箱','appIco':'editdelete.png','url':'','width':927,'height':500,'data':[
			
		]},
		
		{'type':'folder','colum':2,'appName':'游戏','appIco':'f_game.png','url':'','width':500,'height':300,'data':[
			{'type':'app','colum':'folder','appName':'QQ游戏','appIco':'f_game.png','url':'','width':500,'height':300},
		]},
		
		{'type':'add','colum':1,'appName':'添加应用','appIco':'add.png','url':'404.html','width':927,'height':500},
		{'type':'add','colum':2,'appName':'添加应用','appIco':'add.png','url':'404.html','width':927,'height':500},
		{'type':'add','colum':3,'appName':'添加应用','appIco':'add.png','url':'404.html','width':927,'height':500},
		{'type':'add','colum':4,'appName':'添加应用','appIco':'add.png','url':'404.html','width':927,'height':500},
		{'type':'add','colum':5,'appName':'添加应用','appIco':'add.png','url':'404.html','width':927,'height':500}

	],
	
	//弹出层HTML模板
	'template':
	{	//文件夹预览
		'folder':'<div class="quick_view_container"><div class="quick_view_arrow"></div><div class="quick_view_top"></div><div class="quick_view_center"><div class="quick_view_container_control"><a class="quick_view_container_open">打开</a></div><div class="quick_view_container_list"></div></div><div class="quick_view_bottom"></div></div>',
		//创建文件夹
		'createFolder':'<div class="folderCreator"><a class="folderSelector"><img src="image/appIco/folder.png" /></a><div class="folderNameTxt">请输入文件夹名称：</div><div class="folderInput"><input class="folderName" value="新建文件夹"></div></div><div class="folderList"><ul><li><img src="image/appIco/folder.png" /></li><li><img src="image/appIco/f_contact.png" /></li><li><img src="image/appIco/f_doc.png" /></li><li><img src="image/appIco/f_game.png" /></li><li><img src="image/appIco/f_life.png" /></li><li><img src="image/appIco/f_music.png" /></li><li><img src="image/appIco/f_tool.png" /></li><li><img src="image/appIco/f_video.png" /></li></ul></div>',
		//?
		'line':'<div class="line"><div class="dockBarBoxLeft dockBarBox"></div><div class="dockBarBoxTop dockBarBox"></div><div class="dockBarBoxRight dockBarBox"></div><div class="line-top"></div><div class="line-left"></div><div class="line-right"></div></div>',
		//屏幕导航栏
		'navBar':'<div class="navBar"><a class="nav_header"><img src="image/avatar.png"/></a><a class="nav_num"><span>1</span></a><a class="nav_num"><span>2</span></a><a class="nav_num"><span>3</span></a><a class="nav_num"><span>4</span></a><a class="nav_num"><span>5</span></a><a class="nav_manage"></a></div>',
		//壁纸层
		'bodyPaper':'<div class="bodyPaper"><div class="shadeBg"></div><img src="image/paper/blue_glow.jpg"/></div>',
		//锁屏结构
		'lockWin':'<div class="toLockWin screenLocker"><div class="tipTitle">请设置解锁密码</div><div class="lockerPwdInput"><label for="lockPassword">输入密码：</label><input type="password" name="lockPassword" id="lockPassword"></div><div class="lockerPwdInput"><label for="confirmLockPassword">确认密码：</label><input type="password" name="confirmLockPassword" id="confirmLockPassword"></div></div>',
		//码头设置按钮
		//'dockTool':'<div class="dock-toollist"><a title="桌面设置" class="dock-tool-setting" href="javascript:;"></a><a title="主题设置" class="dock-tool-style" href="javascript:;"></a></div>',
		//任务栏结构
		'taskBar':'<div class="taskBar"><div class="taskPreBtn taskBtn"><a></a></div><div class="taskContainer"><ul></ul></div><div class="taskNextBtn taskBtn"><a></a></div></div>'
	},
	
	//菜单
	'menu':
	{	
		//任务栏右键菜单
		'taskMenu':
		[
			{name:'还原',className:'returnWin',ico:'applications-blue.png',subMenu:false},
			{name:'最小化',className:'minWin',ico:'arrow-in.png',subMenu:false},
			{name:'最大化',className:'maxWin',ico:'arrow-out.png',subMenu:false},
			{className:'divider'},
			{name:'关闭',className:'closeWin',ico:'cross.png',subMenu:false}	
		],
		
		//左面右键菜单
		'bodyMenu':
		[
			{name:'显示桌面',className:'showDeskTop',ico:'desktop.png',subMenu:false},
			{name:'锁屏',className:'lockcolum',ico:'',subMenu:false},
			{className:'divider'},
			{name:'添加',className:'subMenuItem',ico:'plus-circle.png',subMenu:
				[
					{name:'应用',className:'addApp',ico:'application-browser.png'},
					{name:'文件夹',className:'addFolder',ico:'folder-horizontal.png'}
				]
			},
			{name:'上传文件',className:'upFile',ico:'drive-upload.png',subMenu:false},
			{className:'divider'},
			{name:'图标设置',className:'subMenuItem',ico:'',subMenu:
				[
					{name:'纵向排列',className:'settCol',ico:'tick.png'},
					{name:'横向排列',className:'setRow',ico:''},
					{className:'divider'},
					{name:'大图标',className:'setBig',ico:'tick.png'},
					{name:'小图标',className:'setSmall',ico:''}
				]
			},
			{className:'divider'},
			{name:'壁纸设置',className:'setBackground',ico:'images-stack.png',subMenu:false},
			//{name:'桌面设置',className:'setDeskTop',ico:'gear.png',subMenu:false},
			{className:'divider'},
			{name:'关于',className:'about',ico:'',subMenu:false}	
		],
		
		//应用图标右键菜单
		'appMenu':
		[
			{name:'打开应用',className:'openApp',ico:'',subMenu:false},
			{className:'divider'},
			{name:'移动应用到',className:'subMenuItem',ico:'',subMenu:
				[
					{name:'桌面1',className:'moveDeskTop',ico:''},
					{name:'桌面2',className:'moveDeskTop',ico:''},
					{name:'桌面3',className:'moveDeskTop',ico:''},
					{name:'桌面4',className:'moveDeskTop',ico:''},
					{name:'桌面5',className:'moveDeskTop',ico:''},
					{className:'divider'},
					{name:'应用码头',className:'moveDock',ico:''}
				]
			},
			//{name:'编辑',className:'editApp',ico:'',subMenu:false},
			{name:'删除应用',className:'delApp',ico:'',subMenu:false}
			//{name:'重命名',className:'reNameApp',ico:'spell-check.png',subMenu:false},
			//{className:'divider'}
		],
		
		//文件夹图标右键菜单
		'folderMenu':
		[
			{name:'预览',className:'viewFolder',ico:'',subMenu:false},
			{name:'打开',className:'openApp',ico:'',subMenu:false},
			{className:'divider'},
			{name:'移动应用到',className:'subMenuItem',ico:'',subMenu:
				[
					{name:'桌面1',className:'moveDeskTop',ico:''},
					{name:'桌面2',className:'moveDeskTop',ico:''},
					{name:'桌面3',className:'moveDeskTop',ico:''},
					{name:'桌面4',className:'moveDeskTop',ico:''},
					{name:'桌面5',className:'moveDeskTop',ico:''},
					{className:'divider'},
					{name:'应用码头',className:'moveDock',ico:''}
				]
			},
			//{name:'编辑',className:'editFolder',ico:'',subMenu:false},
			{name:'删除文件夹',className:'delApp',ico:'',subMenu:false}
		],
		
		//任务码头右键菜单
		'dockMenu':
		[
			{name:'向左停靠',className:'dockBarLeft',ico:'tick.png',subMenu:false},
			{name:'向上停靠',className:'dockBarTop',ico:'',subMenu:false},
			{name:'向右停靠',className:'dockBarRight',ico:'',subMenu:false}
		]
	}		
}