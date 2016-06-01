/**
 * Created by linglong on 2016/5/4.
 *
 * 该登录表单支持三种前台报错的方式：
 * validType == 1 在不合法时输入框标红;
 * validType == 2 在不合法时输入框标红并提示错误信息;
 * validType == 3 在提交时统一显示错误信息;

 */
angular.module('fastmap.uikit').directive('login', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: '../../scripts/components/directives/loginForm/newloginForm.htm',
        scope: {
            validType: '@validType'
        },
        controller: function($scope, $element) {
            $scope.handleEvent = function() {
                if ($scope.myForm.$invalid) {
                    if ($scope.validType == 3) {
                        $scope.showErrorMsg = true;
                    }
                    return;
                }
                $scope.$emit("startLogin", {
                    userName: $scope.username,
                    password: $scope.pwd
                });
            }
    },
        link: function(scope, element, attrs) {
            scope.showInputError = false;
            scope.showErrorMsg = false;
            if (scope.validType == 1) {
                scope.showInputError = true;
            } else if (scope.validType == 2) {
                scope.showInputError = true;
                scope.showErrorMsg = true;
            }
            //登录框垂直居中;
            function countPos() {
                var top = (element[0].offsetParent.clientHeight - element[0].clientHeight) / 2;
                top = top>0?top:-top;
                element.css('marginTop', top+30 + 'px');
            }
            countPos();
            window.onresize = function() {
                countPos();
            }
        }
    };
});