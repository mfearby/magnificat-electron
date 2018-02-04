Ext.define('mcat.view.simple.SimpleViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.simple',

    requires: [
        'Ext.app.bind.Formula',
        'mcat.model.FileSystemItem'
    ],

    data: {
        title: 'Music',
        rootDir: mcat.global.Config.musicDir,
        selectedDir: mcat.global.Config.musicDir,
        pathSep: mcat.global.Config.pathSep,
        isPlaying: null,
        isControllingPlayer: false,
        currentRecord: null,
        currentTreeRecord: null
    },

    formulas: {
        TreeRootName: function(get) {
            const bits = get('rootDir').split(get('pathSep'));
            return bits[bits.length - 1];
        },
        selectedDirEncoded: function(get) {
            return encodeURIComponent(get('selectedDir'));
        },
        tabIconClass: function(get) {
            if (!get('isControllingPlayer')) return '';
            if (get('isPlaying') === null) return '';
            return get('isPlaying') ? 'x-fa fa-volume-up' : 'x-fa fa-volume-off';
        },
        treeWidth: function(get) {
            const state = get('tabState');
            return state ? state.get('treeWidth') : 250;
        }
    },

    stores: {
        Folders: {
            type: 'tree',
            model: 'mcat.model.FileSystemItem',
            autoLoad: true,
            defaultRootId: '{rootDir}',
            root: {
                name: '{TreeRootName}',
                fullPath: '{rootDir}',
                expanded: false
            },
            proxy: {
                type: 'rest',
                url: 'mrf://folders',
                appendId: false,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }/*,
                listeners: {
                    exception: function(proxy, response, operation, eOpts) {
                        var obj = Ext.JSON.decode(response.responseText)
                        mcat.global.Util.messageBox(obj.message, 'e');
                    }
                }*/
            }
        },
        Files: {
            model: 'mcat.model.FileSystemItem',
            autoLoad: true,
            pageSize: 250,
            proxy: {
                type: 'rest',
                url: 'mrf://files/?path={selectedDirEncoded}',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }/*,
                listeners: {
                    exception: function(proxy, response, operation, eOpts) {
                        var obj = Ext.JSON.decode(response.responseText);
                        mcat.global.Util.messageBox(obj.message, 'e');
                    }
                }*/
            },
            listeners: {
                load: 'onFilesStoreLoad'
            }
        }
    },


    // Called by ViewportModel.js > lookForThenPlayNextTrack()
    lookForThenPlayNextTrack(opts) {
        const vm = this;
        const store = vm.getStore('Files');
        let record = vm.get('currentRecord');
        
        // This track most likely has just finished playing, so get the next one from the store
        if (record) {
            var index = store.indexOf(record);
            if (opts.reverse) {
                if (index > 0) index = index - 1;
            }
            else if (index < store.getTotalCount()) {
                index = index + 1;
            }
            record = store.getAt(index);
        }
        else {
            record = store.first();
        }

        if (record) {
            vm.setIsPlaying(true, true);
            vm.setCurrentRecordAndPlay(record);
        }
        
        return record;
    },


    // This is called by Application.js > updateControllingTab()
    anotherTabIsPlaying() {
        this.setIsPlaying(false, false);
    },


    // This is called by Application.js > currentTabPlayerToggle()
    playerToggle(playing) {
        this.set('isPlaying', playing);
        let rec = this.get('currentRecord');
        if (rec) 
            rec.updateIsPlaying(playing);
    },


    // Update the icon for this tab so that the user knows which one is playing music
    setIsPlaying(controlling, playing) {
        this.set('isControllingPlayer', controlling);
        this.set('isPlaying', playing);
        let rec = this.get('currentRecord')
        if (!playing && rec) {
            // If it was previously playing, change it to 'paused'
            if (rec.get('isPlaying')) 
                rec.updateIsPlaying(false);
        }
    },


    setCurrentRecordAndPlay(record) {
        let rec = this.get('currentRecord')
        if (rec) 
            rec.updateIsPlaying(null);

        this.setIsPlaying(true, true);
        this.set('currentRecord', record);

        mcat.global.Concertmaster.play(record);
        record.updateIsPlaying(true);

        this.updateTabState({ 'currentTrackPath': record.get('fullPath') });
    },


    updateTabState(obj) {
        // tabState is defined in Application.js > loadNewTab()
        const state = this.get('tabState');
        for (let [key, value] of Object.entries(obj)) {
            state.set(key, value);
        }
        state.save();
    }

});