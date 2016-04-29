angular.module('app').controller('generalParkingsCtl', function($scope) {
    $scope.ctrl = {
        open: true,
        btShow: true,
    };
    // $scope.test = function() {
    //     console.log("parkings");
    // };
    $scope.changeTollStd = function(event) {
        if (event.target.value == "5") {
            if (event.target.checked) {
                for (var key in $scope.parkings.tollStdObj) {
                    if (key != "5") {
                        $scope.parkings.tollStdObj[key] = false;
                    }
                }
            }
        } else {
            if (event.target.checked) {
                $scope.parkings.tollStdObj["5"] = false;
            }
        }
    };
    $scope.changeTollWay = function(event) {
        if (event.target.checked) {
            alert(event.target.value);
        } else {
            alert("-" + event.target.value);
        }
    };
    $scope.initCheckbox = function(valueStr, retObj) {
        var tmp = valueStr ? valueStr.split("|") : [];
        for (var i = 0; i < tmp.length; i++) {
            retObj[tmp[i]] = true;
        }
    };
    $scope.parkings = $scope.poi.parkings;
    $scope.initCheckbox($scope.parkings.tollStd, $scope.parkings.tollStdObj = {});
    // var test = $scope.poi;
    // $scope.test();
    // $scope.$on("loadup", function(event, data) {
    //     $scope.parkings = data.getSnapShot();
    //     $scope.parkings = {
    //         tollStd: "1|2|3",
    //         buildingType: 4,
    //     };
    //     $scope.initCheckbox($scope.parkings.tollStd, $scope.parkings.tollStdObj = {});
    // });
    $scope.$on("save", function(event, data) {
        $scope.$emit("saveMe", "deepInfo");
    });
});