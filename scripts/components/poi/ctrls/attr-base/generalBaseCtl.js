angular.module('app').controller('generalBaseCtl', ['$scope', '$ocLazyLoad', '$q', 'dsEdit', 'dsMeta', 'appPath', function($scope, $ocll, $q, dsEdit, dsMeta, appPath) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var eventCtrl = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var poiLayer = layerCtrl.getLayerById('poi');
    var highRenderCtrl = fastmap.uikit.HighRenderController();

    function initData() {
        $scope.poi = objectCtrl.data;
        objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
        _retreatData($scope.poi);
        /**
         * 名称组可地址组特殊处理（暂时只做了大陆的控制）
         * 将名称组中的21CHI的名称放置在name中，如果不存在21CHI的数据，则给name赋值默认数据
         * 将地址组中CHI的地址放置在address中，如果不存在CHI的数据，则给address赋值默认数据
         * @param data
         */
        function _retreatData(data) {
            var flag = true;
            for (var i = 0, len = data.names.length; i < len; i++) {
                if (data.names[i].nameClass == 1 && data.names[i].nameType == 2 && data.names[i].langCode == "CHI") {
                    flag = false;
                    data.name = data.names[i];
                    break;
                }
            }
            if (flag) {
                var name = new FM.dataApi.IxPoiName({
                    langCode: "CHI",
                    nameClass: 1,
                    nameType: 2,
                    name: ""
                });
                data.name = name;
            }
            flag = true;
            for (var i = 0, len = data.addresses.length; i < len; i++) {
                if (data.addresses[i].langCode == "CHI") {
                    flag = false;
                    data.address = data.addresses[i];
                    break;
                }
            }
            if (flag) {
                var address = new FM.dataApi.IxPoiAddress({
                    langCode: "CHI",
                    fullname: ""
                });
                data.address = address;
            }
        }
    }
    initData();
    /*切换tag按钮*/
    $scope.changeProperty = function(tagName) {
        $scope.propertyType = tagName;
        switch (tagName) {
            case 'base':
                $ocll.load(appPath.poi + 'ctrls/attr-base/baseInfoCtl').then(function() {
                    $scope.baseInfoTpl = appPath.root + appPath.poi + 'tpls/attr-base/test.html';
                });
                break;
            case 'deep':
                break;
            case 'relate':
                $ocll.load(appPath.poi + 'ctrls/attr-base/relationInfoCtl').then(function() {
                    $scope.relationInfoTpl = appPath.root + appPath.poi + 'tpls/attr-base/relationInfoTpl.html';
                });
                break;
            case 'file':
                $ocll.load(appPath.poi + 'ctrls/edit-tools/fileUploadCtl').then(function() {
                    $scope.fileUploadTpl = appPath.root + appPath.poi + 'tpls/edit-tools/fileUploadTpl.html';
                });
                break;
            default:
                $ocll.load(appPath.poi + 'edit-tools/checkResultCtl').then(function() {
                    $scope.tagContentTpl = appPath.root + appPath.poi + 'tpls/edit-tools/checkResultTpl.html';
                });
                break;
        }
    };
    //接收分类改变后触发的事件
    $scope.$on("kindChange", function(event, data) {
        if(!data){ //为了解决新增POI时种别为空的情况
            return ;
        }
        switch (data.extend) {
            case 1: //停车场
                $ocll.load(appPath.poi + "ctrls/attr-deep/parkingCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/parkingTpl.html";
                });
                break;
            case 2: //加油站
                $ocll.load(appPath.poi + "ctrls/attr-deep/oilStationCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/oilStationTpl.html";
                });
                break;
                // case 3: //充电站
                //     $ocll.load("scripts/components/poi-new/ctrls/attr-deep/parkingCtl").then(function() {
                //         $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
                //     });
                //     break;
            case 4: //宾馆酒店
                $ocll.load(appPath.poi + "ctrls/attr-deep/hotelCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/hotelTpl.html";
                });
                break;
            case 5: //运动场馆
                $ocll.load(appPath.poi + "ctrls/attr-deep/sportsVenuesCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/sportsVenuesTpl.html";
                });
                break;
            case 6: //餐馆
                $ocll.load(appPath.poi + "ctrls/attr-deep/restaurantCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/restaurantTpl.html";
                });
                dsMeta.queryFoodType($scope.poi.kindCode).then(function(ret) {
                    parseFoodType(ret);
                });
                break;
            case 7: //加气站
                $ocll.load(appPath.poi + "ctrls/attr-deep/gasStationCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/gasStationTpl.html";
                });
                break;
                // case 8: //旅游景点
                //     $ocll.load("scripts/components/poi-new/ctrls/attr-deep/parkingCtl").then(function() {
                //         $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
                //     });
                //     break;
            case 9:
                $ocll.load(appPath.poi + "ctrls/attr-deep/parkingCtl").then(function() {
                    // $ocll.load("components/poi/drtvs/directives/select2_drtv").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/parkingTpl.html";
                    $scope.$on('$includeContentLoaded', function($event) {
                        $scope.$broadcast("loaded", data);
                    });
                    // });
                });
                break;
            default:
                $scope.deepInfoTpl = "";
                break;
        }
    });
    /**
     * 由于POI模型中对深度信息为空的情况做了赋默认值的处理，所以保存的时候也需要进行清理深度信息的处理
     */
    function clearDeepInfo(){
        var poi = objectCtrl.data;
        var kindCode = poi.kindCode ;
        var data = $scope.metaData.kindFormat[kindCode];
        //分类切换后需要将其它的深度信息的_flag_字段设置为ignore，这样保存的时候就不会将
        if(data){
            switch (data.extend) {
                case 1: //停车场
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    break;
                case 2: //加油站
                    poi.parkings[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    break;
                case 4: //宾馆酒店
                    poi.parkings[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    break;
                case 5: //运动场馆 由于运动场馆深度信息没有子表，使用的是poi的label字段，所以需要和default一样的处理方式
                    poi.parkings[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    break;
                case 6: //餐馆
                    poi.parkings[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    break;
                case 7: //加气站
                    poi.parkings[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    break;
                default:
                    poi.parkings[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    break;
            }
        }


        var originKindCode = objectCtrl.data.originJson.kindCode;
        var originData = $scope.metaData.kindFormat[originKindCode];
        //当切换了分类需要将原来的深度信息置为空数组
        if(kindCode != originKindCode && originKindCode){
            switch (originData.extend) {
                case 1: //停车场
                    poi.parkings = [];
                    break;
                case 2: //加油站
                    poi.gasstations = [];
                    break;
                case 4: //宾馆酒店
                    poi.hotels = [];
                    break;
                case 5: //运动场馆
                    break;
                case 6: //餐馆
                    poi.restaurants = [];
                    break;
                case 7: //加气站
                    poi.gasstations = [];
                    break;
                default:
                    break;
            }
        }
    }

    /*默认显示baseInfo的tab页*/
    function initShowTag() {
        $scope.propertyType = "base";
        $scope.changeProperty('base');
    }
    initShowTag();
    //清除样式
    $scope.$on("clearBaseInfo", function() {
        $scope.nodeForm.$setPristine(); //清除ng-ditry
        $scope.controlFlag.isTelEmptyArr = []; //清除异常电话样式
    });

    function parseFoodType(foodType) {
        if (foodType.length > 0) {
            $scope.foodType1Obj = {};
            $scope.foodType2Obj = {};
            for (var i = 0, n = foodType.length; i < n; i++) {
                if (foodType[i].foodType == "A" || foodType[i].foodType == "C") {
                    $scope.foodType1Obj[foodType[i].foodCode] = foodType[i].foodName;
                } else {
                    $scope.foodType2Obj[foodType[i].foodCode] = foodType[i].foodName;
                }
            }
        }
    }
    //将电话区号和长度保存至缓存，不用每次都查询电话的长度
    $scope.teleCodeToLength = {};
    // 表单验证
    function validateForm() {
        var flag = true;
        var contacts = objectCtrl.data.contacts;
        for (var i = 0,len = contacts.length; i<len;i++){
            if(contacts[i].contactType == 2){ //手机
                if(!contacts[i].contact){
                    flag = false;
                    break;
                }
            } else { //非手机
                if(!contacts[i].contact || !contacts[i].code){
                    flag = false;
                    break;
                }
                
            }
        }
        if(!flag){
            swal("保存提示", '电话填写不正确,不能保存！', "warning");
            return flag;
        }
        for (var i = 0,len = contacts.length; i<len;i++){
            if(contacts[i].contactType == 1){ //固话
                if($scope.teleCodeToLength[contacts[i].code] && contacts[i].contact.length != $scope.teleCodeToLength[contacts[i].code]){
                    flag = false;
                    break;
                }
            }
        }
        if(!flag){
            swal("保存提示", '电话长度不正确,不能保存！', "warning");
        }
        return flag;
    }
    // 保存数据
    function save() {
        if(!validateForm()){
            return ;
        }
        clearDeepInfo();//清除不使用的深度信息,必须要写在objectCtrl.save()之前
        objectCtrl.save();
        var chaged =  objectCtrl.changedProperty;
        if(!chaged){
            swal({
                title: "属性值没有变化，是否保存？",
                type: "warning",
                animation: 'slide-from-top',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: "是的，我要保存",
                cancelButtonText: "取消"
            }, function(f) {
                if(f){
                    dsEdit.update($scope.poi.pid, "IXPOI", {
                        "rowId": objectCtrl.data.rowId,
                        "pid": objectCtrl.data.pid,
                        "objStatus": "UPDATE"
                    }).then(function(data) {
                        if(data){
                            if(!$scope.$parent.$parent.selectPoiInMap){ //false表示从poi列表选择，true表示从地图上选择
                                if (map.floatMenu) {
                                    map.removeLayer(map.floatMenu);
                                    map.floatMenu = null;
                                }
                                eventCtrl.fire(eventCtrl.eventTypes.CHANGEPOILIST, {"poi":$scope.poi,"flag":'update'});
                            }
                        }
                    });
                }
            });
            return;
        }
        dsEdit.update($scope.poi.pid, "IXPOI", chaged).then(function(data) {
            if(data){
                if(!$scope.$parent.$parent.selectPoiInMap){ //false表示从poi列表选择，true表示从地图上选择
                    if (map.floatMenu) {
                        map.removeLayer(map.floatMenu);
                        map.floatMenu = null;
                    }
                    eventCtrl.fire(eventCtrl.eventTypes.CHANGEPOILIST, {"poi":$scope.poi,"flag":'update'});
                }
            }
        });
    }
    // 删除数据
    function del() {
        //$scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false});
        dsEdit.delete($scope.poi.pid, "IXPOI").then(function(data) {
            poiLayer.redraw();
            if (map.floatMenu) { //移除半圈工具条
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            var editorLayer = layerCtrl.getLayerById("edit");
            editorLayer.clear();
            if(!$scope.$parent.$parent.selectPoiInMap){ //false表示从poi列表选择，true表示从地图上选择
                eventCtrl.fire(eventCtrl.eventTypes.CHANGEPOILIST, {"poi":$scope.poi,"flag":'del'});
            }
        });
    }
    /* start 事件监听 ********************************************************/
    eventCtrl.on(eventCtrl.eventTypes.SAVEPROPERTY, save); // 保存
    eventCtrl.on(eventCtrl.eventTypes.DELETEPROPERTY, del); // 删除
    eventCtrl.on(eventCtrl.eventTypes.CANCELEVENT, $scope.cancel); // 取消
    eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, initData); // 数据切换
}]);