/**
 * Created by linglong on 2016/6/7.
 */
angular.module('app', ['ui.layout', 'dataService', 'ngCookies','highcharts-ng','ui.bootstrap']).controller('TaskSelectionCtlNew', ['$scope', 'dsManage', '$q', '$cookies', '$location','$timeout',
    function($scope, dsManage, $q, $cookies, $location,$timeout) {

        /***********************************控制器初始化以及事件监听绑定***********************************/
        $scope.currentTab = 1;
        $scope.myOption = '0';
        $scope.tab1Url='../../../images/main/task/icon-c1.png';
        $scope.tab2Url='../../../images/main/task/icon-h2.png';

        $scope.selectArrow = false;

        $scope.condtionChange = function(){
            $scope.selectArrow = false;
        }
        $scope.changeSelectArrowStyle = function(){
            $scope.selectArrow = true;

        }
        $scope.goEditorPage = function(param){
            window.location.href = "../editor/editor.html?access_token=" + App.Temp.accessToken + "&subtaskId=" + param;
        }

        /*切换当前作业和历史作业tab页*/
        $scope.chnageTab = function(param){
            $scope.currentTab = param;
            if($scope.currentTab==1){
                $scope.tab1Url='../../../images/main/task/icon-c1.png';
                $scope.tab2Url='../../../images/main/task/icon-h2.png';
            }else{
                $scope.tab1Url='../../../images/main/task/icon-c2.png';
                $scope.tab2Url='../../../images/main/task/icon-h1.png';
            }
            loadSubTaskfn();
        }

        $scope.logout = function(){
            App.Util.logout();
        }

        //$scope.getTaskSeason = function(){
        //    if($scope.currentTaskData){
        //        return $scope.currentTaskData.descp;
        //    }
        //}
        //

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
            return taskYear+'-'+taskMonth+'-'+taskDay;
        }

        /*加载子任务列表*/
        function loadSubTaskfn() {
            dsManage.getSubtaskListByUser({
                'exeUserId': $cookies.get('FM_USER_ID'),
                'status': $scope.currentTab,
                'snapshot': 0,
                'platForm':1,
                'pageNum': 1,
                'pageSize': 100
            }).then(function(data) {
                $scope.dataLoaded = true;
                $scope.currentSubTaskList = data;
                for(var i=0;i<data.length;i++){
                    $scope.currentSubTaskList[i].planEndDate = getDateFormat($scope.currentSubTaskList[i].planEndDate);
                    $scope.currentSubTaskList[i].planStartDate = getDateFormat($scope.currentSubTaskList[i].planStartDate);
                }
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