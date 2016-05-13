angular.module('app').controller('FileUploadCtl', ['$scope', 'FileUploader', function($scope,FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        url: App.Config.serviceUrl+'/editsupport/poi/uploadresource?access_token='+App.Config.accessToken,
        formData:[{'filetype':'photo','projectId':2016013086}]
    });

    // FILTERS

    uploader.filters.push({
        name: 'fileFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|m4a'.indexOf(type) !== -1;
        }
    });

    /*判断filetype*/
    function chargeFileType(file){
        if(file.type.indexOf('image') > -1){
            uploader.formData[0].filetype = 'photo';
        }else{
            uploader.formData[0].filetype = 'audio';
        }
    }

    // CALLBACKS
    /*添加上传文件失败*/
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        chargeFileType(item.file);
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
}]);