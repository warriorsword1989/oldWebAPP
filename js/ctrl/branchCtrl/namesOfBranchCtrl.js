/**
 * Created by liwanchong on 2016/2/29.
 */
var namesOfBranch = angular.module("mapApp", ['oc.lazyLoad']);
namesOfBranch.controller("namesOfBranchCtrl",function($scope,$timeout,$ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var divergenceIds = null,newObjData = {}, linksOfRestric = {};
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdBranch = layerCtrl.getLayerById("highSpeedDivergence");
    var eventController = fastmap.uikit.EventController();
    divergenceIds = objCtrl.data;
    $scope.divergenceIds = divergenceIds;
    $scope.diverId = divergenceIds.pid;
    $scope.diverObj = {};
    /*默认显示第一个分歧信息*/
    if(!objCtrl.data){
        return;
    }
    $scope.diverId = divergenceIds.pid;

    objCtrl.updateRdBranch=function() {
        divergenceIds = objCtrl.data;
        $scope.divergenceIds = divergenceIds;
        $scope.diverId = divergenceIds.pid;
        $scope.diverObj = {};
        $scope.getObjectById(true)
    };


    $timeout(function(){
        $('.diverRadio:first').triggerHandler('click');
    });
    $scope.setOriginalDataFunc = function(){
        objCtrl.setOriginalData(divergenceIds);
    }
    $scope.setOriginalDataFunc();
    /*点击关系类型*/
    $scope.switchRelType = function(code){
        $scope.relationCode = code;
    }
    /*点击箭头图标志*/
    $scope.switchArrowType = function(code){
        $scope.arrowFlag = code;
    }
    /*根据id获取箭头图图片*/
    $scope.getArrowPic = function(id){
        var params = {
            "id":id + ''
        }
        return Application.functions.getArrowImg(JSON.stringify(params));
    }
    /*点击翻页*/
    $scope.goPaging = function(){
        if($scope.picNowNum == 1){
            if($scope.picTotal == 0 || $scope.picTotal == 1){
                $(".pic-next").prop('disabled','disabled');
            }else{
                $(".pic-next").prop('disabled',false);
            }
            $(".pic-pre").prop('disabled','disabled');
        }else{
            if($scope.picTotal - $scope.picNowNum == 0){
                $(".pic-next").prop('disabled','disabled');
            }
            $(".pic-pre").prop('disabled',false);
        }
        $scope.$apply();
    }
    $scope.picNowNum = 0;
    $scope.getPicsDate = function(){
        $scope.loadText = 'loading...';
        $(".pic-loading").show();
        $scope.picPageNum = 0;
        if($scope.picNowNum == 0){
            $scope.picNowNum = 1;
        }
        $scope.picPageNum = $scope.picNowNum - 1;
        var params = {
            "name":$scope.arrowCode,
            "pageNum":$scope.picPageNum,
            "pageSize":6
        };
        Application.functions.getArrowImgGroup(JSON.stringify(params),function(data){
            if(data.errcode == 0){
                if(data.data.total == 0){
                    $scope.loadText = '搜不到数据';
                    $scope.pictures = [];
                    $scope.$apply();
                }else{
                    $(".pic-loading").hide();
                    $scope.pictures = data.data.data;
                    $scope.picTotal = Math.ceil(data.data.total/6);
                    $scope.goPaging();
                    $scope.$apply();
                }
            }
        });
    }
    /*输入箭头图代码显示选择图片界面*/
    $scope.showPicSelect = function(){
        $timeout(function(){
            if($.trim($scope.arrowCode).length > 0){
                $scope.patternCode = '8'+$.trim($scope.arrowCode).substr(1);
            }
            $scope.picNowNum = 1;
            $scope.getPicsDate();
            $scope.arrowMapShow = $scope.getArrowPic($scope.arrowCode);
            $("#picMapImg").attr('src',$scope.arrowMapShow);
            $("#picModalImg").attr('src',$scope.getArrowPic($scope.patternCode));
            $("#picMapDesc").text($scope.arrowCode);
            if($.trim($scope.arrowCode) == ''){
                $('.pic-show').hide();
            }else{
                $('.pic-show').show();
            }
            $scope.$apply();
        },1000);
    }
    /*箭头图代码点击下一页*/
    $scope.picNext = function(){
        $scope.picNowNum += 1;
        $scope.getPicsDate();
    }
    /*箭头图代码点击上一页*/
    $scope.picPre = function(){
        $scope.picNowNum -= 1;
        $scope.getPicsDate();
    }
    /*改变当前箭头图的坐标位置*/
    $scope.changeArrowPosition = function(){
        var $picMapShow = $("#picMapShow");
        $picMapShow.show();
    }
    /*点击选中的图片*/
    $scope.selectPicCode = function(code,url){
        $scope.arrowCode = code;
        $scope.patternCode = '8'+$.trim($scope.arrowCode).substr(1);
        $("#picMapImg").attr('src',url);
        $("#picModalImg").attr('src',$scope.getArrowPic($scope.patternCode));
        $("#picMapDesc").text(code);
        $('.pic-show').hide();
        $scope.changeArrowPosition();
    }
    /*点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function(e){
        $(e.target).parents('.pic-show').hide();
    }
    /*关系类型*/
    $scope.relationType = [
        {"code":1,"label":"路口"},
        {"code":2,"label":"线线"}
    ];
    /*分歧类型*/
    $scope.branchTypeOptions=[
        {"id": 0, "label": "高速分歧(无名称)"},
        {"id": 1, "label": "方面分歧"},
        {"id": 2, "label": "IC分歧"},
        {"id": 3, "label": "3D分歧"},
        {"id": 4, "label": "复杂路口模式图"}
    ];
    /*箭头图标志*/
    $scope.arrowPicFlag = [
        {"code":0,"label":"无"},
        {"code":1,"label":"直行箭头标志"}
    ];
    $scope.estabTypeOptions=[
        {"id":0,"label":"0 默认"},
        {"id": 1, "label": "1 出口"},
        {"id": 2, "label": "2 入口"},
        {"id": 3, "label": "3 SA"},
        {"id": 4, "label": "4 PA"},
        {"id": 5, "label": "5 JCT"},
        {"id": 9, "label": "9 不应用"}
    ];

    $scope.nameKindOptions=[
        {"id":0,"label":"0 默认"},
        {"id":1,"label":"1 IC"},
        {"id":2,"label":"2 SA"},
        {"id":3,"label":"3 PA"},
        {"id":4,"label":"4 JCT"},
        {"id":5,"label":"5 出口"},
        {"id":6,"label":"6 入口"},
        {"id":7,"label":"7 RAMP"},
        {"id":8,"label":"8 出入口"},
        {"id": 9, "label": "9 不应用"}

    ];
    $scope.voiceDirOptions=[
        {"id":0,"label":"0 无"},
        {"id": 2, "label": "2 右"},
        {"id": 5, "label": "5 左"},
        {"id": 9, "label": "9 不应用"}
    ];

    $scope.guideCodeOptions=[
        {"id":0,"label":"0 无向导"},
        {"id": 1, "label": "1 高架向导"},
        {"id": 2, "label": "2 Underpath向导"},
        {"id": 3, "label": "3 未调查"},
        {"id": 9, "label": "9 不应用"}
    ];
    /*初始化信息显示*/
    $scope.initDiver = function(){
        var dObj = $scope.diverObj;

        /*经过线*/
        if(dObj){
            $scope.relationCode = dObj.relationshipType;
            linksOfRestric["inLink"] = $scope.diverObj.inLinkPid+'';
            linksOfRestric["outLink"] = $scope.diverObj.outLinkPid+'';
            var highLightLinks=new fastmap.uikit.HighLightRender(rdLink,{map:map,highLightFeature:"links",linksObj:linksOfRestric})
            //清除地图上的高亮的feature
            if (highLightLayer.highLightLayersArr.length !== 0) {
                highLightLayer.removeHighLightLayers();
            }
            highLightLinks.drawOfLinksForInit();
            highLightLayer.pushHighLightLayers(highLightLinks);
            /*模式图信息条数*/
            if(dObj.details.length > 0){
                $scope.arrowFlag = dObj.details[0].arrowFlag;
                /*分歧类型*/
                $scope.branchType = dObj.details[0].branchType;
                /*出口编号*/
                $scope.exitNum = dObj.details[0].exitNum;
                /*设施类型*/
                $scope.estabType = dObj.details[0].estabType;
                /*名称种别*/
                $scope.nameKind = dObj.details[0].nameKind;
                /*声音方向*/
                $scope.voiceDir = dObj.details[0].voiceDir;
                /*向导代码*/
                $scope.guideCode = dObj.details[0].guideCode;
                /*模式图*/
                /*箭头图代码*/
                $scope.arrowCode = dObj.details[0].arrowCode;
                /*底图代码*/
                $scope.patternCode = dObj.details[0].patternCode;
                if($scope.arrowCode) {
                    $scope.arrowMapShow = $scope.getArrowPic($scope.arrowCode);
                }
                $("#picMapImg").attr('src',$scope.arrowMapShow);
                $("#picModalImg").attr('src',$scope.getArrowPic($scope.patternCode));
                $("#picMapDesc").text($scope.arrowCode);
                /*分歧号码*/
                $scope.branchPid = dObj.details[0].branchPid;
                // $(".detail-well").show();
                $scope.changeArrowPosition();
            }else{
                // $(".detail-well").hide();
                $("#picMapShow").hide();
            }
        }
    }
    /*clone对象*/
    $scope.clone = function(obj){
        var o;
        switch(typeof obj){
        case 'undefined': break;
        case 'string'   : o = obj + '';break;
        case 'number'   : o = obj - 0;break;
        case 'boolean'  : o = obj;break;
        case 'object'   :
            if(obj === null){
                o = null;
            }else{
                if(obj instanceof Array){
                    o = [];
                    for(var i = 0, len = obj.length; i < len; i++){
                        o.push($scope.clone(obj[i]));
                    }
                }else{
                    o = {};
                    for(var k in obj){
                        o[k] = $scope.clone(obj[k]);
                    }
                }
            }
            break;
        default:        
            o = obj;break;
        }
        return o;   
    }
    /*数组删除一个元素*/
    $scope.arrRemove = function(array,dx){
        if(isNaN(dx)||dx>array.length){return false;} 
        array.splice(dx,1); 
    }
    /*过滤details[0].names中未修改的名称*/
    $scope.delEmptyNames = function(arr){
        for(var i=arr.length-1;i>-1;i--){
            if(!arr[i].objStatus){
                // $scope.arrRemove(arr,i);
                arr.splice(i,1);
            }
        }
    }
    /*展示详细信息*/
    $scope.showDetail=function(type) {
        if(! $scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = true;
        }
        if(type == 0){  //  名称
            $ocLazyLoad.load('ctrl/branchCtrl/nameInfoCtrl').then(function () {
                $scope.$parent.$parent.suspendObjURL = "js/tepl/branchTepl/nameInfoTepl.html";
            });
        }else{  //经过线
            $ocLazyLoad.load('ctrl/branchCtrl/passlineCtrl').then(function () {
                $scope.$parent.$parent.suspendObjURL = "js/tepl/branchTepl/passlineTepl.html";
            });
        }
        $scope.changeArrowPosition();
    };

    $scope.getObjectById = function(type){
         //箭头图
         if(type){
            $scope.diverObj = divergenceIds;
            $scope.initDiver();
         }else{
            Application.functions.getRdObjectById(divergenceIds.pid,"RDBRANCH", function (data) {
                if(data.errcode == 0){
                    $scope.diverObj = data.data;
                    objCtrl.setCurrentObject($scope.diverObj);
                    $scope.initDiver();
                    $scope.$apply();
                }else{
                    $scope.$apply();
                    swal("查询失败", "问题原因："+data.errmsg, "error");
                }
            });
         }
    }
    $scope.getObjectById(true);
    /*关闭详细信息面板，移动箭头图位置*/
    $scope.$parent.$parent.changeSuspendShow = function(){
        $scope.$parent.$parent.suspendFlag = false;
        $scope.changeArrowPosition();
    }
    /*保存分歧数据*/
    $scope.save = function () {
        if(!$scope.diverObj){
            swal("操作失败", "请输入属性值！", "error");
            return false;
        }
        newObjData = $scope.clone($scope.diverObj);
        newObjData.relationshipType = $scope.relationCode;
        newObjData.pid = parseInt($scope.diverId);
        if(newObjData.details.length == 0){
            newObjData.details.push({});
        }
        newObjData.details[0].branchType = $scope.branchType;
        newObjData.details[0].exitNum = $scope.exitNum;
        newObjData.details[0].estabType = $scope.estabType;
        newObjData.details[0].nameKind = $scope.nameKind;
        newObjData.details[0].voiceDir = $scope.voiceDir;
        newObjData.details[0].guideCode = $scope.guideCode;
        newObjData.details[0].arrowFlag = $scope.arrowFlag;
        newObjData.details[0].arrowCode = $scope.arrowCode;
        newObjData.details[0].patternCode = $scope.patternCode;
        newObjData.details[0].branchPid = $scope.branchPid;
        if(newObjData.details[0].names){
            newObjData.details[0].names = $scope.diverObj.details[0].names.reverse();
        }
        objCtrl.setCurrentObject(newObjData);
        objCtrl.save();
        var param = {};
        param.type = "RDBRANCH";
        param.command = "UPDATE";
        param.projectId = Application.projectid;
        param.data = objCtrl.changedProperty;
    console.log(objCtrl.changedProperty)
        /*解决linkPid报错*/
        if(param.data.details){
            delete param.data.details[0].linkPid;
            if(param.data.details[0].names){
                $.each(param.data.details[0].names,function(i,v){
                    delete v.linkPid;
                });
                $scope.delEmptyNames(param.data.details[0].names);
            }
        }
        if(param.data == false){
            swal("操作失败", "属性值无任何改变！", "error");
            return false;
        }
        Application.functions.saveBranchInfo(JSON.stringify(param),function(data){
            var outPutCtrl = fastmap.uikit.OutPutController();
            $scope.$apply();
            if(data.errcode == 0){
                $scope.setOriginalDataFunc();
                objCtrl.setOriginalData(param.data);
                swal("操作成功", "高速分歧属性值修改成功！", "success");
                outPutCtrl.pushOutput(data.errmsg);
            }else{
                swal("操作失败", "问题原因："+data.errmsg, "error");
                outPutCtrl.pushOutput(data.errmsg);
            }
        });
    }




    /*删除pid*/
    $scope.delete = function(){
        swal({
            title: "确定操作吗？",
            text: "你确定要删除此PID数据吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '删除',
            cancelButtonText:'取消'
        },
        function(){
            $scope.$apply();
            var param = {
                "command":"DELETE",
                "type":"RDBRANCHDETAIL",
                "projectId":Application.projectid,
                "objId":$scope.diverObj.details[0].pid
            };
            Application.functions.saveBranchInfo(JSON.stringify(param),function(data){
                var outPutCtrl = fastmap.uikit.OutPutController();
                $scope.$apply();
                if(data.errcode == 0){
                    if(highLightLayer.highLightLayersArr.length!==0) {
                        highLightLayer.removeHighLightLayers();
                    }
                    $timeout(function(){
                        swal("删除成功", "分歧数据删除成功！", "success");
                    },500)
                    outPutCtrl.pushOutput(data.errmsg);
                    if($scope.$parent.$parent.panelFlag ) {
                        $scope.$parent.$parent.panelFlag = false;
                        $scope.$parent.$parent.objectFlag = false;
                    }
                    $scope.$parent.$parent.objectEditURL = "";
                    rdBranch.redraw();
                }else{
                    $timeout(function(){
                        swal("删除失败", "问题原因："+data.errmsg, "error");
                    })
                    outPutCtrl.pushOutput(data.errmsg);
                }
            });
        });
    }
    /*取消属性编辑*/
    $scope.cancel = function(){
        $scope.getObjectById(false);
    }
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initDiver);
})