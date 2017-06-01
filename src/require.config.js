var require = {
    paths: {
        'THREE': '../bower_components/three.js/build/three.min',
        'ROT': '../libs/rot/rot.min',
        'Chance': '../bower_components/chance/dist/chance.min',
        'Phaser': '../libs/phaser/phaser.min',
        'LowRez': '../libs/phaser/low-rez',
        'handlebars': '../bower_components/handlebars/handlebars.amd.min',
        'EventEmitter': '../bower_components/eventEmitter/EventEmitter.min'
    },
    shim: {
        'ROT': {
            exports: 'ROT',
            deps: []
        },
        'EasyStar': {
            exports: 'EasyStar'
        }
    }
};