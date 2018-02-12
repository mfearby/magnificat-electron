Ext.define('mcat.model.TabStateItem', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.field.String',
        'Ext.data.field.Integer',
        'Ext.data.field.Boolean'
    ],

    identifier: 'sequential',
    idProperty: 'id',

    proxy: {
        type: 'localstorage',
        id: 'tabs',
        writer: {
            type: 'json',
            writeAllFields: true
        }
    },

    fields: [
        { name: 'id',                  type: 'integer' },
        { name: 'title',               type: 'string'  },
        { name: 'rootDir',             type: 'string'  },
        { name: 'selectedDir',         type: 'string'  },
        { name: 'currentTrackPath',    type: 'string'  },
        { name: 'treeWidth',           type: 'integer',  defaultValue: 250 }
    ]
});