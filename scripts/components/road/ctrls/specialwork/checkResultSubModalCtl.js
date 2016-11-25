angular.module('app').controller('checkResultSubModalCtl', ['$window', '$scope', '$timeout', 'dsEdit', 'dsMeta', 'appPath', function ($window, $scope, $timeout, dsEdit, dsMeta, appPath) {
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = new fastmap.uikit.HighRenderController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.initType = 0;
    /**
     * table表头配置项
     * @type {string[]}
     */
    $scope.theadInfo = ['检查规则', '错误等级', '错误对象', '错误信息', '检查时间', '检查管理'];
    $scope.initTypeOptions = [
        {
            id: 0,
            label: ' 未修改'
        },
        {
            id: 1,
            label: ' 例外'
        },
        {
            id: 2,
            label: ' 确认不修改'
        },
        {
            id: 3,
            label: ' 确认已修改'
        }
    ];
    /**
     * 查找检查结果
      */
    function getCheckResultData(num) {
        dsEdit.getRoadNameCheckResult(num).then(function (data) {
            if (data == -1) {
                return;
            }
            $scope.checkResultData = [];
            for (var i = 0, len = data.result.length; i < len; i++) {
                $scope.checkResultData.push(new FM.dataApi.IxCheckResult(data.result[i]));
                $scope.checkResultTotal = data.totalCount;
                $scope.checkPageTotal = data.totalCount > 0 ? Math.ceil(data.totalCount / 5) : 1;
            }
        });
       // dsMeta.columnDataList(num).then(function (data) {
       //     $scope.checkResultData = [];
       //     for (var i = 0, len = data.rows.length; i < len; i++) {
       //         $scope.checkResultData.push(new FM.dataApi.IxCheckResult(data.rows[i]));
       //         $scope.checkResultTotal = data.total;
       //         $scope.checkPageTotal = data.total > 0 ? Math.ceil(data.total / 5) : 1;
       //     }
       // })
    }
    initCheckResultData();

     /* 初始化检查结果数据*/
    function initCheckResultData() {
        $scope.checkPageNow = 1; // 检查结果当前页
        getCheckResultData(1);
//         $scope.outputResult = dsOutput.output; // 输出结果
    }
    /**
     * 修改table单元格显示的宽度防止属性面板弹出挤压出现垂直滚动条;
     */
    $scope.setTableCeilWidth = function () {
        var tableWidth = document.getElementById('checkResultTable').clientWidth;
        $scope.descriptStyle = {
            width: (tableWidth - 60 - tableWidth * 0.06 - tableWidth * 0.05 - 110 - 110) + 'px',
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap'
        };
    };
        /**
         * 修改检查项状态
         * @param selectInd
         * @param rowid
         */
    $scope.changeType = function (selectInd, rowid) {
        dsEdit.updateRdNCheckType(rowid, selectInd).then(function (data) {
            if (data) {
                console.log('修改成功');
                if ($scope.checkResultData.length > 1) {
                    for (var i = 0; i < $scope.checkResultData.length; i++) {
                        if ($scope.checkResultData[i].id == rowid) {
                            $scope.checkResultData.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    $scope.$emit('refreshCheckResult', true);
                }
            }
        });
    };
    /**
     * 展示编辑界面
     * @param pid
     * @param type
     */
    $scope.showDetail = function (id) {
        dsMeta.queryRdNByNameID(id).then(function (data) {
            if (data) {
                $scope.$emit('openEditPanel', data);
                $scope.closeSubModal();
            } else {
                swal('提示', '未查询到数据', 'error');
            }
        });
    };
    /* 翻页事件 */
    $scope.turnPage = function (type) {
        if (type == 'prev') { // 上一页
            $scope.$emit('trunPaging', 'prev');
        } else { //  下一页
            $scope.$emit('trunPaging', 'next');
        }
    };
    /**
     *  刷新检查
     */
    $scope.refreshCheckResult = function () {
        initCheckResultData();
    };
}]);
