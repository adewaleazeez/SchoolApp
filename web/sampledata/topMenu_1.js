class TopMenu_1 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            name: "",
            icon: "",
            topMenuData: [], updating: false, loading: false, updateView: false, newRecord: false
        };

        this.showUpdate = this.showUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.loadData = this.loadData.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
    };



    componentDidMount = function () {
        $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li>Setup</li><li class="active">Top Menu Setup</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</B>");
        this.loadData();
    }

    loadData() {
        this.setState({ loading: true });
        //APICall("topMenuTerm.json", {}, "GET")
        APICall("http://localhost:5000/topmenu/selectall", {}, "GET")
        .then(data => {
            if (data.status === 200) {
                this.setState({ topMenuData: data.result, loading: false });
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
    }

    cancelRecord() {
        this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        this.setState({ updating: false });
        this.setState({ updateView: false });
        this.setState({ newRecord: false });
        this.loadData();
    }

    saveRecord() {
        this.setState({ newRecord: true });
        APICall("http://localhost:5000/topmenu/save", 
        {
            name: this.refs.name_add.value,
            icon: this.refs.icon_add.value,
            url: '',
            organizationId: sessionStorage.getItem("orgid"),
            createdBy: sessionStorage.getItem("userid")
        }, 
        "POST").then(data => {
            if (data.status === 200) {
                this.setState({ topMenuData: data.result, loading: false, updating: true });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.setState({ newRecord: false });
                this.loadData();
            }else{
                MessageAlert("error", data.message, "Error!!!");
                this.setState({ updating: false });
                this.setState({ updateView: true });
                this.refs.name_add.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            this.setState({ loading: false });
        });
    }

    updateRecord() {
        this.setState({ updating: true });
        APICall("http://localhost:5000/topmenu/update", 
        {
            id: this.refs.id_update.value,
            name: this.refs.name_update.value,
            icon: this.refs.icon_update.value
        }, 
        "PUT").then(data => {
            if (data.status === 200) {
                this.setState({ topMenuData: data.result, loading: false });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.loadData();
            }else{
                MessageAlert("error", data.message, "Error!!!");
                this.setState({ updating: false });
                this.setState({ updateView: true });
                this.refs.name_update.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            this.setState({ loading: false });
        });
    }
    
    showUpdate(itemId) {
        this.setState({ updateView: true });
        APICall("http://localhost:5000/topmenu/selectone", {id: itemId}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({ topMenuData: data.result, loading: false });
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        //this.loadData();
    }

    startDelete(itemId) {
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record? This action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                
                APICall("http://localhost:5000/topmenu/delete", 
                {
                    id: itemId
                }, 
                "DELETE").then(data => {
                    if (data.status === 200) {
                        this.setState({ loading: false, updating: true });
                        MessageAlert("success", "Record deleted");
                        this.setState({ updating: false });
                        this.setState({ updateView: false });
                        this.setState({ newRecord: false });
                        this.loadData();
                    }else{
                        MessageAlert("error", data.message, "Error!!!");
                        this.setState({ updating: false });
                        this.setState({ updateView: true });
                        this.refs.name_update.focus();
                    }
                }) // JSON-string from `response.json()` call
                .catch(error => {
                    console.error("error::: "+error);
                    this.setState({ loading: false });
                });
            }
        });
    }

    addNewRecord() {
        this.setState({newRecord: true});
        this.loadData();
    }

    render() {
        const mystyle = {
            margin:"4px, 4px",
            padding:"4px",
            height: "350px", 
            overflowX: "hidden", 
            overflowY: "auto",
            textAlign:"justify"
        };
    
        return (
            <div className="col-md-12 animated rotateIn faster" id="data-area">
                {this.state.loading ? <Spinner /> :
                    <div className=" border-3-top flatpanel">

                        {
                            !this.state.updateView ?
                                (
                                    !this.state.newRecord ?
                                        <div style={{maxWidth: "800px"}} className="panel panel-primary animated rotateIn faster"> 
                                            <div className="panel-heading">
                                                <div className="panel-title">
                                                    <h5 style={{ marginTop: "30px" }}><strong>Top Menus</strong></h5>
                                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                                        className="btn btn-primary btn-sm clickable" onClick={this.addNewRecord}>
                                                        <i className="fa fa-plus"></i> Add Top Menu</button>
                                                </div>
                                            </div>
                                            <div className="panel-body" style={mystyle}>

                                                <table className="table table-striped table-hover" style={{ "fontSize": "90%" }}>
                                                    <thead>
                                                        <tr><th>S/No</th><th>Name</th><th>Icon</th><th>Icon Image</th><th></th></tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            [].concat(this.state.topMenuData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <tr key={item.id} className="clickable">
                                                                    <td>{i+1}.</td>
                                                                    <td onClick={() => this.showUpdate(item.id)} style={{ width: "200px" }}><strong className="text-info">{item.name}</strong></td>
                                                                    <td onClick={() => this.showUpdate(item.id)} >{item.icon}</td>
                                                                    <td onClick={() => this.showUpdate(item.id)}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className={item.icon} /></td>
                                                                    <td style={{ width: "30px" }}><i className="fa fa-trash text-danger" title="Delete" onClick={() => this.startDelete(item.id)}></i> </td>
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                        :
                                        <div style={{ maxWidth: "800px" }} className="panel panel-primary animated rotateIn faster">
                                            <div className="panel-heading">
                                                <div className="panel-title">
                                                    <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Add  Top Menu</strong></h5>
                                                </div>
                                            </div>
                                            <div className="panel-body">
                                                <form>
                                                    <div className="row">
                                                        <div className="col-md-6 col-sm-12 col-lg-6">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <label>Name</label>
                                                                        <input type="text" className="form-control" defaultValue={this.state.topMenuData.name} ref="name_add" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <label>Icon</label>
                                                                        <input type="text" className="form-control" defaultValue={this.state.topMenuData.icon} ref="icon_add" />
                                                                    </div>
                                                                </div>


                                                            </div>

                                                        </div>

                                                    </div>

                                                    <div className="form-group">
                                                        <hr />
                                                        {this.state.updating ?
                                                            <Spinner size="1rem" /> :
                                                            <div className="" >
                                                                <button onClick={this.cancelRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                                <button onClick={this.saveRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Save </button>
                                                            </div>
                                                        }

                                                    </div>



                                                </form>
                                            </div>
                                        </div>
                                )
                                :

                                <div style={{ maxWidth: "900px" }} className="panel panel-primary animated rotateIn faster">
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Update Top Menu</strong></h5>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-12 col-lg-6">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Name</label>
                                                                <input type="hidden" className="form-control" defaultValue={this.state.topMenuData.id} ref="id_update" />
                                                                <input type="text" className="form-control" defaultValue={this.state.topMenuData.name} ref="name_update" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Icon</label>
                                                                <input type="text" className="form-control" defaultValue={this.state.topMenuData.icon} ref="icon_update" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="form-group">
                                                <hr />
                                                {this.state.updating ?
                                                    <Spinner size="1rem" /> :
                                                    <div className="" >
                                                        <button onClick={this.cancelRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                        <button onClick={this.updateRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Update</button>
                                                    </div>
                                                }

                                            </div>
                                        </form>
                                    </div>
                                </div>
                        }
                    </div>
                }
            </div>
        );
    }
}