import React from 'react';

class Offices extends React.Component {
    constructor(props) {
        super(props);

        // set initial state
        // do not use setState in constructor, write state directly
        this.state = {
            offices_data: [], // will contain offices data array from server
            offices_index: 0, // the index of the offices currently shown, start at first in array
            offices_count: 0, // how many offices in data array from server
            isLoaded: false,  // will be true after data have been received from server
            error: null,       // no errors yet !
            officeObject: {
                officecode: 0,
                city: "",
                phone: "",
                addressline1: "",
                addressline2: "",
                state: "",
                country: "",
                postalcode: "",
                territory: ""
            },
            selectedOfficeCode: -1,
            message: "",

        };
    }

    componentDidMount() {
        this.getAllOfficesOrByID(null);
    }

    getAllOfficesOrByID(officecode) {
        let URL = 'http://localhost:8000/offices';
        if (officecode) {
            URL += `/${officecode}`
        }
        fetch(URL)
            .then(
                (response) => {
                    // here full fetch response object
                    //console.log(response)
                    // fetch not like jQuery ! both ok code 200 and error code 404 will execute this .then code
                    if (response.ok) {
                        // handle 2xx code success only
                        // get only JSON data returned from server with .json()
                        response.json().then(json_response => {
                            console.log(json_response)
                            if (!officecode) {
                                this.setState({
                                    offices_data: json_response.offices, // data received from server
                                    offices_count: json_response.offices.length, // how many offices in array
                                    offices_index: 0,  // will first show the first offices in the array
                                    isLoaded: true,  // we got data
                                    error: null, // no errors
                                    officeObject: json_response.offices[0],
                                    selectedOfficeCode: parseInt(json_response.offices[0].officecode)
                                })
                            }
                            else {
                                if (json_response.offices.length > 0) {
                                    this.setState({
                                        officeObject: json_response.offices[0],
                                        selectedOfficeCode: parseInt(json_response.offices[0].officecode)
                                    })
                                } else {
                                    this.setState({ error: { message: "No data found with this value" } })
                                    setTimeout(() => {
                                        this.setState({ error: null })
                                    }, 5000);
                                }

                            }
                        }
                        )

                    } else {
                        // handle errors, for example 404
                        response.json().then(json_response => {
                            this.setState({
                                isLoaded: false,
                                // result returned is case of error is like  {message: "offices not found"}
                                // save the error in state for display below
                                error: json_response,   // something in format  {message: "offices not found", db_data:{}}
                                offices_data: {}, // no data received from server
                                offices_count: 0,
                                offices_index: 0
                            });
                            this.clearAllValues();
                        })
                    }
                },

                (error) => {
                    // Basically fetch() will only reject a promise if the URL is wrong, the user is offline,
                    // or some unlikely networking error occurs, such a DNS lookup failure.
                    this.setState({
                        isLoaded: false,
                        error: { message: "AJAX error, URL wrong or unreachable, see console" }, // save the AJAX error in state for display below
                        offices_data: {}, // no data received from server
                        offices_count: 0,
                        offices_index: 0,
                    });
                }
            )
    }

    addUpdateOfficeData() {
        let { selectedOfficeCode, officeObject } = this.state;
        let typeOfRequest = "POST", URL = "http://localhost:8000/offices";
        if (selectedOfficeCode !== -1) {
            URL += `/${selectedOfficeCode}`;
            typeOfRequest = "PUT";
        }
        fetch(URL,
            {
                method: typeOfRequest,
                headers: {
                    'Content-Type': 'application/json'
                    //'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *client
                body: JSON.stringify(officeObject)
            }
        )
            .then(res => res.json())//here server sends JSON response
            .then(
                (response) => {
                    // TO DO how to handle code other than 200 because this gets
                    // exeucted in all cases
                    this.showMessage(response.message, 2000);
                    this.getAllOfficesOrByID(null);
                },

                (error) => {
                    // only NO RESPONSE URL errors will trigger this code
                    this.setState({
                        error: { message: "AJAX error, URL wrong or unreachable, see console" }
                    })
                    console.error(error);
                }

            )
    }

    deleteOfficeByID() {
        let { selectedOfficeCode } = this.state;
        fetch('http://localhost:8000/offices/' + selectedOfficeCode, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.showMessage(res.message, 4000);
                this.getAllOfficesOrByID(null);

            })
    }

