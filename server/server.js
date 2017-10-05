module.exports = () => {

    const { Router } = require('electron-routes');
    const fs = require('fs');
    const path = require('path');

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
      
        // const start = req.params.start < people.length ? req.params.start : 0;
        // const end = req.params.limit * req.params.page;
        // const limit = end;

        // TODO: paginate!
        let files = readFolder(decodeURIComponent(req.params.path));

        res.json({
            success: true,
            data: files,
            total: files.length,
            message: ''
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
        // Efficient and reliable method to get the file extension sourced from: 
        // https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript/12900504#12900504
        let extension = filename.slice((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
        return ['mp3', 'flac', 'ogg', 'm4a'].indexOf(extension) > -1; 
    }

}