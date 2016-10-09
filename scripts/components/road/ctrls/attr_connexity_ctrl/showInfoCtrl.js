/**
 * Created by liwanchong on 2016/3/1.
 */
var infoOfConnexityApp = angular.module("app");
infoOfConnexityApp.controller("infoOfConnexityController", function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.infoData = objCtrl.data;
    $scope.directArr = $scope.infoData.laneInfo.split(",");
    var eventController = fastmap.uikit.EventController();
    $scope.showDirect = [];
    $scope.outLanesArr = [];
    $scope.showLaneInfo = [];
    $scope.laneFlag = false;
    $scope.laneNum = $scope.infoData["laneInfo"].split(",").length;
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('rdLink');
   //清除高亮
    highRenderCtrl._cleanHighLight();
    highRenderCtrl.highLightFeatures.length = 0;
    //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
    if($scope.infoConnexityForm){
        $scope.infoConnexityForm.$setPristine();
    }
    $scope.reachDirOptions = [
        {"id": 0, "label": "0 未调查"},
        {"id": 1, "label": "1 直"},
        {"id": 2, "label": "2 左"},
        {"id": 3, "label": "3 右"},
        {"id": 4, "label": "4 调"},
        {"id": 5, "label": "5 左斜前"},
        {"id": 6, "label": "6 右斜前"}
    ];
    $scope.changeDirects =
    {
        "a": "a",
        "b": "b",
        "c": "c",
        "d": "d",
        "e": "ad",
        "f": "ac",
        "g": "ab",
        "h": "bac",
        "i": "dac",
        "j": "dab",
        "k": "bc",
        "l": "db",
        "m": "dbc",
        "n": "dc",
        "o": "o",
        "p": "bace",
        "t": "ar",
        "u": "br",
        "v": "cr",
        "w": "dr",
        "x": "as",
        "y": "bs",
        "z": "cs",
        "0": "ds",
        "1": "rs",
        "2": "abr",
        "3": "abs",
        "4": "acr",
        "5": "acs"
    };
    $scope.transData = {
        "a": 1,
        "b": 2,
        "c": 3,
        "d": 4,
        "r": 5,
        "s": 6
    };
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    var highLightFeatures = [];
    highLightFeatures.push({
        id: objCtrl.data["inLinkPid"].toString(),
        layerid:'rdLink',
        type:'line',
        style:{color: 'red'}
    });
    highLightFeatures.push({
        id:objCtrl.data["nodePid"].toString(),
        layerid:'rdLink',
        type:'node',
        style:{}
    });
    for (var i = 0, len = $scope.infoData["topos"].length; i < len; i++) {
        var arrOfDecimal = $scope.decimalToArr($scope.infoData["topos"][i]["inLaneInfo"]), lenOfInfo;
        if (arrOfDecimal.lastIndexOf('1') === 0) {
            lenOfInfo = (16 - arrOfDecimal.length);
            if (lenOfInfo === $scope.infoData["index"]) {
                highLightFeatures.push({
                    id:$scope.infoData["topos"][i].outLinkPid.toString(),
                    layerid:'rdLink',
                    type:'line',
                    style:{color:'#FFD306'}
                });
                var obj = ($.extend(true, {}, $scope.infoData["topos"][i]));
                obj["enterLaneNum"] = lenOfInfo + 1;
                if (obj["busLaneInfo"] !== 0) {
                    obj["enterBusNum"] = lenOfInfo + 1;
                } else {
                    obj["enterBusNum"] = 0;
                }
                $scope.outLanesArr.push(obj);
            }
        } else {
            var numLen = arrOfDecimal.lastIndexOf('1') - arrOfDecimal.indexOf("1");
            for (var k = 0; k <= numLen; k++) {
                lenOfInfo = (16 - arrOfDecimal.length + k);
                if (lenOfInfo === $scope.infoData["index"]) {
                    highLightFeatures.push({
                        id:$scope.infoData["topos"][i].outLinkPid.toString(),
                        layerid:'rdLink',
                        type:'line',
                        style:{color:'#FFD306'}
                    })
                    var obj = ($.extend(true, {}, $scope.infoData["topos"][i]));
                    obj["enterLaneNum"] = lenOfInfo + 1;
                    if (obj["busLaneInfo"] !== 0) {
                        obj["enterBusNum"] = lenOfInfo + 1;
                    } else {
                        obj["enterBusNum"] = 0;
                    }
                    $scope.outLanesArr.push(obj);
                }
            }
        }
    }
    highRenderCtrl.highLightFeatures = highLightFeatures;
    highRenderCtrl.drawHighlight();
    $scope.getChangedDirect = function () {
        var direct = $scope.directArr[$scope.infoData["selectNum"]];
        if (direct.length === 1) {
            $scope.directArr = $scope.changeDirects[direct].split("");
        } else {
            if (direct.indexOf("]") !== -1) {
                $scope.laneFlag = true;
                if (direct.indexOf(">") !== -1) {
                    $scope.directArr = $scope.changeDirects[direct.charAt(1)].split("");
                } else {
                    $scope.directArr = $scope.changeDirects[direct.charAt(direct.length - 2)].split("");
                }
            }
        }
    };

    $scope.removeTipsActive = function(){
        $.each($('.lanePic'),function(i,v){
            $(v).removeClass('active');
        });
    };
    $scope.currentValue = function () {
        for (var i = 0, len = $scope.outLanesArr.length; i < len; i++) {
            if ($scope.outLanesArr[i]["reachDir"] === $scope.transData[$scope.directArr[0]]) {
                $scope.showLaneInfo.push($scope.outLanesArr[i]);
            }
        }
    };
    $scope.getChangedDirect();
    $scope.currentValue();
    // $scope.getLanesInfo = function (item, event) {
    //     $scope.removeTipsActive();
    //     $(event.target).addClass("active");
    //     if (eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID]) {
    //         for (var ii = 0, lenII = eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID].length; ii < lenII; ii++) {
    //             eventController.off(eventController.eventTypes.GETOUTLINKSPID, eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID][ii]);
    //         }
    //     }
    //     $scope.showLaneInfo.length = 0;
    //     var outLinkObj = {}, outLinkPid, changedObj = null,
    //         copyTopos = [];
    //     $scope.changeOutLinkFlag = 0;
    //     for (var i = 0, len = $scope.outLanesArr.length; i < len; i++) {
    //         if ($scope.outLanesArr[i]["reachDir"] === $scope.transData[item]) {
    //             $scope.showLaneInfo.push($scope.outLanesArr[i]);
    //             highRenderCtrl.highLightFeatures.push({
    //                 id: $scope.outLanesArr[i]["outLinkPid"].toString(),
    //                 layerid:'rdLink',
    //                 type:'line',
    //                 style:{}
    //             });
    //             outLinkObj[$scope.outLanesArr[i]["outLinkPid"].toString()] = true;
    //         }
    //     }
    //     highRenderCtrl.drawHighlight();
    //     map.currentTool.disable();//禁止当前的参考线图层的事件捕获
    //     map.currentTool = new fastmap.uikit.SelectPath({
    //             map: map,
    //             currentEditLayer: rdLink,
    //             linksFlag: false,
    //             shapeEditor: shapeCtrl
    //         });
    //     map.currentTool.enable();
    //     eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
    //         highRenderCtrl._cleanHighLight();
    //         highRenderCtrl.highLightFeatures.length = 0;
    //         highLightFeatures.length = 0;
    //         if (outLinkObj[data.id]) {
    //             for (var k = 0, lenK = $scope.showLaneInfo.length; k < lenK; k++) {
    //                 if (parseInt($scope.showLaneInfo[k]["outLinkPid"]) === parseInt(data.id)) {
    //                     outLinkPid = data.id;
    //                     changedObj = $scope.showLaneInfo[k];
    //                     $scope.showLaneInfo.splice(k, 1);
    //                     $scope.$apply();
    //                     $scope.changeOutLinkFlag++;
    //                     delete outLinkObj[data.id];
    //                     break;
    //                 }
    //             }
    //             for (var m = 0, lenM = $scope.infoData["topos"].length; m < lenM; m++) {
    //                 if($scope.infoData["topos"][m]["outLinkPid"]=== parseInt(data.id)) {
    //                     copyTopos = $scope.infoData["topos"].concat();
    //                     $scope.infoData["topos"].splice(m, 1);
    //                     break;
    //                 }
    //             }
    //         } else {
    //             if ($scope.changeOutLinkFlag) {
    //                 changedObj["outLinkPid"] = data.id;
    //                 changedObj["inLinkPid"] = objCtrl.data["inLinkPid"];
    //                 outLinkObj[data.id.toString()] = true;
    //                 $scope.showLaneInfo.push(changedObj);
    //                 for (var j = 0, lenJ = $scope.infoData["topos"].length; j < lenJ; j++) {
    //                     if ($scope.infoData["topos"][j]["outLinkPid"] === parseInt(outLinkPid)) {
    //                         $scope.infoData["topos"][j]["outLinkPid"] = parseInt(data.id);
    //                         $scope.changeOutLinkFlag = 0;
    //                     }
    //                 }
    //                 for(var n= 0,lenN=copyTopos.length;n<lenN;n++) {
    //                     if(copyTopos[n]["outLinkPid"]===parseInt(outLinkPid)) {
    //                         copyTopos[n]["outLinkPid"] = parseInt(data.id);
    //                     }
    //                 }
    //                 $scope.infoData["topos"].length = 0;
    //                 $scope.infoData["topos"] = copyTopos;
    //             } else {
    //                 outLinkObj[data.id.toString()] = true;
    //                 var newShowLane = {}, newTopo = {};
    //                 if(changedObj) {
    //                     newShowLane = angular.extend({},changedObj);
    //                 }else{
    //                     newShowLane = angular.extend({},$scope.showLaneInfo[0]);
    //                 }
    //                 for(var p= 0,lenP=$scope.infoData["topos"].length;p<lenP;p++) {
    //                     if($scope.infoData["topos"][p]["outLinkPid"]===newShowLane["outLinkPid"]) {
    //                         newTopo = angular.extend({},$scope.infoData["topos"][p]);
    //                         newTopo = fastmap.dataApi.rdLaneTopology(newTopo);
    //                     }
    //                 }
    //                 newTopo["outLinkPid"] = parseInt(data.id);
    //                 newShowLane["outLinkPid"] = parseInt(data.id);
    //                 newShowLane["inLinkPid"] = objCtrl.data["inLinkPid"];
    //                 $scope.showLaneInfo.unshift(newShowLane);
    //                 $scope.$apply();
    //                 newTopo["pid"] = 0;
    //                 $scope.infoData["topos"].unshift(newTopo);
    //                 for(var i = 0;i<$scope.infoData.topos.length;i++){
    //                     if($scope.infoData.topos[i].outLinkPid == 0){
    //                         $scope.infoData.topos.splice(i,1);
    //                         i--;
    //                     }
    //                 }
    //             }
    //         }
    //         for(var x= 0,lenX= Object.keys(outLinkObj).length;x<lenX;x++) {
    //             highLightFeatures.push({
    //                 id:Object.keys(outLinkObj)[x].toString(),
    //                 layerid:'rdLink',
    //                 type:'line',
    //                 style:{}
    //             })
    //         }
    //         //高亮进入线和退出线
    //         highLightFeatures.push({
    //             id: objCtrl.data["inLinkPid"].toString(),
    //             layerid:'rdLink',
    //             type:'line',
    //             style:{color: '#CD0000'}
    //         });
    //         highLightFeatures.push({
    //             id:objCtrl.data["nodePid"].toString(),
    //             layerid:'rdLink',
    //             type:'node',
    //             style:{}
    //         });
    //         highRenderCtrl.highLightFeatures = highLightFeatures;
    //         highRenderCtrl.drawHighlight();
    //
    //         //高亮车信
    //
    //     });
    // };
    $scope.getLanesInfo = function (item) {
        $scope.links = [];
        $scope.vais = {};
        $scope.item = item;
        layerCtrl.pushLayerFront('edit');
        map.currentTool.disable();
        map.currentTool = new fastmap.uikit.SelectPath(
            {
                map: map,
                currentEditLayer: rdLink,
                linksFlag: false,
                shapeEditor: shapeCtrl
            });
        map.currentTool.enable();
        eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {

            if($scope.links.indexOf(parseInt(data.id)) < 0){
                $scope.links.push(parseInt(data.id));

                var param1 = {};
                param1["dbId"] = App.Temp.dbId;
                param1["type"] = "RDLANEVIA";
                param1["data"] = {
                    "inLinkPid": $scope.laneInfo.inLinkPid,
                    "nodePid":$scope.laneInfo.nodePid,
                    "outLinkPid":parseInt(data.id)
                };
                dsEdit.getByCondition(param1).then(function (conLinks) {//找出经过线
                    if (conLinks.errcode === -1) {
                        return;
                    }
                    if (conLinks.data) {
                        $scope.vais[data.id] = conLinks.data
                    }
                    for(var i =0;i<conLinks.data.length;i++){
                        highRenderCtrl.highLightFeatures.push({
                            id:conLinks.data[i].toString(),
                            layerid:'rdLink',
                            type:'line',
                            style:{color:"yellow"}
                        });
                    }
                    highRenderCtrl.drawHighlight();
                });
                highRenderCtrl.highLightFeatures.push({
                    id:data.id.toString(),
                    layerid:'rdLink',
                    type:'line',
                    style:{}
                });
                highRenderCtrl.drawHighlight();
            }
        });
        $scope.lanesArr = $scope.laneInfo["laneInfo"].split(",");
        var lastLane= $scope.lanesArr[$scope.lanesArr.length-1].split("");
        var zeroLane = $scope.lanesArr[0].split("");
        var outLinkArr = [];
        for (var m= 0,lenM=$scope.laneInfo["topos"].length;m<lenM;m++) {
            outLinkArr.push($scope.laneInfo["topos"][m].outLinkPid);
        }
        for(var i=0;i<$scope.links.length;i++){
            if(outLinkArr.indexOf($scope.links[i])>-1){//在当前的topo中
                var inLaneDecArr = $scope.decimalToArr($scope.laneInfo["topos"][outLinkArr.indexOf($scope.links[i])]["inLaneInfo"]);//十进制转二进制
                var infoLen =(16- inLaneDecArr.length);
                inLaneDecArr[$scope.lanesArr.length -infoLen] = "1";
                var str = inLaneDecArr[0];
                for(var j=1;j<inLaneDecArr.length;j++){
                    str+=inLaneDecArr[j];
                }
                $scope.laneInfo["topos"][outLinkArr.indexOf($scope.links[i])]["inLaneInfo"] = parseInt(parseInt(str,2).toString(10));//二进制转十进制
            } else {
                var viaArr = [];
                if($scope.vais && $scope.vais[$scope.links[i]]){
                    for(var j = 0;j<$scope.vais[$scope.links[i]].length;j++){
                        viaArr.push(fastmap.dataApi.rdLaneVIA({
                            rowId:"",
                            linkPid:$scope.vais[$scope.links[i]][j]
                        }))
                    }
                }
                var selObj=fastmap.dataApi.rdLaneTopology({
                    "busLaneInfo": 0,
                    "connexityPid": $scope.laneInfo["pid"],
                    "inLaneInfo": parseInt($scope.intToDecial($scope.lanesArr.length)),
                    "outLinkPid": $scope.links[i],
                    "reachDir": $scope.changeData($scope.item.id)?$scope.changeData($scope.item.id):0,
                    "relationshipType": 1,
                    "vias":viaArr
                });
                $scope.laneInfo["laneNum"] += 1;
                $scope.laneInfo["topos"].unshift(selObj);
                $scope.laneInfo["selectNum"] = undefined;
            }

        }
        if ($scope.laneInfo["laneInfo"]) {
            $scope.laneInfo["laneInfo"] += ",";
        }
        $scope.laneInfo["laneInfo"] += $scope.item.id;

        $scope.item = null;
        $scope.removeImgActive();
        $scope.vais = {};
        $scope.links = [];
        objCtrl.rdLaneObject(false);
    };
});