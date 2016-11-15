/**
 * Created by liwanchong on 2015/10/29.
 */
var realtimeTrafficApp = angular.module('app');
realtimeTrafficApp.controller('speedController', function ($scope, $timeout, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    $scope.rticData = objCtrl.data;

    $scope.rticDroption = [
        { id: 0, label: '无' },
        { id: 1, label: '顺方向' },
        { id: 2, label: '逆方向' }
    ];
    $scope.rankoption = [
        { id: 0, label: '无' },
        { id: 1, label: '高速' },
        { id: 2, label: '城市高速' },
        { id: 3, label: '干线道路' },
        { id: 4, label: '其他道路' }
    ];

    $scope.speedTypeOption = [
        { id: 0, label: '普通' },
        { id: 1, label: '指示牌' },
        { id: 3, label: '特定条件' }
    ];


    // 普通限速
    $scope.minusoridinarySpeed = function (id) {
        // $scope.rticData.speedlimits.splice(id, 1);
    };
    $scope.addoridinarySpeed = function () {
        // var newIntRtic = fastmap.dataApi.linkspeedlimit({"linkPid": $scope.rticData.pid,"speedType":0});
        // $scope.rticData.speedlimits.unshift(newIntRtic)

    };

    // 条件限速
    $scope.addspeedLimit = function () {
        var newRtic = fastmap.dataApi.rdLinkSpeedLimit({ linkPid: $scope.rticData.pid, speedType: 3 });
        $scope.rticData.speedlimits.push(newRtic);
    };
    $scope.minusspeedLimit = function (id) {
        $scope.rticData.speedlimits.splice(id, 1);
        if ($scope.rticData.speedlimits.length == 0) {
            $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: true, subAttrContainerTpl: false });
        }
    };


    // 普通限速
    $scope.showOridinarySpeedInfo = function (item) {
        objCtrl.data.oridiRowId = item.rowId;

        var oridinarySpeedObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var speedlimitObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/speedOfOrdinaryCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/speedOfOrdinaryTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', speedlimitObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', oridinarySpeedObj);
    };

    // 条件限速
    $scope.showspeedlimitInfo = function (cItem, index) {
        objCtrl.data.oridiRowId = cItem.rowId;
        featCodeCtrl.setFeatCode({
            index: index
        });
        var speedlimitInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var speedlimitObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/speedOfConditionCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/speedOfConditionTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', speedlimitObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', speedlimitInfoObj);
    };


    $scope.changeColor = function (ind, ord) {
        if (ord == 1) {
            $('#oridinarySpeedSpan' + ind).css('color', '#FFF');
        } else {
            $('#speedLimitSpan' + ind).css('color', '#FFF');
        }
    };
    $scope.backColor = function (ind, ord) {
        if (ord == 1) {
            $('#oridinarySpeedSpan' + ind).css('color', 'darkgray');
        } else {
            $('#speedLimitSpan' + ind).css('color', 'darkgray');
        }
    };
});
