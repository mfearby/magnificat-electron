Ext.define('mcat.view.player.PlayerViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.player',

    onPanelAfterRender(component, eOpts) {
        var vc = this,
            vm = vc.getViewModel(),
            view = vc.getView();
            
        // Create function to throttle volume level save requests
        this.debouncedSaveVolume = Ext.Function.createThrottled(function(value) {
            mcat.global.Config.save('volumeLevel', value);
        }, 1000);

        var player = document.getElementById('musicplayer'),
            progressSlider = view.down('#progressSlider');

        player.addEventListener('timeupdate', function() {
            progressSlider.suspendEvent('change');
            progressSlider.setValue(Math.floor(player.currentTime));
            progressSlider.resumeEvent('change');
            var lbl = mcat.global.Util.formatTime(player.currentTime);
            vm.set('songPosition', lbl);
            // Count down the remaining time (initial label value is set in Concertmaster._playBlob)
            let remaining = player.duration - player.currentTime;
            // first time will be NaN
            if (remaining) {
                var lblRemain = mcat.global.Util.formatTime(remaining);
                vm.set('songDuration', '-' + lblRemain);
            }
        }, false);

        player.addEventListener('play', function() {
            vm.set('playerState', 'playing');
            vc.notifyCurrentTab(true);
        }, false);

        player.addEventListener('ended', function() {
            vc.playNextTrack();
        }, false);

        player.addEventListener('pause', function() {
            vm.set('playerState', 'paused');
            vc.notifyCurrentTab(false);
        }, false);

        player.addEventListener('volumechange', function(e) {
            var muted = player.muted || player.volume === 0;
            vm.set('playerMuted', muted);
            vm.set('volumeLevel', player.volume * 100)
        }, false);
    },

    notifyCurrentTab(playing) {
        mcat.getApplication().toggleControllingTab(playing);
    },

    // called by slider.tipText in Player.js
    formatTime() {
        return this.getViewModel().get('songPosition') || '';
    },

    onPlayButtonClick(button, e, eOpts) {
        var player = document.getElementById('musicplayer');

        if (player.src) {
            if (player.paused || player.ended) {
                player.play();
            }
            else {
                player.pause();
            }
        } else {
            if (!this.playNextTrack())
                mcat.global.Util.messageBox('Please select a file to play first', 'w');
        }
    },

    onNextButtonClick(button, e, eOpts) {
        this.playNextTrack();
    },

    onPreviousButtonClick(button, e, eOpts) {
        this.playNextTrack({ reverse: true });
    },

    playNextTrack(opts) {
        // Ask the ViewportModel to find the first/next track from the current tab
        return this.getViewModel().getParent().lookForThenPlayNextTrack(opts);
    },

    onStopButtonClick(button, e, eOpts) {
        var player = document.getElementById('musicplayer');

        if (player.src) {
            player.pause();
            if (player.currentTime) player.currentTime = 0;
        }
    },

    onSliderChange(slider, newValue, thumb, eOpts) {
        var player = document.getElementById('musicplayer');

        if (player.src) {
            player.currentTime = Math.floor(newValue);
        }
    },

    onMuteButtonClick(button, e, eOpts) {
        var player = document.getElementById('musicplayer');
        player.muted = !player.muted;
    },

    onVolumeSliderChange(slider, newValue, thumb, eOpts) {
        var player = document.getElementById('musicplayer');
        player.volume = newValue / 100;
        this.debouncedSaveVolume(slider.getValue());
    }

});
