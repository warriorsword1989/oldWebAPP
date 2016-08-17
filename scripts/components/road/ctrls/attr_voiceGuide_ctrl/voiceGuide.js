/**
 * Created by wuzhen on 2016/7/24.
 * 警示信息面板
 */
angular.module('app').controller('voiceGuideCtl', ['$scope','$timeout', 'dsEdit','appPath','$ocLazyLoad', function($scope,$timeout,dsEdit, appPath,$ocLazyLoad) {
    var eventCtrl = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var relationData = layerCtrl.getLayerById('relationData');

    $scope.guideCodeList = [
        {id:0,label:'未定义'},
        {id:1,label:'直行'},
        {id:2,label:'右斜前'},
        {id:4,label:'右转'},
        {id:6,label:'右后转'},
        {id:7,label:'掉头'},
        {id:8,label:'左后转'},
        {id:10,label:'左转'},
        {id:12,label:'左斜前'},
        {id:16,label:'3D模式上没有方向指定'},
        {id:19,label:'右转专用link'}
    ];

    $scope.guideTypeList = [
        {id:0,label:'默认值'},
        {id:1,label:'平面'},
        {id:2,label:'高架'},
        {id:3,label:'地下'}
    ];

    $scope.imageCode = {
        0:"test.png",
        1:"test.png",
        2:"test.png",
        4:"test.png",
        6:"test.png",
        7:"test.png",
        8:"test.png",
        10:"test.png",
        12:"test.png",
        16:"test.png",
        19:"test.png"
    };
    $scope.progressFlag = {
        0: "无",
        1: "人工",
        2: "批处理"
    };
    $scope.relationshipType = {
        1: "路口",
        2: "线线"
    };

    $scope.initializeData = function (){
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.voiceGuide = objCtrl.data;

        $scope.selectIndex = 0; //用于控制选中图片的样式
        //$scope.details = $scope.voiceGuide.details[0];
        $scope.highLight();
    };
    //删除退出线
    $scope.minusDetails = function (index){
        $scope.voiceGuide.details.splice(index,1);
        if($scope.voiceGuide.details.length > 0){
            //$scope.details = $scope.voiceGuide.details[0];
            $scope.selectIndex = 0;
        } else {
            //$scope.details = {};
            $scope.selectIndex = -1;
        }
    };
    //显示退出线详细信息
    $scope.showDetailsInfo = function (index){
        //$scope.details = $scope.voiceGuide.details[index];
        $scope.selectIndex = index;
        $scope.highLight();
    };

    $scope.highLight = function (){
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;

        var highLightFeatures = [];
        var outLinkPid = $scope.voiceGuide.details[$scope.selectIndex].outLinkPid;
        //outLinkPid = 100005841; //测试
        highLightFeatures.push({
            id: outLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {
                color: '#21ed25'
            }
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };

    //初始化时执行
    $scope.initializeData();


    $scope.cancel = function (){
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
    };

    // 保存数据
    $scope.save  = function () {
        console.info($scope.voiceGuide);
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        console.info(objCtrl.changedProperty);
        dsEdit.update($scope.voiceGuide.pid, "RDVOICEGUIDE", objCtrl.changedProperty).then(function(data) {
            if (data) {
                //relationData.redraw();
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };
    // 删除数据
    $scope.del = function() {
        dsEdit.delete($scope.voiceGuide.pid, "RDVOICEGUIDE").then(function(data) {
            if (data) {
                relationData.redraw();
                $scope.voiceGuide = null;
                highRenderCtrl._cleanHighLight();//清空高亮
                highRenderCtrl.highLightFeatures.length = 0;
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            }
        });
    };

    /* start 事件监听 ********************************************************/
    eventCtrl.on(eventCtrl.eventTypes.SAVEPROPERTY, $scope.save); // 保存
    eventCtrl.on(eventCtrl.eventTypes.DELETEPROPERTY, $scope.del); // 删除
    eventCtrl.on(eventCtrl.eventTypes.CANCELEVENT, $scope.cancel); // 取消
    eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);