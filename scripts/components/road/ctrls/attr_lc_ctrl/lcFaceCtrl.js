/**
 * Created by mali on 2016/7/22.
 */
angular.module("app").controller("lcFaceCtrl",["$scope","dsEdit" ,'appPath', function($scope,dsEdit,appPath) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var lcFace = layerCtrl.getLayerById("lcFace");
    var outputCtrl = fastmap.uikit.OutPutController({});
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
            type:'polygon',
            style:{}
        })
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };
    if(objCtrl.data) {
        $scope.initializeData();
    }
    $scope.save = function(){
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
        tempTepl = appPath.root + appPath.road + 'tpls/attr_lc_Tpl/nameInfoTpl.html';
        var detailInfo = {
            "loadType": "subAttrTplContainer",
            "propertyCtrl": tempCtr,
            "propertyHtml": tempTepl,
            "data":objCtrl.data.names
        };
        $scope.$emit("transitCtrlAndTpl", detailInfo);
    };
    //监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}])