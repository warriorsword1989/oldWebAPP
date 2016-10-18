/**
 * Created by liuzhaoxia on 2015/12/23.
 */
var otherApp = angular.module('app');
otherApp.controller("rdLaneConnexityController",['$scope','$ocLazyLoad','$document','appPath','dsEdit','$q', function ($scope, $ocLazyLoad, $document,appPath,dsEdit,$q) {

    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdConnexity = layerCtrl.getLayerById("relationData");

    var linksObj = {};//存放需要高亮的进入线和退出线的id


    //附加车道图标获得
    $scope.getAdditionalLane = function (index, data) {
        var arr;
        if (data.length === 1) {
            $scope.showNormalData.push({"flag":data,"type":0});
            $scope.showTransitData.push({"flag":"test","type":1});
        } else {
            arr = data.split("");
            if (index === 0) {
                if(arr[1] == "["){
                    if("a" < arr[2] && arr[2] < "z"){
                        $scope.showNormalData.unshift({"flag":arr[2].toString(),"type":2});

                    }
                } else {
                    if("a" < arr[1] && arr[1] < "z"){
                        $scope.showNormalData.unshift({"flag":arr[1].toString(),"type":2});

                    }
                }

                if(arr[3]) {
                    if(arr[3]!="<"){
                        if("a" < arr[3] && arr[3] < "z"){
                            $scope.showTransitData.unshift({"flag":arr[3].toString(),"type":1});
                        }
                    }else {
                        if(arr[4]){
                            if("a" < arr[4] && arr[4] < "z"){
                                $scope.showTransitData.unshift({"flag":arr[4].toString(),"type":1});
                            }
                        }
                    }

                }else{
                    $scope.showTransitData.unshift({"flag":"test","type":1});
                }
            } else {
                if(arr[1] == "["){
                    if("a" < arr[2] && arr[2] < "z"){
                        $scope.showNormalData.push({"flag":arr[2].toString(),"type":2});

                    }
                } else {
                    if("a" < arr[1] && arr[1] < "z"){
                        $scope.showNormalData.push({"flag":arr[1].toString(),"type":2});

                    }
                }
                if(arr[3]) {
                    if(arr[3]!="<"){
                        if("a" < arr[3] && arr[3] < "z"){
                            $scope.showTransitData.push({"flag":arr[3].toString(),"type":1});
                        }
                    }else {
                        if(arr[4]){
                            if("a" < arr[4] && arr[4] < "z"){
                                $scope.showTransitData.push({"flag":arr[4].toString(),"type":1});
                            }
                        }
                    }
                }else{
                    $scope.showTransitData.push({"flag":"test","type":1});
                }
            }

        }
    };
    //公交车道图标获得
    $scope.getTransitData = function (data) {
        var obj = {}, arr;
        if (data.length === 1) {
            $scope.showNormalData.push({"flag":data,"type":0});
            $scope.showTransitData.push({"flag":"test","type":1});
        } else {
            arr = data.split("<");
            $scope.showNormalData.push({"flag": arr[0], "type": 0});
            // if(arr[0]) {
            //     //把第一个放进去 {"flag":arr[1].substr(0, 1).toString(),"type":1}
            //     if("a" < arr[0] && arr[0] < "z") {
            //         $scope.showNormalData.push({"flag": arr[0], "type": 0});
            //     }
            //     //第二个
            //     if("a" < arr[1] && arr[1] < "z") {
            //         $scope.showTransitData.push({"flag": arr[1].substr(0, 1).toString(), "type": 1});
            //     }
            // }

        }
    };
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    $scope.intToDecial = function (data) {
        var str = "1";
        for (var i = 0; i < 15 - data; i++) {
            str += "0";
        }
        return parseInt(str, 2).toString(10);
    };
    $scope.initialize = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.initializeData();
    };
    $scope.initializeData = function () {
        $scope.showNormalData = [];
        $scope.showTransitData = [];
        $scope.outLanesArr = [];
        // $scope.selectNum = 10;
        $scope.addFlag = false;
        $scope.changeFlag = false;
        $scope.showInfoFlag = false;
        var reg = new RegExp("/\<|\>|\&/g");
        $scope.lanesData = objCtrl.data;
        $scope.lanesArr = $scope.lanesData["laneInfo"].split(",");

        //高亮进入线和退出线
        var highLightFeatures = [];
        highLightFeatures.push({
            id:objCtrl.data["inLinkPid"].toString(),
            layerid:'rdLink',
            type:'line',
            style:{
                color: '#CD0000',
                strokeWidth:3
            }
        });
        highLightFeatures.push({
            id:objCtrl.data["nodePid"].toString(),
            layerid:'rdLink',
            type:'node',
            style:{strokeWidth:3}
        });

        for (var i = 0, len = (objCtrl.data.topos).length; i < len; i++) {
            highLightFeatures.push({
                id:objCtrl.data.topos[i].outLinkPid.toString(),
                layerid:'rdLink',
                type:'line',
                style:{
                    color: '#3CB371',
                    strokeWidth:3
                }
            });
        }

        highLightFeatures.push({
            id:$scope.lanesData.pid.toString(),
            layerid:'relationData',
            type:'relationData',
            style:{strokeWidth:3}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();

        for (var j = 0, lenJ = $scope.lanesArr.length; j < lenJ; j++) {
            if (j === 0 || j === lenJ - 1) {
                if (reg.test($scope.lanesArr[j])) {
                    if($scope.lanesArr[j].indexOf("[")!==-1) {
                        $scope.getAdditionalLane(j, $scope.lanesArr[j]);
                    }else{
                        $scope.getTransitData($scope.lanesArr[j]);
                    }

                } else {
                    $scope.getAdditionalLane(j, $scope.lanesArr[j]);
                }
            } else {
                $scope.getTransitData($scope.lanesArr[j]);
            }

        }
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.rdLaneConnexityForm){
            $scope.rdLaneConnexityForm.$setPristine();
        }
    };

    //调用的方法
    objCtrl.rdLaneObject = function (flag) {
        $scope.showNormalData = [];
        $scope.showTransitData = [];
        $scope.outLanesArr = [];
        $scope.initializeData();
        if(flag) {
            objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        }
    }
    if (objCtrl.data) {
        $scope.initialize();
    }

    $scope.addLeftAdditionalLane = function (event) {
        var p = /^([0-9])$/;
        if (p.test($scope.lanesData.leftExtend)) {

        }
    };

    $scope.ptOriginArray = [
        {"index": 0, "id": 3},
        {"index": 1, "id": 4},
        {"index": 2, "id": 5},
        {"index": 3, "id": 11},
        {"index": 4, "id": "a5"}
    ];
    $scope.gjOriginArray = [
        {"index": 0, "id": 0},
        {"index": 1, "id": 0},
        {"index": 2, "id": 0},
        {"index": 3, "id": 0},
        {"index": 4, "id": "a5"}
    ];
    for (var i in $scope.addRdLancdData) {
        for (var j in $scope.originArray) {
            if ($scope.addRdLancdData[i].id == $scope.originArray[j].id) {
                $scope.addRdLancdData[i].class = true;
            }
        }
    }

    //修改方向
    $scope.changeDirect = function (item, event, index) {
        if (event.button === 2) {
            $scope.removeTipsActive();
            $(event.target).addClass("active");
            $scope.changeFlag = true;
            $scope.addFlag = false;
            $scope.showInfoFlag = false;
            $scope.lanesData["selectNum"] = index;
            $scope.selectNum = index;
            $scope.changeItem = item;
            var changedDirectObj = {
                "loadType":"subAttrTplContainer",
                "propertyCtrl":appPath.road + 'ctrls/attr_connexity_ctrl/changeDirectCtrl',
                "propertyHtml":appPath.root + appPath.road + 'tpls/attr_connexity_tpl/changeDirectTpl.html'
            };
            $scope.$emit("transitCtrlAndTpl", changedDirectObj);
            map.currentTool = new fastmap.uikit.SelectPath(
                {
                    map: map,
                    currentEditLayer: rdLink,
                    linksFlag: false,
                    shapeEditor: shapeCtrl
                });
            map.currentTool.enable();
            if ($scope.changeFlag) {
                eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {

                    var highLightFeatures = [];

                    highLightFeatures.push({
                        id: objCtrl.data["inLinkPid"].toString(),
                        layerid:'rdLink',
                        type:'line',
                        style:{}
                    });

                    for(var i= 0,len=$scope.lanesData["topos"].length;i<len;i++) {
                        var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][i]["inLaneInfo"]);
                        var lenOfInfo = (16 - arrOfDecimal.length);
                        if (lenOfInfo === index) {
                            highLightFeatures.push({
                                id:data.id,
                                layerid:'rdLink',
                                type:'line',
                                style:{}
                            });
                        }
                    }


                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl.drawHighlight();
                });
            }
        }
    };
    $scope.removeTipsActive = function(){
        $.each($('.lanePic'),function(i,v){
            $(v).removeClass('active');
        });
    };

    //REACH_DIR
    $scope.showLanesInfo = function (item, index, event) {
        $scope.removeTipsActive();
        $(event.target).addClass("active");
        $scope.selectNum = index;
        $scope.lanesData["selectNum"] = index;
        $scope.addFlag = false;
        $scope.changeFlag = false;
        $scope.showInfoFlag = true;
        $scope.changeItem = item;

        $scope.lanesData["index"] = index;
        var rdlaneInfoObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            "callback": function () {
                var showInfoObj = {
                    "loadType": "subAttrTplContainer",
                    "propertyCtrl":appPath.road + 'ctrls/attr_connexity_ctrl/showInfoCtrl',
                    "propertyHtml":appPath.root + appPath.road + 'tpls/attr_connexity_tpl/showInfoTpl.html'
                };
                $scope.$emit("transitCtrlAndTpl", showInfoObj);
            }
        };
        $scope.$emit("transitCtrlAndTpl", rdlaneInfoObj);

    };
    //增加车道
    $scope.addLane = function () {
        var index;
       if($scope.lanesData["selectNum"]!==undefined) {
           index = $scope.lanesData["selectNum"]+1;
       }else{
           index = $scope.lanesArr.length-1;
       }
        $scope.addFlag = true;
        $scope.changeFlag = false;
        $scope.showInfoFlag = false;

        var rdlaneInfoObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            "callback": function () {
                var addDirectObj = {
                    "loadType": "subAttrTplContainer",
                    "propertyCtrl":appPath.road + 'ctrls/attr_connexity_ctrl/addDirectCtrl',
                    "propertyHtml":appPath.root + appPath.road + 'tpls/attr_connexity_tpl/addDirectTpl.html'
                };
                $scope.$emit("transitCtrlAndTpl", addDirectObj);
            }
        };
        $scope.$emit("transitCtrlAndTpl", rdlaneInfoObj);
        // layerCtrl.pushLayerFront('edit');
        // map.currentTool.disable();
        // map.currentTool = new fastmap.uikit.SelectPath(
        //     {
        //         map: map,
        //         currentEditLayer: rdLink,
        //         linksFlag: false,
        //         shapeEditor: shapeCtrl
        //     });
        // map.currentTool.enable();
        // if ($scope.addFlag) {
        //     eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
        //         //删除以前高亮的进入线和退出线
        //         linksObj = {};
        //         var highLightFeatures = [];
        //         for(var i= 0,len=$scope.lanesData["topos"].length;i<len;i++) {
        //             var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][i]["inLaneInfo"]);
        //             var lenOfInfo = (16 - arrOfDecimal.length);
        //             if (lenOfInfo === index) {
        //                 highLightFeatures.push({
        //                     id:data.id,
        //                     layerid:'rdLink',
        //                     type:'line',
        //                     style:{}
        //                 })
        //             }
        //         }
        //         //高亮进入线和退出线
        //
        //         highLightFeatures.push({
        //             id:objCtrl.data["inLinkPid"].toString(),
        //             layerid:'rdLink',
        //             type:'line',
        //             style:{}
        //         });
        //         highRenderCtrl.highLightFeatures = highLightFeatures;
        //         highRenderCtrl.drawHighlight();
        //     });
        // }
    };
    //删除车道
    $scope.minusLane = function (index) {
        $scope.showNormalData.splice(index, 1);
        $scope.showTransitData.splice(index, 1);
        $scope.lanesArr.splice(index, 1);//
        $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");//修改laneInfo字段
        $scope.lanesData["laneNum"] -= 1;
        if (index === 0) {
            $scope.lanesData["leftExtend"] = 0;
        } else if (index === ($scope.lanesArr.length - 1)) {
            $scope.lanesData["right"] = 0;
        }
        var lenN = $scope.lanesData["topos"].length, arr = [];
        for (var n = 0; n < lenN; n++) {
            var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][n]["inLaneInfo"]);
            var lenOfInfo = (16 - arrOfDecimal.length);
            if (lenOfInfo !== index) {
                if (lenOfInfo>index) {
                    $scope.lanesData["topos"][n]["inLaneInfo"] = parseInt($scope.intToDecial(lenOfInfo- 1));
                }
                arr.push($scope.lanesData["topos"][n]);
            }
        }
        $scope.lanesData["topos"].length = 0;
        $scope.lanesData["topos"] = arr;
    };
    //删除公交车道
    $scope.minusTransitData = function (item, index) {
        var num = index;
        $scope.lanesData["selectNum"] = index;
        $scope.showTransitData[num].flag = "test";
        if($scope.showNormalData[num].type == 2){//附加
            $scope.lanesArr[num] = "<" + $scope.showNormalData[num].flag + ">";
        } else if($scope.showNormalData[num].type == 0){
            $scope.lanesArr[num] = $scope.showNormalData[num].flag;
        }
        $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");
        for (var k = 0, lenK = $scope.lanesData["topos"].length; k < lenK; k++) {
            var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][k]["inLaneInfo"]);
            var lenOfInfo = (16 - arrOfDecimal.length);
            if (lenOfInfo === num) {
                $scope.lanesData["topos"][k]["busLaneInfo"] = 0;
            }
        }
    };
    //修改公交车道
    $scope.changeTransit=function(item,index) {
        if(item!=="test") {
            $scope.lanesData["selectNum"] = index;
            $scope.lanesData["transitFlag"] = true;
            var changedTransitObj = {
                "loadType":"subAttrTplContainer",
                "propertyCtrl":appPath.road + 'ctrls/attr_connexity_ctrl/changeDirectCtrl',
                "propertyHtml":appPath.root + appPath.road + 'tpls/attr_connexity_tpl/changeDirectTpl.html'
            };
            $scope.$emit("transitCtrlAndTpl", changedTransitObj);
        }
    };

    $document.bind("keydown", function (event) {
        if (event.keyCode == 16) {//shift键 公交车道
            if($scope.lanesArr[$scope.selectNum]&&$scope.lanesArr[$scope.selectNum].length >0 &&$scope.lanesArr[$scope.selectNum].indexOf("<") > -1){
                return;
            }

            var transitStr = "<" + $scope.changeItem.flag + ">";
            $scope.showTransitData[$scope.selectNum] = {"flag":$scope.changeItem.flag.toString(),"type":1};

            if($scope.lanesArr[$scope.selectNum].indexOf("[")!==-1) {
                var additionArr = $scope.lanesArr[$scope.selectNum].split("");
                additionArr[additionArr.length - 1] = (transitStr + "]");
                $scope.lanesArr[$scope.selectNum] = additionArr.join("");
            }else{
                $scope.lanesArr[$scope.selectNum] += transitStr;
            }
            $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");
            for (var k = 0, lenK = $scope.lanesData["topos"].length; k < lenK; k++) {
                var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][k]["inLaneInfo"]);
                var lenOfInfo = (16 - arrOfDecimal.length);
                if (lenOfInfo === $scope.selectNum) {
                    $scope.lanesData["topos"][k]["busLaneInfo"] = $scope.lanesData["topos"][k]["inLaneInfo"];
                }
            }
            $scope.$apply();
        } else if (event.keyCode === 17) {//ctrl键 附加车道
            if($scope.lanesArr[$scope.selectNum]&&$scope.lanesArr[$scope.selectNum].length >0 &&$scope.lanesArr[$scope.selectNum].indexOf("[") > -1){
                return;
            }
            if ($scope.selectNum === 0 || $scope.selectNum === ($scope.lanesArr.length - 1)) {
                var additionStr,showAdditionStr;
                if($scope.lanesArr[$scope.selectNum].split("").length == 1){//普通车道的情况
                     additionStr = "[" + $scope.lanesArr[$scope.selectNum] + "]";
                     showAdditionStr = {"flag":$scope.changeItem.flag.toString(),"type":2};
                } else {
                    var arrs = $scope.lanesArr[$scope.selectNum].split("<");
                    additionStr = "[" + arrs[0] + "]" +"<"+ arrs[1];
                    showAdditionStr = {"flag":$scope.changeItem.flag.toString(),"type":2};
                }

                if ($scope.selectNum === 0) {
                    $scope.showNormalData[0] = showAdditionStr;
                    $scope.lanesArr[0] = additionStr;
                    $scope.lanesData["leftExtend"] = 1;
                } else {
                    $scope.showNormalData[$scope.selectNum] = showAdditionStr;
                    $scope.lanesArr[$scope.selectNum] = additionStr;
                    $scope.lanesData["rightExtend"] = 1;
                }
                $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");

                $scope.$apply();

            }
        }
    });
    $scope.save = function () {
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        var arr = [];
        if(objCtrl.changedProperty.topos && objCtrl.changedProperty.topos.length >0){
            for(var i = 0;i<objCtrl.changedProperty.topos.length;i++){
                if(objCtrl.changedProperty.topos[i].objStatus == "INSERT"){
                    for(var j = 0;j<objCtrl.changedProperty.topos[i].vias.length;j++){
                        objCtrl.changedProperty.topos[i].vias[j].objStatus = "INSERT";
                        delete objCtrl.changedProperty.topos[i].vias[j].geoLiveType;
                    }
                } else if(objCtrl.changedProperty.topos[i].objStatus == "UPDATE"){
                    //判断闭合
                    // if(objCtrl.changedProperty.topos[i].vias && objCtrl.changedProperty.topos[i].vias.length > 0){
                    //     var toop = objCtrl.changedProperty.topos[i];
                    //     var lastVia = toop.vias[toop.vias.length -1]; //获取vias数组中的最后一个值
                    //     var temp ={'outLinkPid':toop.outLinkPid,'linkpid':lastVia.linkPid};
                    //     arr.push(temp);
                    // }
                }
            }
        }

        var promises = [];
        var flagArr = [];
        if(arr.length > 0){
            for (var i = 0 ; i < arr.length ; i ++){
                flagArr[i] = false;
                promises.push(dsEdit.getByPid(arr[i].linkPid,"RDLINK"),function (data){
                    if(data){
                        if(data.eNodePid == arr[i].outLinkPid || data.sNodePid == arr[i].outLinkPid ){
                            flagArr[i] = true;
                        }
                    }
                });
            }
            $q.all(promises).then(function () {
                if(flagArr.indexOf(false) > -1){
                    swal('提示','经过线没有闭合！','warning');
                    return ;
                }
                $scope.saveFinal();
            });
        }else {
            $scope.saveFinal();
        }
    };

    $scope.saveFinal = function (){
        var param = {
            "command": "UPDATE",
            "type": "RDLANECONNEXITY",
            "dbId": App.Temp.dbId,
            "data": objCtrl.changedProperty
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                dsEdit.getByPid(objCtrl.data.pid, "RDLANECONNEXITY").then(function(ret) {
                    if (ret) {
                        objCtrl.setCurrentObject('RDLANECONNEXITY', ret);
                        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                    }
                });
            }
            rdConnexity.redraw();
        })
    };
    $scope.delete = function () {
        var objId = parseInt($scope.lanesData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDLANECONNEXITY",
            "dbId": App.Temp.dbId,
            "objId": objId
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                rdConnexity.redraw();
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                if (map.currentTool) {
                    map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                }
                //清空编辑图层和shapeCtrl
                shapeCtrl.stopEditing();
                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                $scope.rdCrossData = null;
                highRenderCtrl._cleanHighLight();
                $scope.$emit('SWITCHCONTAINERSTATE', {
                  'subAttrContainerTpl': false,
                  'attrContainerTpl': false
                });
            }
        })
    };

    $scope.cancel=function(){
    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initialize);
}]);
