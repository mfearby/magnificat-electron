Ext.define('mcat.view.viewport.Viewport', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainviewport', // don't conflict with main Ext.container.Viewport alias

    requires: [
        'mcat.view.viewport.ViewportController',
        'mcat.view.viewport.ViewportModel',
        'mcat.view.simple.Simple'
    ],

    viewModel: 'viewport',
    controller: 'viewport',
    layout: 'border',

    items: [
        {
            xtype: 'panel',
            region: 'north',
            height: 75,
            items: [
                {
                    xtype: 'component',
                    id: 'musicplayer',
                    autoEl: {
                        tag: 'audio controls autoplay'
                    }
                }
            ]
        },
        {
            xtype: 'tabpanel',
            region: 'center',
            items: [
                {
                    xtype: 'simple'
                }
            ]
        }
    ]

});