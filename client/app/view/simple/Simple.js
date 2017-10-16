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
            split: {
                size: 3
            },
            reference: 'folderTree',
            displayField: 'name',
            border: false,
            width: 230, // need default until binding takes effect or else 'Layout run failed' error occurs!
            bodyStyle: { border: 0 },
            viewConfig: {
                listeners: {
                    itemcontextmenu: 'onTreeItemContextMenu',
                    selectionchange: 'onTreeSelectionChange',
                    resize: 'onTreePanelResize'
                },
                getRowClass: function(record, rowIndex, rowParams, store) {
                    return record.get('isPlaying') ? 'isPlaying' : '';
                }
            },
            bind: {
                width: '{treeWidth}',
                store: '{Folders}'
            }
        },
        {
            xtype: 'grid',
            region: 'center',
            stateId: 'simpleGrid',
            stateful: true,
            bind: {
                store: '{Files}'
            },
            columns: [
                { 
                    xtype: 'templatecolumn', 
                    text: ' ', 
                    width: 25, 
                    tpl: [
                        '<tpl if="isPlaying">',
                        '    <span alt="now playing" class="x-fa fa-volume-off"/>',
                        '</tpl>'
                    ],
                },
                { 
                    text: 'Genre', 
                    dataIndex: 'genre',
                    flex: 1 
                },
                { 
                    text: 'Album',
                    dataIndex: 'album',
                    flex: 1 
                },
                { 
                    text: 'Album Artist', 
                    dataIndex: 'albumartist', 
                    flex: 1, 
                    hidden: true 
                },
                { 
                    text: 'Artist',
                    dataIndex: 'artist',
                    flex: 1 
                },
                { 
                    text: 'Title',
                    dataIndex: 'title',
                    flex: 1 
                },
                { 
                    text: 'Duration',
                    dataIndex: 'durationNice'
                },
                { 
                    text: 'File Name',
                    dataIndex: 'name',
                    flex: 1 
                },
                { 
                    text: 'Size',
                    xtype: 'templatecolumn',
                    tpl: '{[ Ext.util.Format.fileSize(values.size) ]}' 
                },
                { 
                    text: 'Modified',
                    dataIndex: 'modified',
                    xtype: 'datecolumn', 
                    format: 'd M Y, g:i a', width: 180 
                }
            ],
            viewConfig: {
                listeners: {
                    itemdblclick: 'onGridItemDblClick'
                }
            },
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    displayInfo: true,
                    bind: {
                        store: '{Files}'
                    }
                }
            ]
        }
    ]

});