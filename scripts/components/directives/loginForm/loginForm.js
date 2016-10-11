/**
 * Created by linglong on 2016/5/4.
 *
 * 该登录表单支持三种前台报错的方式：
 * validType == 1 在不合法时输入框标红;
 * validType == 2 在不合法时输入框标红并提示错误信息;
 * validType == 3 在提交时统一显示错误信息;
 */
angular.module('fastmap.uikit').directive('login', function ($timeout) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: '../../scripts/components/directives/loginForm/loginForm.htm',
    scope: {
      validType: '@validType',
      percentData: '@percentData'
    },
    controller: function ($scope, $element) {
      $scope.errorFlag = false;
      $scope.rememberMe = true;
      $scope.userNamePlaceholder = "请输入用户名";
      $scope.passwordPlaceholder = "请输入密码";
      var percent = $scope.percentData;
      $scope.loginUserNameImg = {
        'width': 22 * percent + 'px',
        'height': 22 * percent + 'px',
        'position': 'absolute',
        'margin-top': 12 * percent + 'px',
        'margin-left': 14 * percent + 'px'
      };
      $scope.loginUserNameInput = {
        'text-indent': 36 * percent + 'px',
        'height': 46 * percent + 'px',
        'border-color': '#20b3fe',
        'border-radius': '0px'
      };
      $scope.loginPassWordDiv = {
        'margin-top': 24 * percent + 'px'
      };
      $scope.loginRememberDiv = {
        'margin-top': 24 * percent + 'px',
        'height': 16 * percent + 'px'
      };
      $scope.loginRememberSpan = {
        'float': 'right',
        'height': 16 * percent + 'px',
        'line-height': 16 * percent + 'px',
        'color': '#20b3fe',
        'cursor': 'pointer',
        'font-weight': 100
      };
      $scope.loginRememberImg = {
        'float': 'right',
        'height': 16 * percent + 'px',
        'width': 16 * percent + 'px',
        'margin-right': 10 * percent + 'px',
        'cursor': 'pointer'
      };
      $scope.loginButtonDiv = {
        'margin-top': 10 * percent + 'px'
      };
      $scope.loginButton = {
        'font-size': 18 * percent + 'px',
        'color': 'white',
        'height': 46 * percent + 'px',
        'border-width': '0px',
        'letter-spacing': '10px',
        'border-radius': '0px',
      };
      $scope.loginErrorDiv = {
        'margin-top': 22 * percent + 'px',
        'text-align': 'center'
      };
      $scope.loginErrorMessageDiv = {
        'height': 22 * percent + 'px'
      };
      $scope.loginErrorImg = {
        'height': 22 * percent + 'px',
        'width': 22 * percent + 'px'
      };
      $scope.loginErrorSpan = {
        'vertical-align': 'middle',
        'color': '#ff4c5f',
        'height': 22 * percent + 'px',
        'line-height': 22 * percent + 'px',
        'margin-left': 8 * percent + 'px'
      };
      $scope.loginErrorNullDiv = {
        'height': 22 * percent + 'px'
      };
      $scope.changeForgetMe = function () {
        $scope.rememberMe = !$scope.rememberMe;
      };
      $scope.changeUserNamePlaceholder = function () {
        if ($scope.userNamePlaceholder === '') {
          $scope.userNamePlaceholder = "请输入用户名";
        } else {
          $scope.userNamePlaceholder = "";
          $scope.errorFlag = false;
        }
      };
      $scope.changePasswordPlaceholder = function () {
        if ($scope.passwordPlaceholder === '') {
          $scope.passwordPlaceholder = "请输入密码";
        } else {
          $scope.passwordPlaceholder = "";
          $scope.errorFlag = false;
        }
      };
      $scope.$on("errorMessage", function (event, data) {
        $scope.errorMessage = data.error;
        $scope.errorFlag = true;
      });
      $scope.handleEvent = function () {
        //if ($scope.myForm.$invalid) {
        //    if ($scope.validType == 3) {
        //        $scope.showErrorMsg = true;
        //    }
        //    return;
        //}
        $scope.$emit("startLogin", {
          userName: $scope.username,
          password: $scope.pwd,
          remember: !$scope.rememberMe
        });
      }
    },
    link: function (scope, element, attrs) {
      scope.showInputError = false;
      scope.showErrorMsg = false;
      if (scope.validType == 1) {
        scope.showInputError = true;
      } else if (scope.validType == 2) {
        scope.showInputError = true;
        scope.showErrorMsg = true;
      }
    }
  };
});