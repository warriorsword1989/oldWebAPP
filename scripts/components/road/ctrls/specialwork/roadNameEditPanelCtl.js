/**
 * Created by mali on 2016/8/11.
 */
angular.module('app').controller('RoadNameEditPanelCtl', ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function ($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
    	var objectCtrl = fastmap.uikit.ObjectEditController();
    	var eventCtrl = fastmap.uikit.EventController();
    	$scope.srcFlagDisable = false;
        $scope.langCodeOpt = [
            { id: 'CHI', label: '简体中文' },
            { id: 'CHT', label: '繁体中文' },
            { id: 'ENG', label: '英文' },
            { id: 'POR', label: '葡萄牙文' }
        ];
        $scope.srcFlagOpt = [
			{ id: 0, label: '未定义' },
			{ id: 1, label: '按规则翻译(程序赋值)' },
			{ id: 2, label: '来自出典(手工录入)' },
			{ id: 3, label: '现场标牌' }
        ];
        var prefixOpt_CHI = [
			{ id: '东', label: '东' },
			{ id: '西', label: '西' },
			{ id: '南', label: '南' },
			{ id: '北', label: '北' },
			{ id: '中', label: '中' },
			{ id: '前', label: '前' },
			{ id: '后', label: '后' },
			{ id: '左', label: '左' },
			{ id: '右', label: '右' }
        ];
        var prefixOpt_ENG = [
			{ id: 'East', label: 'E' },
			{ id: 'West', label: 'W' },
			{ id: 'South', label: 'S' },
			{ id: 'North', label: 'N' },
			{ id: 'Front', label: 'F' }
        ];
        var infixOpt_CHI = [
			{ id: '南', label: '南' },
			{ id: '西', label: '西' },
			{ id: '北', label: '北' },
			{ id: '前', label: '前' },
			{ id: '后', label: '后' },
			{ id: '左', label: '左' },
			{ id: '右', label: '右' },
			{ id: '中', label: '中' },
			{ id: '东', label: '东' },
			{ id: '省', label: '省' },
			{ id: '市', label: '市' },
			{ id: '县', label: '县' },
			{ id: '辅', label: '辅' },
			{ id: '外', label: '外' },
			{ id: '上', label: '上' },
			{ id: '正', label: '正' },
			{ id: '下', label: '下' },
			{ id: '内', label: '内' }
        ];
        var infixOpt_ENG = [
			{ id: 'East', label: 'East' },
			{ id: 'West', label: 'West' },
			{ id: 'South', label: 'South' },
			{ id: 'North', label: 'North' },
			{ id: 'Front', label: 'Front' },
   			{ id: 'Back', label: 'Back' },
   			{ id: 'Left', label: 'Left' },
   			{ id: 'Right', label: 'Right' },
   			{ id: 'Middle', label: 'Middle' },
   			{ id: 'Provincial', label: 'Provincial' },
   			{ id: 'City', label: 'city' },
   			{ id: 'Country', label: 'Country' },
   			{ id: 'Side', label: 'Side' },
   			{ id: 'Frontage', label: 'Frontage' },
   			{ id: 'Outer', label: 'Outer' },
   			{ id: 'Upper', label: 'Upper' },
   			{ id: 'Main', label: 'Main' },
   			{ id: 'Down', label: 'Down' },
   			{ id: 'Inner', label: 'Inner' }
        ];
        var suffixOpt_CHI = [
			{ id: '东', label: '东' },
			{ id: '西', label: '西' },
			{ id: '南', label: '南' },
			{ id: '北', label: '北' },
			{ id: '中', label: '中' }
        ];
        var suffixOpt_ENG = [
			{ id: 'East', label: 'E' },
			{ id: 'West', label: 'W' },
			{ id: 'South', label: 'S' },
			{ id: 'North', label: 'N' },
			{ id: 'Front', label: 'F' }
 		];
        $scope.roadTypeOpt = [
			{ id: 0, label: '未区分' },
			{ id: 1, label: '高速' },
			{ id: 2, label: '国道' },
			{ id: 3, label: '铁路' },
			{ id: 4, label: '出口编号' }
        ];
        $scope.codeTypeOpt = [
			{ id: 0, label: '非国家编号' },
			{ id: 1, label: '国家高速编号' },
			{ id: 2, label: '国道编号' },
			{ id: 3, label: '省道编号' },
			{ id: 4, label: '县道编号' },
			{ id: 5, label: '乡道编号' },
			{ id: 6, label: '专用道编号' },
			{ id: 7, label: '省级高速编号' }
        ];
        $scope.splitFlagOpt = [
			{ id: 0, label: '无（默认值）' },
			{ id: 1, label: '人工拆分' },
			{ id: 2, label: '程序拆分' }
        ];
        $scope.hwInfoFlagOpt = [
			{ id: 0, label: '是' },
			{ id: 1, label: '否' }
        ];
        $scope.adminOpt = [
		    { id: 214, label: '全国' },
		    { id: 110000, label: '北京' },
		    { id: 120000, label: '天津' },
		    { id: 130000, label: '河北' },
		    { id: 140000, label: '山西' },
		    { id: 150000, label: '内蒙古' },
		    { id: 210000, label: '辽宁' },
		    { id: 220000, label: '吉林' },
		    { id: 230000, label: '黑龙江' },
		    { id: 310000, label: '上海' },
		    { id: 320000, label: '江苏' },
		    { id: 330000, label: '浙江' },
		    { id: 340000, label: '安徽' },
		    { id: 350000, label: '福建' },
		    { id: 360000, label: '江西' },
		    { id: 370000, label: '山东' },
		    { id: 410000, label: '河南' },
		    { id: 420000, label: '湖北' },
		    { id: 430000, label: '湖南' },
		    { id: 440000, label: '广东' },
		    { id: 450000, label: '广西' },
		    { id: 460000, label: '海南' },
		    { id: 500000, label: '重庆' },
		    { id: 510000, label: '四川' },
		    { id: 520000, label: '贵州' },
		    { id: 530000, label: '云南' },
		    { id: 540000, label: '西藏' },
		    { id: 610000, label: '陕西' },
		    { id: 620000, label: '甘肃' },
		    { id: 630000, label: '青海' },
		    { id: 640000, label: '宁夏' },
		    { id: 650000, label: '新疆' },
		    { id: 810000, label: '香港' },
		    { id: 820000, label: '澳门' }
        ];
        $scope.hwInfoFlag = 1;
        $scope.initializeData = function () {
            var type = $scope.roadNameFlag;
            if (type == 'add') {
                $scope.roadNameData = fastmap.dataApi.roadName({});
            } else if (type == 'edit') {
                $scope.roadNameData = objectCtrl.data;
	    		objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
            }
    		if ($scope.roadNameData.langCode == 'ENG') {
    			$scope.prefixOpt = prefixOpt_ENG;
    			$scope.infixOpt = infixOpt_ENG;
    			$scope.suffixOpt = suffixOpt_ENG;
    		} else if ($scope.roadNameData.langCode == 'CHI') {
    			$scope.prefixOpt = prefixOpt_CHI;
    			$scope.infixOpt = infixOpt_CHI;
    			$scope.suffixOpt = suffixOpt_CHI;
    		}
    		$scope.initFieldEditable();
    	};
    	// 初始化各个字段是否可编辑
    	$scope.initFieldEditable = function () {
    		var type = $scope.roadNameFlag;
    		if (type == 'edit') {
    			$scope.hwInfoFlagDisable = true;// highway信息标识
        		$scope.typeEditable = true;// 类型名称
        		$scope.basePhoneticDisable = false;// 类型名发音
        		$scope.baseDisable = false;// 基本名称
        		$scope.basePhoneticEditable = true;// 基本名发音
        		$scope.prefixDisable = false;// 前缀名称
        		$scope.infixDisable = false;// 中缀名称
        		$scope.suffixDisable = false;// 后缀名称
        		$scope.voiceFileDisable = false;// 名称语音
        		$scope.srcFlagDisable = false;// 名称来源
        		$scope.nameGroupidEditable = false;
        		$scope.langCodeDisable = true;// 语言类型
        		if ($scope.roadNameData.langCode == 'ENG') {
        			$scope.codeTypeDisable = true;// 国家编号
        			$scope.adminIdDisable = true;// 行政区划
//        			$scope.adminIdEditable = false;//行政区划
        			$scope.roadTypeDisable = true;// 道路类型
        			$scope.nameDisable = true;// 道路名称
        		} else if ($scope.roadNameData.langCode == 'CHI') {
        			$scope.codeTypeDisable = false;// 国家编号
        			$scope.adminIdDisable = false;// 行政区划
//        			$scope.adminIdEditable = true;//行政区划
        			$scope.roadTypeDisable = false;// 道路类型
        			$scope.nameDisable = false;// 道路名称
        		}
    		} else if (type == 'add') {
    			$scope.hwInfoFlagDisable = true;// highway信息标识
        		$scope.typeEditable = true;// 类型名称
        		$scope.basePhoneticDisable = false;// 类型名发音
        		$scope.baseDisable = false;// 基本名称
        		$scope.basePhoneticEditable = true;// 基本名发音
        		$scope.prefixDisable = false;// 前缀名称
        		$scope.infixDisable = false;// 中缀名称
        		$scope.suffixDisable = false;// 后缀名称
        		$scope.voiceFileDisable = false;// 名称语音
        		$scope.srcFlagDisable = false;// 名称来源
        		$scope.nameGroupidEditable = true;// 道路组id
        		$scope.langCodeDisable = false;// 语言类型
        		$scope.codeTypeDisable = false;// 国家编号
        		$scope.adminIdDisable = false;// 行政区划
//    			$scope.adminIdEditable = true;//行政区划
    			$scope.roadTypeDisable = false;// 道路类型
    			$scope.nameDisable = false;// 道路名称
    		}
    	};
    	$scope.initializeData();
        /** *
         * 弹出编辑面板
         */
        $scope.searchModal = false;
        $scope.openSearchModal = function (type) {
       	 	$scope.searchModal = true;
       	 	if (type == 'nameGroup') {
       	 		if ($scope.roadNameFlag == 'add') {
       	 			if ($scope.roadNameData.langCode == 'CHI' || $scope.roadNameData.langCode == 'CHT') {
       	 				swal('道路名组在语言类型为中文时系统会自动分配，不能选择', '', 'info');
       	 				$scope.searchModal = false;
       	 				return;
       	 			}
       	 		}
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/nameGroupTableCtl.js').then(function () {
	            	$scope.searchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/nameGroupTableTpl.htm';
	            });
       	 	} else if (type == 'type') {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/typeTableCtl.js').then(function () {
	            	$scope.searchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/typeTableTpl.htm';
	            });
       	 	} else if (type == 'admin') {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/adminTableCtl.js').then(function () {
	            	$scope.searchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/adminTableTpl.htm';
	            });
       	 	} else {
       	 		return;
       	 	}

       	 	console.log('查询');
        };
        /** *
         * 关闭编辑面板
         */
        $scope.closeSearchModal = function () {
            $scope.searchModal = false;
        };
        /** *
         * 道路组名，类型名，行政区划名修改
         */
        $scope.selectVal = function (row, index, type) {
       	 if (type == 'admin') {
   			$scope.roadNameData.adminId = parseInt(row.adminareacode);
   			$scope.roadNameData.adminName = row.whole;
   			$scope.searchModal = false;
       	 } else if (type == 'namegroup') {
       		 if ($scope.roadNameFlag == 'add') {
       			var param = {
   	 					nameGroupid: parseInt(row.nameGroupid),
   	 					dbId: App.Temp.dbId
                	};
            	dsMeta.rdnameGroup(param).then(function (data) {
            		if (data.data) {
            			swal('该道路名组内已经存在两条记录，不可再添加。请选择其他道路名组', '', 'info');
            		} else {
            			$scope.roadNameData.nameGroupid = row.nameGroupid;
            			$scope.searchModal = false;
            		}
            });
       		 } else if ($scope.roadNameFlag == 'edit') {
       			$scope.roadNameData.nameGroupid = row.nameGroupid;
       			$scope.searchModal = false;
       		 }
       	 } else if (type == 'type') {
       		 if ($scope.roadNameData.langCode == 'ENG') {
       			$scope.roadNameData.type = row.englishname;
       		 } else {
       			var param = {
                		word: row.name
            	};
            	dsMeta.convert(param).then(function (data) {
            		$scope.roadNameData.typePhonetic = data.phonetic;
            });
       			$scope.roadNameData.type = row.name;
       		 }
       		$scope.searchModal = false;
       	 }
        };
        /**
         * 前缀名称变化
         */
        $scope.prefixChange = function (event, obj) {
        	var param = {
        		word: obj.roadNameData.prefix
        	};
        	dsMeta.convert(param).then(function (data) {
        		$scope.roadNameData.prefixPhonetic = data.phonetic;
        });
        };
        /** *
         * 转拼音
         */
        $scope.getPy = function (event, obj, field, pyfield) {
        	if ($scope.roadNameData.langCode == 'ENG') {
        		return;
        	}
        	var param = {
            		word: obj.roadNameData[field]
        	};
        	dsMeta.convert(param).then(function (data) {
        		$scope.roadNameData[pyfield] = data.phonetic;
        });
        };
        $scope.test = function (row, index, type) {
        	if (type == 'namegroup') {
          		 if ($scope.roadNameFlag == 'add') {
          			var param = {
      	 					nameGroupid: parseInt(row.nameGroupid),
      	 					dbId: App.Temp.dbId
                   	};
               	dsMeta.rdnameGroup(param).then(function (data) {
               		if (data.data) {
               			swal('该道路名组内已经存在两条记录，不可再添加。请选择其他道路名组', '', 'info');
               		} else {
               			$scope.roadNameData.nameGroupid = row.nameGroupid;
               			$scope.searchModal = false;
               		}
               });
          		 } else if ($scope.roadNameFlag == 'edit') {
          			$scope.roadNameData.nameGroupid = row.nameGroupid;
          			$scope.searchModal = false;
          		 }
          	 }
        };
        /** *
         * 保存
         */
        $scope.doSave = function () {
        	// roadName为原始类型，查询返回里没有type,不能调用objectCtrl.setCurrentObject

            if ($scope.roadNameFlag == 'add') {
            	if ($scope.roadNameData.name == undefined || $scope.roadNameData.name == null || $scope.roadNameData.name == '') {
            		swal('道路名不能为空', '', 'info');
            		return;
            	} else if ($scope.roadNameData.adminId == undefined || $scope.roadNameData.adminId == null || $scope.roadNameData.adminId == '') {
            		swal('行政区划不能为空', '', 'info');
            		return;
            	}
            	if ($scope.roadNameData.langCode == 'ENG' || $scope.roadNameData.langCode == 'POR') {
            		if ($scope.roadNameData.nameGroupid == undefined || $scope.roadNameData.nameGroupid == null || $scope.roadNameData.nameGroupid == '') {
                		swal('非中文的语言类型，必须选择一个名称组', '', 'info');
                	}
            	} else {
            		var param = {
                			data: $scope.roadNameData,
                			dbId: App.Temp.dbId,
                			subtaskId: parseInt(App.Temp.subTaskId)
                	};
                	dsMeta.roadNameSave(param).then(function (data) {
                		if (data) {
                			if(data.flag == -1){
                				swal('重复', '新增道路名重复', 'error');
                				return;
                			}
                			$scope.closeSubModal();
//                    		$scope.$emit("REFRESHROADNAMELIST");
                    		swal({
        						title: '保存成功',
        						type: 'info',
        						showCancelButton: false,
        						closeOnConfirm: true,
        						confirmButtonText: '确定'
        					}, function (f) {
        						if (f) {
        							$scope.$emit('REFRESHROADNAMELIST');
//        							$scope.$apply();
        						}
        					});
                		}
                });
            	}
            } else if ($scope.roadNameFlag == 'edit') {
            	objectCtrl.data = $scope.roadNameData;
                objectCtrl.save();
                var changed = objectCtrl.changedProperty;
                if (changed) {
//                	'key' in obj; obj.hasOwnProperty('key')
                	changed.name = $scope.roadNameData.name;
                	changed.roadType = $scope.roadNameData.roadType;
                	changed.adminId = $scope.roadNameData.adminId;
                	changed.nameId = $scope.roadNameData.nameId;
                	changed.nameGroupid = $scope.roadNameData.nameGroupid;
                	var param = {
                			data: $scope.roadNameData,
                			dbId: App.Temp.dbId,
                			subtaskId: parseInt(App.Temp.subTaskId)
                	};
                	dsMeta.roadNameSave(param).then(function (data) {
                		if (data) {
                			if(data.flag == -1){
                				swal('重复', '新增道路名重复', 'error');
                				return;
                			}
                			$scope.closeEditPanel();
                			swal({
        						title: '保存成功',
        						type: 'info',
        						showCancelButton: false,
        						closeOnConfirm: true,
        						confirmButtonText: '确定'
        					}, function (f) {
        						if (f) {
        							$scope.$emit('REFRESHROADNAMELIST');
//        							$scope.$apply();
        						}
        					});
                		}
                });
                } else {
                	swal('属性值没有变化', '', 'info');
                }
            }
        };
        /** *
         * 道路类型切换
         */
        $scope.roadTypeChange = function (event, obj) {
        	if (obj.roadNameData.roadType == 1) { // 高速
        		$scope.hwInfoFlagDisable = false;
        		$scope.roadNameData.voiceFile = $scope.roadNameData.memo;
        	} else if (obj.roadNameData.roadType == 3) { // 铁路
        		$scope.typeEditable = false;// 类型名称
        		$scope.basePhoneticDisable = true;// 类型名发音
        		$scope.baseDisable = true;// 基本名称
        		$scope.basePhoneticEditable = false;// 基本名发音
        		$scope.prefixDisable = true;// 前缀名称
        		$scope.infixDisable = true;// 中缀名称
        		$scope.suffixDisable = true;// 后缀名称
        		$scope.voiceFileDisable = true;// 名称语音
        		$scope.srcFlagDisable = true;// 名称来源
        		$scope.codeTypeDisable = true;// 国家编号
        		$scope.adminIdDisable = true;// 行政区划
//    			$scope.adminIdEditable = false;//行政区划
    			$scope.hwInfoFlagDisable = true;
        	} else if (obj.roadNameData.roadType == 3) { // 出口编号
        		$scope.typeEditable = false;// 类型名称
        		$scope.basePhoneticDisable = true;// 类型名发音
        		$scope.baseDisable = true;// 基本名称
        		$scope.basePhoneticEditable = false;// 基本名发音
        		$scope.prefixDisable = true;// 前缀名称
        		$scope.infixDisable = true;// 中缀名称
        		$scope.suffixDisable = true;// 后缀名称
        		$scope.hwInfoFlagDisable = true;
        	} else {
        		$scope.initFieldEditable();
        	}
        };
        /** *
         * 语言切换事件
         */
        $scope.langCodeChange = function (event, obj) {
        	if (obj.roadNameData.langCode == 'ENG' || obj.roadNameData.langCode == 'POR') {
        		$scope.prefixOpt = prefixOpt_ENG;
        		$scope.roadNameData.prefixPhonetic = '';
        		$scope.infixOpt = infixOpt_ENG;
        		$scope.roadNameData.infixPhonetic = '';
        		$scope.suffixOpt = suffixOpt_ENG;
        		$scope.roadNameData.suffixPhonetic = '';
        	} else if (obj.roadNameData.langCode == 'CHI' || obj.roadNameData.langCode == 'CHT') {
        		$scope.prefixOpt = prefixOpt_CHI;
        		$scope.infixOpt = infixOpt_CHI;
        		$scope.suffixOpt = suffixOpt_CHI;
        	}
        };
        /** *
         * adminId 切换事件
         */
        $scope.adminIdChange = function (event, obj) {
        	$scope.roadNameData.adminName = getNameById(obj.roadNameData.adminId);
        };
        /**
         * 根据adminid 获取adminname
         */
        var getNameById = function (adminId) {
        	var name;
        	for (var i = 0; i < $scope.adminOpt.length; i++) {
        		if ($scope.adminOpt[i].id == adminId) {
        			name = $scope.adminOpt[i].label;
        		}
        	}
        	return name;
        };
        /* start 事件监听 *********************************************************/
        eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
    }


]);
