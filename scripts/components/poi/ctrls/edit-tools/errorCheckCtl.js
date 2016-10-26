angular.module('app').controller('ErrorCheckCtl', ['$window','$scope','$timeout', 'dsEdit', 'appPath', function($window,$scope,$timeout,dsEdit,appPath) {
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = new fastmap.uikit.HighRenderController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.initType = 0;

    /**
     * table表头配置项
     * @type {string[]}
     */
    $scope.theadInfo = ['检查规则', '错误等级', '错误对象', '错误信息', '检查时间', '检查管理'];
    $scope.initTypeOptions = [
        {"id": 0, "label": " 未修改"},
        {"id": 1, "label": " 例外"},
        {"id": 2, "label": " 确认不修改"},
        {"id": 3, "label": " 确认已修改"}
    ];

    /**
     * 修改table单元格显示的宽度防止属性面板弹出挤压出现垂直滚动条;
     */
    $scope.setTableCeilWidth = function(){
        var tableWidth=document.getElementById("errorCheckTable").clientWidth;
        $scope.descriptStyle={
            "width" : (tableWidth-60-tableWidth*0.06-tableWidth*0.05-110-110)+'px',
            "overflow": "hidden",
            "text-overflow":"ellipsis",
            "white-space":"nowrap"
        }
    }

    /**
     * 修改检查项状态
     * @param selectInd
     * @param rowid
     */
    $scope.changeType = function(selectInd, rowid) {
        dsEdit.updateCheckType(rowid, selectInd).then(function(data) {
            console.log('修改成功')
        });
    };

    /**
     * 定位并高亮显示要素
     * @param pid
     * @param type
     */
    $scope.showOnMap = function(pid, type) {
        resetToolAndMap();
        $scope.$emit('locatedOnMap',{'objPid':pid,'objType':type.split('_').join('')})
    };

    /************** 数据格式化 **************/
    /*检查时间*/
    function getCreateData($scope, rows) {
        return rows;
    }

    function getOption($scope, rows) {
        return rows;
    }

    //重新设置选择工具
    var resetToolAndMap = function() {
        var layerCtrl = fastmap.uikit.LayerController();
        var editLayer = layerCtrl.getLayerById('edit');
        var rdLink = layerCtrl.getLayerById('rdLink');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var selectCtrl = fastmap.uikit.SelectController();
        var eventCtrl = fastmap.uikit.EventController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        eventCtrl.off(eventCtrl.eventTypes.GETLINKID); //清除select**ShapeCtrl.js中的事件,防止菜单之间事件错乱
        eventCtrl.off(eventCtrl.eventTypes.GETADADMINNODEID);
        eventCtrl.off(eventCtrl.eventTypes.GETNODEID);
        eventCtrl.off(eventCtrl.eventTypes.GETRELATIONID);
        eventCtrl.off(eventCtrl.eventTypes.GETTIPSID);
        eventCtrl.off(eventCtrl.eventTypes.GETFACEID);
        eventCtrl.off(eventCtrl.eventTypes.RESETCOMPLETE);
        eventCtrl.off(eventCtrl.eventTypes.GETBOXDATA);
        eventCtrl.off(eventCtrl.eventTypes.GETRECTDATA);
        eventCtrl.off(eventCtrl.eventTypes.GETFEATURE);
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        map.scrollWheelZoom.enable();
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures = [];
        editLayer.drawGeometry = null;
        editLayer.clear();
        editLayer.bringToBack();
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        shapeCtrl.stopEditing();
        rdLink.clearAllEventListeners();
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        if (map.currentTool) {
            map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
        }
        if (selectCtrl.rowKey) {
            selectCtrl.rowKey = null;
        }
        $(editLayer.options._div).unbind();
    };
}]);