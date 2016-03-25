/**
 * Created by zhongxiaoming on 2016/3/23.
 * Class fastmap.mapApi.LayerRender
 */
fastmap.mapApi.LayerRender = {


    /***
     * 绘制点
     * @param ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param geom 点对象
     * @param style 样式
     * @param boolPixelCrs 是否是像素坐标
     * @private
     */
    _drawPoint: function (ctx, geom, style, boolPixelCrs) {
        if (!style) {
            return;
        }
        var p = null;
        if (boolPixelCrs) {
            p = {x: geom[0], y: geom[1]}
        } else {
            p = this._tilePoint(ctx, geom);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.beginPath();
        g.fillStyle = style.color;
        g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
        g.closePath();
        g.fill();
        g.restore();
    },

    _drawRdCross: function (ctx, geom, imgsrc, boolPixelCrs) {
        if (!imgsrc) {
            return;
        }
        var p = null;
        if (boolPixelCrs) {
            p = {x: geom[0], y: geom[1]}
        } else {
            p = this._tilePoint(ctx, imgsrc);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        this._loadImg(imgsrc.src, function (img) {
            g.save();
            g.translate(p.x, p.y);
            g.drawImage(img, -img.width / 2, -img.height / 2);
            g.restore();
        })
    },


    /***
     *
     * @param options
     * @private
     */
    _drawImg:function(options){
        var p = null;
        var style = options.style;
        if (options.boolPixelCrs) {
            p = {x: options.geo[0], y: options.geo[1]}
        } else {
            p = this._tilePoint(options.ctx, options.geom);
        }

        var c = options.ctx.canvas;

        var g = c.getContext('2d');

        var image = new Image();

        var rotate = options.rotate;


        image.src = style.src;
        image.onload = function () {
            var drawx = options.drawx?options.drawx:-image.width/2;
            var drawy = options.drawy?options.drawy:-image.height/2;
            g.save();
            g.translate(p.x, p.y);
            if(options.fillStyle){
                g.strokeStyle = options.fillStyle.lineColor;  //边框颜色
                g.fillStyle = options.fillStyle.fillColor;
                g.linewidth=options.fillStyle.lineWidth;  //边框宽
                g.fillRect(drawx+options.fillStyle.dx,drawy+options.fillStyle.dy,options.fillStyle.width,options.fillStyle.height);  //填充颜色 x y坐标 宽 高
                g.strokeRect(drawx+options.fillStyle.dx,drawy+options.fillStyle.dy,options.fillStyle.width,options.fillStyle.height);  //填充边框 x y坐标 宽 高
            }



            if(rotate){
                g.rotate(rotate);//旋转度数
            }
            g.drawImage(image, drawx, drawy);
            g.restore();
        }
    },
    /***
     * 绘制图片
     * @param ctx
     * @param geom
     * @param imgsrc
     * @param boolPixelCrs
     * @private
     */
    //_drawImg: function (ctx, geom, imgsrc, boolPixelCrs,property) {
    //    var p = null;
    //    if (boolPixelCrs) {
    //        p = {x: geom[0], y: geom[1]}
    //    } else {
    //        p = this._tilePoint(ctx, imgsrc);
    //    }
    //    var c = ctx.canvas;
    //    var g = c.getContext('2d');
    //    var image = new Image();
    //    if(!property || !property.kind){
    //        if (!imgsrc) {
    //            return;
    //        }
    //        image.src = imgsrc.src;
    //        image.onload = function () {
    //            //以Canvas画布上的坐标(10,10)为起始点，绘制图像
    //            if(geom.length <=2){
    //                g.save();
    //                g.translate(p.x, p.y);
    //                g.drawImage(image, -image.width / 2, -image.height);
    //                g.restore();
    //            }else{  //  如果传的坐标不止两组，如桥
    //                $.each(geom,function(i,v){
    //                    if(i == 0 || i == geom.length-1){
    //                        $.each(v,function(m,n){
    //                            g.save();
    //                            g.translate(n[0], n[1]);
    //                            g.drawImage(image, -image.width / 2, -image.height);
    //                            g.restore();
    //                        });
    //                    }
    //                });
    //            }
    //        };
    //    }else{  //如果是种别，需分情况显示
    //        if(property.type == '1201'){
    //            this._drawKindSvg(image,g,property,p.x,p.y);
    //        }else if(property.type == '1203'){
    //            this._drawRoadDirec(image,g,property,p.x,p.y);
    //        }
    //    }
    //},
    _drawRoadDirec:function(img,g,property,x,y){
        if(property.srctype == 3){
            g.strokeStyle = "rgb(4, 187, 245)";  //边框颜色
            g.fillStyle = 'rgba(4, 187, 245, 0.2)';
        }else{
            g.strokeStyle = "#F50404";  //边框颜色
            g.fillStyle="rgba(245, 4, 4, 0.2)";  //填充的颜色
        }
        if(property.direc == 2){
            img.src = 'css/tips/road/1.svg';
        }else{
            img.src = 'css/tips/road/2.svg';
        }
        g.linewidth=1;  //边框宽
        g.fillRect(x-10,y-25,20,20);  //填充颜色 x y坐标 宽 高
        g.strokeRect(x-10,y-25,20,20);  //填充边框 x y坐标 宽 高
        img.onload = function () {
            g.save();
            g.translate(x, y);
            g.rotate(property.kind *Math.PI/180);//旋转度数
            g.drawImage(img, -img.width / 2, -img.height);
            g.restore();
        }
    },
    _drawKindSvg:function(img,g,property,x,y){     //种别svg绘制
        if(property.srctype == 3){
            g.strokeStyle = "rgb(4, 187, 245)";  //边框颜色
            g.fillStyle = 'rgba(4, 187, 245, 0.2)';
        }else{
            g.strokeStyle = "#F50404";  //边框颜色
            g.fillStyle="rgba(245, 4, 4, 0.2)";  //填充的颜色
        }
        g.linewidth=1;  //边框宽
        g.fillRect(x-15,y-22,30,15);  //填充颜色 x y坐标 宽 高
        g.strokeRect(x-15,y-22,30,15);  //填充边框 x y坐标 宽 高
        img.src = 'css/tips/kind/K'+property.kind+'.svg';
        this._loadImg(img.src, function (img) {
            g.save();
            g.translate(x, y);
            g.drawImage(img, -img.width / 2, -img.height);
            g.restore();
        });
    },
    _drawImgRoute: function (ctx, geom, imgsrc, arrorSrc, boolPixelCrs, rount) {
        if (!imgsrc.src) {
            return;
        }
        var p = null;
        if (boolPixelCrs) {
            p = {x: geom[0], y: geom[1]}
        } else {
            p = this._tilePoint(ctx, imgsrc);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        var image = new Image(),
            arrorImg = new Image();
        image.src = imgsrc.src;
        arrorImg.src = arrorSrc.src;
        var xpos = parseInt(geom[0]);
        var ypos = parseInt(geom[1]);
        image.onload = function () {
            g.save();
            g.translate(p.x, p.y);
            //以Canvas画布上的坐标(10,10)为起始点，绘制图像
            g.drawImage(image, -image.width / 2, -image.height / 2);
            g.restore();
        };
        arrorImg.onload = function () {
            g.save();
            g.translate(p.x, p.y);
            g.rotate(rount);//旋转度数
            g.drawImage(arrorImg, 5, -arrorImg.height / 2);
            g.restore();
        }
    },
    _drawlaneImgRoute: function (ctx, geom, imgsrc, boolPixelCrs, rount) {
        if (!imgsrc.src) {
            return;
        }
        var p = null;
        if (boolPixelCrs) {
            p = {x: geom[0], y: geom[1]}
        } else {
            p = this._tilePoint(ctx, imgsrc);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        var image = new Image();
        image.src = imgsrc.src;
        image.onload = function () {
            g.save();
            g.translate(p.x, p.y);
            g.rotate(rount);//旋转度数
            g.drawImage(image, -image.width / 2, -image.height / 2);
            g.restore();
        };
    },
    _drawlaneImgbound: function (ctx, geom, imgsrc, boolPixelCrs, rount) {
        if (!imgsrc.src) {
            return;
        }
        var p = null;
        if (boolPixelCrs) {
            p = {x: geom[0], y: geom[1]}
        } else {
            p = this._tilePoint(ctx, imgsrc);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        var image = new Image(),
            arrorImg = new Image();

        image.src = imgsrc.src;
        image.onload = function () {
            g.save();
            g.translate(p.x, p.y);
            g.rotate(rount);//旋转度数
            //以Canvas画布上的坐标(10,10)为起始点，绘制图像
            var proj = [{x:-image.width / 2,y:-image.height / 2},{x:image.width / 2,y:-image.height / 2},{x:image.width / 2,y:image.height / 2},{x:-image.width / 2,y:image.height / 2},{x:-image.width / 2,y:-image.height / 2}];
            g.strokeStyle = '#7FFFD4';
            g.beginPath();
            for (var j = 0; j < proj.length; j++) {
                var method = (j === 0 ? 'move' : 'line') + 'To';
                g[method](proj[j].x, proj[j].y);
            }
            g.stroke();

            g.restore();
        };
    },
    _drawText: function (ctx, geom, name) {
        geom = this._clip(ctx, geom);
        //var startPoint = null;
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.font = "10px Courier New";
        g.textAlign = "center";
        var angle,
            nameArr = name.split(""),
            nameLen = name.length * 10, lineLen = 0;
        if (geom.length === 2) {
            angle = this._rotateAngle(geom[0][0], geom[1][0]);
            lineLen = this.distance(geom[0][0], geom[1][0]);
            if (nameLen < lineLen/2 && lineLen > 160) {
                this._showTextOfAngle(g, 0, nameArr.length, name, angle, [(geom[0][0][0]+geom[1][0][0])/2,(geom[0][0][1]+geom[1][0][1])/2]);
            }

        } else {
            var startPoint = geom[0][0], startPointForLen = geom[0][0],endPoint = geom[geom.length-1][0],
                textLength = 0, startText = 0, textIndex = 0,
                betPointsLen, realLineLen = 0, linkArrLen = geom.length;
            for (var m = 1; m < linkArrLen; m++) {
                betPointsLen = this.distance(geom[m][0], startPointForLen);
                realLineLen += betPointsLen;
                startPointForLen = geom[m][0];
            }
            if (nameLen < realLineLen/2 && realLineLen > 50) {
                startPoint = geom[2][0]
                for (var linkFLag = 1; linkFLag < linkArrLen; linkFLag++) {
                    if (textLength < nameArr.length) {
                        betPointsLen = this.distance(geom[linkFLag][0], startPoint);
                        angle = this._rotateAngle(startPoint, geom[linkFLag][0]);
                        if (betPointsLen > 10) {
                            textIndex = parseInt(betPointsLen / 10);
                            this._showTextOfAngle(g, 0, nameArr.length, name, angle, startPoint);
                            break;
                        } else {
                            startPoint = geom[linkFLag][0];
                        }

                    }

                }
            }
        }
    },
    _drawBridge: function (cav, geom, that) {
        var c = cav.canvas;
        var ctx = c.getContext('2d');
        var oriStart, oriEnd;
        oriStart = geom[0][0];
        for (var i = 1, len = geom.length; i < len; i++) {
            oriEnd = geom[i][0];
            var angle = that._rotateAngle(oriStart, oriEnd),
                points = [];
            points = that._pointsFromAngle([oriStart, oriEnd], angle);
            that._drawObliqueLine(ctx, points, angle);
            oriStart = geom[i][0];
        }

    },
    _drawObliqueLine: function (ctx, points, angle) {
        var len = Math.floor(this.distance(points[0], points[1]) / 20);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FF0000";
        ctx.save();
        ctx.translate(points[0][0], points[0][1]);
        ctx.rotate(angle);
        ctx.beginPath();
        for (var i = 0; i < len; i++) {
            ctx.moveTo(i * 20, 0);
            ctx.lineTo(i * 20, -6);
        }
        //最后一个点
        ctx.moveTo(points[1][0] - points[0][0], 0);
        ctx.lineTo(points[1][0] - points[0][0], -6);
        ctx.stroke();
        ctx.restore();

    },
    /**
     * 字体的旋转角度
     * @param startPoint
     * @param endPoint
     * @returns {*}
     * @private
     */
    _rotateAngle: function (startPoint, endPoint) {
        var angle;
        if ((startPoint[0] - endPoint[0]) === 0) {
            angle = Math.PI / 2;
        } else {
            if ((startPoint[1] - endPoint[1]) === 0) {
                angle = 0;
            } else {
                angle = Math.atan((startPoint[1] - endPoint[1]) / (startPoint[0] - endPoint[0]));

            }
        }
        return angle;


    },
    _showTextOfAngle: function (ctx, start, end, name, angle, textGeom) {
        var nameArr = name.split(""), PI = Math.PI;
        if (angle === 0) {
            ctx.fillText(name, textGeom[0], textGeom[1]);
            ctx.save();
        } else if ((angle < PI && angle > 2 * (PI / 5))) {
            for (var i = start; i < end; i++) {
                ctx.fillText(nameArr[i], textGeom[0], textGeom[1] + i * 13);
                ctx.save();
            }
        } else {

            var showName = name.substr(start, end);
            ctx.save();
            ctx.translate(textGeom[0], textGeom[1]);
            ctx.rotate(angle);
            ctx.fillText(showName, 0, 0);
            ctx.restore();

        }

    },
    /***
     * _drawArrow绘制方向箭头
     * @param {Object}ctx
     * @param {Number}direct 绘制方向
     * @param {Array}data 点数组
     * @private
     */
    _drawArrow: function (ctx, direct, data) {
        ctx.linewidth = 2;
        ctx.strokeStyle = this.directColor;
        if (direct == 0 || direct == 1) {
            return;
        }

        for (var i = 0, len = data.length; i < len; i++) {
            for (var j = 0, len2 = data[i].length; j < len2 - 1; j = j + 2) {

                ctx.beginPath();
                ctx.translate(0, 0, 0);

                var point1 = data[i][j];
                var point2 = data[i][j + 1];
                var distance = this.distance(point1, point2);
                if (distance < 30) {
                    return;
                }

                ctx.save()
                var centerPoint = L.point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);

                ctx.translate(centerPoint.x, centerPoint.y);
                //先计算向量与y轴负方向向量(0,-1)的夹角


                var ang = 0;
                if (point1.y - point2.y == 0) {
                    if (point1.x - point2.x > 0) {
                        ang = Math.PI / -2;
                    }
                    else {
                        ang = Math.PI / 2;
                    }
                }
                else {
                    ang = (point1.x - point2.x) / (point1.y - point2.y);
                    ang = Math.atan(ang);
                }
                if (point2.y - point1.y >= 0) {
                    if (direct == 2) {
                        ctx.rotate(-ang);
                    } else if (direct == 3) {
                        ctx.rotate(-ang + Math.PI);
                    }
                } else {
                    if (direct == 2) {
                        ctx.rotate(Math.PI - ang); //加个180度，反过来
                    } else if (direct == 3) {
                        ctx.rotate(-ang);
                    }

                }
                ctx.lineTo(-3, -6);
                ctx.lineTo(0, 1);
                ctx.lineTo(3, -6);
                ctx.lineTo(0, 0);
                ctx.stroke();
                ctx.fill(); //箭头是个封闭图形
                ctx.closePath();
                ctx.restore();   //恢复到堆的上一个状态，其实这里没什么用。
            }
        }
    },
    /**
     * 画区域内的道路
     * @param ctx
     * @param points
     * @param dashLength
     * @param that
     * @private
     */
    _drawDashLineOfAngle: function (ctx, points, dashLength, that) {
        var endPoint,
            startPoint = points[0][0];
        for (var i = 1, len = points.length; i < len; i++) {
            endPoint = points[i][0];
            var angle = that._rotateAngle(startPoint, endPoint);
            that._drawDashLine(ctx, [startPoint, endPoint], angle, dashLength, that);
            startPoint = points[i][0];

        }
    },
    /**
     * 画虚线
     * @param ctx
     * @param points
     * @param angle
     * @param dashLength
     * @param self
     * @private
     */
    _drawDashLine: function (ctx, points, angle, dashLength, self) {

        var pointsOfChange = self._pointsFromAngle(points, angle);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        var xPos = points[1][0] - points[0][0],
            yPos = points[1][1] - points[0][1];
        var dash = Math.floor(Math.sqrt(xPos * xPos + yPos * yPos) / dashLength);
        ctx.save();
        ctx.translate(pointsOfChange[0][0], pointsOfChange[0][1]);
        ctx.rotate(angle);
        ctx.beginPath();
        for (var i = 0; i < dash; i++) {
            if (i % 2) {

                ctx.lineTo(dashLength * i, 0);
            } else {
                ctx.moveTo(dashLength * i, 0);
            }

        }
        ctx.stroke();
        ctx.restore();
    },
    /***
     * 绘制线
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 绘制几何对象
     * @param {Object}style 样式
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @private
     */
    _drawLineString: function (ctx, geom, boolPixelCrs, linestyle, nodestyle, properties) {
        if (!linestyle) {
            return;
        }
        var direct = properties.direct,
            coords = geom, proj = [],
            arrowlist = [];
        coords = this._clip(ctx, coords);

        for (var i = 0; i < coords.length; i++) {

            if (this._map.getZoom() >= this.showNodeLevel && (i == 0 || i == coords.length - 1)) {
                this._drawPoint(ctx, coords[i][0], nodestyle, true);
            }

            if (boolPixelCrs) {
                proj.push({x: coords[i][0][0], y: coords[i][0][1]});
            } else {
                proj.push(this._tilePoint(ctx, coords[i]));
            }

        }
        var g = ctx.canvas.getContext('2d');
        g.strokeStyle = linestyle.color;
        g.lineWidth = linestyle.size;
        g.beginPath();
        for (var j = 0; j < proj.length; j++) {
            var method = (j === 0 ? 'move' : 'line') + 'To';
            g[method](proj[j].x, proj[j].y);
            if (j < proj.length - 1) {
                var oneArrow = [proj[j], proj[j + 1]];
                arrowlist.push(oneArrow);
            }

        }
        g.stroke();
        g.restore();
        if (direct == null || typeof(direct) == "undefined" || direct == "") {
        } else {
            if (this._map.getZoom() >= this.showNodeLevel) {
                this._drawArrow(g, direct, arrowlist);
            }

        }
        //道路的名字
        if (properties.name) {
            if (this._map.getZoom() >= this.showNodeLevel) {
                this._drawText(ctx, geom, properties.name);
            }

        }
    },

    /***
     * 绘制polygon
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 几何对象
     * @param {Object}style 样式
     * @private
     */
    _drawPolygon: function (ctx, geom, style) {
        if (!style) {
            return;
        }

        for (var el = 0; el < geom.length; el++) {
            var coords = geom[el], proj = [], i;
            coords = this._clip(ctx, coords);
            for (i = 0; i < coords.length; i++) {
                proj.push(this._tilePoint(ctx, coords[i]));
            }
            if (!this._isActuallyVisible(proj)) {
                continue;
            }

            var g = ctx.canvas.getContext('2d');
            var outline = style.outline;
            g.fillStyle = style.color;
            if (outline) {
                g.strokeStyle = outline.color;
                g.lineWidth = outline.size;
            }
            g.beginPath();
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                g[method](proj[i].x, proj[i].y);
            }
            g.closePath();
            g.fill();
            if (outline) {
                g.stroke();
            }
        }
    }
}