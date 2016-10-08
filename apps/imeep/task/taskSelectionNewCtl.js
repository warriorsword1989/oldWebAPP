/**
 * Created by linglong on 2016/6/7.
 */
angular.module('app', ['ui.layout', 'dataService', 'ngCookies','highcharts-ng','ui.bootstrap']).controller('TaskSelectionCtlNew', ['$scope', 'dsManage', '$q', '$cookies', '$location','$timeout',
    function($scope, dsManage, $q, $cookies, $location,$timeout) {

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
        $scope.dataListType = 4;
        //顶标签的当前字符状态;
        $scope.dataStringType = '';
        //侧标签初始状态;
        $scope.taskStatus = 6;
        //初始默认状态下的请求参数;
        //$scope.requestParams = {
        //    classType: 0,
        //    classStage:1
        //};
        //当前选中子任务对象;
        $scope.currentTaskData = null;
        //是否信息面板;
        $scope.infoPanelOpened = 'none';
        //所有的当前高亮grid数据
        $scope.currentHighligtGrid = [];

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
                window.location.href = "../editor/editor.html?access_token=" + App.Temp.accessToken + "&subtaskId=" + $scope.currentTaskData.subtaskId+tempStr+$scope.deepType+"&t=" + Date.parse( new Date());
            }
        };


        ////获取当前任务作业类型;
        //$scope.getTaskProgresing = function(){
        //    if($scope.summary){
        //        return $scope.summary.percent+'%';
        //    }
        //}
        //$scope.getTaskSeason = function(){
        //    if($scope.currentTaskData){
        //        return $scope.currentTaskData.descp;
        //    }
        //}
        //
        ////拼接开始时间和结束时间的显示方式;
        //$scope.getDiyDateFormat = function(type){
        //    var tempTime = null;
        //    if($scope.currentTaskData){
        //        if(type==='start'){
        //            tempTime = $scope.currentTaskData.planStartDate;
        //        }else{
        //            tempTime = $scope.currentTaskData.planEndDate;
        //        }
        //        return getDateFormat(tempTime);
        //    }
        //}

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

        /*加载子任务列表*/
        function loadSubTaskfn() {
            //$scope.dataLoaded = false;
            //if (!obj) return;
            dsManage.getSubtaskListByUser({
                'exeUserId': $cookies.get('FM_USER_ID'),
                'status': 0,
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
                /*-------------------获取所有子任务的统计数据并重新组织对象------------------*/
                var currentIndex = 0;
                function requestfn(){
                    if(currentIndex>=$scope.currentSubTaskList.length){return;}
                    dsManage.getSubtaskSummaryById($scope.currentSubTaskList[currentIndex].subtaskId).then(function(data){
                        for(var i in data){
                            $scope.currentSubTaskList[currentIndex][i] = data[i]
                        }
                        currentIndex++;
                        requestfn()
                    })
                }
                requestfn();
                /*-------------------获取所有点数组------------------*/
            });
        }

        $scope.showSubList = function(param){
            $scope.currentDeepClass = param;
            $scope.isSubTaskListShow = !$scope.isSubTaskListShow;
        }
        $scope.isSubTaskListShow = false;

        //子任务查询
        loadSubTaskfn();
    }
]);