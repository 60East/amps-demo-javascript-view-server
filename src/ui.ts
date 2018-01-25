import { Message } from 'amps';
import { AMPSQuery, QueryOptions } from './sql';
import * as settings from './constants.js';

declare var $$: any;


/**
 * This class encapsulates the UI. And provides
 * two-way communication API
 */
export class AMPSQueryUi {
    // private fields
    private _orderQuery: AMPSQuery;
    private _vwapQuery: AMPSQuery;
    private _vwapQueryDynamic: AMPSQuery;
    private id: string;
    private type: string;
    private rows: any[];

    /**
     * This is the constructor that initializes the UI object.
     */
    constructor() {
        const filterOption = {
            view: 'text',
            id: 'filter',
            label: 'Filter',
            name: 'filter',
            labelAlign: 'right',
            placeholder: 'Optional: Enter a Content Filter'
        };

        const orderByOption = {
            view: 'text',
            id: 'orderby',
            label: 'Order By',
            labelAlign: 'right',
            width: 250,
            placeholder: 'Optional: Enter the ID'
        };

        const optionsOption = {
            view: 'text',
            id: 'options',
            label: 'Options',
            labelAlign: 'right',
            width: 280,
            placeholder: 'Optional: Query Options'
        };

        const topNOption = {
            view: 'text',
            id: 'top_n',
            label: 'TopN',
            labelAlign: 'right',
            width: 280,
            placeholder: 'Optional: Top N records'
        };
        
        const connectButton = {cols: [
            {view: 'spacer'},
            {
                view: 'button',
                id: 'connect_button',
                value: 'Connect',
                width: 100,
                hotkey: 'enter',
                click: () => {
                    const ordersTable = $$('orders_table');
                    const vwapTable = $$('vwap_table');
                    const vwapDynamicTable = $$('vwap_dynamic_table');

                    // Stop button pressed
                    if ($$('connect_button').getValue() === 'Stop') {
                        // stop the quries, if any
                        if (this._orderQuery) { this._orderQuery.stop(); }
                        if (this._vwapQuery) { this._vwapQuery.stop(); }
                        if (this._vwapQueryDynamic) { this._vwapQueryDynamic.stop(); }

                        this.enableFormControls();

                        vwapTable.clearAll();
                        vwapDynamicTable.clearAll();
                        ordersTable.clearAll();

                        return;
                    }

                    // Connect button pressed
                    this.enableFormControls(false);

                    this.queryVWAPData({
                        topN: (<string>$$('top_n').getValue()),
                        filter: (<string>$$('filter').getValue()),
                        orderBy: (<string>$$('orderby').getValue()),
                        options: (<string>$$('options').getValue())
                    });
                    this.queryVWAPDataDynamic({
                        topN: (<string>$$('top_n').getValue()),
                        filter: (<string>$$('filter').getValue()),
                        orderBy: (<string>$$('orderby').getValue()),
                        options: (<string>$$('options').getValue())
                    });
                    this.queryOrderData({
                        topN: (<string>$$('top_n').getValue()),
                        filter: (<string>$$('filter').getValue()),
                        orderBy: (<string>$$('orderby').getValue()),
                        options: (<string>$$('options').getValue())
                    });
                }
            }
        ]};

        // Create the form itself
        const form = {
            view: 'form',
            id: 'query_controls',
            fillspace: true,
            margin: 5,
            elements: [
                {cols: [
                    filterOption,
                    {width: 12}
                ]},
                {cols: [
                    topNOption,
                    orderByOption,
                    optionsOption,
                    {view: 'spacer', minWidth: 20},
                    connectButton,
                    {width: 12}
                ]}
            ]
        };

        // Create the ORDERS table
        const ordersTable = {
            id: 'orders_table',
            view: 'datatable',
            columns: [
                {
                    id: 'symbol',
                    header: 'Symbol',
                    fillspace: 1
                },
                {
                    id: 'qty',
                    fillspace: 1,
                    header: 'Quantity',
                    css: {'text-align': 'right'},
                    format: webix.i18n.numberFormat
                },
                {
                    id: 'price',
                    header: 'Price',
                    fillspace: 1,
                    css: {'text-align': 'right'},
                    format: webix.i18n.priceFormat
                },
                {
                    id: 'ts',
                    header: 'Timestamp',
                    fillspace: 1,
                    template: (value: any) => {
                        const date = new Date(+(value.ts) * 1000);
                        return webix.i18n.dateFormatStr(date) + ' ' + webix.i18n.timeFormatStr(date);
                    }
                }
            ],
            resizeColumn: true,
            autoConfig: true
        };

        // Create the VWAP view table
        const vwapTable = {
            id: 'vwap_table',
            view: 'datatable',
            columns: [
                {
                    id: 'symbol',
                    header: 'Symbol',
                    fillspace: 1
                },
                {
                    id: 'vwap',
                    header: 'VWAP',
                    css: {'text-align': 'right'},
                    fillspace: 1,
                    format: webix.i18n.priceFormat
                }
            ],
            resizeColumn: true,
            autoConfig: true
        };

        // Create the VWAP dynamic aggregation table
        const vwapDynamicTable = {
            id: 'vwap_dynamic_table',
            view: 'datatable',
            columns: [
                {
                    id: 'symbol',
                    header: 'Symbol',
                    fillspace: 1
                },
                {
                    id: 'vwap',
                    header: 'VWAP',
                    css: {'text-align': 'right'},
                    fillspace: 1,
                    format: webix.i18n.priceFormat
                }
            ],
            resizeColumn: true,
            autoConfig: true
        };

        // Build the UI together
        this.id = 'amps_view_server_demo_widget';
        this.type = 'clean';
        this.rows = [
            {
                view: 'template',
                template: `<img src="img/logo.png" id="logo" /> AMPS View Server Demo`,
                type: 'header',
                css: 'component-header'
            },
            form,
            {cols: [
                {rows: [
                    {
                        id: 'orders_table_header',
                        view: 'template',
                        template: 'Orders',
                        height: 28,
                        type: 'header',
                        css: 'results-header'
                    },
                    ordersTable
                ], width: 700},
                {view: 'resizer'},
                {rows: [
                    {
                        id: 'vwap_table_header',
                        view: 'template',
                        template: 'VWAP',
                        height: 28,
                        type: 'header',
                        css: 'results-header'
                    },
                    vwapTable,
                    {
                        id: 'vwap_dynamic_table_header',
                        view: 'template',
                        template: 'VWAP (Dynamic Aggregation)',
                        height: 28,
                        type: 'header',
                        css: 'results-header'
                    },
                    vwapDynamicTable
                ]}
            ]}
        ];
    }

