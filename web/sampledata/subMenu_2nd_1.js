class SubMenu_2nd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            name: "",
            icon: "",
            subMenuData: [], topMenuData: [], updating: false, loading: false, updateView: false, newRecord: false
        };

        this.showUpdate = this.showUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        //this.loadData = this.loadData.bind(this);
        this.loadTopMenuData = this.loadTopMenuData.bind(this);
        this.setupDataTable = this.setupDataTable.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
    };

    componentDidMount = function () {
        $.fn.dataTable.ext.errMode = 'none';
        var _this = this;
        $('#breadcrumb').html(`<li><a href="#/"><i className="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">Sub Menu Setup</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
        
        setTimeout(() => {
            $('#topmenu').select2();
        }, 200);
        
        setTimeout(() => {
            $('#topmenu').on("change", (e)=> {
                //var str = $("#topmenu").find(":selected").text();
                var id = $("#topmenu").val();
                sessionStorage.setItem("selectedid", id);
                _this.setupDataTable();
            });
        }, 500);
        this.loadTopMenuData();
    }
    
    loadTopMenuData(){
        this.setState({ loading: true });
        //APICall("subMenuTerm.json", {}, "GET")
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
        //this.loadData();
    }
    
    updateDataTable(){
        _DatatableObject.ajax.reload(null, false);
    }

    setupDataTable(){
        console.log("setupDataTable");
        var contentType = "application/json";
        var DataTableOptions ={
            "searching": true,
            "Destroy": false,
            "pageLength": 5,
            "lengthMenu": [5, 10, 20, 30, 50],
            "processing": true, 
            "language": {
                "processing": `<div style="margin-left:0px !important;" class="spinner-border"  role="status"><span classe="sr-only"></span></div>`
            },
            "serverSide": true,
            "ajax": {
                "url": "http://localhost:5000/submenu/selectbytopmenu",
                "dataType": "json",
                "type": "POST",
                "mode": "cors", // no-cors, *cors, same-origin
                "cache": "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                "withCredentials": true,
                "credentials": "include", // *include, same-origin, omit
                "body": JSON.stringify({parentId: sessionStorage.getItem("selectedid")}),
                "dataSrc": function(d){
                    if(d.status !== 200){
                        //if(d.data === "  token error"){
                            sessionStorage.clear();
                            window.location.href = "./login.jsp";
                        //}
                    }
                    return d.data;
                }, 
                "data": function(d){
                    //d.datefrom = GetFormattedDate($('#txtDateFrom').val());
                    //d.dateto= GetFormattedDate($('#txtDateTo').val());
                    d.query = $('#txtSearch').val()
                },
                "headers": new Headers({
                    Accept: contentType,
                    "Authorization": 'Bearer '+(sessionStorage.getItem("token")),
                    "Content-Type": contentType
                })
                //,{ 'Token': "Bearer "+sessionStorage.getItem("token") }
            },
            "rowId": 'id',
            "columns": [
                { "data": "id"},
                { "data": "name" ,
                    render: function(data, type, row){
                        if(type === "sort" || type === "type"){
                            return data;
                        }
                        if(!data || data.trim() == ""){
                            return '<a style="color: #2CACDE; " href="#/student/'+ row.id + '"><strong>NO NUMBER ALLOCATED</strong></a>';    
                        }
                        return '<a style="color: #2CACDE; " href="#/student/'+ row.Id + '"><strong>'+data+'</strong></a>';
                    }
                },
                { "data": "icon"},
                { "data": "icon",
                    render: function(data, type, row){
                        return '<i className={icon} />';
                    } 
                }
            ],
            "columnDefs": [
                {
                    "targets": [ 1, 2 ],
                    "className": "text-center w-100"
               },
               {
                    "targets": 3,
                    "className": "text-left",
               }
            ],
            "dom": 'Bfrtip',
            "buttons": [
                //'copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5', 'print'
                'copy', 'excel', 'csv', 'pdf', 'print',
                { text: 'My button',
                    action: function ( e, dt, node, config ) {
                        //alert( 'Button activated' );
                        //swal("Here's a title!", "Here's some text");
                        swal(
                            {
                                title: "An input!",
                                text: "Write something interesting:",
                                type: "input",
                                showCancelButton: true,
                                closeOnConfirm: false,
                                inputPlaceholder: "Write something"
                            }, 
                            function (inputValue) {
                                if (inputValue === false) return false;
                                if (inputValue === "") {
                                  swal.showInputError("You need to write something!");
                                  return false;
                                }
                                swal("Nice!", "You wrote: " + inputValue, "success");
                            }
                        );
                    }
                }
            ]
        };
        _DatatableObject = $('#RecordsTable').DataTable(DataTableOptions);
        
        var _this = this;
        setTimeout(() => {
            $("#topmenu").select2();
            $("#topmenu").val(sessionStorage.getItem("selectedid"));
            $("#topmenu").trigger("change");
            $('#topmenu').on("change", (e)=> {
                if($("#topmenu").val() !== null){
                    var selected_id = $("#topmenu").val().toString();
                    console.log(selected_id);
                    var id_split = selected_id.split(",");
                    var id = id_split[1];
                    if(id === sessionStorage.getItem("selectedid") || id_split.length === 1){
                        id = id_split[0];
                    }
                    
                    sessionStorage.setItem("selectedid", id);
                    _this.setupDataTable();
                }
            });
        }, 200);
    }

    /*loadData() {
       this.setState({ loading: true });
        //APICall("subMenuTerm.json", {}, "GET")
        APICall("http://localhost:5000/submenu/selectbytopmenu", {parentId: sessionStorage.getItem("selectedid")}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({ subMenuData: data.result, loading: false });
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        
        var _this = this;
        setTimeout(() => {
            $("#topmenu").select2();
            $("#topmenu").val(sessionStorage.getItem("selectedid"));
            $("#topmenu").trigger("change");
            $('#topmenu').on("change", (e)=> {
                if($("#topmenu").val() !== null){
                    var selected_id = $("#topmenu").val().toString();
                    console.log(selected_id);
                    var id_split = selected_id.split(",");
                    var id = id_split[1];
                    if(id === sessionStorage.getItem("selectedid") || id_split.length === 1){
                        id = id_split[0];
                    }
                    
                    sessionStorage.setItem("selectedid", id);
                    //_this.loadData();
                    _this.setupDataTable();
                }
            });
        }, 200);
    }*/

    cancelRecord() {
        this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        this.setState({ updating: false });
        this.setState({ updateView: false });
        this.setState({ newRecord: false });
        this.setupDataTable();
    }

    saveRecord() {
        this.setState({ updating: true });
        APICall("http://localhost:5000/submenu/save", 
        {
            name: this.refs.name_add.value,
            icon: this.refs.icon_add.value,
            url: '',
            organizationId: sessionStorage.getItem("orgid"),
            createdBy: sessionStorage.getItem("userid")
        }, 
        "POST").then(data => {
            if (data.status === 200) {
                this.setState({ subMenuData: data.result, loading: false, updating: true });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.setState({ newRecord: false });
                this.setupDataTable();
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

    updateRecord() {
        this.setState({ updating: true });
        APICall("http://localhost:5000/submenu/update", 
        {
            id: this.refs.id_update.value,
            name: this.refs.name_update.value,
            icon: this.refs.icon_update.value
        }, 
        "PUT").then(data => {
            if (data.status === 200) {
                this.setState({ subMenuData: data.result, loading: false });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.setupDataTable();
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
                
                APICall("http://localhost:5000/submenu/delete", 
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
                        this.setupDataTable();
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

    showUpdate(itemId) {
        this.setState({ updateView: true });
        APICall("http://localhost:5000/submenu/selectone", {id: itemId}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({ subMenuData: data.result, loading: false });
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        //this.loadData();
    }

    addNewRecord() {
        this.setState({newRecord: true});
        this.setupDataTable();
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
            <div className="col-md-12 animated rotateIn faster add-student" id="data-area">
                <div className="panel border-primary no-border border-3-top flatpanel">
                    <div className="panel-heading">
                        <div className="panel-title">
                            <h5 style={{ marginTop: "30px" }}><strong>Sub Menus</strong></h5>
                            <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                className="btn btn-primary btn-sm clickable" onClick={this.addNewRecord}>
                                <i className="fa fa-plus"></i> Add Sub Menu</button>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label>Top Menu</label>
                        <select className="select2 js-states form-control custom_select" id="topmenu" onChange={this.setupDataTable} multiple="multiple">
                            {
                                [].concat(this.state.topMenuData)
                                .sort((a, b) => a.id > b.id)
                                .map((item, i) =>
                                    <option key={item.id} className="clickable" value={item.id}>{item.name}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="panel-body">
                        <table className="table table-striped table-hover transactions-table" id="RecordsTable" >
                            <thead>			
                                <tr>
                                    <th>S/No</th>
                                    <th>Name</th>
                                    <th>Icon</th>
                                    <th>Icon Image</th>
                                </tr>
                            </thead>
                            <tbody/>
                        </table>
                    </div>
                    <div className="modal modal-info animated rotateIn faster" id="myModal">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header modal-header-info">
                                    <div className="panel-title">
                                        <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Update Record</strong></h5>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-8 col-sm-12 col-lg-6">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Class Name</label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Section </label>
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
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}