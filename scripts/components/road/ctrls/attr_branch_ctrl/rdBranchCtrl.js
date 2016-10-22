/**
 * Created by liwanchong on 2016/2/29.
 */
var namesOfBranch = angular.module("app");
namesOfBranch.controller("namesOfBranchCtrl",['$scope','$timeout','$ocLazyLoad','dsEdit','appPath','dsMeta', function ($scope, $timeout, $ocLazyLoad,dsEdit,appPath,dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdBranch = layerCtrl.getLayerById("relationData");
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var selectCtrl = fastmap.uikit.SelectController();


    $scope.divergenceIds = objCtrl.data;
    $scope.initializeData = function () {
        //如果是3d分歧则关系类型改为3
        if(shapeCtrl.editFeatType == 1 || shapeCtrl.editFeatType == 3){
            // objCtrl.data.details[0].branchType = 3;
            $('[data-toggle="tooltip"]').tooltip();
        }

        $scope.divergenceIds = objCtrl.data;
        $scope.diverObj = $scope.divergenceIds;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        objCtrl.namesInfo = objCtrl.data.details[0].names;

        if($scope.diverObj.details[0].branchType == 3 || $scope.diverObj.details[0].branchType == 4){
            $scope.diverObj.details[0].estabType = 9;
            $scope.diverObj.details[0].nameKind = 9;
        }else{
            $scope.diverObj.details[0].estabType = 0;
            $scope.diverObj.details[0].nameKind = 0;
        }

        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.nameBranchForm) {
            $scope.nameBranchForm.$setPristine();
        }
        selectCtrl.onSelected({//记录选中点信息
            geometry: objCtrl.data,
            id: objCtrl.data.pid
        });
        if($scope.diverObj.details[0].patternCode){
            $scope.firstLetter = $scope.diverObj.details[0].patternCode.substring(0,1);
            $scope.rightLetter = $scope.diverObj.details[0].patternCode.substring(1)
        }
    }

    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.diverObj.pid), "RDBRANCH").then(function (data) {
            if (data) {
                objCtrl.setCurrentObject("RDBRANCH", data);
                $scope.initDiver();
            }
        });
    };
    $scope.setOriginalDataFunc = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    }
    /*点击关系类型*/
    $scope.switchRelType = function (code) {
        $scope.diverObj.relationshipType = code;
    }
    /*点击箭头图标志*/
    $scope.switchArrowType = function (code) {
        $scope.diverObj.details[0].arrowFlag = code;
    }
    /*根据id获取箭头图图片*/
     function getArrowPic(id) {
        var params = {
            "id": id + ''
        };
        return dsMeta.getArrowImg(JSON.stringify(params));
    }

    $scope.picNowNum = 0;
    $scope.getPicsDate = function () {
        $scope.loadText = 'loading...';
        $scope.showPicLoading = true;
        $scope.picPageNum = 0;
        if ($scope.picNowNum == 0) {
            $scope.picNowNum = 1;
        }
        $scope.picPageNum = $scope.picNowNum - 1;
        var params = {
            "name": $scope.diverObj.details[0].arrowCode,
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
    //校验箭头图合法性
    $scope.validArrowCode = function(){
        switch($scope.diverObj.details[0].branchType){
            case 0:
                return new RegExp('^[0-2]*$').test($scope.diverObj.details[0].arrowCode.substr(0,1));
            case 1:
                return new RegExp('^[0-2]*$').test($scope.diverObj.details[0].arrowCode.substr(0,1));
            case 2:
                return new RegExp('^[0-2]*$').test($scope.diverObj.details[0].arrowCode.substr(0,1));
            case 3:
                return new RegExp('^[ec]').test($scope.diverObj.details[0].arrowCode);
            case 4:
                return new RegExp('^[ecd]').test($scope.diverObj.details[0].arrowCode);
        }
    };
    /*输入箭头图代码显示选择图片界面*/
    $scope.showPicSelect = function () {
        if(!$scope.validArrowCode()){
            $scope.diverObj.details[0].arrowCode = '';
        }
        $scope.showImgData = false;
        $timeout(function () {
            if ($.trim($scope.diverObj.details[0].arrowCode) == '') {
                $scope.diverObj.details[0].patternCode = '';
            }
            $scope.diverObj.details[0].arrowCode = CtoH($scope.diverObj.details[0].arrowCode);
            if($scope.diverObj.details[0].branchType != 3 && !testRegExp($scope.diverObj.details[0].arrowCode)){
                $scope.diverObj.details[0].arrowCode = $scope.diverObj.details[0].arrowCode.substring(0, $scope.diverObj.details[0].arrowCode.length - 1);
                $scope.$apply();
                return false;
            }
        /*});
        $timeout(function () {*/
            if ($.trim($scope.diverObj.details[0].arrowCode).length > 0) {
                if($scope.diverObj.details[0].branchType == 4){
                    $scope.diverObj.details[0].patternCode = '7' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }else{
                    $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            }
            $scope.picNowNum = 1;
            $scope.getPicsDate();
            $scope.arrowMapShow = getArrowPic($scope.diverObj.details[0].arrowCode);
            $scope.patternCodeSrc = getArrowPic($scope.diverObj.details[0].patternCode);
            if ($.trim($scope.diverObj.details[0].arrowCode) == '') {
                $scope.showImgData = false;
            } else {
                $scope.showImgData = true;
            }
            $scope.$apply();
        }, 1000);
    };
    /*正则检测实景图输入是否正确*/
    function testRegExp(str){
        if(str.length < 12){
            if(new RegExp('^[a-f0-9]*$').test(str.substr(-1,1))){
                return true;
            }else{
                return false;
            }
        }else{
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
            if (str.charCodeAt(i)>65280 && str.charCodeAt(i)<65375){
                result+= String.fromCharCode(str.charCodeAt(i)-65248);
            }else{
                result+= String.fromCharCode(str.charCodeAt(i));
            }
        }
        return result;
    }
    /*箭头图代码点击下一页*/
    $scope.picNext = function () {
        $scope.picNowNum += 1;
        $scope.getPicsDate();
    };
    /*箭头图代码点击上一页*/
    $scope.picPre = function () {
        $scope.picNowNum -= 1;
        $scope.getPicsDate();
    };
    /*改变当前箭头图的坐标位置*/
    function changeArrowPosition() {
        var $picMapShow = $("#picMapShow");
        $picMapShow.show();
    }
    /*点击选中的图片*/
    $scope.selectPicCode = function (code, url) {
        $scope.diverObj.details[0].arrowCode = code;
        if($scope.diverObj.details[0].branchType == 4){
            $scope.diverObj.details[0].patternCode = '7' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
        }else{
            $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
        }
        $scope.arrowMapShow = url;
        $scope.patternCodeSrc = getArrowPic($scope.diverObj.details[0].patternCode);
        $scope.showImgData = false;
        oldPatCode = $scope.diverObj.details[0].patternCode;
        $scope.firstLetter = $scope.diverObj.details[0].patternCode.substring(0,1);
        $scope.rightLetter = $scope.diverObj.details[0].patternCode.substring(1);
        changeArrowPosition();
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
    $scope.changePatternCode = function(){
        if($scope.diverObj.details[0].patternCode.charAt(0) == oldPatCode.charAt(0) ||
            $scope.diverObj.details[0].patternCode.length >  oldPatCode.length ||
            ($scope.diverObj.details[0].patternCode.length+1 <=  oldPatCode.length && $scope.diverObj.details[0].patternCode.length+1 !=  oldPatCode.length)){
            $scope.diverObj.details[0].patternCode = oldPatCode;
        }
        if($scope.diverObj.details[0].branchType == 1){
            if($scope.diverObj.details[0].patternCode.charAt(0)!=5 &&$scope.diverObj.details[0].patternCode.charAt(0)!=7 && $scope.diverObj.details[0].patternCode.charAt(0)!=8){
                $scope.diverObj.details[0].patternCode = $scope.diverObj.details[0].patternCode.substring(1);
            }
        }else if($scope.diverObj.details[0].branchType == 3){
            if($scope.diverObj.details[0].patternCode.charAt(0)==5 || $scope.diverObj.details[0].patternCode.charAt(0)==8){
                $scope.diverObj.details[0].patternCode = $scope.diverObj.details[0].patternCode.substring(0,1)+$scope.rightLetter;
            }else{
                $scope.diverObj.details[0].patternCode = $scope.firstLetter+$scope.rightLetter;
            }
        }else if($scope.diverObj.details[0].branchType == 4){
            if($scope.diverObj.details[0].patternCode.charAt(0)==7){
                $scope.diverObj.details[0].patternCode = $scope.diverObj.details[0].patternCode.substring(0);
            }else{
                $scope.diverObj.details[0].patternCode = $scope.diverObj.details[0].patternCode.substring(1);
            }
        }
    }
    /*检测模式图输入是否合法*/
    function testParttenCodeReg(str){
        if(str.length < 12){
            if(new RegExp('^[a-f0-9]*$').test(str.substr(-1,1))){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    /*当分歧类型变更时*/
    $scope.changeBranchType = function(type){
        if(type == 1 || type == 3){
            $('[data-toggle="tooltip"]').tooltip();
        }
        if($scope.diverObj.details[0].patternCode.length == oldPatCode.length){
            if(type == 0){
                if($scope.diverObj.details[0].patternCode.charAt(0) != 8){
                    $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            }else if(type == 1){
                if($scope.diverObj.details[0].patternCode.charAt(0) != 5 ||$scope.diverObj.details[0].patternCode.charAt(0) != 7 ||$scope.diverObj.details[0].patternCode.charAt(0) != 8){
                    $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            }else if(type == 3){
                if($scope.diverObj.details[0].patternCode.charAt(0) != 5 ||$scope.diverObj.details[0].patternCode.charAt(0) != 8){
                    $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            }else if(type == 4){
                if($scope.diverObj.details[0].patternCode.charAt(0) != 7){
                    $scope.diverObj.details[0].patternCode = '7' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            }
        }

        if($scope.diverObj.details[0].branchType == 3 || $scope.diverObj.details[0].branchType == 4){
            $scope.diverObj.details[0].estabType = 9;
            $scope.diverObj.details[0].nameKind = 9;
        }else{
            $scope.diverObj.details[0].estabType = 0;
            $scope.diverObj.details[0].nameKind = 0;
        }

        $scope.diverObj.details[0].arrowCode = '';
        $scope.diverObj.details[0].patternCode = '';
        $scope.$emit('SWITCHCONTAINERSTATE', {
            'subAttrContainerTpl': false,
            'attrContainerTpl': true
        });
    };
    /*关系类型*/
    $scope.relationType = [
        {"code": 1, "label": "路口"},
        {"code": 2, "label": "线线"}
    ];
    /*分歧类型*/
    $scope.branchTypeOptions = [
        {"id": 0, "label": "高速分歧(无名称)"},
        {"id": 1, "label": "方面分歧"},
        {"id": 2, "label": "IC分歧"},
        {"id": 3, "label": "3D分歧"},
        {"id": 4, "label": "复杂路口模式图(7开头)"}
    ];
    /*箭头图标志*/
    $scope.arrowPicFlag = [
        {"code": 0, "label": "无"},
        {"code": 1, "label": "直行箭头标志"}
    ];
    $scope.estabTypeOptions = [
        {"id": 0, "label": "0 默认"},
        {"id": 1, "label": "1 出口"},
        {"id": 2, "label": "2 入口"},
        {"id": 3, "label": "3 SA"},
        {"id": 4, "label": "4 PA"},
        {"id": 5, "label": "5 JCT"},
        {"id": 9, "label": "9 不应用"}
    ];

    $scope.nameKindOptions = [
        {"id": 0, "label": "0 默认"},
        {"id": 1, "label": "1 IC"},
        {"id": 2, "label": "2 SA"},
        {"id": 3, "label": "3 PA"},
        {"id": 4, "label": "4 JCT"},
        {"id": 5, "label": "5 出口"},
        {"id": 6, "label": "6 入口"},
        {"id": 7, "label": "7 RAMP"},
        {"id": 8, "label": "8 出入口"},
        {"id": 9, "label": "9 不应用"}

    ];
    $scope.voiceDirOptions = [
        {"id": 0, "label": "0 无"},
        {"id": 2, "label": "2 右"},
        {"id": 5, "label": "5 左"},
        {"id": 9, "label": "9 不应用"}
    ];

    $scope.guideCodeOptions = [
        {"id": 0, "label": "0 无向导"},
        {"id": 1, "label": "1 高架向导"},
        {"id": 2, "label": "2 Underpath向导"},
        {"id": 3, "label": "3 未调查"},
        {"id": 9, "label": "9 不应用"}
    ];
    /*初始化信息显示*/
     $scope.initDiver = function() {
        $scope.initializeData();
        var dObj = $scope.diverObj;
        $scope.$emit("SWITCHCONTAINERSTATE", {"subAttrContainerTpl": false})
        /*经过线*/
        if (dObj) {
            //高亮进入线
            highRenderCtrl.highLightFeatures.push({
                id:$scope.diverObj.inLinkPid.toString(),
                layerid:'rdLink',
                type:'line',
                style:{
                    color: '#21ed25',
                    strokeWidth:3
                }
            });
            //高亮退出线;
            highRenderCtrl.highLightFeatures.push({
                id:$scope.diverObj.outLinkPid.toString(),
                layerid:'rdLink',
                type:'line',
                style:{
                    color: '#CD0011'
                }
            });
            //高亮进入点;
            highRenderCtrl.highLightFeatures.push({
                id: $scope.diverObj.nodePid.toString(),
                layerid: 'rdLink',
                type: 'rdnode',
                style: {color:'yellow'}
            });
            //高亮分歧图标;
            highRenderCtrl.highLightFeatures.push({
                id:$scope.diverObj.details[0].pid.toString(),
                layerid:'relationData',
                type:'relationData',
                style:{}
            });
            //高亮经过线;
            for(var i=0;i<$scope.diverObj.vias.length;i++){
                highRenderCtrl.highLightFeatures.push({
                    id:$scope.diverObj.vias[i].linkPid.toString(),
                    layerid:'rdLink',
                    type:'line',
                    style:{color:'blue',strokeWidth:3}
                })
            }
            highRenderCtrl.drawHighlight();
            /*模式图信息条数*/
            if (dObj.details.length > 0) {
                $scope.arrowMapShow = '';
                $scope.patternCodeSrc = '';
                if ($scope.diverObj.details[0].arrowCode) {
                    $scope.arrowMapShow = getArrowPic($scope.diverObj.details[0].arrowCode);
                }
                $scope.patternCodeSrc =  getArrowPic($scope.diverObj.details[0].patternCode);
                /*分歧号码*/
                $scope.branchPid = dObj.details[0].branchPid;
                changeArrowPosition();
            }
        }
    }
    /*clone对象*/
    $scope.clone = function (obj) {
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
                            o.push($scope.clone(obj[i]));
                        }
                    } else {
                        o = {};
                        for (var k in obj) {
                            o[k] = $scope.clone(obj[k]);
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
    /*过滤details[0].names中未修改的名称*/
    $scope.delEmptyNames = function (arr) {
        for (var i = arr.length - 1; i > -1; i--) {
            if (!arr[i].objStatus) {
                // $scope.arrRemove(arr,i);
                arr.splice(i, 1);
            }
        }
    }
    /*展示详细信息*/
    $scope.showDetail = function (type) {
        var tempCtr = '', tempTepl = '';
        if (type == 0) {  //名称信息
            tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/nameInfoCtrl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/nameInfoTepl.html';
        } else {  //经过线
            if($scope.diverObj.vias.length == 0){
                return;
            }
            tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/passlineCtrl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/passlineTepl.html';
        }
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
        /*var detailInfo = {
            "loadType": "subAttrTplContainer",
            "propertyCtrl": tempCtr,
            "propertyHtml": tempTepl,
            "data":objCtrl.data.details[0].names
        };*/
        // objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        objCtrl.namesInfo = objCtrl.data.details[0].names;
        // $scope.$emit("transitCtrlAndTpl", detailInfo);
        $scope.$emit("transitCtrlAndTpl", showBranchInfoObj);
    };

    if (objCtrl.data) {
        $scope.initDiver();
    }
    objCtrl.updateRdBranch = function () {
        $scope.divergenceIds = objCtrl.data;
        $scope.diverObj = {};
        $scope.initDiver();
    };
    var oldPatCode = $scope.diverObj.details[0]?$scope.diverObj.details[0].patternCode:'';

    /*保存分歧数据*/
    $scope.save = function () {
        if (!$scope.diverObj) {
            swal("操作失败", "请输入属性值！", "error");
            return false;
        }
        //将出口编号转换成大写
        if(objCtrl.data.details[0].exitNum){
            objCtrl.data.details[0].exitNum = Utils.ToDBC(objCtrl.data.details[0].exitNum);
        }
        if(objCtrl.data.details[0].names && objCtrl.data.details[0].names.length > 0){
            for(var i = 0 ; i < objCtrl.data.details[0].names.length; i ++ ){
                objCtrl.data.details[0].names[i].name = Utils.ToDBC(objCtrl.data.details[0].names[i].name);
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
                    delete newData[i].snapShot;
                    delete newData[i].attributes;
                    delete newData[i].geometry;
                    delete newData[i].id;
                    delete newData[i].integrate;
                    delete newData[i]._initHooks;
                    delete newData[i].detailId;
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
                            oldData[i] = new fastmap.dataApi.rdBranchName(oldData[i]);
                            delete oldData[i]._initHooksCalled;
                            delete oldData[i].geoLiveType;
                            delete oldData[i].$$hashKey;
                            delete oldData[i].options;
                            delete oldData[i].snapShot;
                            delete oldData[i].attributes;
                            delete oldData[i].geometry;
                            delete oldData[i].id;
                            delete oldData[i].integrate;
                            delete oldData[i]._initHooks;
                            delete oldData[i].detailId;
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
        if (param.data.details) {
            delete param.data.details[0].linkPid;
            if (param.data.details[0].names) {
                if(objCtrl.originalData.details[0].names.length){
                    param.data.details[0].names = compareObjData(objCtrl.originalData.details[0].names,objCtrl.data.details[0].names);
                }
            }
        }
        /*if (param.data.details) {
            if (param.data.details[0].names) {
                // param.data.signboards[0].names = compareObjData(objCtrl.originalData.signboards[0].names,objCtrl.data.signboards[0].names);
                for(var i=0;i<param.data.details[0].names.length;i++){
                    delete param.data.details[0].names[i].snapShot;
                    delete param.data.details[0].names[i].attributes;
                    delete param.data.details[0].names[i].geometry;
                    delete param.data.details[0].names[i].id;
                    delete param.data.details[0].names[i].integrate;
                    delete param.data.details[0].names[i]._initHooksCalled;
                    delete param.data.details[0].names[i]._initHooks;
                    delete param.data.details[0].names[i].options;
                    delete param.data.details[0].names[i].detailId;
                    delete param.data.details[0].names[i].$$hashKey;
                }
            }
        }*/
        if (!param.data) {
            swal("操作成功",'属性值没有变化！', "success");
            return false;
        }
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
    }

    /*删除3D和高速分歧*/
    $scope.delete = function () {
        var detailId = $scope.diverObj.details[0].pid;
        var branchType = $scope.diverObj.details[0].branchType;
        dsEdit.deleteBranchByDetailId(detailId,branchType).then(function(params){
                if(params){
                    if (map.floatMenu) {
                        map.removeLayer(map.floatMenu);
                        map.floatMenu = null;
                    }
                    highRenderCtrl.highLightFeatures = null;
                    highRenderCtrl._cleanHighLight();
                    rdBranch.redraw();
                    $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
                }
            }
        );
    }
    /*取消属性编辑*/
    $scope.cancel = function () {

    }


    //if(eventController.eventTypesMap['SAVEPROPERTY'].length){
    //    eventController.eventTypesMap['SAVEPROPERTY'] = eventController.eventTypesMap['SAVEPROPERTY'][0];
    //    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    //}else{
    //    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    //}
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initDiver);
}])
