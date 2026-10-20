import React from 'react';
import QueryParams from './QueryParams';
import AMPSGrid from './AMPSGrid';
import './App.css';
import logo from './logo.png';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {status: null, params: {orderBy: '/symbol', options: 'conflation=1s,oof'}};
    }

    render() {
        return (
            <div>
                <h1 className="header"> <img src={logo} id="logo" alt="logo" />AMPS ag-grid View Server</h1>

                <QueryParams onQuery={query => this.setState({status: null, params: query})} />

                <div className="status-label">{this.state.status}</div>
                
                <AMPSGrid
                    title="Orders"
                    style={{height: '300px', width: '100%'}}
                    params={{...this.state.params, topic: 'orders'}}
                    onError={this.handleError.bind(this)}
                    animate={true}
                />

                <AMPSGrid
                    title="VWAP"
                    style={{height: '300px', width: '50%'}}
                    params={{...this.state.params, topic: 'vwap'}}
                    onError={this.handleError.bind(this)}
                    animate={true}
                />

                <AMPSGrid
                    title="VWAP (Dynamic Aggregation)"
                    style={{height: '300px', width: '50%'}}
                    params={{
                        ...this.state.params,
                        topic: 'orders',
                        options: this.state.params.options 
                        + ',projection=[/symbol as /symbol, sum(/qty * /price)/sum(/qty) as /vwap],grouping=[/symbol]'
                    }}
                    onError={this.handleError.bind(this)}
                    animate={true}
                />

            </div>
        );
    }

    handleError(error) {
        this.setState({...this.state, status: error});
    }
}

