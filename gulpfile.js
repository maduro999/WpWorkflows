      var gulp = require('gulp'),
          gutil = require('gulp-util'),
          coffee = require('gulp-coffee'),
          browserify = require('gulp-browserify'),
          compass = require('gulp-compass'),
          concat = require('gulp-concat');


//This way uses the src as a variable
var coffeeSources = ['components/coffee/tagline.coffee'] //array is not really needed, but used in cae you want to add multiple coffeescript files
//var coffeeSources = ['components/coffee/tagline.coffee', 'Other file', 'Other file'] array is not really needed, but used in cae you want to add multiple coffeescript files
//var coffeeSources = ['components/coffee/*.coffee'] //you can also use * which means any file with a .coffee extenssion

//The scripts below get processed in the order they are in the array
var jsSources = ['components/scripts/rclick.js',
                'components/scripts/pixgrid.js',
                'components/scripts/tagline.js',
                'components/scripts/template.js'];

var sassSources = ['components/sass/style.scss']

gulp.task('coffee', function(){
     gulp.src(coffeeSources)
          .pipe(coffee({bare: true}) 
               .on('error', gutil.log)) 
          .pipe(gulp.dest('components/scripts'))
 });

/*
 gulp.task('coffee', function(){
     //with gulp js you need to first specify where the original location of what you want to process is, use the gulp.src method
     gulp.src('components/coffee/tagline.coffee')
          //Then you pipe (Send the contents from the scr method) to the coffee variable
          .pipe(coffee({bare: true}) //this bare true alows the javascript to run without safety, explanation can be found online ( coffee script uses)
               //Below we execute an on method, basically do something if there is an error
               .on('error', gutil.log)) //the error is output to the log using the gutil.log
          .pipe(gulp.dest('components/scripts'))
 });
*/


 gulp.task('js', function(){
    gulp.src(jsSources) //this is the array of scripts
     .pipe(concat('script.js')) //this will concatenate all the scripts into one script called script.js, which can then be linked in the html file
     .pipe(browserify()) // this will send the file throught the browserify plugin
     .pipe(gulp.dest('builds/development/js')) //pick a destination path, in this case it the script.js will go to the js folder
 });


/*
gulp.task('compass', function(){
    gulp.src(sassSources) //this is the array of scripts
     .pipe(compass({ //saas requires a configuration file in order to process the scss file, but gulp can handle that configuration by creating an object of the compass variable
        sass: 'components/sass', //the locations of the saas files
        image: 'builds/development/images', //the location of the images
        style: 'expanded' // the style of the css that will be generated, for develpment it's better to use expanded but when published it's better to use compact
    })) //pipe the saasSources through compass
     .on('error', gutil.log) //output error logs to the console
     .pipe(gulp.dest('builds/development/css')) //Send to destination
 });

*/

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded'
    })
    .on('error', gutil.log))
    .pipe(gulp.dest('builds/development/css'))
});

//gulp.task('all', ['coffee', 'js', 'compass']);
gulp.task('default', ['coffee', 'js', 'compass', 'watch']);




gulp.task('watch', function(){
         gulp.watch(coffeeSources, ['coffee']); 
         gulp.watch(jsSources, ['js']); 
         gulp.watch('components/sass/*.scss', ['compass']);
     });






 gulp.task('log', function(){
     gutil.log("Testing 123");  
 });

