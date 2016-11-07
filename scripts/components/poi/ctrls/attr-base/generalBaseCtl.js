angular.module('app').controller('generalBaseCtl', ['$scope', '$rootScope', '$ocLazyLoad', '$q', 'dsEdit', 'dsMeta', 'appPath', function($scope, $rootScope, $ocll, $q, dsEdit, dsMeta, appPath) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var eventCtrl = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var poiLayer = layerCtrl.getLayerById('poi');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.truckFlagDisable = false;
    function initData() {
        if ($scope.generalPoiForm) {
            $scope.generalPoiForm.$setPristine();
        }
        $scope.poi = objectCtrl.data;
        objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
        if ($scope.poi.status == 3 || $scope.poi.state == 2) { // 提交、删除状态的POI不允许编辑   state --1新增，2删除 3修改
            $rootScope.isSpecialOperation = true;
        } else {
            if ($rootScope.specialWork) { // 专项作业
                $rootScope.isSpecialOperation = true;
            } else {
                $rootScope.isSpecialOperation = false;
            }
        }
        $scope.changeProperty('base');//默认显示基本属性页面
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
                    $scope.baseInfoTpl = appPath.root + appPath.poi + 'tpls/attr-base/baseInfoTpl.html';
                });
                break;
            case 'deep':
                var temp = App.Util.getUrlParam("deepType");
                if (temp == 'common') {
                    $ocll.load(appPath.poi + "ctrls/attr-deep/commonDeepCtl").then(function() {
                        $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/commonDeepTpl.html";
                    });
                } else if (temp == 'car') {
                    $ocll.load(appPath.poi + "ctrls/attr-deep/carRentalCtl").then(function() {
                        $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/carRentalTpl.html";
                    });
                } else if (temp == 'parking') {
                    $ocll.load(appPath.poi + "ctrls/attr-deep/parkingCtl").then(function() {
                        $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/parkingTpl.html";
                    });
                }
                break;
            case 'relate':
                $ocll.load(appPath.poi + 'ctrls/attr-base/relationInfoCtl').then(function() {
                    $scope.relationInfoTpl = appPath.root + appPath.poi + 'tpls/attr-base/relationInfoTpl.html';
                });
                break;
            case 'same':
                $ocll.load(appPath.poi + 'ctrls/attr-base/samePoisCtrl').then(function() {
                    $scope.sameInfoTpl = appPath.root + appPath.poi + 'tpls/attr-base/samePoisTpl.html';
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
        if (!data) { //为了解决新增POI时种别为空的情况
            return;
        }
        switch (data.extend) {
            case 1: //停车场
                $ocll.load(appPath.poi + "ctrls/attr-deep/parkingCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/parkingTplOld.html";
                });
                break;
            case 2: //加油站
                $ocll.load(appPath.poi + "ctrls/attr-deep/oilStationCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/oilStationTpl.html";
                });
                break;
            case 3: //充电站
                $ocll.load(appPath.poi + "ctrls/attr-deep/chargingStationCtrl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/chargingStationTpl.html";
                });
                break;
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
                    initFoodType($scope.poi.kindCode);
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
            case 9: //充电桩
                $ocll.load(appPath.poi + "ctrls/attr-deep/chargingPlotCtrl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/chargingPlotTpl.html";
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
    function clearDeepInfo() {
        var poi = objectCtrl.data;
        var kindCode = poi.kindCode;
        var data = $scope.metaData.kindFormat[kindCode];
        //分类切换后需要将其它的深度信息的_flag_字段设置为ignore，这样保存的时候就不会将
        if (data) {
            switch (data.extend) {
                case 1: //停车场
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    poi.chargingstations[0]._flag_ = "ignore";
                    poi.chargingplots[0]._flag_ = "ignore";
                    break;
                case 2: //加油站
                    poi.parkings[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    poi.chargingstations[0]._flag_ = "ignore";
                    poi.chargingplots[0]._flag_ = "ignore";
                    break;
                case 3: //充电站
                    poi.parkings[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.chargingplots[0]._flag_ = "ignore";
                    break;
                case 4: //宾馆酒店
                    poi.parkings[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    poi.chargingstations[0]._flag_ = "ignore";
                    poi.chargingplots[0]._flag_ = "ignore";
                    break;
                case 5: //运动场馆 由于运动场馆深度信息没有子表，使用的是poi的label字段，所以需要和default一样的处理方式
                    poi.parkings[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    poi.chargingstations[0]._flag_ = "ignore";
                    poi.chargingplots[0]._flag_ = "ignore";
                    break;
                case 6: //餐馆
                    poi.parkings[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.chargingstations[0]._flag_ = "ignore";
                    poi.chargingplots[0]._flag_ = "ignore";
                    break;
                case 7: //加气站
                    poi.parkings[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    poi.chargingstations[0]._flag_ = "ignore";
                    poi.chargingplots[0]._flag_ = "ignore";
                    break;
                case 9: //充电桩
                    poi.parkings[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    poi.chargingstations[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    break;
                default:
                    poi.parkings[0]._flag_ = "ignore";
                    poi.gasstations[0]._flag_ = "ignore";
                    poi.hotels[0]._flag_ = "ignore";
                    poi.restaurants[0]._flag_ = "ignore";
                    poi.chargingstations[0]._flag_ = "ignore";
                    poi.chargingplots[0]._flag_ = "ignore";
                    break;
            }
        }
        var originKindCode = objectCtrl.data.originJson.kindCode;
        var originData = $scope.metaData.kindFormat[originKindCode];
        //当切换了分类需要将原来的深度信息置为空数组,目的是为了在比较方法中可以删除原有深度信息 , 和彩花沟通需要删除
        // if (kindCode != originKindCode && originKindCode) {
        //     switch (originData.extend) {
        //         case 1: //停车场
        //             poi.parkings = [];
        //             break;
        //         case 2: //加油站
        //             poi.gasstations = [];
        //             break;
        //         case 3: //充电站
        //             poi.chargingstations = [];
        //             break;
        //         case 4: //宾馆酒店
        //             poi.hotels = [];
        //             break;
        //         case 5: //运动场馆
        //             break;
        //         case 6: //餐馆
        //             poi.restaurants = [];
        //             break;
        //         case 7: //加气站
        //             poi.gasstations = [];
        //         case 9: //充电桩
        //             poi.chargingplots = [];
        //             break;
        //         default:
        //             break;
        //     }
        // }
        //品牌字段特殊处理
        var chain = objectCtrl.data.chain;
        if (chain == 0) {
            objectCtrl.data.chain = "";
        }
        if (data && data.extend == '5') {
            if (!(objectCtrl.data.sportsVenue[0] || objectCtrl.data.sportsVenue[1])) { //运动场馆特殊处理，如果页面没有选择默认赋值为2
                objectCtrl.data.sportsVenue[0] = false;
                objectCtrl.data.sportsVenue[1] = false;
                objectCtrl.data.sportsVenue[2] = true;
            } else {
                objectCtrl.data.sportsVenue[2] = false;
            }
        } else {
            objectCtrl.data.sportsVenue[0] = false;
            objectCtrl.data.sportsVenue[1] = false;
            objectCtrl.data.sportsVenue[2] = false;
        }
        //需求--当分类为加油站，并且open14h为1时，需要将gasstations中的openHour字段赋值为“00:00-24:00”
        if (objectCtrl.data.kindCode == "230215" && objectCtrl.data.open24h == 1) {
            objectCtrl.data.gasstations[0].openHour = '00:00-24:00';
        }

        //21CHI为空时,增加名称的控制
        var flag = true;
        for (var i = 0, len = $scope.poi.names.length; i < len; i++) {
            if ($scope.poi.name.langCode == $scope.poi.names[i].langCode && $scope.poi.name.nameClass == $scope.poi.names[i].nameClass && $scope.poi.name.nameType == $scope.poi.names[i].nameType) {
                flag = false;
                break;
            }
        }
        if (flag) {
            $scope.poi.names.unshift($scope.poi.name);
        }
        //增加对CHI地址为空的控制
        flag = true;
        var addIndex = -1;
        for (var i = 0, len = $scope.poi.addresses.length; i < len; i++) {
            if ($scope.poi.address.langCode == $scope.poi.addresses[i].langCode) {
                flag = false;
                addIndex = i;
                break;
            }
        }
        if (flag) {
            if($scope.poi.address.fullname){ //当fullname不为空时在增加地址对象
                $scope.poi.addresses.unshift($scope.poi.address);
            }
        } else {
            if(!$scope.poi.address.fullname){ //当从编辑页面把fullname字段删除后，需要清除address对象
                $scope.poi.addresses.splice(addIndex,1);
            }
        }
    }
    /*默认显示baseInfo的tab页*/
    function initShowTag() {
        if (App.Util.getUrlParam("deepType")) {
            $scope.propertyType = 'deep';
        } else {
            $scope.propertyType = "base";
        }
        $scope.changeProperty($scope.propertyType);
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
    //根据种别给深度信息的的菜品风味赋不同的默认值
    function initFoodType(kindCode) {
        if ($scope.poi.kindCode == "110200") { //快餐
            $scope.poi.restaurants[0].foodType1["3009"] = true;
        } else if ($scope.poi.kindCode == "110101") { //中餐馆
            $scope.poi.restaurants[0].foodType1["2016"] = true;
        } else if ($scope.poi.kindCode == "110103") { //地方风味
            $scope.poi.restaurants[0].foodType1["2016"] = true;
        } else if ($scope.poi.kindCode == "110302") { //冷饮店
            $scope.poi.restaurants[0].foodType2["3015"] = true;
        } else if ($scope.poi.kindCode == "110102") { //异国风味
            $scope.poi.restaurants[0].foodType1["1001"] = true;
        }
    }
    //将电话区号和长度保存至缓存，不用每次都查询电话的长度
    $scope.teleCodeToLength = {};
    // 表单验证
    function validateForm() {
        var flag = true;
        var name = objectCtrl.data.name.name;
        if (!(name && name.length <= 35)) {
            swal("保存提示", '名称为必填项，且不能大于35个字符，请检查！', "warning");
            return false;
        }
        if(objectCtrl.data.address.fullname && objectCtrl.data.address.fullname.length == 1){
            swal("保存提示", '地址的长度不能为1！', "warning");
            return false;
        }
        var kindCode = objectCtrl.data.kindCode;
        if (!kindCode || kindCode == '0') {
            swal("保存提示", '种别为必填项，请检查！', "warning");
            return false;
        }
        var level = objectCtrl.data.level;
        if (!level) {
            swal("保存提示", '等级为必填项，请检查！', "warning");
            return false;
        }
        var pc = objectCtrl.data.postCode;
        if (pc && !/^(\d){6}$/.test(pc)) {
            swal("保存提示", '邮政编码应为6位数字，请检查！', "warning");
            return false;
        }
        var errMsg;
        var contacts = objectCtrl.data.contacts;
        for (var i = 0, len = contacts.length; i < len; i++) {
            if (contacts[i].contactType == 2) { //手机
                if (!Utils.verifyTelphone(contacts[i].contact)) {
                    flag = false;
                    errMsg = "电话填写不正确,不能保存！";
                    break;
                }
            } else { //非手机 ,存在区号，区号和电话都是纯数字，电话的长度等于根据区号查出的长度
                if (!(contacts[i].code && Utils.verifyNumber(contacts[i].code))) {
                    flag = false;
                    errMsg = "区号填写不正确,不能保存！";
                    break;
                } else if (!Utils.verifyNumber(contacts[i].contact)) {
                    flag = false;
                    errMsg = "电话填写不正确,不能保存！";
                    break;
                } else if (!($scope.teleCodeToLength[contacts[i].code] == contacts[i].contact.length)) {
                    if ($scope.teleCodeToLength[contacts[i].code]) {
                        flag = false;
                        errMsg = "电话填写不正确,不算区号长度应该是" + $scope.teleCodeToLength[contacts[i].code] + "位！";
                        break;
                    } else if ($scope.teleCodeToLength[contacts[i].code] == 0) {
                        flag = false;
                        errMsg = "区号填写不正确,不能保存！";
                        break;
                    }
                }
            }
        }
        if (!flag) {
            swal("保存提示", errMsg, "warning");
            return flag;
        }
        return flag;
    }
    /**
     * 部分属性转全角
     */
    var attrToDBC = function() {
        if (objectCtrl.data.name.name) {
            objectCtrl.data.name.name = Utils.ToDBC(objectCtrl.data.name.name);
        }
        if (objectCtrl.data.address.fullname) {
            objectCtrl.data.address.fullname = Utils.ToDBC(objectCtrl.data.address.fullname);
        }
    };
    // 保存数据
    function save() {
        if (objectCtrl.data.status == 3 || objectCtrl.data.state == 2) {
            swal("提示", '数据已提交或者删除，不能修改属性！', "info");
            return;
        }
        if (!validateForm()) {
            return;
        }
        clearDeepInfo(); //清除不使用的深度信息,某些字段特殊处理,必须要写在objectCtrl.save()之前
        attrToDBC(); //部分属性转全角
        objectCtrl.save();
        var changed = objectCtrl.changedProperty;
        if (!changed) {
            swal({
                title: "属性值没有变化，是否保存？",
                type: "warning",
                animation: 'slide-from-top',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: "是的，我要保存",
                cancelButtonText: "取消"
            }, function(f) {
                if (f) {
                    dsEdit.update($scope.poi.pid, "IXPOI", {
                        "rowId": objectCtrl.data.rowId,
                        "pid": objectCtrl.data.pid,
                        "objStatus": "UPDATE"
                    }).then(function(data) {
                        if (data) {
                            //if(!$scope.$parent.$parent.selectPoiInMap){ //false表示从poi列表选择，true表示从地图上选择
                            if (!$scope.rootCommonTemp.selectPoiInMap) { //false表示从poi列表选择，true表示从地图上选择
                                $scope.$emit("clearAttrStyleUp"); //清除属性样式
                                eventCtrl.fire(eventCtrl.eventTypes.CHANGEPOILIST, {
                                    "poi": $scope.poi,
                                    "flag": 'update'
                                });
                            } else {
                                $scope.$emit("CLEARPAGEINFO"); //清除地图上的工具条等
                                $scope.$emit("reQueryByPid", {
                                    "pid": objectCtrl.data.pid,
                                    "type": "IXPOI"
                                });
                            }
                        }
                    });
                }
            });
        } else {
            var vipPoi = false;
            if (objectCtrl.originalData.level == 'A' || objectCtrl.originalData.vipFlag) {
                vipPoi = true;
            }
            if (vipPoi) {
                swal({
                    title: "确定要维护该重要POI吗？",
                    type: "warning",
                    animation: 'slide-from-top',
                    showCancelButton: true,
                    closeOnConfirm: true,
                    confirmButtonText: "是的，我要保存",
                    cancelButtonText: "取消"
                }, function(f) {
                    if (f) {
                        saveChaged(changed);
                    }
                });
            } else {
                saveChaged(changed);
            }
        }
    }

    function saveChaged(changed) {
        dsEdit.update($scope.poi.pid, "IXPOI", changed).then(function(data) {
            if (data) {
                $scope.$emit("CLEARPAGEINFO"); //清除地图上的工具条等
                if (!$scope.rootCommonTemp.selectPoiInMap) { //false表示从poi列表选择，true表示从地图上选择
                    if (changed.hasOwnProperty("kindCode") || changed.hasOwnProperty("indoor")) {
                        poiLayer.redraw();
                    }
                    $scope.$emit("clearAttrStyleUp"); //清除属性样式
                    eventCtrl.fire(eventCtrl.eventTypes.CHANGEPOILIST, {
                        "poi": $scope.poi,
                        "flag": 'update'
                    });
                } else {
                    $scope.$emit("CLEARPAGEINFO"); //清除地图上的工具条等
                    $scope.$emit("reQueryByPid", {
                        "pid": objectCtrl.data.pid,
                        "type": "IXPOI"
                    });
                }
            }
        });
    }
    // 删除数据
    function del() {
        if (objectCtrl.data.state == 2) {
            setTimeout(function() { //为了使这个提示能弹出来，要加个延时
                swal("提示", '此数据已经删除，不能再次删除！', "info");
            }, 300);
            return;
        }
        if (objectCtrl.data.status == 3) {
            setTimeout(function() { //为了使这个提示能弹出来，要加个延时
                swal("提示", '此数据为已提交数据，不能做删除！', "info");
            }, 300);
            return;
        }
        //$scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false});
        dsEdit.delete($scope.poi.pid, "IXPOI").then(function(data) {
            poiLayer.redraw();
            $scope.$emit("CLEARPAGEINFO"); //清除地图上的工具条等
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            var editorLayer = layerCtrl.getLayerById("edit");
            editorLayer.clear();
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            });
            $scope.$emit('closePopoverTips', false);
            //if(!$scope.$parent.$parent.selectPoiInMap){ //false表示从poi列表选择，true表示从地图上选择
            if (!$scope.rootCommonTemp.selectPoiInMap) { //false表示从poi列表选择，true表示从地图上选择
                eventCtrl.fire(eventCtrl.eventTypes.CHANGEPOILIST, {
                    "poi": $scope.poi,
                    "flag": 'del'
                });
            }
        });
    }
    /***
     * kindcode chain fueltype变化时，联动truck 
     */
    $scope.getTruckByKindChain = function(kindcode,chain,fuelType){
        if(kindcode == "230215"){//加油站
        	fuelType = $scope.poi.getIntegrate().gasstations[0].fuelType;
        }
    	var param = {
        		kindCode: kindcode,
        		chain: chain,
        		fuelType:fuelType
			};
        dsMeta.queryTruck(param).then(function(data){
        	if(data != -1){
        		$scope.poi.truckFlag = data;
        		$scope.truckFlagDisable = true;
        	}else{
        		$scope.poi.truckFlag = 0;
        		$scope.truckFlagDisable = false;
        	}
        });
    };
    /* start 事件监听 ********************************************************/
    eventCtrl.on(eventCtrl.eventTypes.SAVEPROPERTY, save); // 保存
    eventCtrl.on(eventCtrl.eventTypes.DELETEPROPERTY, del); // 删除
    eventCtrl.on(eventCtrl.eventTypes.CANCELEVENT, $scope.cancel); // 取消
    eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, initData); // 数据切换
}]);