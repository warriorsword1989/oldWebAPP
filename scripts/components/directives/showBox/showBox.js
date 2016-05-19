/**
 * Created by chenx on 2016/5/18.
 * 此指令
 *
 */
angular.module('fastmap.uikit').directive('showBox', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: '../../scripts/components/directives/showBox/showBox.htm',
        scope: {
            dataList: '=fmData',
            deletable: '@fmDeletable',
            onClick: '&fmClick',
            onSelect: '&fmSelect',
            beforeDelete: '&fmBeforeDelete',
            afterDelete: '&fmAfterDelete'
        },
        controller: function ($scope, $element) {
            $scope.selectMe = function (index) {
                $scope.page.pageNo = Math.ceil((index + 1) / $scope.page.pageSize);
                $scope.selectedIndex = index;
                $scope.selectedImg = $scope.dataList[index];
                if ($scope.onSelect) {
                    $scope.onSelect({
                        index: index,
                        item: $scope.selectedImg
                    });
                }
            };
            $scope.clickMe = function () {
                if ($scope.onClick) {
                    $scope.onClick({
                        item: $scope.selectedImg
                    });
                }
            };
            $scope.deleteMe = function () {
                if ($scope.beforeDelete) {
                    $scope.beforeDelete({
                        item: $scope.selectedImg
                    });
                }
                $scope.dataList.splice($scope.selectedIndex, 1);
                if ($scope.selectedIndex > 0) {
                    $scope.selectMe($scope.selectedIndex - 1);
                } else {
                    if ($scope.dataList.length > 0) {
                        $scope.selectMe(0);
                    } else {
                        $scope.selectedIndex = -1;
                        $scope.selectedImg = null;
                    }
                }
                if ($scope.afterDelete) {
                    $scope.afterDelete({
                        item: $scope.selectedImg
                    });
                }
            };
            $scope.prev = function () {
                if ($scope.page.pageNo > 1) {
                    $scope.page.pageNo--;
                }
            };
            $scope.next = function () {
                if ($scope.page.pageNo < $scope.page.pageCount) {
                    $scope.page.pageNo++;
                }
            };
            $scope.$watch("dataList", function (newValue, oldValue) {
                if (newValue.length > oldValue.length) { // 新增时，选中最后一个，即选中新增的
                    $scope.selectMe(newValue.length - 1);
                }
                $scope.page.pageCount = Math.ceil($scope.dataList.length / $scope.page.pageSize);
            }, true);
            $scope.pageStyle = {
                "margin-top": "0px"
            };
            $scope.$watch("page.pageNo", function () {
                $scope.pageStyle["margin-top"] = -(($scope.page.pageNo - 1) * 53) + "px";
            });
        },
        link: function (scope, element, attrs) {
            scope.selectedIndex = -1;
            scope.selectedImg = null;
            var divs = element.children("div");
            var imgBox = angular.element(divs[0]),
                toobar = angular.element(divs[1]);
            thumb = angular.element(divs[2]);
            if (toobar.children().length > 0) {
                scope.hasToolbar = true;
                imgBox.css("height", (element[0].clientHeight - 70 - toobar[0].offsetHeight) + "px");
            } else {
                scope.hasToolbar = false;
                imgBox.css("height", (element[0].clientHeight - 70) + "px");
            }
            var bh = imgBox[0].clientHeight;
            var bw = imgBox[0].clientWidth;
            imgBox.find("img").on("load", function () {
                var that = angular.element(this);
                var nw = this.naturalWidth;
                var nh = this.naturalHeight
                var rW = bw / nw;
                var rH = bh / nh;
                var r = rW <= rH ? rW : rH;
                if (r < 1) {
                    that.css("width", Math.floor(nw * r) + "px");
                    that.css("height", Math.floor(nh * r) + "px");
                }
                var off = bh - this.offsetHeight;
                that.parent().css("margin-top", Math.ceil(off / 2) + "px");
            });
            scope.page = {
                pageSize: Math.floor(thumb.children("div")[1].clientWidth / 50),
                pageNo: 1
            };
            scope.selectMe(0);
        }
    };
});