    /**
     * This is a helper private method that switches the query form state.
     * @param enable The form is enabled if true, disabled otherwise.
     */
    private enableFormControls(enable: boolean = true): void {
        const button = $$('connect_button');
        const method = enable ? 'enable' : 'disable';

        $$('top_n')[method]();
        $$('filter')[method]();
        $$('orderby')[method]();
        $$('options')[method]();
        button.setValue(enable ? 'Connect' : 'Stop');
        button.refresh();
    }

    queryOrderData(queryParams: QueryOptions): void  {
        const topN: number = (queryParams.topN ? +(queryParams.topN) : settings.LAST_N_ORDERS);
        queryParams.topN = '' + topN;

        const ordersTable = $$('orders_table');

        // get data from AMPS and display it
        this._orderQuery = new AMPSQuery(); 
        this._orderQuery.getOrdersData(
            queryParams,

            // SOW loaded
            messages => {
                // set the grid data
                ordersTable.parse(messages.slice(0, topN));
            },

            // New message received
            message => {
                ordersTable.add(message);
                ordersTable.showItem(message.id);
                ordersTable.addRowCss(message.id, 'new-row');
                setTimeout(() => { ordersTable.removeRowCss(message.id, 'new-row'); }, 800);

                // too many rows
                if (ordersTable.count() > topN) {
                    ordersTable.remove(ordersTable.getIdByIndex(0));
                }
            },

            // Update message received
            message => {
                ordersTable.showItem(message.id);

                // set 'updated' animation
                ordersTable.addRowCss(message.id, 'updated-row');

                // update the cell data
                ordersTable.updateItem(message.id, message);
                setTimeout(() => { ordersTable.removeRowCss(message.id, 'updated-row'); }, 800);
            },

            // OOF (delete) message received
            message => {
                // set removal animation
                ordersTable.showItem(message.id);
                ordersTable.addRowCss(message.id, 'removed-row');
                ordersTable.updateItem(message.id, message);

                // remove it from the table
                setTimeout(() => {
                    try {
                        if (ordersTable.getItem(message.id) && ordersTable.hasCss(message.id, 'removed-row')) {
                            ordersTable.remove(message.id);
                        }
                    }
                    catch (err) {
                        console.error('err: ', err);
                    }
                }, 800);
            },

            // Error occurred
            err => this.reportError.bind(this)
        );
    }

