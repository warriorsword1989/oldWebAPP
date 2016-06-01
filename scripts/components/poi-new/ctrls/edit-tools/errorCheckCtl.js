angular.module('app').controller('ErrorCheckCtl', ['$scope', function($scope) {

    $scope.theadInfo = ['检查规则号','错误等级','错误对象','错误信息','检查时间','作业员','检查管理'];
    $scope.errorCheckData = [{"id": "ef9be156fb6e58aabefbaa88c130eb04",
            "ruleid": "GLM56004",
            "rank": 1,
            "targets": "[RD_LINK,100005324]",
            "information": "修形中产生自相交，要提示立交或打断",
            "geometry": "(116.48112,40.01554)",
            "create_date": "2016-05-31 13:53:46",
            "worker": "TEST"
        },
        {
            "id": "03aa39d0fea15a8e3d5b402869a980d1",
            "ruleid": "SHAPING_CHECK_CROSS_RDLINK_RDLINK",
            "rank": 1,
            "targets": "[RD_LINK,100005324]",
            "information": "两条Link相交，必须做立交或者打断",
            "geometry": "(116.48263,40.01585)",
            "create_date": "2016-05-31 13:53:46",
            "worker": "TEST"
        },
        {
            "id": "1ee57e22921da83bf212353956356a2f",
            "ruleid": "GLM56004",
            "rank": 1,
            "targets": "[RD_LINK,100005253]",
            "information": "修形中产生自相交，要提示立交或打断",
            "geometry": "(116.375,40.0031)",
            "create_date": "2016-05-31 08:58:39",
            "worker": "TEST"
        },
        {
            "id": "c7430b0f1066e63fec21dafcdd84aa9b",
            "ruleid": "PERMIT_CHECK_NO_REPEAT",
            "rank": 1,
            "targets": "[RD_LINK,100005253]",
            "information": "该位置已有节点，同一坐标不能有两个节点，请创建点点立交",
            "geometry": "(116.37559,40.00283)",
            "create_date": "2016-05-31 08:58:39",
            "worker": "TEST"
        },
        {
            "id": "53d600548b704ad1a0d6286a8dde1f4a",
            "ruleid": "SHAPING_CHECK_CROSS_RDLINK_RDLINK",
            "rank": 1,
            "targets": "[RD_LINK,100005253]",
            "information": "两条Link相交，必须做立交或者打断",
            "geometry": "(116.37559,40.00283)",
            "create_date": "2016-05-31 08:58:39",
            "worker": "TEST"
        }
    ];
}]);