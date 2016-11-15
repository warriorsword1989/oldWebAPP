/**
 * Created by liwanchong on 2016/3/9.
 */
var showDirectApp = angular.module('app');
showDirectApp.controller('showDirectOfConnexity', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var conityData = objCtrl.originalData;
    $scope.laneDirectData = [
        {
            flag: 'a',
            log: '直'
        },
        {
            flag: 'b',
            log: '左'
        },
        {
            flag: 'c',
            log: '右'
        },
        {
            flag: 'd',
            log: '调'
        },
        {
            flag: 'e',
            log: '直调'
        },
        {
            flag: 'f',
            log: '直右'
        },
        {
            flag: 'g',
            log: '直左'
        },
        {
            flag: 'h',
            log: '左直右'
        },
        {
            flag: 'i',
            log: '调直右'
        },
        {
            flag: 'j',
            log: '调左值'
        },
        {
            flag: 'k',
            log: '左右'
        },
        {
            flag: 'i',
            log: '调右'
        },
        {
            flag: 'm',
            log: '调左右'
        },
        {
            flag: 'n',
            log: '调右'
        },
        {
            flag: 'o',
            log: '空'
        }
    ];
    var selectLaneDir = function (event) {
        $(event.target).siblings().removeClass('active');
        $(event.target).addClass('active');
    };
    $scope.addLaneDir = function (item, event) {
        selectLaneDir(event);
        var dirObj = {
            dir: item, // 车道方向
            adt: 0, // 附加标识
            busDir: null, // 默认非公交车道
            laneInfo: item.flag
        };
        if (event.button == 2) { // 右键
            dirObj.adt = 1; // 附加车道
            dirObj.laneInfo = '[' + item.flag + ']';
        }
        if (conityData.lanes.length < 16) { // 最多创建16车道
            conityData.lanes.push(dirObj);
        }
    };
});
