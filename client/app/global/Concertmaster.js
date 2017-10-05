Ext.define('mcat.global.Concertmaster', {
    singleton: true,

    // Keep a reference to the File object so that its memory can be freed when a new file is played
    previousFile: '',

    play(FileSystemItemRecord) {
        const me = this,
              path = FileSystemItemRecord.get('fullPath'),
              { ipcRenderer } = require('electron'); 

        // Send a message to the main process to read a file
        ipcRenderer.send('file:read', path);
        
        // Receive the contents of the file from the main process
        ipcRenderer.on('file:contents', (event, blob) => {  
            me._playBlob(blob, FileSystemItemRecord);
        });
    },

    _playBlob(blob, record) {
        const me = this,
              vm = me.getPlayerVM(),
              player = me.getPlayer(),
              file = new File([blob], record.get('name'), {
                  type: 'audio/mpeg', lastModified: Date.now()
              });

        player.src = '';
        player.currentTime = 0;

        // Make sure the memory is freed up when playing each file
        if (me.previousFile) {
            URL.revokeObjectURL(me.previousFile);
        }

        me.previousFile = file;
        player.src = URL.createObjectURL(file);

        // Give the player enough time to figure out the duration
        setTimeout(function() {
            vm.set('sliderMax', Math.floor(player.duration));
            vm.set('songDuration', mcat.global.Util.formatTime(player.duration));
        }, 200);
    },

    // getNextTrack() {
    //     const vp = Ext.getCmp('MainViewport');

    // },

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