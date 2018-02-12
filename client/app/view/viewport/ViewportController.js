/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('mcat.view.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.viewport',

    onPanelBeforeRender: function(container, eOpts) {
        this.addTabs();
    },

    onPanelAfterRender: function(container, layout, eOpts) {
        const tabs = this.lookup('tabPanel');
        if (tabs.items.getCount() === 1)
            tabs.tabBar.hide();
    },

    onTabChange: function(panel, newTab, oldTab) {
        // Moved to SimpleViewController > onPanelActivate()
    },

    addTabs() {
        // Get the TabStateItem.id of the user's last active tab
        const id = mcat.global.State.getValue('activeTab');
        const tabs = mcat.global.State.getAllTabs();
        let activateMe = null;
        
        tabs.each(function(rec, index, len) {
            const tab = mcat.getApplication().loadNewTab(rec.data, true);
            if (rec.get('id') == id)
                activateMe = tab;
        });

        if (activateMe)
            this.lookup('tabPanel').setActiveTab(activateMe);
    }

});