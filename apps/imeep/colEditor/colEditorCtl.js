angular.module('app', ['oc.lazyLoad', 'fastmap.uikit', 'ui.layout', 'ngTable', 'localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap', 'ngSanitize']).constant("appPath", {
	root: App.Util.getAppPath() + "/",
	meta: "scripts/components/meta/",
	road: "scripts/components/road/",
	poi: "scripts/components/poi/",
	column: "scripts/components/column/",
	tool: "scripts/components/tools/"
}).controller('ColEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsMeta', 'dsFcc', 'dsEdit', 'dsManage', '$q', 'appPath', '$timeout',
	function ($scope, $ocLazyLoad, $rootScope, dsMeta, dsFcc, dsEdit, dsManage, $q, appPath, $timeout) {
		var eventCtrl = new fastmap.uikit.EventController();
		$scope.showLoading = true;
		$timeout(function (){
			$scope.showLoading = false;
		},1000);

		$scope.appPath = appPath;
		$scope.metaData = {}; //存放元数据
		$scope.metaData.kindFormat = {}, $scope.metaData.kindList = [], $scope.metaData.allChain = {};
		$scope.radioDefaultValRoad,$scope.radioDefaultValAddr,$scope.radioDefaultVal,$scope.pCreatradio; //用于存储拼音多音字

		
		$scope.menus = {
			'chinaName':'中文名称',
			'chinaAddress':'中文地址',
			'englishName':'英文名称',
			'englishAddress':'英文地址'
		};
		$scope.names = {
			"chinaName":[{'text':'中文名称统一','worked':20,'count':30,'id':'nameUnify'},
				{'text':'中文简称作业','worked':20,'count':30,'id':'shortName'},
				{'text':'中文拼音作业','worked':10,'count':20,'id':'namePinyin'}],
			"chinaAddress":[{'text':'中文地址','worked':20,'count':30,'id':'addrSplit'},
				{'text':'中文拼音作业','worked':20,'count':30,'id':'addrPinyin'}],
			"englishName":[{'text':'照片录入英文名','worked':20,'count':30,'id':'photoEngName'},
				{'text':'中文即是英文','worked':20,'count':30,'id':'chiEngName'},
				{'text':'人工确认英文名','worked':10,'count':20,'id':'confirmEngName'},
				{'text':'官方标准英文名','worked':20,'count':30,'id':'officalStandardEngName'},
				{'text':'非重要分类英文超长','worked':10,'count':20,'id':'nonImportantLongEngName'}
			],
			"englishAddress":[{'text':'重要分类地址英文作业','worked':20,'count':30,'id':'importantEngAddress'},
				{'text':'非重要分类地址英文超长作业','worked':20,'count':30,'id':'nonImportantLongEngAddress'}]
		};
//		$scope.nameType = 'chinaAddress'; //默认显示中文地址
//		$scope.menuSelectedId = 'addrSplit';

		$scope.nameType = App.Util.getUrlParam("workItem");
		if($scope.nameType == 'chinaAddress'){
			$scope.menuSelectedId = 'addrSplit';
		}else if($scope.nameType == 'chinaName'){
			$scope.menuSelectedId = 'nameUnify';
		}else if($scope.nameType == 'englishName'){
            $scope.menuSelectedId = 'photoEngName';
        }else if($scope.nameType == 'englishAddress'){
			$scope.menuSelectedId = 'importantEngAddress';
		}


		$scope.changeMenu = function (id){
			$scope.showLoading = true;
			$scope.menuSelectedId = id;
			if($scope.menuSelectedId == 'nameUnify'){
				$ocLazyLoad.load(appPath.column + 'ctrls/chinaName/nameUnifyCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/chinaName/nameUnifyTpl.html';
					$scope.showLoading = false;
				});
			} else if($scope.menuSelectedId == 'addrSplit') {
				$ocLazyLoad.load(appPath.column + 'ctrls/chinaAddress/addrSplitCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/chinaAddress/addrSplitTpl.html';
					$scope.showLoading = false;
				});
			} else if ($scope.menuSelectedId == 'importantEngAddress'){
				$ocLazyLoad.load(appPath.column + 'ctrls/englishAddress/importantEngAddressCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/englishAddress/importantEngAddressTpl.html';
					$scope.showLoading = false;
				});
			} else if ($scope.menuSelectedId == 'nonImportantLongEngAddress'){
				$ocLazyLoad.load(appPath.column + 'ctrls/englishAddress/nonImportantLongEngAddressCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/englishAddress/nonImportantLongEngAddressTpl.html';
					$scope.showLoading = false;
				});
			} else if($scope.menuSelectedId == 'photoEngName'){
                $ocLazyLoad.load(appPath.column + 'ctrls/englishName/photoEngNameCtl').then(function () {
                    $scope.columnListTpl = appPath.root + appPath.column + 'tpls/englishName/photoEngNameTpl.html';
                    $scope.showLoading = false;
                });
            } else if($scope.menuSelectedId == 'addrPinyin') {
				$ocLazyLoad.load(appPath.column + 'ctrls/chinaAddress/addrPinyinCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/chinaAddress/addrPinyinTpl.html';
					$scope.showLoading = false;
				});
			} else if($scope.menuSelectedId == 'namePinyin'){
				$ocLazyLoad.load(appPath.column + 'ctrls/chinaName/namePinyinCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/chinaName/namePinyinTpl.html';
					$scope.showLoading = false;
				});
			} else if($scope.menuSelectedId == 'shortName'){
				$ocLazyLoad.load(appPath.column + 'ctrls/chinaName/shortNameCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/chinaName/shortNameTpl.html';
					$scope.showLoading = false;
				});
			} else if($scope.menuSelectedId == 'chiEngName'){
				$ocLazyLoad.load(appPath.column + 'ctrls/englishName/chiEngNameCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/englishName/chiEngNameTpl.html';
					$scope.showLoading = false;
				});
			} else if($scope.menuSelectedId == 'confirmEngName'){
				$ocLazyLoad.load(appPath.column + 'ctrls/englishName/confirmEngNameCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/englishName/confirmEngNameTpl.html';
					$scope.showLoading = false;
				});
			}
		};

		$scope.initPage = function (){
			$scope.changeMenu($scope.menuSelectedId);
		};
		$scope.initPage();

		$scope.initMate = function (){
			// 查询全部的小分类数据
			var param = {
				mediumId: "",
				region: 0
			};
			dsMeta.getKindList(param).then(function (kindData) {
				for (var i = 0; i < kindData.length; i++) {
					$scope.metaData.kindFormat[kindData[i].kindCode] = {
						kindId: kindData[i].id,
						kindName: kindData[i].kindName,
						level: kindData[i].level,
						extend: kindData[i].extend,
						parentFlag: kindData[i].parent,
						chainFlag: kindData[i].chainFlag,
						dispOnLink: kindData[i].dispOnLink,
						mediumId: kindData[i].mediumId
					};
				}
			});
		};


		$scope.replaceVal = function(targetVal){
			var valArr = targetVal.split("|");
			for(var i=0;i<valArr.length;i++){
				if(/^[\s]+$/.test(valArr[i]) && valArr[i].length > 1){
					valArr[i] = " ";
				}
			}
			return valArr.join("|");
		};

		/**
		 * 地址拼音高亮方法
		 * @param pinyin 拼音地址合并
		 * @param zhongwen 中文地址合并
		 * @param duoyinzi 多音字
		 * @param rowIndex 行号
		 * @param type 标识道路地址 'road' 'addr'
		 * @returns 含有高亮样式的拼音html
		 */
		$scope.heightLightPinAddress = function(pinyin, zhongwen,duoyinzi,type){
			// 多音字默认值
			var perRadioDefaultVal = new Array();
			if(pinyin.substr(0,1) == " "){
				pinyin = pinyin.substr(1);
			}
			pinyin = $scope.replaceVal(pinyin);
			var pinyinArr = pinyin.split(' ');
			var pyIndexArray = $scope.calculateIndex(pinyin,zhongwen,duoyinzi);

			// 按下标高亮拼音
			for(var i=0;i<pyIndexArray.length;i++){
				perRadioDefaultVal.push(pinyinArr[pyIndexArray[i]]);
				pinyinArr[pyIndexArray[i]] = "<span class='wordColor'>"+pinyinArr[pyIndexArray[i]]+"</span>";
			}
			if("road" == type){
				$scope.radioDefaultValRoad = perRadioDefaultVal;
			}else{
				$scope.radioDefaultValAddr = perRadioDefaultVal;
			}
			return pinyinArr.join(' ');
		};

		/**
		 * 根据中文下标，计算拼音下标
		 * @param pinyin
		 * @param zhongwen
		 * @param duoyinzi
         * @returns {Array}
         */
		$scope.calculateIndex = function (pinyin,zhongwen,duoyinzi){
			var pinyinArr = pinyin.split(' ');
			// pyIndexArray 用于保存需要高亮的拼音下标
			var pyIndexArray = [];
			if(duoyinzi && duoyinzi.length>0){
				for (var j=0;j< duoyinzi.length;j++) {
					var index = 0;
					var addFlag =  false;
					var zhongwenIndex = duoyinzi[j][0];// 中文多音字下标
					// 循环每个拼音
					var tmpIndex = -1;
					for(var i=0;i<pinyinArr.length;i++){
						var perPYF = $scope.ToDBC(pinyinArr[i]);// 半角转全角，进行匹配
						// indexOf(目标字符串,开始位置)
						var perIndex = zhongwen.indexOf(perPYF,tmpIndex);
						// 只有下标小于当前zhongwenIndex的perPYF才需要计算差值
						if(perIndex != -1 && perIndex < zhongwenIndex){
							tmpIndex = perIndex + 1;   // ABCD中ABC行
							if(perPYF.length > 1){
								addFlag = true;
								index += perPYF.length-1;
							}
						}
					}
					// 当addFlag为true代表有差值
					if(addFlag){
						pyIndexArray.push(zhongwenIndex - index);
					} else {
						pyIndexArray.push(zhongwenIndex);
					}
				}
			}
			return pyIndexArray;
		};

		/**
		 * 半角转换为全角函数(全角空格为12288，半角空格为32,其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248)
		 * @param txtstring
		 * @returns
		 */
		$scope.ToDBC = function(txtstring) {
			if(txtstring ==null ||txtstring =="" ||txtstring ==" "){
				return "";
			}
			var tmp = "";
			for (var i = 0; i < txtstring.length; i++) {
				if (txtstring.charCodeAt(i) == 32) {
					tmp = tmp + String.fromCharCode(12288);
				}else if (txtstring.charAt(i)!="|"&&txtstring.charCodeAt(i) < 127) {
					tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
				}else {
					tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i));
				}
			}
			return tmp;
		}
		/**
		 * 高亮拼音方法
		 * 
		 * @param pinyin
		 *            拼音内容
		 * @param zhongwen
		 *            中文内容
		 * @param duoyinzi
		 *            多音字数组
		 * @param rowIndex
		 *            行号
		 * @returns
		 */
		$scope.heightLightPin = function (pinyin, zhongwen,duoyinzi, rowIndex){
			// 多音字默认值
			var perRadioDefaultVal = new Array();
			// 获取用空格拆分的拼音数组
			var pinyinArr = pinyin.split(' ');
			
			// pyIndexArray 用于保存需要高亮的拼音下标
			var pyIndexArray = new Array();
			if(duoyinzi != undefined){
				for (var j=0;j< duoyinzi.length;j++) {
					var index = 0;
					var addFlag =  false;
					// 中文多音字下标，去空格后的中文多音字下标
					var zhongwenIndex = duoyinzi[j][0];
					// 循环每个拼音
					var tmpIndex = -1;
					for(var i=0;i<pinyinArr.length;i++){
						// 将当前的词半角转全角
						var perPYF = $scope.ToDBC(pinyinArr[i]);
						// indexOf(目标字符串,开始位置) 中文去空格后匹配 全角拼音 判断是否有类似ABC
						var perIndex = zhongwen.replace(/\s/g,"").indexOf(perPYF,tmpIndex);
						//判断是否含有中文中为No.重，拼音中为No.chong的情况
						if(pinyinArr[i].toUpperCase().indexOf('NO.')>-1 && perIndex <0){
							var NoArr = new Array();
							var lastIndex = pinyinArr[i].lastIndexOf(".");
							NoArr[0] = pinyinArr[i].substring(0,lastIndex+1);
							NoArr[1] = pinyinArr[i].substring(lastIndex+1);
							var Arr1 = pinyinArr.slice(0,i);
							var Arr2 = pinyinArr.slice(i+1,pinyinArr.length);
							pinyinArr = Arr1.concat(NoArr).concat(Arr2);
						}
						//数组重拼后，重新取值，重新匹配
						perPYF = $scope.ToDBC(pinyinArr[i]);
						// indexOf(目标字符串,开始位置) 中文去空格后匹配 全角拼音 判断是否有类似ABC
						perIndex = zhongwen.replace(/\s/g,"").indexOf(perPYF,tmpIndex);
						// 只有下标小于当前zhongwenIndex的perPYF才需要计算差值
						if(perIndex != -1 && perIndex < zhongwenIndex){ 
							// 计算下次匹配的起始位置
							tmpIndex = perIndex + 1;   // ABCD中ABC行
							// 当是A时 不影响拼音下标
							if(perPYF.length > 1){
								addFlag = true;
								// 当前拼音单词与给出的中文下标的插值
								index += perPYF.length-1;
							}
						}
					}
					// 当addFlag为true代表有差值
					if(addFlag){
						// 如果有差值，重新计算拼音的下标
						pyIndexArray.push(zhongwenIndex - index);
					} else {
						// 中文有空格不影响拼音的位置
						pyIndexArray.push(zhongwenIndex);
					}
				}
			}
			// 按下标高亮拼音
			for(var i=0;i<pyIndexArray.length;i++){
				perRadioDefaultVal.push(pinyinArr[pyIndexArray[i]]);
//				pinyinArr[pyIndexArray[i]] = "<span id= "+rowIndex+"_"+duoyinzi[i][0]+" style=\"color:red;\">"+pinyinArr[pyIndexArray[i]]+"</span>";
				pinyinArr[pyIndexArray[i]] = "<span class='wordColor'>"+pinyinArr[pyIndexArray[i]]+"</span>";
			};
			$scope.radioDefaultVal=perRadioDefaultVal;
			return pinyinArr.join(' ');
		 
		}
		/**
		 * 高亮多音字
		 * @param zhongwen
		 * @param duoyinzi
         * @returns {*}
         */
		$scope.heightLightCn = function(zhongwen,duoyinzi){
			var value = zhongwen;
			// 中文去空格
			var trimZW = zhongwen.replace(/\s/g,'');
			// var duoyinziArr = duoyinzi;
			for (var item in duoyinzi){
				var indexArr = new Array();
				// 中文多音字下标
				var index = duoyinzi[item].toString().split(',')[0];
				// 中文多音字 如行
				var chiV = trimZW.substr(index,1);
				// 获取chiV在trimZW中重复出现的下标数组indexArr
				$scope.resu(trimZW,chiV,indexArr,-1);
				if(indexArr.length == 1){
					// 如果indexArr长度为1,说明chiV在trimZW中没有重复,则直接将此chiV替换为高亮后的
					value = value.replace(chiV,"<span class='wordColor'>"+chiV+"</span>");
				} else if (indexArr.length>1){
					var count = 0;
					// 循环indexArr,查找多音字在数组中出现的次数
					for(var ind in indexArr){
						count++;
						if(indexArr[ind] == index){
							break;
						}
					}
					// 根据中文中此多音字出现的次数确定其在中文中的下标
					var realIndex = findMulitEleByNum(value,chiV,count);
					// 高亮
					value =value.substr(0,realIndex-1)+ "<span class='wordColor'>"+chiV+"</span>"+value.substr(realIndex);
				}
			}
			return value;
		};
		/**
		 * 递归寻找出现重复的元素，将下标放入集合中
		 * @param str 目标字符串 去空格后的中文
		 * @param ele 重复元素 如行
		 * @param arrList 存放的集合 用于存储 多音字在str中重复出现的下标
		 * @param startIndex 开始下标
		 */
		$scope.resu = function(str,ele,arrList,startIndex){
			var index = str.indexOf(ele,startIndex);
			if(index != -1){
				arrList.push(index);
				$scope.resu(str,ele,arrList,index+1);
			}
		};
		/**
         * 来源标识对象数组
         */
        $scope.sourceFlag = 
        	[{"id":"002000010000","label":"采集"},
            {"id":"002000020000","label":"官网"},
            {"id":"002000030000","label":"非官网+人工"},
            {"id":"002000040000","label":"专项改善"},
            {"id":"002000050000","label":"品牌名+分店名"},
            {"id":"002000060000","label":"人工确认"},
            {"id":"002000070000","label":"代理店"},
            {"id":"002000080000","label":"已训练关键词翻译程序"},
            {"id":"002000090000","label":"程序翻译"}];
		$scope.initPage = function (){
			$scope.initMate();
			$scope.changeMenu($scope.menuSelectedId);

		};
		$scope.initPage();


	}
]);
