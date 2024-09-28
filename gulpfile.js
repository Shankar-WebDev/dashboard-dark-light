// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass')); // Use Dart Sass
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browsersync = require('browser-sync').create();

// Sass Task - Compile SCSS to CSS and generate sourcemaps
function scssTask() {
  return src('app/scss/style.scss', { sourcemaps: true }) // Enable sourcemaps
    .pipe(sass().on('error', sass.logError)) // Compile SCSS
    .pipe(postcss([autoprefixer(), cssnano()])) // Add vendor prefixes and minify
    .pipe(dest('dist', { sourcemaps: '.' })); // Save CSS and sourcemap in dist
}

// Browsersync - Start server
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: false,
  });
  cb();
}

// Browsersync - Reload browser
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task - Watch SCSS and HTML files for changes
function watchTask() {
  watch('app/scss/**/*.scss', series(scssTask, browserSyncReload)); // Watch SCSS files
  watch('*.html', browserSyncReload); // Watch HTML files
}

// Default Gulp Task - Runs the SCSS task, browser sync, and watches files
exports.default = series(
  scssTask, // Compile SCSS initially
  browserSyncServe, // Start Browsersync server
  watchTask // Watch for changes
);

// Build Task - Compile SCSS without starting the server or watching
exports.build = series(scssTask);
