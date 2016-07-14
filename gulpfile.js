var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),	//压缩js文件
    notify = require('gulp-notify'),	//处理报错
    plumber = require('gulp-plumber'),	//处理异常
	rename = require('gulp-rename'),    //改名
	clean = require('gulp-clean'),
	jshint = require('gulp-jshint'),    //验证
	minifycss = require('gulp-minify-css'),     //压缩css
	concat = require('gulp-concat');    //合并文件
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
gulp.task('styles', function() {
	return gulp.src('styles/**/*.css')
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/styles'))
		.pipe(notify({ message: '压缩CSS文件完成' }));
});
// 脚本
gulp.task('scripts', function() {
	return gulp.src('scripts/**/*.js')
		.pipe(jshint('jshintrc.json'))
		/*.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/scripts'))*/
		// .pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'))
		.pipe(notify({ message: '压缩JS文件完成' }));
});
// 清理
gulp.task('clean', function() {
	return gulp.src(['dist/scripts'], {read: false})
		.pipe(clean());
});
// 预设任务
gulp.task('default', ['clean'], function() {
	gulp.start('scripts');
});