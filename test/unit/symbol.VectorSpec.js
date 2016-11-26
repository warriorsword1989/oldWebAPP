/**
 * Created by xujie on 2016/5/13 0013.
 */

define(['symbol.Vector'], function () {
    describe('symbol.Vector类', function () {
        var vector1;
        var vector2;

        beforeEach(function () {
            vector1 = new fastmap.mapApi.symbol.Vector(1, 0);
            vector2 = new fastmap.mapApi.symbol.Vector(0, 1);
        });

        describe('minus函数', function () {
            it('减法运算测试', function () {
                var vector3 = vector1.minus(vector2);
                expect(vector3.x).toEqual(1);
                expect(vector3.y).toEqual(-1);
            });
        });

        describe('plus函数', function () {
            it('加法运算测试', function () {
                var vector3 = vector1.plus(vector2);
                expect(vector3.x).toEqual(1);
                expect(vector3.y).toEqual(1);
            });
        });

        describe('multiNumber函数', function () {
            it('和数字的乘法运算测试', function () {
                var vector3 = vector1.multiNumber(10);
                expect(vector3.x).toEqual(10);
                expect(vector3.y).toEqual(0);
            });
        });

        describe('dividNumber函数', function () {
            it('和数字的除法运算测试', function () {
                var vector3 = vector1.dividNumber(2);
                expect(vector3.x).toEqual(0.5);
                expect(vector3.y).toEqual(0);
            });
        });

        describe('cross函数', function () {
            it('叉乘运算测试', function () {
                var result = vector1.cross(vector2);
                expect(result).toEqual(1);

                result = vector2.cross(vector1);
                expect(result).toEqual(-1);
            });
        });

        describe('dot函数', function () {
            it('点乘运算测试', function () {
                var result = vector1.dot(vector2);
                expect(result).toEqual(0);
            });
        });

        describe('length2函数', function () {
            it('求模长平方', function () {
                var result = vector1.length2();
                expect(result).toEqual(1);
            });
        });

        describe('length函数', function () {
            it('求模长', function () {
                var result = vector1.length();
                expect(result).toEqual(1);
            });
        });

        describe('normalize函数', function () {
            it('单位化', function () {
                vector1.normalize();
                expect(vector1.x).toEqual(1);
                expect(vector1.y).toEqual(0);
            });
        });

        describe('crossMatrix函数', function () {
            it('向量乘以矩阵进行坐标变换', function () {
                var matrix = new fastmap.mapApi.symbol.Matrix();
                matrix = matrix.makeRotate(90);
                var vector = vector1.crossMatrix(matrix);
                expect(vector.x).toBeCloseTo(0);
                expect(vector.y).toBeCloseTo(1);
            });
        });

        describe('angleTo函数', function () {
            it('y到x轴的夹角应该为90', function () {
                var v1 = new fastmap.mapApi.symbol.Vector(0, 1);
                var v2 = new fastmap.mapApi.symbol.Vector(1, 0);
                expect(v1.angleTo(v2)).toBeCloseTo(90);
            });

            it('y到-y轴的夹角应该为108', function () {
                var v1 = new fastmap.mapApi.symbol.Vector(0, 1);
                var v2 = new fastmap.mapApi.symbol.Vector(0, -1);
                expect(v1.angleTo(v2)).toBeCloseTo(180);
            });
        });
    });
});
