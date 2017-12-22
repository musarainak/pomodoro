const gulp = require('gulp'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssimport = require('postcss-import'),
  customproperties = require('postcss-custom-properties'),
  apply = require('postcss-apply'),
  mixins = require('postcss-mixins'),
  nested = require('postcss-nested'),
  customMedia = require("postcss-custom-media"),
  nano = require('gulp-cssnano'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel');

/* css task */
gulp.task('css', ()  => {
  const processors = [
    cssimport,
    autoprefixer,
    customproperties,
    apply,
    mixins,
    nested,
    customMedia
  ];
  const configNano = {
    autoprefixer: {
      browsers: 'last 2 versions'
    },
    discardComments: {
      removeAll: true
    },
    safe: true
  };
  return gulp.src('./src/css/*.css').pipe(postcss(processors)).pipe(nano(configNano)).pipe(gulp.dest('./dist/css')).pipe(notify({message: 'CSSa prest dago ♡'}));
});

/* scripts task */
gulp.task('js', function() {
	return gulp.src([
		'./src/js/*.js'
	])
	.pipe(babel({presets:['env']}))
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest('./dist/js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify().on('error', function(e){console.log(e);}))
	.pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', () => {
  gulp.watch('src/css/**/*.css', ['css']);
  gulp.watch('src/js/*.js', ['js']);

});

gulp.task('default', ['css', 'watch']);
