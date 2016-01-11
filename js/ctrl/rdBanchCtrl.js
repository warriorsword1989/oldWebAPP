/**
 * Created by liuzhaoxia on 2015/12/10.
 */
//var otherApp=angular.module("lazymodule", []);
var otherApp=angular.module("lazymodule", []);
otherApp.controller("rdBranchController",function($scope,$timeout){
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var divergenceIds = objCtrl.data;
    $scope.divergenceIds = divergenceIds;
    $scope.diverObj = {};
    /*默认显示第一个分歧信息*/
    $scope.diverId = divergenceIds[0].id;
    $timeout(function(){
        $('.diverRadio:first').triggerHandler('click');
    });
    $scope.getObjectById = function(){
        // Application.functions.getRdObjectById(13920, "RDBRANCH", function (data) {
        // Application.functions.getRdObjectById(40378080, "RDBRANCH", function (data) {
        Application.functions.getRdObjectById($scope.diverId, "RDBRANCH", function (data) {
            $scope.diverObj = data.data;
            $scope.initDiver();
            $scope.$apply();
        });
    }
    $scope.getObjectById();
    /*切换不同的分歧信息显示*/
    $scope.switchDiver = function(id){
        $scope.diverObj = {};
        $scope.diverId = id;
        $scope.getObjectById();
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
                if(v.nameGroupid == item.nameGroupid+1){
                    v.nameGroupid -= 1;
                }
            });
            item.nameGroupid += 1;
        }else{  //上移
            $.each($scope.diverObj.details[0].names,function(i,v){
                if(v.nameGroupid == item.nameGroupid-1){
                    v.nameGroupid += 1;
                }
            });
            item.nameGroupid -= 1;
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
                console.log($scope.diverObj.details[0].names,item.nameGroupid)
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
    /*新增名称信息*/
    $scope.nameInfoAdd = function(){
        var protoArr = $scope.diverObj.details[0].names;
        var newInfo = protoArr.slice(-1);
        var newArr = {};
        newArr.codeType = newInfo[0].codeType;
        newArr.detailId = newInfo[0].detailId;
        newArr.langCode = newInfo[0].langCode;
        newArr.name = newInfo[0].name;
        newArr.nameClass = newInfo[0].nameClass;
        newArr.nameGroupid = protoArr.length + 1;
        newArr.phonetic = newInfo[0].phonetic;
        newArr.pid = newInfo[0].pid;
        newArr.voiceFile = newInfo[0].voiceFile;
        newArr.srcFlag = newInfo[0].srcFlag;
        newArr.seqNum = newInfo[0].seqNum;
        protoArr.push(newArr);
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
    /*初始化信息显示*/
    $scope.initDiver = function(){
        var dObj = $scope.diverObj;
        /*经过线*/
        $scope.relationCode = dObj.relationshipType;
        /*模式图信息条数*/
        $scope.detailLength = dObj.details.length + dObj.schematics.length;
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
        }

        /*如果图形表有数据 schematic*/
        if(dObj.schematics.length > 0){
            /*箭头图代码*/
            $scope.arrowCode = dObj.schematics[0].arrowCode;
            /*分歧号码*/
            $scope.branchPid = dObj.schematics[0].branchPid;
            /*底图代码*/
            $scope.schematicCode = dObj.schematics[0].schematicCode;
        }
    }
})