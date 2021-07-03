/* eslint-disable @typescript-eslint/no-var-requires */
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
  exec('npx electron-builder -mwl', function (err) {
    cb(err);
  });
})

gulp.task('dir', function (cb) {
    const { SNAP_ARCH } = process.env;

    let arg = "";

    if(SNAP_ARCH === "amd64"){
      arg = " --x64";
    } else if(SNAP_ARCH === "i386") {
      arg = " --ia32";
    } else if(SNAP_ARCH === "arm64") {
      arg = " --arm64";
    } else if(SNAP_ARCH === "armhf") {
      arg = " --armv7l";
    }
    
    exec('electron-builder --dir' + arg, function (err, out, error) {
      console.log(out, error)
      cb(err);
    });
})

gulp.task('make', function (cb) {
    exec('electron-builder', function (err, out, error) {
      console.log(out, error)
      cb(err);
    });
})

gulp.task('copy-react', function () {
    return gulp.src('./src/App/build/**/*')
        .pipe(gulp.dest('./dist/build'));
});

gulp.task('start-electron', function (cb) {
    exec('npx cross-env NODE_ENV=development npx electron .', function (err) {
        cb(err);
    });
});

gulp.task('start-react', function (cb) {
    exec('npx cross-env PORT=8080 BROWSER=none yarn --cwd ./src/App start', function (err) {
        cb(err);
    });
});

gulp.task('build', gulp.series(['compile-electron', 'compile-react', 'copy-react']));
gulp.task('dist', gulp.series(['build', 'dist']));
gulp.task('pack', gulp.series(['build', 'dir']));
gulp.task('compile', gulp.series(['build', "make"]));
gulp.task('dev', gulp.series(['compile-electron', gulp.parallel(['start-react', 'start-electron'])]));