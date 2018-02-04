Ext.define('mcat.global.State', {
    singleton: true,
    
    requires: [
        'mcat.model.TabStateItem'
    ],

    tabs: null,

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Use this class to remember open tabs, selected sub-folders, song positions, etc.      //
    // This uses HTML5 LocalStorage in the client browser process via Ext.util.LocalStorage. // 
    ///////////////////////////////////////////////////////////////////////////////////////////

    constructor: function () {
        // Customise the model in order to set the seed value
        let mdl = Ext.define('mcat.model.TabStateItem2', {
            extend: 'mcat.model.TabStateItem',
            identifier: {
                type: 'sequential',
                seed: 1000
            }
        });

        const store = Ext.create('Ext.data.Store', {
            model: mdl //'mcat.model.TabStateItem'
        });
        this.tabs = store;
        store.load();
        // Add the initial tab if this is the first time Magnificat starts
        if (store.count() === 0) {
            store.add({
                title: 'Music',
                rootDir: mcat.global.Config.musicDir,
                selectedDir: mcat.global.Config.musicDir
            });
            store.sync({
                failure: function(batch, options) {
                    mcat.global.Util.messageBox('Failed to add default Music tab to local storage', 'Critical Error', 'e');
                }
            });
        }
    },

    
    // getTab(index, defaults) {
    //     var tab = this.tabs.getById(index);
    //     if (tab === null) {
    //         tab = Ext.create('mcat.model.TabStateItem', defaults);
    //     }
    //     return tab;
    // },


    getAllTabs() {
        return this.tabs.getData();
    },


    setActiveTab(id) {
        var storage = Ext.util.LocalStorage.get('mcat');
        storage.setItem('activeTab', id);
        storage.release();
    },


    getActiveTab() {
        var storage = Ext.util.LocalStorage.get('mcat');
        const id = storage.getItem('activeTab');
        storage.release();
        return id || 0;
    }

});