/**
 * Created by liwanchong on 2015/10/29.
 */
var myApp = angular.module("mapApp", ['oc.lazyLoad']);
myApp.controller('linkObjectCtroller', ['$scope', '$ocLazyLoad', function ($scope,$ocLazyLoad) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    objectCtrl.setOriginalData( $.extend(true,{},objectCtrl.data.data));
    $scope.linkData= objectCtrl.data.data;
    $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
        $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
    });
    $scope.$parent.$parent.updateLinkData=function(data) {
        $scope.linkData= data;
    };
    $scope.changeModule = function (url) {
        if (url === "basicModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
            });
        } else if (url === "paginationModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/pedestrianNaviCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/pedestrianNaviTepl.html";
            });
        } else if (url === "realtimeModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/realtimeTrafficCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/realtimeTrafficTepl.html";
            });
        } else if (url === "zoneModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/zonePeopertyCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/zonePeopertyTepl.html";
            });
        } else if (url === "limitedModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/limitedCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/limitedTepl.html";
            });
        }else if(url=="otherModule"){
            $ocLazyLoad.load('ctrl/linkCtrl/otherCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/otherTepl.html";
            });
        }

    }

    $scope.changeDirect = function (direc) {
        alert("dddd");
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
            console.log(data);
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
             }else{
                 var outputcontroller = new fastmap.uikit.OutPutController({});
                 outputcontroller.pushOutput(data);
             }

         })
     }
}])