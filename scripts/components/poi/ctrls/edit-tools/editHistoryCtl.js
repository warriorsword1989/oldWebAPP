angular.module('app',['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('EditHistoryCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', function($scope, $ocll, $rs, $q, poi) {
    $scope.theadInfo = ['序号','作业员','操作时间','操作描述','平台'];
    $scope.$on("editHistoryData", function(event, data) {
        $scope.editHistory = [];
        if(data.historyData){
            /*重组履历数据*/
            for(var i=0,len=data.historyData.mergeContents.length;i<len;i++){
                var hisTemp = {};
                hisTemp.name = data.historyData.operator.name;
                hisTemp.mergeDate = FM.Util.dateFormat(data.historyData.mergeDate);
                hisTemp.sourceName = FM.dataApi.Constant.CODE_SOURCE_NAME[data.historyData.sourceName];
                hisTemp.operDesc = getOperDesc(FM.Util.stringToJson(data.historyData.mergeContents[i].oldValue));
                $scope.editHistory.push(hisTemp);
            }
            /*解析操作描述*/
            function getOperDesc(oldContent){
                var oldVal,
                    msg;
                for(var attr in oldContent){
                    msg = '修改了【'+FM.dataApi.Constant.CODE_NAME_MAPPING[attr]+'】';
                    if(!oldContent[attr]){
                        oldVal = '（空）';
                    }else{
                        if (attr == "kindCode") {
                            oldVal = kindName(oldContent[kk]);
                        } else if (attr == "open24H") {
                            oldVal = oldContent[attr] == 2 ? "否" : "是";
                        } else {
                            oldVal = oldContent[attr];
                        }
                    }
                    msg += '，修改前：' + oldVal;
                }
                return msg;
            }
            function kindName(kindCode) {
                var tmp = data.kindFormat[kindCode];
                if (tmp) {
                    return tmp.kindName;
                } else {
                    return kindCode;
                }
            }
        }
    });
}]);
