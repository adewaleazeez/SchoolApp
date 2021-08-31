class SessionTerm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sessionsData: [], sessionTermData: [], termsData: [] //, updating: false, loading: false, updateView: false, newRecord: false
        };

        this.cancelSessionTermRecord = this.cancelSessionTermRecord.bind(this);
        this.addNewSessionTermRecord = this.addNewSessionTermRecord.bind(this);
        this.updateSessionTermRecord = this.updateSessionTermRecord.bind(this);
        this.saveSessionTermRecord=this.saveSessionTermRecord.bind(this);
        
        this.manageSessionRecord=this.manageSessionRecord.bind(this);
        this.loadSessionData=this.loadSessionData.bind(this);
        this.cancelSessionRecord = this.cancelSessionRecord.bind(this);
        this.startSessionDelete = this.startSessionDelete.bind(this);
        this.saveSessionRecord=this.saveSessionRecord.bind(this);
        
        this.manageTermRecord=this.manageTermRecord.bind(this);
        this.loadTermData=this.loadTermData.bind(this);
        this.cancelTermRecord = this.cancelTermRecord.bind(this);
        this.startTermDelete = this.startTermDelete.bind(this);
        this.saveTermRecord=this.saveTermRecord.bind(this);
        
        this.switchCheckBox = this.switchCheckBox.bind(this);
        this.populateDataTable = this.populateDataTable.bind(this);     
    }

    async editFormSessionTerm(id_update){
        //$("#terms_update").html("<i class='fa fa-check'/>Update ");
        //console.log($("#terms_update").html());
        if ($("#updateSessionTerm").css("display") === 'block') {
            $("#updateSessionTerm").css("display", "none");
        } else {
            $("#updateSessionTerm").css("display", "block");
        }
        $("#session_update").val('0');
        $("#session_update").trigger('change');

        $('.update-switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked'});
        $(".update-switch-checkboxes").bootstrapSwitch('state', true);

        await APICall("/sessionterm/selectone", {id: id_update}, "POST")
        .then(data => {
            //console.log(JSON.stringify(data));
            if (data.status === 200) {
                setTimeout(() => {
                    $("#id_update").val(data.result.id);
                    $("#session_update").val(data.result.sessionId);
                    $("#session_update").trigger('change');
                    $("#term_update").val(data.result.termId);
                    $("#term_update").trigger('change');
                    $("#start_date_update").val(data.result.termStartDate.substr(0,10));
                    $("#end_date_update").val(data.result.termEndDate.substr(0,10));
                    if(data.result.currentPeriod){
                        $(".update-switch-checkboxes").bootstrapSwitch('state', true);
                    }else{
                        $(".update-switch-checkboxes").bootstrapSwitch('state', false);
                    }
                }, 1000);
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
    
    deleteFormSessionTerm(itemId, session, term, startdate, enddate){
        //this.startSessionTermDelete(parseInt(id), description, term);
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\nSession: "+decodeURI(session)+"\nTerm: "+decodeURI(term)+"\nStart Date: "+decodeURI(startdate)+"\nEnd Date: "+decodeURI(enddate)+"\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/sessionterm/delete", 
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
                        window.populateDataTable();
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
        
    };

    componentDidMount(){
        window.editFormSessionTerm = this.editFormSessionTerm;
        window.deleteFormSessionTerm = this.deleteFormSessionTerm;
        window.populateDataTable = this.populateDataTable;
        sessionStorage.setItem("term_id", 0);
        
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i className="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">Session & Term Setup</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
        
        this.loadSessionData();
        this.loadTermData();
        this.populateDataTable();
    }
    
    async switchCheckBox(itemId, status){
        await APICall("/sessionterm/switch-checkbox", {id: itemId, currentPeriod: status, organizationId: sessionStorage.getItem("orgid")}, "PUT")
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
    
    async populateDataTable() {
        const response = await APICall("/sessionterm/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST");
        //console.log("response:::   "+JSON.stringify(response));
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
                { "data": "sessionDescription" ,
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
                { "data": "termDescription"},
                { "data": "termStartDate",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            return row.termStartDate.substr(8, 2) + "/" +row.termStartDate.substr(5, 2) + "/" +row.termStartDate.substr(0, 4);
                        }
                    }
                },
                { "data": "termEndDate",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            return row.termEndDate.substr(8, 2) + "/" +row.termEndDate.substr(5, 2) + "/" +row.termEndDate.substr(0, 4);
                        }
                    }
                },
                { "data": "currentPeriod",
                    render: function(data, type, row, meta) {
                        if (type === "display") {
                            var status = "";
                            if (data === true) {
                                status += "<input id='" + row.id + "' type='checkbox' class='switch-checkboxes' checked data-id='" + row.id + "' data-status='" + row.currentPeriod + "' />";
                            } else {
                                status += "<input id='" + row.id + "' type='checkbox' class='switch-checkboxes' data-id='" + row.id + "' data-status='" + row.currentPeriod + "' />";
                            }
                            return status ;
                        }
                    }
                },
                { "data": "id",
                    render:function(data, type, row, meta){
                        if (type === "display") {
                            var start = row.termStartDate.substr(8, 2) + "/" +row.termStartDate.substr(5, 2) + "/" +row.termStartDate.substr(0, 4);
                            var end = row.termEndDate.substr(8, 2) + "/" +row.termEndDate.substr(5, 2) + "/" +row.termEndDate.substr(0, 4);
                            var edit_button = "<button type='button' class='to-update-top-menu btn btn-lg btn-info' data-toggle='modal' onclick='window.editFormSessionTerm(" + row.id + ")'><i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i>&nbsp;Edit</button>"; 
                            var delete_button = "<button type='button' class='to-delete-top-menu btn btn-danger btn-lg' onclick=window.deleteFormSessionTerm('" + row.id + "','" + encodeURI(row.sessionDescription) + "','" + encodeURI(row.termDescription) + "','" + encodeURI(start) + "','" + encodeURI(end) + "')><i class='fa fa-trash text-danger' style='cursor: pointer; color: white;' title='Delete'></i>&nbsp;Delete</button>";
                            return "<table style='margin-top: -5px; margin-bottom: -5px'><tr><td width='10px'>"+edit_button + "</td><td>" + delete_button + '</td></tr></table>';
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
                { "title": "Session", "targets": 1 },
                { "title": "Term", "targets": 2 },
                { "title": "Start Date", "targets": 3 },
                { "title": "End Date", "targets": 4 },
                { "title": "Active Term", "targets": 5 },
                { "title": "Actions", "targets": 6 }
            ]
        });
        this.setState({ dataTableObj: obj });
        var _this = this;
        $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Closed', onSwitchChange: function(event, state){
                //console.log("event  "+event);
                //console.log("state  "+state);
                var id = $(this).attr('data-id');
                var status = $(this).attr('data-status');
                var status = null;
                if(state){
                    status = 1;
                }else{
                    status = 0;
                }
                _this.switchCheckBox(parseInt(id), status); 
            }
        });
    };

    cancelSessionTermRecord() {
        //this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        //this.setState({ updating: false });
        //this.setState({ updateView: false });
        //this.setState({ newRecord: false });
        this.populateDataTable();
        document.getElementById("addSessionTerm").style.display = 'none';
        document.getElementById("updateSessionTerm").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }

    async saveSessionTermRecord() {
        //this.setState({ newRecord: true });
        await APICall("/sessionterm/save", 
        {
            sessionId: parseInt(this.refs.session_add.value),
            termId: parseInt(this.refs.term_add.value),
            termStartDate: $("#start_date_add").val(),
            termEndDate: $("#end_date_add").val(),
            currentPeriod: ($(".add-switch-checkboxes").bootstrapSwitch('state')) ? 1 : 0,
            organizationId: sessionStorage.getItem("orgid"),
            status: 'A',
            createdBy: sessionStorage.getItem("userid")
        }, 
        "POST").then(data => {
            if (data.status === 200) {
                //this.setState({ sessionTermData: data.result, loading: false, updating: true });
                MessageAlert("success", "Record updated successfully");
                //this.setState({ updating: false });
                //this.setState({ updateView: false });
                //this.setState({ newRecord: false });
                this.populateDataTable();
                document.getElementById("addSessionTerm").style.display = 'none';
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
                this.refs.session_add.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
    }

    async updateSessionTermRecord() {
        //this.setState({ updating: true });
        await APICall("/sessionterm/update", 
        {
            id: parseInt(this.refs.id_update.value),
            sessionId: parseInt(this.refs.session_update.value),
            termId: parseInt(this.refs.term_update.value),
            termStartDate: $("#start_date_update").val(),
            termEndDate: $("#end_date_update").val(),
            organizationId: sessionStorage.getItem("orgid"),
            currentPeriod: ($(".update-switch-checkboxes").bootstrapSwitch('state')) ? 1 : 0
        }, 
        "PUT").then(data => {
            if (data.status === 200) {
                //, loading: false
                this.setState({ sessionTermData: data.result });//setTimeout(() => {}, 500);
                MessageAlert("success", "Record updated successfully");
                //this.setState({ updating: false });
                //this.setState({ updateView: false });
                this.populateDataTable();
                document.getElementById("updateSessionTerm").style.display = 'none';
                $("#data-list").css({ pointerEvents : "auto"});
                $("#data-list").css({ top : "0"});
                $("#data-list").css({ left : "0"});
                $("#data-list").css({ zIndex : "10"});
                $("#data-list").css({ opacity : "1.0"});
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ updateView: true });
                this.refs.session_update.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
    }
    
    addNewSessionTermRecord() {
        //this.setState({newRecord: true});
        $("#term_add").val(0);
        $("#term_add").trigger('change'); 
        $('.add-switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Closed'});
        $(".add-switch-checkboxes").bootstrapSwitch('state', true);
        $("#session_add").val(null);
        $("#id_add").val(null);
        $("#organizationId_add").val(null);
        $("#start_date_add").val("");
        $("#end_date_add").val("");
            
        var state = document.getElementById("addSessionTerm").style.display;
        if (state === 'block') {
            document.getElementById("addSessionTerm").style.display = 'none';
        } else {
            document.getElementById("addSessionTerm").style.display = 'block';
        }
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
    }

    async loadSessionData(){
        //this.setState({ loading: true });
        await APICall("/sessionterm/session/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            
            if (data.status === 200) {
                //console.log(JSON.stringify(data.result));
                this.setState({ sessionsData: data.result, loading: false });
                $("#session_add").val('0');
                $("#session_add").trigger('change');
                $("#session_update").val('0');
                $("#session_update").trigger('change');
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        
        setTimeout(() => {
            $('#session_add').select2();
            $("#session_add").change(function(){
                if($("#session_add").val() !== null){
                    var selected_id = $("#session_add").val().toString();
                    sessionStorage.setItem("session_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#session_add").find("option:selected").data("url");
                $("#url_add").val(url);
            });

            $('#session_update').select2();
            $("#session_update").change(function(){
                if($("#session_update").val() !== null){
                    var selected_id = $("#session_update").val().toString();
                    sessionStorage.setItem("session_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#session_update").find("option:selected").data("url");
                $("#url_update").val(url);
            });

        }, 1000);
        
    }
    
    manageSessionRecord() {
        //this.setState({newRecord: true});
        var state = document.getElementById("manageSessions").style.display;
        if (state === 'block') {
            document.getElementById("manageSessions").style.display = 'none';
        } else {
            document.getElementById("manageSessions").style.display = 'block';
        }
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
        this.loadSessionData();
        $("#session_description").focus();
        $("#session_description").val("");
    }

    showSessionUpdate(id, session) {
        sessionStorage.setItem("session_id", id);
        $("#sessions_update").html("<i class='fa fa-check'/>Update ");
        $("#session_description").val(decodeURI(session));
        $("#session_description").focus();
        
    }

    cancelSessionRecord() {
        MessageAlert("info", "Manage Session canceled successfully");
        //this.populateDataTable();
        document.getElementById("manageSessions").style.display = 'none';
        $("#sessions_update").html("<i class='fa fa-check'/>Save ");
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }
    
    async saveSessionRecord(){
        var url = "/sessionterm/session/save";
        var session_id = null;
        var method = "POST";
        if(sessionStorage.getItem("session_id") > 0){
            url = "/sessionterm/session/update";
            session_id = sessionStorage.getItem("session_id");
            sessionStorage.setItem("session_id", 0);
            method = "PUT";
        }
        
        await APICall(url, 
        {
            id: session_id,
            sessionDescription: $("#session_description").val(),
            status: 'A',
            organizationId: sessionStorage.getItem("orgid"),
            createdBy: sessionStorage.getItem("userid")
        }, method).then(data => {
            if (data.status === 200) {
                //this.setState({ topMenuData: data.result, loading: false, updating: true });
                MessageAlert("success", "Record updated successfully");
                //this.setState({ updating: false });
                //this.setState({ updateViTRew: false });
                //this.setState({ newRecord: false });
                this.loadSessionData();
                $("#session_description").focus();
                $("#session_description").val("");
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ newRecord: true });
                $("#session_description").focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        $("#sessions_update").html("<i class='fa fa-check'/>Save ");
    }
    
    startSessionDelete(id, session) {
        //console.log("itemId::: "+itemId);
        //console.log("organizationId::: "+sessionStorage.getItem("orgid"));
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\Session: "+decodeURI(session)+"\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/sessionterm/session/delete", 
                {
                    id: id,
                    organizationId: sessionStorage.getItem("orgid")
                }, 
                "DELETE").then(data => {
                    if (data.status === 200) {
                        //this.setState({ loading: false, updating: false });
                        MessageAlert("success", "Record deleted");
                        //this.ssessiontermState({ updating: false });
                        //this.setState({ updateView: false });
                        //this.setState({ newRecord: false });
                        this.loadSessionData();
                        $("#session_description").focus();
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

    async loadTermData(){
        //this.setState({ loading: true });
        await APICall("/sessionterm/term/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            //console.log("data::: "+JSON.stringify(data));
        
            if (data.status === 200) {
                //console.log(JSON.stringify(data.result));
                this.setState({ termsData: data.result, loading: false });
                $("#term_add").val('0');
                $("#term_add").trigger('change');
                $("#term_update").val('0');
                $("#term_update").trigger('change');
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        
        setTimeout(() => {
            $('#term_add').select2();
            $("#term_add").change(function(){
                if($("#term_add").val() !== null){
                    var selected_id = $("#term_add").val().toString();
                    sessionStorage.setItem("term_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#term_add").find("option:selected").data("url");
                $("#url_add").val(url);
            });

            $('#term_update').select2();
            $("#term_update").change(function(){
                if($("#term_update").val() !== null){
                    var selected_id = $("#term_update").val().toString();
                    sessionStorage.setItem("term_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#term_update").find("option:selected").data("url");
                $("#url_update").val(url);
            });

        }, 1000);
        
    }
    
    manageTermRecord() {
        //this.setState({newRecord: true});
        var state = document.getElementById("manageTerms").style.display;
        if (state === 'block') {
            document.getElementById("manageTerms").style.display = 'none';
        } else {
            document.getElementById("manageTerms").style.display = 'block';
        }
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
        this.loadTermData();
        $("#term_description").focus();
        $("#term_description").val("");
    }

    showTermUpdate(id, term) {
        sessionStorage.setItem("term_id", id);
        $("#terms_update").html("<i class='fa fa-check'/>Update ");
        $("#term_description").val(decodeURI(term));
        $("#term_description").focus();
        
    }

    cancelTermRecord() {
        MessageAlert("info", "Manage Term canceled successfully");
        //this.populateDataTable();
        document.getElementById("manageTerms").style.display = 'none';
        $("#terms_update").html("<i class='fa fa-check'/>Save ");
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }
    
    async saveTermRecord(){
        var url = "/sessionterm/term/save";
        var term_id = null;
        var method = "POST";
        if(sessionStorage.getItem("term_id") > 0){
            url = "/sessionterm/term/update";
            term_id = sessionStorage.getItem("term_id");
            sessionStorage.setItem("term_id", 0);
            method = "PUT";
        }
        
        await APICall(url, 
        {
            id: term_id,
            termDescription: $("#term_description").val(),
            status: 'A',
            organizationId: sessionStorage.getItem("orgid"),
            createdBy: sessionStorage.getItem("userid")
        }, method).then(data => {
            if (data.status === 200) {
                //this.setState({ topMenuData: data.result, loading: false, updating: true });
                MessageAlert("success", "Record updated successfully");
                //this.setState({ updating: false });
                //this.setState({ updateViTRew: false });
                //this.setState({ newRecord: false });
                this.loadTermData();
                $("#term_description").focus();
                $("#term_description").val("");
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ newRecord: true });
                $("#term_description").focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        $("#terms_update").html("<i class='fa fa-check'/>Save ");
    }
    
    startTermDelete(id, term) {
        //console.log("itemId::: "+itemId);
        //console.log("organizationId::: "+sessionStorage.getItem("orgid"));
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\Term: "+decodeURI(term)+"\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/sessionterm/term/delete", 
                {
                    id: id,
                    organizationId: sessionStorage.getItem("orgid")
                }, 
                "DELETE").then(data => {
                    if (data.status === 200) {
                        //this.setState({ loading: false, updating: false });
                        MessageAlert("success", "Record deleted");
                        //this.setState({ updating: false });
                        //this.setState({ updateView: false });
                        //this.setState({ newRecord: false });
                        this.loadTermData();
                        $("#term_description").focus();
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
                                    <h5 style={{ marginTop: "30px" }}><strong>Manage Sessions & Terms</strong></h5>
                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                        className="btn btn-primary btn-sm clickable" onClick={this.manageSessionRecord}>
                                        <i className="fa fa-plus"></i> Manage Sessions</button>&nbsp;&nbsp;&nbsp;
                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                        className="btn btn-primary btn-sm clickable" onClick={this.manageTermRecord}>
                                        <i className="fa fa-plus"></i> Manage Terms</button>&nbsp;&nbsp;&nbsp;
                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                        className="btn btn-primary btn-sm clickable" onClick={this.addNewSessionTermRecord}>
                                        <i className="fa fa-plus"></i> Add Session/Term</button>
                                </div>
                            </div>
                            <div className="col-md-12"></div>
                            <div className="panel-body col-md-12" style={mystyle}>
                                <br/>
                                <table className="table table-striped table-clean table-hover transactions-table" id="myTable"></table>
                                <div id="loadingLabel"></div>
                            </div>
                        </div>
                    
                        <div className="panel panel-body animated rotateIn faster" data-keyboard="false" data-backdrop="static" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="addSessionTerm">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Add  Session/Term</strong></h5>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-7 col-sm-12 col-lg-8">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Session</label>
                                                                <select style={{ width: "150px"}} className="select2 js-states form-control custom_select" id="session_add" ref="session_add">
                                                                    <option value='0'>Select a session...</option>
                                                                    {
                                                                        [].concat(this.state.sessionsData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.sessionDescription} className="clickable" value={item.id}>{item.sessionDescription}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Start Date</label>
                                                                <input type="date" id="start_date_add" ref="start_date_add" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>End Date</label>
                                                                <input type="date" id="end_date_add" ref="end_date_add" className="form-control" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-5 col-sm-12 col-lg-4">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Term</label>
                                                                <select style={{ width: "150px"}} className="select2 js-states form-control custom_select" id="term_add" ref="term_add">
                                                                    <option value='0'>Select a term...</option>
                                                                    {
                                                                        [].concat(this.state.termsData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.termDescription} className="clickable" value={item.id}>{item.termDescription}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Current Term</label>
                                                                <input id="status_add" ref="status_add" type="checkbox" className="add-switch-checkboxes" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="" >
                                                    <button onClick={this.cancelSessionTermRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel </button>
                                                    <button onClick={this.saveSessionTermRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Save </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-body animated rotateIn faster" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="updateSessionTerm">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Update Session/Term</strong></h5>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-7 col-sm-12 col-lg-8">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Session</label>
                                                                <select style={{ width: "150px"}} className="select2 js-states form-control custom_select" id="session_update" ref="session_update">
                                                                    <option value='0'>Select a session...</option>
                                                                    {
                                                                        [].concat(this.state.sessionsData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.sessionDescription} className="clickable" value={item.id}>{item.sessionDescription}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                                <input type="hidden" className="form-control" id="id_update" ref="id_update" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Start Date</label>
                                                                <input type="date" className="form-control" id="start_date_update" ref="start_date_update" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>End Date</label>
                                                                <input type="date" className="form-control" id="end_date_update" ref="end_date_update" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-5 col-sm-12 col-lg-4">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Term</label>
                                                                <select style={{ width: "150px"}} className="select2 js-states form-control custom_select" id="term_update" ref="term_update">
                                                                    <option value='0'>Select a term...</option>
                                                                    {
                                                                        [].concat(this.state.termsData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.termDescription} className="clickable" value={item.id}>{item.termDescription}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Current Term</label>
                                                                <input id="status_update" ref="status_update" type="checkbox" className="update-switch-checkboxes" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="" >
                                                    <button onClick={this.cancelSessionTermRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                    <button onClick={this.updateSessionTermRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Update</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="panel panel-body animated rotateIn faster" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="manageSessions">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px" }}><strong>Manage Sessions</strong></h5>
                                        </div>
                                    </div>
                                    <div className="panel-body" style={mystyle}>
                                        <form >
                                             <table id="sessionlist" className="table table-striped" style={{ fontSize: "90%"}}>
                                                <thead>
                                                <tr><th>S/No<br /><br /></th><th style={{ valign: "bottom"}}><input style={{ width: "100px"}} type="text" className="form-control" ref="session_description" id="session_description" placeholder="Session" /></th><th>Actions<br /><br /></th><th></th></tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        [].concat(this.state.sessionsData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <tr height='3px' key={item.id}>
                                                                <td style={{ align: "right" }}>&nbsp;&nbsp;{i+1}.</td>
                                                                <td style={{ align: "right" }}><b>{item.sessionDescription}</b></td>
                                                                    <td style={{ width: "30px" }}><button type='button' className='to-update-user-type btn btn-lg btn-info' data-toggle='modal' onClick={() => this.showSessionUpdate(item.id, encodeURI(item.sessionDescription))}><i className='fa fa-pencil text-info' style={{cursor: 'pointer'}} title='Edit'></i>&nbsp;Edit</button></td>
                                                                    <td style={{ width: "30px" }}><button type='button' className='to-delete-user-type btn btn-danger btn-lg' onClick={() => this.startSessionDelete(item.id, encodeURI(item.sessionDescription))}><i className='fa fa-trash text-danger' style={{cursor: 'pointer', color: 'white'}}  title='Delete'></i>&nbsp;Delete</button></td>
                                                                </tr>
                                                            )
                                                    }
                                                </tbody>
                                            </table>
                                            <div className="form-group">
                                                <hr />
                                                {this.state.updating ?
                                                    <Spinner size="1rem" /> :
                                                    <div className="" >
                                                        <button onClick={this.cancelSessionRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                        <button onClick={this.saveSessionRecord} type="button" className="btn bg-primary btn-wide" id="sessions_update" ><i className="fa fa-check"/>Save </button>
                                                    </div>
                                                }
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="panel panel-body animated rotateIn faster" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="manageTerms">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px" }}><strong>Manage Terms</strong></h5>
                                        </div>
                                    </div>
                                    <div className="panel-body" style={mystyle}>
                                        <form >
                                             <table id="termlist" className="table table-striped" style={{ fontSize: "90%"}}>
                                                <thead>
                                                <tr><th>S/No<br /><br /></th><th style={{ valign: "bottom"}}><input style={{ width: "100px"}} type="text" className="form-control" ref="term_description" id="term_description" placeholder="Term" /></th><th>Actions<br /><br /></th><th></th></tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        [].concat(this.state.termsData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <tr height='3px' key={item.id}>
                                                                <td style={{ align: "right" }}>&nbsp;&nbsp;{i+1}.</td>
                                                                <td style={{ align: "right" }}><b>{item.termDescription}</b></td>
                                                                    <td style={{ width: "30px" }}><button type='button' className='to-update-user-type btn btn-lg btn-info' data-toggle='modal' onClick={() => this.showTermUpdate(item.id, encodeURI(item.termDescription))}><i className='fa fa-pencil text-info' style={{cursor: 'pointer'}} title='Edit'></i>&nbsp;Edit</button></td>
                                                                    <td style={{ width: "30px" }}><button type='button' className='to-delete-user-type btn btn-danger btn-lg' onClick={() => this.startTermDelete(item.id, encodeURI(item.termDescription))}><i className='fa fa-trash text-danger' style={{cursor: 'pointer', color: 'white'}}  title='Delete'></i>&nbsp;Delete</button></td>
                                                                </tr>
                                                            )
                                                    }
                                                </tbody>
                                            </table>
                                            <div className="form-group">
                                                <hr />
                                                {this.state.updating ?
                                                    <Spinner size="1rem" /> :
                                                    <div className="" >
                                                        <button onClick={this.cancelTermRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                        <button onClick={this.saveTermRecord} type="button" className="btn bg-primary btn-wide" id="terms_update" ><i className="fa fa-check"/>Save </button>
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