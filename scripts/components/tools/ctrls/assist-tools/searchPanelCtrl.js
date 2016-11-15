/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller('SearchPanelCtrl', ['$scope', '$interval', 'dsEdit',
    function ($scope, $interval, dsEdit) {
        $scope.searchText = null;
        $scope.running = false;
        $scope.progress = 0;
        var searchMapping = {
            道路Pid: 'linkPid',
            道路名称: 'rdName',
            'POI Pid': 'pid',
            POI名称: 'name'
        };
        $scope.doExecute = function () {
            if (!$scope.searchType) {
                swal('请选择一个搜索项', '', 'info');
            } else if (!$scope.searchText) {
                swal('请输入要搜索的内容', '', 'info');
            } else {
                $scope.running = true;
                $scope.$emit('job-search', {
                    status: 'begin'
                });
                $scope.progress = 0;
                dsEdit.getSearchData(1, searchMapping[$scope.searchType], $scope.searchText).then(function (data) {
                    $scope.progress = 100;
                    $scope.running = false;
                    $scope.$emit('job-search', {
                        status: 'end'
                    });
					/* 弹出搜索结果*/
                    $scope.$emit('openConsole', {
                        type: 'searchResult',
                        data: data,
                        param: [1, $scope.searchType, $scope.searchText]
                    });
                });
            }
        };
		/* 回车搜索*/
        $scope.keyDoExecute = function ($event) {
            if ($event.keyCode == 13) {
                $scope.doExecute();
            }
        };
    }
]);
