Ext.define('mcat.view.simple.SimpleViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.simple',

    requires: [
        'Ext.app.bind.Formula',
        'mcat.model.FileSystemItem'
    ],

    data: {
        title: 'Music',
        isControllingPlayer: false,
        isPlaying: null,
        rootDir: mcat.global.Config.musicDir,
        pathSep: mcat.global.Config.pathSep,
        selectedDir: mcat.global.Config.musicDir,
        treeWidth: mcat.global.Config.treeWidth,
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
        }
    },

    // Called by ViewportModel.lookForThenPlayNextTrack()
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

    // This is called by updateControllingTab() in Application.js
    anotherTabIsPlaying() {
        this.setIsPlaying(false, false);
    },

    // This is called by currentTabPlayerToggle() in Application.js
    playerToggle(playing) {
        this.set('isPlaying', playing);
        let currentRecord = this.get('currentRecord');
        if (currentRecord)
            currentRecord.updateIsPlaying(playing);
    },

    // Update the icon for this tab so that the user knows which one is playing music
    setIsPlaying(controlling, playing) {
        this.set('isControllingPlayer', controlling);
        this.set('isPlaying', playing);

        let currentRecord = this.get('currentRecord')
        if (!playing && currentRecord) {
            // currentRecord.updateIsPlaying(null);

            // If it was previously playing, change it to 'paused'
            if (currentRecord.get('isPlaying'))
                currentRecord.updateIsPlaying(false);
        }
    },

    setCurrentRecordAndPlay(record) {
        let currentRecord = this.get('currentRecord')
        if (currentRecord) 
            currentRecord.updateIsPlaying(null);

        this.setIsPlaying(true, true);
        this.set('currentRecord', record);

        mcat.global.Concertmaster.play(record);
        record.updateIsPlaying(true);
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
    }
});