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
    var rdLinkLayer = layerCtrl.getLayerById('rdLink');

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
        0:"1.svg",
        1:"2.svg",
        2:"3.svg",
        4:"4.svg",
        6:"1.svg",
        7:"1.svg",
        8:"1.svg",
        10:"1.svg",
        12:"1.svg",
        16:"1.svg",
        19:"1.svg"
    };
    $scope.progressFlag = {
        0: "无",
        1: "人工",
        2: "批处理"
    };
    $scope.relationshipType = {
        0: "路口",
        1: "线线"
    };

    $scope.initializeData = function (){

        $scope.selectIndex = 0; //用于控制选中图片的样式

        $scope.voiceGuide = {
            pid:1111,
            inLinkPid:123,
            nodePid:333,
            details:[{
                outLinkPid:0111,
                guideCode:0,
                guideType:0,
                processFlag:0,
                relationshipType:0,
                vias:[{
                    outPutLinkPid:111
                },{
                    outPutLinkPid:222
                }]
            },{
                outLinkPid:0111,
                guideCode:1,
                guideType:1,
                processFlag:1,
                relationshipType:1,
                vias:[{
                    outPutLinkPid:111
                },{
                    outPutLinkPid:2552
                }]
            }]
        };
        $scope.details = $scope.voiceGuide.details[0];
    };
    //删除退出线
    $scope.minusDetails = function (index){
        $scope.voiceGuide.details.splice(index,1);
        if($scope.voiceGuide.details.length > 0){
            $scope.details = $scope.voiceGuide.details[0];
            $scope.selectIndex = 0;
        } else {
            $scope.details = {};
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
        var highLightFeatures = [];
        var outLinkPid = $scope.voiceGuide.details[$scope.selectIndex].outLinkPid;
        highLightFeatures.push({
            id: outLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {
                color:'Green'
            },
            radius:5
        })

        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };

    //初始化时执行
    $scope.initializeData();


    $scope.cancel = function (){
        
    };

    // 保存数据
    $scope.save  = function () {
        console.info($scope.rdWarningInfoObj);
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        console.info(objCtrl.changedProperty);
        dsEdit.update($scope.rdWarningInfoObj.pid, "RDWARNINGINFO", objCtrl.changedProperty).then(function(data) {
            if (data) {
                relationData.redraw();

                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };
    // 删除数据
    $scope.del = function() {
        dsEdit.delete($scope.rdWarningInfoObj.pid, "RDWARNINGINFO").then(function(data) {
            if (data) {
                relationData.redraw();
                $scope.rdWarningInfoObj = null;
                // var editorLayer = layerCtrl.getLayerById("edit");
                // editorLayer.clear();
                highRenderCtrl._cleanHighLight(); //清空高亮
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