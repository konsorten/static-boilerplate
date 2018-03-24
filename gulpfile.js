'use strict';

const gulp          = require('gulp');
const del           = require('del');
const sass          = require('gulp-sass');
const prefixer      = require('gulp-autoprefixer');
const uglify        = require('gulp-uglify');
const concat        = require('gulp-concat');
const rename        = require('gulp-rename');
const handlebars    = require('gulp-compile-handlebars');
const browserSync   = require('browser-sync').create();
const ghPages       = require('gulp-gh-pages');
const sassGlob      = require('gulp-sass-bulk-import');
const babel         = require('gulp-babel');
const typescript    = require('gulp-typescript');
const tslint        = require('gulp-tslint');
const log           = require('fancy-log');

const tsProject     = typescript.createProject('tsconfig.json');
const tsLibProject  = typescript.createProject('tsconfig.lib.json');

var paths = {
    src: { root: 'src' },
    dist: { root: 'dist' },
    init: function() {
        this.src.sass        = this.src.root + '/scss/main.scss';
        this.src.templates   = this.src.root + '/**/*.hbs';
        this.src.typescript  = [this.src.root + '/ts/**/*.ts', '!' + this.src.root + '/ts/libs/*.ts'];
        this.src.libs        = this.src.root + '/ts/libs/*.ts';
        this.src.images      = this.src.root + '/images/**/*.{jpg,jpeg,svg,png,gif}';
        this.src.files       = this.src.root + '/*.{html,txt}';

        this.dist.css        = this.dist.root + '/css';
        this.dist.images     = this.dist.root + '/images';
        this.dist.javascript = this.dist.root + '/js';
        this.dist.libs       = this.dist.root + '/js/libs';

        return this;
    },
}.init();

function serve() {
    return browserSync.init({
        server: paths.dist.root,
        open: true,
        notify: false,

        // Whether to listen on external
        online: false,
    });
}
exports.serve = serve;

/**
 * Compile sass files into css
 * 
 */
function styles() {
    return gulp.src([paths.src.sass])
        .pipe(sassGlob())
        .on('error', log)
        .pipe(sass({
        includePaths: ['src/scss'],
        }))
        .on('error', log)
        .pipe(prefixer('last 2 versions'))
        .on('error', log)
        .pipe(gulp.dest(paths.dist.css));
}
exports.styles = styles;

/**
 * Compile handlebars/partials into html
 * 
 */
function templates() {
    var opts = {
        ignorePartials: true,
        batch: ['src/partials'],
    };

    return gulp.src([paths.src.root + '/*.hbs'])
        .pipe(handlebars(null, opts))
        .on('error', log)
        .pipe(rename({
        extname: '.html',
        }))
        .on('error', log)
        .pipe(gulp.dest(paths.dist.root));
}
exports.templates = templates;

/**
 * Compile and bundle all typescript files
 * 
 */
function scripts() {
    return gulp.parallel(
        () => {
            gulp.src(paths.src.typescript)
            .pipe(tsProject())
            .pipe(babel({
            presets: ['env'],
            }))
            .pipe(concat('bundle.js'))
            .on('error', log)
            .pipe(uglify())
            .on('error', log)
            .pipe(gulp.dest(paths.dist.javascript))
        },

        /*
        * Uglify JS libs and move to dist folder
        */
        () => {
            gulp.src([paths.src.libs])
            .pipe(tsLibProject())
            .pipe(uglify())
            .on('error', log)
            .pipe(rename({
            suffix: '.min',
            }))
            .on('error', log)
            .pipe(gulp.dest(paths.dist.libs))
        }
    );
}
exports.scripts = scripts;

function images() {
    return gulp.src([paths.src.images])
        .pipe(gulp.dest(paths.dist.images));
}
exports.images = images;

function files() {
    return gulp.src([paths.src.files])
        .pipe(gulp.dest(paths.dist.root));
}
exports.files = files;

function lint() {
    return gulp.src(paths.src.typescript)
        .pipe(tslint({
            configuration: './tslint.json',
            formatter: 'prose'
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }));
}
exports.lint = lint;

function watch() {
    gulp.watch('src/scss/**/*.scss', styles);
    gulp.watch(paths.src.typescript, scripts);
    gulp.watch(paths.src.templates, templates);
    gulp.watch('dist/**/*.*').on('change', browserSync.reload);
}
exports.watch = watch;

function deploy() {
    return gulp.src([paths.dist.root + '/**/*'])
        .pipe(ghPages());
}
exports.deploy = deploy;

gulp.task('default', gulp.parallel(watch, serve, images, files, styles, scripts, templates));
