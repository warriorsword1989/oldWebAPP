/**
 * Created by liwanchong on 2016/3/9.
 */
var showDirectApp = angular.module("mapApp", []);
showDirectApp.controller("showDirectOfConnexity",function($scope) {
    $scope.laneConnexityData = [
        {flag: "a", log: "直"},
        {flag: "b", log: "左"},
        {flag: "c", log: "右"},
        {flag: "d", log: "调"},
        {flag: "e", log: "直调"},
        {flag: "f", log: "直右"},
        {flag: "g", log: "直左"},
        {flag: "h", log: "左直右"},
        {flag: "i", log: "调直右"},
        {flag: "j", log: "调左值"},
        {flag: "k", log: "左右"},
        {flag: "i", log: "调右"},
        {flag: "m", log: "调左右"},
        {flag: "n", log: "调右"},
        {flag: "o", log: "空"}
    ];
})