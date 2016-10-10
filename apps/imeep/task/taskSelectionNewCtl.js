/**
 * Created by linglong on 2016/6/7.
 */
angular.module('app', ['ui.layout', 'dataService', 'ngCookies','highcharts-ng','ui.bootstrap']).controller('TaskSelectionCtlNew', ['$scope', 'dsManage', '$q', '$cookies', '$location','$timeout',
    function($scope, dsManage, $q, $cookies, $location,$timeout) {

        $scope.currentTab = 1;
        $scope.myOption = '0';
        $scope.tab1Url='../../../images/main/task/icon-c1.png';
        $scope.tab2Url='../../../images/main/task/icon-h2.png';


        $scope.showLoading = true;
        $scope.condtionChange = function(){
//            loadSubTaskfn();
        }

        $scope.changeSelectOnFoucs = function(){
            $scope.selectArrow = true;
        }
        $scope.changeSelectOnBlur = function(){
            $scope.selectArrow = false;
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
            $scope.selectArrow = false;
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
                $scope.showLoading = false;
                for(var i=0;i<data.length;i++){
                    /*格式化返回时间*/
                    $scope.currentSubTaskList[i].planEndDate = getDateFormat($scope.currentSubTaskList[i].planEndDate);
                    $scope.currentSubTaskList[i].planStartDate = getDateFormat($scope.currentSubTaskList[i].planStartDate);
                    /*格式化子任务类型*/
                    switch($scope.currentSubTaskList[i].type.toString()){
                        case '0':$scope.currentSubTaskList[i].type = 'POI';break;
                        case '1':$scope.currentSubTaskList[i].type = '道路';break;
                        case '2':$scope.currentSubTaskList[i].type = '一体化';break;
                        case '3':$scope.currentSubTaskList[i].type = '一体化_GRID粗编';break;
                        case '4':$scope.currentSubTaskList[i].type = '一体化_区域粗编';break;
                        case '5':$scope.currentSubTaskList[i].type = '多源POI';break;
                        case '6':$scope.currentSubTaskList[i].type = '代理店';break;
                        case '7':$scope.currentSubTaskList[i].type = 'POI专项';break;
                        case '8':$scope.currentSubTaskList[i].type = '道路_GRID精编';break;
                        case '9':$scope.currentSubTaskList[i].type = '道路_GRID粗编';break;
                        case '10':$scope.currentSubTaskList[i].type = '道路区域专项';break;
                    }
                    $scope.currentSubTaskList[i].stage = $scope.currentSubTaskList[i].stage==1?'日编':'月编';
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
            });
        }


        //子任务查询
        loadSubTaskfn();
    }
]);