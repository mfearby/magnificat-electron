Ext.define('mcat.view.simple.SimpleViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.simple',

    onPanelAfterRender: function(container, layout, eOpts) {
        const dir = mcat.global.Config.selectedDir;
        if (dir) {
            this.expandTreePath(dir);
        }
    },

    onGridItemDblClick: function(grid, record, item, index, e, eOpts) {
        const vc = this,
              vm = vc.getViewModel(),
              view = vc.getView(),
              path = record.get('fullPath'),
              { ipcRenderer } = require('electron'); 

        // Send a message to the main process to read a file
        ipcRenderer.send('file:read', path);
        
        // Receive the contents of the file from the main process
        ipcRenderer.on('file:contents', (event, blob) => {  
            mcat.global.Concertmaster.play(blob, record);
        });
    },

    onTreeItemContextMenu: function(view, rec, node, index, e) {
        e.stopEvent();
        // Show the context menu only for the root tree node
        if (index === 0) {
            // Make sure the item under the right-click is selected, too
            // if (!view.getSelectionModel().isSelected(rec)) {
            //     view.getSelectionModel().select(rec);
            // }

            const vc = this;
            const contextMenu = Ext.create('Ext.menu.Menu', {
                items: [{
                    text: 'Select Folder...',
                    iconCls: 'x-fa fa-folder-open',
                    handler: function(widget, event) {
                        const mainProcess = require('electron').remote.require('./main');
                        mainProcess.selectDirectory(function(newFolder) {
                            vc.reloadTree(newFolder);
                            mcat.global.Config.save('lastDir', newFolder);
                        });
                    }
                }]
            });
            contextMenu.showAt(e.getXY());
        }
        return false;
    },

    onTreeSelectionChange: function(model, selected, eOpts) {
        if (selected.length == 0) return;
        const fullPath = selected[0].get('fullPath');
        const vm = this.getViewModel();
        vm.set('selectedDir', fullPath);
        // Force all bindings to update or else the store will be using the previously selected path
        vm.notify();
        vm.getStore('Files').load();
        // Remember the user's last selected folder in the tree
        mcat.global.Config.save('selectedDir', fullPath);
    },

    onTreePanelResize: function(panel, width, height, oldWidth, oldHeight, eOpts) {
        mcat.global.Config.save('treeWidth', width);
    },
    
    reloadTree(newPath) {
        const vm = this.getViewModel();
        vm.set('rootDir', newPath);
        vm.getStore('Folders').reload();
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
