Ext.define('mcat.model.FileSystemItem', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.field.String',
        'Ext.data.field.Integer',
        'Ext.data.field.Boolean',
        'Ext.data.field.Date'
    ],

    idProperty: 'fullPath',

    fields: [
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'fullPath',
            type: 'string'
        },
        {
            name: 'size',
            type: 'integer'
        },
        {
            name: 'created',
            type: 'date'
        },
        {
            name: 'modified',
            type: 'date'
        },
        {
            name: 'hasChildren',
            type: 'boolean'
        },
        {
            name: 'expandable',
            type: 'boolean'
        },
        {
            name: 'children'
        }
    ]
});