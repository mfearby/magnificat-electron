# Magnificat

Magnificat will become a magnificent cataloguing app for classical music enthusiasts with large CD collections to organise. Here's what it looks like so far:

![Screenshot of version 0.1 so far](screenshot.png)

There are no binaries to download yet (so this means you've also got to be a programming enthusiast to check it out, for now).

## Project Roadmap

This project is only a hobby so the following delivery dates should be taken with a grain of salt!

### Version 0.1 (end of October 2017)
- Use Electron and Ext JS to create an interface allowing users to open multiple tabs.
- Allow users to browse/play music on the filesystem.
- Remember play count and last date for each track by saving information to a file in the current directory (optional).
 
### Version 0.2 (end of January 2018)
- Allow users to browse/play music by genre, composer, album, etc (like the column browser in iTunes; requires a database which will be updated periodically).
- Editing of tag information (including obtaining of details from file names based on user-entered format).

### Version 0.3 (end of April 2018)
- Ripping CDs to MP3, OGG, and FLAC.
- Use CDDB et al for default tags.

### Version 0.4 (end of May 2018)
- Mini player support (with single-click buttons to switch between both views).

### Version 0.5 (end of July 2018)
- Rip CDs to FLAC and transfer existing file names and tag information from user-selected lossless equivalents on disc.

### Version 0.6 (end of October 2018)
- Allow users to rename files based on tag information.

## Pre-requisites

There are no binaries uploaded to this repository (yet), so you will need the following in order to compile and run the source (in addition to being a developer of some kind who isn't afraid to compile something!):

- Sencha Ext JS 6.2.0 [GPL v3 version](https://www.sencha.com/legal/GPL/)
- [Sencha Cmd](https://www.sencha.com/products/sencha-cmd/) 6.5.1+ build tool
- [Node.js](https://nodejs.org/) 6.11+
- [Electron](https://github.com/electron/electron) 1.7.6+ (installed via [npm](https://www.npmjs.com/))

## Quick Start

```
$ git clone https://github.com/mfearby/magnificat.git
$ cd magnificat
$ npm install
```

Extract a copy of the Ext JS framework into the client/ext folder

```
$ cd client
$ sencha app build development
$ cd ..
$ npm run plain
```

After cloning the repository you should "npm run plain" because the default "npm start" loads the built version of the Ext JS application, which you won't have yet.

## Building the Ext JS app

The built/minified version of the app is generated and copied to the client_build folder

### Mac/Linux
```
$ chmod 755 buildext.sh
$ ./buildext.sh
```

### Windows
```
C:\magnificat> ./buildext
```

## Packaging the Electron app with Ext JS

The package script calls the existing build script (above) to minify the Ext JS app then calls the [Electron Packager](https://github.com/electron-userland/electron-packager) script to bundle everything together with Electron for distribution.

### Mac/Linux
```
$ chmod 755 package.sh
$ ./package.sh
```

### Windows
```
C:\magnificat> ./package
```

## Author
Marc Fearby
- [marcfearby.com](http://marcfearby.com)
- [@marcfearby](https://twitter.com/MarcFearby)
