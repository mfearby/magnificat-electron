Ext.ariaWarn = Ext.emptyFn;

Ext.define('mcat.Application', {
    extend: 'Ext.app.Application',

    name: 'mcat',

    requires: [
        'mcat.global.Config',
        'mcat.global.Util',
        'mcat.global.Concertmaster',
        'mcat.global.State'
    ],

    stores: [ ],

    init: function() {
        // This needs to be set so that stateful grids can automatically save/restore their view states
        Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
    },

    launch: function () {
        // FYI: Viewport is loaded via the 'mainView' property in ../app.js
    },

    loadNewTab: function(options) {
        let data = {}
        Ext.apply(data, options);

        let state = {
            type: 'mcat.model.TabStateItem'
        };

        // Link to the existing record if it's in local storage, otherwise create a new one
        if (options.id !== undefined)
            state.id = options.id;
        else 
            state.create = options;

        const tabs = Ext.getCmp('MainTabs');
        const tab = Ext.createByAlias('widget.simple', {
            closable: true,
            viewModel: {
                data: data,
                links: {
                    tabState: state
                }
            },
            listeners: {
                beforeclose: function(panel) {
                    // count is still 2 until after this tab is destroyed
                    if (tabs.items.getCount() === 2) {
                        tabs.tabBar.hide();
                    }
                }
            }
        });
        
        tabs.add(tab);
        tabs.setActiveTab(tab);
        tabs.tabBar.show();

        // Return the tab; used to setActiveTab() in ViewportController > addTabs()
        return tab;
    },

    updateControllingTab(tab) {
        this.controllingTab = tab;
        const tabs = Ext.getCmp('MainTabs');
        // Loop through all tabs and tell all but the playing tab to not show the playing icon
        tabs.items.each(function (panel) {
            if (tab !== panel) {
                panel.getViewModel().anotherTabIsPlaying();
            }
        });
    },

    // Keep a reference to the tab that's controlling the player
    controllingTab: null,

    // Called by PlayerViewController to advise the controlling tab about play/pause toggling
    toggleControllingTab(playing) {
        this.controllingTab.getViewModel().playerToggle(playing);
    }

});
