angular.module('app').controller('OptionBarCtl', ['$scope', '$ocLazyLoad', 'dsOutput', 'dsEdit', '$interval', function ($scope, $ocll, dsOutput, dsEdit, $interval) {
    /* 改变poi父子关系*/
    $scope.$on('changeRelateParent', function (event, data) {
        $scope.poi.relateParent = data;
    });

    /* 翻页事件 */
    $scope.turnPage = function (type) {
        if (type == 'prev') { // 上一页
            $scope.$emit('trunPaging', 'prev');
        } else { //  下一页
            $scope.$emit('trunPaging', 'next');
        }
    };

    /* 切换tag按钮*/
    $scope.changeTag = function (tagName) {
        $scope.tagSelect = tagName;
        switch (tagName) {
        case 'outputResult':
            $ocll.load('scripts/components/poi/ctrls/edit-tools/outputResultCtl').then(function () {
                $scope.tagContentTpl = '../../../scripts/components/poi/tpls/edit-tools/outputResultTpl.html';
            });
            break;
        case 'errorCheck':
            initCheckResultData();
            $ocll.load('scripts/components/poi/ctrls/edit-tools/errorCheckCtl').then(function () {
                $scope.tagContentTpl = '../../../scripts/components/poi/tpls/edit-tools/errorCheckTpl.html';
            });
            break;
        case 'searchResult':
            $ocll.load('scripts/components/poi/ctrls/edit-tools/searchResultCtl').then(function () {
                $scope.tagContentTpl = '../../../scripts/components/poi/tpls/edit-tools/searchResultTpl.html';
            });
            break;
        default:
            $ocll.load('scripts/components/poi/ctrls/edit-tools/checkResultCtl').then(function () {
                $scope.tagContentTpl = '../../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
            });
            break;
        }
    };

    /* 清空数据*/
    $scope.emptyTableResult = function (type) {
        if (type == 'outputResult') { // 输出结果
            dsOutput.clear();
        } else { // 搜索结果
            $scope.searchResultData = [];
            $scope.searchResultTotal = 0;
            $scope.searchPageNow = 1;
            $scope.searchPageTotal = 1;
        }
    };

    /**
     *  刷新检查
    */
    $scope.refreshCheckResult = function () {
        initCheckResultData();
    };
    /**
     * 接收刷新检查结果的事件
     */
    $scope.$on('refreshCheckResult', function (event, data) {
        initCheckResultData();
    });


    /**
     * 在线检查
     */
    $scope.checkUpResult = function () {
        var projectType = $scope.projectType; // poi或者道路,$scope.projectType字段来自于editroCtl.js中.
        var checkType;
        if (projectType == 1) {
            checkType = 0; // poi行编
        } else {
            checkType = 2; // 道路
        }
        dsEdit.runCheck(checkType).then(function (data) {
            if (data) {
                initCheckResultData();
            }
        });
    };

    /**
    * 查找检查结果
     */
    function getCheckResultData(num) {
        dsEdit.getCheckData(num).then(function (data) {
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
    }
    initCheckResultData();

    /* 初始化检查结果数据*/
    function initCheckResultData() {
        $scope.checkPageNow = 1; // 检查结果当前页
        getCheckResultData(1);
        $scope.outputResult = dsOutput.output; // 输出结果
    }
    /* 初始化搜索结果数据*/
    function initSearchResultData() {
        getSearchResultData(1);
    }

    /* 检查结果翻页*/
    $scope.$on('trunPaging', function (event, type) {
        if (type == 'prev') { // 上一页
            getCheckResultData($scope.checkPageNow - 1);
            $scope.checkPageNow--;
        } else { //  下一页
            getCheckResultData($scope.checkPageNow + 1);
            $scope.checkPageNow++;
        }
    });
    /* 搜索结果*/
    $scope.$on('getSearchResult', function (event, data) {
        $scope.searchResultData = data.rows;
        $scope.searchPageNow = 1; // 搜索结果当前页
        $scope.searchResultTotal = data.total;
        $scope.searchPageTotal = data.total > 0 ? Math.ceil(data.total / 5) : 1;
        $scope.tagSelect = 'searchResult';
        $scope.changeTag('searchResult');
    });


    // 翻页事件-搜索结果
    $scope.turnSearchPage = function (type) {
        // 上一页;
        if (type == 'prev') {
            $scope.searchPageNow -= 1;
        //  下一页;
        } else {
            $scope.searchPageNow += 1;
        }
        getSearchResultData($scope.searchPageNow);
    };

    // 判断默认显示哪个tab;
    function initShowTag() {
        $scope.searchResultTotal = 0;
        $scope.searchPageNow = 1;
        $scope.searchPageTotal = 1;
        $scope.tagSelect = 'outputResult';
        $scope.changeTag('outputResult');
    }

    /* 查找搜索结果*/
    function getSearchResultData(num) {
        var searchMapping = {
            道路Pid: 'linkPid',
            道路名称: 'rdName',
            'POI Pid': 'pid',
            POI名称: 'name'
        };
        dsEdit.getSearchData(num, searchMapping[$scope.searchResultParam[1]], $scope.searchResultParam[2]).then(function (data) {
            $scope.searchResultData = [];
            for (var i = 0, len = data.rows.length; i < len; i++) {
                $scope.searchResultData.push(new FM.dataApi.IxSearchResult(data.rows[i]));
            }
        });
    }

    initShowTag();
}]);
