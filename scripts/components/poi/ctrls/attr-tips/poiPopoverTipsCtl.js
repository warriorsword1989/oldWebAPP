angular.module('app').controller('PoiPopoverTipsCtl', ['$scope', function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var evtCtrl = fastmap.uikit.EventController();

    function initPoiData() {
        $scope.poi = objCtrl.data;
    }
    initPoiData();
    /*初始化图片相关*/
    function initPhotos() {
        /*tips图片当前页数*/
        $scope.tipsPage = 1;
        /*当前选中图片*/
        $scope.nowActiveImg = $scope.poi.photos[0];
        $scope.nowActiveIndex = 0;
        if($scope.poi.photos.length){
            $scope.nowActiveIndex = 1;
        }
    }
    initData();

    function initData() {
        $scope.tempPhotos = [];
        /*if ($scope.poi.photos.length < 4) {
            for (var i = 0, len = 4 - $scope.poi.photos.length; i < len; i++) {
                $scope.tempPhotos.push(new FM.dataApi.IxPoiPhoto({
                    thumbnailUrl: '../../../images/road/img/noimg.png'
                }));
            }
        }*/
        initPhotos();
    }
    /*tips图片翻页*/
    $scope.turnTipsPage = function(type) {
        if (type == 1) { //上一页
            $scope.tipsPage--;
        } else { //下一页
            $scope.tipsPage++;
        }
        $scope.tipsBtnDisabled = $scope.tipsPage == Math.ceil($scope.poi.photos.length / 4);
    };
    /*更新图片数组*/
    $scope.$on('refreshImgsData', function(event, data) {
        initPoiData();
        initData();
        $scope.tipsBtnDisabled = $scope.tipsPage == Math.ceil($scope.poi.photos.length / 4);
    });
    /*数据状态*/
    $scope.recordObject = {
        0: '无',
        1: '新增',
        2: '删除',
        3: '修改'
    };
    /*审核状态*/
    $scope.statusObject = {
        1: '待作业',
        2: '已作业',
        3: '已提交'
    };
    /*照片标识*/
    $scope.photoTagOptions = [
        {id:1,label:'全貌'},
        {id:2,label:'水牌'},
        {id:3,label:'名称'},
        {id:4,label:'名片'},
        {id:5,label:'英文名'},
        {id:7,label:'产品全貌'},
        {id:100,label:'其他'}
    ];
    $scope.photoTagType = 1;
    /*查看图片*/
    $scope.showImage = function(img, index) {
        var temp = {
            img: img,
            index: index + 1
        }
        $scope.$broadcast('changeImgShow', temp);
        $scope.showImgModal = true;
    }
    /*预览active图片的缩略图*/
    $scope.showPreviewImg = function(img, index) {
        $scope.nowActiveImg = img;
        $scope.nowActiveIndex = index+1;
    };
    /*关闭tips事件*/
    $scope.closeTips = function() {
        $scope.showImgModal = false;
        $scope.$emit('closePopoverTips', false);
    };
    /*关闭tips图片事件*/
    $scope.$on('closeTipsImg', function(event, data) {
        initPhotos();
        $scope.showImgModal = false;
    });
    /*删除照片*/
    $scope.deletePhoto = function(activePhoto){
        for (var i = 0, len = $scope.poi.photos.length; i < len; i++) {
            if($scope.poi.photos[i].fccPid == activePhoto.fccPid){
                $scope.poi.photos.splice(i,1);
                initData();
                return;
            }
        }
    };
    // evtCtrl.rebindEvent = evtCtrl.rebindEvent || {};
    // evtCtrl.rebindEvent["tipsTplContainer"] = function() {
    //     evtCtrl.off(evtCtrl.eventTypes.SELECTBYATTRIBUTE);
    evtCtrl.on(evtCtrl.eventTypes.SELECTBYATTRIBUTE, function(data) {
        if (data.feature && data.feature.geoLiveType == "IX_POI") {
            initPoiData();
        }
    });
    // };
}])/*.directive('image404', function() { //图片404时显示默认图片
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var notFoundCount = 0;
            if (!attributes.src) {
                changeSCR();
            }
            element.on('error', changeSCR);

            function changeSCR() {
                var newIamgeUrl = attributes.image404;
                if (notFoundCount >= 3 || !newIamgeUrl) {
                    newIamgeUrl = getDefaultImagePlaceholder();
                }
                element.attr('src', newIamgeUrl);
                notFoundCount++;
            }

            function getDefaultImagePlaceholder() {
                var width = angular.element(element[0]).attr('max-width') || element[0].offsetWidth || 120;
                var height = angular.element(element[0]).attr('max-height') || element[0].offsetHeight || 120;
                var bgcolor = attributes.fbBgcolor ? attributes.fbBgcolor.replace('#', '') : "";
                var color = attributes.fbColor ? attributes.fbColor.replace('#', '') : "";
                var text = attributes.fbText || "";
                var result = '';
                var protocol = window.location.href.split('://').shift();
                if (!protocol) protocol = 'http';
                result = protocol + '://dummyimage.com/' + width + 'x' + height;
                if (bgcolor && color) {
                    result += '/' + bgcolor + '/' + color;
                }
                if (text) {
                    result += '&text=' + text;
                }
                return result;
            }
        }
    }
})*/;
