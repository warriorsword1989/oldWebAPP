/**
 * Created by liwanchong on 2016/3/9.
 */

var addDirectConnexityApp = angular.module("app");
addDirectConnexityApp.controller("addDirectOfConnexityController",["$scope",'dsEdit',function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = new fastmap.uikit.HighRenderController();
    $scope.flagNum = 0;
    $scope.addRdLancdData = [
        {"id": 'a', "class": false},
        {"id": 'b', "class": false},
        {"id": 'c', "class": false},
        {"id": 'd', "class": false},
        {"id": 'e', "class": false},
        {"id": 'f', "class": false},
        {"id": 'g', "class": false},
        {"id": 'h', "class": false},
        {"id": 'i', "class": false},
        {"id": 'j', "class": false},
        {"id": 'k', "class": false},
        {"id": 'l', "class": false},
        {"id": 'm', "class": false},
        {"id": 'n', "class": false},
        {"id": 'o', "class": false}
    ];
    $scope.reachDirOptions = [
        {"id": 0, "label": "0 未调查"},
        {"id": 1, "label": "1 直"},
        {"id": 2, "label": "2 左"},
        {"id": 3, "label": "3 右"},
        {"id": 4, "label": "4 调"},
        {"id": 5, "label": "5 左斜前"},
        {"id": 6, "label": "6 右斜前"}
    ];
    $scope.changeData=function(id) {
        var lab = "";
        switch (id) {
            case "a":
                lab = 1;
                break;
            case "b":
                lab = 2;
                break;
            case "c":
                lab = 3;
                break;
            case "d":
                lab = 4;
                break;
            case "r":
                lab = 5;
                break;
            case "s":
                lab = 6;
                break;
            case "9":
                lab = 0;
                break;
        }
        return lab;
    };
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    $scope.intToDecial=function(data) {
        var str = "1";
        for(var i=0;i<15-data;i++) {
            str += "0";
        }
        return parseInt(str,2).toString(10);
    };
    $scope.laneInfo = objCtrl.data;
    if($scope.laneInfo["selectNum"]!==undefined) {
        highRenderCtrl.highLightFeatures.push({
            id: objCtrl.data["inLinkPid"].toString(),
            layerid:'rdLink',
            type:'line',
            style:{color:"red"}
        });
        highRenderCtrl.drawHighlight();
        // var highLightLinks = new fastmap.uikit.HighLightRender(hLayer)
        // highLightLinks.drawHighlight();
    }

    $scope.changeInfo=function(num,item) {
        for (var i = 0, len = $scope.laneInfo["topos"].length; i < len; i++) {
            var arrOfDecimal = $scope.decimalToArr($scope.laneInfo["topos"][i]["inLaneInfo"]);
            var lenOfInfo =(16- arrOfDecimal.length);
            if (lenOfInfo===num) {
                $scope.laneInfo["topos"][i]["reachDir"] = $scope.changeData(item.id);
            }

        }
    };
    $scope.removeImgActive = function () {
        $.each($('.trafficPic'), function (i, v) {
            $(v).find('img').removeClass('active');
        });
    };
    //选择弹出框中的车信
    $scope.selectTopo = function (item, e) {
        $scope.links = [];
        $scope.vais = {};
        $scope.item = item;
        $scope.removeImgActive();
        $(e.target).addClass('active');
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
    };
    $scope.addLaneConnexity=function() {
        if($scope.links == undefined ||$scope.links.length == 0){
            swal("提示","请选择退出线！","info");
            return;
        }
        if(!$scope.item){
            swal("提示","请选择图标！","info");
            return;
        }
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
        $scope.$emit("SWITCHCONTAINERSTATE",{"subAttrContainerTpl":false});
        // for(var i=0;i<$scope.links.length;i++){
        //     if( $scope.laneInfo["selectNum"]) {
        //         var selectLane = $scope.lanesArr[$scope.laneInfo["selectNum"]].split("");
        //         var selObj={
        //             "busLaneInfo": 0,
        //             "connexityPid": $scope.laneInfo["pid"],
        //             "inLaneInfo": parseInt($scope.intToDecial($scope.laneInfo["selectNum"]+1)),
        //             "outLinkPid": $scope.links[i],
        //             "reachDir": $scope.changeData($scope.item.id)?$scope.changeData($scope.item.id):0,
        //             "relationshipType": 1,
        //             "vias":[]
        //         };
        //         for (var m= 0,lenM=$scope.laneInfo["topos"].length;m<lenM;m++) {
        //             var decimalArr = $scope.decimalToArr($scope.laneInfo["topos"][m]["inLaneInfo"]);
        //             var infoLen =(16- decimalArr.length);
        //             for(var n=$scope.laneInfo["selectNum"]+2,lenN=($scope.lanesArr.length-$scope.laneInfo["selectNum"]+1);n<=lenN;n++) {
        //                 if(n===infoLen) {
        //                     $scope.laneInfo["topos"][m]["inLaneInfo"]=parseInt($scope.intToDecial(n+1))
        //                 }
        //             }
        //         }
        //         $scope.lanesArr.splice($scope.laneInfo["selectNum"]+1, 0, $scope.item.id);
        //         // $scope.laneInfo["laneInfo"] = $scope.lanesArr.join(",");
        //         $scope.laneInfo["laneNum"] += 1;
        //         $scope.laneInfo["topos"].unshift(selObj);
        //         $scope.laneInfo["selectNum"] = undefined;
        //     }else{
        //         if(lastLane[lastLane.length-1]==="]") {
        //             for(var j=0,lenJ=$scope.laneInfo["topos"].length;j<lenJ;j++) {
        //                 var arrOfDecimal = $scope.decimalToArr($scope.laneInfo["topos"][j]["inLaneInfo"]);
        //                 var lenOfInfo =(16- arrOfDecimal.length);
        //                 if((lenJ)===lenOfInfo) {
        //                     $scope.laneInfo["topos"][j]["inLaneInfo"]=parseInt($scope.intToDecial(lenJ))
        //                 }
        //             }
        //             var newObj={
        //                 "busLaneInfo": 0,
        //                 "connexityPid": $scope.laneInfo["pid"],
        //                 "inLaneInfo": parseInt($scope.intToDecial($scope.laneInfo["topos"].length-1)),
        //                 "outLinkPid": $scope.links[i],
        //                 "reachDir": $scope.changeData($scope.item.id)?$scope.changeData($scope.item.id):0,
        //                 "relationshipType": 1,
        //                 "vias":[]
        //             };
        //             $scope.lanesArr.splice($scope.lanesArr.length - 1, 0, $scope.item.id);
        //             // $scope.laneInfo["laneInfo"] = $scope.lanesArr.join(",");
        //             $scope.laneInfo["laneNum"] += 1;
        //             $scope.laneInfo["topos"].unshift(newObj);
        //         }else{
        //             // if($scope.laneInfo["laneInfo"]) {
        //             //     $scope.laneInfo["laneInfo"] += ",";
        //             // }
        //             // $scope.laneInfo["laneInfo"] += $scope.item.id;
        //             $scope.laneInfo["laneNum"] += 1;
        //             var laneNum = "";
        //             if($scope.lanesArr[0]==="") {
        //                 laneNum =0;
        //             }else{
        //                 laneNum = $scope.lanesArr.length;
        //             }
        //             var newNum = parseInt($scope.intToDecial(laneNum));
        //             var obj = {
        //                 "busLaneInfo": 0,
        //                 "connexityPid": $scope.laneInfo["pid"],
        //                 "inLaneInfo":newNum,
        //                 "outLinkPid": $scope.links[i],
        //                 "reachDir": $scope.changeData($scope.item.id)?$scope.changeData($scope.item.id):0,
        //                 "relationshipType": 1,
        //                 "vias":[]
        //             };
        //             $scope.laneInfo["topos"].unshift(obj);
        //             $scope.removeImgActive();
        //         }
        //     }
        // }

        // if ($scope.laneInfo["selectNum"]) {
        //     $scope.laneInfo["laneInfo"] = $scope.lanesArr.join(",");
        // } else {
        //     if (lastLane[lastLane.length - 1] === "]") {
        //         $scope.laneInfo["laneInfo"] = $scope.lanesArr.join(",");
        //     } else {
        //         if ($scope.laneInfo["laneInfo"]) {
        //             $scope.laneInfo["laneInfo"] += ",";
        //         }
        //         $scope.laneInfo["laneInfo"] += $scope.item.id;
        //     }
        // }



    };
    $scope.selectLaneInfo = function (item, index) {
        $scope.item = item;
        $scope.addLaneConnexity();
    }
}]);
