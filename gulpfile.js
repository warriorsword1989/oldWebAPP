var gulp = require('gulp'),
	less = require('gulp-less'),
	uglify = require('gulp-uglify'),	//压缩js文件
	notify = require('gulp-notify'),	//处理报错
	plumber = require('gulp-plumber'),	//处理异常
	rename = require('gulp-rename'),    //改名
	clean = require('gulp-clean'),
	jshint = require('gulp-jshint'),    //验证
	minifycss = require('gulp-minify-css'),     //压缩css
	imagemin = require('gulp-imagemin'),//图片压缩
	concat = require('gulp-concat'),    //合并文件
	htmlmin = require('gulp-htmlmin');    //压缩html
/*处理less文件*/
gulp.task('appLess', function () {
	gulp.src(['less/*.less'])
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(less())
		.pipe(gulp.dest('styles/imeep'));
});
/*监听less*/
gulp.task('watchLess',function(){
	gulp.watch('less/*.less',['appLess']);
});
// 样式
gulp.task('styles',['appLess','cleancss'], function() {
	return gulp.src(['**/*.css','!node_modules/**/*.css','!scripts/libs/**/*.css','!css/*.css'])
		// .pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('dist'))
		.pipe(notify({ message: '<%= file.relative %>【压缩CSS文件完成】！ ' }));
});
//压缩html
gulp.task('htmls',['cleanhtml'], function() {
	var options = {
		removeComments: true,//清除HTML注释
		collapseWhitespace: true,//压缩HTML
		collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
		minifyJS: true,//压缩页面JS
		minifyCSS: true//压缩页面CSS
	};
	return gulp.src(['**/*.html','**/*.htm','!node_modules/**/*.html','!scripts/libs/**/*.html'])
		.pipe(htmlmin(options))
		.pipe(gulp.dest('dist'))
		.pipe(notify({ message: '<%= file.relative %>【压缩HTML文件完成】！' }));
});
// 脚本
gulp.task('scripts',['cleanjs'], function() {
	return gulp.src(['**/*.js','!node_modules/**/*.js','!dist/**/*.js','!scripts/libs/**/*.js','!gulpfile.js','!Gruntfile.js','!karma.conf.js','!test/**/*.js','!dest/*.js'])
		.pipe(jshint('jshintrc.json'))
		// .pipe(rename({ suffix: '.min' }))
		.pipe(uglify({
			mangle: false//类型：Boolean 默认：true 是否修改变量名
			// mangle: {except: ['require' ,'exports' ,'module' ,'$','$scope','$ocLazyLoad', '$rootScope', 'dsMeta', 'dsFcc', 'dsEdit', 'dsManage', '$q', 'appPath', '$timeout']},//排除混淆关键字
			// compress: true,//类型：Boolean 默认：true 是否完全压缩
			// preserveComments: all //保留所有注释
		}))
		.pipe(gulp.dest('dist'))
		.pipe(notify({ message: '<%= file.relative %>【压缩JS文件完成】！' }));
});
//压缩图片
gulp.task('images',['cleanimg'], function () {
	gulp.src('images/**/*.{png,jpg,gif,ico,svg}')
		.pipe(imagemin({
			optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
			interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
			multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
		}))
		.pipe(gulp.dest('dist/images'))
		.pipe(notify({ message: '<%= file.relative %>【压缩图片完成！】' }));
});
//插件文件
gulp.task('plugins',function() {
	return gulp.src('scripts/libs/**/*.*')
		.pipe(gulp.dest('dist/scripts/libs/'))
		.pipe(notify({ message: '<%= file.relative %> 【移动插件完成！】'}));
});
// 清理
gulp.task('clean', function() {
	return gulp.src(['dist'], {read: false})
		.pipe(clean())
		.pipe(notify({ message: '<%= file.relative %>【清空dist完成】' }));
});
// 清理有价值文件
gulp.task('clean-all', function() {
	return gulp.src([
			'dist/**/*.js','!dist/node_modules/**/*.js','!dist/scripts/libs/**/*.js',
			'dist/**/*.css','!dist/node_modules/**/*.css','!dist/libs/**/*.css',
			'dist/**/*.html','dist/**/*.htm','!dist/node_modules/**/*.html','!dist/libs/**/*.html',
			'dist/images/**/*.{png,jpg,gif,ico,svg}',
			'dist/scripts/libs'], {read: false})
		.pipe(clean())
		.pipe(notify({ message: '<%= file.relative %>【清空完成】' }));
});
// 清理js
gulp.task('cleanjs', function() {
	return gulp.src(['dist/**/*.js','!dist/node_modules/**/*.js','!dist/scripts/libs/**/*.js'], {read: false})
		.pipe(clean())
		.pipe(notify({ message: '<%= file.relative %>【清空JS完成】' }));
});
// 清理css
gulp.task('cleancss', function() {
	return gulp.src(['dist/**/*.css','!dist/node_modules/**/*.css','!dist/scripts/libs/**/*.css'], {read: false})
		.pipe(clean())
		.pipe(notify({ message: '<%= file.relative %>【清空CSS完成】' }));
});
// 清理图片
gulp.task('cleanimg', function() {
	return gulp.src(['dist/images/**/*.{png,jpg,gif,ico,svg}'], {read: false})
		.pipe(clean())
		.pipe(notify({ message: '<%= file.relative %>【清空图片完成】' }));
});
// 清理html
gulp.task('cleanhtml', function() {
	return gulp.src(['dist/**/*.html','dist/**/*.htm','!dist/node_modules/**/*.html','!dist/scripts/libs/**/*.html'], {read: false})
		.pipe(clean())
		.pipe(notify({ message: '<%= file.relative %>【清空HTML完成】' }));
});
// 清理插件
gulp.task('cleanplugin', function() {
	return gulp.src(['dist/scripts/libs'], {read: false})
		.pipe(clean())
		.pipe(notify({ message: '<%= file.relative %>【清空插件完成】' }));
});
// 说明
gulp.task('help',function () {
	console.log('	gulp build			文件打包');
	console.log('	gulp clean-all			清空打包文件夹');
	console.log('	gulp clean			清空dist文件夹');
	console.log('	gulp cleancss			清空css');
	console.log('	gulp cleanjs			清空js');
	console.log('	gulp cleanhtml			清空html');
	console.log('	gulp help			gulp参数说明');
	console.log('	gulp styles			压缩CSS文件');
	console.log('	gulp scripts		        压缩JS文件');
	console.log('	gulp htmls		        压缩html文件');
	console.log('	gulp watchLess		        监控less变化，自动转CSS');

});
// 打包
gulp.task('build',['clean-all'] , function() {
	gulp.start('scripts');
	gulp.start('styles');
	gulp.start('htmls');
	gulp.start('images');
	gulp.start('plugins');
});