/* jshint node: true */

module.exports = function (config) {

    config.set({
        basePath: '.',
        frameworks: ['mocha'],
        files: [
            'node_modules/chai/chai.js',
            'node_modules/chai-spies/chai-spies.js',
            'node_modules/chai-as-promised/lib/chai-as-promised.js',
            'src/*.js',
            'test/*.js'
        ],

        reporters: ['dots', 'coverage'],
        preprocessors: {
            'src/*.js': ['coverage']
        },

        coverageReporter: {
            reporters: [{
                type: 'html',
                dir: 'coverage/'
            }, {
                type: 'text-summary'
            }]
        },

        autoWatch: false,
        singleRun: true,
        browsers: ['PhantomJS', 'Firefox']
    });

};