angular.module('app').controller('OutputResultCtl', ['$scope', function($scope) {

    $scope.theadInfo = ['操作','类型','编号'];

    $scope.outputResult = [
        new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
        new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
        new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
        new FM.dataApi.IxOutput({type:'RDNODE',pid:100004351,childPid:"",op:"删除"}),
        new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"})
    ];
}]);