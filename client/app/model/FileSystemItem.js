Ext.define('mcat.model.FileSystemItem', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.field.String',
        'Ext.data.field.Integer',
        'Ext.data.field.Boolean',
        'Ext.data.field.Date'
    ],

    idProperty: 'fullPath',

    updateIsPlaying(isPlaying) {
        this.set('isPlaying', isPlaying);
        this.commit(); // removes the red triangle in the grid cell
    },

    fields: [
        { name: 'name',          type: 'string'  },
        { name: 'fullPath',      type: 'string'  },
        { name: 'size',          type: 'integer' },
        { name: 'created',       type: 'date'    },
        { name: 'modified',      type: 'date'    },

        { name: 'hasChildren',   type: 'boolean' },
        { name: 'expandable',    type: 'boolean' },
        { name: 'children'                     },

        // False means it's paused and null means neither playing or paused
        { name: 'isPlaying',     type: 'boolean',   allowNull: true },

        { name: 'album',         type: 'string'  },
        { name: 'albumartist',   type: 'string'  },
        { name: 'artist',        type: 'string'  },
        { name: 'diskno',        type: 'integer' },
        { name: 'diskof',        type: 'integer' },
        { name: 'duration',      type: 'float'   },
        { name: 'title',         type: 'string'  },
        { name: 'trackno',       type: 'integer' },
        { name: 'trackof',       type: 'integer' },
        { name: 'year',          type: 'integer' },
        { 
            name: 'durationNice',  
            type: 'string', 
            depends: 'duration',
            convert: function(v, rec) { 
                return mcat.global.Util.formatTime(rec.get('duration'));
            } 
        },
        { 
            name: 'sliderTitle',  
            type: 'string', 
            depends: [ 'title', 'name', 'artist' ],
            convert: function(v, rec) { 
                if (rec.get('title')) 
                    return rec.get('artist') + ' - ' + rec.get('title');
                else
                    return rec.get('name');
            } 
        }

    ]
});