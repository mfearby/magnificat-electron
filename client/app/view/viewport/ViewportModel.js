/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('mcat.view.viewport.ViewportModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.viewport',

    lookForThenPlayNextTrack() {
        console.log('selectedDir: ' + mcat.global.Config.selectedDir);
        return false;
    }
});
