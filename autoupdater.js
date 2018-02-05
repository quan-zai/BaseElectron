const os = require('os');
const {app, autoUpdateer, dialog} = require('electron');
const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();

const updateFeedURL = 'http://BaseElectron.herokuapp.com/' + platform + '/' + version;

function appUpdater() {
    autoUpdateer.setFeedURL(updateFeedURL);
    autoUpdateer.on('error', err => console.log(err));
    autoUpdateer.on('checking-for-update', () => console.log('checking-for-update'));
    autoUpdateer.on('update-available', () => console.log('update-available'));
    autoUpdateer.on('update-not-available', () => console.log('update-not-available'));

    autoUpdateer.on('update-downloaded', (event, releaseNotes, releaseName) => {
        let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.';
        if (releaseNotes) {
            const splitNotes = releaseNotes.split(/[^\r]\n/);
            message += '\n\nRelease notes:\n';
            splitNotes.forEach(notes => {
                message += notes + '\n\n';
            });
        }
        // Ask user to update the app
        dialog.showMessageBox({
            type: 'question',
            buttons: ['Install and Relaunch', 'Later'],
            defaultId: 0,
            message: 'A new version of ' + app.getName() + ' has been downloaded',
            detail: message
        }, response => {
            if (response === 0) {
                setTimeout(() => autoUpdater.quitAndInstall(), 1);
            }
        });
    })
    autoUpdater.checkForUpdates();
}

exports = module.exports = {
    appUpdater
};