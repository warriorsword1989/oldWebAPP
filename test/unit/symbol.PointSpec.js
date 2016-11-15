/**
 * Created by xujie on 2016/5/13 0013.
 */

define(['symbol.Point'], function () {
    describe('symbol.Point类', function () {
        var point;

        beforeEach(function () {
            point = new fastmap.mapApi.symbol.Point(1, 2);
        });

        describe('clone函数', function () {
            it('clone的对象应该和原对象不是同一个对象', function () {
                var clonePoint = point.clone();
                expect(clonePoint).not.toBe(point);
            });

            it('clone的对象应该和原对象内容相同', function () {
                var clonePoint = point.clone();
                expect(clonePoint).toEqual(point);
            });
        });

        describe('distance函数', function () {
            it('1,2到0，0的距离应该是2.23606797749979', function () {
                var point1 = new fastmap.mapApi.symbol.Point();
                var distance = point.distance(point1);
                expect(distance).toEqual(2.23606797749979);
            });
        });

        describe('minus函数', function () {
            it('两个点相减应该得到一个向量', function () {
                var point1 = new fastmap.mapApi.symbol.Point();
                var vector = point.minus(point1);
                expect(vector.x).toEqual(1);
                expect(vector.y).toEqual(2);
            });
        });

        describe('crossMatrix函数', function () {
            it('点乘以矩阵进行坐标变换', function () {
                var matrix = new fastmap.mapApi.symbol.Matrix();
                matrix = matrix.makeRotate(90);
                var point1 = new fastmap.mapApi.symbol.Point(1, 1);
                point1 = point1.crossMatrix(matrix);
                expect(point1.x).toBeCloseTo(-1);
                expect(point1.y).toBeCloseTo(1);
            });
        });

        describe('equal函数', function () {
            it('point1和point不相等', function () {
                var point1 = new fastmap.mapApi.symbol.Point(1, 1);
                expect(point.equal(point1)).toEqual(false);
            });

            it('point1和point相等', function () {
                var point1 = new fastmap.mapApi.symbol.Point(1, 2);
                expect(point.equal(point1)).toEqual(true);
            });
        });

        describe('plusVector函数', function () {
            it('应该返回（3，5）', function () {
                var vector = new fastmap.mapApi.symbol.Vector(2, 3);
                var point1 = point.plusVector(vector);
                expect(point1.x).toEqual(3);
                expect(point1.y).toEqual(5);
            });
        });
    });
});
