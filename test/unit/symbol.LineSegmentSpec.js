/**
 * Created by xujie on 2016/5/13 0013.
 */

define(['symbol.LineSegment'], function () {
    describe('symbol.LineSegment类', function () {
        var start;
        var end;
        var lineSegment;

        beforeEach(function () {
            start = new fastmap.mapApi.symbol.Point(1, 0);
            end = new fastmap.mapApi.symbol.Point(0, 1);
            lineSegment = new fastmap.mapApi.symbol.LineSegment(start, end);
        });

        describe('构造函数', function () {
            it('无参数构造函数应该正确初始化成员变量', function () {
                var lineSegment1 = new fastmap.mapApi.symbol.LineSegment();
                expect(lineSegment1.start.x).toEqual(0);
                expect(lineSegment1.start.y).toEqual(0);

                expect(lineSegment1.end.x).toEqual(0);
                expect(lineSegment1.end.y).toEqual(0);
            });

            it('带参数构造函数应该正确初始化成员变量', function () {
                expect(lineSegment.start).not.toBe(start);
                expect(lineSegment.end).not.toBe(end);

                expect(lineSegment.start.equal(start)).toEqual(true);
                expect(lineSegment.end.equal(end)).toEqual(true);
            });
        });

        describe('clone函数', function () {
            it('clone的对象应该和原对象内容相同', function () {
                var lineSegment1 = lineSegment.clone();
                expect(lineSegment1.start.equal(start)).toEqual(true);
                expect(lineSegment1.end.equal(end)).toEqual(true);
            });

            it('clone的对象应该和原对象不是同一个对象', function () {
                var lineSegment1 = lineSegment.clone();
                expect(lineSegment1).not.toBe(lineSegment);
                expect(lineSegment1.start).not.toBe(start);
                expect(lineSegment1.end).not.toBe(end);
            });
        });

        describe('length函数', function () {
            it('计算线段长度测试', function () {
                var distance = start.distance(end);
                expect(lineSegment.length()).toBeCloseTo(distance);
            });
        });

        describe('getPointByLength函数', function () {
            it('指定长度小于0时应该返回start.clone', function () {
                var point = lineSegment.getPointByLength(-1);
                expect(point).not.toBe(start);
                expect(point.equal(start)).toEqual(true);
            });

            it('指定长度等于0时应该返回start.clone', function () {
                var point = lineSegment.getPointByLength(0);
                expect(point).not.toBe(start);
                expect(point.equal(start)).toEqual(true);
            });

            it('指定长度大于线段长度时应该返回end.clone', function () {
                var point = lineSegment.getPointByLength(Math.sqrt(2));
                expect(point).not.toBe(end);
                expect(point.equal(end)).toEqual(true);
            });

            it('指定长度等于线段长度时应该返回end.clone', function () {
                var point = lineSegment.getPointByLength(10);
                expect(point).not.toBe(end);
                expect(point.equal(end)).toEqual(true);
            });

            it('应该返回（0.5，0.5）', function () {
                var point = lineSegment.getPointByLength(Math.sqrt(2) / 2);
                expect(point.x).toEqual(0.5);
                expect(point.y).toEqual(0.5);
            });
        });
    });
});
