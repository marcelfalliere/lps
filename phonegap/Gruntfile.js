var spawn = require('child_process').spawn;

module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                options: {
                    paths: ["www/styles"],
                    yuicompress: true
                },
                files: {
                    "www/styles/transitions.css": "www/styles/transitions.less",
                    "www/styles/all.css": "www/styles/all.less"
                }
            }
        },

        concat: {
            build: {
                src: [
                    'src_www/js/bower_comps/jquery/dist/jquery.min.js',
                    'src_www/js/bower_comps/underscore/underscore.js',
                    'src_www/js/bower_comps/backbone/backbone.js',
                    'src_www/js/bower_comps/backbone.marionette/lib/backbone.marionette.min.js',
                    'src_www/js/bower_comps/jquery-hammerjs/jquery.hammer-full.min.js',
                    'src_www/js/bower_comps/tinycolor/tinycolor.js',
                    'src_www/js/bower_comps/iscroll/build/iscroll-lite.js',
                    'src_www/js/app/conf.js',
                    'src_www/js/app/models/thread.js',
                    'src_www/js/app/collections/threads.js',
                    'src_www/js/app/models/comment.js',
                    'src_www/js/app/collections/comments.js',
                    'src_www/js/app/models/report.js',
                    'src_www/js/app/views/utils/itemReadOnlyView.js'   ,
                    'src_www/js/app/views/pseudonymVC.js'   ,
                    'src_www/js/app/views/homeVC.js'   ,
                    'src_www/js/app/views/threadVC.js'   ,
                    'src_www/js/app/views/threadVC-noPostCommentForYouView.js'   ,
                    'src_www/js/app/views/threadVC-postCommentView.js'   ,
                    'src_www/js/app/views/threadVC-commentsView.js'   ,
                    'src_www/js/app/views/postThreadVC.js'    ,
                    'src_www/js/app/views/postThreadVC-upload.js'   ,
                    'src_www/js/app/views/postThreadVC-modeValueFromPercentageFunctions.js'   ,
                    'src_www/js/app/views/headerView.js'   ,
                    'src_www/js/app/views/pushView.js'   ,
                    'src_www/js/app/views/bannedVC.js',
                    'src_www/js/app/views/eulaVC.js',
                    'src_www/js/app/regions/headerRegion.js',
                    'src_www/js/app/regions/contentRegion.js',
                    'src_www/js/app/regions/pushRegion.js',
                    'src_www/js/app/router.js',
                    'src_www/js/app/main.js'
                ],
                dest: 'www/app.js'
            },
        },

        copy:{
            build:{
                files:[
                    { src: ['src_www/index-build.html'], dest:'www/index.html' },
                    { cwd:'src_www/', src: ['styles/**.css'], dest:'www/', expand:true },
                    { cwd:'src_www/styles/', src: ['fonts/**'], dest:'www/styles/', expand:true },
                    { cwd:'src_www/', src: ['styles/**.css'], dest:'www/', expand:true },
                    { cwd:'src_www/', src: ['images/**.png'], dest:'www/', expand:true },
                ]
            }
        }
    });

    grunt.registerTask('prepare:ios', 'Cordova prepare ios', function(){
        var done = this.async();
        var cordova = spawn('cordova', ['prepare', 'ios']);
        cordova.on('close', function (code) {
          done();
        });
    }); 
    grunt.registerTask('prepare:android', 'Cordova prepare android', function(){
        var done = this.async();
        var cordova = spawn('cordova', ['prepare', 'android']);
        cordova.on('close', function (code) {
          done();
        });
    }); 

    grunt.registerTask('phonegap', ['build', 'prepare:ios', 'prepare:android']);

    grunt.registerTask('build', ['less', 'concat', 'copy']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');


};

