import * as settings from './constants.js';
import { Message } from 'amps';


export interface QueryOptions {
    filter?: string;
    topN?: string;
    orderBy?: string;
    options?: string;
}


/**
 * This class encapsulates the AMPS JavaScript API
 */
export class AMPSQuery {
    private worker: Worker = null;

    /**
     * This method loads data from AMPS using a dedicated worker.
     *
     * @param [filter] Optional filter value.
     * @returns {Promise<AMPSMessage[]>} 
     */
    getOrdersData(
        params: QueryOptions,
        onSow: (message: Message[]) => void,
        onNew: (message: Message) => void,
        onUpdate: (message: Message) => void,
        onDelete: (message: Message) => void,
        onError: (err: Error) => void
    ): void {
        if (this.worker !== null) {
            // destroy previous worker
            this.worker.terminate();
            this.worker = null;
        }
        
        // create a new Worker
        this.worker = new Worker('js/query_worker.js');

        // assigning an event listener to get results from worker
        this.worker.addEventListener('message', (e: MessageEvent) => {
            if (e.data.error) {
                onError(e.data.error);
            }
            else if (e.data.sow) {
                onSow(e.data.sow);
            }
            else if (e.data.p) {
                onNew(e.data.p);
            }
            else if (e.data.u) {
                onUpdate(e.data.u);
            }
            else if (e.data.oof) {
                onDelete(e.data.oof);
            }
        });

        // start the worker
        this.worker.postMessage({
            query: params,
            uri: settings.URI,
            clientName: settings.CLIENT_NAME,
            topic: settings.TOPIC
        });
    }

    /**
     * This method loads vwap data from AMPS using a dedicated worker.
     *
     * @param [filter] Optional filter value.
     * @returns {Promise<AMPSMessage[]>} 
     */
    getVWAPData(
        params: QueryOptions,
        onSow: (message: Message[]) => void,
        onNew: (message: Message) => void,
        onUpdate: (message: Message) => void,
        onDelete: (message: Message) => void,
        onError: (err: Error) => void
    ): void {
        if (this.worker !== null) {
            // destroy previous worker
            this.worker.terminate();
            this.worker = null;
        }
        
        // create a new Worker
        this.worker = new Worker('js/query_worker.js');

        // assigning an event listener to get results from worker
        this.worker.addEventListener('message', (e: MessageEvent) => {
            if (e.data.error) {
                onError(e.data.error);
            }
            else if (e.data.sow) {
                onSow(e.data.sow);
            }
            else if (e.data.p) {
                onNew(e.data.p);
            }
            else if (e.data.u) {
                onUpdate(e.data.u);
            }
            else if (e.data.oof) {
                onDelete(e.data.oof);
            }
        });

        // start the worker
        this.worker.postMessage({
            query: params,
            uri: settings.URI,
            clientName: settings.CLIENT_NAME,
            topic: settings.VIEW
        });
    }

    /**
     * This method loads vwap data from AMPS using a dedicated worker.
     *
     * @param [filter] Optional filter value.
     * @returns {Promise<AMPSMessage[]>} 
     */
    getVWAPDataDynamicAggregation(
        params: QueryOptions,
        onSow: (message: Message[]) => void,
        onNew: (message: Message) => void,
        onUpdate: (message: Message) => void,
        onDelete: (message: Message) => void,
        onError: (err: Error) => void
    ): void {
        if (this.worker !== null) {
            // destroy previous worker
            this.worker.terminate();
            this.worker = null;
        }
        
        // create a new Worker
        this.worker = new Worker('js/query_worker.js');

        // assigning an event listener to get results from worker
        this.worker.addEventListener('message', (e: MessageEvent) => {
            if (e.data.error) {
                onError(e.data.error);
            }
            else if (e.data.sow) {
                onSow(e.data.sow);
            }
            else if (e.data.p) {
                onNew(e.data.p);
            }
            else if (e.data.u) {
                onUpdate(e.data.u);
            }
            else if (e.data.oof) {
                onDelete(e.data.oof);
            }
        });

        // start the worker
        if (params.options === undefined) { params.options = ''; } else { params.options += ','; }
        params.options += 'projection=[/symbol as /symbol, sum(/qty * /price)/sum(/qty) as /vwap],grouping=[/symbol]';
        this.worker.postMessage({
            query: params,
            uri: settings.URI,
            clientName: settings.CLIENT_NAME,
            topic: settings.TOPIC
        });
    }

    stop(): void {
        if (this.worker !== null) {
            // destroy previous worker
            this.worker.terminate();
            this.worker = null;
        }
    }
}

