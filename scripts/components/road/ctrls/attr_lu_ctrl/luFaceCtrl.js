/**
 * Created by mali on 2016/7/22.
 */
angular.module("app").controller("luFaceCtrl",["$scope","dsEdit" ,'appPath', function($scope,dsEdit,appPath) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var luFace = layerCtrl.getLayerById("luFace");
    var outputCtrl = fastmap.uikit.OutPutController({});
    $scope.kind = [
	       {"id": 0, "label": "未分类"},
	       {"id": 1, "label": "大学"},
	       {"id": 2, "label": "购物中心"},
	       {"id": 3, "label": "医院"},
	       {"id": 4, "label": "体育场"},
	       {"id": 5, "label": "公墓"},
	       {"id": 6, "label": "地上停车场"},
	       {"id": 7, "label": "工业区"},
	       {"id": 11, "label": "机场"},
	       {"id": 12, "label": "机场跑道"},
	       {"id": 21, "label": "BUA面"},
	       {"id": 22, "label": "邮编面"},
	       {"id": 23, "label": "FM面"},
	       {"id": 24, "label": "车厂面"},
	       {"id": 31, "label": "休闲娱乐"},
	       {"id": 31, "label": "景区"},
	       {"id": 32, "label": "会展中心"},
	       {"id": 33, "label": "火车站"},
	       {"id": 34, "label": "文化厂区"},
	       {"id": 35, "label": "商务区"},
	       {"id": 36, "label": "商业区"},
	       {"id": 37, "label": "小区"},
	       {"id": 38, "label": "广场"},
	       {"id": 39, "label": "特色区域"},
	       {"id": 40, "label": "地下停车场"},
	       {"id": 41, "label": "地铁出入口面"}
	   ];
    //初始化
    $scope.initializeData = function(){
        $scope.luFaceData = objCtrl.data;//获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//存储原始数据
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.luFaceForm) {
            $scope.luFaceForm.$setPristine();
        }

        //高亮luface
        var highLightFeatures=[];
        highLightFeatures.push({
            id:$scope.luFaceData.pid.toString(),
            layerid:'luFace',
            type:'luFace',
            style:{}
        })
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();

    };
    if(objCtrl.data) {
        $scope.initializeData();
    }
    $scope.save = function(){
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        //保存调用方法
        dsEdit.update($scope.luFaceData.pid, "LUFACE", objCtrl.changedProperty).then(function(data) {
            if (data) {
                if($scope.lcLinkForm) {
                    $scope.lcLinkForm.$setPristine();
                }
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            }
        })

    };

    //删除
    $scope.delete = function(){
        dsEdit.delete($scope.luFaceData.pid, "LUFACE").then(function(data) {
            if (data) {
                luFace.redraw();//重绘
                $scope.luFaceData = null;
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
        tempCtr = appPath.road + 'ctrls/attr_lu_ctrl/nameInfoCtrl';
        tempTepl = appPath.root + appPath.road + 'tpls/attr_lu_Tpl/nameInfoTpl.html';
        var detailInfo = {
            "loadType": "subAttrTplContainer",
            "propertyCtrl": tempCtr,
            "propertyHtml": tempTepl,
            "data":objCtrl.data.faceNames
        };
        $scope.$emit("transitCtrlAndTpl", detailInfo);
        eventController.fire('SHOWNAMEGROUP');
    };
    //监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}])