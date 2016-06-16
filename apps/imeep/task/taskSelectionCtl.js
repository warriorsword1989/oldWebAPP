/**
 * Created by mali on 2016/6/7.
 */
angular.module('app', ['oc.lazyLoad', 'ui.layout','localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap','ngCookies']).controller('TaskSelectionCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi','dsMeta', '$q','$cookies','$location', function($scope, $ocLazyLoad, $rootScope, poiDS, meta ,$q,$cookies,$location) {
    var layerCtrl = new fastmap.uikit.LayerController({config: App.taskSelectionLayersConfig});
    var shapeCtrl = new fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
    var eventCtrl = new fastmap.uikit.EventController();
    var gridLayer = new fastmap.mapApi.GridLayer();
    //当前高亮的格网数组;
    $scope.currentHighLight = [];
    //编辑开关;
    $scope.editorDisabled = true;
    //顶标签初始状态;
    $scope.dataListType = 1;
    //侧标签初始状态;
    $scope.taskStatus = 6;
    //初始默认状态下的请求参数;
    $scope.requestParams = {classType:2};
    //当前作业类型;
    $scope.currentWorkType = 'road';
    //当前选中子任务对象;
    $scope.currentTaskData = null;

    $scope.currentDataLength = true;
    //是否显示箭头;
    $scope.showArrow = false;

    //控制页面tab页切换;
    $scope.changeDataList = function(val) {
        $scope.editorDisabled = true;
        $scope.dataListType = val;
        $scope.taskStatus = 6;
        //构建过滤请求参数;
        switch ($scope.dataListType){
            case 1: $scope.requestParams.classType=2;break;
            case 2: $scope.requestParams.classType=0;$scope.requestParams.classStage=1;break;
            case 3: $scope.requestParams.classType=1;$scope.requestParams.classStage=1;break;
            case 4: $scope.requestParams.classType=0;$scope.requestParams.classStage=2;break;
            case 5: $scope.requestParams.classType=3;break;
        }
        loadSubTaskfn($scope.requestParams)
    };
    $scope.changeTaskStatus = function(val) {
        $scope.editorDisabled = true;
        $scope.taskStatus = val;
        switch ($scope.taskStatus){
            case 6: $scope.requestParams.currentStatus='';break;
            case 7: $scope.requestParams.currentStatus=1;break;
            case 8: $scope.requestParams.currentStatus=0;break;
        }
        loadSubTaskfn($scope.requestParams)
    }

    var promises = [];
    $q.all(promises).then(function(){

    });

    /*弹出/弹入任务信息面板*/
    $scope.hideEditorPanel = false;
    $scope.changePanelShow = function (type) {
        switch (type) {
            case 'bottom':
                $scope.hideConsole = !$scope.hideConsole;
                break;
            case 'left':
                break;
            case 'right':
                $scope.hideEditorPanel = !$scope.hideEditorPanel;
                break;
            default:
                break;
        }
    }
    //开始编辑跳转;
    $scope.startEdit = function(){
        $scope.currentWorkType = $scope.currentTaskData.type;
        alert($scope.currentWorkType)
        if($scope.currentWorkType==0){
            window.location.href = "../editor/editor.html?"+$location.absUrl().split('?')[1].substr(0,48)+"?type=poi";
        }else{
            window.location.href = "../editor/editor.html?"+$location.absUrl().split('?')[1].substr(0,48)+"?type=road";
        }
    }
    //高亮显示网格并聚焦;
    $scope.highlightGrid = function (params){
        $scope.showArrow = true;
        $scope.currentTaskData = params;
        $scope.hideEditorPanel = true;
        //防止重绘高亮;
        if($scope.currentHighLight.length) {
            for(var i=0;i<$scope.currentHighLight.length;i++){
                map.removeLayer($scope.currentHighLight[i])
            }
        }
        //得到当前格网;
        var gridid = ['605603_01','605603_12','595672_02'];//params.gridIds?params.gridIds:['605603_01','605603_12','595672_02'];
        //获取所有图幅;
        var meshArr = [];
        for(var i=0;i<gridid.length;i++){
            meshArr.push(layerCtrl.getLayerById('mesh').Calculate25TMeshBorder(gridid[i].substr(0,6)))
        }
        //根据图幅号获取聚焦的范围;
        var allLatArr = getAllLatLng(meshArr);
        //西南角坐标;
        var sourthWest_X = getMaxOrMin(allLatArr.lng,'min');
        var sourthWest_Y = getMaxOrMin(allLatArr.lat,'min');
        //东北角坐标;
        var northEast_X = getMaxOrMin(allLatArr.lng,'max');
        var northEast_Y = getMaxOrMin(allLatArr.lat,'max');
        console.log(sourthWest_Y+'----'+sourthWest_X+'  '+northEast_Y+'----'+northEast_X)
        //聚焦完成后300毫秒再高亮;
        map.fitBounds([[sourthWest_Y,sourthWest_X ], [northEast_Y,northEast_X]]);
        //判断任务网格是否都加载上的定时器;
        var timer = setInterval(function(){
            var gridLayers = layerCtrl.getLayerById('grid').gridArr;
            for(var i=0;i<gridLayers.length;i++){
                if(gridLayers[i].options.gridId==gridid[gridid.length-1]){
                    clearInterval(timer);
                    addHighlight()
                }
            }
        },100)

        function addHighlight(){
            console.log(gridid)
            for(var i=0;i<layerCtrl.getLayerById('grid').gridArr.length;i++){
                for(var j=0;j<gridid.length;j++){
                    if(layerCtrl.getLayerById('grid').gridArr[i].options.gridId===gridid[j]){
                        $scope.currentHighLight.push(L.rectangle(layerCtrl.getLayerById('grid').gridArr[i].getBounds(), {fillColor: "#FF6699", weight: 0,fillOpacity:0.5}).addTo(map));
                    }
                }
            }
        }
        //控制编辑按钮是否可用;
        ctrlEditorSwitch(params);
    }
    /*加载子任务列表*/
    function loadSubTaskfn(obj){
        console.log(obj)
        if(!obj)return;
        poiDS.querySubtaskByUser({
            'exeUserId':1,//$cookies.get('FM_USER_ID');
            'stage':obj.classStage,
            'type':obj.classType,
            'status':obj.currentStatus,
            'snapshot':0,
            'pageNum':0,
            'pageSize':20
        }).then(function(data) {
            $scope.currentSubTaskList = data;
            if(!data.length)$scope.currentDataLength = false;
            console.log(data)
        });
    }
    //控制编辑按钮是否可用函数;
    function ctrlEditorSwitch(params){
        if(params.status){
            $scope.editorDisabled = false
        }else{
            $scope.editorDisabled = true
        }
    }

    //去除数组中重复的值;
    function removeSameValue(arr){
        var n = []; //一个新的临时数组
        for(var i = 0; i < arr.length; i++) //遍历当前数组
        {
            //如果当前数组的第i已经保存进了临时数组，那么跳过，
            //否则把当前项push到临时数组里面
            if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
        }
        return n;
    }
    //将高亮的所有网格的精度维度分别获取组成数组;
    function getAllLatLng(obj){
        var arr = {lat:[],lng:[]}
            for(var i=0;i<obj.length;i++){
                arr.lat.push(obj[i].maxLat);
                arr.lat.push(obj[i].minLat);
                arr.lng.push(obj[i].maxLon);
                arr.lng.push(obj[i].minLon);
            }
        return arr;
    }

    //获取一个数组中的最大或最小值;
    function getMaxOrMin(dataAttr,flag){
        var temp = dataAttr[0];
        if(flag==='max'){
            for(var i=0;i<dataAttr.length;i++){
                if(temp<dataAttr[i]){
                    temp = dataAttr[i]
                }
            }
        }else if(flag==='min'){
            for(var i=0;i<dataAttr.length;i++){
                if(temp>dataAttr[i]){
                    temp = dataAttr[i]
                }
            }
        }
        return temp;
    }

    // var map = null;
    function loadMap() {
        map = L.map('map', {
            attributionControl: false,
            doubleClickZoom: false,
            zoomControl: false
        }).setView([40.012834, 116.476293], 13);
        tooltipsCtrl.setMap(map, 'tooltip');
        layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function (event) {
            if (event.flag == true) {
                map.addLayer(event.layer);
            } else {
                map.removeLayer(event.layer);
            }
        })
        for (var layer in layerCtrl.getVisibleLayers()) {
            map.addLayer(layerCtrl.getVisibleLayers()[layer]);
        }
        //var gridlayer = layerCtrl.getVisibleLayers()[1];
        //map.on("click",function(e){
        //    console.log(gridlayer.gridArr)
        //})
    }
    //子任务查询
    loadSubTaskfn($scope.requestParams);
    //加载地图;
    loadMap();
}]);



