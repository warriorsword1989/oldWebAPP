angular.module('app').controller('PoiPopoverTipsCtl', ['$scope', function($scope) {
    $scope.poi.photos.push(new FM.dataApi.IxPoiPhoto({
        thumbnailUrl:'http://192.168.4.189/resources/photo/15win/2016013086/20160408/292520160408100333_13086.jpg',
        originUrl:'http://192.168.4.189/resources/photo/15win/2016013086/20160408/292520160408100333_13086.jpg'
    }));
    $scope.poi.photos.push(new FM.dataApi.IxPoiPhoto({
        thumbnailUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160408/292520160408095316_81341.png?t=0.908229194341623',
        originUrl:'http://192.168.4.189/resources/photo//15win/2016013086/20160408/292520160408095316_81341.png?t=0.908229194341623'
    }));
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
    }
    /*更新图片数组*/
    $scope.$on('refreshImgsData',function(event,data){
        initData();
    });
    /*记录状态*/
    $scope.statusObject = {
        0:'无',
        1:'删除',
        2:'修改',
        3:'新增'
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
    /*关闭tips事件*/
    $scope.closeTips = function(){
        $scope.showImgModal = false;
        $scope.$emit('closePopoverTips',false);
    }
    /*关闭tips图片事件*/
    $scope.$on('closeTipsImg',function(event,data){
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