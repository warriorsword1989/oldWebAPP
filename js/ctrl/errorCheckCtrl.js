/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', ['smart-table']);
errorCheckModule.controller('errorCheckController', function ($scope) {
    var errorCheckCtrl;
    if(!errorCheckCtrl) {
        errorCheckCtrl = new fastmap.uikit.CheckResultController();
    }
    var
        nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'],
        familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];

    function createRandomItem() {
        var
            firstName = nameList[Math.floor(Math.random() * 4)],
            lastName = familyName[Math.floor(Math.random() * 4)],
            age = Math.floor(Math.random() * 100),
            email = firstName + lastName + '@whatever.com',
            balance = Math.random() * 3000;

        return {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            balance: balance
        };
    }

    $scope.itemsByPage = 4;

    $scope.rowCollection = [];
    for (var j = 0; j < 200; j++) {
        $scope.rowCollection.push(createRandomItem());
    }

});