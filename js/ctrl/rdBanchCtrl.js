/**
 * Created by liuzhaoxia on 2015/12/10.
 */
//var otherApp=angular.module("lazymodule", []);
var otherApp=angular.module("rdBanchApp", []);
otherApp.controller("rdBranchController",function($scope){


    $scope.branchTypeOptions=[
        {"id": 0, "label": "0 高亮分歧(无名称)"},
        {"id": 1, "label": "1 方面分歧"},
        {"id": 2, "label": "2 IC分歧"},
        {"id": 3, "label": "3 3D分歧"},
        {"id": 4, "label": "4 复杂路口模式图"}
    ];

    $scope.estabTypeOptions=[
        {"id":0,"label":"0 默认"},
        {"id": 1, "label": "1 出口"},
        {"id": 2, "label": "2 入口"},
        {"id": 3, "label": "3 SA"},
        {"id": 4, "label": "4 PA"},
        {"id": 5, "label": "5 JCT"},
        {"id": 9, "label": "9 不应用"}
    ];

    $scope.nameKindOptions=[
        {"id":0,"label":"0 默认"},
        {"id":1,"label":"1 IC"},
        {"id":2,"label":"2 SA"},
        {"id":3,"label":"3 PA"},
        {"id":4,"label":"4 JCT"},
        {"id":5,"label":"5 出口"},
        {"id":6,"label":"6 入口"},
        {"id":7,"label":"7 RAMP"},
        {"id":8,"label":"8 出入口"},
        {"id": 9, "label": "9 不应用"}

    ];
    $scope.voiceDirOptions=[
        {"id":0,"label":"0 无"},
        {"id": 2, "label": "2 右"},
        {"id": 5, "label": "5 左"},
        {"id": 9, "label": "9 不应用"}
    ];

    $scope.guideCodeOptions=[
        {"id":0,"label":"0 无向导"},
        {"id": 1, "label": "1 高架向导"},
        {"id": 2, "label": "2 Underpath向导"},
        {"id": 3, "label": "3 未调查"},
        {"id": 9, "label": "9 不应用"}
    ];

    $scope.codeTypeOptions=[
        {"id":0,"label":"0 无"},
        {"id":1,"label":"1 普通路名"},
        {"id":2,"label":"2 设施名"},
        {"id":3,"label":"3 高速道路名"},
        {"id":4,"label":"4 国家高速编号"},
        {"id":5,"label":"5 国道编号"},
        {"id":6,"label":"6 省道编号"},
        {"id":7,"label":"7 县道编号"},
        {"id":8,"label":"8 乡道编号"},
        {"id": 9, "label": "9 专用道编号"},
        {"id": 10, "label": "10 省级高速编号"}

    ];

})