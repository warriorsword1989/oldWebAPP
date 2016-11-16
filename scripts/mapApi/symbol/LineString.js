/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.LineString = L.Class.extend({

    initialize: function (geometry) {
        var i,
            point;
        this.coordinates = [];
        if (geometry !== undefined) {
            for (i = 0; i < geometry.length; ++i) {
                point = new fastmap.mapApi.symbol.Point(geometry[i][0], geometry[i][1]);
                this.coordinates.push(point);
            }
        }
    },

    /**
     * 克隆对象
     * @method clone
     * @return fastmap.mapApi.symbol.LineString 克隆的对象
     */
    clone: function () {
        var i,
            point;
        var cloneLineString = new fastmap.mapApi.symbol.LineString();
        for (i = 0; i < this.coordinates.length; ++i) {
            point = this.coordinates[i].clone();
            cloneLineString.coordinates.push(point);
        }

        return cloneLineString;
    },

    /**
     * 计算线长度
     * @method length
     * @return Number 线长度
     */
    length: function () {
        var length,
            i,
            prePoint,
            point;
        if (this.coordinates.length < 2) {
            return 0;
        }
        length = 0;
        for (i = 1; i < this.coordinates.length; ++i) {
            prePoint = this.coordinates[i - 1];
            point = this.coordinates[i];
            length += point.distance(prePoint);
        }

        return length;
    },

    /**
     * 计算线几何在指定长度处的点（不一定是形状点），以及前后点索引
     * 当指定长度小于等于0时，返回['start']
     * 当指定长度大于或等于两点之间总长度时，返回['end']
     * 当指定长度处的点刚好是形状点时，返回['vertex',i-1，i+1， [xi, yi]]
     * 当指定长度处的点不是形状点时，返回['betweenVertex',i-1，i， [xn, yn]]
     * @method splitGeometry
     * @param length 要切分的长度
     * @return Array 点坐标
     */
    getPointByLength: function (length) {
        var result = [],
            geometryLength,
            tmpLength,
            i,
            prePoint,
            curPoint,
            segmentLength,
            remainLength,
            line,
            point;

        if (length <= 0) {
            result.push('start');
            return result;
        }

        geometryLength = this.length();
        if (length >= geometryLength) {
            result.push('end');
            return result;
        }

        tmpLength = 0;

        for (i = 1; i < this.coordinates.length; ++i) {
            prePoint = this.coordinates[i - 1];

            curPoint = this.coordinates[i];
            segmentLength = curPoint.distance(prePoint);
            if (tmpLength + segmentLength < length) {
                tmpLength += segmentLength;
            } else if (tmpLength + segmentLength === length) {
                result.push('vertex');
                result.push(i - 1);
                result.push(i + 1);
                result.push(curPoint.clone());
                break;
            } else {
                remainLength = length - tmpLength;
                line = new fastmap.mapApi.symbol.LineSegment(prePoint, curPoint);
                point = line.getPointByLength(remainLength);
                result.push('betweenVertex');
                result.push(i - 1);
                result.push(i);
                result.push(point);

                break;
            }
        }

        return result;
    },

    /**
     * 在指定长度处将线几何切分成两段
     *
     * 当指定长度大于几何长度时，返回[LineString,null]
     * 当指定长度小于等于0时，返回[null,LineString]
     * @method splitByLength
     * @param length 要切分的长度
     * @return Array [subLineString1,subLineString2]
     */
    splitByLength: function (length) {
        var result = this.getPointByLength(length);

        var subLineString1;
        var subLineString2;
        switch (result[0]) {
        case 'start':
            subLineString1 = null;
            subLineString2 = this.clone();
            break;
        case 'end':
            subLineString1 = this.clone();
            subLineString2 = null;
            break;
        case 'vertex':
        case 'betweenVertex':
            subLineString1 = this.slice(0, result[1] + 1);// 获取从0到result[1]部分
            subLineString1.coordinates.push(result[3]);
            subLineString2 = this.slice(result[2]);// 获取从result[1]到结束部分
            subLineString2.coordinates.unshift(result[3]);// 在subGeometry2起始出插入result[2]
            break;
        default :
            throw new Error('运行时未知错误');
        }

        return [subLineString1, subLineString2];
    },

    /**
     * 拷贝LineString指定位置，坐标深拷贝，[start，end）
     * 如果end是undefined，则拷贝[start,length - 1]
     * @method slice
     * @param start
     * @param end
     * @return fastmap.mapApi.symbol.LineString
     */
    slice: function (start, end) {
        var newLineString,
            i;
        if (end === undefined || end > this.coordinates.length) {
            end = this.coordinates.length;
        }

        if (start < 0) {
            start = 0;
        }

        newLineString = new fastmap.mapApi.symbol.LineString();
        for (i = start; i < end; ++i) {
            newLineString.coordinates.push(this.coordinates[i].clone());
        }

        return newLineString;
    },

    /**
     * 判断两个LineString坐标是否相等
     * @method equal
     * @param lineString
     * @return {boolean}
     */
    equal: function (lineString) {
        if (this.coordinates.length !== lineString.coordinates.length) {
            return false;
        }

        for (var i = 0; i < this.coordinates.length; ++i) {
            if (!this.coordinates[i].equal(lineString.coordinates[i])) {
                return false;
            }
        }

        return true;
    }
});
