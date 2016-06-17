angular.module('app').controller('PoiPopoverTipsCtl', ['$scope', function($scope) {
    $scope.poi.photos.push(new FM.dataApi.IxPoiPhoto({
        thumbnailUrl:'http://192.168.4.189/resources/photo/15win/2016013086/20160408/292520160408100333_13086.jpg',
        originUrl:'http://192.168.4.189/resources/photo/15win/2016013086/20160408/292520160408100333_13086.jpg'
    }));
    $scope.poi.photos.push(new FM.dataApi.IxPoiPhoto({
        thumbnailUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160408/292520160408095316_81341.png?t=0.908229194341623',
        originUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160408/292520160408095316_81341.png?t=0.908229194341623'
    }));
    $scope.poi.photos.push(new FM.dataApi.IxPoiPhoto({
        thumbnailUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160408/292520160408095024_27853.png?t=0.27135223066014236',
        originUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160408/292520160408095024_27853.png?t=0.27135223066014236'
    }));
    $scope.poi.photos.push(new FM.dataApi.IxPoiPhoto({
        thumbnailUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160408/292520160408094938_37544.png?t=0.757342256295586',
        originUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160408/292520160408094938_37544.png?t=0.757342256295586'
    }));
    $scope.poi.photos.push(new FM.dataApi.IxPoiPhoto({
        thumbnailUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160512/292520160512171549_23501.png?t=0.7994319534547933',
        originUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160512/292520160512171549_23501.png?t=0.7994319534547933'
    }));
    $scope.poi.photos.push(new FM.dataApi.IxPoiPhoto({
        thumbnailUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160311/292520160311135852_42381.jpg?t=0.0009477164371798352',
        originUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160311/292520160311135852_42381.jpg?t=0.0009477164371798352'
    }));
    /*初始化图片相关*/
    function initPhotos (){
        /*tips图片当前页数*/
        $scope.tipsPage = 1;
        /*当前选中图片*/
        $scope.nowActiveImg = $scope.poi.photos[0];
        $scope.nowActiveIndex = 0;
    }
    initData();

    function initData(){
        $scope.tempPhotos = [];
        if($scope.poi.photos.length < 4){
            for(var i=0,len=4-$scope.poi.photos.length;i<len;i++){
                $scope.tempPhotos.push(new FM.dataApi.IxPoiPhoto({
                    thumbnailUrl:'../../../images/road/img/noimg.png'
                }));
            }
        }
        initPhotos();
    }
    /*tips图片翻页*/
    $scope.turnTipsPage = function(type){
        if(type == 1){  //上一页
            $scope.tipsPage--;
        }else{      //下一页
            $scope.tipsPage++;
        }
        $scope.tipsBtnDisabled = $scope.tipsPage == Math.ceil($scope.poi.photos.length/4);
    };
    /*更新图片数组*/
    $scope.$on('refreshImgsData',function(event,data){
        initData();
    });
    /*数据状态*/
    $scope.stateObject = {
        0:'无',
        1:'删除',
        2:'修改',
        3:'新增'
    };
    /*审核状态*/
    $scope.statusObject = {
        1:'待作业',
        2:'已作业',
        3:'已提交'
    };
    /*查看图片*/
    $scope.showImage = function(img,index){
            var temp = {
                img:img,
                index:index+1
            }
            $scope.$broadcast('changeImgShow',temp);
            $scope.showImgModal = true;
    }
    /*预览active图片的缩略图*/
    $scope.showPreviewImg = function(img,index){
        $scope.nowActiveImg = img;
        $scope.nowActiveIndex = index;
    };
    /*关闭tips事件*/
    $scope.closeTips = function(){
        $scope.showImgModal = false;
        $scope.$emit('closePopoverTips',false);
    };
    /*关闭tips图片事件*/
    $scope.$on('closeTipsImg',function(event,data){
        initPhotos();
        $scope.showImgModal = false;
    });
}]).directive('image404', function(){   //图片404时显示默认图片
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var notFoundCount = 0;
            if(!attributes.src) {
                changeSCR();
            }
            element.on('error', changeSCR);
            function changeSCR(){
                var newIamgeUrl = attributes.image404;
                if(notFoundCount >= 3 || !newIamgeUrl) {
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
                if(!protocol) protocol = 'http';
                result = protocol + '://dummyimage.com/' + width + 'x' + height;
                if(bgcolor && color) {
                    result += '/' + bgcolor + '/' + color;
                }
                if(text) {
                    result += '&text=' + text;
                }
                return result;
            }
        }
    }
});