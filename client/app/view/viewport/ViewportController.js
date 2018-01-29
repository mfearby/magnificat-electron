/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('mcat.view.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.viewport',

    onPanelAfterRender: function(container, layout, eOpts) {
        this.lookup('tabs').tabBar.hide();
    },

    onTabChange: function(panel, newTab, oldTab) {
        
    }
});
