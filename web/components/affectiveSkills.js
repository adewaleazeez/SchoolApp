
class AffectiveSkills extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            organizationId: "",
            affectiveSkill: "",
            affectiveSkillsData: [], updating: false, loading: false, updateView: false, newRecord: false
        };

        this.cancelAffectiveSkillsRecord = this.cancelAffectiveSkillsRecord.bind(this);
        this.addNewAffectiveSkillsRecord = this.addNewAffectiveSkillsRecord.bind(this);
        this.updateAffectiveSkillsRecord = this.updateAffectiveSkillsRecord.bind(this);
        this.saveAffectiveSkillsRecord = this.saveAffectiveSkillsRecord.bind(this);

        this.populateDataTable = this.populateDataTable.bind(this);     
    }

    componentDidMount(){
        window.editFormAffectiveSkills = this.editFormAffectiveSkills;
        window.deleteFormAffectiveSkills = this.deleteFormAffectiveSkills;
        window.populateDataTable = this.populateDataTable;
        sessionStorage.setItem("id", 0);
        //sessionStorage.setItem("section_id", 0);
        
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li>Setup</li><li class="active">Affective Skills</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</B>");
        this.populateDataTable();
    }
    
    async editFormAffectiveSkills(id_update){
        if ($("#updateAffectiveSkills").css("display") === 'block') {
            $("#updateAffectiveSkills").css("display", "none");
        } else {
            $("#updateAffectiveSkills").css("display", "block");
        }
        //$("#sections_update").html('<i className="fa fa-save" id="sections_update" />Update ');
        
        //var _this = this;
        await APICall("/affectiveskills/selectone", {id: id_update}, "POST")
        .then(data => {
            //console.log(JSON.stringify(data));
            if (data.status === 200) {
                $("#affectiveSkill_update").val(data.result.affectiveSkill);
                $("#id_update").val(data.result.id);
                $("#organizationId_update").val(data.result.organizationId);
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
    };
    
    deleteFormAffectiveSkills(itemId, description){
        //this.startAffectiveSkillsDelete(parseInt(id), description);
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\nAffective Skill: "+decodeURI(description)+"\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/affectiveskills/delete", 
                {
                    id: itemId,
                    organizationId: sessionStorage.getItem("orgid")
                }, 
                "DELETE").then(data => {
                    if (data.status === 200) {
                        //this.setState({ loading: false, updating: false });
                        MessageAlert("success", "Record deleted");
                        //this.setState({ updating: false });
                        //this.setState({ updateView: false });
                        //this.setState({ newRecord: false });
                        window.populateDataTable();
                    }else{
                        MessageAlert("error", data.message, "Error!!!");
                    }
                }) // JSON-string from `response.json()` call
                .catch(error => {
                    console.error("error::: "+error);
                    //thclassectionis.setState({ loading: false });
                });
            }
        });
        
    };

    async populateDataTable() {
        const response = await APICall("/affectiveskills/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST");
        $('#loadingLabel').hide();
        if(this.state.dataTableObj){
            this.state.dataTableObj.destroy();
        }
        //console.log("JSON.stringify(response):   "+JSON.stringify(response));
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
                { "data": "affectiveSkill" ,
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
                { "data": "id",
                    render:function(data, type, row, meta){
                        if (type === "display") {
                            var edit_button = "<button type='button' class='to-update-top-menu btn btn-lg btn-info' data-toggle='modal' onclick='window.editFormAffectiveSkills(" + row.id + ")'><i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i>&nbsp;Edit</button>";
                            var delete_button = "<button type='button' class='to-delete-top-menu btn btn-danger btn-lg' onclick=window.deleteFormAffectiveSkills('" + row.id + "','" + encodeURI(row.affectiveSkill) + "')><i class='fa fa-trash text-danger' style='cursor: pointer; color: white;' title='Delete'></i>&nbsp;Delete</button>";
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
                    "targets": [ 1, 2, 3, 4],
                    "className": "text-left w-10"
                },
                {
                    "title": "S/No", "targets": 0,
                    render: function (data, type, row, meta) {
                        return (meta.row + meta.settings._iDisplayStart + 1) + ".";
                    }
                },
                { "title": "Affective Skills", "targets": 1 },
                /*,{ "title": "Section", "targets": 2 },
                { "title": "Teachers", "targets": 3 },*/
                { "title": "Actions", "targets": 4 }
            ]
        });
        this.setState({ dataTableObj: obj });
    };

    cancelAffectiveSkillsRecord() {
        //this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        //this.setState({ updating: false });
        //this.setState({ updateView: false });
        //this.setState({ newRecord: false });
        this.populateDataTable();
        document.getElementById("addAffectiveSkills").style.display = 'none';
        document.getElementById("updateAffectiveSkills").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }

    async saveAffectiveSkillsRecord() {
        //this.setState({ newRecord: true });
        await APICall("/affectiveskills/save", 
        {
            affectiveSkill: this.refs.affectiveSkill_add.value,
            status: 'A',
            organizationId: sessionStorage.getItem("orgid"),
            createdBy: sessionStorage.getItem("userid")
        }, 
        "POST").then(data => {
            if (data.status === 200) {
                //this.setState({ classSectionsData: data.result, loading: false, updating: true });
                MessageAlert("success", "Record Saved successfully");
                //this.setState({ updating: false });
                //this.setState({ updateView: false });
                //this.setState({ newRecord: false });
                this.populateDataTable();
                document.getElementById("addAffectiveSkills").style.display = 'none';
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
                this.refs.affectiveSkill_add.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        
    }

    async updateAffectiveSkillsRecord() {
        //this.setState({ updating: true });
        /*if(!$("#user_update").val()){
            $("#user_update").val("0");
            $("#user_update").trigger('change'); 
        }*/
        await APICall("/affectiveskills/update", 
        {
            id: this.refs.id_update.value,
            affectiveSkill: this.refs.affectiveSkill_update.value,
            status: 'A',
            organizationId: sessionStorage.getItem("orgid"),
            createdBy: sessionStorage.getItem("userid")
        }, 
        "PUT").then(data => {
            if (data.status === 200) {
                //, loading: false
                this.setState({ classSectionsData: data.result });//setTimeout(() => {}, 500);
                MessageAlert("success", "Record updated successfully");
                //this.setState({ updating: false });
                //this.setState({ updateView: false });
                this.populateDataTable();
                document.getElementById("updateAffectiveSkills").style.display = 'none';
                $("#data-list").css({ pointerEvents : "auto"});
                $("#data-list").css({ top : "0"});
                $("#data-list").css({ left : "0"});
                $("#data-list").css({ zIndex : "10"});
                $("#data-list").css({ opacity : "1.0"});
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ updateView: true });
                this.refs.affectiveSkill_update.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        
    }
    
    addNewAffectiveSkillsRecord() {
        //this.setState({newRecord: true});
        $("#affectiveSkill_add").val("");
        $("#affectiveSkill_add").trigger('change');  
        $("#section_add").val(0);
        $("#section_add").trigger('change');  
        $("#user_add").val("");
        $("#user_add").trigger('change');  
        $("#id_add").val(0);
        $("#organizationId_add").val(sessionStorage.getItem("orgid"));
        var state = document.getElementById("addAffectiveSkills").style.display;
        if (state === 'block') {
            document.getElementById("addAffectiveSkills").style.display = 'none';
        } else {
            document.getElementById("addAffectiveSkills").style.display = 'block';
        }
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
    }
z
    render() {
        const mystyle = {
            margin:"4px, 4px",
            padding:"4px",
            overflowX: "hidden", 
            overflowY: "auto",
            textAlign:"justify"
        };
    
        const divwrapper = {
            // style={{
            position: "absolute", 
            //border: "none", 
            backgroundColor: "transparent", 
            marginTop: "-200px", 
            marginBottom: "0px", 
            marginLeft: "400px", 
            display: "none"
            //display: 'flex',
            //flexDirection: 'column'
            //alignItems: 'center',
            //justifyContent: 'center'
            //width: '100%',
            //height: '40%'
            //padding: '50px',
            //color: '#444'
            //border: '1px solid #1890ff'
        };
 
        return (
            <div className="col-md-12 animated rotateIn faster" id="data-area">
                <div className=" border-3-top flatpanel">
                    <div style={{maxHeight: "800px"}} className="panel panel-primary animated rotateIn faster"> 
                        <div id="data-list">
                            <div className="panel-heading">
                                <div className="panel-title">
                                    <h5 style={{ marginTop: "30px" }}><strong>Manage Affective Skills</strong></h5>
                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                        className="btn btn-primary btn-sm clickable" onClick={this.addNewAffectiveSkillsRecord}>
                                        <i className="fa fa-plus"></i> Add Affective Skill</button>
                                </div>
                            </div>
                            <div className="col-md-12"></div>
                            <div className="panel-body col-md-12" style={mystyle}>
                                <br/>
                                <table className="table table-striped table-clean table-hover transactions-table" id="myTable"></table>
                                <div id="loadingLabel"></div>
                            </div>
                        </div>
                    
                        <div className="panel panel-body animated rotateIn faster" data-keyboard="false" data-backdrop="static" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="addAffectiveSkills">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Add Affective Skill</strong></h5>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-12 col-lg-6">
                                                    <div className="row">
                                                        <div className="col-md-12 col-sm-12 col-lg-12">
                                                            <div className="form-group">
                                                                <label>Affective Skill</label>
                                                                <input type="text" className="form-control" defaultValue="" id="affectiveSkill_add" ref="affectiveSkill_add" />
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
                                                        <button onClick={this.cancelAffectiveSkillsRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                        <button onClick={this.saveAffectiveSkillsRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Save </button>
                                                    </div>
                                                }
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-body animated rotateIn faster" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="updateAffectiveSkills">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Update Class/Section</strong></h5>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-12 col-lg-6">
                                                    <div className="row">
                                                        <div className="col-md-12 col-sm-12 col-lg-12">
                                                            <div className="form-group">
                                                                <label>Affective Skill</label>
                                                                <input type="hidden" className="form-control" id="id_update" ref="id_update" />
                                                                <input type="hidden" className="form-control" id="organizationId_update" ref="organizationId_update" />
                                                                <input type="text" className="form-control" defaultValue="" id="affectiveSkill_update" ref="affectiveSkill_update" />
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
                                                        <button onClick={this.cancelAffectiveSkillsRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                        <button onClick={this.updateAffectiveSkillsRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Update</button>
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