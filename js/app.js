﻿var app = angular.module('mapApp', ['oc.lazyLoad', 'ui.layout']);
app.controller('generalController', ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    initMap('map');
    dragF('toolsDiv');
    dragF('toolsDiv1');
    dragF1('popoverTips', 'parentId');
    $scope.dataTipsURL = "";
    $scope.objectEditURL = "";
    $scope.save = "";
    $scope.delete = "";
    $scope.cancel = "";
    $scope.rdRestrictData ={};
    //登录时
    $ocLazyLoad.load('ctrl/errorCheckCtrl').then(function () {
            $scope.errorCheckTab = 'js/tepl/errorCheckTepl.html';
        }
    );
    $ocLazyLoad.load('ctrl/filedsResultCtrl').then(function () {
            $scope.layersURL = 'js/tepl/filedsResultTepl.html';
        }
    );
    $scope.changeLayers = function (layers) {

        if (layers === "taskLayers") {
            $ocLazyLoad.load('ctrl/taskLayersCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/taskLayersTepl.html';
                }
            );
        } else if (layers === "resultLayers") {
            $ocLazyLoad.load('ctrl/filedsResultCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/filedsResultTepl.html';
                }
            );
        } else if (layers === "referenceLayers") {
            $ocLazyLoad.load('ctrl/referenceLayersCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/referenceLayersTepl.html';
                }
            );
        }


    };
    $scope.showTab = function (tab) {
        if (tab === "outPut") {

            $ocLazyLoad.load('ctrl/outPutCtrl').then(function () {
                    $scope.outputTab = 'js/tepl/outputTepl.html';
                }
            );
        } else if (tab === "errorCheck") {
            $ocLazyLoad.load('ctrl/errorCheckCtrl').then(function () {
                    $scope.errorCheckTab = 'js/tepl/errorCheckTepl.html';
                }
            );
        }

    };
}]);
var map = null,dataTipsURL=null;
function initMap(id) {
    map = L.map('map',{ attributionControl: false}).setView([39.907333, 116.391083], 17);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: null


    }).addTo(map);
};
function dragF(id) {
    var $dragDiv = $('#' + id),
        $parentDiv = $('#map');
    var $drag = $dragDiv.find('div');
    $drag.on({
        mousedown: function (e) {
            e.preventDefault();

            var t = $dragDiv.offset(),
                o = e.pageX - t.left,
                i = e.pageY - t.top;
            var df = e.target.id;
            if (df !== "map") {
                $dragDiv.on("mousemove.drag", function (e) {
                    map.dragging.disable();
                    e.stopPropagation();
                    var sunTop = e.pageY - i,
                        sunLeft = e.pageX - o;
                    if (sunTop > $parentDiv.offset().top && sunTop + $dragDiv.height() < $parentDiv.offset().top + $parentDiv.height() && sunLeft > $parentDiv.offset().left && sunLeft + $dragDiv.width() < $parentDiv.offset().left + $parentDiv.width()) {
                        $dragDiv.offset({
                            top: e.pageY - i,
                            left: e.pageX - o
                        })

                    }

                })
            }

        },
        mouseup: function () {
            map.dragging.enable();
            $dragDiv.unbind("mousemove.drag");
        }
    });
}
function dragF1(id,pId) {
    var $dragDiv = $('#' + id),
        $parentDiv = $('#'+pId);
    var $drag = $dragDiv.find('div');
    $drag.on({
        mousedown: function (e) {
            e.preventDefault();

            var t = $dragDiv.offset(),
                o = e.pageX - t.left,
                i = e.pageY - t.top;
            var df = e.target.id;
            if (df !== "pId") {
                $dragDiv.on("mousemove.drag", function (e) {
                    map.dragging.disable();
                    e.stopPropagation();
                    var sunTop = e.pageY - i,
                        sunLeft = e.pageX - o;
                    if (sunTop > $parentDiv.offset().top && sunTop + $dragDiv.height() < $parentDiv.offset().top + $parentDiv.height() && sunLeft > $parentDiv.offset().left && sunLeft + $dragDiv.width() < $parentDiv.offset().left + $parentDiv.width()) {
                        $dragDiv.offset({
                            top: e.pageY - i,
                            left: e.pageX - o
                        })

                    }

                })
            }

        },
        mouseup: function () {
            map.dragging.enable();
            $dragDiv.unbind("mousemove.drag");
        }
    });
}


