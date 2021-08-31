
class ClassesSections extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            organizationId: "",
            description: "",
            classes: "",
            section: "",
            usersData: [], classSectionsData: [], classData: [], sectionsData: [], updating: false, loading: false, updateView: false, newRecord: false
        };

        //this.showClassSectionUpdate = this.showClassSectionUpdate.bind(this);
        //this.startClassSectionDelete = this.startClassSectionDelete.bind(this);
        this.cancelClassSectionRecord = this.cancelClassSectionRecord.bind(this);
        this.addNewClassSectionRecord = this.addNewClassSectionRecord.bind(this);
        this.updateClassSectionRecord = this.updateClassSectionRecord.bind(this);
        this.saveClassSectionRecord=this.saveClassSectionRecord.bind(this);
        
        this.loadUsersData=this.loadUsersData.bind(this);
        
        this.manageClassRecord=this.manageClassRecord.bind(this);
        this.loadClassData=this.loadClassData.bind(this);
        this.cancelClassRecord = this.cancelClassRecord.bind(this);
        this.startClassDelete = this.startClassDelete.bind(this);
        this.saveClassRecord=this.saveClassRecord.bind(this);
        
        this.manageSectionRecord=this.manageSectionRecord.bind(this);
        this.loadSectionData=this.loadSectionData.bind(this);
        this.cancelSectionRecord = this.cancelSectionRecord.bind(this);
        this.startSectionDelete = this.startSectionDelete.bind(this);
        this.saveSectionRecord=this.saveSectionRecord.bind(this);
        
        this.populateDataTable = this.populateDataTable.bind(this);     
    }

    componentDidMount(){
        window.editFormClassSection = this.editFormClassSection;
        window.deleteFormClassSection = this.deleteFormClassSection;
        window.populateDataTable = this.populateDataTable;
        sessionStorage.setItem("class_id", 0);
        sessionStorage.setItem("section_id", 0);
        
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">Class & Section Setup</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
        //sessionStorage.getItem("orgname");
        
        this.loadUsersData();
        this.loadClassData();
        this.loadSectionData();
        this.populateDataTable();
    }
    
    async editFormClassSection(id_update){
        if ($("#updateClassSection").css("display") === 'block') {
            $("#updateClassSection").css("display", "none");
        } else {
            $("#updateClassSection").css("display", "block");
        }
        //$("#sections_update").html('<i className="fa fa-save" id="sections_update" />Update ');
        
        //var _this = this;
        await APICall("/classection/selectone", {id: id_update}, "POST")
        .then(data => {
            //console.log(JSON.stringify(data));
            if (data.status === 200) {
                $("#class_update").val(data.result.classId);
                $("#class_update").trigger('change');
                $("#id_update").val(data.result.id);
                $("#organizationId_update").val(data.result.organizationId);
                $("#section_update").val(data.result.sectionId);
                $("#section_update").trigger('change');
                
                $("#user_update").select2();
                var object = eval('[' + data.result.teachersId + ']');
                $('#user_update').val(object).trigger('change');
                //$("#user_update").val(data.result.teachersId);
                //$("#user_update").trigger('change');  
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
    
    deleteFormClassSection(itemId, description, section){
        //this.startClassSectionDelete(parseInt(id), description, section);
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\nClass: "+decodeURI(description)+"\nSectionn: "+decodeURI(section)+"\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/classection/delete", 
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
                    //this.setState({ loading: false });
                });
            }
        });
        
    };

    async populateDataTable() {
        const response = await APICall("/classection/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST");
        $('#loadingLabel').hide();
        if(this.state.dataTableObj){
            this.state.dataTableObj.destroy();
        }
        //console.log("JSON.stringify(response)");
        //console.log(JSON.stringify(response));
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
                { "data": "classDescription" ,
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
                { "data": "sectionDescription"},
                { "data": "userName" ,
                    render: function(data, type, row){
                        if(data !== null && data.includes(",")) data = data.replace(/,/g,'<br>');
                        
                        if(type === "sort" || type === "type"){
                            return data;
                        }
                        if(!data || data.trim() === ""){
                            return '<a style="color: #2CACDE; "><strong>NO NUMBER ALLOCATED</strong></a>';    
                        }
                        return '<a style="color: #2CACDE; "><strong>'+data+'</strong></a>';
                    }
                },
                { "data": "id",
                    render:function(data, type, row, meta){
                        if (type === "display") {
                            var edit_button = "<button type='button' class='to-update-top-menu btn btn-lg btn-info' data-toggle='modal' onclick='window.editFormClassSection(" + row.id + ")'><i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i>&nbsp;Edit</button>";
                            var delete_button = "<button type='button' class='to-delete-top-menu btn btn-danger btn-lg' onclick=window.deleteFormClassSection('" + row.id + "','" + encodeURI(row.classDescription) + "','" + encodeURI(row.sectionDescription) + "')><i class='fa fa-trash text-danger' style='cursor: pointer; color: white;' title='Delete'></i>&nbsp;Delete</button>";
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
                { "title": "Class", "targets": 1 },
                { "title": "Section", "targets": 2 },
                { "title": "Teachers", "targets": 3 },
                { "title": "Actions", "targets": 4 }
            ]
        });
        this.setState({ dataTableObj: obj });
    };

    cancelClassSectionRecord() {
        //this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        //this.setState({ updating: false });
        //this.setState({ updateView: false });
        //this.setState({ newRecord: false });
        this.populateDataTable();
        document.getElementById("addClassSection").style.display = 'none';
        document.getElementById("updateClassSection").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
    }

    async saveClassSectionRecord() {
        //this.setState({ newRecord: true });
        if(!$("#user_add").val()){
            $("#user_add").val("0");
            $("#user_add").trigger('change'); 
        }
        await APICall("/classection/save", 
        {
            classId: this.refs.class_add.value,
            sectionId: this.refs.section_add.value,
            teachersId: $("#user_add").val().toString(),
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
                document.getElementById("addClassSection").style.display = 'none';
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
                this.refs.class_add.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        
    }

    async updateClassSectionRecord() {
        //this.setState({ updating: true });
         if(!$("#user_update").val()){
            $("#user_update").val("0");
            $("#user_update").trigger('change'); 
        }
        await APICall("/classection/update", 
        {
            id: this.refs.id_update.value,
            classId: this.refs.class_update.value,
            sectionId: this.refs.section_update.value,
            teachersId: $("#user_update").val().toString(),
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
                document.getElementById("updateClassSection").style.display = 'none';
                $("#data-list").css({ pointerEvents : "auto"});
                $("#data-list").css({ top : "0"});
                $("#data-list").css({ left : "0"});
                $("#data-list").css({ zIndex : "10"});
                $("#data-list").css({ opacity : "1.0"});
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ updateView: true });
                this.refs.class_update.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        
    }
    
    addNewClassSectionRecord() {
        //this.setState({newRecord: true});
        $("#class_add").val(0);
        $("#class_add").trigger('change');  
        $("#section_add").val(0);
        $("#section_add").trigger('change');  
        $("#user_add").val("");
        $("#user_add").trigger('change');  
        $("#id_add").val(0);
        $("#organizationId_add").val(sessionStorage.getItem("orgid"));
        var state = document.getElementById("addClassSection").style.display;
        if (state === 'block') {
            document.getElementById("addClassSection").style.display = 'none';
        } else {
            document.getElementById("addClassSection").style.display = 'block';
        }
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
    }

    async loadUsersData(){
        //this.setState({ loading: true });
        await APICall("/users/selectbyorgid", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({ usersData: data.result, loading: false });
                $("#user_add").val("");
                $("#user_add").trigger('change');
                $("#user_update").val("");
                $("#user_update").trigger('change');
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        
        setTimeout(() => {
            $('#user_add').select2();
            $("#user_add").change(function(){
                if($("#user_add").val() !== null){
                    var selected_id = $("#user_add").val().toString();
                    sessionStorage.setItem("user_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#user_add").find("option:selected").data("url");
                $("#url_add").val(url);
            });

            $('#user_update').select2();
            $("#user_update").change(function(){
                if($("#user_update").val() !== null){
                    var selected_id = $("#user_update").val().toString();
                    sessionStorage.setItem("user_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#user_update").find("option:selected").data("url");
                $("#url_update").val(url);
            });

        }, 1000);
        
    }
    
    async loadClassData(){
        //this.setState({ loading: true });
        await APICall("/classection/class/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            if (data.status === 200) {
                //console.log("loadClassData   "+JSON.stringify(data.result));
                this.setState({ classData: data.result, loading: false });
                $("#class_add").val('0');
                $("#class_add").trigger('change');
                $("#class_update").val('0');
                $("#class_update").trigger('change');
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        
        setTimeout(() => {
            $('#class_add').select2();
            $("#class_add").change(function(){
                if($("#class_add").val() !== null){
                    var selected_id = $("#class_add").val().toString();
                    sessionStorage.setItem("class_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#class_add").find("option:selected").data("url");
                $("#url_add").val(url);
            });

            $('#class_update').select2();
            $("#class_update").change(function(){
                if($("#class_update").val() !== null){
                    var selected_id = $("#class_update").val().toString();
                    sessionStorage.setItem("class_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#class_update").find("option:selected").data("url");
                $("#url_update").val(url);
            });

        }, 1000);
        
    }
    
    manageClassRecord() {
        //this.setState({newRecord: true});
        var state = document.getElementById("manageClasss").style.display;
        if (state === 'block') {
            document.getElementById("manageClasss").style.display = 'none';
        } else {
            document.getElementById("manageClasss").style.display = 'block';
        }
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
        this.loadClassData();
        $("#class_description").focus();
        $("#class_description").val("");
    }

    showClassUpdate(id, classs) {
        sessionStorage.setItem("class_id", id);
        $("#classes_update").html("<i class='fa fa-check'/>Update ");
        $("#class_description").val(decodeURI(classs));
        $("#class_description").focus();
    }

    cancelClassRecord() {
        MessageAlert("info", "Manage Class canceled successfully");
        //this.populateDataTable();
        document.getElementById("manageClasss").style.display = 'none';
        $("#classes_update").html("<i class='fa fa-check'/>Save ");
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
        
    }
    
    async saveClassRecord(){
        var url = "/classection/class/save";
        var class_id = null;
        var method = "POST";
        if(sessionStorage.getItem("class_id") > 0){
            url = "/classection/class/update";
            class_id = sessionStorage.getItem("class_id");
            sessionStorage.setItem("class_id", 0);
            method = "PUT";
        }
        //console.log("url:::   "+url);
        await APICall(url, 
        {
            id: class_id,
            classDescription: $("#class_description").val(),
            status: 'A',
            organizationId: sessionStorage.getItem("orgid"),
            createdBy: sessionStorage.getItem("userid")
        }, method).then(data => {
            if (data.status === 200) {
                //this.setState({ topMenuData: data.result, loading: false, updating: true });
                if(method==="PUT"){
                    MessageAlert("success", "Record updated successfully");
                }else{
                    MessageAlert("success", "Record saved successfully");
                }
                //this.setState({ updating: false });
                //this.setState({ updateViTRew: false });
                //this.setState({ newRecord: false });
                this.loadClassData();
                $("#class_description").focus();
                $("#class_description").val("");
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ newRecord: true });
                $("#class_description").focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        $("#classes_update").html("<i class='fa fa-check'/>Save ");
        
    }
    
    startClassDelete(id, classs) {
        console.log("id::: "+id);
        console.log("classs::: "+classs);
        console.log("organizationId::: "+sessionStorage.getItem("orgid"));
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\nClass: "+decodeURI(classs)+"\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/classection/class/delete", 
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
                        this.loadClassData();
                        $("#class_description").focus();
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

    async loadSectionData(){
        //this.setState({ loading: true });
        await APICall("/classection/section/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            if (data.status === 200) {
                //console.log("loadSectionData   "+JSON.stringify(data.result));
                this.setState({ sectionsData: data.result, loading: false });
                $("#section_add").val('0');
                $("#section_add").trigger('change');
                $("#section_update").val('0');
                $("#section_update").trigger('change');
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ loading: false });
        });
        
        setTimeout(() => {
            $('#section_add').select2();
            $("#section_add").change(function(){
                if($("#section_add").val() !== null){
                    var selected_id = $("#section_add").val().toString();
                    sessionStorage.setItem("section_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#section_add").find("option:selected").data("url");
                $("#url_add").val(url);
            });

            $('#section_update').select2();
            $("#section_update").change(function(){
                if($("#section_update").val() !== null){
                    var selected_id = $("#section_update").val().toString();
                    sessionStorage.setItem("section_selectedid", selected_id);
                    //_this.populateDataTable();
                }
                var url = $("#section_update").find("option:selected").data("url");
                $("#url_update").val(url);
            });

        }, 1000);
        
    }
    
    manageSectionRecord() {
        //this.setState({newRecord: true});
        var state = document.getElementById("manageSections").style.display;
        if (state === 'block') {
            document.getElementById("manageSections").style.display = 'none';
        } else {
            document.getElementById("manageSections").style.display = 'block';
        }
        $("#data-list").css({ pointerEvents : "none"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "0.5"});
        this.loadSectionData();
        $("#section_description").focus();
        $("#section_description").val("");
    }

    showSectionUpdate(id, section) {
        sessionStorage.setItem("section_id", id);
        $("#sections_update").html("<i class='fa fa-check'/>Update ");
        $("#section_description").val(decodeURI(section));
        $("#section_description").focus();
        
    }

    cancelSectionRecord() {
        MessageAlert("info", "Manage Section canceled successfully");
        //this.populateDataTable();
        document.getElementById("manageSections").style.display = 'none';
        $("#sections_update").html("<i class='fa fa-check'/>Save ");
        //$("data-area").style.display = "none";
        $("#data-list").css({ pointerEvents : "auto"});
        $("#data-list").css({ top : "0"});
        $("#data-list").css({ left : "0"});
        $("#data-list").css({ zIndex : "10"});
        $("#data-list").css({ opacity : "1.0"});
        
    }
    
    async saveSectionRecord(){
        var url = "/classection/section/save";
        var section_id = null;
        var method = "POST";
        if(sessionStorage.getItem("section_id") > 0){
            url = "/classection/section/update";
            section_id = sessionStorage.getItem("section_id");
            sessionStorage.setItem("section_id", 0);
            method = "PUT";
        }
        
        await APICall(url, 
        {
            id: section_id,
            sectionDescription: $("#section_description").val(),
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
                this.loadSectionData();
                $("#section_description").focus();
                $("#section_description").val("");
            }else{
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ newRecord: true });
                $("#section_description").focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            //this.setState({ loading: false });
        });
        $("#sections_update").html("<i class='fa fa-check'/>Save ");
        
    }
    
    startSectionDelete(id, section) {
        //console.log("itemId::: "+itemId);
        //console.log("organizationId::: "+sessionStorage.getItem("orgid"));
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\Section: "+decodeURI(section)+"\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/classection/section/delete", 
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
                        this.loadSectionData();
                        $("#section_description").focus();
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
                                    <h5 style={{ marginTop: "30px" }}><strong>Manage Classes & Sections</strong></h5>
                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                        className="btn btn-primary btn-sm clickable" onClick={this.manageClassRecord}>
                                        <i className="fa fa-plus"></i> Manage Classes</button>&nbsp;&nbsp;&nbsp;
                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                        className="btn btn-primary btn-sm clickable" onClick={this.manageSectionRecord}>
                                        <i className="fa fa-plus"></i> Manage Sections</button>&nbsp;&nbsp;&nbsp;
                                    <button style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "0px" }}
                                        className="btn btn-primary btn-sm clickable" onClick={this.addNewClassSectionRecord}>
                                        <i className="fa fa-plus"></i> Add Class/Section</button>
                                </div>
                            </div>
                            <div className="col-md-12"></div>
                            <div className="panel-body col-md-12" style={mystyle}>
                                <br/>
                                <table className="table table-striped table-clean table-hover transactions-table" id="myTable"></table>
                                <div id="loadingLabel"></div>
                            </div>
                        </div>
                    
                        <div className="panel panel-body animated rotateIn faster" data-keyboard="false" data-backdrop="static" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="addClassSection">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Add Class/Section</strong></h5>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-12 col-lg-6">
                                                    <div className="row">
                                                        <div className="col-md-12 col-sm-12 col-lg-12">
                                                            <div className="form-group">
                                                                <label>Class</label>
                                                                <select style={{ width: "200px"}} className="select2 js-states form-control custom_select" id="class_add" ref="class_add">
                                                                    <option value='0'>Select a class...</option>
                                                                    {
                                                                        [].concat(this.state.classData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.classDescription} className="clickable" value={item.id}>{item.classDescription}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-lg-12">
                                                            <div className="form-group">
                                                                <label>Section</label>
                                                                <select style={{ width: "200px"}} className="select2 js-states form-control custom_select" id="section_add" ref="section_add">
                                                                    <option value='0'>Select a section...</option>
                                                                    {
                                                                        [].concat(this.state.sectionsData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.sectionDescription} className="clickable" value={item.id}>{item.sectionDescription}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-lg-12">
                                                            <div className="form-group">
                                                                <label>Teachers</label>
                                                                <select style={{ width: "200px"}} className="select2 js-states form-control custom_select" id="user_add" ref="user_add" multiple>
                                                                    {
                                                                        [].concat(this.state.usersData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.userName} className="clickable" value={item.id}>{item.userName}</option>
                                                                        )
                                                                    }
                                                                </select>
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
                                                        <button onClick={this.cancelClassSectionRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                        <button onClick={this.saveClassSectionRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Save </button>
                                                    </div>
                                                }
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-body animated rotateIn faster" style={{position: "absolute", border: "none", backgroundColor: "transparent", marginTop: "-150px", marginBottom: "0px", marginLeft: "400px", display: "none"}} id="updateClassSection">
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
                                                                <label>Class</label>
                                                                <input type="hidden" className="form-control" id="id_update" ref="id_update" />
                                                                <input type="hidden" className="form-control" id="organizationId_update" ref="organizationId_update" />
                                                                <select style={{ width: "200px"}} className="select2 js-states form-control custom_select" id="class_update" ref="class_update">
                                                                    <option value='0'>Select a class...</option>
                                                                    {
                                                                        [].concat(this.state.classData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.classDescription} className="clickable" value={item.id}>{item.classDescription}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-lg-12">
                                                            <div className="form-group">
                                                                <label>Section</label>
                                                                <select style={{ width: "200px"}} className="select2 js-states form-control custom_select" id="section_update" ref="section_update">
                                                                    <option value='0'>Select a section...</option>
                                                                    {
                                                                        [].concat(this.state.sectionsData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.sectionDescription} className="clickable" value={item.id}>{item.sectionDescription}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 col-sm-12 col-lg-12">
                                                            <div className="form-group">
                                                                <label>Teachers</label>
                                                                <select style={{ width: "200px"}} className="select2 js-states form-control custom_select" id="user_update" ref="user_update" multiple>
                                                                    {
                                                                        [].concat(this.state.usersData)
                                                                        .sort((a, b) => a.id > b.id)
                                                                        .map((item, i) =>
                                                                            <option key={item.id} data-url={item.userName} className="clickable" value={item.id}>{item.userName}</option>
                                                                        )
                                                                    }
                                                                </select>
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
                                                        <button onClick={this.cancelClassSectionRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                        <button onClick={this.updateClassSectionRecord} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Update</button>
                                                    </div>
                                                }
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="panel panel-body animated rotateIn faster" style={divwrapper} id="manageClasss">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px" }}><strong>Manage Classes</strong></h5>
                                        </div>
                                    </div>
                                    <div className="panel-body" style={mystyle}>
                                        <form >
                                             <table id="classlist" className="table table-striped" style={{ fontSize: "90%"}}>
                                                <thead>
                                                <tr><th>S/No<br /><br /></th><th style={{ valign: "bottom"}}><input style={{ width: "100px"}} type="text" className="form-control" ref="class_description" id="class_description" placeholder="Class" /></th><th>Actions<br /><br /></th><th></th></tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        [].concat(this.state.classData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <tr style={{height: "30px"}} key={item.id}>
                                                                    <td style={{ align: "right" }}>&nbsp;&nbsp;{i+1}.</td>
                                                                    <td style={{ align: "right" }}>{item.classDescription}</td>
                                                                    <td><button style={{ width: "90px", height: "40px" }} type='button' className='to-update-user-type btn btn-lg btn-info' data-toggle='modal' onClick={() => this.showClassUpdate(item.id, encodeURI(item.classDescription))}><i className='fa fa-pencil text-info' style={{cursor: 'pointer'}} title='Edit'></i>&nbsp;Edit</button></td>
                                                                    <td><button style={{ width: "110px", height: "40px" }} type='button' className='to-delete-user-type btn btn-danger btn-lg' onClick={() => this.startClassDelete(item.id, encodeURI(item.classDescription))}><i className='fa fa-trash text-danger' style={{cursor: 'pointer', color: 'white'}}  title='Delete'></i>&nbsp;Delete</button></td>
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
                                                        <button onClick={this.cancelClassRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                        <button onClick={this.saveClassRecord} type="button" className="btn bg-primary btn-wide" id="classes_update"><i className="fa fa-check" id="sections_update" />Save </button>
                                                    </div>
                                                }
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="panel panel-body animated rotateIn faster" style={divwrapper} id="manageSections">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header modal-header-primary">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px" }}><strong>Manage Sections</strong></h5>
                                        </div>
                                    </div>
                                    <div className="panel-body" style={mystyle}>
                                        <form >
                                             <table id="sectionlist" className="table table-striped" style={{ fontSize: "90%"}}>
                                                <thead>
                                                <tr><th>S/No<br /><br /></th><th style={{ valign: "bottom"}}><input style={{ width: "100px"}} type="text" className="form-control" ref="section_description" id="section_description" placeholder="Section" /></th><th>Actions<br /><br /></th><th></th></tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        [].concat(this.state.sectionsData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <tr style={{ height: "3px"}} key={item.id}>
                                                                <td style={{ align: "right" }}>&nbsp;&nbsp;{i+1}.</td>
                                                                <td style={{ align: "right" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.sectionDescription}</td>
                                                                    <td><button style={{ width: "90px", height: "40px" }} type='button' className='to-update-user-type btn btn-lg btn-info' data-toggle='modal' onClick={() => this.showSectionUpdate(item.id, encodeURI(item.sectionDescription))}><i className='fa fa-pencil text-info' style={{cursor: 'pointer'}} title='Edit'></i>&nbsp;Edit</button></td>
                                                                    <td><button style={{ width: "110px", height: "40px" }} type='button' className='to-delete-user-type btn btn-danger btn-lg' onClick={() => this.startSectionDelete(item.id, encodeURI(item.sectionDescription))}><i className='fa fa-trash text-danger' style={{cursor: 'pointer', color: 'white'}}  title='Delete'></i>&nbsp;Delete</button></td>
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
                                                        <button onClick={this.cancelSectionRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                        <button onClick={this.saveSectionRecord} type="button" className="btn bg-primary btn-wide" id="sections_update"><i className="fa fa-check" id="sections_update" />Save </button>
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