    queryVWAPData(queryParams: QueryOptions): void  {
        const vwapTable = $$('vwap_table');

        // get data from AMPS and display it
        this._vwapQuery = new AMPSQuery(); 
        // this._vwapQuery.getVWAPData(
        this._vwapQuery.getVWAPData(
            queryParams,

            // SOW loaded
            messages => {
                // set the grid data
                vwapTable.parse(messages);
            },

            // New message received
            message => {
                vwapTable.add(message);
                vwapTable.showItem(message.id);
                vwapTable.addRowCss(message.id, 'new-row');
                setTimeout(() => { vwapTable.removeRowCss(message.id, 'new-row'); }, 800);
            },

            // Update message received
            message => {
                vwapTable.showItem(message.id);

                // set 'updated' animation
                vwapTable.addRowCss(message.id, 'updated-row');

                // update the cell data
                vwapTable.updateItem(message.id, message);
                setTimeout(() => { vwapTable.removeRowCss(message.id, 'updated-row'); }, 800);
            },

            // OOF (delete) message received
            message => {
                // set removal animation
                vwapTable.showItem(message.id);
                vwapTable.addRowCss(message.id, 'removed-row');
                vwapTable.updateItem(message.id, message);

                // remove it from the table
                setTimeout(() => {
                    try {
                        if (vwapTable.getItem(message.id) && vwapTable.hasCss(message.id, 'removed-row')) {
                            vwapTable.remove(message.id);
                        }
                    }
                    catch (err) {
                        console.error('err: ', err);
                    }
                }, 800);
            },

            // Error occurred
            err => this.reportError.bind(this)
        );
    }

    queryVWAPDataDynamic(queryParams: QueryOptions): void  {
        const vwapTable = $$('vwap_dynamic_table');

        // get data from AMPS and display it
        this._vwapQueryDynamic = new AMPSQuery(); 
        // this._vwapQuery.getVWAPData(
        this._vwapQueryDynamic.getVWAPDataDynamicAggregation(
            queryParams,

            // SOW loaded
            messages => {
                // set the grid data
                vwapTable.parse(messages);
            },

            // New message received
            message => {
                vwapTable.add(message);
                vwapTable.showItem(message.id);
                vwapTable.addRowCss(message.id, 'new-row');
                setTimeout(() => { vwapTable.removeRowCss(message.id, 'new-row'); }, 800);
            },

            // Update message received
            message => {
                vwapTable.showItem(message.id);

                // set 'updated' animation
                vwapTable.addRowCss(message.id, 'updated-row');

                // update the cell data
                vwapTable.updateItem(message.id, message);
                setTimeout(() => { vwapTable.removeRowCss(message.id, 'updated-row'); }, 800);
            },

            // OOF (delete) message received
            message => {
                // set removal animation
                vwapTable.showItem(message.id);
                vwapTable.addRowCss(message.id, 'removed-row');
                vwapTable.updateItem(message.id, message);

                // remove it from the table
                setTimeout(() => {
                    try {
                        if (vwapTable.getItem(message.id) && vwapTable.hasCss(message.id, 'removed-row')) {
                            vwapTable.remove(message.id);
                        }
                    }
                    catch (err) {
                        console.error('err: ', err);
                    }
                }, 800);
            },

            // Error occurred
            err => this.reportError.bind(this)
        );
    }

    /**
     * This method allows to report an error using GUI alert form.
     */
    reportError(error: Error, resetUi: boolean = true): void {
        webix.message({
            text: error.message ? error.message : 'Connection Error',
            type: 'error',
            expire: 5000
        });

        if (resetUi) {
            this.enableFormControls(true);
        }
    }
}
