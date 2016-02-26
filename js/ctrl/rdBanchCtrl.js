/*
 * Created by liuzhaoxia on 2015/12/10.
 */
//var otherApp=angular.module("lazymodule", []);
var otherApp=angular.module("lazymodule", []);
otherApp.controller("rdBranchController",function($scope,$timeout){
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var divergenceIds = objCtrl.data;
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var newObjData = {};
    var linksOfRestric = {};
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    $scope.divergenceIds = divergenceIds;
    $scope.diverObj = {};
    /*默认显示第一个分歧信息*/
    $scope.diverId = divergenceIds.pid;


    $timeout(function(){
        $('.diverRadio:first').triggerHandler('click');
    });
    $scope.setOriginalDataFunc = function(){
        Application.functions.getRdObjectByDetailId($scope.diverId, "RDBRANCH", function (data) {
            objectEditCtrl.setOriginalData(data.data);
            $scope.$apply();
        });
    }
    $scope.setOriginalDataFunc();
    $scope.getObjectById = function(){
        $scope.$parent.$parent.showLoading = true;  //showLoading
         //箭头图
        Application.functions.getRdObjectByDetailId($scope.diverId, "RDBRANCH", function (data) {
            // oldData = data.data;
            // objectEditCtrl.setOriginalData(data.data);
            if(data.errcode == 0){
                $scope.diverObj = data.data;
                // $scope.diverObj.vias = [{"branchPid":13920,"groupId":1,"linkPid":552430,"rowId":"254CBB55BE249216E050A8C08304EB19","seqNum":1},{"branchPid":13920,"groupId":1,"linkPid":552430,"rowId":"254CBB55BE249216E050A8C08304EB19","seqNum":1},{"branchPid":13920,"groupId":1,"linkPid":552430,"rowId":"254CBB55BE249216E050A8C08304EB19","seqNum":1}]
                $scope.initDiver();
                $scope.$parent.$parent.showLoading = false;  //showLoading
                $scope.$apply();
            }else{
                $scope.$parent.$parent.showLoading = false;  //showLoading
                $scope.$apply();
                swal("查询失败", "问题原因："+data.errmsg, "error");
            }
        });
    }
    $scope.getObjectById();
    /*切换不同的分歧信息显示*/
    $scope.switchDiver = function(id){
        $scope.diverObj = {};
        $scope.diverId = id;
        $scope.getObjectById();
        $scope.setOriginalDataFunc();
    }
    /*点击关系类型*/
    $scope.switchRelType = function(code){
        $scope.relationCode = code;
    }
    /*点击箭头图标志*/
    $scope.switchArrowType = function(code){
        $scope.arrowFlag = code;
    }
    /*点击名称分类*/
    $scope.switchNameClass = function(code,id){
        $.each($scope.diverObj.details[0].names,function(i,v){
            if(id == v.nameGroupid){
                v.nameClass = code;
            }
        });
    }
    /*上移或者下移*/
    $scope.changeOrder = function(item,type){
        if(type == 1){  //下移
            $.each($scope.diverObj.details[0].names,function(i,v){
                if(v.nameGroupid == item.nameGroupid-1){
                    v.nameGroupid += 1;
                }
            });
            item.nameGroupid -= 1;
        }else{  //上移
            $.each($scope.diverObj.details[0].names,function(i,v){
                if(v.nameGroupid == item.nameGroupid+1){
                    v.nameGroupid -= 1;
                }
            });
            item.nameGroupid += 1;
        }
    }
    /*删除名称信息*/
    $scope.removeNameInfo = function(item){
        Array.prototype.deleteElementByValue = function(varElement)
        {
            var numDeleteIndex = -1;
            for (var i=0; i<this.length; i++)
            {
                // 严格比较，即类型与数值必须同时相等。
                if (this[i] === varElement)
                {
                    this.splice(i, 1);
                    numDeleteIndex = i;
                    break;
                }
            }
            return numDeleteIndex;
        }
        /*数组中删除*/
        $.each($scope.diverObj.details[0].names,function(i,v){
            if(item == v){
                $scope.diverObj.details[0].names.deleteElementByValue(item);
            }
        });
        $.each($scope.diverObj.details[0].names,function(i,v){
            if(v){
                /*删除一个，之后的nameGroup都减一*/
                if(v.nameGroupid > item.nameGroupid){
                    v.nameGroupid -= 1;
                }
                /*如果只剩一条名称信息*/
                if($scope.diverObj.details[0].names.length == 1){
                    $scope.diverObj.details[0].names[0].nameGroupid = 1;
                }
            } 
        });
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
    /*新增名称信息*/
    $scope.nameInfoAdd = function(){
        var protoArr = $scope.diverObj.details[0].names;
        var newArr = {};
        newArr.codeType = 0;
        newArr.detailId = 0;
        newArr.langCode = $scope.languageCode[0].code;
        newArr.name = '';
        newArr.nameClass = 0;
        newArr.nameGroupid = protoArr.length + 1;
        newArr.phonetic = '';
        newArr.pid = 0;
        newArr.voiceFile = '';
        newArr.srcFlag = 0;
        newArr.seqNum = 0;
        protoArr.push(newArr);
    }
    $scope.picNowNum = 0;
    $scope.getPicsDate = function(){
        $(".pic-loading").show();
        $scope.picPageNum = 0;
        if($scope.picNowNum == 0){
            $scope.picNowNum = 1;
        }
        $scope.picPageNum = $scope.picNowNum - 1;
        var params = {
            "name":$scope.arrowCode,
            "pageNum":$scope.picPageNum,
            "pageSize":9
        };
        Application.functions.getArrowImgGroup(JSON.stringify(params),function(data){
            if(data.errcode == 0){
                $(".pic-loading").hide();
                $scope.pictures = data.data.data;
                $scope.picTotal = Math.ceil(data.data.total/9);
                $scope.goPaging();
                $scope.$apply();
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
    /*点击选中的图片*/
    $scope.selectPicCode = function(code,url){
        $scope.arrowCode = code;
        $scope.patternCode = '8'+$.trim($scope.arrowCode).substr(1);
        $("#picMapImg").attr('src',url);
        $("#picMapDesc").text(code);
        $('.pic-show').hide();
        $("#picMapShow").show();
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
        {"id": 0, "label": "0 高亮分歧(无名称)"},
        {"id": 1, "label": "1 方面分歧"},
        {"id": 2, "label": "2 IC分歧"},
        {"id": 3, "label": "3 3D分歧"},
        {"id": 4, "label": "4 复杂路口模式图"}
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
    /*名称分类*/
    $scope.nameClassType = [
        {"code":0,"label":"方向"},
        {"code":1,"label":"出口"}
    ];
    $scope.codeTypeOptions=[
        {"id":0,"label":"0 无"},
        {"id":1,"label":"1 普通路名"},
        {"id":2,"label":"2 设施名"},
        {"id":3,"label":"3 高速道路名"},
        {"id":4,"label":"4 国家高速编号"},
        {"id":5,"label":"5 国道编号"},
        {"id":6,"label":"6 省道编号"},
        {"id":7,"label":"7 县道编号"},
        {"id":8,"label":"8 乡道编号"},
        {"id": 9, "label": "9 专用道编号"},
        {"id": 10, "label": "10 省级高速编号"}

    ];
    /*语言代码*/
    $scope.languageCode = [
        {"code":"CHI","name":"简体中文"},
        {"code":"CHT","name":"繁体中文"},
        {"code":"ENG","name":"英文"},
        {"code":"POR","name":"葡萄牙文"},
        {"code":"ARA","name":"阿拉伯语"},
        {"code":"BUL","name":"保加利亚语"},
        {"code":"CZE","name":"捷克语"},
        {"code":"DAN","name":"丹麦语"},
        {"code":"DUT","name":"荷兰语"},
        {"code":"EST","name":"爱沙尼亚语"},
        {"code":"FIN","name":"芬兰语"},
        {"code":"FRE","name":"法语"},
        {"code":"GER","name":"德语"},
        {"code":"HIN","name":"印地语"},
        {"code":"HUN","name":"匈牙利语"},
        {"code":"ICE","name":"冰岛语"},
        {"code":"IND","name":"印度尼西亚语"},
        {"code":"ITA","name":"意大利语"},
        {"code":"JPN","name":"日语"},
        {"code":"KOR","name":"韩语"},
        {"code":"LIT","name":"立陶宛语"},
        {"code":"NOR","name":"挪威语"},
        {"code":"POL","name":"波兰语"},
        {"code":"RUM","name":"罗马尼亚语"},
        {"code":"RUS","name":"俄语"},
        {"code":"SLO","name":"斯洛伐克语"},
        {"code":"SPA","name":"西班牙语"},
        {"code":"SWE","name":"瑞典语"},
        {"code":"THA","name":"泰国语"},
        {"code":"TUR","name":"土耳其语"},
        {"code":"UKR","name":"乌克兰语"},
        {"code":"SCR","name":"克罗地亚语"}
    ];
    /*分歧名称输入完查询发音和拼音*/
    $scope.diverName = function(id,name){
        $scope.$parent.$parent.showLoading = true;  //showLoading
        var param = {
            "word":name
        }
        Application.functions.getNamePronunciation(JSON.stringify(param), function (data) {
            $scope.$parent.$parent.showLoading = false;  //showLoading
            $scope.$apply();
            if(data.errcode == 0){
                $.each($scope.diverObj.details[0].names,function(i,v){
                    if(v.nameGroupid == id){
                        v.phonetic = data.data.phonetic;
                        v.voiceFile = data.data.voicefile;
                    }
                });
                $scope.$apply();
            }else{
                swal("查找失败", "问题原因："+data.errmsg, "error");
            }
        });
    }
    /*初始化信息显示*/
    $scope.initDiver = function(){
        var dObj = $scope.diverObj;
        /*经过线*/
        if(dObj){
            $scope.relationCode = dObj.relationshipType;
            linksOfRestric["inLink"] = $scope.diverObj.inLinkPid+'';
            linksOfRestric["outLink"] = $scope.diverObj.outLinkPid+'';
            var highLightLinks=new fastmap.uikit.HighLightRender(rdLink,{map:map,highLightFeature:"links",linksObj:linksOfRestric})
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
                if($scope.arrowCode) {
                    $scope.arrowMapShow = $scope.getArrowPic($scope.arrowCode);
                }
                $("#picMapImg").attr('src',$scope.arrowMapShow);
                $("#picMapDesc").text($scope.arrowCode);
                /*分歧号码*/
                $scope.branchPid = dObj.details[0].branchPid;
                /*底图代码*/
                $scope.patternCode = dObj.details[0].patternCode;
                // $(".detail-well").show();
                $("#picMapShow").show();
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
    /*保存分歧数据*/
    $scope.$parent.$parent.save = function () {
        $scope.$parent.$parent.showLoading = true;  //showLoading
        if(!$scope.diverObj){
            $scope.$parent.$parent.showLoading = false;  //showLoading
            swal("操作失败", "请输入属性值！", "error");
            return false;
        }
        newObjData = $scope.clone($scope.diverObj);
        newObjData.relationshipType = $scope.relationCode;
        newObjData.pid = parseInt($scope.diverId);
        if(newObjData.details.length == 0)
            newObjData.details.push({});
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
        if(newObjData.details[0].names)
            newObjData.details[0].names = $scope.diverObj.details[0].names.reverse();
        objectEditCtrl.setCurrentObject(newObjData);
        objectEditCtrl.save();
        var param = {};
        param.type = "RDBRANCH";
        param.command = "UPDATE";
        param.projectId = 11;
        param.data = objectEditCtrl.changedProperty;
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
            $scope.$parent.$parent.showLoading = false;  //showLoading
            swal("操作失败", "属性值无任何改变！", "error");
            return false;
        }
        Application.functions.saveBranchInfo(JSON.stringify(param),function(data){
            var outPutCtrl = fastmap.uikit.OutPutController();
            $scope.$parent.$parent.showLoading = false;  //showLoading
            $scope.$apply();
            if(data.errcode == 0){
                $scope.setOriginalDataFunc();
                objectEditCtrl.setOriginalData(param.data);
                swal("操作成功", "高速分歧属性值修改成功！", "success");
                outPutCtrl.pushOutput(data.errmsg);
            }else{
                swal("操作失败", "问题原因："+data.errmsg, "error");
                outPutCtrl.pushOutput(data.errmsg);
            }
        });
    }
    /*删除pid*/
    $scope.$parent.$parent.delete = function(){
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
            $scope.$parent.$parent.showLoading = true;  //showLoading
            $scope.$apply();
            var param = {
                "command":"DELETE",
                "type":"RDBRANCHDETAIL",
                "projectId":11,
                "objId":$scope.diverObj.details[0].pid
            };
            Application.functions.saveBranchInfo(JSON.stringify(param),function(data){
                var outPutCtrl = fastmap.uikit.OutPutController();
                $scope.$parent.$parent.showLoading = false;  //showLoading
                $scope.$apply();
                if(data.errcode == 0){
                    $scope.getObjectById();
                    $scope.setOriginalDataFunc();
                    objectEditCtrl.setOriginalData(param.data);
                    if(highLightLayer.highLightLayersArr.length!==0) {
                        highLightLayer.removeHighLightLayers();
                    }
                    $timeout(function(){
                        swal("删除成功", "PID数据删除成功！", "success");
                    },500)
                    outPutCtrl.pushOutput(data.errmsg);
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
    $scope.$parent.$parent.cancel = function(){
        if($scope.getObjectById()){
            $scope.$parent.$parent.showLoading = false;  //showLoading
            $scope.$apply();
        }
    }
})