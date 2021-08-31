class UserTypes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            organizationId: "",
            name: "",
            icon: "",
            rank: "",
            userTypeData: [], updating: false, loading: false, updateView: false, newRecord: false, dataTableObj: undefined //, _isMounted: false
        };

        this.showUserTypeUpdate = this.showUserTypeUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
        this.populateDataTable = this.populateDataTable.bind(this);
        this.editFormUserType = this.editFormUserType.bind(this);
        this.deleteFormUserType = this.deleteFormUserType.bind(this);
        this.switchCheckBox = this.switchCheckBox.bind(this);
        
    };

    editFormUserType(id_update){
        if ($("#updateUserType").css("display") === 'block') {
            $("#updateUserType").css("display", "none");
        } else {
            $("#updateUserType").css("display", "block");
        }
        this.showUserTypeUpdate(parseInt(id_update));
    };

    deleteFormUserType(id, name, icon, rank){
        this.startDelete(parseInt(id), name, icon, rank);
    };
    
    componentDidMount(){
        window.editFormUserType = this.editFormUserType;
        window.deleteFormUserType = this.deleteFormUserType;
        
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i className="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">Roles Setup</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");

        this.populateDataTable();
    }

    async switchCheckBox(itemId, status){
        await APICall("/usertypes/switchCheckBox", 
        {
            id: itemId, 
            status: status
        }, "PUT")
        .then(data => {
            if (data.status === 200) {
                //this.setState({ roleData: data.result, updateView: true, loading: false  });
                this.populateDataTable();
                MessageAlert("success", "Status switched successfully");
            }else{
                MessageAlert("error", data.message, "Error!!!");
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
    }
    
    async populateDataTable(){
        const response = await APICall("/usertypes/selectbyorgid", {organizationId: sessionStorage.getItem("orgid")}, "POST");
        $('#loadingLabel').hide();
        //console.log("response::: "+JSON.stringify(response));
        if(this.state.dataTableObj){
            this.state.dataTableObj.destroy();
        }
        //console.log("response:::   "+JSON.stringify(response));
        var obj = $('#myTable').DataTable({
            "searching": true,
            "Destroy": false,
            "pageLength": -1,
            "pagingType": "full_numbers",
            "lengthMenu": [[5, 10, 15, 20, 25, 30, -1], [5, 10, 15, 20, 25, 30, "All"]],
            "processing": true, 
            data: response.result,
            "rowId": 'id',
            "columns": [
                { "data": "id" },
                { "data": "typeDescription" ,
                    render: function(data, type, row){
                    
                        if(type === "sort" || type === "type"){
                            return data;
                        }
                        if(!data || data.trim() === ""){
                            return '<a style="color: #2CACDE; "><strong>NO NUMBER ALLOCATED</strong></a>';    
                        }
                        //href="#/student/'+ row.id + '"
                        //href="#/student/'+ row.Id + '"
                        return '<a style="color: #2CACDE; "><strong>'+data+'</strong></a>';
                    }
                },
                { "data": "status",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            var status = "";
                            if (data === 'A') {
                                status += "<input id='" + row.id + "' type='checkbox' class='switch-checkboxes' checked data-id='" + row.id + "' data-status='" + row.status + "' />";
                            } else {
                                status += "<input id='" + row.id + "' type='checkbox' class='switch-checkboxes' data-id='" + row.id + "' data-status='" + row.status + "' />";
                            }
                            return status ;
                        }
                    }
                },
                { "data": "id",
                    render:function(data, type, row, meta){
                        if (type === "display") {
                            var edit_button = "<button type='button' class='to-update-user-type btn btn-lg btn-info' data-toggle='modal' onclick='window.editFormUserType(" + row.id + ")'><i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i>&nbsp;Edit</button>";
                            var delete_button = "<button type='button' class='to-delete-user-type btn btn-danger btn-lg' onclick=window.deleteFormUserType('" + row.id + "','" + encodeURI(row.typeDescription) + "')><i class='fa fa-trash text-danger' style='cursor: pointer; color: white;' title='Delete'></i>&nbsp;Delete</button>";
                            return "<table style='margin-top: -5px; margin-bottom: -5px'><tr><td width='10px'>"+edit_button + "</td><td>" + delete_button + '</td></tr></table>'; //data-target='#myModalUpdate' 
                        }
                    }
                }
            ],
            "columnDefs": [
                
                {
                    "targets": [ 0 ],
                    "className": "text-right w-5"
                },
                {
                    "targets": [ 1, 2, 3],
                    "className": "text-left w-10"
                },
                {
                    "title": "S/No", "targets": 0,
                    render: function (data, type, row, meta) {
                        return (meta.row + meta.settings._iDisplayStart + 1) + ".";
                    }
                },
                { "title": "User Type", "targets": 1 },
                /*{ "title": "Icons", "targets": 2 },
                { "title": "Icons Images", "targets": 3 },*/
                { "title": "Status", "targets": 2 },
                { "title": "Actions", "targets": 3 }
            ]
        });
        this.setState({ dataTableObj: obj });
        var _this = this;
        $('.switch-checkboxes').bootstrapSwitch({onText: 'Admin', offText: 'User', onSwitchChange: function(event, state){
                //console.log("event  "+event);
                //console.log("state  "+state);
                var id = $(this).attr('data-id');
                var status = $(this).attr('data-status');
                var status = null;
                if(state){
                    status = 'A';
                }else{
                    status = 'U';
                }
                _this.switchCheckBox(parseInt(id), status); 
            }
        });
    };

    cancelRecord() {
        //this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        //this.setState({ updating: false });
        //this.setState({ updateView: false });
        //this.setState({ newRecord: false });
        this.populateDataTable();
        document.getElementById("addUserType").style.display = 'none';
        document.getElementById("updateUserType").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }

    async saveRecord() {
        //this.setState({ newRecord: true });
        await APICall("/usertypes/save", 
        {
            typeDescription: this.refs.description_add.value,
            organizationId: sessionStorage.getItem("orgid"),
            status: ($(".add-switch-checkboxes").bootstrapSwitch('state')) ? 'A' : 'U',
            createdBy: sessionStorage.getItem("userid")
        }, 
        "POST").then(data => {
            if (data.status === 200) {
                this.setState({ userTypeData: data.result });//, loading: false, updating: true
                MessageAlert("success", "Record updated successfully");
                //this.setState({ updating: false });
                //this.setState({ updateView: false });
                //this.setState({ newRecord: false });
                this.populateDataTable();
                document.getElementById("addUserType").style.display = 'none';
                //$("data-area").style.display = "none";
                $("#data-list").css({ pointerEvents : "auto"});
                $("#data-list").css({ top : "0"});
                $("#data-list").css({ left : "0"});
                $("#data-list").css({ zIndex : "10"});
                $("#data-list").css({ opacity : "1.0"});
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ newRecord: true });
                this.refs.description_add.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
                
    }

    async updateRecord() {
        //this.setState({ updating: true });
        await APICall("/usertypes/update", 
        {
            id: this.refs.id_update.value,
            organizationId: this.refs.organizationId_update.value,
            typeDescription: this.refs.description_update.value,
            status: ($(".add-switch-checkboxes").bootstrapSwitch('state')) ? 'A' : 'U'
        }, 
        "PUT").then(data => {
            if (data.status === 200) {
                this.setState({ userTypeData: data.result });//, loading: false
                MessageAlert("success", "Record updated successfully");
                //this.setState({ updating: false });
                //this.setState({ updateView: false });
                this.populateDataTable();
                document.getElementById("updateUserType").style.display = 'none';
                $("#data-list").css({ pointerEvents : "auto"});
                $("#data-list").css({ top : "0"});
                $("#data-list").css({ left : "0"});
                $("#data-list").css({ zIndex : "10"});
                $("#data-list").css({ opacity : "1.0"});
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ updateView: true });
                this.refs.description_update.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
                
    }
    
    async showUserTypeUpdate(itemId) {
        //this.setState({ loading: true });
        await APICall("/usertypes/selectone", {id: itemId}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({ userTypeData: data.result  });//, updateView: true, loading: false
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
        //$("#data-list").css({ backgroundColor : "rgba(0,0,0,0.5)"});
    }
    
    startDelete(itemId, description) {
        //console.log("itemId::: "+itemId);
        //console.log("organizationId::: "+sessionStorage.getItem("orgid"));
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\nUser Type: "+description+"\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/usertypes/delete", 
                {
                    id: itemId,
                    organizationId: sessionStorage.getItem("orgid")
                }, 
                "DELETE").then(data => {
                    if (data.status === 200) {
                        //this.setState({ loading: false, updating: true });
                        MessageAlert("success", "Record deleted");
                        //this.setState({ updating: false });
                        //this.setState({ updateView: false });
                        //this.setState({ newRecord: false });
                        this.populateDataTable();
                    }else{
                        MessageAlert("error", data.message, "Error!!!");
                    }
                }) // JSON-string from `response.json()` call
                .catch(error => {
                    console.error("error::: "+error);
                    //this.setState({ loading: false });
                });
            }
        });
    }

    addNewRecord() {
        //this.setState({newRecord: true});
        var state = document.getElementById("addUserType").style.display;
        if (state === 'block') {
            document.getElementById("addUserType").style.display = 'none';
        } else {
            document.getElementById("addUserType").style.display = 'block';
        }
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
    }

    render() {
        const mystyle = {
            margin:"4px, 4px",
            padding:"4px",
            overflowX: "hidden", 
            overflowY: "auto",
            textAlign:"justify"
        };
    
        return (
            <div className="col-md-12 animated rotateIn faster" id="data-area">
                <div className=" border-3-top flatpanel">
                    <div style={{maxHeight: "900px", maxWidtht: "800px"}} className="panel panel-primary animated rotateIn faster"> 
                        <div id="data-list">
                            <div className="panel-heading">
                                <div className="panel-title">
                                    <h5 style={{ marginTop: "30px" }}><strong>User Types</strong></h5>
                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                        className="btn btn-primary btn-sm clickable" onClick={this.addNewRecord}>
                                        <i className="fa fa-plus"></i> Add User Type</button>
                                </div>
                            </div>
                            <div className="col-md-12"></div>
                            <div className="panel-body col-md-12" style={mystyle}>
                                <br/>
                                <table className="table table-striped table-clean table-hover transactions-table" id="myTable"></table>
                                <div id="loadingLabel"></div>
                            </div>
                        </div>
                    </div>

                    <div className="panel panel-body animated rotateIn faster" data-keyboard="false" data-backdrop="static" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="addUserType">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header modal-header-primary">
                                    <div className="panel-title">
                                        <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Add  User Type</strong></h5>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6 col-sm-12 col-lg-6">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label>Description</label>
                                                            <input type="text" className="form-control" defaultValue="" ref="description_add" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="form-group">
                                                            <label>Admin Status</label>
                                                            Status:&nbsp;<input id="status_add" ref="status_add" type="checkbox" className="switch-checkboxes" />
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
                        </div>
                    </div>
                    
                    <div className="panel panel-body animated rotateIn faster" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="updateUserType">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header modal-header-primary">
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
                                                            <label>Description</label>
                                                            <input type="hidden" className="form-control" defaultValue={this.state.userTypeData.id} ref="id_update" />
                                                            <input type="hidden" className="form-control" defaultValue={this.state.userTypeData.organizationId} ref="organizationId_update" />
                                                            <input type="text" className="form-control" defaultValue={this.state.userTypeData.typeDescription} ref="description_update" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="form-group">
                                                            <label>Admin Status</label>
                                                            Status:&nbsp;<input id="status_update" ref="status_update" type="checkbox" className="switch-checkboxes" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <hr />
                                            {
                                                this.state.updating ?
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}