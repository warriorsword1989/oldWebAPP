/**
 * Created by liwanchong on 2015/10/29.
 */
var myApp = angular.module("mapApp", ['oc.lazyLoad']);
myApp.controller('linkObjectCtroller', ['$scope', '$ocLazyLoad', function ($scope,$ocLazyLoad) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    $scope.isActive = [true, false, false, false, false, false];
    $scope.changeActive= function (id) {
        for(var num= 0,len=$scope.isActive.length;num<len;num++) {
            if(num===id) {
                $scope.isActive[num] = true;
            }else{
                $scope.isActive[num] = false;
            }
        }
    }
    objectCtrl.setOriginalData( $.extend(true,{},objectCtrl.data.data));
    $scope.linkData= objectCtrl.data.data;
    for(var item= 0,len= ($scope.linkData.speedlimits).length;item<len;item++) {
        $scope.linkData.speedlimits[item]["fromSpeedLimit"] = $scope.linkData.speedlimits[item]["fromSpeedLimit"] / 10;
        $scope.linkData.speedlimits[item]["toSpeedLimit"] = $scope.linkData.speedlimits[item]["toSpeedLimit"] / 10;
    }
    $("#basicModule").css("background-color","#49C2FC");
    $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
        $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
    });
    $scope.$parent.$parent.updateLinkData=function(data) {
        $scope.linkData= data;
        $scope.currentURL="";
        $(":button").css("background-color","#fff");
        $("#basicModule").css("background-color","#49C2FC");
        $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
            $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
        });
        for(var item= 0,len= ($scope.linkData.speedlimits).length;item<len;item++) {
            $scope.linkData.speedlimits[item]["fromSpeedLimit"] = $scope.linkData.speedlimits[item]["fromSpeedLimit"] / 10;
            $scope.linkData.speedlimits[item]["toSpeedLimit"] = $scope.linkData.speedlimits[item]["toSpeedLimit"] / 10;
        }
    };
    $scope.changeModule = function (url) {

        if (url === "basicModule") {
            $scope.changeActive(0);
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
            });
        } else if (url === "paginationModule") {
            $scope.changeActive(2);
            $ocLazyLoad.load('ctrl/linkCtrl/pedestrianNaviCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/pedestrianNaviTepl.html";
            });
        } else if (url === "realtimeModule") {
            $scope.changeActive(3);
            $ocLazyLoad.load('ctrl/linkCtrl/realtimeTrafficCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/realtimeTrafficTepl.html";
            });
        } else if (url === "zoneModule") {
            $scope.changeActive(4);
            $ocLazyLoad.load('ctrl/linkCtrl/zonePeopertyCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/zonePeopertyTepl.html";
            });
        } else if (url === "limitedModule") {
            $scope.changeActive(1);
            $ocLazyLoad.load('ctrl/linkCtrl/limitedCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/limitedTepl.html";
            });
        }else if(url=="otherModule"){
            $scope.changeActive(5);
            $ocLazyLoad.load('ctrl/linkCtrl/otherCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/otherTepl.html";
            });
        }
        $(":button").css("background-color","#fff");
        $("#"+url).css("background-color","#49C2FC");
    }

    $scope.changeDirect = function (direc) {
    };

    $scope.addSideWalk = function () {
        if (!$("#sideWalkDiv").hasClass("in")) {
            $("#sideWalkDiv").addClass("in");
        }
        $scope.naviData.sideWalkData = {
            sidewalkLoc: "4",
            dividerType: "2",
            workDir: "2",
            processFlag: "1",
            captureFlag: "1"
        }
    };
    $scope.$parent.$parent.save=function() {
        console.log($scope.linkData);
        objectCtrl.setCurrentObject($scope.linkData);
        objectCtrl.save();
        var param = {
            "command": "updatelink",
            "projectId": 1,
            "data": objectCtrl.changedProperty
        };

        Application.functions.saveLinkGeometry(JSON.stringify(param),function(data){
            var outputcontroller = new fastmap.uikit.OutPutController({});
            outputcontroller.pushOutput(data);
        })
    };
     $scope.$parent.$parent.delete=function(){
         //这个是每次都要更新当前的$scope.linkData
         objectCtrl.setOriginalData( $.extend(true,{},objectCtrl.data.data));
         $scope.linkData= objectCtrl.data.data;

         var objId = parseInt($scope.linkData.pid);
         var param = {
             "command": "deletelink",
             "projectId": 1,
             "objId":objId
         }

         //结束编辑状态
         console.log("I am removing link obj" + objId);
         Application.functions.saveProperty(JSON.stringify(param), function (data) {
             //"errmsg":"此link上存在交限关系信息，删除该Link会对应删除此组关系"
             if(data.errmsg!="此link上存在交限关系信息，删除该Link会对应删除此组关系"){
                 var outputcontroller = new fastmap.uikit.OutPutController({});
                 var restrict = layerCtrl.getLayerById("referenceLine");
                 restrict.redraw();
                 outputcontroller.pushOutput(data);
                 console.log("link "+objId+" has been removed");
                 $scope.linkData=null;
                 var editorLayer=layerCtrl.getLayerById("edit")
                 editorLayer.clear();
                 $scope.$parent.$parent.objectEditURL ="";
             }else{
                 var outputcontroller = new fastmap.uikit.OutPutController({});
                 outputcontroller.pushOutput(data);
             }

         })
     }
}])