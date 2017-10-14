Ext.define('mcat.view.player.PlayerViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.player',

    requires: [
        'Ext.app.bind.Formula'
    ],

    data: {
        sliderMax: 1, // don't allow the slider to be moved until a file is loaded
        playerState: 'stopped',
        playerMuted: false,
        songPosition: '0:00',
        songDuration: '-0:00',
        volumeLevel: mcat.global.Config.volumeLevel
    },

    formulas: {
        playIconCls: function(get) {
            return get('playerState') === 'playing' ? 'x-fa fa-pause' : 'x-fa fa-play';
        },
        playButtonText: function(get) {
            return get('playerState') === 'playing' ? 'Pause' : 'Play';
        },
        muteIconCls: function(get) {
            return get('playerMuted') ? 'x-fa fa-volume-off' : 'x-fa fa-volume-up';
        }
    }

});