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
        const store = Ext.create('Ext.data.Store', {
            model: 'mcat.model.TabStateItem',
            autoSync: true
        });
        store.load();
        this.tabs = store;
    },

    
    getOrAddNewTabState(options) {
        let store = this.tabs;

        let obj = store.getById(options.id);
        if (obj) { 
            return obj;
        }

        var model = Ext.create('mcat.model.TabStateItem', options);
        let records = store.add(model);
        return records[0];
    },


    getAllTabs() {
        let store = this.tabs;

        if (store.count() == 0) {
            this.getOrAddNewTabState({
                title: 'Music',
                rootDir: mcat.global.Config.musicDir,
                selectedDir: mcat.global.Config.musicDir
            });
        }

        return store.getData();
    },


    getValue(key) {
        var storage = Ext.util.LocalStorage.get('mcat');
        const id = storage.getItem(key);
        storage.release();
        return id;
    },


    setValue(key, value) {
        var storage = Ext.util.LocalStorage.get('mcat');
        storage.setItem(key, value);
        storage.release();
    }

});