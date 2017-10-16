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

    init: function() {
        // This needs to be set so that stateful grids can automatically save/restore their view states
        Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
    },

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
