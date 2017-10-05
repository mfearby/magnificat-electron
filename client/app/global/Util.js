Ext.define('mcat.global.Util',{
    singleton: true,

    formatTime(totalSeconds) {
        // The slider.tipText passes thumb.value
        if (totalSeconds.value >= 0)
            totalSeconds = totalSeconds.value;

        if (totalSeconds <= 0) return '00:00';

        var hours = Math.floor((totalSeconds / 60) / 60);

        // Deduct the portion over 1 hour from remaining calculations
        if (totalSeconds >= 3600) {
            totalSeconds = totalSeconds - (hours * 60 * 60);
        }

        var minutes = Math.floor(totalSeconds / 60);
        minutes = (minutes >= 10) ? minutes : '0' + minutes;

        var seconds = Math.floor(totalSeconds % 60);
        seconds = (seconds >= 10) ? seconds : '0' + seconds;

        if (hours >= 1) minutes = hours + ':' + minutes;
        return minutes + ':' + seconds;
    },

    messageBox(message, icon, title) {
        var i = Ext.Msg.INFO;

        if (icon !== undefined) {
            if (icon === 'w') i = Ext.Msg.WARNING;
            if (icon === 'e') i = Ext.Msg.ERROR;
        }

        Ext.Msg.show({
            title: title || 'Magnificat', 
            msg: message, 
            buttons: Ext.Msg.OK, 
            icon: i
        });
    }


});