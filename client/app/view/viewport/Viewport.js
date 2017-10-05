Ext.define('mcat.view.viewport.Viewport', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainviewport', // don't conflict with main Ext.container.Viewport alias

    requires: [
        'mcat.view.viewport.ViewportController',
        'mcat.view.viewport.ViewportModel',
        'mcat.view.player.Player',
        'mcat.view.simple.Simple'
    ],

    viewModel: 'viewport',
    controller: 'viewport',
    layout: 'border',

    listeners: {
        afterrender: 'onPanelAfterRender'
    },

    items: [
        {
            xtype: 'player',
            region: 'north',
            id: 'MainPlayer', // ConcertMaster.js depends on this ID!
            height: 50
        },
        {
            xtype: 'tabpanel',
            region: 'center',
            reference: 'tabs',
            items: [
                {
                    xtype: 'simple'
                }
            ]
        }
    ]

});