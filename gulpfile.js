var gulp = require('gulp');
var sass = require('gulp-ruby-sass'); 

gulp.task('generateSass', function(){
	return sass('sass/*.scss').pipe(gulp.dest('css'));
});

gulp.task('testTask', function(){
	console.log('testing gulp');
})

gulp.task('default',['testTask','generateSass']);