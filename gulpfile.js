var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    pkg = require('gulp-packages')(gulp, [
        'autoprefixer',
        'cache',
        'concat',
        'file-include',
        'filter',
        'if',
        'imagemin',
        'main-bower-files',
        'match',
        'minify-css',
        'minify-html',
        'rename',
        'rev',
        'rev-replace',
        'sass',
        'uglify'
    ]),

    Q = require('q'),
    del = require('del'),

    distPath = './public/dist/',
    vendorPath = './public/vendor/',
    manifest = 'manifest.json';

function rev(stream) {
    return stream
        .pipe(pkg.rev())
        .pipe(pkg.rename(function(file) {
            file.extname += '?rev=' + /\-(\w+)(\.|$)/.exec(file.basename)[1];
            if (/\-(\w+)\./.test(file.basename)) {
                file.basename = file.basename.replace(/\-(\w+)\./, '.');
            }
            if (/\-(\w+)$/.test(file.basename)) {
                file.basename = file.basename.replace(/\-(\w+)$/, '');
            }
        }))
        .pipe(pkg.rev.manifest(manifest, {
            merge: true
        }))
        .pipe(gulp.dest('.'))
}

gulp.task('del-vendor', function() {
    return del([
        vendorPath,
        manifest
    ])
});

gulp.task('del-dist', function() {
    return del([
        distPath,
        'public/index.html'
    ])
});

//打包bower
gulp.task('build-vendor', ['del-vendor'], function() {
    return gulp.src('./bower.json')
        .pipe(pkg.mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        'dist/js/bootstrap.js',
                        'dist/css/bootstrap.css',
                        'dist/css/bootstrap-theme.css',
                        'dist/fonts/*.*'
                    ]
                },
                'angular-ui-grid': {
                    main: [
                        'ui-grid.css',
                        'ui-grid.eot',
                        'ui-grid.js',
                        'ui-grid.svg',
                        'ui-grid.ttf',
                        'ui-grid.woff'
                    ]
                },
                'font-awesome': {
                    main: [
                        'css/font-awesome.css',
                        'fonts/*.*'
                    ]
                },
                'smalot-bootstrap-datetimepicker': {
                    main: [
                        'js/locales/*.*',
                        'js/bootstrap-datetimepicker.js',
                        'css/bootstrap-datetimepicker.css'
                    ]
                }
            }
        }))
        .pipe(pkg.if('*.css', pkg.minifyCss()))
        .pipe(pkg.if('*.js', pkg.uglify()))
        .pipe(pkg.if(function(file) {
            return pkg.match(file, [
                '**/*.css',
                '**/*.js',
                '!**/*.min.*',
                '!**/locales/*.*'
            ])
        }, pkg.rename({
            suffix: '.min'
        })))
        .pipe(gulp.dest(vendorPath))
});

//生成文件hash值
gulp.task('rev-vendor', ['build-vendor'], function() {
    return rev(gulp.src(vendorPath + '**/*.min.*', {
        base: 'public/'
    }))
});

//打包src
gulp.task('build-dist', ['del-dist'], function() {
    var deferredCss = Q.defer(),
        deferredHtml = Q.defer(),
        deferredImg = Q.defer(),
        deferredJs = Q.defer(),

        //css
        css = gulp.src('src/**/*.scss', {
            base: './src'
        })
        .pipe(pkg.sass())
        .pipe(pkg.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(pkg.minifyCss())
        .pipe(pkg.if('css/*.css', pkg.concat('css/app.min.css')))
        .pipe(pkg.if('!css/app.min.css', pkg.rename({
            suffix: '.min'
        })))
        .pipe(gulp.dest(distPath))
        .on('finish', deferredCss.resolve),

        //html
        html = gulp.src('src/**/*.html', {
            base: './src'
        })
        .pipe(pkg.minifyHtml({
            empty: true,
            cdata: true,
            conditionals: true,
            spare: true,
            quotes: true
        }))
        .pipe(pkg.if('!index.html', pkg.rename({
            suffix: '.min'
        })))
        .pipe(pkg.if('index.html', gulp.dest('./public'), gulp.dest(distPath)))
        .on('finish', deferredHtml.resolve),

        //img
        img = gulp.src('src/img/**/*.*', {
            base: './src'
        })
        .pipe(pkg.cache(pkg.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(distPath))
        .on('finish', deferredImg.resolve),

        //js
        js = gulp.src('src/**/*.js', {
            base: './src'
        })
        .pipe(pkg.uglify())
        .pipe(pkg.if('js/*.js', pkg.concat('js/app.min.js')))
        .pipe(pkg.if('!js/app.min.js', pkg.rename({
            suffix: '.min'
        })))
        .pipe(gulp.dest(distPath))
        .on('finish', deferredJs.resolve);

    return Q.all([deferredCss.promise, deferredHtml.promise, deferredImg.promise, deferredJs.promise]);
});

//template include
gulp.task('template-include', ['build-dist'], function() {
    return gulp.src(distPath + '**/*.min.js', {
            base: distPath
        })
        .pipe(pkg.fileInclude({
            prefix: '@@',
            basepath: './public/'
        }))
        .pipe(gulp.dest(distPath))
});

//生成hash值
gulp.task('rev-dist', ['template-include'], function() {
    return rev(gulp.src([distPath + '**/*.min.*', distPath + 'img/**/*.*'], {
        base: 'public/'
    }))
});

//替换引用文件的hash
gulp.task('dist', ['rev-dist'], function() {
    var deferred = Q.defer();
    rev(gulp.src(distPath + '**/*.min.*', {
                base: distPath
            })
            .pipe(pkg.revReplace({
                manifest: gulp.src(manifest)
            }))
            .pipe(gulp.dest(distPath))
            .pipe(pkg.filter(['js/app.min.js']))
            .pipe(pkg.rename(function(file) {
                file.dirname = 'dist/js';
            })))
        .on('finish', function() {
            gulp.src('public/index.html', {
                    base: './public'
                })
                .pipe(pkg.revReplace({
                    manifest: gulp.src(manifest)
                }))
                .pipe(gulp.dest('public'))
                .on('finish', deferred.resolve)
        });
    return deferred.promise;
});

gulp.task('all', ['rev-vendor'], function() {
    gulp.start('dist');
});

gulp.task('default', ['dist']);

gulp.task('watch', function() {
    gulp.watch('bower_components/**/*.*', ['all']);
    gulp.watch('src/**/*.*', ['dist']);
});
