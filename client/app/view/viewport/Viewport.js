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
    id: 'MainViewport', // ConcertMaster.js depends on this ID!

    listeners: {
        beforerender: 'onPanelBeforeRender', 
        afterrender: 'onPanelAfterRender'
    },

    items: [
        {
            xtype: 'player',
            region: 'north',
            id: 'MainPlayer', // Concertmaster.js depends on this ID!
            height: 60
        },
        {
            xtype: 'tabpanel',
            region: 'center',
            id: 'MainTabs',
            reference: 'tabPanel',
            items: [
                // Moved to: ViewportController.addFirstTab()
                // {
                //     xtype: 'simple'
                // }
            ],
            listeners: {
                tabchange: 'onTabChange'
            }
        }
    ]    

});