/**
 * This class provides high level API for an AMPS client connection/query
 * that is executed in a separate worker.
 */

// eslint-disable-next-line
import QueryEngine from 'worker-loader!./QueryEngine.js';


export default class AMPSQuery {
    constructor() {
        this.worker = null;
        this._isWorking = false;
    }

    /**
     * This method performs a SOW query and then resolves with the SOW data.
     *
     * @param queryParams {object} The object with parameters, such as topic, filter, orderBy, options, batchSize. The
     * topic parameter is required.
     * @returns {Promise} The array of row data, if any.
     */
    async query(queryParams) {
        return new Promise((resolve, reject) => {
            if (!queryParams || !queryParams.topic) {
                return reject('Topic must be provided');
            }

            // Prepare to the query
            this.reset();
            this.worker = new QueryEngine();
            this._isWorking = true;

            // Assign the worker event listener
            this.worker.onmessage = event => {
                if (event.data.error) {
                    this.reset();
                    reject(event.data.error);
                }
                else if (event.data.sow) {
                    this.reset();
                    resolve(event.data.sow);
                }
            };

            // start the loading
            this.worker.postMessage({...queryParams, isQuery: true});
        });
    }

    /**
     * This method performs a SOW query followed by the subscription that will receive updates with regards of the SOW
     * portion of the data.
     *
     * @param queryParams {object} The object with parameters, such as topic, filter, orderBy, options, batchSize. The
     * topic parameter is required.
     * @param onSOW {function} will be called once the SOW portion has been loaded.
     * @param onNewMessage {function} will be called when a NEW message (wasn't seen before) is received.
     * @param onUpdate {function} will be called if an update to an existing record occurred. First argument is the 
     * message, the second argument is it's row index in the grid.
     * @param onDelete {function} will be called if a record no longer should be in the grid. First argument is the 
     * reason, the second argument is the new version of the existing record (if any), the third argument is it's row 
     * index in the grid.
     * @param onError {function} will be called if a critical error occurred. This also means the worker and client
     * connection will be destroyed.
     */
    queryAndSubscribe(queryParams, onSOW, onNewMessage, onUpdate, onDelete, onError) {
        if (!queryParams || !queryParams.topic) {
            if (onError) {
                return onError('Topic must be provided');
            }
        }
        if (!queryParams.options) { queryParams.options = 'oof'; }

        // Prepare to the query
        this.reset();
        this.worker = new QueryEngine();
        this._isWorking = true;

        // Assign the worker event listener
        this.worker.onmessage = event => {
            // Error occurred
            if (event.data.error) {
                this.reset();

                if (onError) {
                    onError(event.data.error);
                }
            }
            else if (event.data.sow) {
                // Initial SOW data portion has been received
                if (onSOW) {
                    onSOW(event.data.sow);
                }
            }
            else {
                // new record
                if (event.data.p !== undefined) {
                    if (onNewMessage) {
                        onNewMessage(event.data.p);
                    }
                }

                // update to existing record
                else if (event.data.u !== undefined ) {
                    if (onUpdate) {
                        onUpdate(event.data.u, event.data.rowIndex);
                    }
                }

                // record was deleted
                else if (event.data.oof !== undefined) {
                    if (onDelete) {
                        onDelete(event.data.reason, event.data.oof, event.data.rowIndex);
                    }
                }
            }
        };

        // start the loading
        this.worker.postMessage(queryParams);
    }

    /**
     * This method simply detects if the query is in progress.
     */
    isWorking() { return this._isWorking; }

    /**
     * This method destroys the previous worker, if any and thus, stopping all the possible queries/subscriptions in
     * progress.
     */
    reset() {
        if (this.worker) {
            this.worker.postMessage({disconnect: true});
            this.worker.terminate();
            this.worker = null;
        }

        this._isWorking = false;
    }
}

