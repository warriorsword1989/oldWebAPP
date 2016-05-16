/**
 * Created by liwanchong on 2016/3/5.
 */
var formOfWayApp = angular.module("mapApp");
formOfWayApp.controller("formOfWayController",function($scope){
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.formsData = objCtrl.data.forms;
    $scope.fromOfWayOption = [
        {"id": "0", "label": "未调查","isCheck":false},
        {"id": "1", "label": "无属性","isCheck":false},
        {"id": "2", "label": "其他","isCheck":false},
        {"id": "10", "label": "IC","isCheck":false},
        {"id": "11", "label": "JCT","isCheck":false},
        {"id": "12", "label": "SA","isCheck":false},
        {"id": "13", "label": "PA","isCheck":false},
        {"id": "14", "label": "全封闭道路","isCheck":false},
        {"id": "15", "label": "匝道","isCheck":false},
        {"id": "16", "label": "跨线天桥","isCheck":false},
        {"id": "17", "label": "跨线地道","isCheck":false},
        {"id": "18", "label": "私道","isCheck":false},
        {"id": "20", "label": "步行街","isCheck":false},
        {"id": "21", "label": "过街天桥","isCheck":false},
        {"id": "22", "label": "公交专用道","isCheck":false},
        {"id": "23", "label": "自行车道","isCheck":false},
        {"id": "24", "label": "跨线立交桥","isCheck":false},
        {"id": "30", "label": "桥","isCheck":false},
        {"id": "31", "label": "隧道","isCheck":false},
        {"id": "32", "label": "立交桥","isCheck":false},
        {"id": "33", "label": "环岛","isCheck":false},
        {"id": "34", "label": "辅路","isCheck":false},
        {"id": "35", "label": "掉头口","isCheck":false},
        {"id": "36", "label": "POI连接路","isCheck":false},
        {"id": "37", "label": "提右","isCheck":false},
        {"id": "38", "label": "提左","isCheck":false},
        {"id": "39", "label": "主辅路入口","isCheck":false},
        {"id": "43", "label": "窄道路","isCheck":false},
        {"id": "48", "label": "主路","isCheck":false},
        {"id": "49", "label": "侧道","isCheck":false},
        {"id": "50", "label": "交叉点内道路","isCheck":false},
        {"id": "51", "label": "未定义交通区域","isCheck":false},
        {"id": "52", "label": "区域内道路","isCheck":false},
        {"id": "53", "label": "停车场出入口连接路","isCheck":false},
        {"id": "54", "label": "停车场出入口虚拟连接路","isCheck":false},
        {"id": "57", "label": "Highway对象外JCT","isCheck":false},
        {"id": "60", "label": "风景路线","isCheck":false},
        {"id": "80", "label": "停车位引导道路","isCheck":false},
        {"id": "81", "label": "停车位引导道路","isCheck":false},
        {"id": "82", "label": "虚拟提左提右","isCheck":false}
    ];
    $scope.noAttributes=true;
    $scope.formOfWayArr = [];
        for(var p in $scope.formsData){
            for(var s in $scope.fromOfWayOption){
                if($scope.formsData[p].formOfWay==$scope.fromOfWayOption[s].id){
                    if($scope.formsData[p].formOfWay=="1"){
                        $scope.noAttributes=false;
                    }
                    $scope.fromOfWayOption[s].isCheck=true;
                }
            }
        }

    $scope.getCheck=function(item){
        item.isCheck=true;
        var newForm = null;
        if(parseInt(item.id)==1){
            for(var p in $scope.formsData){
                for(var s in $scope.fromOfWayOption){
                    if($scope.formsData[p].formOfWay==$scope.fromOfWayOption[s].id){
                        $scope.fromOfWayOption[s].isCheck=false;
                    }
                }
            }
            $scope.noAttributes=false;
            $scope.formsData.length=0;
            newForm= fastmap.dataApi.rdLinkForm({"linkPid": objCtrl.data.pid, "formOfWay": parseInt(item.id)});
        }else{
            if($scope.noAttributes==false){
                $scope.fromOfWayOption[1].isCheck=false;
                $scope.noAttributes=true;
                $scope.formsData.splice(0,1);
            }
            if(parseInt(item.id)===53) {
                newForm= fastmap.dataApi.rdLinkForm({"linkPid": objCtrl.data.pid, "formOfWay": parseInt(item.id),"auxiFlag":3});
            }else{
                newForm= fastmap.dataApi.rdLinkForm({"linkPid": objCtrl.data.pid, "formOfWay": parseInt(item.id)});
            }
        }
        $scope.formsData.unshift(newForm);
        objCtrl.updateObject();
    }

    $scope.remove= function (item) {
        item.isCheck=false;
        for(var p in $scope.formsData){
            if($scope.formsData[p].formOfWay==item.id){
                $scope.formsData.splice(p,1);
            }
        }
        objCtrl.updateObject();
    }
})