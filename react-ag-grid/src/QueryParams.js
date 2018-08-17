import React, { Component } from 'react';

const originalState = {
    filter: '',
    options: 'conflation=1s,oof',
    orderBy: '/symbol',
};

export default class QueryParams extends Component {
    constructor(props) {
        super(props);

        this.state = {...originalState};
    }

    handleFormInput(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleQueryRequest() {
        this.props.onQuery(this.state);
    }

    render() {
        return (
            <div>
                <div className="frame">
                    <table>
                        <tbody>
                            <tr>
                                <td className="right"><label>Filter: </label></td>
                                <td colSpan={3}>
                                    <input 
                                        type="text" 
                                        name="filter"
                                        placeholder="Optional: Enter a Content Filter"
                                        value={this.state.filter} 
                                        onChange={this.handleFormInput.bind(this)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="right"><label>Options:</label></td>
                                <td colSpan={3}>
                                    <input 
                                        type="text" 
                                        name="options"
                                        placeholder="Optional: Query Options"
                                        value={this.state.options} 
                                        onChange={this.handleFormInput.bind(this)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="right"><label>Order By: </label></td>
                                <td colSpan={3}>
                                    <input 
                                        type="text" 
                                        name="orderBy"
                                        placeholder="Optional: Enter the field to order data by"
                                        value={this.state.orderBy} 
                                        onChange={this.handleFormInput.bind(this)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />

                    <button 
                        className="query"
                        onClick={this.handleQueryRequest.bind(this)}
                    >Query and Subscribe</button>

                    <button className="clear" onClick={() => this.setState({...originalState})}>Clear</button>
                </div>
            </div>
        )
    }
};
