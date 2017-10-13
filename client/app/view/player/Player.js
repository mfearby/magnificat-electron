Ext.define('mcat.view.player.Player', {
    extend: 'Ext.container.Container',
    alias: 'widget.player',

    requires: [
        'mcat.view.player.PlayerViewModel',
        'mcat.view.player.PlayerViewController'
    ],

    viewModel: {
        type: 'player'
    },
    controller: 'player',

    listeners: {
        afterrender: 'onPanelAfterRender'
    },

    layout: {
        type: 'hbox',
        align: 'middle'
    },

    cls: 'header',

    items: [
        {
            xtype: 'component',
            id: 'musicplayer',
            autoEl: {
                tag: 'audio autoplay'
            }
        },
        {
            xtype: 'button',
            height: 30,
            itemId: 'playPauseButton',
            margin: '0 9 0 7',
            width: 30,
            bind: {
                iconCls: '{playIconCls}'
            },
            listeners: {
                click: 'onPlayButtonClick'
            }
        },
        {
            xtype: 'button',
            itemId: 'prevButton',
            iconCls: 'x-fa fa-step-backward',
            listeners: {
                click: 'onPreviousButtonClick'
            }
        },
        {
            xtype: 'button',
            itemId: 'stopButton',
            margin: '0 5 0 5',
            iconCls: 'x-fa fa-stop',
            listeners: {
                click: 'onStopButtonClick'
            }
        },
        {
            xtype: 'button',
            itemId: 'nextButton',
            iconCls: 'x-fa fa-step-forward',
            listeners: {
                click: 'onNextButtonClick'
            }
        },
        {
            xtype: 'label',
            margin: '0 9 0 9',
            bind: {
                text: '{songPosition}'
            }
        },
        {
            xtype: 'container',
            flex: 1,
            cls: 'sliderBox',
            itemId: 'player_box',
            padding: '0 10 0 10',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'label',
                    margin: '7 0 0 0',
                    padding: 0,
                    height: 15,
                    cls: 'sliderTitle',
                    id: 'sliderTitle', // used by Concertmaster to update with the track name
                    text: 'No file selected'
                },
                {
                    xtype: 'slider',
                    reference: 'slider',
                    ariaLabel: 'Track Progress',
                    flex: 1,
                    itemId: 'progressSlider',
                    margin: 0,
                    padding: 0,
                    value: 0,
                    useTips: true,
                    tipText: 'formatTime',
                    bind: {
                        maxValue: '{sliderMax}'
                    },
                    listeners: {
                        change: 'onSliderChange'
                    }
                }
            ]
        },
        {
            xtype: 'label',
            margin: '0 9 0 9',
            bind: {
                text: '{songDuration}'
            }
        },
        {
            xtype: 'button',
            itemId: 'muteButton',
            bind: {
                iconCls: '{muteIconCls}'
            },
            listeners: {
                click: 'onMuteButtonClick'
            }
        },
        {
            xtype: 'slider',
            width: 100,
            ariaLabel: 'Volume',
            itemId: 'volumeSlider',
            margin: '0 7 0 7',
            value: 100, // default until binding takes effect
            bind: {
                value: '{volumeLevel}'
            },
            listeners: {
                change: 'onVolumeSliderChange'
            }
        }

    ]
});