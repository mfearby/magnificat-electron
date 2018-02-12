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


    loadNewTab: function(options, appInit = false) {
        let data = {
            appInit: appInit // if true, the controllingTab can take over the player again
        }
        Ext.apply(data, options);

        // Make sure a TabStateItem exists before the tab is created 
        let obj = mcat.global.State.getOrAddNewTabState(options);

        const tabs = Ext.getCmp('MainTabs');
        const tab = Ext.createByAlias('widget.simple', {
            closable: true,
            viewModel: {
                data: data,
                links: {
                    tabState: {
                        type: 'mcat.model.TabStateItem',
                        id: obj.get('id')
                    }
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
        const id = tab.getViewModel().get('tabState').get('id');

        mcat.global.State.setValue('controllingTab', id);

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
