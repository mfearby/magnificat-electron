Ext.define('mcat.view.viewport.ViewportModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.viewport',

    lookForThenPlayNextTrack() {
        console.log('ViewportModel.lookForThenPlayNextTrack():');
        const vm = this.getActiveTab().getViewModel();
        let record = vm.lookForThenPlayNextTrack();
        return record;
    },

    getActiveTab() {
        return this.getView().query('tabpanel')[0].getActiveTab();
    }
});
