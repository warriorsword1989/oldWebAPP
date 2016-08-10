/**
 * Created by wangmingdong on 2016/8/10.
 */

var tollApp = angular.module("app");
tollApp.controller("TollGatePassageCtl", ['$scope', 'dsEdit', function ($scope, dsEdit) {
	var objCtrl = fastmap.uikit.ObjectEditController();
	$scope.tollGatePassage = objCtrl.passageInfo;


	/*领卡类型*/
	$scope.cardTypeObj = [
		{id:0,label:'未调查',name:'未调查'},
		{id:1,label:'ETC',name:'ETC通道'},
		{id:2,label:'人工',name:'人工通道'},
		{id:3,label:'自助',name:'自助通道'}
	];

	/*收费方式*/
	$scope.tollFormObj = [
		{id:0,label:'ETC'},
		{id:1,label:'现金'},
		{id:2,label:'银行卡（借记卡）'},
		{id:3,label:'信用卡'},
		{id:4,label:'IC卡'},
		{id:5,label:'预付卡'}
	];
	$scope.$on('refreshTollgateName',function(data){
		$scope.tollGatePassage = objCtrl.passageInfo;
	});
}]);