Ext.define('mcat.view.simple.SimpleViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.simple',

    requires: [
        'Ext.app.bind.Formula',
        'mcat.model.FileSystemItem'
    ],

    data: {
        rootDir: mcat.cfg.Global.musicDir,
        pathSep: mcat.cfg.Global.pathSep,
        selectedDir: mcat.cfg.Global.musicDir
    },

    formulas: {
        TreeRootName: function(get) {
            const bits = get('rootDir').split(get('pathSep'));
            return bits[bits.length - 1];
        },
        selectedDirEncoded: function(get) {
            let dir = encodeURIComponent(get('selectedDir'));
            return dir;
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