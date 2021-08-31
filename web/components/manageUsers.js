class ManageUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            userImage: "",
            userName: "",
            email_: "",
            firstName: "",
            lastName: "",
            otherNames: "",
            phoneNo: "",
            status: "",
            userdp_: "",
            organizationId: "",
            roleData: [], userData: [], updating: false, loading: false, updateView: false, newRecord: false, dataTableObj: undefined, //, _isMounted: false,
            user: {}, filePresent: false, workingImage: {}, mainContainerClass: 'col-md-12 col-lg-12 animated rotateIn faster'
        };

        this.reloadUser = this.reloadUser.bind(this);
        this.triggerFileInput = this.triggerFileInput.bind(this);
        this.saveNewImage = this.saveNewImage.bind(this);
        this.getImageData = this.getImageData.bind(this);
        this.imageChanged = this.imageChanged.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.initializeCropper = this.initializeCropper.bind(this);
        this.showManageUserUpdate = this.showManageUserUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.switchCheckBox = this.switchCheckBox.bind(this);
        this.populateDataTable = this.populateDataTable.bind(this);
        this.editFormManageUser = this.editFormManageUser.bind(this);
        this.deleteFormManageUser = this.deleteFormManageUser.bind(this);
    };
    
    editFormManageUser(id_update){
        setTimeout(() => {
            //$("#usertypes").select2("destroy");
            $("#usertypes").select2();
            $("#usertypes").val(parseInt(sessionStorage.getItem("selectedid")));
            $("#usertypes").trigger('change'); 

            $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked'});
            $(".switch-checkboxes").bootstrapSwitch('state', true);

        }, 500);

        if ($("#manageUser").css("display") === 'block') {
            $("#manageUser").css("display", "none");
        } else {
            //document.getElementById("manageUser").style.display = 'block';
            $("#formHeader").html("<strong>Update User</strong> ");
            $("#saveButton").html("<i class='fa fa-save' /> Update ");
            $("#manageUser").css("display", "block");
            $("#resetButton").html("<i class='fa fa-lock' /> Rest Password ");
            $("#resetButton").css("display", "block");
        }
        this.showManageUserUpdate(parseInt(id_update));
    };

    deleteFormManageUser(id, userName, firstName, lastName, phoneNo, status){
        this.startDelete(parseInt(id), userName, firstName, lastName, phoneNo, status);
    };

    componentDidMount(){
        window.editFormManageUser = this.editFormManageUser;
        window.deleteFormManageUser = this.deleteFormManageUser;
        
        //this._isMounted = true;
        sessionStorage.setItem("selectedid", 0);
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i className="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">Manage Users</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
        
        this.loadRoleData();
        this.populateDataTable();
        
    }

    triggerFileInput() {
        $('#the-file-input').trigger('click');
    }

    getImageData() {
        return this.state.workingImage.cropper('getCroppedCanvas').toDataURL('image/jpeg');
    }


    renderImage(file) {
        var reader = new FileReader();
        reader.onload = (event) => {
            var the_url = event.target.result;
            $('#PreviewImage').html("<img id='ImageToCrop' src='" + the_url + "' />");
            this.initializeCropper();
        };
        
        reader.onerror = (event) => {
            this.setState({ filePresent: false });
        };
        
        reader.readAsDataURL(file);
    }

    initializeCropper() {
        var WorkingImage = $("#ImageToCrop");
        this.setState({ workingImage: WorkingImage });

        var width = 200;
        var height = 200;
        var CropperSize = 200;
        if (width < height) {
            CropperSize = width;
        } else {
            CropperSize = height;
        }

        this.state.workingImage.cropper({
            aspectRatio: 1 / 1,
            data: {
                width: CropperSize,
                height: CropperSize
            }
        });

        this.setState({ filePresent: true });

    }

    saveNewImage() {
        var ImageBase64 = this.getImageData();
        //this.updatePicture(ImageBase64);
        //$WorkingImage.cropper('destroy');
        
        $('#userdp_').attr('src', ImageBase64);
        HideModal("ImageArea");
        //$WorkingImage.cropper('destroy');
        //$('#ImageArea').modal('hide');

    }


    async updatePicture(Base64Image) {
        this.setState({ updating: true });
        await APICall("updatedp", { Base64Image: Base64Image }, 'POST')
        .then(data => {

            if (data.status === "success") {
                this.setState({ updating: false });
                this.reloadUser();
                this.props.loadInit();
                HideModal("ImageArea");
            } else {
                MessageAlert("error", data.data);
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            this.setState({ updating: false });
            console.error(error);
            MessageAlert("error", "An error occurred, reload page and retry", "Error");
        });
    }

    async reloadUser() {
        this.setState({ loading: true });
        await APICall("user.json", {}, 'GET')
            .then(data => {
                if (data.status === "success") {
                    this.setState({ loading: false, user: data.data });
                } else {
                    MessageAlert("error", data.data);
                }
            }) // JSON-string from `response.json()` call
            .catch(error => {
                MessageAlert("error", "An error occurred, reload page and retry", "Error");
            });
    }

    imageChanged() {
        //var fileInput = this;
        $('#ImageArea').modal('show');
        setTimeout(() =>
            this.renderImage(this.fileUploaded.files[0])
            , 1000);
    }

    async switchCheckBox(itemId, status){
        await APICall("/menurole/swith-checkbox", {id: itemId, status: status}, "PUT")
        .then(data => {
            if (data.status === 200) {
                //this.setState({ roleData: data.result, updateView: true, loading: false  });
                //MessageAlert("success", "Status switched successfully");
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
    
    async populateDataTable() {
        this.setState({ loading: false });
        const response = await APICall("/users/selectbyorgid", {organizationId: sessionStorage.getItem("orgid")}, "POST");
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
                { "data": "userImage" ,
                    render: function(data, type, row){
                        
                        return "<img src='" + data + "' alt='' style='border-radius: 50%; width: 70px; height: 70px'/>";
                    }
                },
                { "data": "email"},
                { "data": "userName"},
                { "data": "firstName",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            return row.firstName+" "+row.lastName;
                        }
                    }
                },
                { "data": "phoneNo"},
                { "data": "active",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            var status = "";
                            if (data === "A") {
                                status += "<input id='" + row.id + "' type='checkbox' disabled class='switch-checkboxes' checked data-id='" + row.id + "' data-status='" + row.status + "' />";
                            } else {
                                status += "<input id='" + row.id + "' type='checkbox' disabled class='switch-checkboxes' data-id='" + row.id + "' data-status='" + row.status + "' />";
                            }
                            return status ;
                        }
                    }
                },
                { "data": "id",
                    render:function(data, type, row, meta){
                        if (type === "display") {
                            var edit_button = "<button type='button' class='to-update-top-menu btn btn-lg btn-info' data-toggle='modal' onclick='window.editFormManageUser(" + row.id + ")'><i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i>&nbsp;Edit</button>";
                            var delete_button = "<button type='button' class='to-delete-top-menu btn btn-danger btn-lg' onclick=window.deleteFormManageUser('" + row.id + "','" + encodeURI(row.email) + "','" + encodeURI(row.userName) + "','" + encodeURI(row.firstName + " " + row.lastName) + "','" + encodeURI(row.phoneNo) + "','" + encodeURI(row.status) + "')><i class='fa fa-trash text-danger' style='cursor: pointer; color: white;' title='Delete'></i>&nbsp;Delete</button>";
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
                    "targets": [ 1, 2, 3, 4, 5, 6, 7 ],
                    "className": "text-left w-10"
                },
                {
                    "title": "S/No", "targets": 0,
                    render: function (data, type, row, meta) {
                        return (meta.row + meta.settings._iDisplayStart + 1) + ".";
                    }
                },
                { "title": "Profile Picture", "targets": 1 },
                { "title": "Email", "targets": 2 },
                { "title": "Username", "targets": 3 },
                { "title": "Full Name", "targets": 4 },
                { "title": "Phone No", "targets": 5 },
                { "title": "Status", "targets": 6 },
                { "title": "Actions", "targets": 7 }
                //id, userImage, email, username, firstName, lastName, otherNames, phoneNo, status 
            ]
        });
        this.setState({ dataTableObj: obj });
        var _this = this;
        $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked', onClick: function(event, state){ //onSwitchChange
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
            
    };

    cancelRecord() {
        
        //this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        this.setState({ updating: false });
        this.setState({ updateView: false });
        this.setState({ newRecord: false });
        HideModal("ImageArea");
        this.populateDataTable();
        document.getElementById("manageUser").style.display = 'none';
        document.getElementById("ImageArea").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
        //$("#data-list").css({ backgroundColor : "none"});

    }


    async resetPassword(){
        var username = this.refs.username.value;
        this.setState({loading: true});
        await APICall("/users/resetPassword", {username: username}, "PUT")
        .then(data => {
            if(data.status === 200){
                MessageAlert("success", "Successful Password Reset", "Password reset");
            }else{
                MessageAlert("error", data.message, "Failed");
            }
            this.setState({loading: false});
            $("#resetButton").html("<i class='fa fa-lock' /> Rest Password ");
            $("#resetButton").css("display", "block");
        }) // JSON-string from `response.json()` call
        .catch(error => {
            MessageAlert("error", "Password could not be reset", "Fatal error");
            this.setState({loading: false});
            $("#resetButton").html("<i class='fa fa-lock' /> Rest Password ");
            $("#resetButton").css("display", "block");
        });
        
    }
    
    async saveRecord() {
        if($("#usertypes").val()===null){
            MessageAlert("error", "User Type must be selected!!!", "Error!!!");
            return true;
        }
        this.setState({ updating: true });
        
        //str
        //if(document.getElementById("saveButton").innerHTML === '<i class="fa fa-save"> Save </i>'){ //   > Update
        if(document.getElementById("saveButton").innerHTML.toString().indexOf(" Save ") !== -1){ //   > Update
            await APICall("/users/save", 
            {
                email: this.refs.email.value.toString(),
                username: this.refs.username.value.toString(),
                firstName: this.refs.firstname.value.toString(),
                lastName: this.refs.lastname.value.toString(),
                otherNames: this.refs.othernames.value.toString(),
                userImage: $('#userdp_').attr('src'), //this.getImageData().toString(),
                phoneNo: this.refs.phoneno.value.toString(),
                //status: ($(".switch-checkboxes").bootstrapSwitch('state')) ? "A" : "I",
                organizationId: sessionStorage.getItem("orgid").toString(),
                userTypes: $("#usertypes").val().toString(),
                active: ($(".switch-checkboxes").bootstrapSwitch('state')) ? "A" : "B", //"Yes",
                createdBy: sessionStorage.getItem("userid").toString()
            }, 
            "POST").then(data => {
                if (data.status === 200) {
                    //this.setState({ menuRoleData: data.result, loading: false, updating: true });
                    MessageAlert("success", "Record updated successfully");
                    this.setState({ updating: false });
                    this.setState({ updateView: false });
                    this.setState({ newRecord: false });
                    document.getElementById("manageUser").style.display = 'none';

                    //$("data-area").style.display = "none";
                    $("#data-list").css({ pointerEvents : "auto"});
                    $("#data-list").css({ top : "0"});
                    $("#data-list").css({ left : "0"});
                    $("#data-list").css({ zIndex : "10"});
                    $("#data-list").css({ opacity : "1.0"});
                    this.populateDataTable();
                }else{
                    MessageAlert("error", data.message, "Error!!!");

                    //this.setState({ newRecord: true });
                    //this.refs.username.focus();
                }
                this.setState({ updating: false });
                    
            }) // JSON-string from `response.json()` call
            .catch(error => {
                console.error("error::: "+error);
                this.setState({ loading: false });
            });
        }else{
            this.updateRecord();
        }
        //if(document.getElementById("saveButton").innerHTML === '<i class="fa fa-save"> Update </i>'){
        //    url = "/users/update";
        //}
    }

    async updateRecord() {
        if($("#usertypes").val()==="0"){
            MessageAlert("error", "User Type must be selected!!!", "Error!!!");
            return true;
        }
        this.setState({ updating: true });
        await APICall("/users/update", 
        {
            id: this.refs.id.value,
            email: this.refs.email.value.toString(),
            username: this.refs.username.value.toString(),
            firstName: this.refs.firstname.value.toString(),
            lastName: this.refs.lastname.value.toString(),
            otherNames: this.refs.othernames.value.toString(),
            userImage: $('#userdp_').attr('src'), //this.getImageData().toString(),
            phoneNo: this.refs.phoneno.value.toString(),
            //status: ($(".switch-checkboxes").bootstrapSwitch('state')) ? "A" : "I",
            organizationId: sessionStorage.getItem("orgid").toString(),
            userTypes: $("#usertypes").val().toString(),
            active: ($(".switch-checkboxes").bootstrapSwitch('state')) ? "A" : "B", //"Yes",
            createdBy: sessionStorage.getItem("userid").toString()
       }, 
        "PUT").then(data => {
            if (data.status === 200) {
                //this.setState({ menuRoleData: data.result, loading: false });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.populateDataTable();
                      
                document.getElementById("manageUser").style.display = 'none';
                $("#data-list").css({ pointerEvents : "auto"});
                $("#data-list").css({ top : "0"});
                $("#data-list").css({ left : "0"});
                $("#data-list").css({ zIndex : "10"});
                $("#data-list").css({ opacity : "1.0"});

            }else{
                MessageAlert("error", data.message, "Error!!!");
                this.setState({ updating: false });
                //this.setState({ updateView: true });
                //this.refs.username.focus();
            }
            this.setState({ updating: false });
                    
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
    }
    
    async showManageUserUpdate(itemId) {
        //console.log("itemId::: "+itemId);
        //this.setState({ loading: true });
        await APICall("/users/selectone", {id: itemId}, "POST")
        .then(data => {
            if (data.status === 200) {
                //console.log(JSON.stringify(data.result));
                //this.setState({ userData: data.result});userTypes
                setTimeout(() => {
                    $("#id_").val(data.result.id);
                    $("#email_").val(data.result.email);
                    $("#firstname").val(data.result.firstName);
                    $("#lastname").val(data.result.lastName);
                    $("#othernames").val(data.result.otherNames);
                    $("#phoneno").val(data.result.phoneNo);
                    $("#username").val(data.result.userName);
                    $("#username").attr("disabled", true);
                    $("#username").prop("readonly", true);
                    
                    $("#usertypes").select2();
                    var object = eval('[' + data.result.userTypes + ']');
                    $('#usertypes').val(object).trigger('change');
                    (data.result.status==="A") ? $(".switch-checkboxes").bootstrapSwitch('state', true) : $(".switch-checkboxes").bootstrapSwitch('state', false);
                    $("#email_").focus();
                }, 1000);
                $('#userdp_').attr('src', data.result.userImage);
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
    //
    startDelete(itemId, email, username, fullname, phoneno, status) {
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\n\nEmail: "+decodeURI(email)+"\nUsername: "+decodeURI(username)+"\nFullname: "+decodeURI(fullname)+"\nPhone No: "+decodeURI(phoneno)+"\nStatus: "+decodeURI(status)+"\n\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/users/delete", 
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
        //this.setState({ loading: true });
        //console.log("addNewRecord");
        setTimeout(() => {
            $("#usertypes").select2();
            
            $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked'});
            $(".switch-checkboxes").bootstrapSwitch('state', false);
            $("#username").focus();
        }, 1000);
        //this.setState({newRecord: true});
        //data-target="#manageUser"
        $("#manageUser").css("display", "block");
        $("#formHeader").html("<strong>Add New User</strong> ");
        $("#saveButton").html("<i class='fa fa-save' /> Save ");
        $("#resetButton").css("display", "none");
        
        this.setState({ userData: [] });
        $("#email_").val("");
        $("#username").val("");
        $("#username").attr("disabled", false);
        $("#username").prop("readonly", false);
        $("#firstname").val("");
        $("#lastname").val("");
        $("#othernames").val("");
        $("#phoneno").val("");
        $("#usertypes").val("").trigger('change');
        $('#userdp_').attr('src', './images/default_avatar.jpg');
            
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
        
        //$("#data-list").css({ backgroundColor : "rgba(0,0,0,0.5)"});
        //this.setState({ loading: false });
        //this.reloadUser();
        //console.log("Add New User");
    }

    render() {
        const mystyle = {
            margin:"4px, 4px",
            padding:"4px",
            overflowX: "hidden", 
            overflowY: "auto",
            textAlign:"justify",
            maxWidth: "1500px"
        };
        
        return (
            <div className={this.state.mainContainerClass}>
                <div className="col-md-12 animated rotateIn faster" id="data-area">
                    <div className=" border-3-top flatpanel">
                        <div style={{maxHeight: "800px", maxWidth: "1500px"}} className="panel panel-primary animated rotateIn faster"> 
                            <div id="data-list">
                                <div className="panel-heading">
                                    <div className="panel-title">
                                        <h5 style={{ marginTop: "30px" }}><strong>Manage Users</strong></h5>
                                        <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                            className="btn btn-primary btn-sm clickable" onClick={this.addNewRecord} data-toggle="modal">
                                            <i className="fa fa-plus"></i> Add a New User</button>
                                    </div>
                                </div>
                                <div className="panel-body col-md-12" style={mystyle}>
                                    <br/>
                                    <table className="table table-striped table-clean table-hover transactions-table" id="myTable"></table>
                                    <div id="loadingLabel"></div>
                                </div>
                            </div>
                            <div className="panel panel-body border-3-top animated rotateIn faster" data-keyboard="false" data-backdrop="static" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "200px", display: "none"}} id="manageUser">
                                <div className="modal-dialog">
                                    <div className="modal-content" style={{width: "1000px"}}>
                                        <div className="modal-header modal-header-primary">
                                            <div className="panel-title">
                                                <div id="formHeader"></div>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            <form id="frmNewAccountAdd">
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group has-feedback" style={{ "borderRight": "1px solid #eee" }}>
                                                        <div className="user-info text-center">
                                                            <img id="userdp_" style={{ "width": "150px", cursor: "pointer" }} 
                                                                src={this.state.userData.userImage} 
                                                                alt={this.state.userData.lastName} 
                                                                className="img-circle profile-img"
                                                                onClick={this.triggerFileInput} />
                                                            <h3 className="title">{this.state.userData.lastName} {this.state.userData.firstName}</h3>
                                                            <small className="info">{this.state.userData.email}</small>
                                                            <input id="the-file-input" type="file" accept="image/*" onChange={this.imageChanged}
                                                                style={{ width: "0px", height: "0px", visibility: "hidden" }} ref={(ref) => this.fileUploaded = ref} />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <div className="form-group">
                                                            Status:&nbsp;<input id="status" ref="status" type="checkbox" className="switch-checkboxes" />
                                                        </div>
                                                    </div>
                                                    {this.state.loading ?
                                                        <Spinner size="1rem" /> 
                                                        :
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <button id="resetButton" onClick={this.resetPassword} type="button" className="btn bg-primary btn-wide" ></button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="col-sm-12 col-md-6">
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label>Username</label>
                                                        <input type="text" className="form-control"  defaultValue={this.state.userData.userName} id="username" ref="username" required />
                                                        <input type="hidden" className="form-control" defaultValue={this.state.userData.id} id="id_" ref="id" />
                                                        <input type="hidden" className="form-control" defaultValue={this.state.userData.organizationId} ref="organizationId" />
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label>email</label>
                                                        <input defaultValue={this.state.userData.email} type="text" className="form-control" id="email_" ref="email" required />
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label>Firstname</label>
                                                        <input defaultValue={this.state.userData.firstName} type="text" className="form-control" id="firstname" ref="firstname" required />
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label>Lastname</label>
                                                        <input defaultValue={this.state.userData.lastName} type="text" className="form-control" id="lastname" ref="lastname" required />
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label>Other Names</label>
                                                        <input defaultValue={this.state.userData.otherNames} type="tel" className="form-control" id="othernames" ref="othernames" required />
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label>Phone Number</label>
                                                        <input defaultValue={this.state.userData.phoneNo} type="tel" className="form-control" id="phoneno" ref="phoneno" required />
                                                    </div>
                                                    <div className="col-sm-12 form-group has-feedback">
                                                        <label>User Type</label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="usertypes" ref="usertypes"  multiple="multiple">
                                                            {
                                                                [].concat(this.state.roleData)
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} className="clickable" value={item.id}>{item.typeDescription}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-12 form-group">
                                                        {this.state.updating ?
                                                            <Spinner size="1rem" /> :
                                                            <div className="col-sm-12 form-group">
                                                                <div className="col-sm-4" style={{display: "inline", marginLeft: "-30px"}}>
                                                                    <button onClick={this.cancelRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel </button>
                                                                </div>
                                                                <div className="col-sm-4" style={{display: "inline"}}>
                                                                    <button id="saveButton" onClick={this.saveRecord} type="button" className="btn bg-primary btn-wide" ></button>
                                                                </div>                

                                                            </div>
                                                        }
                                                    </div>
                                                    <br style={{ "clear": "both" }} />
                                                </div>
                                                <br style={{ "clear": "both" }} />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel panel-primary modal vert-center fade animated rotateIn faster" id="ImageArea" tabIndex="-1" role="dialog" aria-labelledby="modal6Label" style={{ display: 'none', height: "750px" }}>
                    <div className="modal-dialog  modal-md" role="document">
                        <div className="modal-content">
                            <div className="modal-header" style={{borderBottom: "0"}}>
                                <h5 className="bold modal-title" id="modal6Label"> 
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">X</span></button>
                                </h5>
                            </div>
                            <div className="modal-body">
                                <div className="panel">
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5>Crop the selected picture</h5>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div id="PreviewImage" style={{ width: '100%', maxWidth: '100%' }} />
                                        <hr />
                                        <div className="row" id="user-results">
                                            <div className="col-sm-12">
                                                <div className="widget-11-table auto-overflow" style={{ height: 'auto', textAlign: "center" }}>
                                                {
                                                    this.state.updating?<Spinner size="1.5rem"/>:
                                                    <div className="col-sm-12">
                                                        <div className="col-sm-6">
                                                            <button type="button" className="btn btn-lg btn-info btn-wide btn-rounded" data-dismiss="modal" aria-label="Close" onClick={this.cancelRecord}><i className="fa fa-times" />Cancel</button>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <button type="button" className="btn btn-lg btn-info btn-wide btn-rounded" onClick={this.saveNewImage} style={{ margin: '0 auto', display: 'block' }}><i className="fa fa-save" />Save Image</button>
                                                        </div>
                                                    </div>
                                                }
                                                </div>
                                            </div>
                                        </div>
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























