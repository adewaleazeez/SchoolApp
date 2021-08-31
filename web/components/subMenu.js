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
            subMenuData: [], topMenuData: [], updating: false, loading: false, updateView: false, newRecord: false, dataTableObj: undefined //, _isMounted: false
        };

        this.showSubMenuUpdate = this.showSubMenuUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.loadTopMenuData = this.loadTopMenuData.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
        this.rankMenu = this.rankMenu.bind(this);
        this.populateDataTable = this.populateDataTable.bind(this);
        this.editFormSubMenu = this.editFormSubMenu.bind(this);
        this.editSubMenuRank = this.editSubMenuRank.bind(this);
        this.deleteFormSubMenu = this.deleteFormSubMenu.bind(this);
    };

    editFormSubMenu(id_update){
        if ($("#updateSubMenu").css("display") === 'block') {
            $("#updateSubMenu").css("display", "none");
        } else {
            $("#updateSubMenu").css("display", "block");
        }
        this.showSubMenuUpdate(parseInt(id_update));
    };

    editSubMenuRank(id){
        var rank = $("#id"+id).val();
        this.rankMenu(parseInt(id), parseInt(rank));
    };

    deleteFormSubMenu(id, name, icon, rank){
        this.startDelete(parseInt(id), name, icon, rank);
    };

    componentDidMount(){
        var _this = this;
        window.editFormSubMenu = this.editFormSubMenu;
        window.editSubMenuRank = this.editSubMenuRank;
        window.deleteFormSubMenu = this.deleteFormSubMenu;
        
        sessionStorage.setItem("selectedid", 0);
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i className="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">Sub Menu Setup</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
            
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

    async rankMenu(itemId, rank){
        await APICall("/submenu/update-rank", {id: itemId, rank: rank}, "PUT")
        .then(data => {
            if (data.status === 200) {
                //this.setState({ topMenuData: data.result, updateView: true, loading: false  });
                MessageAlert("success", "Sub Menu Rank updated successfully");
            }else{
                MessageAlert("error", data.message, "Error!!!");
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
        this.populateDataTable();
    }
    
    async loadTopMenuData(){
        //this.setState({ loading: true });
        //APICall("subMenuTerm.json", {}, "GET")
        //sessionStorage.getItem("orgid")
        
        await APICall("/topmenu/selectbyorgid", {organizationId: 1}, "POST")
        .then(data => {
            if (data.status === 200) {
                //, loading: false
                this.setState({ topMenuData: data.result });//setTimeout(() => {}, 500);
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
    }
    
    async populateDataTable() { 
        //sessionStorage.getItem("orgid")
        const response = await APICall("/submenu/selectbytopmenu", 
        {parentId: sessionStorage.getItem("selectedid"), organizationId: 1}, "POST");
        $('#loadingLabel').hide();
        //console.log("IDD::: "+sessionStorage.getItem("selectedid"));
        if(this.state.dataTableObj){
            this.state.dataTableObj.destroy();
        }
        
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
                            var rank = "<input type='text' class='to-edit-sub-menu form-control' onblur=window.editSubMenuRank('" + row.id + "')  id='id"+row.id+"' value='" + data + "' />";
                            return rank ;
                        }
                    }
                },
                { "data": "id",
                    render:function(data, type, row, meta){
                        if (type === "display") {
                            var edit_button = "<button type='button' class='to-update-sub-menu btn btn-lg btn-info' data-toggle='modal' onclick='window.editFormSubMenu(" + row.id + ")'><i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i>&nbsp;Edit</button>";
                            var delete_button = "<button type='button' class='to-delete-sub-menu btn btn-danger btn-lg' onclick=window.deleteFormSubMenu('" + row.id + "','" + encodeURI(row.name) + "','" + encodeURI(row.icon) + "','" + row.rank + "')><i class='fa fa-trash text-danger' style='cursor: pointer; color: white;' title='Delete'></i>&nbsp;Delete</button>";
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
        
        //this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        //this.setState({ updating: false });
        //this.setState({ updateView: false });
        //this.setState({ newRecord: false });
        this.populateDataTable();
        document.getElementById("addSubMenu").style.display = 'none';
        document.getElementById("updateSubMenu").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }

    async saveRecord() {
        setTimeout(() => { 
            $('#topmenu').select2();
            $("#topmenu").val(sessionStorage.getItem("selectedid"));
            $("#topmenu").trigger('change');
        }, 500);
        
        //this.setState({ newRecord: true });
        await APICall("/submenu/save", 
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
                this.setState({ subMenuData: data.result });//, loading: false, updating: false
                MessageAlert("success", "Record updated successfully");
                //this.setState({ updating: false });
                //this.setState({ updateView: false });
                //this.setState({ newRecord: false });
                this.populateDataTable();
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ newRecord: true });
                this.refs.name_add.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        document.getElementById("addSubMenu").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }

    async updateRecord() {
        setTimeout(() => {
            $('#topmenu').select2();
            //console.log("updateRecord create select2 ::: ");
        }, 500);
        
        setTimeout(() => { 
            $("#topmenu").val(sessionStorage.getItem("selectedid"));
            $("#topmenu").trigger('change');
        }, 500);
        
        //this.setState({ updating: true });
        await APICall("/submenu/update", 
        {
            id: this.refs.id_update.value,
            organizationId: this.refs.organizationId_update.value,
            //parentId: $('#topmenu_update').val(), //this.refs.parentId_update.value,
            parentId: parseInt(sessionStorage.getItem("selectedid")),
            name: this.refs.name_update.value,
            icon: this.refs.icon_update.value,
            url: this.refs.url_update.value,
            rank: this.refs.rank_update.value
       }, 
        "PUT").then(data => {
            if (data.status === 200) {
                //, loading: false
                this.setState({ subMenuData: data.result });//setTimeout(() => {}, 500);
                MessageAlert("success", "Record updated successfully");
                //this.setState({ updating: false });
                //this.setState({ updateView: false });
                this.populateDataTable();
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ updateView: true });
                this.refs.name_update.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        document.getElementById("updateSubMenu").style.display = 'none';
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
        
    }
    
    async showSubMenuUpdate(itemId) {
        //this.setState({ loading: true });
        //console.log("showSubMenuUpdate  "+itemId);
        await APICall("/submenu/selectone", {id: itemId}, "POST")
        .then(data => {
            if (data.status === 200) {
                //console.log(JSON.stringify(data.result));
                //, updateView: false, loading: false
                this.setState({ subMenuData: data.result  });//setTimeout(() => {}, 500);
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
        $("#topmenu_update").select2();
        $("#topmenu_update").val(sessionStorage.getItem("selectedid"));
        $("#topmenu_update").trigger('change');
                
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
        //$("#data-list").css({ backgroundColor : "rgba(0,0,0,0.5)"});
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
                APICall("/submenu/delete", 
                {
                    id: itemId
                }, 
                "DELETE").then(data => {
                    if (data.status === 200) {
                        //this.setState({ loading: false, updating: false });
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
        if(sessionStorage.getItem("selectedid") !== '0'){
            //$("#topmenu").select2("destroy");
            //setTimeout(() => {
                $("#topmenu_add").select2();
                $("#topmenu_add").val(sessionStorage.getItem("selectedid"));
                $("#topmenu_add").trigger('change');
            //}, 500);
            //this.setState({newRecord: true});
            var state = document.getElementById("addSubMenu").style.display;
            if (state === 'block') {
                document.getElementById("addSubMenu").style.display = 'none';
            } else {
                document.getElementById("addSubMenu").style.display = 'block';
            }
            $("#data-list").css({ pointerEvents : "none"});
            $("#data-list").css({ top : "0"});
            $("#data-list").css({ left : "0"});
            $("#data-list").css({ zIndex : "10"});
            $("#data-list").css({ opacity : "0.5"});
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
                <div className=" border-3-top flatpanel">
                    <div style={{maxHeight: "800px"}} className="panel panel-primary animated rotateIn faster">
                        <div id="data-list">
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
                    

                        <div className="panel panel-body animated rotateIn faster" data-keyboard="false" data-backdrop="static" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="addSubMenu">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
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
                                                            <select className="select2 js-states form-control custom_select" disabled style={{width: "270px"}} id="topmenu_add">
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
                            </div>
                        </div>

                        <div className="panel panel-body animated rotateIn faster" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="updateSubMenu">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
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
                                                            <select className="select2 js-states form-control custom_select" disabled id="topmenu_update">
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
                                                                <input type="text" className="form-control" defaultValue={this.state.subMenuData.rank} ref="rank_update" />
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}