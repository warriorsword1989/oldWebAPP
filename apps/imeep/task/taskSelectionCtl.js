/**
 * Created by mali on 2016/6/7.
 */
angular.module('app', ['ui.layout', 'dataService', 'ngCookies']).controller('TaskSelectionCtl', ['$scope', 'dsManage', '$q', '$cookies', '$location',
    function($scope, dsManage, $q, $cookies, $location) {
        var layerCtrl = new fastmap.uikit.LayerController({
            config: App.taskSelectionLayersConfig
        });
        var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
        var eventCtrl = new fastmap.uikit.EventController();
        var gridLayer = new fastmap.mapApi.GridLayer();
        //当前高亮的格网数组;
        $scope.currentHighLight = [];
        //编辑开关;
        $scope.startBtnDisabled = true;
        //顶标签初始状态;
        $scope.dataListType = 1;
        //顶标签的当前字符状态;
        $scope.dataStringType = '日 一体化任务';
        //侧标签初始状态;
        $scope.taskStatus = 6;
        //初始默认状态下的请求参数;
        $scope.requestParams = {
            classType: 2
        };
        //当前选中子任务对象;
        $scope.currentTaskData = null;
        //是否信息面板;
        $scope.infoPanelOpened = 'none';
        //控制页面tab页切换;
        $scope.changeDataList = function(val) {
            $scope.requestParams = {};
            $scope.startBtnDisabled = true;
            $scope.dataListType = val;
            $scope.taskStatus = 6;
            //构建过滤请求参数;
            switch ($scope.dataListType) {
                case 1:
                    $scope.requestParams.classType = 2;
                    $scope.dataStringType = '日 一体化任务';
                    break;
                case 2:
                    $scope.requestParams.classType = 0;
                    $scope.requestParams.classStage = 1;
                    $scope.dataStringType = '日 POI任务';
                    break;
                case 3:
                    $scope.requestParams.classType = 1;
                    $scope.requestParams.classStage = 1;
                    $scope.dataStringType = '月 道路任务';
                    break;
                case 4:
                    $scope.requestParams.classType = 0;
                    $scope.requestParams.classStage = 2;
                    $scope.dataStringType = '月 POI任务';
                    break;
                case 5:
                    $scope.requestParams.classType = 3;
                    $scope.dataStringType = '专项作业任务';
                    break;
            }
            loadSubTaskfn($scope.requestParams)
        };
        $scope.changeTaskStatus = function(val) {
            $scope.startBtnDisabled = true;
            $scope.taskStatus = val;
            switch ($scope.taskStatus) {
                case 6:
                    delete $scope.requestParams.currentStatus;
                    break;
                case 7:
                    $scope.requestParams.currentStatus = 1;
                    break;
                case 8:
                    $scope.requestParams.currentStatus = 0;
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
                window.location.href = "../editor/editor.html?access_token=" + App.Temp.accessToken + "&subtaskId=" + $scope.currentTaskData.subtaskId;
            }
        };
        // 选中子任务，高亮子任务对应的网格
        $scope.selectSubtask = function(subtask) {
            $scope.currentTaskData = subtask;
            $scope.infoPanelOpened = true;
            // 清除原有高亮;
            if ($scope.currentHighLight.length) {
                for (var i = 0; i < $scope.currentHighLight.length; i++) {
                    map.removeLayer($scope.currentHighLight[i])
                }
            }
            if (subtask.gridIds.length > 0) {
                var gridIdArray = []; // 网格ID数组;
                var meshArray = [], // 图幅坐标数组
                    meshIdArray = []; // 图幅ID数组;
                var meshId, gridNum;
                for (var i = 0; i < subtask.gridIds.length; i++) {
                    meshId = subtask.gridIds[i].toString();
                    gridNum = meshId.substr(-2);
                    meshId = ("000000" + meshId.substr(0, meshId.length - 2)).substr(-6); // 图幅号不够6位左补0
                    if (meshIdArray.indexOf(meshId) < 0) {
                        meshIdArray.push(meshId);
                    }
                    gridIdArray.push(meshId + "_" + gridNum); // 网格号变换
                }
                //根据图幅号获取聚焦的范围;
                map.fitBounds(getBounds(meshIdArray));
                //判断任务网格是否都加载上的定时器;
                var selectedGrids = [];
                var timer = setInterval(function() {
                    var allGrids = layerCtrl.getLayerById('grid').gridArr;
                    for (var i = 0; i < allGrids.length; i++) {
                        for (var j = gridIdArray.length - 1; j >= 0; j--) {
                            if (allGrids[i].options.gridId == gridIdArray[j]) {
                                selectedGrids.push(allGrids[i]);
                                gridIdArray.splice(j, 1);
                                if (gridIdArray.length == 0) {
                                    clearInterval(timer);
                                    addHighlight(selectedGrids)
                                }
                            }
                        }
                    }
                }, 100);
            }
            // 根据图幅编号获取图幅的外包矩形bounds
            function getBounds(meshIds) {
                var mesh;
                var meshLayer = layerCtrl.getLayerById('mesh');
                var maxLat = 0,
                    maxLon = 0,
                    minLat = 180,
                    minLon = 180;
                for (var i = 0; i < meshIds.length; i++) {
                    mesh = meshLayer.Calculate25TMeshBorder(meshIds[i]);
                    if (mesh.maxLat > maxLat) {
                        maxLat = mesh.maxLat;
                    }
                    if (mesh.maxLon > maxLon) {
                        maxLon = mesh.maxLon;
                    }
                    if (mesh.minLat < minLat) {
                        minLat = mesh.minLat;
                    }
                    if (mesh.minLon < minLon) {
                        minLon = mesh.minLon;
                    }
                }
                return [
                    [minLat, minLon],
                    [maxLat, maxLon]
                ];
            }
            // 高亮网格
            function addHighlight(gridArray) {
                for (var i = 0; i < gridArray.length; i++) {
                    $scope.currentHighLight.push(L.rectangle(gridArray[i].getBounds(), {
                        fillColor: "#FF6699",
                        weight: 0,
                        fillOpacity: 0.5
                    }).addTo(map));
                }
            }
        }

        //获取当前任务作业类型;
        $scope.getTaskProgresing = function(){
            return '12%';
        }
        $scope.getTaskSeason = function(){
            return '2016 冬';
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

        /*加载子任务列表*/
        function loadSubTaskfn(obj) {
            if (!obj) return;
            dsManage.getSubtaskListByUser({
                // 'exeUserId': 1,
                'exeUserId': $cookies.get('FM_USER_ID'),
                'stage': obj.classStage,
                'type': obj.classType,
                'status': obj.currentStatus,
                'snapshot': 0,
                'pageNum': 1,
                'pageSize': 20
            }).then(function(data) {
                $scope.currentSubTaskList = data;
            });
        }

        function loadMap() {
            map = L.map('map', {
                attributionControl: false,
                doubleClickZoom: false,
                zoomControl: false
            }).setView([40.012834, 116.476293], 13);
            //防止地图视口加载不全;
            map.on('resize', function() {
                setTimeout(function() {
                    map.invalidateSize()
                }, 400);
            });
            tooltipsCtrl.setMap(map, 'tooltip');
            layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function(event) {
                if (event.flag == true) {
                    map.addLayer(event.layer);
                } else {
                    map.removeLayer(event.layer);
                }
            })
            for (var layer in layerCtrl.getVisibleLayers()) {
                map.addLayer(layerCtrl.getVisibleLayers()[layer]);
            }
        }
        //子任务查询
        loadSubTaskfn($scope.requestParams);
        //加载地图;
        loadMap();
    }
]);