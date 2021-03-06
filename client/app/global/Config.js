Ext.define('mcat.global.Config', {
    singleton: true,

    ////////////////////////////////////////////////////////////////////////////////////////
    // Use this class for saving app-level settings, like window size, volume level, etc. //
    // File will be in the user's profile somewhere: "./magnificat/user-preferences.json" //
    ////////////////////////////////////////////////////////////////////////////////////////

    constructor: function (config) {
        const settings = this.getSettingsObject().data;
        Ext.apply(this, settings);
    },

    save(key, value) {
        const settings = this.getSettingsObject();
        settings.set(key, value);
        // Update the corresponding property on this object (put there by the constructor)
        this.key = value;
    },

    getMainProcess() {
        return require('electron').remote.require('./main');
    },

    getSettingsObject() {
        return this.getMainProcess().Settings;
    }

    // No need for this. Use "mcat.global.Config.whatever" instead
    // get(key) {
    //     const mainProcess = this.getMainProcess();
    //     return mainProcess.Settings.get(key);
    // },

    // toString: function() {
    //     this.callParent();
    //     return '\nmusicDir = ' + this.musicDir;
    // }


});