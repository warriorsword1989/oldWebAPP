/**
 * Created by linglong on 2016/5/4.
 *
 * 该登录表单支持三种前台报错的方式：
 * valid_type == 1 在不合法是输入框标红;
 * valid_type == 2 在不合法时输入框标红并提示错误信息;
 * valid_type == 3 在提交时统一显示错误信息;

 */
angular.module('fastmap.uikit').directive('loginForm', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: '../../scripts/components/directives/loginForm/loginForm.htm',
        scope: true,
        controller: function($scope, $element) {
            $scope.handleEvent = function(){
                $scope.$emit("startLogin");
            }
        },
        link: function(scope, element, attrs){
                // 设置初始状态;
                scope.show_error=false;
                scope.valid_type = attrs.showstyle;

            if (scope.valid_type == 2) {
                scope.show_error = true;
            } else {
                scope.show_error = false;
            }
            function countPos(){
                var left = (element[0].offsetParent.clientWidth - element[0].clientWidth)/2;
                var top = (element[0].offsetParent.clientHeight - element[0].clientHeight)/2+35;
                element.css('left', left+'px');
                element.css('top', top+'px');
            }
            countPos();
            window.onresize = function(){
                countPos();
            }
        }
    };
});