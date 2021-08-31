class AccessControl extends React.Component {
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
            subMenuData: [], userData: [], updating: false, loading: false, updateView: false, newRecord: false, dataTableObj: undefined, _isMounted: false
        };

        //this.cancelRecord = this.cancelRecord.bind(this);
        //this.rankMenu = this.rankMenu.bind(this);
        this.loadUserData = this.loadUserData.bind(this);
        this.populateDataTable = this.populateDataTable.bind(this);
        this.switchCheckBox = this.switchCheckBox.bind(this);
    };

    componentDidMount() {
        this._isMounted = true;
        sessionStorage.setItem("selectedid", 0);
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i className="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">Access Control</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
        //console.log("componentDidMount::: ");
        
        var _this = this;
        setTimeout(() => {
            $('#user_selected').select2();
            //console.log("componentDidMount create select2 ::: ");
            $("#user_selected").change(function(){
                if($("#user_selected").val() !== null){
                    var selected_id = $("#user_selected").val().toString();
                    sessionStorage.setItem("selectedid", selected_id);
                    //console.log("componentDidMount change user_selected::: "+selected_id);
                    _this.populateDataTable();
                }
            });
        }, 500);
        this.loadUserData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    async switchCheckBox(userId, menuId, status){
        await APICall("/usersmenus/swith-checkbox", {userid: userId, menuid: menuId, status: status, organizationId: sessionStorage.getItem("orgid")}, "PUT")
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
    
    async loadUserData(){
        this.setState({ loading: true });
        //APICall("subMenuTerm.json", {}, "GET")
        await APICall("/users/selectbyorgid", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({ userData: data.result, loading: false });
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
    }
    
    async populateDataTable(){
        const response = await APICall("/usersmenus/selectbyroleids", 
        {createdBy: sessionStorage.getItem("userid"), userid: $("#user_selected").val(), organizationId: sessionStorage.getItem("orgid")}, "POST");
        $('#loadingLabel').hide();
        //console.log(JSON.stringify(response));
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
                { "data": "icon"},
                { "data": "icon",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            var icon = "<i style='color: #2CACDE;  font-size:30px; text-shadow:2px 2px 4px #000000;' class='" + data + "'></i>";
                            return icon ;
                        }
                    }
                },
//id, userid, roleid, roleid, menuid, parentId, topMenu, subMenu, icon, url, statuss, organizationId, dateCreated
                { "data": "url"},
                { "data": "status",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            var status = "";
                            if (data === "A") {
                                status += "<input id='" + row.id + "' type='checkbox' class='switch-checkboxes' checked data-id='" + row.id + "' data-userid='" + row.userId + "' data-menuid='" + row.menuId + "'  data-status='" + row.status + "' />";
                            } else {
                                status += "<input id='" + row.id + "' type='checkbox' class='switch-checkboxes' data-id='" + row.id + "' data-userid='" + row.userId + "' data-menuid='" + row.menuId + "' data-status='" + row.status + "' />";
                            }
                            return status ;
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
                { "title": "Top Menus", "targets": 1 },
                { "title": "Sub Menus", "targets": 2 },
                { "title": "Icons", "targets": 3 },
                { "title": "Icon Images", "targets": 4 },
                { "title": "Urls", "targets": 5 },
                { "title": "Status", "targets": 6 }
            ]
        });
        this.setState({ dataTableObj: obj });
        var _this = this;
        $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked', onSwitchChange: function(event, state){
                //console.log("event  "+event);
                //console.log("state  "+state);
                var userId = $(this).attr('data-userid');
                var menuId = $(this).attr('data-menuid');
                var status = "";
                if(state){
                    status = "A";
                }else{
                    status = "I";
                }
                _this.switchCheckBox(parseInt(userId), parseInt(menuId), status); 
            }
        });
        setTimeout(() => {
            $('#user_selected').select2();
            //console.log("populateDataTable create select2 ::: ");
            $("#user_selected").change(function(){
                if($("#user_selected").val() !== null){
                    var selected_id = $("#user_selected").val().toString();
                    sessionStorage.setItem("selectedid", selected_id);
                    //console.log("populateDataTable::: ")
                    _this.populateDataTable();
                }
            });
        }, 500);
    };

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
                        <div className="panel-heading">
                            <div className="panel-title">
                                <h5 style={{ marginTop: "30px" }}><strong>Access Control</strong></h5>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <br/>
                            <label>Select User</label>
                            <select className="select2 js-states form-control custom_select" id="user_selected">
                                <option value='0'>Select a user...</option>
                                {
                                    [].concat(this.state.userData)
                                    .sort((a, b) => a.id > b.id)
                                    .map((item, i) =>
                                        <option key={item.id} className="clickable" value={item.id}>{item.userName}</option>
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
                </div>
            </div>
        );
    }
}