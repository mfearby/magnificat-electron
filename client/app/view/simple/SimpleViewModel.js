Ext.define('mcat.view.simple.SimpleViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.simple',

    requires: [
        'Ext.app.bind.Formula',
        'mcat.model.FileSystemItem'
    ],

    data: {
        rootDir: mcat.global.Config.musicDir,
        pathSep: mcat.global.Config.pathSep,
        selectedDir: mcat.global.Config.musicDir,
        treeWidth: mcat.global.Config.treeWidth,
        currentRecord: null
    },

    formulas: {
        TreeRootName: function(get) {
            const bits = get('rootDir').split(get('pathSep'));
            return bits[bits.length - 1];
        },
        selectedDirEncoded: function(get) {
            return encodeURIComponent(get('selectedDir'));
        }
    },

    // Called by ViewportModel.lookForThenPlayNextTrack()
    lookForThenPlayNextTrack() {
        console.log('SimpleViewModel.lookForThenPlayNextTrack():');
        const vm = this;
        let record = vm.get('currentRecord');
        
        if (!record) {
            let store = vm.getStore('Files');
            console.log('Selecting first record from store');
            record = store.first();
            if (record) vm.setCurrentRecordAndPlay(record);
        }
        
        return record;
    },

    setCurrentRecordAndPlay(record) {
        this.set('currentRecord', record);
        mcat.global.Concertmaster.play(record);
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
                },
                listeners: {
                    exception: function(proxy, request, operation, eOpts) {
                        Ext.Msg.show({
                            title: 'Error: ' + response.status,
                            msg: response.responseText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        });
                    }
                }
            }
        },
        Files: {
            model: 'mcat.model.FileSystemItem',
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: 'mrf://files/?path={selectedDirEncoded}',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                listeners: {
                    exception: function(proxy, request, operation, eOpts) {
                        Ext.Msg.show({
                            title: 'Error: ' + response.status,
                            msg: response.responseText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        });
                    }
                }
            }
        }
    }
});