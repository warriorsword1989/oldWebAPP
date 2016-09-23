/**
 * Created by linglong on 2016/7/22.
 */
angular.module("app").controller("lcFaceCtrl",["$scope","dsEdit" ,'appPath', function($scope,dsEdit,appPath) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var lcFace = layerCtrl.getLayerById("lcFace");
    $scope.kind = [
	       {"id": 0, "label": "未分类"},
	       {"id": 1, "label": "海域"},
	       {"id": 2, "label": "河川域"},
	       {"id": 3, "label": "湖沼域"},
	       {"id": 4, "label": "水库"},
	       {"id": 5, "label": "港湾"},
	       {"id": 6, "label": "运河"},
	       {"id": 11, "label": "公园"},
	       {"id": 12, "label": "高尔夫球场"},
	       {"id": 13, "label": "滑雪场"},
	       {"id": 14, "label": "树林林地"},
	       {"id": 15, "label": "草地"},
	       {"id": 16, "label": "绿化带"},
	       {"id": 17, "label": "岛"},
	   ];
    $scope.form = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "暗沙"},
        {"id": 2, "label": "浅滩"},
        {"id": 3, "label": "珊瑚礁"},
        {"id": 4, "label": "礁"},
        {"id": 8, "label": "湖泊(国界内)"},
        {"id": 9, "label": "湖泊(国界外)"},
        {"id": 10, "label": "界河"}
    ];
    $scope.displayClass = [
        {"id": 0, "label": "默认值"},
        {"id": 1, "label": "1级"},
        {"id": 2, "label": "2级"},
        {"id": 3, "label": "3级"},
        {"id": 4, "label": "4级"},
        {"id": 5, "label": "5级"},
        {"id": 6, "label": "6级"},
        {"id": 7, "label": "7级"},
        {"id": 7, "label": "8级"}
    ];
    $scope.scale = [
        {"id": 0, "label": "2.5万"},
        {"id": 1, "label": "20万"},
        {"id": 2, "label": "100万"}
    ];
    $scope.detailFlag = [
        {"id": 0, "label": "不应用"},
        {"id": 1, "label": "只存在于详细区域"},
        {"id": 2, "label": "只存在于广域区域"},
        {"id": 3, "label": "只存在于详细和广域区域"}
    ];
    //初始化
    $scope.initializeData = function(){
        $scope.lcFaceData = objCtrl.data;//获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//存储原始数据
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.lcFaceForm) {
            $scope.lcFaceForm.$setPristine();
        }
        //高亮lcface
        var highLightFeatures=[];
        highLightFeatures.push({
            id:$scope.lcFaceData.pid.toString(),
            layerid:'lcFace',
            type:'lcFace',
            style:{}
        })
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };

    $scope.save = function(){
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        //保存调用方法
        dsEdit.update($scope.lcFaceData.pid, "LCFACE", objCtrl.changedProperty).then(function(data) {
            if (data) {
                //objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                if($scope.lcLinkForm) {
                    $scope.lcLinkForm.$setPristine();
                }
            }
        })
        $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
    };

    //删除
    $scope.delete = function(){
        dsEdit.delete($scope.lcFaceData.pid, "LCFACE").then(function(data) {
            if (data) {
                lcFace.redraw();//重绘
                $scope.lcFaceData = null;
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                var editorLayer = layerCtrl.getLayerById("edit");
                editorLayer.clear();
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            }
        });
    };
    $scope.cancel = function(){

    };
    /*展示详细信息*/
    $scope.showDetail = function () {
        var tempCtr = '', tempTepl = '';
        //名称信息
        tempCtr = appPath.road + 'ctrls/attr_lc_ctrl/nameInfoCtrl';
        tempTepl = appPath.root + appPath.road + 'tpls/attr_lc_tpl/nameInfoTpl.html';
        var detailInfo = {
            "loadType": "subAttrTplContainer",
            "propertyCtrl": tempCtr,
            "propertyHtml": tempTepl,
            "data":objCtrl.data.names
        };
        $scope.$emit("transitCtrlAndTpl", detailInfo);
        eventController.fire('SHOWNAMEGROUP')
    };

    //初始化;
    if(objCtrl.data) {
        $scope.initializeData();
    }
    //监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}])