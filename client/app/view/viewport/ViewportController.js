/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('mcat.view.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.viewport',

    onPanelBeforeRender: function(container, eOpts) {
        this.addTabs();
        //this.addFirstTab();
    },

    onPanelAfterRender: function(container, layout, eOpts) {
        const tabs = this.lookup('tabPanel');
        if (tabs.items.getCount() === 1)
            tabs.tabBar.hide();
    },

    onTabChange: function(panel, newTab, oldTab) {
        // Moved to SimpleViewController > onPanelActivate()
        // const tab = this.lookup('tabPanel').getActiveTab();
        // const tabState = tab.getViewModel().get('tabState');
        // mcat.global.State.setActiveTab(tabState.get('id'));
    },

    addTabs() {
        // Get the TabStateItem.id of the user's last active tab
        const id = mcat.global.State.getActiveTab();
        const tabs = mcat.global.State.getAllTabs();
        let activateMe = null;
        tabs.each(function(rec, index, len) {
            const tab = mcat.getApplication().loadNewTab(rec.data);
            if (rec.get('id') == id)
                activateMe = tab;
            // mcat.getApplication().loadNewTab({
            //     id: rec.get('id'),
            //     title: rec.get('title'),
            //     rootDir: rec.get('rootDir'),
            //     selectedDir: rec.get('selectedDir')
            // });
        });

        if (activateMe)
            this.lookup('tabPanel').setActiveTab(activateMe);
    }

    // addFirstTab() {
    //     const existingStateIndex = 1;
    //     const rec = mcat.global.State.getTab(existingStateIndex, {
    //         title: 'Music',
    //         rootDir: mcat.global.Config.musicDir,
    //         selectedDir: mcat.global.Config.musicDir
    //     });

    //     mcat.getApplication().loadNewTab({
    //         id: 1,
    //         title: rec.get('title'),
    //         rootDir: rec.get('rootDir'),
    //         selectedDir: rec.get('selectedDir')
    //     }, existingStateIndex);
    // }

});