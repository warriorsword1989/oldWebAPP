angular.module('app').controller('OptionBarCtl', ['$scope', '$ocLazyLoad', 'dsPoi', function($scope, $ocll,dsPoi) {
    /*翻页事件*/
    $scope.turnPage = function(type){
        if(type == 'prev'){     //上一页
            $scope.$emit('trunPaging','prev');
        }else{      //  下一页
            $scope.$emit('trunPaging','next');
        }
    }
    var distinguishResult = function (data) {
        $scope.outputResult = [
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDNODE',pid:100004351,childPid:"",op:"删除"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDNODE',pid:100004351,childPid:"",op:"删除"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDNODE',pid:100004351,childPid:"",op:"删除"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDNODE',pid:100004351,childPid:"",op:"删除"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
        ];
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
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/outputResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/outputResultTpl.html';
                });
                break;
            case 'errorCheck':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/errorCheckCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/errorCheckTpl.html';
                });
                break;
            case 'searchResult':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/searchResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/searchResultTpl.html';
                });
                break;
            default:
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/checkResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/checkResultTpl.html';
                });
                break;
        }
    };
    /*清空数据*/
    $scope.emptyTableResult = function(type){
        if(type == 'outputResult'){     //输出结果
            $scope.outputResult = [];
        }else{      //搜索结果

        }
    };
    /*刷新检查*/
    $scope.refreshCheckResult = function(){
        initCheckResultData();
    };

    /*查找检查结果*/
    function getCheckResultData(num){
        dsPoi.getCheckData(num).then(function(data){
            $scope.checkResultData = [];
            for(var i=0,len=data.length;i<len;i++){
                $scope.checkResultData.push(new FM.dataApi.IxCheckResult(data[i]));
            }
        });
    };
    initCheckResultData();
    /*查找检查结果总数*/
    dsPoi.getCheckDataCount().then(function(data){
        $scope.checkResultTotal = data;
        $scope.checkPageTotal = Math.ceil(data/5);
    });
    /*初始化检查结果数据*/
    function initCheckResultData(){
        $scope.checkPageNow = 1;//检查结果当前页
        getCheckResultData(1);
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