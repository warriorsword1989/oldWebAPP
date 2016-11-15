/**
 * Created by linglong on 2016/6/7.
 */
angular.module('webeditor').controller('TaskPageCtrl', ['$scope', '$q', '$cookies', '$location', '$timeout', 'dsManage',
    function ($scope, $q, $cookies, $location, $timeout, dsManage) {
        $scope.currentTab = 1;
        $scope.dataExist = false;
        $scope.myOption = '0';
        $scope.tab1Url = '../../../images/main/task/icon-c1.png';
        $scope.tab2Url = '../../../images/main/task/icon-h2.png';
        $scope.sortCondtion = '+name';
        $scope.sortOrient = '+';
        $scope.sortIcon = 'asc';
        $scope.showLoading = true;
        $scope.showTask = true;
        var width = document.documentElement.clientWidth;
        var taskNum = parseInt((width - 120) / 360);
        var taskLength = (width - 120) % 360;
        $scope.taskMargin = {
            // 'margin-left': '0px'
            'margin-left': taskLength / (taskNum + 1) + 'px'
        };
        $scope.condtionChange = function (param) {
            switch (param) {
            case '0':
                $scope.sortCondtion = $scope.sortOrient + 'name';
                break;
            case '1':
                $scope.sortCondtion = $scope.sortOrient + 'planStartDate';
                break;
            case '2':
                $scope.sortCondtion = $scope.sortOrient + 'planEndDate';
                break;
            case '3':
                $scope.sortCondtion = $scope.sortOrient + 'percent';
                break;
            }
        };
        $scope.sortTaskList = function () {
            $scope.sortIcon = $scope.sortIcon == 'asc' ? 'desc' : 'asc';
            $scope.sortOrient = $scope.sortOrient == '+' ? '-' : '+';
            $scope.sortCondtion = $scope.sortOrient + $scope.sortCondtion.substr(1);
        };
        $scope.goEditorPage = function (param) {
            App.Temp.subTaskId = param;
            $cookies.remove('IMEEP_EDITOR_MAP_ZOOM', {
                path: '/'
            });
            $cookies.remove('IMEEP_EDITOR_MAP_CENTER', {
                path: '/'
            });
                // window.location.href = "../editor/editor.html?access_token=" + App.Temp.accessToken + "&subtaskId=" + param;
            window.location.href = '#/editor';
        };
            /* 切换当前作业和历史作业tab页*/
        $scope.chnageTab = function (param) {
            $scope.currentTab = param;
            if ($scope.currentTab == 1) {
                $scope.tab1Url = '../../../images/main/task/icon-c1.png';
                $scope.tab2Url = '../../../images/main/task/icon-h2.png';
                $scope.showTask = true;
            } else {
                $scope.tab1Url = '../../../images/main/task/icon-c2.png';
                $scope.tab2Url = '../../../images/main/task/icon-h1.png';
                $scope.showTask = false;
            }
            loadSubTaskfn();
        };

        $scope.submitTask = function (subTaskId) {
            dsManage.submitTask(subTaskId).then(function (data) {
                if (data) {
                    loadSubTaskfn();
                }
            });
        };

        $scope.logout = function () {
            App.Util.logout();
        };
            /** *********************************控制器私有方法***********************************/
            // 格式化日期显示;
        function getDateFormat(parmas) {
            var taskYear = taskMonth = taskDay = '';
            if (parmas.length == 8) {
                taskYear = parmas.substr(0, 4);
                taskMonth = parmas.substr(4, 2);
                taskDay = parmas.substr(6);
            } else {
                var tempDate = new Date();
                tempDate.setTime(parmas);
                taskYear = tempDate.getFullYear();
                taskMonth = tempDate.getMonth();
                taskDay = tempDate.getDate();
            }
            return taskYear + '-' + taskMonth + '-' + taskDay;
        }
        /* 加载子任务列表*/
        function loadSubTaskfn() {
            $scope.selectArrow = false;
            dsManage.getSubtaskListByUser({
                exeUserId: $cookies.get('FM_USER_ID'),
                status: $scope.currentTab,
                snapshot: 0,
                platForm: 1,
                pageNum: 1,
                pageSize: 100
            }).then(function (data) {
                $scope.dataLoaded = true;
                $scope.currentSubTaskList = data;
                $scope.showLoading = false;
                $scope.dataExist = true;
                for (var i = 0; i < data.length; i++) {
                    /* 格式化返回时间*/
                    $scope.currentSubTaskList[i].planEndDate = getDateFormat($scope.currentSubTaskList[i].planEndDate);
                    $scope.currentSubTaskList[i].planStartDate = getDateFormat($scope.currentSubTaskList[i].planStartDate);
                    /* 格式化子任务类型*/
                    switch ($scope.currentSubTaskList[i].type.toString()) {
                    case '0':
                        $scope.currentSubTaskList[i].type = 'POI子任务';
                        break;
                    case '1':
                        $scope.currentSubTaskList[i].type = '道路子任务';
                        break;
                    case '2':
                        $scope.currentSubTaskList[i].type = '一体化子任务';
                        break;
                    case '3':
                        $scope.currentSubTaskList[i].type = '一体化_GRID粗编子任务';
                        break;
                    case '4':
                        $scope.currentSubTaskList[i].type = '一体化_区域粗编子任务';
                        break;
                    case '5':
                        $scope.currentSubTaskList[i].type = '多源POI子任务';
                        break;
                    case '6':
                        $scope.currentSubTaskList[i].type = '代理店子任务';
                        break;
                    case '7':
                        $scope.currentSubTaskList[i].type = 'POI专项子任务';
                        break;
                    case '8':
                        $scope.currentSubTaskList[i].type = '道路_GRID精编子任务';
                        break;
                    case '9':
                        $scope.currentSubTaskList[i].type = '道路_GRID粗编子任务';
                        break;
                    case '10':
                        $scope.currentSubTaskList[i].type = '道路区域专项子任务';
                        break;
                    }
                    $scope.currentSubTaskList[i].stage = $scope.currentSubTaskList[i].stage == 0 ? '采集' : $scope.currentSubTaskList[i].stage = $scope.currentSubTaskList[i].stage == 1 ? '日编' : '月编';
                }
                /* -------------------获取所有子任务的统计数据并重新组织对象------------------*/
                // var currentIndex = 0;
                //
                // function requestfn() {
                //    if (currentIndex >= $scope.currentSubTaskList.length) {
                //        return;
                //    }
                //    dsManage.getSubtaskSummaryById($scope.currentSubTaskList[currentIndex].subtaskId).then(function(data) {
                //        for (var i in data) {
                //            if (i != 'subtaskId') {
                //                $scope.currentSubTaskList[currentIndex][i] = data[i]
                //            }
                //        }
                //        currentIndex++;
                //        requestfn()
                //    })
                // }
                // requestfn();
            });
        }
        // 子任务查询
        loadSubTaskfn();
    }
]);
