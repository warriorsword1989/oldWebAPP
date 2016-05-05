/**
 * Created by Administrator on 2016/5/4.
 */
angular.module('fastmap.uikit').directive('loginForm', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: '../../scripts/components/directives/loginForm/loginForm.htm',
        controller: function($scope, $element) {
            $scope.handleEvent = function(){
                $scope.$emit("startLogin",'rowEditor');
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