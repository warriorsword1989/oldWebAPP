/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.CrossPointSymbol = L.Class.extend({
    initialize: function () {
        this.type = 'CrossPointSymbol';

        this.size = 10;
        this.color = '#000000';
        this.width = 1;

        this.offsetX = 0;
        this.offsetY = 0;

        this.angle = 0;

        this.hasOutLine = false;
        this.outLineColor = '#000000';
        this.outLineWidth = 1;
        this.geometry = null;

        this.translate = [];
    },

    draw: function (ctx) {
        if (this.geometry === null) {
            return;
        }

        this.translate = this.getTranslate();

        // 绘制前，先恢复到上次保存的状态，通常是初始状态，避免受到以前绘制设置的影响
        ctx.restore();

        // 保存一下当前状态，方便绘制完成后恢复状态
        ctx.save();

        this.drawSquare(ctx);

        // 绘制完成后恢复到上次保存的状态，通常是初始状态，避免影响以后的绘制
        ctx.restore();
    },

    getTranslate: function () {
        var translates = [],
            matrix;
        matrix = new fastmap.mapApi.symbol.Matrix();
        translates.push(matrix.makeTranslate(-this.geometry.x, -this.geometry.y));
        translates.push(matrix.makeRotate(this.angle));
        translates.push(matrix.makeTranslate(this.offsetX, this.offsetY));
        translates.push(matrix.makeTranslate(this.geometry.x, this.geometry.y));

        return translates;
    },

    transform: function (geometry) {
        var i;
        for (i = 0; i < this.translate.length; ++i) {
            geometry = geometry.crossMatrix(this.translate[i]);
        }

        return geometry;
    },

    drawSquare: function (ctx) {
        var crossGeometry,
            i,
            j,
            k,
            geometry;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;

        crossGeometry = this.getCrossGeometry();

        for (i = 0; i < crossGeometry.coordinates.length; ++i) {
            crossGeometry.coordinates[i] = this.transform(crossGeometry.coordinates[i]);
        }

        ctx.beginPath();
        ctx.moveTo(crossGeometry.coordinates[0].x, crossGeometry.coordinates[0].y);
        ctx.lineTo(crossGeometry.coordinates[1].x, crossGeometry.coordinates[1].y);
        ctx.moveTo(crossGeometry.coordinates[2].x, crossGeometry.coordinates[2].y);
        ctx.lineTo(crossGeometry.coordinates[3].x, crossGeometry.coordinates[3].y);
        ctx.stroke();

        if (this.hasOutLine) {
            ctx.strokeStyle = this.outLineColor;
            ctx.lineWidth = this.outLineWidth;

            geometry = this.getSquareGeometry();

            for (j = 0; j < geometry.coordinates.length; ++j) {
                geometry.coordinates[j] = this.transform(geometry.coordinates[j]);
            }

            ctx.beginPath();
            ctx.moveTo(geometry.coordinates[0].x, geometry.coordinates[0].y);
            for (k = 1; k < geometry.coordinates.length; ++k) {
                ctx.lineTo(geometry.coordinates[k].x, geometry.coordinates[k].y);
            }
            ctx.stroke();
        }
    },

    getCrossGeometry: function () {
        var crossGeometry = new fastmap.mapApi.symbol.LineString();
        crossGeometry.coordinates.push(
          new fastmap.mapApi.symbol.Point(this.geometry.x - this.size, this.geometry.y));
        crossGeometry.coordinates.push(
          new fastmap.mapApi.symbol.Point(this.geometry.x + this.size, this.geometry.y));
        crossGeometry.coordinates.push(
          new fastmap.mapApi.symbol.Point(this.geometry.x, this.geometry.y - this.size));
        crossGeometry.coordinates.push(
          new fastmap.mapApi.symbol.Point(this.geometry.x, this.geometry.y + this.size));

        return crossGeometry;
    },

    getSquareGeometry: function () {
        var squareGeometry = new fastmap.mapApi.symbol.LineString();
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(
          this.geometry.x - this.size, this.geometry.y - this.size));
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(
          this.geometry.x + this.size, this.geometry.y - this.size));
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(
          this.geometry.x + this.size, this.geometry.y + this.size));
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(
          this.geometry.x - this.size, this.geometry.y + this.size));
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(
          this.geometry.x - this.size, this.geometry.y - this.size));

        return squareGeometry;
    }
});
