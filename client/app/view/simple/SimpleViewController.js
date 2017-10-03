Ext.define('mcat.view.simple.SimpleViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.simple',

    onGridItemDblClick: function(grid, record, item, index, e, eOpts) {
        const path = record.get('fullPath');
        const { ipcRenderer } = require('electron'); 
        // Send a message to the main process to read a file
        ipcRenderer.send('file:read', path);
        // Receive the contents of the file from the main process
        ipcRenderer.on('file:contents', (event, arg) => {  
            const player = document.getElementById('musicplayer');
            player.src = '';
            player.currentTime = 0;
            const file = new File([arg], record.get('name'), {type: 'audio/mpeg', lastModified: Date.now()});
            player.src = URL.createObjectURL(file);
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
                            mainProcess.Settings.set('lastDir', newFolder);
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
        // Remember the user's last selected folder 
        this.saveSetting('selectedDir', fullPath);
    },

    onTreePanelResize: function(panel, width, height, oldWidth, oldHeight, eOpts) {
        this.saveSetting('treeWidth', width);
    },

    onPanelAfterRender: function(container, layout, eOpts) {
        const selectedDir = this.getSetting('selectedDir');
        if (selectedDir) {
            this.expandTreePath(selectedDir);
        }
    },
    
    reloadTree(newPath) {
        const vm = this.getViewModel();
        vm.set('rootDir', newPath);
        vm.getStore('Folders').reload();
    },
    
    saveSetting(key, value) {
        const mainProcess = require('electron').remote.require('./main');
        mainProcess.Settings.set(key, value);
    },

    getSetting(key) {
        const mainProcess = require('electron').remote.require('./main');
        return mainProcess.Settings.get(key);
    },

    expandTreePath: function(path) {
        const vc = this;
        const vm = vc.getViewModel();
        const tree = vc.lookup('folderTree');
        const rootDir = vm.get('rootDir');
        const pathToExpand = vc.getFullTreeExpandPath(path, rootDir, mcat.cfg.Global.pathSep, ':');
        // console.log('pathToExpand: ' + pathToExpand);
        
        setTimeout(function() {
            tree.expandPath(pathToExpand, 'fullPath', ':', function(success, lastNode) {
                // Select the last tree node when the tree has finished expanding
                tree.selectPath(pathToExpand, 'fullPath', ':');
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
                // A colon is an illegal filename/folder character on Mac OS & Windows.
                // The only illegal chars on Linux are / and null, so let's hope nobody's using colons out there!
                pathToExpand += treePathSeparator + temp;
            }
        }

        return pathToExpand;
    }

});
