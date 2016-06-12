angular.module('app').controller('PoiPopoverTipsCtl', ['$scope', function($scope) {
    initData();
    function initData(){
        if($scope.poi.tempPhotos.length < 4){
            for(var i=0,len=4-$scope.poi.tempPhotos.length;i<len;i++){
                $scope.poi.tempPhotos.push(new FM.dataApi.IxPoiPhoto({
                    url:'../../../images/road/img/noimg.png',
                    nothing:true
                }));
            }
        }
    }
    /*更新图片数组*/
    $scope.$on('refreshImgsData',function(event,data){
        console.log(data)
        $scope.poi.tempPhotos = data;
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
        if(img.nothing == false){
            var temp = {
                img:img,
                index:index+1
            }
            $scope.$broadcast('changeImgShow',temp);
            $scope.showImgModal = true;
        }
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