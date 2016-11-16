/**
 * Created by liwanchong on 2016/3/4.
 */
var directConnexityApp = angular.module('app');
directConnexityApp.controller('directOfConnexityController', function ($scope) {
    map.currentTool.disable();
    var objCtrl = fastmap.uikit.ObjectEditController();
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
    var dirTranform = {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd',
        e: 'ad',
        f: 'ac',
        g: 'ab',
        h: 'bac',
        i: 'dac',
        j: 'dab',
        k: 'bc',
        l: 'db',
        m: 'dbc',
        n: 'dc',
        o: 'o',
        p: 'bace',
        t: 'ar',
        u: 'br',
        v: 'cr',
        w: 'dr',
        x: 'as',
        y: 'bs',
        z: 'cs',
        0: 'ds',
        1: 'rs',
        2: 'abr',
        3: 'abs',
        4: 'acr',
        5: 'acs'
    };
    var dirCharToNum = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        r: 5,
        s: 6
    };
    var intToBinaryArray = function (num) {
        var num = +num;
        var arr = num.toString(2).split('');
        for (var i = 0, len = arr.length; i < 16 - len; i++) {
            arr.unshift('0');
        }
        return arr;
    };
    var binaryArrayToInt = function (array) {
        return parseInt(array.join(''), 2);
    };
    var changeLineInfo = function (laneInfo, index, value) {
        var arr = intToBinaryArray(laneInfo);
        arr[index] = value;
        return binaryArrayToInt(arr);
    };
    var getLaneDirFlag = function (laneInfo, index) {
        var arr = intToBinaryArray(laneInfo);
        return parseInt(arr[index]);
    };
    var CurrentObject = objCtrl.data;
    var currentLaneIndex = CurrentObject.selectedLaneIndex;
    var currentLane = CurrentObject.lanes[currentLaneIndex];
    var flag = CurrentObject.changeLaneDirectFlag;
    $scope.selectLaneDir = function (item, index, event) {
        $(event.target).siblings().removeClass('active');
        $(event.target).addClass('active');
        if (flag == 1) {
            changeLaneDir(item.flag, currentLane.dir.flag);
            currentLane.dir.flag = item.flag;
        } else {
            changeBusLaneDir(item.flag, currentLane.busDir.flag);
            currentLane.busDir.flag = item.flag;
        }
    };
    // 关联维护topo中的inLaneInfo
    var changeLaneDir = function (newDir, oldDir) {
        var n = dirTranform[newDir].split('');
        var o = dirTranform[oldDir].split('');
        var d = []; // 被删除的通行方向
        for (var k in o) {
            if (n.indexOf(o[k]) < 0) {
                d.push(dirCharToNum[o[k]]);
            }
        }
        var topo;
        for (var i = 0; i < CurrentObject.topos.length; i++) {
            topo = CurrentObject.topos[i];
            if (d.indexOf(topo.reachDir) >= 0) {
                topo.inLaneInfo = changeLineInfo(topo.inLaneInfo, currentLaneIndex, 0);
            }
        }
    };
    // 关联维护topo中的busLaneInfo
    var changeBusLaneDir = function (newDir, oldDir) {
        var n = dirTranform[newDir].split('');
        var o = dirTranform[oldDir].split('');
        var d = [],
            k; // 被删除的通行方向
        for (k in o) {
            if (n.indexOf(o[k]) < 0) {
                d.push(dirCharToNum[o[k]]);
            }
        }
        for (k in n) {
            n[k] = dirCharToNum[n[k]];
        }
        var topo;
        for (var i = 0; i < CurrentObject.topos.length; i++) {
            topo = CurrentObject.topos[i];
            // 新增公交方向，必须参考普通方向
            if (n.indexOf(topo.reachDir) >= 0 && getLaneDirFlag(topo.inLaneInfo, currentLaneIndex) == 1) {
                topo.busLaneInfo = changeLineInfo(topo.busLaneInfo, currentLaneIndex, 1);
            } else if (d.indexOf(topo.reachDir) >= 0) { // 删除公交方向
                topo.busLaneInfo = changeLineInfo(topo.busLaneInfo, currentLaneIndex, 0);
            }
        }
    };
});
