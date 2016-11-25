/**
 * Created by zhaohang on 2016/11/24.
 */
angular.module('webeditor').controller('roadLeftPanelCtrl', ['$scope',
  function ($scope) {
    // 获取road的照片list组成如下数组格式，如果照片个数小于5张，用images\newRoad\leftPanelIcon\no-photo.png，填充个数
    var testList = [
      { src: '../../../../images/newPoi/leftPanelIcon/menu-restaurant-vintage-table.jpg', id: 0 },
      { src: '../../../../images/newPoi/leftPanelIcon/pexels-photo-25177.jpg', id: 1 },
      { src: '../../../../images/newRoad/leftPanelIcon/no_photo.png', id: 2 },
      { src: '../../../../images/newRoad/leftPanelIcon/no_photo.png', id: 3 },
      { src: '../../../../images/png/scenelist.png', id: 4 },
      { src: '../../../../images/png/login.png', id: 5 }
    ];
    // 获取road的音频list组成如下数组格式，如果音频个数小于5，用images\newRoad\leftPanelIcon\photo_no_audio.png，填充个数
    var testAudioList = [
      { flag: true, id: 0 },
      { flag: true, id: 1 },
      { flag: true, id: 2 },
      { flag: true, id: 3 },
      { flag: true, id: 4 },
      { flag: false, id: 5 }
    ];
    $scope.bigImgSrc = {};
    $scope.imgSrcList = [];
    $scope.audioSrcList = [];
    // 初始化界面显示的大图片和缩略图
    $scope.setimgSrcList = function () {
      $scope.imgSrcList = testList.slice(0, 5);
      $scope.audioSrcList = testAudioList.slice(0, 5);
      $scope.bigImgSrc = testList[0];
    };
    // 点击缩略图，更换大图片
    $scope.changeBigImg = function (data) {
      $scope.bigImgSrc = data;
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
      if ($scope.imgSrcList[4].id < testList.length - 1) {
        $scope.imgSrcList.push(testList[$scope.imgSrcList[4].id + 1]);
        $scope.imgSrcList.shift();
      }
    };
    // 上一个音频
    $scope.lastAudio = function () {
      if ($scope.audioSrcList[0].id > 0) {
        $scope.audioSrcList.unshift(testAudioList[$scope.audioSrcList[0].id - 1]);
        $scope.audioSrcList.pop();
      }
    };
    // 下一个音频
    $scope.nextAudio = function () {
      if ($scope.audioSrcList[4].id < testAudioList.length - 1) {
        $scope.audioSrcList.push(testAudioList[$scope.audioSrcList[4].id + 1]);
        $scope.audioSrcList.shift();
      }
    };
    $scope.setimgSrcList();
  }
]);
