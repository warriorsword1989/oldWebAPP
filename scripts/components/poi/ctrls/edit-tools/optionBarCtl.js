angular.module('app').controller('OptionBarCtl', ['$scope', '$ocLazyLoad', 'dsOutput','dsEdit', function($scope, $ocll, dsOutput,dsEdit) {
    /*翻页事件*/
    $scope.turnPage = function(type){
        if(type == 'prev'){     //上一页
            $scope.$emit('trunPaging','prev');
        }else{      //  下一页
            $scope.$emit('trunPaging','next');
        }
    }
    /*编辑关联poi数据*/
    $scope.$on('editPoiInfo', function (event, data) {
        refreshPoiData(data);
    });
    /*改变poi父子关系*/
    $scope.$on('changeRelateParent', function (event, data) {
        $scope.poi.relateParent = data;
    });
    /*切换tag按钮*/
    $scope.changeTag = function (tagName) {
        $scope.tagSelect = tagName;
        switch (tagName) {
            case 'outputResult':
                $ocll.load('scripts/components/poi/ctrls/edit-tools/outputResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi/tpls/edit-tools/outputResultTpl.html';
                });
                break;
            case 'errorCheck':
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
    /*清空数据*/
    $scope.emptyTableResult = function(type){
        if(type == 'outputResult'){     //输出结果
            dsOutput.clear();
        }else{      //搜索结果

        }
    };
    /*刷新检查*/
    $scope.refreshCheckResult = function(){
        initCheckResultData();
    };

    /**
     * 在线检查
     */
    $scope.checkUpResult = function(){
        var projectType = $scope.projectType; //poi或者道路,$scope.projectType字段来自于editroCtl.js中.
        var checkType;
        if(projectType == 1){
            checkType = 0; //poi行编
        } else {
            checkType = 2; //道路
        }
        dsEdit.runCheck(checkType).then(function(data){
           if(data){
               initCheckResultData();
           }
        });
    };
    /*查找检查结果*/
    function getCheckResultData(num){
        dsEdit.getCheckDataCount(num).then(function(data){
            $scope.checkResultData = [];
            for(var i=0,len=data.length;i<len;i++){
                $scope.checkResultData.push(new FM.dataApi.IxCheckResult(data[i]));
            }
        });
    };
    initCheckResultData();
    /*查找检查结果总数*/
    dsEdit.getCheckDataCount().then(function(data){
        $scope.checkResultTotal = data;
        $scope.checkPageTotal = data.length > 0 ? Math.ceil(data/5):1;
    });
    /*初始化检查结果数据*/
    function initCheckResultData(){
        $scope.checkPageNow = 1;//检查结果当前页
        getCheckResultData(1);
        $scope.outputResult = dsOutput.output; //输出结果
    }
    /*检查结果翻页*/
    $scope.$on('trunPaging',function(event,type){
        if(type == 'prev'){     //上一页
            getCheckResultData($scope.checkPageNow-1);
            $scope.checkPageNow--;
        }else{      //  下一页
            getCheckResultData($scope.checkPageNow+1);
            $scope.checkPageNow++;
        }
    });
    /*判断默认显示哪个tab*/
    function initShowTag(){
        $scope.tagSelect = 'outputResult';
        $scope.changeTag('outputResult');
    }
    initShowTag();
}]);