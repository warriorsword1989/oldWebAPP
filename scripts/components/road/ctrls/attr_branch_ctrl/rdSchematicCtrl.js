/**
 * Created by wangmingdong on 2016/6/23.
 */
var namesOfBranch = angular.module('app');
namesOfBranch.controller('SchematicOfBranchCtrl', ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', 'appPath', 'dsMeta', function ($scope, $timeout, $ocLazyLoad, dsEdit, appPath, dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdBranch = layerCtrl.getLayerById('relationData');
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();

    $scope.divergenceIds = objCtrl.data;
    $scope.initializeData = function () {
        $scope.divergenceIds = objCtrl.data;
        $scope.diverObj = $scope.divergenceIds;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.nameBranchForm) {
            $scope.nameBranchForm.$setPristine();
        }
    };

    $scope.setOriginalDataFunc = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    };
    /* 点击关系类型*/
    $scope.switchRelType = function (code) {
        $scope.diverObj.relationshipType = code;
    };
    /* 点击箭头图标志*/
    $scope.switchArrowType = function (code) {
        $scope.diverObj.schematics[0].arrowFlag = code;
    };
    /* 根据id获取箭头图图片*/
    $scope.getArrowPic = function (id) {
        var params = {
            id: id + ''
        };
        return dsMeta.getArrowImg(JSON.stringify(params));
    };
    $scope.picNowNum = 0;
    $scope.getPicsData = function () {
        $scope.loadText = 'loading...';
        $scope.showPicLoading = true;
        $scope.picPageNum = 0;
        if ($scope.picNowNum == 0) {
            $scope.picNowNum = 1;
        }
        $scope.picPageNum = $scope.picNowNum - 1;
        var params = {
            name: $scope.diverObj.schematics[0].arrowCode,
            pageNum: $scope.picPageNum,
            pageSize: 6
        };
        dsMeta.getArrowImgGroup(params).then(function (data) {
            if (data.errcode == 0) {
                if (data.data.total == 0) {
                    $scope.loadText = '搜不到数据';
                    $scope.pictures = [];
                } else {
                    $scope.showPicLoading = false;
                    $scope.pictures = data.data.data;
                    $scope.picTotal = Math.ceil(data.data.total / 6);
                }
            }
        });
    };
    /* 输入箭头图代码显示选择图片界面*/
    $scope.showPicSelect = function () {
        $scope.showImgData = false;
        $timeout(function () {
            if ($.trim($scope.diverObj.schematics[0].arrowCode) == '') {
                $scope.diverObj.schematics[0].schematicCode = '';
            }
            $scope.diverObj.schematics[0].arrowCode = CtoH($scope.diverObj.schematics[0].arrowCode);
            if (!testRegExp($scope.diverObj.schematics[0].arrowCode)) {
                $scope.diverObj.schematics[0].arrowCode = $scope.diverObj.schematics[0].arrowCode.substring(0, $scope.diverObj.schematics[0].arrowCode.length - 1);
                $scope.$apply();
                return false;
            }
        });
        $timeout(function () {
            if ($.trim($scope.diverObj.schematics[0].arrowCode).length > 0) {
                $scope.diverObj.schematics[0].schematicCode = '8' + $.trim($scope.diverObj.schematics[0].arrowCode).substr(1);
                $scope.picNowNum = 1;
                $scope.getPicsData();
                $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.schematics[0].arrowCode);
                $scope.schematicCodeSrc = $scope.getArrowPic($scope.diverObj.schematics[0].schematicCode);
                if ($.trim($scope.diverObj.schematics[0].arrowCode) == '') {
                    $scope.showImgData = false;
                } else {
                    $scope.showImgData = true;
                }
                $scope.$apply();
            }
        }, 1000);
    };
    /* 正则检测实景图输入是否正确*/
    function testRegExp(str) {
        if (str.length == 1) {
            if (new RegExp('^[0-4]+$').test(str.substr(-1, 1))) {
                return true;
            } else {
                return false;
            }
        } else if (str.length == 2) {
            if (str.substr(-1, 1) == 'e') {
                return true;
            } else {
                return false;
            }
        } else if (str.length < 9) {
            return true;
        } else {
            return false;
        }
    }

    /* 全角转半角*/
    function CtoH(str) {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) == 12288) {
                result += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }
            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
                result += String.fromCharCode(str.charCodeAt(i) - 65248);
            } else {
                result += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return result;
    }

    /* 箭头图代码点击下一页*/
    $scope.picNext = function () {
        $scope.picNowNum += 1;
        $scope.getPicsData();
    };
    /* 箭头图代码点击上一页*/
    $scope.picPre = function () {
        $scope.picNowNum -= 1;
        $scope.getPicsData();
    };
    /* 点击选中的图片*/
    $scope.selectPicCode = function (code) {
        $scope.diverObj.schematics[0].arrowCode = code;
        $scope.diverObj.schematics[0].schematicCode = '8' + $.trim($scope.diverObj.schematics[0].arrowCode).substr(1);
        $scope.arrowMapShow = $scope.getArrowPic(code);
        $scope.schematicCodeSrc = $scope.getArrowPic($scope.diverObj.schematics[0].schematicCode);
        $scope.showImgData = false;
    };
    /* 点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function (e) {
        $scope.showImgData = false;
    };
    $scope.strClone = function (obj) {
        var o,
            obj;
        if (obj.constructor == Object) {
            o = new obj.constructor();
        } else {
            o = new obj.constructor(obj.valueOf());
        }
        for (var key in obj) {
            if (o[key] != obj[key]) {
                if (typeof (obj[key]) === 'object') {
                    o[key] = clone(obj[key]);
                } else {
                    o[key] = obj[key];
                }
            }
        }
        o.toString = obj.toString;
        o.valueOf = obj.valueOf;
        return o;
    };

    /* 关系类型*/
    $scope.relationType = [
        { code: 1, label: '路口' },
        { code: 2, label: '线线' }
    ];
    /* 声音方向*/
    $scope.voiceType = [
        { code: 0, label: '无' },
        { code: 2, label: '右' },
        { code: 5, label: '左' }
    ];
    /* 初始化信息显示*/
    $scope.initDiver = function () {
        $scope.initializeData();
        var dObj = $scope.diverObj;
        $scope.$emit('SWITCHCONTAINERSTATE', { subAttrContainerTpl: false });
        /* 经过线*/
        if (dObj) {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.diverObj.inLinkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {
                    color: '#21ed25',
                    strokeWidth: 3
                }
            });
            highRenderCtrl.highLightFeatures.push({
                id: $scope.diverObj.outLinkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {
                    color: '#CD0011'
                }
            });
            highRenderCtrl.highLightFeatures.push({
                id: $scope.diverObj.nodePid.toString(),
                layerid: 'rdLink',
                type: 'node',
                style: { color: 'yellow' }
            });
            // 高亮分歧图标;
            highRenderCtrl.highLightFeatures.push({
                id: $scope.diverObj.schematics[0].pid.toString(),
                layerid: 'relationData',
                type: 'relationData',
                style: {}
            });
            for (var i = 0; i < $scope.diverObj.vias.length; i++) {
                highRenderCtrl.highLightFeatures.push({
                    id: $scope.diverObj.vias[i].linkPid.toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: { color: 'blue' }
                });
            }
            highRenderCtrl.drawHighlight();
            /* 模式图信息条数*/
            if (dObj.schematics.length > 0) {
                if ($scope.diverObj.schematics[0].arrowCode) {
                    $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.schematics[0].arrowCode);
                }
                $scope.schematicCodeSrc = $scope.getArrowPic($scope.diverObj.schematics[0].schematicCode);
                /* 分歧号码*/
                $scope.branchPid = dObj.schematics[0].branchPid;
            }
        }
    };
    /* clone对象*/
    $scope.clone = function (obj) {
        var o;
        switch (typeof obj) {
            case 'undefined':
                break;
            case 'string' :
                o = obj + '';
                break;
            case 'number' :
                o = obj - 0;
                break;
            case 'boolean' :
                o = obj;
                break;
            case 'object' :
                if (obj === null) {
                    o = null;
                } else if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push($scope.clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        o[k] = $scope.clone(obj[k]);
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
    };
    /* 数组删除一个元素*/
    $scope.arrRemove = function (array, dx) {
        if (isNaN(dx) || dx > array.length) {
            return false;
        }
        array.splice(dx, 1);
    };
    /* 过滤schematics[0].names中未修改的名称*/
    $scope.delEmptyNames = function (arr) {
        for (var i = arr.length - 1; i > -1; i--) {
            if (!arr[i].objStatus) {
                // $scope.arrRemove(arr,i);
                arr.splice(i, 1);
            }
        }
    };
    /* 展示详细信息*/
    $scope.showDetail = function (type) {
        var tempCtr = '',
            tempTepl = '';
        if (type == 0) {  // 名称信息
            tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/nameInfoCtrl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/nameInfoTepl.html';
        } else {  // 经过线
            tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/passlineCtrl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/passlineTepl.html';
        }
        var detailInfo = {
            loadType: 'subAttrTplContainer',
            propertyCtrl: tempCtr,
            propertyHtml: tempTepl
        };
        $scope.$emit('transitCtrlAndTpl', detailInfo);
    };

    if (objCtrl.data) {
        $scope.initDiver();
    }
    objCtrl.updateRdBranch = function () {
        $scope.divergenceIds = objCtrl.data;
        $scope.diverObj = {};
        $scope.initDiver();
    };
    /* 保存分歧数据*/
    $scope.save = function () {
        if (!$scope.diverObj) {
            swal('操作失败', '请输入属性值！', 'error');
            return false;
        }
        objCtrl.save();
        var param = {};
        param.type = 'RDBRANCH';
        param.command = 'UPDATE';
        param.dbId = App.Temp.dbId;
        param.data = objCtrl.changedProperty;
        /* 解决linkPid报错*/
        if (param.data.schematics) {
            delete param.data.schematics[0].linkPid;
            if (param.data.schematics[0].names) {
                $.each(param.data.schematics[0].names, function (i, v) {
                    delete v.linkPid;
                });
                $scope.delEmptyNames(param.data.schematics[0].names);
            }
        }
        if (!param.data) {
            swal('操作成功', '属性值没有变化！', 'success');
            return false;
        }
        dsEdit.save(param).then(function (data) {
            $scope.setOriginalDataFunc();
            rdBranch.redraw();
        });
    };


    /* 删除pid*/
    $scope.delete = function () {
        var detailId = $scope.diverObj.schematics[0].pid;
        dsEdit.deleteBranchByDetailId(detailId, 8).then(
            function (params) {
                if (params) {
                    highRenderCtrl.highLightFeatures.length = 0;
                    highRenderCtrl._cleanHighLight();
                    if (map.floatMenu) {
                        map.removeLayer(map.floatMenu);
                        map.floatMenu = null;
                    }
                    rdBranch.redraw();
                    $scope.$emit('SWITCHCONTAINERSTATE', {
                        subAttrContainerTpl: false,
                        attrContainerTpl: false
                    });
                }
            }
        );
    };
    /* 取消属性编辑*/
    $scope.cancel = function () {
    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initDiver);
}]);
