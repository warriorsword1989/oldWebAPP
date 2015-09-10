/**
 * Created by zhongxiaoming on 2015/9/2.
 */
define(['js/fastmap/fastmap','js/fastmap/mapApi/layer/WholeLayer'], function (fastmap) {
    fastmap.mapApi.MeshLayer = fastmap.mapApi.WholeLayer.extend({
        initialize: function (options) {
            this.options = options || {};
            fastmap.mapApi.WholeLayer.prototype.initialize(this, options);
            this.minShowZoom = this.options.minShowZoom || 9;
            this.maxShowZoom = this.options.maxShowZoom || 18;
        },

        onAdd: function (map) {
            this.map = map;
            this._initContainer(this.map, this.options);
            map.on("moveend", this._redraw, this);
            this._redraw();
        },

        onRemove: function (map) {
            map.getPanes().overlayPane.removeChild(this._div);
            map.off("moveend", this._redraw, this);
        },

        _initContainer: function (options) {
            this.options = options || {};
            var container = L.DomUtil.create('div', 'leaflet-canvas-container');
            container.style.position = 'absolute';
            container.style.width = this.map.getSize().x + "px";
            container.style.height = this.map.getSize().y + "px";

            this.canv = document.createElement("canvas");
            this._ctx = this.canv.getContext('2d');
            this.canv.width = this.map.getSize().x;
            this.canv.height = this.map.getSize().y;
            this.canv.style.width = this.canv.width + "px";
            this.canv.style.height = this.canv.height + "px";
            container.appendChild(this.canv);
            this._div = container;
            this.map.getPanes().overlayPane.appendChild(this._div);
        },

        draw: function (bounds) {
            var pointDL = bounds.getSouthWest();
            //右上角点
            var pointUR = bounds.getNorthEast();
            //var ret= this.CalculateMeshIds(pointDL.lng, pointUR.lng, pointDL.lat, pointUR.lat);
            var minPoint = this.Calculate25TMeshCorner(pointDL);
            var minLon = minPoint.lng;
            var minLat = minPoint.lat;
            this.gridArr = [];
            var labelArr = [];
            while (minLon <= pointUR.lng) {
                var gridObj = this.createGrid(minLon, minLon + 0.125, minLat, pointUR.lat);
                this.gridArr = this.gridArr.concat(gridObj);
                minLon += 0.125;
            }

            for (var i = 0, len = this.gridArr.length; i < len; i++) {
                var latlngbounds = this.gridArr[i].getBounds();
                var bound = L.bounds(this.map.latLngToContainerPoint(latlngbounds.getNorthWest()), this.map.latLngToContainerPoint(latlngbounds.getSouthEast()));
                var size = bound.getSize();
                this.drawRect(this._ctx, this.gridArr[i].options.meshid, {
                    x: bound.min.x,
                    y: bound.min.y,
                    width: size.x,
                    height: size.y
                });
            }
        },

        drawRect: function (context, meshId, options) {
            context.strokeStyle = 'red'//边框颜色
            context.linewidth = 1;  //边框宽
            context.strokeRect(options.x, options.y, options.width, options.height);  //填充边框 x y坐标 宽 高
            context.stroke()
        },
        _redraw: function () {
            this._resetCanvasPosition();
            this.clear();

            if (this.map.getZoom() >= this.minShowZoom && this.map.getZoom() <= this.maxShowZoom) {
                this.draw(this.map.getBounds())
            }
            return this;
        },

        createGrid: function (minLon, maxLon, origin, destination, source) {
            //保存生成的网格
            var grid = [];
            var labels = []
            while (origin <= destination) {
                var components = [];
                components.push([origin, minLon]);
                components.push([origin + 0.083333333333333, minLon]);
                components.push([origin + 0.083333333333333, maxLon]);
                components.push([origin, maxLon]);
                var meshId = this.Calculate25TMeshId({
                    lng: (minLon + maxLon) / 2,
                    lat: (origin + origin + 0.083333333333333) / 2
                });
                var bound = this.Calculate25TMeshBorder(meshId);

                var b = L.latLngBounds([bound.minLat, bound.minLon], [bound.maxLat, bound.maxLon]);
                var polygon = L.rectangle(b, {meshid: meshId});
                grid.push(polygon);
                origin += 0.083333333333333;
            }

            return grid
        },
        clear: function () {
            this.canv.getContext("2d").clearRect(0, 0, this.canv.width, this.canv.height);
        },

        _resetCanvasPosition: function () {
            var bounds = this.map.getBounds();
            var topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
            L.DomUtil.setPosition(this._div, topLeft);
        },


        /**
         * Created by zhong on 2014-12-24.
         */

        /*
         *	根据纬度计算该点位于理想图幅分割的行序号
         *
         *  @parameter      lat                 纬度      单位‘度’
         *  @paramenter     remainder           余数      单位‘千秒’
         */
        CalculateIdealRowIndex: function (lat, remainder) {
            //相对区域纬度 = 绝对纬度 - 0.0
            var regionLatitude = lat - 0.0;

            //相对的以秒为单位的纬度
            var secondLatitude = regionLatitude * 3600;

            var longsecond;

            //为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
            if (secondLatitude * 1000 < 0) {
                longsecond = Math.ceil(secondLatitude * 1000);
            }
            else {
                longsecond = Math.floor(secondLatitude * 1000)
            }

            remainder = (longsecond % 300000);

            return {value: Math.floor(longsecond / 300000), reminder: remainder};
        },


        /*
         *	根据纬度计算该点位于实际图幅分割的行序号
         *
         *  @parameter      lat                 纬度      单位‘度’
         *  @paramenter     remainder           余数      单位‘千秒’
         */
        CalculateRealRowIndex: function (lat, remainder) {
            //理想行号
            var idealRow = this.CalculateIdealRowIndex(lat, remainder);


            switch (idealRow % 3)//三个一组的余数
            {
                case 0: //第一行
                {
                    if (300000 - idealRow.remainder <= 12) //余数距离上框小于0.012秒
                        idealRow.value++;
                }
                    break;
                case 1: //第二行
                    break;
                case 2: //第三行
                {
                    if (idealRow.remainder < 12) //余数距离下框小于等于0.012秒
                        idealRow.value--;
                }
                    break;
            }

            return idealRow;
        },

        /*
         *	根据经度计算该点位于实际图幅分割的列序号
         *
         *  @param      lon                经度，单位“度”
         */

        CalculateRealColumnIndex: function (lon, remainder) {
            return this.CalculateIdealColumnIndex(lon, remainder);
        },

        /*
         * 根据经度计算该点位于理想图幅分割的列序号
         *
         *  @param     lon                经度，单位“度”
         *  @param     reminder           余数 单位“千秒”
         */

        CalculateIdealColumnIndex: function (lon, remainder) {
            //相对区域经度 = 绝对经度 - 60.0
            var regionLongitude = lon - 60.0;

            //相对的以秒为单位的经度
            var secondLongitude = regionLongitude * 3600;

            //为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
            var longsecond = Math.floor(secondLongitude * 1000);

            remainder = Math.floor(longsecond % 450000);

            return {value: Math.floor(longsecond / 450000), reminder: remainder};
        },

        MeshLocator_25T: function (lon, lat) {
            if (0x01 == (this.IsAt25TMeshBorder(lon, lat) & 0x0F)) //为了保证它总返回右上的图幅
                lat += 0.00001;


            var remainder = 0;

            var rowResult = this.CalculateRealRowIndex(lat, remainder);

            var colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);

            //第1、2位 : 纬度取整拉伸1.5倍
            var M1M2 = Math.floor(lat * 1.5);

            //第3、4位 : 经度减去日本角点 60度
            var M3M4 = Math.floor(lon) - 60;

            //第5位 :
            var M5 = rowResult.value % 8;

            //第6位 : 每列450秒，每度包含8列
            var M6 = colResult.value % 8;

            //连接以上数字,组成图幅号
            var sMeshId = "" + M1M2 + M3M4 + M5 + M6;

            while (sMeshId.length < 6) {
                sMeshId = "0" + sMeshId;
            }

            return sMeshId;
        },

        /*
         *  点所在的图幅号,如果点在图幅边界上,返回右上的图幅号
         *
         *  @param          point          经纬度点
         */
        Calculate25TMeshId: function (point) {
            var mesh = this.MeshLocator_25T(point.lng, point.lat);

            return mesh;
        },

        /*
         *	快速计算点所在的图幅左下角点
         *
         *  @param      point          经纬度点
         */
        Calculate25TMeshCorner: function (point) {
            return this.Calculate25TMeshCornerByMeshId(this.Calculate25TMeshId(point));
        },


        Calculate25TMeshCornerByMeshId: function (mesh) {
            var cc = mesh.split("");

            var M1 = parseInt(cc[0]);
            var M2 = parseInt(cc[1]);
            var M3 = parseInt(cc[2]);
            var M4 = parseInt(cc[3]);
            var M5 = parseInt(cc[4]);
            var M6 = parseInt(cc[5]);

            var x = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
            var y = (M1 * 10 + M2) * 2400 + M5 * 300;

            var point = L.latLng(y / 3600.0, x / 3600.0);

            return point;
        },

        /*
         *	快速计算点所在的图幅边框
         */
//function Calculate25TMeshBorder(point) {
//    return Calculate25TMeshBorder(Calculate25TMeshId(point));
//}

        /*
         *	根据图幅号计算图幅边框
         */

        Calculate25TMeshBorder: function (mesh) {
            var cc = mesh.split("");

            var M1 = parseInt(cc[0]);
            var M2 = parseInt(cc[1]);
            var M3 = parseInt(cc[2]);
            var M4 = parseInt(cc[3]);
            var M5 = parseInt(cc[4]);
            var M6 = parseInt(cc[5]);

            var x_conner = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
            var y_conner = (M1 * 10 + M2) * 2400 + M5 * 300;

            var x_upper = x_conner + 450.0;
            var y_upper = y_conner + 300.0;


            var leftBottom = L.latLng(y_conner / 3600.0, x_conner / 3600.0);

            var rightTop = L.latLng(y_upper / 3600.0, x_upper / 3600.0);

            return {minLon: leftBottom.lng, minLat: leftBottom.lat, maxLon: rightTop.lng, maxLat: rightTop.lat};
        },
        /*
         * 	点是否在图框上
         *
         *  @param      lon               经度
         *  @param      lat               纬度
         */

        IsAt25TMeshBorder: function (lon, lat) {
            var model = 0;

            var remainder = 0;
            var rowResult = this.CalculateIdealRowIndex(lat, remainder);
            switch (rowResult.value % 3) {
                case 0: //第一行
                {
                    if (300000 - rowResult.remainder == 12) //余数距离上框等于0.012秒
                        model |= 0x01;
                    else if (rowResult.remainder == 0)
                        model |= 0x01;
                }
                    break;
                case 1: //第二行由于上下边框均不在其内，因此不在图框上
                    break;
                case 2: //第三行
                {
                    if (rowResult.remainder == 12) //余数距离下框等于0.012秒
                        model |= 0x01;
                }
                    break;
            }

            var colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);

            if (0 == colResult.remainder)
                model |= 0x10;

            return model;
        }

    });


});
