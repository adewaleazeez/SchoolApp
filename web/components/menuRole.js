class MenuRole extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            roleId: "",
            menuId: "",
            topMenu: "",
            url: "",
            subMenu: "",
            statuss: "",
            organizationId: "",
            menuRoleData: [], roleData: [], topMenuData: [], subMenuData: [], updating: false, loading: false, updateView: false, newRecord: false, dataTableObj: undefined //, _isMounted: false
        };

        this.showMenuRoleUpdate = this.showMenuRoleUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.loadRoleData = this.loadRoleData.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
        this.switchCheckBox = this.switchCheckBox.bind(this);
        this.populateDataTable = this.populateDataTable.bind(this);
    };

    componentDidMount() {
        //this._isMounted = true;
        sessionStorage.setItem("selectedid", 0);
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i className="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">User Types Menu Setup</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
        
        var _this = this;
        
        $(document).on('click', '.to-update', function () {
            _this.loadTopMenuData();
            var id_update = $(this).attr('data-id');
            setTimeout(() => {
                //$("#usertypes").select2("destroy");
                $("#usertypes_update").val(parseInt(sessionStorage.getItem("selectedid")));
                $("#usertypes_update").trigger('change'); 

                $("#topmenu_update").val('0');
                $("#topmenu_update").trigger('change');

                $("#submenu_update").val('0');
                $("#submenu_update").trigger('change');
                
                $('.update-switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked'});
                $(".update-switch-checkboxes").bootstrapSwitch('state', true);

            }, 500);
            var state = document.getElementById("updateUserTypeMenu").style.display;
            if (state === 'block') {
                document.getElementById("updateUserTypeMenu").style.display = 'none';
            } else {
                document.getElementById("updateUserTypeMenu").style.display = 'block';
            }
            _this.showMenuRoleUpdate(parseInt(id_update));
        });
        
        $(document).on('click', '.to-delete', function () {
            var id_delete = $(this).attr('data-id');
            var usertype_delete = $("#usertypes_update option:selected").text();
            var topMenu_delete = $(this).attr('data-topMenu');
            var subMenu_delete = $(this).attr('data-subMenu');
            var url_delete = $(this).attr('data-url');
            var status_delete = ($(this).attr('data-status')==="A") ? "Active" : "Blocked";
            _this.startDelete(parseInt(id_delete), usertype_delete, topMenu_delete, subMenu_delete, url_delete, status_delete);
        });
        
        setTimeout(() => {
            $('#usertypes').select2();
            $("#usertypes").change(function(){
                if($("#usertypes").val() !== null){
                    var selected_id = $("#usertypes").val().toString();
                    sessionStorage.setItem("selectedid", selected_id);
                    _this.populateDataTable();
                }
            });

        }, 1000);
        
        this.loadRoleData();
        
    }

    //componentWillUnmount() {
    //    this._isMounted = false;
    //}
    
    async switchCheckBox(itemId, status){
        await APICall("/menurole/swith-checkbox", {id: itemId, status: status}, "PUT")
        .then(data => {
            if (data.status === 200) {
                //this.setState({ roleData: data.result, updateView: true, loading: false  });
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
    
    async loadRoleData(){
        this.setState({ loading: true });
        //APICall("subMenuTerm.json", {}, "GET")
        await APICall("/usertypes/selectbyorgid", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            //console.log(data.result);
            if (data.status === 200) {
                this.setState({ roleData: data.result, loading: false });
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
    }
    
    async loadTopMenuData(){
        //this.setState({ loading: true });
        //sessionStorage.getItem("orgid")
        await APICall("/topmenu/selectbyorgid", {organizationId: 1}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({ topMenuData: data.result, loading: false });
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        
        var _this = this;
        setTimeout(() => {
            $('#topmenu_add').select2();
            $("#topmenu_add").change(function(){
                if($("#topmenu_add").val() !== null){
                    var selected_id = $("#topmenu_add").val().toString();
                    sessionStorage.setItem("topmenu_selectedid", selected_id);
                    //_this.populateDataTable();
                    _this.loadSubMenuData(selected_id);
                }
            });
        }, 1000);
        
    }
    
    async loadSubMenuData(id){
        //this.setState({ loading: true });
        //sessionStorage.getItem("orgid")
        await APICall("/submenu/selectbytopmenu", {parentId: id, organizationId: 1}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({ subMenuData: data.result, loading: false });
                $("#submenu_update").val('0');
                $("#submenu_update").trigger('change');
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        
        var _this = this;
        setTimeout(() => {
            $('#submenu_add').select2();
            $("#submenu_add").change(function(){
                if($("#submenu_add").val() !== null){
                    var selected_id = $("#submenu_add").val().toString();
                    sessionStorage.setItem("submenu_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#submenu_add").find("option:selected").data("url");
                $("#url_add").val(url);
            });

            $('#submenu_update').select2();
            $("#submenu_update").change(function(){
                if($("#submenu_update").val() !== null){
                    var selected_id = $("#submenu_update").val().toString();
                    sessionStorage.setItem("submenu_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#submenu_update").find("option:selected").data("url");
                $("#url_update").val(url);
            });

        }, 1000);
        
    }
    
    populateDataTable() {
        this.setState({ loading: false });
        const response = APICall("/menurole/selectbyroleid", 
        {roleid: sessionStorage.getItem("selectedid"), organizationId: sessionStorage.getItem("orgid")}, "POST");
        //console.log(JSON.stringify(response.result));
        //console.log(sessionStorage.getItem("selectedid"));
        //console.log(sessionStorage.getItem("orgid"));
        $('#loadingLabel').hide();
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
                { "data": "topMenu" ,
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
                { "data": "subMenu"},
                { "data": "url"},
                { "data": "status",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            var status = "";
                            if (data === "A") {
                                status += "<input id='" + row.id + "' type='checkbox' class='switch-checkboxes' checked  data-id='" + row.id + "' data-status='" + row.status + "' />";
                            } else {
                                status += "<input id='" + row.id + "' type='checkbox' class='switch-checkboxes' data-id='" + row.id + "' data-status='" + row.status + "' />";
                            }
                            return status ;
                        }
                    }
                },
                { "data": "id",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            //data-roleId='" + row.roleId + "' data-icon='" + row.icon + "' data-url='" + row.url + "'
                            var edit_button = "<button class='to-update btn btn-sm btn-info' data-toggle='modal' data-id='" + row.id + "'><i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i>&nbsp;Edit</button>";
                            var delete_button = "<button class='to-delete btn btn-danger btn-sm' data-id='" + row.id + "' data-topMenu='" + row.topMenu + "' data-subMenu='" + row.subMenu + "' data-url='" + row.url + "' data-status='" + row.status + "' ><i class='fa fa-times text-danger' style='cursor: pointer; color: white;' title='Delete'></i>&nbsp;Delete</button>";
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
                    "targets": [ 1, 2, 3, 4, 5 ],
                    "className": "text-left w-10"
                },
                {
                    "title": "S/No", "targets": 0,
                    render: function (data, type, row, meta) {
                        return (meta.row + meta.settings._iDisplayStart + 1) + ".";
                    }
                },
                { "title": "Top Menu", "targets": 1 },
                { "title": "Sub Menu", "targets": 2 },
                { "title": "Menu Url", "targets": 3 },
                { "title": "Status", "targets": 4 },
                { "title": "Actions", "targets": 5 }
            ]
        });
        this.setState({ dataTableObj: obj });
        var _this = this;
        $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked', onSwitchChange: function(event, state){
                //console.log("event  "+event);
                //console.log("state  "+state);
                var itemId = $(this).attr('data-id');
                var status = "";
                if(state){
                    status = "A";
                }else{
                    status = "I";
                }
                _this.switchCheckBox(parseInt(itemId), status); 
            }
        });
            
        setTimeout(() => {
            $('#usertypes').select2();
            //console.log("populateDataTable create select2 ::: ");
            $("#usertypes").change(function(){
                if($("#usertypes").val() !== null){
                    var selected_id = $("#usertypes").val().toString();
                    sessionStorage.setItem("selectedid", selected_id);
                    //console.log("populateDataTable::: ")
                    _this.populateDataTable();
                }
            });
        }, 500);
    };

    cancelRecord() {
        setTimeout(() => { 
            $('#usertypes').select2();
            $("#usertypes").val(sessionStorage.getItem("selectedid"));
            $("#usertypes").trigger('change');
        }, 500);
        
        this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        this.setState({ updating: false });
        this.setState({ updateView: false });
        this.setState({ newRecord: false });
        this.populateDataTable();
        document.getElementById("addUserTypeMenu").style.display = 'none';
        document.getElementById("updateUserTypeMenu").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
        //$("#data-list").css({ backgroundColor : "none"});

    }

    async saveRecord() {
        setTimeout(() => { 
            $('#usertypes').select2();
            $("#usertypes").val(sessionStorage.getItem("selectedid"));
            $("#usertypes").trigger('change');
        }, 500);
        
        if($("#usertypes_add").val()==="0"){
            MessageAlert("error", "User Type must be selected!!!", "Error!!!");
            return true;
        }
        if($("#submenu_add").val()==="0"){
            MessageAlert("error", "Sub Menu must be selected!!!", "Error!!!");
            return true;
        }
        //this.setState({ newRecord: true });
        await APICall("/menurole/save", 
        {  
            organizationId: sessionStorage.getItem("orgid"),
            menuId: $("#submenu_add").val(),
            roleId: $("#usertypes_add").val(),
            status: ($(".update-switch-checkboxes").bootstrapSwitch('state')) ? "A" : "I",
            createdBy: sessionStorage.getItem("userid")
        }, 
        "POST").then(data => {
            if (data.status === 200) {
                this.setState({ menuRoleData: data.result, loading: false, updating: true });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.setState({ newRecord: false });
                this.populateDataTable();
            }else{
                MessageAlert("error", data.message, "Error!!!");
                this.setState({ updating: false });
                //this.setState({ newRecord: true });
                this.refs.name_add.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            this.setState({ loading: false });
        });
        document.getElementById("addUserTypeMenu").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }

    async updateRecord() {
        setTimeout(() => { 
            $('#usertypes').select2();
            $("#usertypes").val(sessionStorage.getItem("selectedid"));
            $("#usertypes").trigger('change');
        }, 500);
        
        if($("#submenu_update").val()==="0"){
            MessageAlert("error", "User Type must be selected!!!", "Error!!!");
            return true;
        }
        if($("#submenu_update").val()==="0"){
            MessageAlert("error", "Sub Menu must be selected!!!", "Error!!!");
            return true;
        }
        //this.setState({ updating: true });
        await APICall("/menurole/update", 
        {
            id: this.refs.id_update.value,
            menuId: $('#submenu_update').val(), //this.refs.parentId_update.value,
            roleId: $('#usertypes_update').val(),
            status: ($(".update-switch-checkboxes").bootstrapSwitch('state')) ? "A" : "I"
       }, 
        "PUT").then(data => {
            //console.log(data.status);
            if (data.status === 200) {
                //this.setState({ menuRoleData: data.result, loading: false });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.populateDataTable();
            }else{
                MessageAlert("error", data.message, "Error!!!");
                this.setState({ updating: false });
                //this.setState({ updateView: true });
                $('#topmenu_update').focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        document.getElementById("updateUserTypeMenu").style.display = 'none';
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }
    
    async showMenuRoleUpdate(itemId) {
        //this.setState({ loading: true });
        await APICall("/menurole/selectbyid", {id: itemId}, "POST")
        .then(data => {
            if (data.status === 200) {
                //console.log(JSON.stringify(data.result[0]));
                //console.log(JSON.stringify(data.result[0].parentId));
                this.setState({ menuRoleData: data.result[0]});
                this.loadSubMenuData(data.result[0].parentId);
                setTimeout(() => {
                    $("#topmenu_update").val(data.result[0].parentId);
                    $("#topmenu_update").trigger('change');
                    $("#submenu_update").val(data.result[0].menuId);
                    $("#submenu_update").trigger('change');
                    $("#url_update").val(data.result[0].url);
                    if(data.result[0].status==="A"){
                        $(".update-switch-checkboxes").bootstrapSwitch('state', true);
                    }else{
                        $(".update-switch-checkboxes").bootstrapSwitch('state', false);
                    }
                }, 1000);
                //, updateView: true, loading: false  
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
    
    startDelete(itemId, usertype, topMenu, subMenu, url, status_delete) {
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\n\nUser Type: "+usertype+"\nTop Menu: "+topMenu+"\nSub Menu: "+subMenu+"\nUrl: "+url+"\nStatus: "+status_delete+"\n\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/menurole/delete", 
                {
                    id: itemId
                }, 
                "DELETE").then(data => {
                    if (data.status === 200) {
                        //this.setState({ loading: false, updating: false });
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
            //this.setState({ loading: true });
            //$("#usertypes").select2("destroy");
            this.loadTopMenuData();
            setTimeout(() => {
                $("#usertypes_add").select2();
                $("#usertypes_add").val(sessionStorage.getItem("selectedid"));
                $("#usertypes_add").trigger('change');
                
                //$("#topmenu_add").select2();
                $("#topmenu_add").val('0');
                $("#topmenu_add").trigger('change');
                
                //$("#submenu_add").select2();
                $("#submenu_add").val('0');
                $("#submenu_add").trigger('change');
                $('.add-switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked'});
                $(".add-switch-checkboxes").bootstrapSwitch('state', true);
            }, 500);
            //this.setState({newRecord: true});
            // data-target="#addUserTypeMenu"
            var state = document.getElementById("addUserTypeMenu").style.display;
            if (state === 'block') {
                document.getElementById("addUserTypeMenu").style.display = 'none';
            } else {
                document.getElementById("addUserTypeMenu").style.display = 'block';
            }
            $("#data-list").css({ pointerEvents : "none"});
            $("#data-list").css({ top : "0"});
            $("#data-list").css({ left : "0"});
            $("#data-list").css({ zIndex : "10"});
            $("#data-list").css({ opacity : "0.5"});
            //$("#data-list").css({ backgroundColor : "rgba(0,0,0,0.5)"});
        }else{
            MessageAlert("error", "Please select a user type to continue...", "Error!!!");
        }
        //this.setState({ loading: false });
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
                                    <h5 style={{ marginTop: "30px" }}><strong>User Type Menus</strong></h5>
                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                        className="btn btn-primary btn-sm clickable" onClick={this.addNewRecord} data-toggle="modal">
                                        <i className="fa fa-plus"></i> Add Menu to User Type</button>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <br/>
                                <label>Select User Type</label>
                                <select className="select2 js-states form-control custom_select" id="usertypes">
                                    <option value='0'>Select a User Type...</option>
                                    {
                                        [].concat(this.state.roleData)
                                        .sort((a, b) => a.id > b.id)
                                        .map((item, i) =>
                                            <option key={item.id} className="clickable" value={item.id}>{item.typeDescription}</option>
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
                        
                        <div className="panel panel-body animated rotateIn faster" data-keyboard="false" data-backdrop="static" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="addUserTypeMenu">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "0px", marginLeft: "-10px" }}><strong>Add User Type Menus</strong></h5>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-8 col-sm-12 col-lg-6">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <br/>
                                                            <label>User Type</label>
                                                            <select className="select2 js-states form-control custom_select" disabled id="usertypes_add">
                                                                <option value='0'>Select a User Type...</option>
                                                                {
                                                                    [].concat(this.state.roleData)
                                                                    .sort((a, b) => a.id > b.id)
                                                                    .map((item, i) =>
                                                                        <option key={item.id} className="clickable" value={item.id}>{item.typeDescription}</option>
                                                                    )
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <br/>
                                                                <label>Select Top Menu</label>
                                                                <select className="select2 js-states form-control custom_select" id="topmenu_add" ref="topmenu_add">
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
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <br/>
                                                                <label>Select Sub Menu</label>
                                                                <select className="select2 js-states form-control custom_select" id="submenu_add" ref="submenu_add">
                                                                    <option value='0'>Select a sub menu...</option>
                                                                    {
                                                                        [].concat(this.state.subMenuData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.url} className="clickable" value={item.id}>{item.name}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Url</label>
                                                                <input type="text" className="form-control" disabled defaultValue="" id="url_add" ref="url_add" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Status</label>
                                                                <input id="status_add" ref="status_add" type="checkbox" className="add-switch-checkboxes" />
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
                                                        <button onClick={this.saveRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-save" />Save </button>
                                                    </div>
                                                }
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-body animated rotateIn faster" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="updateUserTypeMenu">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "0px", marginLeft: "-10px" }}><strong>Update User Type Menus</strong></h5>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-8 col-sm-12 col-lg-6">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <br/>
                                                            <label>User Type</label>
                                                            <select className="select2 js-states form-control custom_select" disabled id="usertypes_update">
                                                                <option value='0'>Select a User Type...</option>
                                                                {
                                                                    [].concat(this.state.roleData)
                                                                    .sort((a, b) => a.id > b.id)
                                                                    .map((item, i) =>
                                                                        <option key={item.id} className="clickable" value={item.id}>{item.typeDescription}</option>
                                                                    )
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <br/>
                                                                <label>Select Top Menu</label>
                                                                <select className="select2 js-states form-control custom_select" id="topmenu_update" ref="topmenu_update">
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
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <br/>
                                                                <label>Select Sub Menu</label>
                                                                <select className="select2 js-states form-control custom_select" id="submenu_update" ref="submenu_update">
                                                                    <option value='0'>Select a sub menu...</option>
                                                                    {
                                                                        [].concat(this.state.subMenuData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.url} className="clickable" value={item.id}>{item.name}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Url</label>
                                                                <input type="text" className="form-control" disabled defaultValue="" id="url_update" ref="url_update" />
                                                                <input type="hidden" className="form-control" defaultValue={this.state.menuRoleData.id} ref="id_update" />
                                                                <input type="hidden" className="form-control" defaultValue={this.state.menuRoleData.organizationId} ref="organizationId_update" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Status</label>
                                                                <input id="status_update" ref="status_update" type="checkbox" className="update-switch-checkboxes" />
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
                                                        <button onClick={this.updateRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-save" />Update</button>
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