    clearAllValues() {
        this.setState({
            officeObject: {
                officecode: 0,
                city: "",
                phone: "",
                addressline1: "",
                addressline2: "",
                state: "",
                country: "",
                postalcode: "",
                territory: ""
            },
            offices_index: 0,
            selectedOfficeCode: -1
        })
    }

    nextPrevBtnClick(btnType) {
        this.setState((prev) => {
            let currentIndex = prev.offices_index;
            if (btnType === "previous") {
                currentIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
            }
            else {
                currentIndex = currentIndex >= prev.offices_count - 1 ? prev.offices_count - 1 : currentIndex + 1;
            }
            return {
                offices_index: currentIndex,
                selectedOfficeCode: prev.offices_data[currentIndex].officecode
            }
        }, () => {
            this.getAllOfficesOrByID(this.state.selectedOfficeCode)
        })
        // this.setState((prev) => {
        //     let currentIndex = prev.offices_index;
        //     if (btnType === "previous") {
        //         currentIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
        //     }
        //     else {
        //         currentIndex = currentIndex >= prev.offices_count - 1 ? prev.offices_count - 1 : currentIndex + 1;
        //     }
        //     return {
        //         officeObject: prev.offices_data[currentIndex],
        //         offices_index: currentIndex,
        //         selectedOfficeCode: prev.offices_data[currentIndex].officecode
        //     }
        // })
    }

    showMessage(msg, timeOutInMilliSeconds) {
        this.setState({
            message: msg,
        }, () => {
            setTimeout(() => {
                this.setState({
                    message: null
                })
            }, timeOutInMilliSeconds);
        })

    }

    onInputValueChange(e) {
        let { officeObject } = this.state;
        officeObject[e.target.id] = e.target.value;
        this.setState({
            officeObject: officeObject
        }, () => {
            console.log(this.state);
        })
    }

