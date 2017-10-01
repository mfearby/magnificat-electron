Ext.define('mcat.view.simple.Simple', {
    extend: 'Ext.container.Container',
    alias: 'widget.simple',

    requires: [
        'mcat.view.simple.SimpleViewModel',
        'mcat.view.simple.SimpleViewController',
        'Ext.tree.Panel',
        'Ext.tree.View'
    ],

    viewModel: {
        type: 'simple'
    },
    controller: 'simple',

    listeners: {
        afterrender: 'onPanelAfterRender'
    },

    layout: 'border',
    title: 'Simple View',
    border: false,

    items: [
        {
            xtype: 'treepanel',
            region: 'west',
            split: true,
            reference: 'folderTree',
            width: 230,
            displayField: 'name',
            border: false,
            viewConfig: {
                listeners: {
                    itemcontextmenu: 'onTreeItemContextMenu',
                    selectionchange: 'onTreeSelectionChange',
                }
            },
            bind: {
                store: '{Folders}'
            }
        },
        {
            xtype: 'grid',
            region: 'center',
            bind: {
                store: '{Files}'
            },
            columns: [
                { text: 'Name', dataIndex: 'name', flex: 1 },
                { text: 'Size', dataIndex: 'size', width: 120 },
                { text: 'Modified', dataIndex: 'modified', width: 200 }
            ]
        }
    ]

});