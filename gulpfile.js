var gulp = require('gulp');
var babel = require('gulp-babel');
var connect = require("gulp-connect");
gulp.task('build', () => {
   gulp.src('web/./components/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./dev'))
});
gulp.task('watch', () => {
   gulp.watch('./web/components/*.js', ['build']);
});

gulp.task("connect", function () {
   connect.server({
      root: ".",
      livereload: true
   });
});

gulp.task('start', ['build', 'watch', 'connect']);