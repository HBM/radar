({
    appDir: "../",
    baseUrl: "js/",
    dir: "../../radar-build",
    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    //    optimize: "none",
    preserveLicenseComments: false,
    shim: {
        jquery: {
            exports: '$'
        },
        bootstrap: {
            deps: ['jquery']
        },
        handlebars: {
            deps: ['jquery'],
            exports: 'Handlebars'
        },
        ember: {
            deps: ['handlebars', 'jquery'],
            exports: 'Ember'
        }
    },



    modules: [
        {
            name: "main"
        }
    ]
})
