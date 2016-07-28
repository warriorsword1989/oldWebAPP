/**
 * Created by wuzhen on 2016/7/24.
 * 警示信息面板
 */
angular.module('app').controller('warningInfoCtl', ['$scope','$timeout', 'dsEdit','appPath','$ocLazyLoad', function($scope,$timeout,dsEdit, appPath,$ocLazyLoad) {
    var eventCtrl = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var relationData = layerCtrl.getLayerById('relationData');

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
        '10201向左急弯路':'向左急弯路',
        '10202向右急弯路':'向右急弯路',
        '10301反向弯路(左)':'反向弯路(左)',
        '10302反向弯路(右)':'反向弯路(右)',
        '10401连续弯路':'连续弯路',
        '10501上陡坡':'上陡坡',
        '10502下陡坡':'下陡坡',
        '10601连续下坡':'连续下坡',
        '10701两侧变窄':'两侧变窄',
        '10702右侧变窄':'右侧变窄',
        '10703左侧变窄':'左侧变窄',
        '10801窄桥':'窄桥',
        '10901双向交通':'双向交通',
        '11001注意行人':'注意行人',
        '11101注意儿童':'注意儿童',
        '11201注意牲畜':'注意牲畜',
        '11301注意野生动物':'注意野生动物',
        '11401注意信号灯':'注意信号灯',
        '11501注意落石(左)':'注意落石(左)',
        '11502注意落石(右)':'注意落石(右)',
        '11601注意横风':'注意横风',
        '11701易滑':'易滑',
        '11801傍山险路(左)':'傍山险路(左)',
        '11802傍山险路(右)':'傍山险路(右)',
        '11901堤坝路(左)':'堤坝路(左)',
        '11902堤坝路(右)':'堤坝路(右)',
        '12001村庄':'村庄',
        '12101隧道':'隧道',
        '12201渡口':'渡口',
        '12301驼峰桥':'驼峰桥',
        '12401路面不平':'路面不平',
        '12501路面高凸':'路面高凸',
        '12601路面低洼':'路面低洼',
        '12701过水路面':'过水路面',
        '12801有人看守铁路道口':'有人看守铁路道口',
        '12901无人看守铁路道口':'无人看守铁路道口',
        '13001叉形符号':'叉形符号',
        '13101斜杠符号50米':'斜杠符号50米',
        '13102斜杠符号100米':'斜杠符号100米',
        '13103斜杠符号150米':'斜杠符号150米',
        '13201注意非机动车':'注意非机动车',
        '13301注意残疾人':'注意残疾人',
        '13401事故易发路段':'事故易发路段',
        '13501慢行':'慢行',
        '13601左右绕行':'左右绕行',
        '13602左侧绕行':'左侧绕行',
        '13603右侧绕行':'右侧绕行',
        '13701注意危险':'注意危险',
        '13702文字警示':'文字警示',
        '13703交通意外黑点':'交通意外黑点',
        '13801施工':'施工',
        '13901建议速度':'建议速度',
        '14001隧道开车灯':'隧道开车灯',
        '14101潮汐车道':'潮汐车道',
        '14201保持车距':'保持车距',
        '14301十字分离式道路':'十字分离式道路',
        '14302丁字分离式道路':'丁字分离式道路',
        '14401左侧汇入右侧合流':'左侧汇入右侧合流',
        '14402右侧汇入左侧合流':'右侧汇入左侧合流',
        '14501避险车道':'避险车道',
        '14502预告标志':'预告标志',
        '14503入口警告':'入口警告',
        '14601路面结冰':'路面结冰',
        '14602雨（雪）天':'雨（雪）天',
        '14603雾天':'雾天',
        '14604不利气象条件':'不利气象条件',
        '14701前方车辆排队信息':'前方车辆排队信息'
    };


    $scope.pageSize = 6;
    var typeCodeArr = [];//结果集

    $scope.initializeData = function(){
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        console.log(objCtrl.data.getIntegrate())
        $scope.rdWarningInfoObj = objCtrl.data;
        $scope.typeCodeImg = objCtrl.data.typeCode; //用于显示图片

    };

    /*点击选中的图片*/
    $scope.selectPicCode = function (code) {
        $scope.rdWarningInfoObj.typeCode = code.substr(0,5);//只取编号部分
        $scope.typeCodeImg = $scope.rdWarningInfoObj.typeCode;
        $scope.showImgData = false;
    };

    var validateTypeCode = function (){

    };
    var timer ;
    /*输入标牌类型*/
    $scope.showPicSelect = function () {
        if(timer){
            $timeout.cancel( timer );
        }
        timer = $timeout(function () {
            $scope.showImgData = true;
            $scope.showPicLoading = true;
            $scope.loadText = '数据搜素中。。。';

            var typeCode = $scope.rdWarningInfoObj.typeCode;
            if(typeCode==""){
                $scope.showImgData = false;
                return ;
            }
            typeCodeArr = [];
            for (var code in $scope.typeCodes){
                if(code.indexOf(typeCode)> -1){
                    typeCodeArr.push({
                        code:code,
                        name:$scope.typeCodes[code]
                    });
                }
            }
            $scope.picNowNum = 1;
            $scope.picTotal = parseInt((typeCodeArr.length + $scope.pageSize -1) /$scope.pageSize);//总页数

            if (typeCodeArr.length > 0){
                $scope.showPicLoading = false;
                combinaPictures();
            } else {
                $scope.loadText = '没有搜索到相关结果';
                $scope.pictures = [];
            }
            $timeout.cancel( timer );
        }, 100);
    };

    var combinaPictures = function (){
        var len = $scope.picNowNum * $scope.pageSize > typeCodeArr.length ? typeCodeArr.length : $scope.picNowNum * $scope.pageSize;
        $scope.pictures = [];
        for (var i = ($scope.picNowNum-1) * $scope.pageSize ; i < len;i ++){
            var srcCode = typeCodeArr[i].code.substr(0,5);
            $scope.pictures.push({
                src:'../../../images/road/warningInfo/'+srcCode+'.svg',
                code:typeCodeArr[i].code,
                fileName:typeCodeArr[i].name
            });
        }
    };

    $scope.picNext = function () {
        $scope.picNowNum += 1;
        combinaPictures();
    };
    $scope.picPre = function () {
        $scope.picNowNum -= 1;
        combinaPictures();
    };

    /*点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function (e) {
        $scope.showImgData = false;
    };

    function timeoutLoad() {
        $timeout(function() {
            $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function() {
                $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
                $ocLazyLoad.load('scripts/components/road/ctrls/attr_warninginfo_ctrl/carTypeCtrl').then(function() {
                    $scope.carPopoverURL = '../../../scripts/components/road/tpls/attr_warninginfo_tpl/carTypeTpl.html';
                });

                $timeout(function() {
                    $scope.$on('get-date', function(event, data) {
                        $scope.rdWarningInfoObj.timeDomain = data;
                    });
                    $timeout(function() {
                        $scope.$broadcast('set-code', $scope.rdWarningInfoObj.timeDomain);
                        $scope.$apply();
                    }, 100);
                }, 100);
            });
        });
    }
    //初始化时执行
    timeoutLoad();
    $scope.initializeData();


    $scope.cancel = function (){
    };

    // 保存数据
    $scope.save  = function () {
        console.info($scope.rdWarningInfoObj);
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        console.info(objCtrl.changedProperty);
        dsEdit.update($scope.rdWarningInfoObj.pid, "RDWARNINGINFO", objCtrl.changedProperty).then(function(data) {
            if (data) {
                relationData.redraw();

                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };
    // 删除数据
    $scope.del = function() {
    };
    /* start 事件监听 ********************************************************/
    eventCtrl.on(eventCtrl.eventTypes.SAVEPROPERTY, $scope.save); // 保存
    eventCtrl.on(eventCtrl.eventTypes.DELETEPROPERTY, $scope.del); // 删除
    eventCtrl.on(eventCtrl.eventTypes.CANCELEVENT, $scope.cancel); // 取消
    eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);