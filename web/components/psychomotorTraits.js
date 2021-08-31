class PsychomotorTraits extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            psychomotorTraits: [], updating: false, loading: false, updateView: false, newRecord: false
        }

        this.showUpdate = this.showUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.loadData = this.loadData.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.saveRecord=this.saveRecord.bind(this);
    }



    componentDidMount() {
        $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li>Setup</li><li class="active">Psychomotor Traits</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</B>");
        this.loadData();
    }

    async loadData() {
        this.setState({ loading: true });
        await APICall("psychomotorTraits.json", {}, "GET")
            .then(data => {
                console.log(data);
                if (data.status == "success") {
                    this.setState({ psychomotorTraits: data.data, loading: false });
                }
            })
            .catch(error => {
                console.error(error);
                this.setState({ loading: false });
            });
    }

    cancelRecord() {
        this.setState({ updating: true });
        //setTimeout(() => {
            MessageAlert("info", "Record canceled successfully");
            this.setState({ updating: false });
            this.setState({ updateView: false });
            this.setState({ newRecord: false });
            this.loadData();
        //}, 1500);
    }

    updateRecord(itemId) {
        this.setState({ updating: true });
        //setTimeout(() => {
            MessageAlert("success", "Record updated successfully");
            this.setState({ updating: false });
            this.setState({ updateView: false });
            this.loadData();
        //}, 1500);
    }

    saveRecord() {
        this.setState({ updating: true });
        //setTimeout(() => {
            MessageAlert("success", "Record added successfully");
            this.setState({ updating: false });
            this.setState({ newRecord: false });
            this.loadData();
        //}, 1500);
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
                MessageAlert("success", "Record deleted");
            }
        });
    }

    showUpdate() {
        this.setState({ updateView: true });
        this.loadData();
    }

    addNewRecord() {
        this.setState({newRecord: true})
        this.loadData();
    }

    render() {
        return (
            <div className="col-md-12 animated rotateIn faster" id="data-area">
                {this.state.loading ? <Spinner /> :
                    <div className=" border-3-top flatpanel">

                        {
                            !this.state.updateView ?
                                (
                                !this.state.newRecord?
                                <div style={{maxWidth: "800px"}} className="panel panel-primary animated rotateIn faster">
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px" }}><strong>Psychomotor Traits Setup</strong></h5>
                                            <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                                className="btn btn-primary btn-sm clickable" onClick={this.addNewRecord}>
                                                <i className="fa fa-plus"></i> Add New</button>
                                        </div>
                                    </div>
                                    <div className="panel-body">

                                        <table className="table table-striped" style={{ "fontSize": "90%" }}>
                                            <thead>
                                                <tr><th></th><th>Skill Name</th></tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    [].concat(this.state.psychomotorTraits)
                                                        .sort((a, b) => a.name < b.name)
                                                        .map((item, i) =>
                                                            <tr key={item.id} className="clickable">
                                                                <td style={{ width: "30px" }}><i className="fa fa-trash text-danger" title="Delete" onClick={() => this.startDelete(item.id)}></i> </td>
                                                                <td onClick={() => this.showUpdate(item.id)}><strong className="text-info">{item.name}</strong></td>
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
                                            <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>New Psychomotor Trait</strong></h5>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <form >
                                            <div className="row">
                                                <div className="col-md-8 col-sm-12 col-lg-6">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Skill Name</label>
                                                                <input type="text" className="form-control" />
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

                                <div style={{ maxWidth: "800px" }} className="panel panel-primary animated rotateIn faster">
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Update Record</strong></h5>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <form >
                                            <div className="row">
                                                <div className="col-md-8 col-sm-12 col-lg-6">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Skill Name</label>
                                                                <input type="text" className="form-control" />
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