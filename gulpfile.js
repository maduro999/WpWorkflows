 var gulp = require('gulp'),
          gutil = require('gulp-util'),
          coffee = require('gulp-coffee'),
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
     .pipe(gulp.dest('builds/development/js')) //pick a destination path, in this case it the script.js will go to the js folder
 });




 gulp.task('log', function(){
     gutil.log("Testing 123");  
 });

