/**
 * Created by linglong on 2016/6/7.
 */
angular.module('app', ['ui.layout', 'dataService', 'ngCookies','highcharts-ng','ui.bootstrap']).controller('TaskSelectionCtl', ['$scope', 'dsManage', '$q', '$cookies', '$location','$timeout',
    function($scope, dsManage, $q, $cookies, $location,$timeout) {

        /***********************************地图相关配置以及外部js注入***********************************/

        var layerCtrl = new fastmap.uikit.LayerController({
            config: App.taskSelectionLayersConfig
        });
        var eventCtrl = new fastmap.uikit.EventController();
        var mapZoomPoint = [40.012834, 116.476293];
        var maplevel = 13;
        //初始化地图;
        var map = fastmap.mapApi.map('map', {
            attributionControl: false,
            doubleClickZoom: false,
            zoomControl: false
        }).setView(mapZoomPoint, maplevel);
        //防止地图视口加载不全;
        map.on('resize', function() {setTimeout(function() {map.invalidateSize()},400);});
        //对要加载的图层事件监听;
        layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function(event) {
            for(var layer in event.layer){
                map.addLayer(event.layer[layer]);
            }
        })
        //设置要加载显示的图层;
        layerCtrl.setLayersVisible(['grid','mesh','rdLink']);
        //layerCtrl.setLayersVisible(['mesh']);
        /***********************************控制器初始化以及事件监听绑定***********************************/
        $scope.deepType=''
        //是否显示精编任务列表（头部控制）;
        $scope.showDetailEdit = false;
        //是否显示深度信息任务列表（内容控制）;
        $scope.isDeepTask = false;
        //当前高亮的格网数组;
        $scope.currentHighLight = [];
        //编辑开关;
        $scope.startBtnDisabled = true;
        //顶标签初始状态;
        $scope.dataListType = 1;
        //顶标签的当前字符状态;
        $scope.dataStringType = '';
        //侧标签初始状态;
        $scope.taskStatus = 6;
        //初始默认状态下的请求参数;
        $scope.requestParams = {
            classType: 2,
            classStage:1
        };
        //当前选中子任务对象;
        $scope.currentTaskData = null;
        //是否信息面板;
        $scope.infoPanelOpened = 'none';
        //所有的当前高亮grid数据
        $scope.currentHighligtGrid = [];

        //控制页面tab页切换;
        $scope.changeDataList = function(val) {
            $scope.showDetailEdit = false;
            $scope.isDeepTask = false;
            $scope.requestParams = {};
            $scope.startBtnDisabled = true;
            $scope.dataListType = val;
            $scope.taskStatus = 6;
            //构建过滤请求参数;
            switch ($scope.dataListType) {
                case 1:
                    $scope.requestParams.classType = 2;
                    $scope.requestParams.classStage = 1;
                    break;
                case 2:
                    $scope.requestParams.classType = 0;
                    $scope.requestParams.classStage = 1;
                    break;
                case 3:
                    $scope.requestParams.classType = 1;
                    $scope.requestParams.classStage = 1;
                    break;
                case 4:
                    $scope.requestParams.classType = 0;
                    $scope.requestParams.classStage = 2;
                    break;
                case 5:
                    $scope.requestParams.classType = 3;
                    break;
                case 6:
                    $scope.isDeepTask = true;
                    loadDeepTaskFn();
                    return;
                    break;
                case 7:
                    //顶标签初始状态;
                    $scope.taskStatus = 9;
                    $scope.showDetailEdit = true;
                    loadPoiDetailTaskFn();
                    return;
                    break;
            }
            loadSubTaskfn($scope.requestParams)
        };
        $scope.changeTaskStatus = function(val) {
            $scope.startBtnDisabled = true;
            $scope.taskStatus = val;
            switch ($scope.taskStatus) {
                case 6:
                    if($scope.isDeepTask){
                        $scope.currentSubTaskList = [];
                        return;
                    }
                    delete $scope.requestParams.currentStatus;
                    break;
                case 7:
                    if($scope.isDeepTask){
                        $scope.currentSubTaskList = [];
                        return;
                    }
                    $scope.requestParams.currentStatus = 1;
                    break;
                case 8:
                    if($scope.isDeepTask){
                        $scope.currentSubTaskList = [];
                        return;
                    }
                    $scope.requestParams.currentStatus = 0;
                    break;
                /*poi精编分类部分*/
                case 9:
                    return;
                    break;
                case 10:
                    return;
                    break;
                case 11:
                    return;
                    break;
                case 12:
                    return;
                    break;
            }
            loadSubTaskfn($scope.requestParams)
        };
        //开始编辑跳转;
        $scope.startEdit = function() {
            if ($scope.currentTaskData) {
                var param = [];
                param.push("subtaskId=" + $scope.currentTaskData.subtaskId);
                param.push("dbId=" + $scope.currentTaskData.dbId);
                param.push("type=" + $scope.currentTaskData.type);
                param.push("stage=" + $scope.currentTaskData.stage);
                //
                var tempStr = $scope.isDeepTask?'&specialWork=true':'';
                var poideepStr = ''
                poideepStr = $scope.taskStatus==9?'&workItem=chinaName':$scope.taskStatus==10?'&workItem=englishName':$scope.taskStatus==11?'&workItem=chinaAddress':$scope.taskStatus==12?'&workItem=englishAddress':'';
                if(poideepStr){
                    window.location.href = "../colEditor/colEditor.html?access_token=" + App.Temp.accessToken+poideepStr;
                    return;
                }
                window.location.href = "../editor/editor.html?access_token=" + App.Temp.accessToken + "&subtaskId=" + $scope.currentTaskData.subtaskId+tempStr+$scope.deepType;
            }
        };
        //高亮作业区域方法;
        $scope.returnHighlightPoint = function(substaskGeomotry){
            var wkt = new Wkt.Wkt();
            var pointsArr = new Array();
            //读取wkt格式的集合对象;
            try {
                var polygon = wkt.read(substaskGeomotry);
                var coords = polygon.components;
                var points=[];
                var point = [];
                var poly = [];
                for(var i = 0; i<coords.length;i++){
                    for(var j = 0;j<coords[i].length;j++){
                        if(polygon.type=='multipolygon'){
                            for(var k=0;k<coords[i][j].length;k++){
                                point.push(new L.latLng(coords[i][j][k].y,coords[i][j][k].x));
                            }
                        }else{
                            point.push(new L.latLng(coords[i][j].y,coords[i][j].x));
                        }
                    }
                    points.push(point);
                    point = [];
                }
                return points;
            } catch (e1) {
                try {
                    wkt.read(substaskGeomotry.replace('\n', '').replace('\r', '').replace('\t', ''));
                } catch (e2) {
                    if (e2.name === 'WKTError') {
                        alert('Wicket could not understand the WKT string you entered. Check that you have parentheses balanced, and try removing tabs and newline characters.');
                        return;
                    }
                }
            }
        }
        // 选中子任务，高亮子任务对应的网格
        $scope.selectSubtask = function(subtask) {
            /*暂时判断深度信息类型*/
            if(subtask.typeFlag){
                $scope.deepType = '&deepType='+subtask.typeFlag;
            }
            /*暂时判断深度信息类型*/
            $scope.currentTaskData = subtask;
            $scope.dataStringType = $scope.currentTaskData.name;
            $scope.infoPanelOpened = true;
            // 清除原有高亮;
            if ($scope.currentHighLight) {
                map.removeLayer($scope.currentHighLight)
            }
            //高亮作业区域
            var substaskGeomotry = $scope.currentTaskData.geometry;
            var pointsArray = $scope.returnHighlightPoint(substaskGeomotry);
            $scope.currentHighLight = L.multiPolygon(pointsArray,{fillOpacity:0.5,fillColor: "#FF6699",});
            var _northEast = $scope.currentHighLight.getBounds()._northEast;
            var _southWest = $scope.currentHighLight.getBounds()._southWest;
            console.log($scope.currentHighLight.getBounds())
            var centerPonit = {}
            centerPonit.x = _northEast.lng-(_northEast.lng-_southWest.lng)/2+0.1;
            centerPonit.y = (_northEast.lat-_southWest.lat)/2+_southWest.lat;
            map.setView([centerPonit.y,centerPonit.x],12);
            map.addLayer($scope.currentHighLight);
            //去查找当前的substask概要信息;
            getCurrentSubtaskSummary();
        }

        //获取当前任务作业类型;
        $scope.getTaskProgresing = function(){
            if($scope.summary){
                return $scope.summary.percent+'%';
            }
        }
        $scope.getTaskSeason = function(){
            if($scope.currentTaskData){
                return $scope.currentTaskData.descp;
            }
        }

        //拼接开始时间和结束时间的显示方式;
        $scope.getDiyDateFormat = function(type){
            var tempTime = null;
            if($scope.currentTaskData){
                if(type==='start'){
                    tempTime = $scope.currentTaskData.planStartDate;
                }else{
                    tempTime = $scope.currentTaskData.planEndDate;
                }
                return getDateFormat(tempTime);
            }
        }

        /***********************************控制器私有方法***********************************/

        //格式化日期显示;
        function getDateFormat(parmas){
            var taskYear = taskMonth = taskDay = '';
            if(parmas.length==8){
                taskYear = parmas.substr(0,4);
                taskMonth = parmas.substr(4,2);
                taskDay = parmas.substr(6);
            }else{
                var tempDate = new Date();
                tempDate.setTime(parmas);
                taskYear = tempDate.getFullYear();
                taskMonth = tempDate.getMonth();
                taskDay = tempDate.getDate();
            }
            return taskYear+' . '+taskMonth+' . '+taskDay;
        }
        //配置统计图表;
        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'column',
                    width:270,
                    height:230,
                    spacingLeft: 0,
                    //options3d: {
                    //    enabled: true,
                    //    alpha: 10,
                    //    beta: 25,
                    //    depth: 100
                    //},
                    backgroundColor:'transparent',
                    borderColor: "#4572A7",
                    spacingTop:15
                },
                colors:['#8DBF60', '#27B7F3'],
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} 个</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                legend: {
                    itemStyle: {
                        color: '#ffffff',
                        fontWeight: 'bold'
                    }
                },
            },
            title: {text: ''},
            xAxis: {
                categories: ['全部', '待作业', '已作业'],
                crosshair: true,
                labels:{
                    style:{color:'#FFF'}
                }
            },
            yAxis: {
                min: 0,
                title: {text: ''},
                labels:{
                    style:{color:'#FFF'}
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'POI',
                data: [220, 80, 140]

            }, {
                name: 'Tips',
                data: [250, 100, 150]

            }]
        };
        //更新统计百分数和统计图表数据;
        function getCurrentSubtaskSummary(){
            if($scope.currentTaskData){
                dsManage.getSubtaskSummaryById($scope.currentTaskData.subtaskId).then(function(data) {
                    $scope.summary = data;
                    var poiArray = [$scope.summary.poi.total,$scope.summary.poi.working,$scope.summary.poi.finish];
                    var roadArray = [$scope.summary.road.total,$scope.summary.road.working,$scope.summary.road.finish];
                    /*更新统计数据*/
                    $scope.chartConfig.series = [{
                        name: 'POI',
                        data: poiArray
                    }, {
                        name: 'Tips',
                        data: roadArray

                    }]
                });
            }
        }
        /*加载子任务列表*/
        function loadSubTaskfn(obj) {
            $scope.dataLoaded = false;
            if (!obj) return;
            var k = 0;
            dsManage.getSubtaskListByUser({
                'exeUserId': $cookies.get('FM_USER_ID'),
                'stage': obj.classStage,
                'type': obj.classType,
                'status': obj.currentStatus,
                'snapshot': 0,
                'pageNum': 1,
                'pageSize': 20
            }).then(function(data) {
                $scope.dataLoaded = true;
                for(var i=0;i<data.length;i++){
                    if(!data[i].name){
                        data[i].name = '（无）';
                    }
                }
                $scope.currentSubTaskList = data;
                console.log(data)
            });
        }

        $scope.showSubList = function(param){
            $scope.currentDeepClass = param;
            $scope.isSubTaskListShow = !$scope.isSubTaskListShow;
        }
        $scope.isSubTaskListShow = false;

        function loadDeepTaskFn(){
            var data = [
                {name:'通用深度信息作业',count:3,data:[{typeFlag:'common','subtaskId':165,'name':'北京中文名子任务','girdIds':[60560331,60560332,60560333,60560320,60560330],'descp':'北京中文名子任务','planEndDate':'20151207','planStartDate':'20151207','flag':'1','type':3,'geometry':"POLYGON ((116.375 40.04167, 116.375 40.0625, 116.375 40.08333, 116.40625 40.08333, 116.40625 40.0625, 116.4375 40.0625, 116.4375 40.04167, 116.40625 40.04167, 116.40625 40.02083, 116.40625 40.0, 116.375 40.0, 116.375 40.02083, 116.375 40.04167))"},{typeFlag:'common','subtaskId':120,'name':'北京中文名子任务','girdIds':[60560331,60560332,60560333,60560320,60560330],'descp':'北京中文名子任务','planEndDate':'20151207','planStartDate':'20151207','flag':'1','type':3,'geometry':"POLYGON ((116.375 40.04167, 116.375 40.0625, 116.375 40.08333, 116.40625 40.08333, 116.40625 40.0625, 116.4375 40.0625, 116.4375 40.04167, 116.40625 40.04167, 116.40625 40.02083, 116.40625 40.0, 116.375 40.0, 116.375 40.02083, 116.375 40.04167))"},{'subtaskId':117,'name':'北京中文名子任务','girdIds':[60560331,60560332,60560333,60560320,60560330],'descp':'北京中文名子任务','planEndDate':'20151207','planStartDate':'20151207','flag':'1','type':3,'geometry':"POLYGON ((116.375 40.04167, 116.375 40.0625, 116.375 40.08333, 116.40625 40.08333, 116.40625 40.0625, 116.4375 40.0625, 116.4375 40.04167, 116.40625 40.04167, 116.40625 40.02083, 116.40625 40.0, 116.375 40.0, 116.375 40.02083, 116.375 40.04167))"}]},
                {name:'汽车租赁信息作业',count:2,data:[{typeFlag:'car','subtaskId':165,'name':'北京中文名子任务','girdIds':[60560331,60560332,60560333,60560320,60560330],'descp':'北京中文名子任务','planEndDate':'20151207','planStartDate':'20151207','flag':'1','type':3,'geometry':"POLYGON ((116.375 40.04167, 116.375 40.0625, 116.375 40.08333, 116.40625 40.08333, 116.40625 40.0625, 116.4375 40.0625, 116.4375 40.04167, 116.40625 40.04167, 116.40625 40.02083, 116.40625 40.0, 116.375 40.0, 116.375 40.02083, 116.375 40.04167))"},{typeFlag:'car','subtaskId':116,'name':'北京中文名子任务','girdIds':[60560331,60560332,60560333,60560320,60560330],'descp':'北京中文名子任务','planEndDate':'20151207','planStartDate':'20151207','flag':'1','type':3,'geometry':"POLYGON ((116.375 40.04167, 116.375 40.0625, 116.375 40.08333, 116.40625 40.08333, 116.40625 40.0625, 116.4375 40.0625, 116.4375 40.04167, 116.40625 40.04167, 116.40625 40.02083, 116.40625 40.0, 116.375 40.0, 116.375 40.02083, 116.375 40.04167))"}]},
                {name:'停车场信息作业',count:1,data:[{typeFlag:'parking','subtaskId':165,'name':'北京中文名子任务','girdIds':[60560331,60560332,60560333,60560320,60560330],'descp':'北京中文名子任务','planEndDate':'20151207','planStartDate':'20151207','flag':'1','type':3,'geometry':"POLYGON ((116.375 40.04167, 116.375 40.0625, 116.375 40.08333, 116.40625 40.08333, 116.40625 40.0625, 116.4375 40.0625, 116.4375 40.04167, 116.40625 40.04167, 116.40625 40.02083, 116.40625 40.0, 116.375 40.0, 116.375 40.02083, 116.375 40.04167))"}]}
            ]
            $scope.currentSubTaskList = data;
        }


        function loadPoiDetailTaskFn(){
            $scope.currentSubTaskList = [{'subtaskId':165,'name':'北京中文名子任务','girdIds':[60560331,60560332,60560333,60560320,60560330],'descp':'北京中文名子任务','planEndDate':'20151207','planStartDate':'20151207','flag':'1','type':3,'geometry':"POLYGON ((116.375 40.04167, 116.375 40.0625, 116.375 40.08333, 116.40625 40.08333, 116.40625 40.0625, 116.4375 40.0625, 116.4375 40.04167, 116.40625 40.04167, 116.40625 40.02083, 116.40625 40.0, 116.375 40.0, 116.375 40.02083, 116.375 40.04167))"}];
        }
        //子任务查询
        loadSubTaskfn($scope.requestParams);
    }
]);