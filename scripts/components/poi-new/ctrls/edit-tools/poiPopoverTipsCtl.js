angular.module('app').controller('PoiPopoverTipsCtl', ['$scope','$uibModal','$ocLazyLoad', function($scope,$uibModal,$ocll) {
    initData();
    function initData(){
        // console.log($scope.poi.attachmentsImage)
        if($scope.poi.attachmentsImage.length < 4){
            for(var i=0,len=4-$scope.poi.attachmentsImage.length;i<len;i++){
                $scope.poi.attachmentsImage.push({
                    url:'../../../images/road/img/noimg.png'
                });
            }
        }
    }
    /*查看图片*/
    $scope.showImage = function(img){
        $ocll.load('scripts/components/poi-new/ctrls/edit-tools/showTipsPicCtl').then(function () {
            console.log(img)
            $uibModal.open({
                animation: true,
                templateUrl: 'tipsModalContent',
                controller: 'ShowTipsPicCtl',
                backdrop:false,
                resolve: {
                    $image: function () {
                        return img;
                    }
                }
            });
        });
    }
    /*关闭tips事件*/
    $scope.closeTips = function(){
        $scope.$emit('closePopoverTips',true);
    }
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