const gulp = require("gulp");
var exec = require('child_process').exec;

gulp.task('compile-electron', function (cb) {
    exec('npx tsc', function (err) {
      cb(err);
    });
  })

gulp.task('compile-react', function (cb) {
  exec('yarn --cwd ./src/App build', function (err) {
    cb(err);
  });
})

gulp.task('dist', function (cb) {
  exec('yarn dist', function (err) {
    cb(err);
  });
})

gulp.task('copy-react', function () {
    return gulp.src('./src/App/build/**/*')
        .pipe(gulp.dest('./dist/build'));
});

gulp.task('start-electron', function (cb) {
    exec('yarn dev:electron', function (err) {
        cb(err);
    });
});

gulp.task('start-react', function (cb) {
    exec('yarn dev:react', function (err) {
        cb(err);
    });
});

gulp.task('build', gulp.series(['compile-electron', 'compile-react', 'copy-react']));
gulp.task('dist', gulp.series(['build', 'dist']));
gulp.task('dev', gulp.series(['compile-electron', gulp.parallel(['start-react', 'start-electron'])]));