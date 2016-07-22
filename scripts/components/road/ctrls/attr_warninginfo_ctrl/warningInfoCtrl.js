angular.module('app').controller('warningInfoCtl', ['$scope','$timeout', 'dsEdit','appPath', function($scope,$timeout,dsEdit, appPath) {
    var eventCtrl = fastmap.uikit.EventController();

    $scope.typeCodes = {
        '10101交叉路口a':'交叉路口a',
        '10102交叉路口b':'交叉路口b',
        '10103交叉路口c':'交叉路口c',
        '10104交叉路口d':'交叉路口d',
        '10105交叉路口e':'交叉路口e',
        '10106交叉路口f':'交叉路口f',
        '10107交叉路口g':'交叉路口g',
        '10108交叉路口h':'交叉路口h',
        '10109交叉路口i':'交叉路口i',
        '10110交叉路口j':'交叉路口j',
        '10201':'向左急弯路',
        '10202':'向右急弯路',
        '10301':'反向弯路(左)',
        '10302':'反向弯路(右)',
        '10401':'连续弯路',
        '10501':'上陡坡',
        '10502':'下陡坡',
        '10601':'连续下坡',
        '10701':'两侧变窄',
        '10702':'右侧变窄',
        '10703':'左侧变窄',
        '10801':'窄桥',
        '10901':'双向交通',
        '11001':'注意行人',
        '11101':'注意儿童',
        '11201':'注意牲畜',
        '11301':'注意野生动物',
        '11401':'注意信号灯',
        '11501':'注意落石(左)',
        '11502':'注意落石(右)',
        '11601':'注意横风',
        '11701':'易滑',
        '11801':'傍山险路(左)',
        '11802':'傍山险路(右)',
        '11901':'堤坝路(左)',
        '11902':'堤坝路(右)',
        '12001':'村庄',
        '12101':'隧道',
        '12201':'渡口',
        '12301':'驼峰桥',
        '12401':'路面不平',
        '12501':'路面高凸',
        '12601':'路面低洼',
        '12701':'过水路面',
        '12801':'有人看守铁路道口',
        '12901':'无人看守铁路道口',
        '13001':'叉形符号',
        '13101':'斜杠符号50米',
        '13102':'斜杠符号100米',
        '13103':'斜杠符号150米',
        '13201':'注意非机动车',
        '13301':'注意残疾人',
        '13401':'事故易发路段',
        '13501':'慢行',
        '13601':'左右绕行',
        '13602':'左侧绕行',
        '13603':'右侧绕行',
        '13701':'注意危险',
        '13702':'通用警示',
        '13703':'交通意外黑点',
        '13801':'施工',
        '13901':'建议速度',
        '14001':'隧道开车灯',
        '14101':'潮汐车道',
        '14201':'保持车距',
        '14301':'十字分离式道路',
        '14302':'丁字分离式道路',
        '14401':'左侧汇入右侧合流',
        '14402':'右侧汇入左侧合流',
        '14501':'避险车道',
        '14502':'预告标志',
        '14503':'入口警告',
        '14601':'路面结冰',
        '14602':'雨（雪）天',
        '14603':'雾天',
        '14604':'不利气象条件',
        '14701':'前方车辆排队信息'
    };

    $scope.rdWarningInfoObj = {};
    $scope.rdWarningInfoObj.typeCode = 10101;

    /*点击选中的图片*/
    $scope.selectPicCode = function (code) {
        $scope.diverObj.signboards[0].arrowCode = code;
        $scope.diverObj.signboards[0].backimageCode = '0' + $.trim($scope.diverObj.signboards[0].arrowCode).substr(1);
        $scope.arrowMapShow = $scope.getArrowPic(code);
        $scope.backimageCodeSrc = $scope.getArrowPic($scope.diverObj.signboards[0].backimageCode);
        $scope.showImgData = false;
        oldPatCode = $scope.diverObj.signboards[0].backimageCode;
    };

    var validateTypeCode = function (){

    };
    var timer ;
    /*输入标牌类型*/
    $scope.showPicSelect = function () {
        $scope.showImgData = true;
        $scope.showPicLoading = true;
        $scope.loadText = '数据搜素中。。。';
        if(timer){
            $timeout.cancel( timer );
        }
        timer = $timeout(function () {
            console.info("文综");
            var typeCode = $scope.rdWarningInfoObj.typeCode;
            console.info(typeCode);
            var typeCodeArr = [];
            for (var code in $scope.typeCodes){
                if(code.indexOf(typeCode)> -1){
                    typeCodeArr.push({
                        code:$scope.typeCodes[code]
                    });
                }
            }
            if (typeCodeArr.length > 0){
                $scope.showPicLoading = false;
                $scope.pictures = [];
                for (var i = 0 , len = typeCodeArr.length ; i < len;i ++){
                    $scope.pictures.push({
                        fileContent:'../../../images/road/1301/1301_0_0.svg',
                        fileName:typeCodeArr[i].code
                    });
                }

            } else {
                $scope.loadText = '没有搜索到相关结果';
                $scope.pictures = [];
            }
            // if ($.trim($scope.diverObj.signboards[0].arrowCode).length > 0) {
            //     $scope.diverObj.signboards[0].backimageCode = '0' + $.trim($scope.diverObj.signboards[0].arrowCode).substr(1);
            //     $scope.picNowNum = 1;
            //     $scope.getPicsData();
            //     $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.signboards[0].arrowCode);
            //     $scope.backimageCodeSrc = $scope.getArrowPic($scope.diverObj.signboards[0].backimageCode);
            //     if ($.trim($scope.diverObj.signboards[0].arrowCode) == '') {
            //         $scope.showImgData = false;
            //     } else {
            //         $scope.showImgData = true;
            //     }
            //     $scope.$apply();
            // }
            $timeout.cancel( timer );
        }, 500);
    };

    /*点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function (e) {
        $scope.showImgData = false;
    };


    $scope.cancel = function (){
        console.info("cancel");
    };

    // 保存数据
    $scope.save  = function () {
        console.info("save");
    };
    // 删除数据
    $scope.del = function() {
        console.info("del");
    };
    /* start 事件监听 ********************************************************/
    eventCtrl.on(eventCtrl.eventTypes.SAVEPROPERTY, $scope.save); // 保存
    eventCtrl.on(eventCtrl.eventTypes.DELETEPROPERTY, $scope.del); // 删除
    eventCtrl.on(eventCtrl.eventTypes.CANCELEVENT, $scope.cancel); // 取消
    eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, $scope.initData); // 数据切换
}]);