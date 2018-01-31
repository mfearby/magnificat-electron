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
    },

    loadNewTab: function(rec) {
        const tabs = Ext.getCmp('MainTabs');
        const fullPath = rec.get('fullPath');
        const tab = Ext.createByAlias('widget.simple', {
            closable: true,
            viewModel: {
                data: {
                    title: rec.get('name'),
                    rootDir: fullPath,
                    selectedDir: fullPath,
                }
            },
            listeners: {
                beforeclose: function(panel) {
                    // count is still 2 until after this tab is destroyed
                    if (tabs.items.getCount() === 2) {
                        tabs.tabBar.hide();
                        //tabs.updateLayout();
                    }
                }
            }
        });

        tabs.add(tab);
        tabs.setActiveTab(tab);
        tabs.tabBar.show();
        //tabs.updateLayout();
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
