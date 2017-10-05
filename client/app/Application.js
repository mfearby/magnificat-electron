Ext.ariaWarn = Ext.emptyFn;

Ext.define('mcat.Application', {
    extend: 'Ext.app.Application',

    name: 'mcat',

    requires: [
        'mcat.global.Config',
        'mcat.global.Util',
        'mcat.global.Concertmaster'
    ],

    stores: [ ],

    launch: function () {
        
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
