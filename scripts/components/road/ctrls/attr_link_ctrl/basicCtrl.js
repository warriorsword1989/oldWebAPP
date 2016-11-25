/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module('app');
basicApp.controller('basicController', function($scope, $ocLazyLoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    $scope.kindOptions = [
        {
            id: 1,
            label: '1 高速道路'
        },
        {
            id: 2,
            label: '2 城市高速'
        },
        {
            id: 3,
            label: '3 国道'
        },
        {
            id: 4,
            label: '4 省道'
        },
        {
            id: 6,
            label: '6 县道'
        },
        {
            id: 7,
            label: '7 乡镇村道路'
        },
        {
            id: 8,
            label: '8 其它道路'
        },
        {
            id: 9,
            label: '9 非引导道路'
        },
        {
            id: 10,
            label: '10 步行道路'
        },
        {
            id: 11,
            label: '11 人渡'
        },
        {
            id: 13,
            label: '13 轮渡'
        }
    ];
    $scope.laneClassOptions = [
        {
            id: 1,
            label: '1: 一条车道'
        },
        {
            id: 2,
            label: '2: 2或3条'
        },
        {
            id: 3,
            label: '3: 4条及以上'
        }
    ];
    $scope.imiCodeOptions = [
        {
            id: 0,
            label: '0: 其他道路'
        },
        {
            id: 1,
            label: '1: 交叉点内部道路'
        },
        {
            id: 2,
            label: '2: 转弯道'
        },
        {
            id: 3,
            label: '3: 无法描述的'
        }
    ];
    $scope.functionClassOptions = [
        {
            id: 1,
            label: '1: 等级1'
        },
        {
            id: 2,
            label: '2: 等级2'
        },
        {
            id: 3,
            label: '3: 等级3'
        },
        {
            id: 4,
            label: '4: 等级4'
        },
        {
            id: 5,
            label: '5: 等级5'
        }
    ];
    $scope.nameTypeOptions = [
        {
            id: 0,
            label: '普通'
        },
        {
            id: 1,
            label: '立交桥名(链接路)'
        },
        {
            id: 2,
            label: '立交桥名(主路)'
        },
        {
            id: 3,
            label: '风景线路'
        },
        {
            id: 4,
            label: '桥'
        },
        {
            id: 5,
            label: '隧道'
        },
        {
            id: 6,
            label: '虚拟名称'
        },
        {
            id: 7,
            label: '出口编号'
        },
        {
            id: 8,
            label: '编号名称'
        },
        {
            id: 9,
            label: '虚拟连接名称'
        },
        {
            id: 14,
            label: '点门牌'
        },
        {
            id: 15,
            label: '线门牌'
        }
    ];
    $scope.speedTypeOption = [
        {
            id: 0,
            label: '普通'
        },
        {
            id: 1,
            label: '指示牌'
        },
        {
            id: 3,
            label: '特定条件'
        }
    ];
    $scope.fromOfWayOption = [
        {
            id: '0',
            label: '未调查'
        },
        {
            id: '1',
            label: '无属性'
        },
        {
            id: '2',
            label: '其他'
        },
        {
            id: '10',
            label: 'IC'
        },
        {
            id: '11',
            label: 'JCT'
        },
        {
            id: '12',
            label: 'SA'
        },
        {
            id: '13',
            label: 'PA'
        },
        {
            id: '14',
            label: '全封闭道路'
        },
        {
            id: '15',
            label: '匝道'
        },
        {
            id: '16',
            label: '跨线天桥(Overpass)'
        },
        {
            id: '17',
            label: '跨线地道(Underpass)'
        },
        {
            id: '18',
            label: '私道'
        },
        {
            id: '20',
            label: '步行街'
        },
        {
            id: '21',
            label: '过街天桥'
        },
        {
            id: '22',
            label: '公交专用道'
        },
        {
            id: '23',
            label: '自行车道'
        },
        {
            id: '24',
            label: '跨线立交桥'
        },
        {
            id: '30',
            label: '桥'
        },
        {
            id: '31',
            label: '隧道'
        },
        {
            id: '32',
            label: '立交桥'
        },
        {
            id: '33',
            label: '环岛'
        },
        {
            id: '34',
            label: '辅路'
        },
        {
            id: '35',
            label: '调头口(U-Turn)'
        },
        {
            id: '36',
            label: 'POI连接路'
        },
        {
            id: '37',
            label: '提右'
        },
        {
            id: '38',
            label: '提左'
        },
        {
            id: '39',
            label: '主辅路出入口'
        },
        {
            id: '43',
            label: '窄道路'
        },
        {
            id: '48',
            label: '主路'
        },
        {
            id: '49',
            label: '侧道'
        },
        {
            id: '50',
            label: '交叉点内道路'
        },
        {
            id: '51',
            label: '未定义交通区域(UTA)'
        },
        {
            id: '52',
            label: '区域内道路'
        },
        {
            id: '53',
            label: '停车场出入口连接路'
        },
        {
            id: '54',
            label: '停车场出入口虚拟连接路'
        },
        {
            id: '57',
            label: 'Highway对象外JCT'
        },
        {
            id: '60',
            label: '风景路线'
        },
        {
            id: '80',
            label: '停车位引导道路(Parking Lane)'
        },
        {
            id: '81',
            label: '虚拟调头口'
        },
        {
            id: '82',
            label: '虚拟提左提右'
        }
    ];
    $scope.auxiFlagoption = [
        {
            id: 0,
            label: '无'
        },
        {
            id: 55,
            label: '服务区内道路'
        },
        {
            id: 56,
            label: '环岛IC链接路'
        },
        {
            id: 58,
            label: '补助道路'
        },
        {
            id: 70,
            label: 'JCT道路名删除'
        },
        {
            id: 71,
            label: '线假立交'
        },
        {
            id: 72,
            label: '功能面关联道路'
        },
        {
            id: 73,
            label: '环岛直连MD'
        },
        {
            id: 76,
            label: '7级降8级标志'
        },
        {
            id: 77,
            label: '交叉点间Link'
        }
    ];
    $scope.toolinfoOption = [
        {
            id: 0,
            label: '未调查'
        },
        {
            id: 1,
            label: '收费'
        },
        {
            id: 2,
            label: '免费'
        },
        {
            id: 3,
            label: '收费道路的免费区间'
        }
    ];
    // 车道等级的联动控制;
    function linkClassCtr(tempVar) {
        if (tempVar == 0) {
            $scope.linkData.laneClass = 0;
        } else if (tempVar == 1) {
            $scope.linkData.laneClass = 1;
        } else if (tempVar >= 2 && tempVar <= 3) {
            $scope.linkData.laneClass = 2;
        } else {
            $scope.linkData.laneClass = 3;
        }
    }
    // 双方向情况下左右车道改变联动总车道的控制;
    function leftAndRightRoadChangeCtrl() {
        if ($scope.linkData.laneLeft != $scope.linkData.laneRight) {
            $scope.linkData.laneNum = 0;
        } else {
            $scope.linkData.laneNum = parseInt($scope.linkData.laneLeft) + parseInt($scope.linkData.laneRight);
            if ($scope.linkData.laneNum > 99) $scope.linkData.laneNum = 98;
        }
    }
    // 车道数修改对车道等级的维护；
    $scope.numberLengthLimit = function() {
        switch (arguments[0]) {
            case 1:
                if (parseInt($scope.linkData.laneNum)) {
                    if ($scope.linkData.laneNum) {
                        $scope.linkData.laneNum = parseInt($scope.linkData.laneNum.substr(0, 2));
                    }
                } else {
                    $scope.linkData.laneNum = 0;
                }
                $scope.linkData.laneLeft = $scope.linkData.laneRight = 0;
                var tempnum = '';
                if ($scope.linkData.direct == 1) {
                    if ($scope.linkData.laneNum % 2) {
                        tempnum = ($scope.linkData.laneNum + 1) / 2;
                    } else {
                        tempnum = ($scope.linkData.laneNum) / 2;
                    }
                } else {
                    tempnum = ($scope.linkData.laneNum);
                }
                linkClassCtr(tempnum);
                break;
            case 2:
                if (parseInt($scope.linkData.laneLeft)) {
                    if ($scope.linkData.laneLeft) {
                        $scope.linkData.laneLeft = parseInt($scope.linkData.laneLeft.substr(0, 2));
                    }
                } else {
                    $scope.linkData.laneLeft = 0;
                }
                leftAndRightRoadChangeCtrl();
                var temp = $scope.linkData.laneLeft > $scope.linkData.laneRight ? $scope.linkData.laneLeft : $scope.linkData.laneRight;
                linkClassCtr(temp);
                break;
            case 3:
                if (parseInt($scope.linkData.laneRight)) {
                    if ($scope.linkData.laneRight) {
                        $scope.linkData.laneRight = parseInt($scope.linkData.laneRight.substr(0, 2));
                    }
                } else {
                    $scope.linkData.laneRight = 0;
                }
                leftAndRightRoadChangeCtrl();
                var temp = $scope.linkData.laneLeft > $scope.linkData.laneRight ? $scope.linkData.laneLeft : $scope.linkData.laneRight;
                linkClassCtr(temp);
                break;
        }
    };
    if (objectEditCtrl.data) {
        if ($scope.basicFrom) {
            $scope.basicFrom.$setPristine();
        }
    }
    $scope.emptyGroupId = function() {
        $('#difGroupIdText').val('');
    };
    $scope.changeKind = function(newVal, oldVal) {
        // 在模型里设置方法处理种别 变化的关联维护;
        $scope.linkData.changeKind(newVal, oldVal);
    };
    $scope.showNames = function() {
        var showNameInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function() {
                var showNameObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/namesOfDetailCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/namesOfDetailTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', showNameObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', showNameInfoObj);
    };
    // 修改道路形态
    $scope.addFormOfWay = function() {
        var addFormOfWayInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function() {
                var addFormOfWayObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/basicOfFormWayCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/basicOfFormWayTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', addFormOfWayObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', addFormOfWayInfoObj);
    };
    // 过滤条件
    $scope.flag = 0;
    $scope.auxiFilter = function(item) {
        if (item.auxiFlag !== 3) {
            $scope.flag += 1;
            if ($scope.flag === $scope.linkData.forms.length) {
                $scope.flag = 0;
                return item.auxiFlag === 0;
            }
        } else {
            $scope.flag = 0;
            return item.auxiFlag === 3;
        }
    };
    $scope.typeoption = [
        {
            id: 0,
            label: '未分类'
        },
        {
            id: 1,
            label: 'AOIZone'
        },
        {
            id: 2,
            label: 'KDZone'
        },
        {
            id: 3,
            label: 'GCZone'
        }
    ];
    $scope.showZoneWin = function(item) {
        $scope.linkData.oridiRowId = item.rowId;
        var showZoneWinObj = {
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/infoOfZoneCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/infoOfZoneTpl.html'
        };
        $scope.$emit('transitCtrlAndTpl', showZoneWinObj);
    };
    $scope.showZone = function(item) {
        if (item == 0) {} else {
            var showZoneObj = {
                loadType: 'subAttrTplContainer',
                propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/basicOfZoneCtrl',
                propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/basicOfZoneTpl.html'
            };
            $scope.$emit('transitCtrlAndTpl', showZoneObj);
        }
    };
    $scope.showOther = function() {
        var showOtherObj = {
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function() {
                var basicObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/basicOfOtherCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/basicOfOtherTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', basicObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', showOtherObj);
    };
    $scope.getFowLabel = function(fow) {
        var label;
        for(var i=0;i<$scope.fromOfWayOption.length;i++) {
            if($scope.fromOfWayOption[i].id == fow) {
                label = $scope.fromOfWayOption[i].label;
            }
        }
        return label;
    }
});