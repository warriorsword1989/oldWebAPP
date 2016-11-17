/**
 * Created by zhaohang on 2016/11/8.
 */
angular.module('webeditor').controller('poiLeftPanelCtrl', ['$scope',
    function ($scope) {
      //获取poi的照片list组成如下数组格式，如果照片个数小于4张，用images\newPoi\leftPanelIcon\no-photo.png，填充个数
        var testList = [
      { src: '../../../../images/png/botai.jpg', id: 0 },
      { src: '../../../../images/png/cj.png', id: 1 },
      { src: '../../../../images/png/del.png', id: 2 },
      { src: '../../../../images/png/rlist.png', id: 3 },
      { src: '../../../../images/png/scenelist.png', id: 4 },
      { src: '../../../../images/png/login.png', id: 5 }
        ];
        $scope.bigImgSrc = {};
        $scope.imgSrcList = [];
        $scope.bigImgRoate = 0;
        $scope.bigImgStyle = {};
    // 初始化界面显示的大图片和缩略图
        $scope.setimgSrcList = function () {
            $scope.imgSrcList = testList.slice(0, 4);
            $scope.bigImgSrc = testList[0];
            $scope.bigImgStyle = {
                width: 'auto',
                height: 'auto',
                'max-height': '100%',
                'max-width': '100%',
                transform: 'rotate(' + $scope.bigImgRoate + 'deg)'
            };
        };
    // 点击缩略图，更换大图片
        $scope.changeBigImg = function (data) {
            $scope.bigImgRoate = 0;
            $scope.bigImgSrc = data;
            $scope.bigImgStyle = {
                width: 'auto',
                height: 'auto',
                'max-height': '100%',
                'max-width': '100%',
                transform: 'rotate(' + $scope.bigImgRoate + 'deg)'
            };
        };
    // 旋转图片
        $scope.rotateBigImg = function (rotate) {
            $scope.bigImgRoate = $scope.bigImgRoate + rotate;
            $scope.bigImgStyle = {
                width: 'auto',
                height: 'auto',
                'max-height': '100%',
                'max-width': '100%',
                transform: 'rotate(' + $scope.bigImgRoate + 'deg)'
            };
        };
    // 上一个缩略图
        $scope.lastImg = function () {
            if ($scope.imgSrcList[0].id > 0) {
                $scope.imgSrcList.unshift(testList[$scope.imgSrcList[0].id - 1]);
                $scope.imgSrcList.pop();
            }
        };
    // 下一个缩略图
        $scope.nextImg = function () {
            if ($scope.imgSrcList[3].id < testList.length - 1) {
                $scope.imgSrcList.push(testList[$scope.imgSrcList[3].id + 1]);
                $scope.imgSrcList.shift();
            }
        };
        $scope.setimgSrcList();
    }
]).directive('imgShow', function () {
    return {
        link: function (scope, element, attr) {
            wheelzoom(element);
        }
    };
});
