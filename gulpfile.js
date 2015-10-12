var srcDir = 'src';
var rootBuildDir = '../../generated-resources/static';
var buildDir = rootBuildDir + '/merchantconfig';

var gulp = require('gulp'),
    less = require('gulp-less'),
    filter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    del = require('del'),
    runSequence = require('run-sequence'),
    fs = require('fs'),
    using = require('gulp-using'),
    gulpMerge = require('gulp-merge'),
    rename = require("gulp-rename"),
    replace = require('gulp-replace');


gulp.task('default', function (cb) {
    runSequence('clean',
                'staticassets',
                'generate-js',
                'generate-js-dependencies',
                'generate-css',
                'generate-css-dependencies',
                'copylibassets',
                'copytotarget'
    )
    ;
});

gulp.task('clean', function (cb) {
    del(buildDir, {force: true});
    del('../../../../target/classes/static/merchantconfig', {force: true}, cb);
});

gulp.task('staticassets', function (cb) {
    gulp.src([srcDir + '/**/*.*',
              '!/**/index.html',
              '!/**/*.js',
              '!/**/*.less',
              '!/**/*.css'])
        .pipe(gulp.dest(buildDir));
    gulp.src([srcDir + '/../../common/src/**/*.*',
              '!/**/index.html',
              '!/**/*.js',
              '!/**/*.less',
              '!/**/*.css'])
        .pipe(gulp.dest(buildDir + "/../common"));
    cb(null);
});

gulp.task('generate-js', function (cb) {
    gulpMerge(gulp.src(getWebappOrWebsrcFile('index.html'))
                  .pipe(replace(/src="app-.*\.js"/, 'src="app.js"')),
              gulp.src([srcDir + '/app.js',
                        srcDir + '/**/*.js',
                        srcDir + '/../../common/src/module.js',
                        srcDir + '/../../common/src/**/*.js'])
                  .pipe(sourcemaps.init())
                  .pipe(concat('app.js'))
                  .pipe(ngAnnotate())
                  //.pipe(uglify())
                  .pipe(sourcemaps.write())
                  .pipe(rev()))
        .pipe(revReplace())
        .pipe(gulp.dest(buildDir))
        .on('end', function () {
                if (cb) {
                    cb();
                }
            });
});

gulp.task('generate-css', function (cb) {
    var lessFilter = filter("**/*.less");
    gulpMerge(gulp.src(getWebappOrWebsrcFile('index.html'))
                  .pipe(replace(/href="app-.*\.css"/, 'href="app.css"')),
              gulp.src([srcDir + '/**/*.css',
                        srcDir + '/**/*.less',
                        srcDir + '/../../common/src/**/*.css',
                        srcDir + '/../../common/src/**/*.less'])
                  //.pipe(lessFilter)
                  //.pipe(less())
                  //.pipe(lessFilter.restore())
                  .pipe(concat('app.css'))
                  .pipe(rev()))
        .pipe(revReplace())
        .pipe(gulp.dest(buildDir))
        .on('end', function () {
                if (cb) {
                    cb();
                }
            });
});

gulp.task('generate-js-dependencies', function (cb) {
    var indexFilter = filter("**/index.html");
    gulpMerge(gulp.src(getWebappOrWebsrcFile('index.html')),
              gulp.src(mainBowerFiles())
                  .pipe(filter(["**/*.js"]))
                  .pipe(sourcemaps.init())
                  .pipe(concat('dependencies.js'))
                  .pipe(ngAnnotate())
                  //.pipe(uglify())           uglifying here causes problems with the angular currency filter
                  .pipe(sourcemaps.write())
                  .pipe(rev()))
        .pipe(revReplace())
        .pipe(indexFilter)
        .pipe(gulp.dest(buildDir))
        .pipe(indexFilter.restore())
        .pipe(filter(["*", "!**/index.html"]))
        .pipe(gulp.dest(buildDir + '/lib/js'))
        .on('end', function () {
                if (cb) {
                    cb();
                }
            });
});

gulp.task('generate-css-dependencies', function (cb) {
    var indexFilter = filter("**/index.html");
    gulpMerge(gulp.src(getWebappOrWebsrcFile('index.html')),
              gulp.src(mainBowerFiles()
                           .concat([srcDir + '/nonbowerlib/bootstrap-3.3.5/css/bootstrap.css']))
                  .pipe(filter("**/*.css"))
                  .pipe(concat('dependencies.css'))
                  .pipe(rev()))
        .pipe(revReplace())
        .pipe(indexFilter)
        .pipe(gulp.dest(buildDir))
        .pipe(indexFilter.restore())
        .pipe(filter(["*", "!**/index.html"]))
        .pipe(gulp.dest(buildDir + '/lib/css'))
        .on('end', function () {
                if (cb) {
                    cb();
                }
            });
});

gulp.task('copylibassets', function (cb) {
    var numOutstanding = 0;
    numOutstanding++;
    gulp.src([srcDir + '/nonbowerlib/bootstrap-3.3.5/css/bootstrap.css.map'/*,
     srcDir + '/nonbowerlib/bootstrap-3.3.5/css/bootstrap-theme.css.map'*/])
        .pipe(gulp.dest(buildDir + '/lib/css'))
        .on('end', function () {
                if (--numOutstanding <= 0 && cb) {
                    cb();
                }
            });
    numOutstanding++;
    gulp.src(srcDir + '/nonbowerlib/bootstrap-3.3.5/fonts/*.*')
        .pipe(gulp.dest(buildDir + "/lib/fonts"))
        .on('end', function () {
                if (--numOutstanding <= 0 && cb) {
                    cb();
                }
            });
});

gulp.task('copytotarget', function (cb) {
    gulp.src([rootBuildDir + '/**'])
        .pipe(gulp.dest('../../../../target/classes/static'));
    cb(null);
});

gulp.task('watch', [], function () {

    // Watch for js changes
    gulp.watch(
        [srcDir + '/**/*.js',
         srcDir + '/../../common/src/module.js',
         srcDir + '/../../common/src/**/*.js'],
        ['generate-js']);

    // Watch for css changes
    gulp.watch(
        [srcDir + '/**/*.css',
         srcDir + '/**/*.less',
         srcDir + '/../../common/src/**/*.css',
         srcDir + '/../../common/src/**/*.less'],
        ['generate-css']);

    // Watch for static asset changes
    gulp.watch(
        [srcDir + '/**/*.*',
         srcDir + '/../../common/src/**/*.*',
         '!/**/index.html',
         '!/**/*.js',
         '!/**/*.less',
         '!/**/*.css'],
        ['staticassets']
    );

    // Watch for changes to index.html
    gulp.watch(srcDir + '/index.html',
        ['default']);

});

function getWebappOrWebsrcFile(relativePath) {
    return fs.existsSync(buildDir + '/' + relativePath) ? buildDir + '/' + relativePath : srcDir + '/' + relativePath;
}