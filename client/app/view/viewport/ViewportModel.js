Ext.define('mcat.view.viewport.ViewportModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.viewport',

    // Called by playNextTrack() in Player.js
    lookForThenPlayNextTrack(opts) {
        opts = opts || {};
        const vm = this.getActiveTab().getViewModel();
        let record = vm.lookForThenPlayNextTrack(opts);
        return record;
    },

    getActiveTab() {
        return this.getView().query('tabpanel')[0].getActiveTab();
    }
});
