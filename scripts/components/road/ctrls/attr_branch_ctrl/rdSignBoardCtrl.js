/**
 * Created by wangmingdong on 2016/6/23.
 */
var namesOfBranch = angular.module("app");
namesOfBranch.controller("SignBoardOfBranchCtrl",['$scope','$timeout','$ocLazyLoad','dsEdit','appPath','dsMeta', function ($scope, $timeout, $ocLazyLoad,dsEdit,appPath,dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdBranch = layerCtrl.getLayerById("relationData");
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var selectCtrl = fastmap.uikit.SelectController();

    $scope.divergenceIds = objCtrl.data;
    objCtrl.setOriginalData(clone(objCtrl.data.getIntegrate()));
    $scope.refreshNames = function(){
		$scope.diverObj.signboards[0].names = [];
		for(var i=0,len=$scope.nameGroup.length;i<len;i++){
			for(var j=0,le=$scope.nameGroup[i].length;j<le;j++){
				$scope.diverObj.signboards[0].names.push($scope.nameGroup[i][j]);
			};
		};
	};
    $scope.initializeData = function () {

//        $scope.divergenceIds = objCtrl.data;
//        $scope.diverObj = $scope.divergenceIds;
        $scope.diverObj = objCtrl.data;
        $scope.nameGroup = [];
        initNameInfo();
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.nameBranchForm) {
            $scope.nameBranchForm.$setPristine();
        }

    };

    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.diverObj.pid), "RDBRANCH").then(function (data) {
            if (data) {
                objCtrl.setCurrentObject("RDBRANCH", data);
                $scope.initDiver();
            }
        });
    };
    /*点击关系类型*/
    $scope.switchRelType = function (code) {
        $scope.diverObj.relationshipType = code;
    };
    /*点击箭头图标志*/
    $scope.switchArrowType = function (code) {
        $scope.diverObj.signboards[0].arrowFlag = code;
    };
    /*根据id获取箭头图图片*/
    $scope.getArrowPic = function (id) {
        var params = {
            "id": id + ''
        };
        return dsMeta.getArrowImg(JSON.stringify(params));
    };

    $scope.picNowNum = 0;
    $scope.getPicsData = function () {
        $scope.loadText = 'loading...';
        $scope.showPicLoading = true;
        $scope.picPageNum = 0;
        if ($scope.picNowNum == 0) {
            $scope.picNowNum = 1;
        }
        $scope.picPageNum = $scope.picNowNum - 1;
        var params = {
            "name": $scope.diverObj.signboards[0].arrowCode,
            "pageNum": $scope.picPageNum,
            "pageSize": 6
        };
        dsMeta.getArrowImgGroup(params).then(function (data) {
            if (data.errcode == 0) {
                if (data.data.total == 0) {
                    $scope.loadText = '搜不到数据';
                    $scope.pictures = [];
                } else {
                    $scope.showPicLoading = false;
                    $scope.pictures = data.data.data;
                    $scope.picTotal = Math.ceil(data.data.total / 6);
                }
            }
        });
    }
    /*输入箭头图代码显示选择图片界面*/
    $scope.showPicSelect = function () {
        $scope.showImgData = false;
        $timeout(function () {
            if ($.trim($scope.diverObj.signboards[0].arrowCode) == '') {
                $scope.diverObj.signboards[0].backimageCode = '';
            };
            $scope.diverObj.signboards[0].arrowCode = CtoH($scope.diverObj.signboards[0].arrowCode);
            if(!testRegExp($scope.diverObj.signboards[0].arrowCode)){
                $scope.diverObj.signboards[0].arrowCode = $scope.diverObj.signboards[0].arrowCode.substring(0, $scope.diverObj.signboards[0].arrowCode.length - 1);
                $scope.$apply();
                return false;
            }
        });
        $timeout(function () {
            if ($.trim($scope.diverObj.signboards[0].arrowCode).length > 0) {
                $scope.diverObj.signboards[0].backimageCode = '0' + $.trim($scope.diverObj.signboards[0].arrowCode).substr(1);
                $scope.picNowNum = 1;
                $scope.getPicsData();
                $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.signboards[0].arrowCode);
                $scope.backimageCodeSrc = $scope.getArrowPic($scope.diverObj.signboards[0].backimageCode);
                if ($.trim($scope.diverObj.signboards[0].arrowCode) == '') {
                    $scope.showImgData = false;
                } else {
                    $scope.showImgData = true;
                }
                $scope.$apply();
            }
        }, 1000);
    }
    /*正则检测实景图输入是否正确*/
    function testRegExp(str){
        if(str.length == 1){
            if(new RegExp('^[0-9]*$').test(str.substr(-1,1))){
                return true;
            }else{
                return false;
            }
        }else if(str.length < 12){
            if(new RegExp('^[A-Z0-9]+$').test(str.substr(-1,1))){
                return true;
            }else{
                return false;
            }
        }else if(str.length > 11){
            return false;
        }
    }
    /*全角转半角*/
    function CtoH(str){
        var result="";
        for (var i = 0; i < str.length; i++){
            if (str.charCodeAt(i)==12288){
                result+= String.fromCharCode(str.charCodeAt(i)-12256);
                continue;
            }
            if (str.charCodeAt(i)>65280 && str.charCodeAt(i)<65375) result+= String.fromCharCode(str.charCodeAt(i)-65248);
            else result+= String.fromCharCode(str.charCodeAt(i));
        }
        return result;
    }
    /*箭头图代码点击下一页*/
    $scope.picNext = function () {
        $scope.picNowNum += 1;
        $scope.getPicsData();
    }
    /*箭头图代码点击上一页*/
    $scope.picPre = function () {
        $scope.picNowNum -= 1;
        $scope.getPicsData();
    }
    /*点击选中的图片*/
    $scope.selectPicCode = function (code) {
        $scope.diverObj.signboards[0].arrowCode = code;
        $scope.diverObj.signboards[0].backimageCode = '0' + $.trim($scope.diverObj.signboards[0].arrowCode).substr(1);
        $scope.arrowMapShow = $scope.getArrowPic(code);
        $scope.backimageCodeSrc = $scope.getArrowPic($scope.diverObj.signboards[0].backimageCode);
        $scope.showImgData = false;
        oldPatCode = $scope.diverObj.signboards[0].backimageCode;
    }
    /*点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function (e) {
        $scope.showImgData = false;
    }
    $scope.strClone = function(obj){
        var o, obj;
        if (obj.constructor == Object){
            o = new obj.constructor();
        }else{
            o = new obj.constructor(obj.valueOf());
        }
        for(var key in obj){
            if ( o[key] != obj[key] ){
                if ( typeof(obj[key]) == 'object' ){
                    o[key] = clone(obj[key]);
                }else{
                    o[key] = obj[key];
                }
            }
        }
        o.toString = obj.toString;
        o.valueOf = obj.valueOf;
        return o;
    }
    /*修改模式图号*/
    $scope.changeBackimageCode = function(){
        if($scope.diverObj.signboards[0].backimageCode.charAt(0) == oldPatCode.charAt(0) ||
            $scope.diverObj.signboards[0].backimageCode.length >  oldPatCode.length ||
            ($scope.diverObj.signboards[0].backimageCode.length+1 <=  oldPatCode.length && $scope.diverObj.signboards[0].backimageCode.length+1 !=  oldPatCode.length)){
            $scope.diverObj.signboards[0].backimageCode = oldPatCode;
        }
    }
    /*关系类型*/
    $scope.relationType = [
        {"code": 1, "label": "路口"},
        {"code": 2, "label": "线线"}
    ];
    /*初始化信息显示*/
    $scope.initDiver = function () {
        $scope.initializeData();
        var dObj = $scope.diverObj;
        $scope.$emit("SWITCHCONTAINERSTATE", {"subAttrContainerTpl": false});
        /*经过线*/
        if (dObj) {
            highRenderCtrl.highLightFeatures.push({
                id:$scope.diverObj.inLinkPid.toString(),
                layerid:'rdLink',
                type:'line',
                style:{
                    color: '#21ed25',
                    strokeWidth:3
                }
            });
            highRenderCtrl.highLightFeatures.push({
                id:$scope.diverObj.outLinkPid.toString(),
                layerid:'rdLink',
                type:'line',
                style:{
                    color: '#CD0011'
                }
            });
            highRenderCtrl.highLightFeatures.push({
                id: $scope.diverObj.nodePid.toString(),
                layerid: 'rdLink',
                type: 'rdnode',
                style: {color:'yellow'}
            });
            //高亮分歧图标;
            highRenderCtrl.highLightFeatures.push({
                id:$scope.diverObj.signboards[0].pid.toString(),
                layerid:'relationData',
                type:'relationData',
                style:{}
            });
            for(var i=0;i<$scope.diverObj.vias.length;i++){
                highRenderCtrl.highLightFeatures.push({
                    id:$scope.diverObj.vias[i].linkPid.toString(),
                    layerid:'rdLink',
                    type:'line',
                    style:{color:'blue'}
                })
            }
            highRenderCtrl.drawHighlight();
            /*模式图信息条数*/
            if (dObj.signboards.length > 0) {
                if ($scope.diverObj.signboards[0].arrowCode) {
                    $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.signboards[0].arrowCode);
                }
                $scope.backimageCodeSrc =  $scope.getArrowPic($scope.diverObj.signboards[0].backimageCode);
                /*分歧号码*/
                $scope.branchPid = dObj.signboards[0].branchPid;
            }
        }
    }
    /*clone对象*/
    function clone(obj) {
        var o;
        switch (typeof obj) {
            case 'undefined':
                break;
            case 'string'   :
                o = obj + '';
                break;
            case 'number'   :
                o = obj - 0;
                break;
            case 'boolean'  :
                o = obj;
                break;
            case 'object'   :
                if (obj === null) {
                    o = null;
                } else {
                    if (obj instanceof Array) {
                        o = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            o.push(clone(obj[i]));
                        }
                    } else {
                        o = {};
                        for (var k in obj) {
                            o[k] = clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
    }
    /*数组删除一个元素*/
    $scope.arrRemove = function (array, dx) {
        if (isNaN(dx) || dx > array.length) {
            return false;
        }
        array.splice(dx, 1);
    }
    /*过滤signboards[0].names中未修改的名称*/
    $scope.delEmptyNames = function (arr) {
        for (var i = arr.length - 1; i > -1; i--) {
            if (!arr[i].objStatus) {
                // $scope.arrRemove(arr,i);
                arr.splice(i, 1);
            }
        }
    }
    /*展示详细信息*/
    $scope.showDetail = function (type, nameInfo, nameGroupid) {
        var tempCtr = '', tempTepl = '';
        if (type == 0) {  //名称信息
            tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/rdBranchNameCtl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/rdBranchNameTpl.html';
        } else {  //经过线
            tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/passlineCtrl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/passlineTepl.html';
        }
//        var detailInfo = {
//            "loadType": "subAttrTplContainer",
//            "propertyCtrl": tempCtr,
//            "propertyHtml": tempTepl
//            "data":objCtrl.data.signboards[0].names
//        };
        var showBranchInfoObj = {
                "loadType": "subAttrTplContainer",
                "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
                "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
                "callback": function () {
                    var detailInfo = {
                        "loadType": "subAttrTplContainer",
                        "propertyCtrl": tempCtr,
                        "propertyHtml": tempTepl
                    };
                    $scope.$emit("transitCtrlAndTpl", detailInfo);
                }
        };
        objCtrl.namesInfos = $scope.getItemByNameGroupid($scope.nameGroup,nameGroupid);
        $scope.$emit("transitCtrlAndTpl", showBranchInfoObj);
    };
    /****
     * 根据nameGroupid获取对应的数据
     */
    $scope.getItemByNameGroupid = function(arr,nameGroupid){
    	var index = -1;
    	var item;
    	for(var i=0;i<arr.length;i++){
    		for(var j=0;j<arr[i].length;j++){
    			if(arr[i][j].nameGroupid == nameGroupid){
    				index = i;
    				break;
    			};
    		}
    		if(index >=0){
    			item = arr[i];
    			break;
    		};
    	};
    	return item;
    };
    if (objCtrl.data) {
        $scope.initDiver();
    }
    objCtrl.updateRdBranch = function () {
        $scope.divergenceIds = objCtrl.data;
        $scope.diverObj = {};
        $scope.initDiver();
    };
    /*保存分歧数据*/
    $scope.save = function () {
    	$scope.refreshNames();
        if (!$scope.diverObj) {
            swal("操作失败", "请输入属性值！", "error");
            return false;
        }
        //将出口编号转换成大写
        if(objCtrl.data.signboards[0].exitNum){
            objCtrl.data.signboards[0].exitNum = Utils.ToDBC(objCtrl.data.signboards[0].exitNum);
        }
        if(objCtrl.data.signboards[0].names && objCtrl.data.signboards[0].names.length > 0){
            for(var i = 0 ; i < objCtrl.data.signboards[0].names.length; i ++ ){
                objCtrl.data.signboards[0].names[i].name = Utils.ToDBC(objCtrl.data.signboards[0].names[i].name);
            }
        }
        objCtrl.save();
        var param = {};
        param.type = "RDBRANCH";
        param.command = "UPDATE";
        param.dbId = App.Temp.dbId;
        param.data = objCtrl.changedProperty;
        function compareObjData(oldData,newData){
            var compData = [];
            for(var i=0;i<oldData.length;i++){
                delete oldData[i]._initHooksCalled;
                delete oldData[i].geoLiveType;
                delete oldData[i].$$hashKey;
                delete oldData[i].options;
                for(var j=0;j<newData.length;j++){
                    delete newData[j]._initHooksCalled;
                    delete newData[j].geoLiveType;
                    delete newData[j].$$hashKey;
                    delete newData[j].options;
                    if(newData[j].pid == 0){
                        newData[j]['objStatus'] = 'INSERT';
                        compData.push(newData[j]);
                    }else{
                        // 数值变化则UPDATE
                        if(newData[j].pid == oldData[i].pid){
                            for(item in newData[j]){
                                if(oldData[i][item] != newData[j][item] && item !='objStatus'){
                                    newData[j]['objStatus'] = 'UPDATE';
                                }
                            }
                            compData.push(newData[j]);
                            break;
                        }
                        if(j == newData.length-1 && newData[j].pid != oldData[i].pid){
                            oldData[i] = new fastmap.dataApi.rdBranchSignBoardName(oldData[i]);
                            delete oldData[i]._initHooksCalled;
                            delete oldData[i].geoLiveType;
                            delete oldData[i].$$hashKey;
                            delete oldData[i].options;
                            oldData[i]['objStatus'] = 'DELETE';
                            compData.push(oldData[i]);
                        }
                    }
                }
            }
            var n = []; //一个新的临时数组
            for(var i = 0; i < compData.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (n.indexOf(compData[i]) == -1) n.push(compData[i]);
            }
            return n;
        }
        /*解决linkPid报错*/
//        if (param.data.signboards) {
//            delete param.data.signboards[0].linkPid;
//            if (param.data.signboards[0].names) {
//                if(objCtrl.originalData.signboards[0].names.length){
//                    param.data.signboards[0].names = compareObjData(objCtrl.originalData.signboards[0].names,objCtrl.data.signboards[0].names);
//                }
//            }
//        }
//        $scope.refreshNames();
        if (!param.data) {
            swal("操作成功",'属性值没有变化！', "success");
            return false;
        }
//        for(var i=0;i<param.data.signboards[0].names;i++){
//        	delete param.data.signboards[0].names[i]._initHooksCalled;
//            delete param.data.signboards[0].names[i].geoLiveType;
//            delete param.data.signboards[0].names[i].$$hashKey;
//            delete param.data.signboards[0].names[i].options;
//        }
        dsEdit.save(param).then(function (data) {
            if (data) {
                if (selectCtrl.rowkey) {
                    var stageParam = {
                        "rowkey": selectCtrl.rowkey.rowkey,
                        "stage": 3,
                        "handler": 0
                    };
                    dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function (data) {
                        selectCtrl.rowkey.rowkey = undefined;
                    });
                }
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                rdBranch.redraw();
            }
            $scope.refreshData();
        });
    };


    /*删除pid*/
    $scope.delete = function () {
        var detailId = $scope.diverObj.signboards[0].pid;
        dsEdit.deleteBranchByDetailId(detailId,9).then(
            function(params){
                if(params){
                    highRenderCtrl.highLightFeatures = null;
                    highRenderCtrl._cleanHighLight();
                    rdBranch.redraw();
                    $scope.$emit('SWITCHCONTAINERSTATE', {
            					'subAttrContainerTpl': false,
            					'attrContainerTpl': false
            				});
                }
            }
        );
    }

    /*取消属性编辑*/
    $scope.cancel = function () {
    }
//    $scope.$watch('nameGroup',function(newValue,oldValue,scope){
//		$scope.refreshNames();
//	},true);
    function initNameInfo(){
		if($scope.diverObj.signboards[0].names.length > 0){
			$scope.nameGroup = [];
			/*根据数据中对象某一属性值排序*/
			function compare(propertyName) {
				return function (object1, object2) {
					var value1 = object1[propertyName];
					var value2 = object2[propertyName];
					if (value2 < value1) {
						return -1;
					}
					else if (value2 > value1) {
						return 1;
					}
					else {
						return 0;
					}
				}
			}
			$scope.diverObj.signboards[0].names.sort(compare('nameGroupid'));
			//获取所有的nameGroupid
            var nameGroupidArr = [];
            for(var i = 0;i< $scope.diverObj.signboards[0].names.length;i++){
            	nameGroupidArr.push($scope.diverObj.signboards[0].names[i].nameGroupid);
            }
            //去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
			for(var i=0,len=nameGroupidArr.length;i<len;i++){
				var tempArr = [];
				for(var j=0,le=$scope.diverObj.signboards[0].names.length;j<le;j++){
					if($scope.diverObj.signboards[0].names[j].nameGroupid == nameGroupidArr[i]){
						tempArr.push($scope.diverObj.signboards[0].names[j]);
					}
				}
				$scope.nameGroup.push(tempArr);
			}
			$scope.refreshNames();
		}
	}
    /*增加item*/
	$scope.addItem = function () {
		$scope.refreshNames();
		var maxNameGroupId = 0;
		if($scope.diverObj.signboards[0].names.length>0){
			maxNameGroupId = Utils.getArrMax($scope.diverObj.signboards[0].names,'nameGroupid');
		}
		objCtrl.data.signboards[0].names.push(fastmap.dataApi.rdBranchSignBoardName({
			"nameGroupid" : maxNameGroupId+1
		}));
		initNameInfo();
	};
	/*移除item*/
	$scope.removeItem = function (index,item) {
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            if ($scope.nameGroup[i]) {
                for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                    if ($scope.nameGroup[i][j] === item) {
                        if ($scope.nameGroup[i].length == 1) {
                            $scope.nameGroup.splice(i, 1);
                            for (var n = 0, nu = $scope.nameGroup.length; n < nu; n++) {
                                if (n >= i) {
                                    for (var m = 0, num = $scope.nameGroup[n].length; m < num; m++) {
                                        $scope.nameGroup[n][m].nameGroupid--;
                                    }
                                }
                            }
                        } else {
                            $scope.nameGroup[i].splice(index, 1);
                        }
                    }
                }
            }
        }
        $scope.refreshNames();
        $scope.$emit('SWITCHCONTAINERSTATE', {
            'subAttrContainerTpl': false,
            'attrContainerTpl': true
        });
    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initDiver);
}])
