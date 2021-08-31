class SubMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            organizationId: "",
            parentId: "",
            name: "",
            icon: "",
            url: "",
            rank: "",
            subMenuData: [], topMenuData: [], updating: false, loading: false, updateView: false, newRecord: false, dataTableObj: undefined, _isMounted: false
        };

        this.showUpdate = this.showUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.loadTopMenuData = this.loadTopMenuData.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
        this.rankMenu = this.rankMenu.bind(this);
        this.populateDataTable = this.populateDataTable.bind(this);
    };

    componentDidMount = function () {
        this._isMounted = true;
        sessionStorage.setItem("selectedid", 0);
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i className="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">Sub Menu Setup</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
        //console.log("componentDidMount::: ");
        var _this = this;
        $(document).on('blur', '.to-edit', function () {
            var itemId = $(this).attr('data-id');
            var rank = $('#id'+itemId).val();
            _this.rankMenu(parseInt(itemId), parseInt(rank)); 
        });
        $(document).on('click', '.to-update', function () {
            var id_update = $(this).attr('data-id');
            setTimeout(() => {
                $("#topmenu").select2("destroy");
                $("#topmenu_update").val(parseInt(sessionStorage.getItem("selectedid")));
                $("#topmenu_update").trigger('change'); 
                //console.log("topmenu_update value::: "+$("#topmenu_update").val()); 
            }, 500);
            //console.log("componentDidMount id_update::: "+sessionStorage.getItem("selectedid"));
            _this.showUpdate(parseInt(id_update)); 
        });
        $(document).on('click', '.to-delete', function () {
            //console.log("componentDidMount ::: click delete");
            var id_delete = $(this).attr('data-id');
            var name_delete = $(this).attr('data-name');
            var icon_delete = $(this).attr('data-icon');
            var url_delete = $(this).attr('data-url');
            var rank_delete = $(this).attr('data-rank');
            _this.startDelete(parseInt(id_delete), name_delete, icon_delete, url_delete, rank_delete);
        });
        //sessionStorage.setItem("selectedid", "0");
            
        setTimeout(() => {
            $('#topmenu').select2();
            //console.log("componentDidMount create select2 ::: ");
            $("#topmenu").change(function(){
                if($("#topmenu").val() !== null){
                    var selected_id = $("#topmenu").val().toString();
                    sessionStorage.setItem("selectedid", selected_id);
                    //console.log("componentDidMount change topmenu::: "+selected_id);
                    _this.populateDataTable();
                }
            });
        }, 500);
        this.loadTopMenuData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    rankMenu(itemId, rank){
        APICall("http://localhost:5000/submenu/update-rank", {id: itemId, rank: rank}, "PUT")
        .then(data => {
            if (data.status === 200) {
                //this.setState({ topMenuData: data.result, updateView: true, loading: false  });
                MessageAlert("success", "Rank updated successfully");
            }else{
                MessageAlert("error", data.message, "Error!!!");
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
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
    }
    
    populateDataTable = async () => {
        const response = await APICall("http://localhost:5000/submenu/selectbytopmenu", 
        {parentId: sessionStorage.getItem("selectedid"), organizationId: sessionStorage.getItem("orgid")}, "POST");
        $('#loadingLabel').hide();
        //console.log("IDD::: "+sessionStorage.getItem("selectedid"));
        if(this.state.dataTableObj){
            this.state.dataTableObj.destroy();
        }
        
        var obj = $('#myTable').DataTable({
            "searching": true,
            "Destroy": false,
            "pageLength": 5,
            "pagingType": "full_numbers",
            "lengthMenu": [[5, 10, 15, 20, 25, 30, -1], [5, 10, 15, 20, 25, 30, "All"]],
            "processing": true, 
            data: response.result,
            "rowId": 'id',
            "columns": [
                { "data": "id" },
                { "data": "name" ,
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
                { "data": "icon"},
                { "data": "icon",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            var icon = "<i style='color: #2CACDE;  font-size:30px; text-shadow:2px 2px 4px #000000;' class='" + data + "'></i>";
                            return icon ;
                        }
                    }
                },
                { "data": "url"},
                { "data": "rank",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            //var rank = "<i style='color: #2CACDE; font-size:30px; text-shadow:2px 2px 4px #000000;' class='" + data + "'></i>";
                            var rank = '<input type="text" class="to-edit form-control" data-id="' + row.id + '" data-rank="' + row.rank + '" id="id' + row.id + '" value="' + data + '" />';
                            return rank ;
                        }
                    }
                },
                { "data": "id",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            //var edit_button = "<button type='button' class='btn btn-info btn-lg' data-toggle='modal' data-target='#myModalUpdate'>Edit&nbsp;<i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i></button>";
                            var edit_button = "<button class='to-update btn btn-lg btn-info' data-toggle='modal' data-id='" + row.id + "' data-name='" + row.name + "' data-icon='" + row.icon + "' data-url='" + row.url + "'><i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i>&nbsp;Edit</button>";
                            var delete_button = "<button class='to-delete btn btn-danger btn-lg' data-id='" + row.id + "' data-name='" + row.name + "' data-icon='" + row.icon + "' data-url='" + row.url + "' ><i class='fa fa-trash text-danger' style='cursor: pointer; color: white;' title='Delete'></i>&nbsp;Delete</button>";
                            return edit_button + '&nbsp;&nbsp;&nbsp;' + delete_button; //data-target='#myModalUpdate' 
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
                    "targets": [ 1, 2, 3, 4, 5, 6 ],
                    "className": "text-left w-10"
                },
                {
                    "title": "S/No", "targets": 0,
                    render: function (data, type, row, meta) {
                        return (meta.row + meta.settings._iDisplayStart + 1) + ".";
                    }
                },
                { "title": "Names", "targets": 1 },
                { "title": "Icons", "targets": 2 },
                { "title": "Icons Images", "targets": 3 },
                { "title": "Urls", "targets": 4 },
                { "title": "Positions", "targets": 5 },
                { "title": "Actions", "targets": 6 }
            ]
        });
        this.setState({ dataTableObj: obj });
        var _this = this;
        setTimeout(() => {
            $('#topmenu').select2();
            //console.log("populateDataTable create select2 ::: ");
            $("#topmenu").change(function(){
                if($("#topmenu").val() !== null){
                    var selected_id = $("#topmenu").val().toString();
                    sessionStorage.setItem("selectedid", selected_id);
                    //console.log("populateDataTable::: ")
                    _this.populateDataTable();
                }
            });
        }, 500);
    };

    cancelRecord() {
        setTimeout(() => { 
            $('#topmenu').select2();
            $("#topmenu").val(sessionStorage.getItem("selectedid"));
            $("#topmenu").trigger('change');
        }, 500);
        
        this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        this.setState({ updating: false });
        this.setState({ updateView: false });
        this.setState({ newRecord: false });
        this.populateDataTable();
    }

    saveRecord() {
        setTimeout(() => { 
            $('#topmenu').select2();
            $("#topmenu").val(sessionStorage.getItem("selectedid"));
            $("#topmenu").trigger('change');
        }, 500);
        
        this.setState({ newRecord: true });
        APICall("http://localhost:5000/submenu/save", 
        {
            name: this.refs.name_add.value,
            icon: this.refs.icon_add.value,
            url: this.refs.url_add.value,
            rank: this.refs.rank_add.value,
            organizationId: sessionStorage.getItem("orgid"),
            parentId: parseInt(sessionStorage.getItem("selectedid")),
            createdBy: sessionStorage.getItem("userid")
        }, 
        "POST").then(data => {
            if (data.status === 200) {
                this.setState({ subMenuData: data.result, loading: false, updating: true });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.setState({ newRecord: false });
                this.populateDataTable();
            }else{
                MessageAlert("error", data.message, "Error!!!");
                this.setState({ updating: false });
                this.setState({ newRecord: true });
                this.refs.name_add.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            this.setState({ loading: false });
        });
    }

    updateRecord() {
        setTimeout(() => {
            $('#topmenu').select2();
            //console.log("updateRecord create select2 ::: ");
        }, 500);
        
        setTimeout(() => { 
            $("#topmenu").val(sessionStorage.getItem("selectedid"));
            $("#topmenu").trigger('change');
        }, 500);
        
        this.setState({ updating: true });
        APICall("http://localhost:5000/submenu/update", 
        {
            id: this.refs.id_update.value,
            organizationId: this.refs.organizationId_update.value,
            parentId: $('#topmenu_update').val(), //this.refs.parentId_update.value,
            name: this.refs.name_update.value,
            icon: this.refs.icon_update.value,
            url: this.refs.url_update.value,
            rank: this.refs.rank_update.value
       }, 
        "PUT").then(data => {
            if (data.status === 200) {
                this.setState({ subMenuData: data.result, loading: false });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.populateDataTable();
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
        this.setState({ loading: true });
        APICall("http://localhost:5000/submenu/selectone", {id: itemId}, "POST")
        .then(data => {
            if (data.status === 200) {
                //console.log(JSON.stringify(data.result));
                this.setState({ subMenuData: data.result, updateView: true, loading: false  });
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        
    }
    
    startDelete(itemId, name, icon, url, rank) {
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\nName: "+name+"\nIcon: "+icon+"\nUrl: "+url+"\nRank: "+rank+"\nThis action will cause permanent loss of data and cannot be reversed!",
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
                        this.setState({ loading: false, updating: false });
                        MessageAlert("success", "Record deleted");
                        this.setState({ updating: false });
                        this.setState({ updateView: false });
                        this.setState({ newRecord: false });
                        this.populateDataTable();
                    }else{
                        MessageAlert("error", data.message, "Error!!!");
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
        if(sessionStorage.getItem("selectedid") !== '0'){
            $("#topmenu").select2("destroy");
            setTimeout(() => {
                $("#topmenu_add").select2();
                $("#topmenu_add").val(sessionStorage.getItem("selectedid"));
                $("#topmenu_add").trigger('change');
            }, 500);
            this.setState({newRecord: true});
        }else{
            MessageAlert("error", "Please select a top menu to continue...", "Error!!!");
        }
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
                {this.state.loading ? <Spinner /> :
                    <div className=" border-3-top flatpanel">
                        {
                            !this.state.updateView ?
                            (
                                !this.state.newRecord ?
                                <div style={{maxHeight: "800px"}} className="panel panel-primary animated rotateIn faster"> 
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px" }}><strong>Sub Menus</strong></h5>
                                            <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                                className="btn btn-primary btn-sm clickable" onClick={this.addNewRecord}>
                                                <i className="fa fa-plus"></i> Add Sub Menu</button>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <br/>
                                        <label>Select Top Menu</label>
                                        <select className="select2 js-states form-control custom_select" id="topmenu">
                                            <option value='0'>Select a top menu...</option>
                                            {
                                                [].concat(this.state.topMenuData)
                                                .sort((a, b) => a.id > b.id)
                                                .map((item, i) =>
                                                    <option key={item.id} className="clickable" value={item.id}>{item.name}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className="panel-body col-md-12" style={mystyle}>
                                        <br/>
                                        <table className="table table-striped table-clean table-hover transactions-table" id="myTable"></table>
                                        <div id="loadingLabel"></div>
                                    </div>
                                </div>
                                :
                                <div style={{ maxWidth: "800px" }} className="panel panel-primary animated rotateIn faster">
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Add Sub Menu</strong></h5>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-12 col-lg-6">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <br/>
                                                            <label>Select Top Menu</label>
                                                            <select className="select2 js-states form-control custom_select" disabled id="topmenu_add">
                                                                <option value='0'>Select a top menu...</option>
                                                                {
                                                                    [].concat(this.state.topMenuData)
                                                                    .sort((a, b) => a.id > b.id)
                                                                    .map((item, i) =>
                                                                        <option key={item.id} className="clickable" value={item.id}>{item.name}</option>
                                                                    )
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Name</label>
                                                                <input type="text" className="form-control" defaultValue="" ref="name_add" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Icon</label>
                                                                <input type="text" className="form-control" defaultValue="" ref="icon_add" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Url</label>
                                                                <input type="text" className="form-control" defaultValue="" ref="url_add" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Position</label>
                                                                <input type="text" className="form-control" defaultValue="" ref="rank_add" />
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
                                        <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Update Sub Menu</strong></h5>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6 col-sm-12 col-lg-6">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <br/>
                                                        <label>Select Top Menu</label>
                                                        <select className="select2 js-states form-control custom_select" id="topmenu_update">
                                                            <option value='0'>Select a top menu...</option>
                                                            {
                                                                [].concat(this.state.topMenuData)
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} className="clickable" value={item.id}>{item.name}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label>Name</label>
                                                            <input type="hidden" className="form-control" defaultValue={this.state.subMenuData.id} ref="id_update" />
                                                            <input type="hidden" className="form-control" defaultValue={this.state.subMenuData.organizationId} ref="organizationId_update" />
                                                            <input type="hidden" className="form-control" defaultValue={this.state.subMenuData.parentId} ref="parentId_update" />
                                                            <input type="text" className="form-control" defaultValue={this.state.subMenuData.name} ref="name_update" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label>Icon</label>
                                                            <input type="text" className="form-control" defaultValue={this.state.subMenuData.icon} ref="icon_update" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label>Url</label>
                                                            <input type="text" className="form-control" defaultValue={this.state.subMenuData.url} ref="url_update" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label>Position</label>
                                                            <input type="text" className="form-control" defaultValue={this.state.topMenuData.rank} ref="rank_update" />
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