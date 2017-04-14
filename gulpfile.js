      var gulp = require('gulp'),
          gutil = require('gulp-util'),
          coffee = require('gulp-coffee'),
          browserify = require('gulp-browserify'),
          compass = require('gulp-compass'),
          connect = require('gulp-connect'),
          gulpif = require('gulp-if'),
          uglify = require('gulp-uglify'),
          minifyHTML = require('gulp-minify-html'),
          jsonminify = require('gulp-jsonminify'),
          concat = require('gulp-concat');


var env,
    coffeeSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

//This way uses the src as a variable
coffeeSources = ['components/coffee/tagline.coffee'] //array is not really needed, but used in cae you want to add multiple coffeescript files
//var coffeeSources = ['components/coffee/tagline.coffee', 'Other file', 'Other file'] array is not really needed, but used in cae you want to add multiple coffeescript files
//var coffeeSources = ['components/coffee/*.coffee'] //you can also use * which means any file with a .coffee extenssion
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

//The scripts below get processed in the order they are in the array
jsSources = ['components/scripts/rclick.js',
            'components/scripts/pixgrid.js',
            'components/scripts/tagline.js',
            'components/scripts/template.js'];

sassSources = ['components/sass/style.scss'];

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
    .pipe(gulpif(env === 'production', uglify())) 
    .pipe(gulp.dest(outputDir + 'js')) //pick a destination path, in this case it the script.js will go to the js folder
    .pipe(connect.reload())
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
      image: outputDir + 'images',
      style: sassStyle
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']); 
    gulp.watch(jsSources, ['js']); 
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html',['html']); //any chages to the html files will result in calling the 'html' task, which will result in call the conect.reload method
    gulp.watch('builds/development/js/*.json' ,['json']);
    gulp.watch(jsonSources,['json']); 
});


gulp.task('connect', function(){
    connect.server({
    //root:'builds/development/', //where the app is located -  here you specify where the files are that you want to run
    root: outputDir,
    livereload: true 
    });
});

 gulp.task('html', function(){
    gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML ())) //this checks in the env is prod, if it is then run the minify variable object we declared 
    .pipe(gulpif(env === 'production', gulp.dest(outputDir))) //send file to outputDir only if env is prod
    .pipe(connect.reload())
});


gulp.task('json', function(){
    gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify ())) //this checks in the env is prod, if it is then run the minify variable object we declared 
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/'))) //send file to the production/js folder only if env is prod
    .pipe(connect.reload())
});




//gulp.task('all', ['coffee', 'js', 'compass']);
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);


/*
 gulp.task('log', function(){
     gutil.log("Testing 123");  
 });
*/
