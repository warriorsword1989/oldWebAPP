/**
 * Created by xujie on 2016/5/12 0012.
 */

define(['symbol.Template'], function () {
    describe('symbol.Template类', function () {
        describe('构造函数', function () {
            it('无参数构造函数应该正确初始化成员变量', function () {
                var template = new fastmap.mapApi.symbol.Template();
                expect(template.pattern).toEqual([]);
                expect(template.lineString).toEqual(null);
            });

            it('带参数构造函数应该正确初始化成员变量', function () {
                var pattern = [1, 2];
                var lineString = new fastmap.mapApi.symbol.LineString();
                var template = new fastmap.mapApi.symbol.Template(pattern, lineString);
                expect(template.pattern).toBe(pattern);
                expect(template.lineString).toBe(lineString);
            });
        });

        describe('getSegments函数', function () {
            var geometry;
            var template;
            var pattern;

            beforeEach(function () {
                geometry = new fastmap.mapApi.symbol.LineString();
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 0));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 2));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 4));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 6));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 8));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 10));

                pattern = [2, 1];

                template = new fastmap.mapApi.symbol.Template(pattern, geometry);
            });
            it('geometry应该被切分成4段', function () {
                var segments = template.getSegments();
                expect(segments.length).toEqual(4);
            });

            it('每一段的坐标应该正确', function () {
                template.pattern = [2, 1];
                var segments = template.getSegments();

                expect(segments[0].coordinates[0].x).toEqual(0);
                expect(segments[0].coordinates[0].y).toEqual(0);
                expect(segments[0].coordinates[1].x).toEqual(0);
                expect(segments[0].coordinates[1].y).toEqual(2);
                expect(segments[0].coordinates[2].x).toEqual(0);
                expect(segments[0].coordinates[2].y).toEqual(3);

                expect(segments[1].coordinates[0].x).toEqual(0);
                expect(segments[1].coordinates[0].y).toEqual(3);
                expect(segments[1].coordinates[1].x).toEqual(0);
                expect(segments[1].coordinates[1].y).toEqual(4);
                expect(segments[1].coordinates[2].x).toEqual(0);
                expect(segments[1].coordinates[2].y).toEqual(6);

                expect(segments[2].coordinates[0].x).toEqual(0);
                expect(segments[2].coordinates[0].y).toEqual(6);
                expect(segments[2].coordinates[1].x).toEqual(0);
                expect(segments[2].coordinates[1].y).toEqual(8);
                expect(segments[2].coordinates[2].x).toEqual(0);
                expect(segments[2].coordinates[2].y).toEqual(9);

                expect(segments[3].coordinates[0].x).toEqual(0);
                expect(segments[3].coordinates[0].y).toEqual(9);
                expect(segments[3].coordinates[1].x).toEqual(0);
                expect(segments[3].coordinates[1].y).toEqual(10);
            });

            it('模式为元素个数为0时应该返回[geometry]', function () {
                template.pattern = [];
                var segments = template.getSegments();

                expect(segments.length).toEqual(1);

                expect(segments[0].equal(geometry)).toEqual(true);
            });

            it('geometry坐标元素个数为0时应该返回[]', function () {
                template.lineString = new fastmap.mapApi.symbol.LineString();
                var segments = template.getSegments();

                expect(segments).toEqual([]);
            });

            it('应该保证pattern元素不会被改变', function () {
                template.pattern = [1, 2, 3];
                template.getSegments();

                expect(template.pattern).toEqual([1, 2, 3]);
            });

            it('切分出来的几何应该和原几何不是同一个对象', function () {
                template.pattern = [];
                var segments = template.getSegments();

                expect(segments[0]).not.toBe(geometry);
            });

            it('新几何中的点都和原几何中点应该不是同一个对象', function () {
                var segments = template.getSegments();
                expect(segments[0].coordinates[0]).not.toBe(geometry.coordinates[0]);
            });

            it('当pattern元素个数为奇数时应该自动重复pattern进行计算', function () {
                template.pattern = [2];
                var segments = template.getSegments();
                expect(segments.length).toEqual(3);
            });

            it('当pattern长度大于geometry时应该只有一个段', function () {
                template.pattern = [6, 6];
                var segments = template.getSegments();
                expect(segments.length).toEqual(1);
                expect(segments[0].equal(geometry)).toEqual(true);
            });
        });

        describe('getMarks函数', function () {
            var geometry;
            var template;

            beforeEach(function () {
                geometry = new fastmap.mapApi.symbol.LineString();
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 0));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 2));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 4));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 6));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 8));
                geometry.coordinates.push(new fastmap.mapApi.symbol.Point(0, 10));

                template = new fastmap.mapApi.symbol.Template();
            });

            it('当pattern元素长度大于geometry时应该只有一个mark', function () {
                template.pattern = [20, 20];
                var marks = template.getMarks(geometry);
                expect(marks.length).toEqual(1);
                expect(marks[0].equal(geometry)).toEqual(true);
            });

            it('当pattern没有元素时应该只有一个mark', function () {
                template.pattern = [];
                var marks = template.getMarks(geometry);
                expect(marks.length).toEqual(1);
                expect(marks[0].equal(geometry)).toEqual(true);
            });

            it('复杂pattern应该能够正确处理', function () {
                template.pattern = [1, 2, 3, 4];
                var marks = template.getMarks(geometry);
                expect(marks.length).toEqual(2);
                expect(marks[0].coordinates[0].x).toEqual(0);
                expect(marks[0].coordinates[0].y).toEqual(0);
                expect(marks[0].coordinates[1].x).toEqual(0);
                expect(marks[0].coordinates[1].y).toEqual(1);

                expect(marks[1].coordinates[0].x).toEqual(0);
                expect(marks[1].coordinates[0].y).toEqual(3);
                expect(marks[1].coordinates[1].x).toEqual(0);
                expect(marks[1].coordinates[1].y).toEqual(4);
                expect(marks[1].coordinates[2].x).toEqual(0);
                expect(marks[1].coordinates[2].y).toEqual(6);
            });

            it('当segment长度大于pattern总长度时segment超出部分应该被忽略', function () {
                template.pattern = [1, 2];
                var marks = template.getMarks(geometry);
                expect(marks.length).toEqual(1);
                expect(marks[0].coordinates[0].x).toEqual(0);
                expect(marks[0].coordinates[0].y).toEqual(0);
                expect(marks[0].coordinates[1].x).toEqual(0);
                expect(marks[0].coordinates[1].y).toEqual(1);
            });

            it('当segment长度小于pattern总长度时pattern超出部分应该被忽略', function () {
                template.pattern = [1, 2, 3, 4, 5, 6];
                var marks = template.getMarks(geometry);
                expect(marks.length).toEqual(2);
                expect(marks[0].coordinates[0].x).toEqual(0);
                expect(marks[0].coordinates[0].y).toEqual(0);
                expect(marks[0].coordinates[1].x).toEqual(0);
                expect(marks[0].coordinates[1].y).toEqual(1);

                expect(marks[1].coordinates[0].x).toEqual(0);
                expect(marks[1].coordinates[0].y).toEqual(3);
                expect(marks[1].coordinates[1].x).toEqual(0);
                expect(marks[1].coordinates[1].y).toEqual(4);
                expect(marks[1].coordinates[2].x).toEqual(0);
                expect(marks[1].coordinates[2].y).toEqual(6);
            });
        });
    });
});
