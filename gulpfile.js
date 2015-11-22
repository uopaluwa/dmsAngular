var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var Server = require('karma').Server;
var rename = require("gulp-rename");

//task to minify js files
gulp.task('js', function() {
	gulp.src(['public/app/app.js', 'config/*.js', 'public/app/**/*.js'])
    .pipe(concat('app'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename({
    suffix: '.min.js'
  	}))
    .pipe(gulp.dest('public/app/build'))
});
//task to minify css files
gulp.task('css', function() {
	gulp.src(['public/assets/css/stylesheet.css'])
		.pipe(concat('stylesheet'))
    .pipe(minifyCss())
    .pipe(rename({
    suffix: '.min.css'
  	}))
    .pipe(gulp.dest('./public/assets/css/build'))
});

//task to start server
gulp.task('start', function() {
	nodemon({
        script: 'server.js'
    })
});
//track changes in js and css files
gulp.task('watch', function () {
  gulp.watch(['public/app/**/*.js', '!public/app/build/*.js'], ['js']);
  gulp.watch('public/assets/css/stylesheet.css', ['css']);
});

//task for tests
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

//default tasks to be executed
gulp.task('default', ['js', 'css','test', 'start','watch']);