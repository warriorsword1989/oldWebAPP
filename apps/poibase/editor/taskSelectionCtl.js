/**
 * Created by mali on 2016/6/7.
 */
angular.module('app', ['oc.lazyLoad', 'ui.layout','localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap']).controller('TaskSelectionCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi','dsMeta', '$q', function($scope, $ocLazyLoad, $rootScope, poiDS, meta ,$q) {
    var layerCtrl = new fastmap.uikit.LayerController({config: App.taskSelectionLayersConfig});
    console.log(layerCtrl.getLayerById('mesh'))
    var shapeCtrl = new fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
    var eventCtrl = new fastmap.uikit.EventController();
    var gridLayer = new fastmap.mapApi.GridLayer();
    $scope.currentHighLight = [];

    /*加载子任务列表*/
    poiDS.getPoiList({
        dbId: App.Temp.dbId,
        // type: [1,2,3],
        pageNum: 1,
        pageSize: 10
    }).then(function(data) {
        $scope.poiList = data.rows;
    });
    loadMap();
    $scope.dataListType = 1;
    $scope.taskStatus = 6;
    $scope.changeDataList = function(val) {
        $scope.dataListType = val;
        $scope.taskStatus = 6;
    };
    $scope.changeTaskStatus = function(val) {
        $scope.taskStatus = val;
    }
    var promises = [];
    $q.all(promises).then(function(){

    });
    /*弹出/弹入任务信息面板*/
    $scope.hideEditorPanel = true;
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
    //高亮显示网格并聚焦;
    $scope.highlightGrid = function (gridId){
        //防止重绘高亮;
        if($scope.currentHighLight.length) {
            for(var i=0;i<$scope.currentHighLight.length;i++){
                map.removeLayer($scope.currentHighLight[i])
            }
        }
        var gridid = gridId?gridId:['605603_01','605603_12','595672_02'];
        var meshid = [];
        for(var i=0;i<gridid.length;i++){
            meshid.push(gridid[i].substr(0,6));
        }
        //高亮显示网格;
        var gridarr = [];
        for(var i=0;i<layerCtrl.getLayerById('grid').gridArr.length;i++){
            for(var j=0;j<gridid.length;j++){
                if(layerCtrl.getLayerById('grid').gridArr[i].options.gridId===gridid[j]){
                    gridarr.push(layerCtrl.getLayerById('grid').gridArr[i])
                }
            }
        }
        for(var i=0;i<gridarr.length;i++){
            $scope.currentHighLight.push(L.rectangle(gridarr[i].getBounds(), {fillColor: "#FF6699", weight: 0,fillOpacity:0.5}).addTo(map));
        }
        var meshArr = [];
        for(var i=0;i<meshid.length;i++){
            meshArr.push(layerCtrl.getLayerById('mesh').Calculate25TMeshBorder(meshid[i]))
        }
        //所有高亮都在视口范围;
        var allLatArr = getAllLatLng(meshArr);
        //西南角坐标;
        var sourthWest_X = getMaxOrMin(allLatArr.lng,'min');
        var sourthWest_Y = getMaxOrMin(allLatArr.lat,'min');
        //东北角坐标;
        var northEast_X = getMaxOrMin(allLatArr.lng,'max');
        var northEast_Y = getMaxOrMin(allLatArr.lat,'max');
        map.fitBounds([[sourthWest_Y,sourthWest_X ], [northEast_Y,northEast_X]]);
        var flag = 0;
        map.on('moveend', function(e) {
            for(var i=0;i<gridarr.length;i++){
                $scope.currentHighLight.push(L.rectangle(gridarr[i].getBounds(), {fillColor: "#FF6699", weight: 0,fillOpacity:0.5}).addTo(map));
            }
        });
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
}]);



