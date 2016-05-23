/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('mapApp');
errorCheckModule.controller('errorCheckPageController', function ($scope) {
    var checkResultC = fastmap.uikit.CheckResultController();
    var eventController = fastmap.uikit.EventController();
    $scope.itemsByPage = 1;
    $scope.meshesId = [60560301,60560302,60560303,60560311,60560312,60560313,60560322,60560323,60560331,60560332,60560333,60560320,60560330,60560300,60560321,60560310];
    //获取检查错误
    $scope.getCheckDate = function () {
        var param = {
            "projectId": Application.projectid,
            "pageNum": $scope.itemsByPage,
            "pageSize": 5,
            "grids": $scope.meshesId
        };
        Application.functions.getCheckData(JSON.stringify(param), function (data) {
            if (data.errcode == 0) {
                checkResultC.setCheckResult(data.data);
                var errorCheckObj = {
                    "loadType": "errorCheckTab",
                    "propertyCtrl": 'components/road/ctrls/log_show_ctrl/errorCheckCtrl',
                    "propertyHtml": '../../scripts/components/road/tpls/log_show_tpl/errorCheckTpl.html'
                };
                $scope.$emit("transitCtrlAndTpl", errorCheckObj);
                $scope.goPaging();
                $scope.$apply();
            }
        });
    }

    //刷新检查输出结果

    $scope.getCheckDateAndCount = function () {
        var paramsOfCounts = {
            "projectId": Application.projectid,
            "grids": $scope.meshesId
        };
        Application.functions.getCheckCount(JSON.stringify(paramsOfCounts), function (data) {
            if (data.errcode == 0) {
                $scope.checkTotalPage = Math.ceil(data.data / 5);
                $scope.checkTotal = data.data;
                $scope.getCheckDate();
            }
        });
    }

    eventController.on('editAjaxCompleted', $scope.getCheckDateAndCount);

    if ($scope.itemsByPage === 1) {
        $scope.getCheckDateAndCount();
    }

    /*箭头图代码点击下一页*/
    $scope.picNext = function () {
        $scope.itemsByPage += 1;
        $scope.getCheckDate();
    }
    /*箭头图代码点击上一页*/
    $scope.picPre = function () {
        $scope.itemsByPage -= 1;
        $scope.getCheckDate();
    }

    /*点击翻页*/
    $scope.goPaging = function () {
        if ($scope.itemsByPage == 1) {
            if ($scope.checkTotalPage == 0 || $scope.checkTotalPage == 1) {
                $(".pic-next").prop('disabled', 'disabled');
            } else {
                $(".pic-next").prop('disabled', false);
            }
            $(".pic-pre").prop('disabled', 'disabled');
        } else {
            if ($scope.checkTotalPage - $scope.itemsByPage == 0) {
                $(".pic-next").prop('disabled', 'disabled');
            } else {
                $(".pic-next").prop('disabled', false);
            }
            $(".pic-pre").prop('disabled', false);
        }
        $scope.$apply();
    }


    $scope.refCheck = function () {
        $scope.getCheckDateAndCount();
    }


});