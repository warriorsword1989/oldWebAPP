/**
 * Created by xujie on 2016/5/13 0013.
 */

define(['symbol.Matrix'], function () {
    describe('symbol.Matrix类', function () {
        var matrix1;
        var matrix2;

        beforeEach(function () {
            matrix1 = new fastmap.mapApi.symbol.Matrix();
            matrix2 = new fastmap.mapApi.symbol.Matrix();
            matrix2.data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        });

        describe('cross函数', function () {
            it('叉乘运算测试', function () {
                var matrix = matrix1.cross(matrix2);
                expect(matrix.data).toEqual(matrix2.data);
            });
        });

        describe('makeTranslate函数', function () {
            it('平移运算测试', function () {
                var matrix = matrix1.makeTranslate(10, 20);
                expect(matrix.data).toEqual([[1, 0, 0], [0, 1, 0], [10, 20, 1]]);
            });
        });

        describe('makeRotate函数', function () {
            it('旋转运算测试', function () {
                var matrix = matrix1.makeRotate(90);
                expect(matrix.data[0][0]).toBeCloseTo(0);
                expect(matrix.data[0][1]).toBeCloseTo(1);
                expect(matrix.data[0][2]).toBeCloseTo(0);
                expect(matrix.data[1][0]).toBeCloseTo(-1);
                expect(matrix.data[1][1]).toBeCloseTo(0);
                expect(matrix.data[1][2]).toBeCloseTo(0);
                expect(matrix.data[2]).toEqual([0, 0, 1]);
            });
        });

        describe('makeScale函数', function () {
            it('缩放运算测试', function () {
                var matrix = matrix1.makeScale(10, 20);
                expect(matrix.data).toEqual([[10, 0, 0], [0, 20, 0], [0, 0, 1]]);
            });
        });
    });
});
