Ext.define('mcat.view.simple.SimpleViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.simple',

    onPanelAfterRender: function(container, layout, eOpts) {
        const dir = this.getViewModel().get('selectedDir');
        if (dir) {
            this.expandTreePath(dir);
        }
    },

    
    onPanelActivate: function(panel) {
        const tabState = this.getViewModel().get('tabState');
        const id = tabState.get('id');
        mcat.global.State.setValue('activeTab', id);
    },


    onPanelBeforeDestroy: function(panel, eOpts) {
        this.getViewModel().get('tabState').erase();
    },


    onResize: function(panel, width, height, oldWidth, oldHeight, eOpts) {
        if (oldWidth === undefined) return;
        this.getViewModel().updateTabState({ 'treeWidth': width });
    },


    play: function(record) {
        mcat.getApplication().updateControllingTab(this.getView());
        this.getViewModel().setCurrentRecordAndPlay(record);
    },


    ///////////////////////
    // GRID PANEL EVENTS //
    ///////////////////////

    onGridItemDblClick: function(grid, record, item, index, e, eOpts) {
        this.play(record);
    },


    onFilesStoreLoad: function(store, records, success, operation, eOpts) {
        const vc = this;
        const vm = vc.getViewModel();
        const appInit = vm.get('appInit');

        console.log('appInit: ' + appInit);

        // const controllingPlayer = vm.get('isControllingPlayer');
        // if (!vm.get('isControllingPlayer'))
        //     return;

        const currentRecord = vm.get('currentRecord');
        const isPlaying = vm.get('isPlaying');
        const sm = vc.lookup('simpleGrid').getSelectionModel();
        const fullPath = currentRecord ? currentRecord.get('fullPath') : vm.get('currentTrackPath');

        // Reset the isPlaying property again
        Ext.each(records, function(rec, index) {
            if (rec.get('fullPath') === fullPath) {
                
                sm.select([rec]);

                // TO DO: change this to set the current song/progress on startup but paused
                //        if the user doesn't want it to auto-play the last song on startup.
                if (appInit) {
                    vc.play(rec);

                } else {
                    rec.updateIsPlaying(isPlaying);
                    // Set this again in case the user browsed elsewhere then back again or refreshed the
                    // list, which means that the currentRecord is no longer the same object as this one.
                    vm.set('currentRecord', rec);
                }
            }
        });

        vm.set('appInit', false);
    },


    ///////////////////////
    // TREE PANEL EVENTS //
    ///////////////////////

    onTreeBeforeCellMouseDown: function(view, td, cellIndex, record, tr, rowIndex, e) {
        // This is all that's required to prevent items being selected when right-clicking
        return false;
    },

    onTreeItemContextMenu: function(view, rec, node, index, e) {
        e.stopEvent();
        const vc = this;

        // Show the context menu only for the root tree node
        if (index === 0) {
            Ext.create('Ext.menu.Menu', {
                items: [{
                    text: 'Select Folder...',
                    iconCls: 'x-fa fa-folder-open',
                    handler: function(widget, event) {
                        const mainProcess = require('electron').remote.require('./main');
                        mainProcess.selectDirectory(function(newFolder) {
                            vc.reloadTree(newFolder);
                        });
                    }
                }]
            }).showAt(e.getXY());

        } else {
            // Show the "Open in new Tab" menu
            Ext.create('Ext.menu.Menu', {
                items: [{
                    text: 'Open in new tab',
                    iconCls: 'x-fa fa-folder-open',
                    handler: function(widget, event) {
                        mcat.getApplication().loadNewTab({
                            title: rec.get('name'),
                            rootDir: rec.get('fullPath'),
                            selectedDir: rec.get('fullPath')
                        });
                    }
                }]
            }).showAt(e.getXY());
        }
    },

    onTreeSelectionChange: function(model, selected, eOpts) {
        if (selected.length == 0) return;

        const vm = this.getViewModel();
        const treeRec = selected[0];
        vm.set('currentTreeRecord', treeRec);

        const treeFullPath = treeRec.get('fullPath');
        vm.set('selectedDir', treeFullPath);
        vm.updateTabState({ 'selectedDir': treeFullPath });
        
        // Force all bindings to update or else the store will be using the previously selected path
        vm.notify();

        vm.getStore('Files').load(function(records, operation, success) {
            // code moved to onFilesStoreLoad()
        });
    },
    

    reloadTree(newPath) {
        const vc = this;
        const vm = vc.getViewModel();
        vm.set('rootDir', newPath);
        var title = newPath.split(mcat.global.Config.pathSep).pop();
        vm.set('title', title);
        vm.getStore('Folders').reload();

        vm.updateTabState({
            'rootDir': newPath,
            'selectedDir': newPath,
            'title': title,
            'currentTrackPath': null
        });
    },

    expandTreePath: function(path) {
        const vc = this;
        const vm = vc.getViewModel();
        const tree = vc.lookup('folderTree');
        const rootDir = vm.get('rootDir');
        // something almost guaranteed not to conflict with any file or folder names out there
        const treePathSep = '<(~)>'; 
        const pathToExpand = vc.getFullTreeExpandPath(path, rootDir, mcat.global.Config.pathSep, treePathSep);
        
        setTimeout(function() {
            tree.expandPath(pathToExpand, 'fullPath', treePathSep, function(success, lastNode) {
                // Select the last tree node when the tree has finished expanding
                tree.selectPath(pathToExpand, 'fullPath', treePathSep);
            });
        }, 500);

        // var test = vc.getFullTreeExpandPath('c:\\temp\\music\\baroque\\bach', 'c:\\', '\\', ':');
        // var test = vc.getFullTreeExpandPath('c:\\temp\\music\\baroque\\bach', 'c:\\temp\\music', '\\', ':');
        // console.log('Windows test: ' + test);
    },

    getFullTreeExpandPath(path, rootDir, pathSeparator, treePathSeparator) {
        // Path is usually like this: /Users/Marc/Music but expandPath wants each segment recursively 
        // added to its previous like this: /:/Users:/Users/Marc:/Users/Marc/Music:/Users/Marc/Music/Baroque
        // But since the root node is most likely going to start with /Users/Marc/Music,
        // the path to expand needs to be assembled AFTER this point.
        var subPathStartPos = (path.indexOf(rootDir) > -1) ? rootDir.length : 0;
        const subPath = path.substring(subPathStartPos, path.length);

        // Split the path after the rootDir into pieces
        var bits = subPath.split(pathSeparator);
        var pathToExpand = rootDir;

        for (var i = 0; i < bits.length; i++) {
            var bit = bits[i];
            if (bit !== '') {
                var temp = rootDir + pathSeparator;
                for (var x = 0; x <= i; x++) {
                    var piece = bits[x];
                    if (piece !== '') {
                        temp += piece;
                        // Don't add the path separator at the end (FileSystemItem.fullPath values do not end with same!)
                        if (x < i) {
                            temp += pathSeparator;
                        }
                    }
                }
                pathToExpand += treePathSeparator + temp;
            }
        }

        return pathToExpand;
    }

});
