module.exports = () => {

    const { Router } = require('electron-routes');
    const fs = require('fs');
    const path = require('path');
    const mm = require('musicmetadata');

    // define custom mrf:// protocol
    const web = new Router('mrf'); 


    web.get('folders/?_dc=:_dc&node=:node', (req, res) => {
        var root = decodeURIComponent(req.params.node);
        // console.log('scanning dir: ' + root);

        var dirs = getDirectories(root);
        var dirObjs = dirs.map(function(dir) {
            return {
                name: dir,
                fullPath: root + path.sep + dir,
                expandable: true
            };
        });

        res.json({
            message: '',
            success: true,
            data: dirObjs,
            total: dirObjs.length
        });
    });


    function getDirectories(dir) {
        return fs.readdirSync(dir).filter(function (file) {
            return fs.statSync(dir + path.sep + file).isDirectory();
        });
    }


    // Parameters must be received in the same order in which they are sent, or else net::ERR_NOT_IMPLEMENTED
    // mrf://files/?path=%2FUsers%2Fmarc%2FMusic%2FCDs&_dc=1506770614501&page=1&start=0&limit=25
    web.get('files/?path=:path&_dc=:_dc&page=:page&start=:start&limit=:limit', (req, res) => {
        const allFiles = readFolder(decodeURIComponent(req.params.path));
        const start = req.params.start < allFiles.length ? req.params.start : 0;
        const end = req.params.page * req.params.limit;
        var promises = [];
        const page = allFiles.slice(start, end);
        
        // Create a promise for each file in this grid page to get the associated metadata
        for (let file of page) {
            promises.push(new Promise((resolve, reject) => {
                mm(fs.createReadStream(file.fullPath), { duration: true }, function (err, m) {
                    // Add the values from the metadata object (flattened for mcat.model.FileSystemItem)
                    file.album = m.album;
                    file.artist = m.artist.length > 0 ? m.artist[0] : '';
                    file.albumartist = m.albumartist.length > 0 ? m.albumartist[0] : '';
                    file.genre = m.genre.length > 0 ? m.genre[0] : '';
                    file.duration = m.duration;
                    file.diskno = m.disk.no;
                    file.diskof = m.disk.of;
                    file.title = m.title;
                    file.trackno = m.track.no;
                    file.trackof = m.track.of;
                    resolve(file);
                });
            }));
        }

        Promise.all(promises).then(data => {
            res.json({
                success: true,
                data: data,
                total: allFiles.length
            });
        }).catch(reason => {
            res.json({
                success: false,
                message: reason.toString()
            });
        });

    });


    function readFolder(dir) {
        var data = [];
        let files = fs.readdirSync(dir);

        for (let file of files) {
            let fullPath = dir + path.sep + file;
            let stats = fs.statSync(fullPath);
            if (!stats.isDirectory() && isMusicFile(file)) {
                data.push({
                    name: file,
                    size: stats.size,
                    modified: stats.mtime,
                    created: stats.birthtime,
                    fullPath
                });
            }
        }

        return data;
    } 


    function isMusicFile(filename) {
        let extension = filename.slice((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
        return ['mp3', 'flac', 'ogg', 'm4a', 'wma'].indexOf(extension) > -1; 
    }

}