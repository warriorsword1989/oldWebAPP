var app = angular.module('mapApp', ['oc.lazyLoad', 'ui.layout']);
app.controller('generalController', ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    initMap('map');
    dragF('toolsDiv');
    dragF('toolsDiv1');

    $scope.changeLayers = function (layers) {
        $scope.items = [
            {id:"123",name: "test1", show: true, choose: false, editor: true},
            {id:"122",name: "test2", show: false, choose: false, editor: false},
            {id:"121",name: "test3", show: true, choose: true, editor: false},
            {id:"120",name: "test4", show: true, choose: false, editor: false},
            {id:"124",name: "test5", show: true, choose: false, editor: false},
            {id:"125",name: "test6", show: false, choose: false, editor: false},
            {id:"126",name: "test7", show: true, choose: false, editor: false},
            {id:"127",name: "test8", show: true, choose: false, editor: false},
            {id:"128",name: "test9", show: false, choose: false, editor: false},
            {id:"129",name: "test10", show: true, choose: false, editor: false},
            {id:"130",name: "test11", show: true, choose: false, editor: false},
            {id:"131",name: "test12", show: false, choose: false, editor: false},
            {id:"132",name: "test13", show: true, choose: false, editor: false},
            {id:"133",name: "test14", show: true, choose: false, editor: false},
            {id:"134",name: "test15", show: false, choose: false, editor: false},
            {id:"135",name: "test16", show: true, choose: false, editor: false},
            {id:"136",name: "test17", show: true, choose: false, editor: false},
            {id:"137",name: "test18", show: false, choose: false, editor: false},
            {id:"138",name: "test19", show: true, choose: false, editor: false},
            {id:"139",name: "test20", show: true, choose: false, editor: false},
            {id:"140",name: "test21", show: true, choose: false, editor: false},
            {id:"141",name: "test22", show: true, choose: false, editor: false},
            {id:"142",name: "test23", show: true, choose: false, editor: false},
            {id:"143",name: "test24", show: false, choose: false, editor: false},
            {id:"144",name: "test25", show: true, choose: false, editor: false},
            {id:"145",name: "test26", show: false, choose: false, editor: false},
            {id:"146",name: "test27", show: true, choose: false, editor: false},
            {id:"147",name: "test28", show: true, choose: false, editor: false},
            {id:"148",name: "test29", show: true, choose: false, editor: false},
            {id:"149",name: "test30", show: true, choose: false, editor: false},
            {id:"150",name: "test31", show: false, choose: false, editor: false},
            {id:"151",name: "test32", show: true, choose: false, editor: false},
            {id:"152",name: "test33", show: false, choose: false, editor: false},
            {id:"153",name: "test34", show: true, choose: false, editor: false},
            {id:"154",name: "test35", show: true, choose: false, editor: false},
            {id:"155",name: "test36", show: false, choose: false, editor: false},
            {id:"156",name: "test37", show: true, choose: false, editor: false},
            {id:"157",name: "test38", show: true, choose: false, editor: false},
            {id:"158",name: "test39", show: false, choose: false, editor: false},
            {id:"159",name: "test40", show: true, choose: false, editor: false}
        ];
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
var map = null;
function initMap(id) {
    map = L.map('map',{ attributionControl: false}).setView([51.505, -0.09], 13);

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
