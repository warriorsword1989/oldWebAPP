/**
 * Created by xujie on 2016/5/13 0013.
 */

define(['symbol.LineString'], function () {
    describe('symbol.LineString类', function () {
        var geometry;
        var lineString;

        beforeEach(function () {
            geometry = [];
            geometry.push(new fastmap.mapApi.symbol.Point(0, 0));
            geometry.push(new fastmap.mapApi.symbol.Point(0, 2));
            geometry.push(new fastmap.mapApi.symbol.Point(0, 4));
            geometry.push(new fastmap.mapApi.symbol.Point(0, 6));
            lineString = new fastmap.mapApi.symbol.LineString();
            lineString.coordinates = geometry;
        });

        describe('构造函数', function () {
            it('无参数构造函数应该正确初始化成员变量', function () {
                var lineSegment1 = new fastmap.mapApi.symbol.LineString();
                expect(lineSegment1.coordinates).toEqual([]);
            });

            it('带参数构造函数应该正确初始化成员变量', function () {
                var geometry1 = [[0, 0], [1, 1]];
                var lineSegment1 = new fastmap.mapApi.symbol.LineString(geometry1);

                expect(lineSegment1.coordinates.length).toEqual(2);
                expect(lineSegment1.coordinates[0].x).toEqual(0);
                expect(lineSegment1.coordinates[0].y).toEqual(0);

                expect(lineSegment1.coordinates[1].x).toEqual(1);
                expect(lineSegment1.coordinates[1].y).toEqual(1);
            });
        });

        describe('clone函数', function () {
            it('clone的对象应该和原对象不是同一个对象', function () {
                var cloneLineString = lineString.clone();
                expect(cloneLineString).not.toBe(lineString);
            });

            it('clone的对象应该和原对象内容相同', function () {
                var cloneLineString = lineString.clone();
                expect(cloneLineString.equal(lineString)).toEqual(true);
            });
        });

        describe('length函数', function () {
            it('应该返回6', function () {
                expect(lineString.length()).toEqual(6);
            });
        });

        describe('getPointByLength函数', function () {
            it('指定长度小于0时返回[start]', function () {
                var result = lineString.getPointByLength(-1);
                expect(result.length).toEqual(1);
                expect(result[0]).toEqual('start');
            });

            it('指定长度等于0时返回[start]', function () {
                var result = lineString.getPointByLength(0);
                expect(result.length).toEqual(1);
                expect(result[0]).toEqual('start');
            });

            it('指定长度大于LineString长度0时返回[end]', function () {
                var result = lineString.getPointByLength(10);
                expect(result.length).toEqual(1);
                expect(result[0]).toEqual('end');
            });

            it('指定长度等于LineString长度0时返回[end]', function () {
                var result = lineString.getPointByLength(6);
                expect(result.length).toEqual(1);
                expect(result[0]).toEqual('end');
            });

            it('指定长度落在形状点上', function () {
                var result = lineString.getPointByLength(4);
                expect(result.length).toEqual(4);
                expect(result[0]).toEqual('vertex');
                expect(result[1]).toEqual(1);
                expect(result[2]).toEqual(3);
                expect(result[3].x).toEqual(0);
                expect(result[3].y).toEqual(4);
            });

            it('指定长度落在形状之间', function () {
                var result = lineString.getPointByLength(3);
                expect(result.length).toEqual(4);
                expect(result[0]).toEqual('betweenVertex');
                expect(result[1]).toEqual(1);
                expect(result[2]).toEqual(2);
                expect(result[3].x).toEqual(0);
                expect(result[3].y).toEqual(3);
            });
        });

        describe('splitByLength函数', function () {
            it('指定长度小于0时返回[null,lineString]', function () {
                var result = lineString.splitByLength(-1);
                expect(result.length).toEqual(2);
                expect(result[0]).toEqual(null);
                expect(result[1].equal(lineString)).toEqual(true);
                expect(result[1]).not.toBe(true);
            });

            it('指定长度小于0时返回[null,lineString]', function () {
                var result = lineString.splitByLength(0);
                expect(result.length).toEqual(2);
                expect(result[0]).toEqual(null);
                expect(result[1].equal(lineString)).toEqual(true);
                expect(result[1]).not.toBe(true);
            });

            it('指定长度大于LineString长度0时返回[LineString,null]', function () {
                var result = lineString.splitByLength(10);
                expect(result.length).toEqual(2);
                expect(result[0].equal(lineString)).toEqual(true);
                expect(result[0]).not.toBe(true);
                expect(result[1]).toEqual(null);
            });

            it('指定长度等于LineString长度0时返回[LineString,null]', function () {
                var result = lineString.splitByLength(10);
                expect(result.length).toEqual(2);
                expect(result[0].equal(lineString)).toEqual(true);
                expect(result[0]).not.toBe(true);
                expect(result[1]).toEqual(null);
            });

            it('指定长度落在形状点上', function () {
                var result = lineString.splitByLength(4);
                expect(result.length).toEqual(2);
                expect(result[0].coordinates.length).toEqual(3);
                expect(result[0].coordinates[0].x).toEqual(0);
                expect(result[0].coordinates[0].y).toEqual(0);
                expect(result[0].coordinates[1].x).toEqual(0);
                expect(result[0].coordinates[1].y).toEqual(2);
                expect(result[0].coordinates[2].x).toEqual(0);
                expect(result[0].coordinates[2].y).toEqual(4);

                expect(result[1].coordinates.length).toEqual(2);
                expect(result[1].coordinates[0].x).toEqual(0);
                expect(result[1].coordinates[0].y).toEqual(4);
                expect(result[1].coordinates[1].x).toEqual(0);
                expect(result[1].coordinates[1].y).toEqual(6);
            });

            it('指定长度落在形状之间', function () {
                var result = lineString.splitByLength(3);
                expect(result.length).toEqual(2);
                expect(result[0].coordinates.length).toEqual(3);
                expect(result[0].coordinates[0].x).toEqual(0);
                expect(result[0].coordinates[0].y).toEqual(0);
                expect(result[0].coordinates[1].x).toEqual(0);
                expect(result[0].coordinates[1].y).toEqual(2);
                expect(result[0].coordinates[2].x).toEqual(0);
                expect(result[0].coordinates[2].y).toEqual(3);

                expect(result[1].coordinates.length).toEqual(3);
                expect(result[1].coordinates[0].x).toEqual(0);
                expect(result[1].coordinates[0].y).toEqual(3);
                expect(result[1].coordinates[1].x).toEqual(0);
                expect(result[1].coordinates[1].y).toEqual(4);
                expect(result[1].coordinates[2].x).toEqual(0);
                expect(result[1].coordinates[2].y).toEqual(6);
            });
        });

        describe('slice函数', function () {
            it('不指定结束位置', function () {
                var lineString1 = lineString.slice(2);
                expect(lineString1.coordinates.length).toEqual(2);
                expect(lineString1.coordinates[0].x).toEqual(0);
                expect(lineString1.coordinates[0].y).toEqual(4);
                expect(lineString1.coordinates[1].x).toEqual(0);
                expect(lineString1.coordinates[1].y).toEqual(6);
            });

            it('指定结束位置', function () {
                var lineString1 = lineString.slice(1, 3);
                expect(lineString1.coordinates.length).toEqual(2);
                expect(lineString1.coordinates[0].x).toEqual(0);
                expect(lineString1.coordinates[0].y).toEqual(2);
                expect(lineString1.coordinates[1].x).toEqual(0);
                expect(lineString1.coordinates[1].y).toEqual(4);
            });

            it('坐标点应该不是原来的坐标点对象', function () {
                var lineString1 = lineString.slice(1, 3);
                expect(lineString1.coordinates.length).toEqual(2);
                expect(lineString1.coordinates[0]).not.toBe(geometry[1]);
                expect(lineString1.coordinates[1]).not.toBe(geometry[2]);
            });

            it('开始位置小于0', function () {
                var lineString1 = lineString.slice(-1, 1);
                expect(lineString1.coordinates.length).toEqual(1);
            });

            it('开始位置等于0', function () {
                var lineString1 = lineString.slice(0, 1);
                expect(lineString1.coordinates.length).toEqual(1);
            });

            it('结束位置等于length', function () {
                var lineString1 = lineString.slice(2, 4);
                expect(lineString1.coordinates.length).toEqual(2);
            });

            it('结束位置等于大于length', function () {
                var lineString1 = lineString.slice(2, 5);
                expect(lineString1.coordinates.length).toEqual(2);
            });
        });
    });
});
