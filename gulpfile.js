// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp'); // Yung nasa loob ng object yan yung mga functions ng gulp
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browsersync = require('browser-sync').create();

// File path variables (Para di na mag type ng same varibale paulit ulit)
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js'
}

// SASS task  -- to compile our sass files 
function scssTask() {
    return src(files.scssPath) // Location ng mga scss files
        .pipe(sourcemaps.init()) // Run this before your sass files
        .pipe(sass()) // Comile sass file to css file
        .pipe(postcss([autoprefixer(), cssnano()])) // Eto yung mag rurun ng autoprefixer at cssnano
        .pipe(sourcemaps.write('.')) // Eto yung mag rurun ng function or mag wwrite sa same directory
        //.pipe(dest('dist', { sourcemaps: '.' })); // Dito mapupunta yung final js and css file sa folder na dist
        .pipe(dest('dist')); // Dito mapupunta yung final js and css file sa folder na dist
}


// JS task  -- to concat or minify our js files
function jsTask() {
    return src(files.jsPath) // Eto yung location ng mga javascript
        .pipe(concat('all.js')) // Compile to one file all.js
        .pipe(uglify()) // Minify the javascript
        .pipe(dest('dist')); // Put to this folder
}

// Browsersync Tasks
function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.' // Eto yung location ng index.html
        }
    })
    cb();
}

// Eto yung mag rreload ng browser when something changes
function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task\
function watchTask() {
    watch('*.html', browsersyncReload); // Kapag may na detect na changes sa index.html run browserReload()
    watch([files.scssPath, files.jsPath], series(scssTask, jsTask, browsersyncReload)); // Eto naman yung mag rurun if meron na detect na changes sa sass and js
}




// Default task --Eto yung yung mag rurun ng lahat ng command
// exports.default = series(
//     parallel(scssTask, jsTask),
//     watchTask
// );

exports.default = series(
    scssTask,
    jsTask,
    browsersyncServe,
    watchTask
);

// parallel -- running things simultaneously
// series   --running one at a time sample yung parallel muna the cacheBustTask then watchTask