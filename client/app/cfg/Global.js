Ext.define('mcat.cfg.Global',{
    singleton: true,

    constructor: function (config) {
        const constants = require('electron').remote.getGlobal('Constants');
        Ext.apply(this, constants);
    },

    toString: function() {
        this.callParent();
        return '\nmusicDir = ' + this.musicDir;
    }
});