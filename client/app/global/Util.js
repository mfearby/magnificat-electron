Ext.define('mcat.global.Util',{
    singleton: true,

    formatTime(totalSeconds) {
        // The slider.tipText passes thumb.value
        if (totalSeconds.value >= 0)
            totalSeconds = totalSeconds.value;

        if (totalSeconds <= 0) return '0:00';

        var hours = Math.floor((totalSeconds / 60) / 60);

        // Deduct the portion over 1 hour from remaining calculations
        if (totalSeconds >= 3600) {
            totalSeconds = totalSeconds - (hours * 60 * 60);
        }

        var minutes = Math.floor(totalSeconds / 60);
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
    },


    getFileExtension(path) {
        // Efficient and reliable method to get the file extension sourced from: 
        // https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript/12900504#12900504
        return path.slice((Math.max(0, path.lastIndexOf(".")) || Infinity) + 1);
    },


    getMimeType(filename) {
        const ext = this.getFileExtension(filename);
        const types = {
            'flac': 'audio/flag',
            'm4a': 'audio/mp4',
            'mp3': 'audio/mpeg',
            'ogg': 'audio/ogg',
            'wma': 'audio/x-ms-wma'
        };
        var mime = types[ext] !== undefined ? types[ext] : '';
        return mime;
    }

});