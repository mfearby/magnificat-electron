Ext.define('mcat.global.Concertmaster', {
    singleton: true,

    constructor() {
        var me = this;
        const { ipcRenderer } = require('electron'); 
        // Receive the contents of the file from the main process.
        ipcRenderer.on('file:contents', (event, blob, info) => {  
            me._playBlob(blob, info);
        });
    },

    // Keep a reference to the File object so that its memory can be freed when a new file is played.
    previousFile: '',

    play(record) {
        const me = this,
              path = record.get('fullPath'),
              { ipcRenderer } = require('electron'); 
        // Send a message to the main process to read a file; the Ext JS record
        // can't be send back and forth between processes, or else the app freezes!
        ipcRenderer.send('file:read', {
            path: record.get('fullPath'),
            name: record.get('name'),
            type: 'audio/mpeg'
        });
    },

    _playBlob(blob, info) {
        const me = this,
              vm = me.getPlayerVM(),
              player = me.getPlayer(),
              file = new File([blob], info.name, {
                  type: info.type, lastModified: Date.now()
              });

        player.src = '';
        player.currentTime = 0;

        // Make sure the memory is freed up when playing each file.
        if (me.previousFile) {
            URL.revokeObjectURL(me.previousFile);
        }

        me.previousFile = file;
        player.src = URL.createObjectURL(file);

        // TODO: Do this without using an ID?
        Ext.getCmp('sliderTitle').setText(info.name);

        // Give the player enough time to figure out the duration. This is probably a tad
        // dodgy but it works fine. I'll get these details from the file itself, eventually.
        setTimeout(function() {
            vm.set('sliderMax', Math.floor(player.duration));
            // Value should always appear with a negative (to "count down") and also prevent label "jumping" briefly
            vm.set('songDuration', '-' + mcat.global.Util.formatTime(player.duration));
        }, 200);
    },

    getPlayer() {
        return document.getElementById('musicplayer');
    },

    getPlayerVM() {
        return this.getPlayerPanel().getViewModel();
    },

    getPlayerPanel() {
        return Ext.getCmp('MainPlayer');
    }

});