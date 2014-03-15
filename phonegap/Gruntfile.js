var spawn = require('child_process').spawn;

module.exports = function(grunt) {
    grunt.initConfig({
        
        // Package json
        pkg: grunt.file.readJSON('package.json'),

        // Less is more
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

        jshint: {
            all: [
                'Gruntfile.js',
                'www/js/app/*.js',
                'www/js/app/collections/*.js',
                'www/js/app/models/*.js',
                'www/js/app/regions/*.js',
                'www/js/app/views/*.js'
            ]
        }
    });

    grunt.registerTask('prepare', 'Cordova prepare', function(){
        var done = this.async();
        var cordova = spawn('cordova', ['prepare', 'ios']);
        cordova.on('close', function (code) {
          done();
        });
    }); 

    grunt.registerTask('clean', 'Clean platforms www folder', function(){

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-less');
};

