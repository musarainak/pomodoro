const gulp = require('gulp'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssimport = require('postcss-import'),
  customproperties = require('postcss-custom-properties'),
  apply = require('postcss-apply'),
  mixins = require('postcss-mixins'),
  nested = require('postcss-nested'),
  customMedia = require("postcss-custom-media")
  nano = require('gulp-cssnano'),
  notify = require('gulp-notify');

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
  return gulp.src('./src/*.css').pipe(postcss(processors)).pipe(nano(configNano)).pipe(gulp.dest('./css')).pipe(notify({message: 'CSSa listo dago ♡'}));
});

gulp.task('watch', () => {
  gulp.watch('src/**/*.css', ['css']);

});

gulp.task('default', ['css', 'watch']);