    renderOfficeTable() {
        let { error, isLoaded, offices_count, officeObject, offices_index, message, selectedOfficeCode } = this.state;
        if (this.state.error) {
            return <div><b>{error.message}</b></div>;
        } else if (isLoaded) {
            if (offices_count !== 0) {
                // offices table not empty
                return (
                    <div>
                        <div className="row mt-2">
                            <div className="col-md-12">
                                <code>List of offices from server <a href="http://localhost:8000/offices" target="_blank" rel="noreferrer">http://localhost:8000/offices</a></code>
                            </div>
                        </div>

                        {/* <div className="form-group">
                            <label>Enter office code to search office: </label>
                            <input type="number" className="form-control" onChange={(e) => {
                                this.getAllOfficesOrByID(e.target.value);
                                setTimeout(() => {
                                    e.target.value = "";
                                }, 5000);
                            }} defaultValue={officeObject.officecode} />
                        </div>
                        <br /> */}
                        <div className="row mt-2">
                            <div className="col-md-12">
                                <table className="table table-bordered table-striped table-hover">
                                    <tbody>
                                        <tr>
                                            <th>Office Code</th>
                                            <td><input id="officecode" className="form-control" type="number" min="1" step="1" value={officeObject.officecode ? officeObject.officecode : "0"} onChange={(e) => {
                                                if (selectedOfficeCode === -1) {
                                                    this.onInputValueChange(e);
                                                }
                                            }} disabled={selectedOfficeCode !== -1} /></td>
                                        </tr>
                                        <tr>
                                            <th>City</th>
                                            <td><input id="city" className="form-control" type="text" value={officeObject.city ? officeObject.city : ""} onChange={(e) => {
                                                this.onInputValueChange(e);
                                            }} /></td>
                                        </tr>
                                        <tr>
                                            <th>Phone</th>
                                            <td><input id="phone" className="form-control" type="text" value={officeObject.phone ? officeObject.phone : ""} onChange={(e) => {
                                                this.onInputValueChange(e);
                                            }} /></td>
                                        </tr>
                                        <tr>
                                            <th>Address Line 1</th>
                                            <td>
                                                <textarea id="addressline1" className="form-control" value={officeObject.addressline1 ? officeObject.addressline1 : ""} onChange={(e) => {
                                                    this.onInputValueChange(e);
                                                }}>
                                                </textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Address Line 2</th>
                                            <td>
                                                <textarea id="addressline2" className="form-control" value={officeObject.addressline2 ? officeObject.addressline2 : ""} onChange={(e) => {
                                                    this.onInputValueChange(e);
                                                }}>
                                                </textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>State</th>
                                            <td><input id="state" className="form-control" type="text" value={officeObject.state ? officeObject.state : ""} onChange={(e) => {
                                                this.onInputValueChange(e);
                                            }} /></td>
                                        </tr>
                                        <tr>
                                            <th>Country</th>
                                            <td><input id="country" className="form-control" type="text" value={officeObject.country ? officeObject.country : ""} onChange={(e) => {
                                                this.onInputValueChange(e);
                                            }} /></td>
                                        </tr>
                                        <tr>
                                            <th>Postal Code</th>
                                            <td><input id="postalcode" className="form-control" type="text" value={officeObject.postalcode ? officeObject.postalcode : ""} onChange={(e) => {
                                                this.onInputValueChange(e);
                                            }} /></td>
                                        </tr>
                                        <tr>
                                            <th>Territory</th>
                                            <td><input id="territory" className="form-control" type="text" value={officeObject.territory ? officeObject.territory : ""} onChange={(e) => {
                                                this.onInputValueChange(e);
                                            }} /></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="10">
                                                {message ? (<div className="alert alert-success" role="alert">
                                                    {message}
                                                </div>) : ""}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="10" className="text-center">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <button className="btn btn-primary" type="button" onClick={() => {
                                                            this.nextPrevBtnClick("previous");
                                                        }} disabled={offices_index === 0}>Previous</button>
                                                &nbsp;
                                                <span>{offices_index + 1} of {offices_count} </span>
                                                        <button className="btn btn-primary" type="button" onClick={() => {
                                                            this.nextPrevBtnClick("next");
                                                        }} disabled={offices_index === offices_count - 1}>Next</button>
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-md-12">
                                                        &nbsp;
                                                <button className="btn btn-warning" onClick={() => { this.addUpdateOfficeData() }}>
                                                            Save
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-success" onClick={() => { this.addUpdateOfficeData() }}>
                                                            Add new office
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-danger" onClick={() => { this.deleteOfficeByID() }}>
                                                            Delete
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-info" onClick={() => { this.clearAllValues() }} >
                                                            Clear all values before adding a new office
                                                </button>
                                                &nbsp;
                                            </div>
                                                </div>

                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (<div><b>Offices table is empty</b></div>)
            }
        } else {
            return (<div><b>Waiting for server ...</b></div>)
        }
    }

    renderTableCell(dataObject) {
        return Object.keys(dataObject).map((item, index) => {
            return <td key={dataObject[item] + "_" + index}>{dataObject[item]}</td>
        })
    }

    renderTableBody() {
        let { offices_data } = this.state;
        if (offices_data) {
            return offices_data.map((item, index) => {
                return (
                    <tr key={index}>
                        {this.renderTableCell(item)}
                    </tr>
                )
            }, this)
        }
        return (<tr>
            <td colSpan="9" className="text-center">No data available</td>
        </tr>)
    }

    // display the offices table
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        {this.renderOfficeTable()}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Office Code</th>
                                    <th>City</th>
                                    <th>Phone</th>
                                    <th>Address Line 1</th>
                                    <th>Address Line 2</th>
                                    <th>State</th>
                                    <th>Country</th>
                                    <th>Postal Code</th>
                                    <th>Territory</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTableBody()}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        )
    }
}

export default Offices;