/**
 * This class provides the Grid that uses AMPS Client as the data source.
 */

import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import AMPSQuery from './AMPSQuery';

ModuleRegistry.registerModules([AllCommunityModule]);


export default class AMPSGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [],
            rowData: []
        }

        this.query = new AMPSQuery();
    }

    render() {
        return (
            <div className="ag-theme-balham ag-grid" style={{...this.props.style, display: 'inline-block'}}>
                <div className="grid-title">{this.props.title}</div>

                <AgGridReact
                    theme="legacy"
                    getRowId={({ data }) => String(data.rowId)}
                    animateRows={this.props.animate}
                    columnDefs={this.state.columnDefs} 
                    rowData={this.state.rowData} 
                    onGridReady={this.handleOnGridReady.bind(this)}
                />
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        const fields = ['topic', 'filter', 'options', 'orderBy', 'batchSize'];
        const paramsChanged = fields.some(field =>
            prevProps.params?.[field] !== this.props.params?.[field]
        );

        if (paramsChanged || prevProps.isQuery !== this.props.isQuery) {
            this.query.reset();
            this.setState({ columnDefs: [], rowData: [] }, () => this.handleQuery());
        }
    }

    /**
     * When the component will unmount, we need to disconnect from AMPS and destroy the worker context.
     */
    componentWillUnmount() {
        this.query.reset();
    }

    /**
     * This method starts the query, either when the component did mount on the DOM or when the props have been
     * changed.
     */
    async handleQuery() {
        if (!this.gridApi || !this.props.params) { return; }
        // clear the query if it's still working
        if (this.query.isWorking()) {
            this.query.reset();
        }

        // Just a query
        if (this.props.isQuery) {
            try {
                this.handleInitialRecords(await this.query.query(this.props.params));
            }
            catch (err) {
                this.handleQueryError(err);
            }
        }

        // Query and subscribe
        else {
            this.query.queryAndSubscribe(
                this.props.params,
                this.handleInitialRecords.bind(this),
                this.handleNewRecord.bind(this),
                this.handleRecordUpdate.bind(this),
                this.handleRecordDelete.bind(this),
                this.handleQueryError.bind(this)
            );
        }
    }

    /**
     * This method is called once the ag-Grid is fully initialized. We use it to retain required references.
     * They will be used later for grid updates.
     *
     * @param params {object} parameters object provided by the ag-Grid instance.
     */
    handleOnGridReady(params) {
        this.gridApi = params.api;

        this.handleQuery();
    }

    /**
     * This method is called once the SOW portion of the data is provided.
     *
     * @param records {Array} The array of records to display.
     */
    handleInitialRecords(records) {
        const newState = {rowData: records};

        // generate column data from the first message
        if (records.length) {
            newState.columnDefs = this.generateColumnNames(records[0]);
        }

        this.setState(newState);
    }

    /**
     * This method will be called when a new record that wasn't seen before is received.
     *
     * @param record {object} The new record.
     */
    handleNewRecord(record) {
        // Append the message to the bottom
        const rowNode = this.gridApi.applyTransaction({add: [record]}).add[0];

        if (rowNode) {
            if (this.props.animate) {
                this.gridApi.ensureIndexVisible(rowNode.rowIndex, 'middle');
            }
        }
    }

    /**
     * This method will be called if an update to an existing record occurred.
     *
     * @param record {object} The new version of the existing record.
     */
    handleRecordUpdate(record) {
        const rowNode = this.gridApi.getRowNode(String(record.rowId));

        if (rowNode) {
            rowNode.setData(record);

            if (this.props.animate) {
                this.gridApi.ensureIndexVisible(rowNode.rowIndex, 'middle');
            }
        }
    }

    /**
     * This method is called if a record no longer should be in the grid.
     *
     * @param reason {string} The reason why the record should not be in the grid anymore, such as "match", 
     * "expired", or "deleted".
     * OOF is delivered in the below cases:
     * - The record is deleted,
     * - The record expires,
     * - The record no longer matches the filter criteria, or
     * - The subscriber is no longer entitled to view the new state of the record
     * @param record {object} The new version of the existing record.
     */
    handleRecordDelete(reason, record) {
        const rowNode = this.gridApi.getRowNode(String(record.rowId));

        if (rowNode) {
            if (this.props.animate) {
                this.gridApi.ensureIndexVisible(rowNode.rowIndex, 'middle');
            }
            this.gridApi.applyTransaction({remove: [rowNode.data]});
        }
    }

    /**
     * This method is called if a query/connection error occurred -- The query execution stops at this point.
     *
     * @param error {string | error} The error message or object.
     */
    handleQueryError(error) {
        // reset the grid
        this.setState({rowData: []});
        this.query.reset();

        // Report the error
        if (this.props.onError) {
            this.props.onError(error.message ? error.message : error);
        }
    }

    /**
     * A private method to generate column names for the grid from the record fields.
     */
    generateColumnNames(record) {
        return Object
            .keys(record)
            .filter(key => key !== 'rowId')
            .map(key => ({headerName: key, field: key, flex: 1, minWidth: 100}));
    }
}

