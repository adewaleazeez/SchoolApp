class StudentRegistration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadPercentage: 0,
            avatar: '',
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
            sessionHeaderValue: "",
            organizationId: "",
            file: "",
            selectedFile: null,
            sessionData: [], termData: [], classData: [], sectionData: [], countryData: [], stateData: [], lgaData: [], studentData: [],
            updating: false, loading: false, updateView: false, newRecord: false, dataTableObj: undefined, user: {}, filePresent: false,
            sessionHeader: true, sessionBody: true, classHeader: true, classBody: true,
            workingImage: {}, mainContainerClass: 'col-md-12 col-lg-12 animated rotateIn faster', documentData: []
        };

        //this.reloadStudent = this.reloadStudent.bind(this);
        this.triggerFileInput = this.triggerFileInput.bind(this);
        this.saveNewImage = this.saveNewImage.bind(this);
        this.getImageData = this.getImageData.bind(this);
        this.imageChanged = this.imageChanged.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.initializeCropper = this.initializeCropper.bind(this);
        this.showManageStudentUpdate = this.showManageStudentUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
        this.switchCheckBox = this.switchCheckBox.bind(this);
        this.populateDataTable = this.populateDataTable.bind(this);
        this.editFormManageStudent = this.editFormManageStudent.bind(this);
        this.deleteFormManageStudent = this.deleteFormManageStudent.bind(this);
        this.loadSessionData = this.loadSessionData.bind(this);
        this.loadTermData = this.loadTermData.bind(this);
        this.loadClassData = this.loadClassData.bind(this);
        this.loadSectionData = this.loadSectionData.bind(this);
        this.loadCountryData = this.loadCountryData.bind(this);
        this.amountWords = this.amountWords.bind(this);
        this.loadDocumentsData = this.loadDocumentsData.bind(this);
        this.viewDoc = this.viewDoc.bind(this);
        this.saveDoc = this.saveDoc.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
//        this.uploadExcelFile = this.uploadExcelFile.bind(this);
        this.cancelFileUpload = this.cancelFileUpload.bind(this);
        this.onClickPostFileHandler = this.onClickPostFileHandler.bind(this);
//        this.onChangeFileHandler = this.onChangeFileHandler.bind(this);
    };
    
    componentDidMount() {
        const {avatar} = this.props;
        this.setState({ avatar });
        window.editFormManageStudent = this.editFormManageStudent;
        window.deleteFormManageStudent = this.deleteFormManageStudent;

        $("#infolist").accordion({
            collapsible: true,
            autoHeight: false,
            navigation: true,
            heightStyle: "content"
        });

        //this._isMounted = true;
        sessionStorage.setItem("selectedid", 0);
        $.fn.dataTable.ext.errMode = 'none';
        $('#breadcrumb').html(`<li><a href="#/"><i className="fa fa-home"></i> Home</a></li><li>Setup</li><li className="active">Manage Students</li>`);
        $('#rightlinks').html("<b>" + sessionStorage.getItem("orgname") + "</b>");

        var _this = this;
        setTimeout(() => {
            $('#studentSession_').select2();
            $("#studentSession_").val(sessionStorage.getItem("currentsession")).toString();
            $("#studentSession_").trigger('change');

            $('#studentTerm_').select2();
            $("#studentTerm_").val(sessionStorage.getItem("currentterm")).toString();
            $("#studentTerm_").trigger('change');

            $("#studentSession_").change(function () {
                if ($("#studentSession_").val() !== null) {
                    _this.populateDataTable();
                }
            });

            $("#studentTerm_").change(function () {
                if ($("#studentTerm_").val() !== null) {
                    _this.populateDataTable();
                }
            });

            $("#studentClass_").change(function () {
                if ($("#studentClass_").val() !== null) {
                    _this.populateDataTable();
                }
            });

            $("#studentSection_").change(function () {
                if ($("#studentSection_").val() !== null) {
                    _this.populateDataTable();
                }
            });

            $("#studentCountry_").change(function () {
                if ($("#studentCountry_").val() !== null) {
                    _this.populateDataTable();
                }
            });

            $("#studentState_").change(function () {
                if ($("#studentState_").val() !== null) {
                    _this.populateDataTable();
                }
            });

            $("#studentLga_").change(function () {
                if ($("#studentLga_").val() !== null) {
                    _this.populateDataTable();
                }
            });

            /*$("#birthPlace_").change(function(){
             if($("#birthPlace_").val() !== null){
             _this.populateDataTable();
             }
             });*/
            _this.populateDataTable();
        }, 500);

        this.loadSessionData();
        this.loadTermData();
        this.loadClassData();
        this.loadSectionData();
        this.loadCountryData();
    }

    editFormManageStudent(id_update) {
        setTimeout(() => {
            //$("#usertypes").select2("destroy");
            $("#usertypes").select2();
            $("#usertypes").val(parseInt(sessionStorage.getItem("selectedid")));
            $("#usertypes").trigger('change');

            $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked'});
            $(".switch-checkboxes").bootstrapSwitch('state', true);

        }, 500);

        if ($("#manageStudent").css("display") === 'block') {
            $("#manageStudent").css("display", "none");
        } else {
            //document.getElementById("manageStudent").style.display = 'block';
            $("#formHeader").html("<strong>Update Student</strong> ");
            $("#saveButton").html("<i class='fa fa-save' /> Update ");
            $("#manageStudent").css("display", "block");
            //$("#resetButton").html("<i class='fa fa-lock' /> Rest Password ");
            //$("#resetButton").css("display", "block");
        }
        sessionStorage.setItem("student_id", id_update);
        this.loadDocumentsData(parseInt(id_update));
        setTimeout(() => {
            this.showManageStudentUpdate(parseInt(id_update));
        }, 1000);

    };
    
    deleteFormManageStudent(id, userName, firstName, lastName, phoneNo, status) {
        this.startDelete(parseInt(id), userName, firstName, lastName, phoneNo, status);
    };
    
    async loadDocumentsData(id) {
        //this.setState({ loading: true });

        await APICall("/documents/selectallbystudent", {organizationId: sessionStorage.getItem("orgid"), studentId: id}, "POST")
        .then(data => {

            //console.log(JSON.stringify(data));
            if (data.status === 200) {
                data.result.push({"id": 0, "organizationId": 0, "studentId": 0, "documentName": "New Doc", "documentValue": "./images/default_logo.jpg", "createdBy": 0, "dateCreated": ""});
                data.result.sort((a, b) => a.id - b.id);
                this.setState({documentData: data.result}); //, loading: false
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
    }

    triggerFileInput(arg1, arg2, arg3) {
        if (arg3 !== 0) {
            return true;
        }
        sessionStorage.setItem("input_id", arg1);
        sessionStorage.setItem("img_src", arg2);
        $('#' + arg1).trigger('click');
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
            this.setState({filePresent: false});
        };
        reader.readAsDataURL(file);
    }

    initializeCropper() {
        var WorkingImage = $("#ImageToCrop");
        this.setState({workingImage: WorkingImage});

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

        this.setState({filePresent: true});

    }

    saveNewImage() {
        var ImageBase64 = this.getImageData();
        //this.updatePicture(ImageBase64);
        //$WorkingImage.cropper('destroy');
        var src_id = sessionStorage.getItem("img_src");
        //console.log("src_id   "+src_id);
        $('#' + src_id).attr('src', ImageBase64);
        HideModal("ImageArea");
        //$WorkingImage.cropper('destroy');
        //$('#ImageArea').modal('hide');
        if (src_id !== "userdp_") {
            this.saveDoc();
        }
    }

    async saveDoc() {
        await APICall("/documents/save",
                {
                    documentName: "",
                    studentId: sessionStorage.getItem("student_id"),
                    documentValue: $('#' + sessionStorage.getItem("img_src")).attr('src'), //this.getImageData().toString(),
                    organizationId: sessionStorage.getItem("orgid").toString(),
                    createdBy: sessionStorage.getItem("userid").toString()
                },
                "POST").then(data => {
            if (data.status === 200) {
                MessageAlert("success", "Document updated successfully");
                $('#' + sessionStorage.getItem("img_src")).attr('src', './images/default_logo.jpg');
                this.loadDocumentsData(sessionStorage.getItem("student_id").toString());
            } else {
                MessageAlert("error", data.message, "Error!!!");
            }
        }) // JSON-string from `response.json()` call
                .catch(error => {
                    console.error("error::: " + error);
                });
    }

    async updatePicture(Base64Image) {
        //this.setState({ updating: true });
        await APICall("updatedp", {Base64Image: Base64Image}, 'POST')
                .then(data => {
                    if (data.status === "success") {
                        //this.setState({ updating: false });
                        this.reloadStudent();
                        this.props.loadInit();
                        HideModal("ImageArea");
                    } else {
                        MessageAlert("error", data.data);
                    }
                }) // JSON-string from `response.json()` call
                .catch(error => {
                    //this.setState({ updating: false });
                    console.error(error);
                    MessageAlert("error", "An error occurred, reload page and retry", "Error");
                });
    }

    imageChanged(arg) {
        //var fileInput = this;

        $('#ImageArea').modal('show');
        setTimeout(() => {
            if (arg === "1") {
                //console.log("imageChanged 1  "+this.fileUploaded1.files[0]);
                this.renderImage(this.fileUploaded1.files[0]);
            }
            if (arg === "2") {
                //console.log("imageChanged 2  "+this.fileUploaded2.files[0]);
                this.renderImage(this.fileUploaded2.files[0]);
            }
        }, 1000);
    }

    async switchCheckBox(itemId, status) {
        await APICall("/menurole/swith-checkbox", {id: itemId, status: status}, "PUT")
                .then(data => {
                    if (data.status === 200) {
                        //this.setState({ classData: data.result, updateView: true, loading: false  });
                        //MessageAlert("success", "Status switched successfully");
                    } else {
                        MessageAlert("error", data.message, "Error!!!");
                    }
                })
                .catch(error => {
                    console.error(error);
                    //this.setState({ loading: false });
                });
    }

    uploadFile() {
        $("#uploadFile").css("display", "block");
        $("#data-list").css({pointerEvents: "none"});
        $("#data-list").css({top: "0"});
        $("#data-list").css({left: "0"});
        $("#data-list").css({zIndex: "10"});
        $("#data-list").css({opacity: "0.5"});
    }

    cancelFileUpload() {
        MessageAlert("info", "File upload canceled successfully");
        document.getElementById("uploadFile").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({pointerEvents: "auto"});
        $("#data-list").css({top: "0"});
        $("#data-list").css({left: "0"});
        $("#data-list").css({zIndex: "10"});
        $("#data-list").css({opacity: "1.0"});
    }

    async onClickPostFileHandler() {
        if(this.state.file.length === 0){
            MessageAlert("error", "No Excel file is selected, you must select an Excel file.....", "Alert!");
            return true;
        }
//    onClickPostFileHandler = (e) => {
//        e.preventDefault();
//        this.setState({
//            selectedFile: e.target.files[0]
//        });
        MessageAlert("success", "createdBy: "+sessionStorage.getItem("userid").toString(), "Alert!!!");
        const formData = new FormData();
        formData.append('fileUpload', this.state.file);
        formData.set("organizationId", sessionStorage.getItem("orgid"));
        formData.set("createdBy", sessionStorage.getItem("userid").toString());
        await fetch('http://localhost:9000/api/excel/uploadFile', {
            'method': 'POST',
            'body': formData,
            'headers': new Headers({
                'Accept': '*/*', //contentType,
                'Authorization': 'Bearer '+(sessionStorage.getItem("token")),
                'Content-Type': 'multipart/form-data',
                'Connection': 'keep-alive',
                'Accept-Encoding': 'gzip, deflate, br'
            }),
            'redirect': 'follow', // manual, *follow, error
            'referrer': 'no-referrer',
            'mode': 'cors', // no-cors, *cors, same-origin
            'cache': 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            'withCredentials': true,
            'credentials': 'include'
        }).then(res => {
            console.log("response "+res);
            if(res.ok){
                MessageAlert("success", "File uploaded successfully.", "Alert!!!");
            }
        }).catch(error => {
            console.error(error);
            MessageAlert("error", "Upload failed", "Alert!");
        });
    };
    
    onChangeFileHandler = (e) => {
        this.setState({file: e.target.files});
    }

//    onFileChangeHandler() {
//        if(this.state.file.length === 0){
//            MessageAlert("error", "No Excel file is selected, you must select an Excel file.....", "Alert!");
//            return true;
//        }
//        var reader = new FileReader();
//        var the_file = null;
//        
//
//        reader.onerror = (event) => {
//            console.log("onerror: "+event);
//            this.setState({filePresent: false});
//        };
//        reader.readAsDataURL(this.state.file);
//        reader.onload = (event) => {
//            //console.log("event: "+event);
//            the_file = event.target.result;
//            //console.log("the_file: "+the_file);
//            
//            var formData = new FormData();
//            formData.append('fileUpload', the_file);
//            formData.append("organizationId", sessionStorage.getItem("orgid"));
//            formData.append("createdBy", sessionStorage.getItem("userid").toString());
//            let data = {fileUpload: the_file, 
//                organizationId: sessionStorage.getItem("orgid"), 
//                createdBy: sessionStorage.getItem("userid").toString()
//            };
//            //console.log("formData: " + formData);
//            //console.log("the_file: " + the_file);
//            APICall("/api/excel/uploadFile", formData, "POST", "multipart/form-data, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
//            .then(data => {
//                //console.log("result: " + JSON.stringify(data));
//                //toastr["success"]("Upload successful", "Alert!");
//                MessageAlert("success", "Upload successful", "Alert!");
//                if (data.status === 200) {
//                    this.setState({sessionData: data.result}); //, loading: false
//                }
//            })
//            .catch(error => {
//                MessageAlert("error", "Upload failed", "Alert!");
//                console.error(error);
//            });
//        };
//    }

//    uploadExcelFile(){
//        if(this.state.file.length === 0){
//            MessageAlert("error", "No Excel file is selected, you must select an Excel file.....", "Alert!");
//            return true;
//        }
//        var reader = new FileReader();
//        var the_file = null;
//        
//
//        reader.onerror = (event) => {
//            this.setState({filePresent: false});
//        };
//        
//        reader.readAsDataURL(this.state.file);
//        reader.onload = (event) => {
//            the_file = event.target.result;
//            const token = sessionStorage.getItem("token");
//            console.log("token: "+token);
////            console.log("the_file: "+the_file);
//
//            const url = 'http://localhost:9000/api/excel/uploadFile';
//            const formData = new FormData();
//            formData.append('fileUpload', the_file);
//            console.log("formData: "+formData);
//            console.log("organizationId: "+sessionStorage.getItem("orgid"));
//            console.log("createdBy: "+sessionStorage.getItem("userid").toString());
//            fetch(url, {
//                method: "POST", // *GET, POST, PUT, DELETE, etc.
//                mode: "cors", // no-cors, *cors, same-origin
//                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//                withCredentials: true,
//                credentials: "include", // *include, same-origin, omit
//                headers: new Headers({
//                    'Accept': "*/*", //contentType,
//                    'Authorization': 'Bearer '+(sessionStorage.getItem("token")),
//                    'Content-Type': "'multipart/form-data'",
//                    'Connection': 'keep-alive',
//                    'Accept-Encoding': 'gzip, deflate, br'
//                }),
//                redirect: "follow", // manual, *follow, error
//                referrer: "no-referrer", // no-referrer, *client
//                //body: formData // body data type must match "Content-Type" header
//                data: formData,
//                body: {
//                    "organizationId": sessionStorage.getItem("orgid"),
//                    "createdBy": sessionStorage.getItem("userid").toString()
//                }
//                //body: JSON.stringify(data) // body data type must match "Content-Type" header
//             })
//            .then(function(response)  {
//        //console.log("response: "+JSON.stringify(response));
//                var dataReturned =response.clone().json();
//                FilterResponse(dataReturned);
//                return response.json();
//            })
//            .catch(error => {
//                console.error(error);
//                //this.setState({ loading: false });
//            });

//            const getCarInfo = new Promise((resolve, reject) => {
//                const config = { 
//                    headers: { 
//                            'Content-Type': 'multipart/form-data',
//                        'X-Requested-With': 'XMLHttpRequest'
//                    } 
//                };
//
//                const form = new FormData();
//                form.append('json', JSON.stringify({ make: 'Jeep', model: 'Grand Cherokee' }));
//                form.append('delay', 1);
//
//                axios.post('/echo/json/', form, config).then((response) => {
//                    if (response.data) {
//                        resolve(response.data);
//                    } else {
//                            const error = new Error('The car information in unavailable.');
//                            reject(error);
//                    }
//                });
//            });

//            axios.post(url, 
//                {
//                    data: formData,
//                    body: {
//                        "organizationId": sessionStorage.getItem("orgid"),
//                        "createdBy": sessionStorage.getItem("userid").toString()
//                    },
//                    headers: {
//                        'Accept': "*/*", //contentType,
//                        'Authorization': 'Bearer '+token,
//                        'Content-Type': 'multipart/form-data',
//                        'Connection': 'keep-alive',
//                        'Accept-Encoding': 'gzip, deflate, br'
//                    },
//                    method: "POST", // *GET, POST, PUT, DELETE, etc.
//                    mode: "cors", // no-cors, *cors, same-origin
//                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//                    withCredentials: true,
//                    credentials: "include", // *include, same-origin, omit
//                    redirect: "follow", // manual, *follow, error
//                    referrer: "no-referrer" // no-referrer, *client
//                }
//            ).then(function(){
//                //console.log('SUCCESS!!');
//            })
//            .catch(function(){
//                //console.log('FAILURE!!');
//            });

//        };
//    };
    
        //uploadExcelFile = ({ target: { files } }) =>{
    /*uploadExcelFile(){
        if(this.state.file.length === 0){
            MessageAlert("error", "No Excel file is selected, you must select an Excel file.....", "Alert!");
            return true;
        }
        
//        var formData = new FormData();
//        var excelfile = document.querySelector('#excel-file-upload');
//        formData.append("fileUpload", excelfile.files[0]);
//        console.log("excelfile "+excelfile.files[0]);
        
//        axios.post('http://localhost:9000/api/excel/uploadFile', formData, {
//            body: {
//                "organizationId": sessionStorage.getItem("orgid"),
//                "createdBy": sessionStorage.getItem("userid").toString()
//            },
//            headers: {
//              'Authorization': 'Bearer '+(sessionStorage.getItem("token")),
//              'Content-Type': 'multipart/form-data'
//            }
//        });

//        fetch('http://localhost:9000/api/excel/uploadFile', {
//            method: "POST",
//            mode: "cors", // no-cors, *cors, same-origin
//            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//            withCredentials: true,
//            credentials: "include", // *include, same-origin, omit
//            formData,
//            body: {
//                "organizationId": sessionStorage.getItem("orgid"),
//                "createdBy": sessionStorage.getItem("userid").toString()
//            },
//            headers: new Headers({
//                'Accept': "", //contentType,
//                'Authorization': 'Bearer '+(sessionStorage.getItem("token")),
//                'Content-Type': 'multipart/form-data',
//                'Connection': 'keep-alive',
//                'Accept-Encoding': 'gzip, deflate, br'
//            }),
//            redirect: "follow", // manual, *follow, error
//            referrer: "no-referrer" // no-referrer, *client
//        
//        }).then(r => r.text()).then(result => {
//            console.log('Response from HTTPBin:\n\n' + result);
//        });
        
        var reader = new FileReader();
        var the_file = null;
        

        reader.onerror = (event) => {
            console.log("onerror: "+event);
            this.setState({filePresent: false});
        };
        reader.readAsDataURL(this.state.file);
        reader.onload = (event) => {
            //console.log("event: "+event);
            the_file = event.target.result;
            //console.log("the_file: "+the_file);
        
            let formData = new FormData();
            formData.append('fileUpload', the_file);
            formData.set("organizationId", sessionStorage.getItem("orgid"));
            formData.set("createdBy", sessionStorage.getItem("userid").toString());
            let data = {fileUpload: the_file, 
                organizationId: sessionStorage.getItem("orgid"), 
                createdBy: sessionStorage.getItem("userid").toString()
            };

//            const options = {
//                onUploadProgress: (progressEvent) => {
//                    const {loaded, total} = progressEvent;
//                    let percent = Math.floor( (loaded * 100) / total );
//                    console.log( `${loaded}kb of ${total}kb | ${percent}%` );
//
//                    if( percent < 100 ){
//                        this.setState({ uploadPercentage: percent });
//                    }
//                }
//            };
            //http://localhost:9000/api/excel/uploadFile
            axios.post("https://www.mocky.io/v2/5cc8019d300000980a055e76", data, options)
            .then(res => { 
                console.log(res);
                this.setState({ avatar: res.data.url, uploadPercentage: 100 }, ()=>{
                    setTimeout(() => {
                        this.setState({ uploadPercentage: 0 });
                    }, 1000);
                });
                if (res.status === 200) {
                    this.setState({sessionData: data.result}); //, loading: false
                }
            })
            .catch(error => {
                MessageAlert("error", "Upload failed", "Alert!");
                console.error(error);
            });
        };
        
//        APICall("/api/excel/uploadFile", data, "POST", "multipart/form-data, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
//        .then(data => {
//            //console.log("result: " + JSON.stringify(data));
//            //toastr["success"]("Upload successful", "Alert!");
//            MessageAlert("success", "Upload successful", "Alert!");
//            if (data.status === 200) {
//                this.setState({sessionData: data.result}); //, loading: false
//            }
//        })
    };*/
    

    checkMimeType = (event) => {
        //getting file object
        let files = event.target.files[0];
        //define message container
        let err = '';
        // list allow mime type
        const types = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        // loop access array
        for (var x = 0; x < files.length; x++) {
            // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err += files[x].type + ' is not a supported format\n';
            }
        };

        if (err !== '') { // if message not same old that mean has error 
            event.target.value = null; // discard selected file
            console.log(err);
            return false;
        }
        return true;
    }

    checkFileSize = (event) => {
        let files = event.target.files[0];
        let size = 150000;
        let err = "";
        for (var x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type + 'is too large, please pick a smaller file\n';
            }
        };
        if (err !== '') {
            event.target.value = null;
            console.log(err);
            return false;
        }
        return true;
    }

    async loadSessionData() {
        //this.setState({ loading: true });
        //APICall("subMenuTerm.json", {}, "GET")
        await APICall("/sessionterm/session/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            //console.log(data.result);
            if (data.status === 200) {
                this.setState({sessionData: data.result}); //, loading: false
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });

//        var _this = this;
//        setTimeout(() => {
//            $('#studentSession').select2();
//            $("#studentSession").change(function(){
//                if($("#studentSession").val() !== null){
//                    var selected_id = $("#studentSession").val().toString();
//                    sessionStorage.setItem("studentSession_selectedid", selected_id);
//                    //var labels = $("#studentSession").text().toString().split(" ");
//                    //$("#studentSession").text(labels[0]);
//                    //_this.populateDataTable();
//                    //_this.loadSectionData(selected_id);
//                    //var session_id = $("#studentSession").find("option:selected").data("sessionid_");
//                    //$("#studentTerm").val(session_id);
//                }
//            });
//        }, 500);
//        setTimeout(() => {
//            $('#studentSession_').select2();
//            $("#studentSession_").change(function(){
//                if($("#studentSession_").val() !== null){
//                    //var selected_id = $("#studentSession_").val().toString();
//                    $("#studentSession_").select2("destroy");
//                    var labels = $("#studentSession_").find("option:selected").text().toString().split(" ");
//                    //var session_id = $("#studentSession_").find("option:selected").data("sessionid2");
//                    //$("#studentTerm_").val(session_id);
//                    _this.setState({ sessionHeader: false });
//                    $("#studentSession_").val(labels[0].toString());
//                }
//            });
//        }, 500);
    }

    async loadTermData() {
        //this.setState({ loading: true });
        await APICall("/sessionterm/term/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            if (data.status === 200) {
                //console.log(data.result);
                this.setState({termData: data.result}); //, loading: false
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
    }

    async loadClassData() {
        //this.setState({ loading: true });
        //APICall("subMenuTerm.json", {}, "GET")
        await APICall("/classection/class/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            //console.log(data.result);
            if (data.status === 200) {
                this.setState({classData: data.result}); //, loading: false
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });

        //var _this = this;
//        setTimeout(() => {
//            $('#studentClass').select2();
//            $("#studentClass").change(function(){
//                if($("#studentClass").val() !== null){
//                    var selected_id = $("#studentClass").val().toString();
//                    sessionStorage.setItem("studentClass_selectedid", selected_id);
//                    //_this.populateDataTable();
//                    //_this.loadSectionData(selected_id);
//                    var section_id = $("#studentClass").find("option:selected").data("sectionid_");
//                    $("#studentSection").val(section_id);
//                }
//            });
//            $('#studentClass_').select2();
//            $("#studentClass_").change(function(){
//                if($("#studentClass_").val() !== null){
//                    //var selected_id = $("#studentClass").val().toString();
//                    //sessionStorage.setItem("studentClass_selectedid", selected_id);
//                    //_this.populateDataTable();
//                    //_this.loadSectionData(selected_id);
//                    var section_id = $("#studentClass_").find("option:selected").data("sectionid2");
//                    $("#studentSection_").val(section_id);
//                }
//            });
//        }, 1000);
    }

    async loadSectionData() {
        //this.setState({ loading: true });
        await APICall("/classection/section/selectall", {organizationId: sessionStorage.getItem("orgid")}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({sectionData: data.result}); //, loading: false
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
    }

    async loadCountryData() {
        //this.setState({ loading: true });
        await APICall("/countrystatelga/country/selectall", {organizationId: 1}, "POST")
        .then(data => {
            if (data.status === 200) {
                this.setState({countryData: data.result}); //, loading: false
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });

        var _this = this;
        setTimeout(() => {
            $('#studentCountry').select2();
            $("#studentCountry").change(function () {
                if ($("#studentCountry").val() !== null) {
                    var selected_id = $("#studentCountry").val().toString();
                    sessionStorage.setItem("studentCountry_selectedid", selected_id);
                    _this.loadStateData(selected_id);
                }
            });
        }, 1000);
        setTimeout(() => {
            $('#studentCountry_').select2();
            $("#studentCountry_").change(function () {
                if ($("#studentCountry_").val() !== null) {
                    var selected_id = $("#studentCountry_").val().toString();
                    //sessionStorage.setItem("studentCountry_selectedid", selected_id);
                    _this.loadStateData(selected_id);
                }
            });
        }, 1000);
    }

    async loadStateData(id) {
        //this.setState({ loading: true });
        await APICall("/countrystatelga/state/selectbycountry", {organizationId: 1, countryId: id}, "POST")
        .then(data => {
            //console.log(data.result);
            if (data.status === 200) {
                this.setState({stateData: data.result}); //, loading: false
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });

        var _this = this;
        setTimeout(() => {
            $('#studentState').select2();
            $("#studentState").change(function () {
                if ($("#studentState").val() !== null) {
                    var selected_id = $("#studentState").val().toString();
                    sessionStorage.setItem("studentState_selectedid", selected_id);
                    _this.loadLgaData(selected_id);
                }
            });
        }, 1000);
        setTimeout(() => {
            $('#studentState_').select2();
            $("#studentState_").change(function () {
                if ($("#studentState_").val() !== null) {
                    var selected_id = $("#studentState_").val().toString();
                    //sessionStorage.setItem("studentState_selectedid", selected_id);
                    _this.loadLgaData(selected_id);
                }
            });
        }, 1000);
    }

    async loadLgaData(id) {
        //this.setState({ loading: true });
        await APICall("/countrystatelga/lga/selectbystate", {organizationId: 1, stateId: id}, "POST")
        .then(data => {
            //console.log(data.result);
            if (data.status === 200) {
                this.setState({lgaData: data.result}); //, loading: false
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
    }

    async populateDataTable() {
        //this.setState({ loading: false });
        const response = await APICall("/students/selectbyorgid",{
            organizationId: sessionStorage.getItem("orgid"),
            sessionId: $("#studentSession_").val(),
            termId: $("#studentTerm_").val(),
            classId: $("#studentClass_").val(),
            sectionId: $("#studentSection_").val(),
            nationality: $("#studentCountry_").val(),
            stateOfOrigin: $("#studentState_").val(),
            localGovernmentArea: $("#studentLga_").val(),
            birthPlace: $("#birthPlace_").val()
        }, "POST");
//        console.log("orgid "+sessionStorage.getItem("orgid")); 
//        console.log("currentsession "+sessionStorage.getItem("currentsession")); 
//        console.log("currentterm "+sessionStorage.getItem("currentterm")); 
//        console.log("studentSession_ "+$("#studentSession_").val()); 
//        console.log("studentTerm_ "+$("#studentTerm_").val()); 
//        console.log("studentClass_ "+$("#studentClass_").val()); 
//        console.log("studentSection_ "+$("#studentSection_").val()); 
//        console.log("studentCountry_ "+$("#studentCountry_").val()); 
//        console.log("studentState_ "+$("#studentState_").val()); 
//        console.log("studentLga_ "+$("#studentLga_").val()); 
//        console.log("birthPlace_ "+$("#birthPlace_").val()); 
//        console.log("response "+JSON.stringify(response));
        $('#loadingLabel').hide();
        if (this.state.dataTableObj) {
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
                {"data": "id"},
                {"data": "userPicture",
                    render: function (data, type, row) {

                        return "<img src='" + data + "' alt='' style='border-radius: 50%; width: 70px; height: 70px'/>";
                    }
                },
                {"data": "registrationNumber"},
                {"data": "firstName",
                    render: function (data, type, row, meta) {
                        if (type === "display") {
                            return row.firstName + " " + row.lastName;
                        }
                    }
                },
                //{ "data": "section_description"},
                //{ "data": "section_description"},
                {"data": "guardianEmail"},
                {"data": "guardianTelephone"},
                {"data": "status",
                    render: function (data, type, row, meta) {
                        if (type === "display") {
                            var status = "";
                            if (data === "A") {
                                status += "<input id='" + row.id + "' type='checkbox' disabled class='switch-checkboxes' checked data-id='" + row.id + "' data-status='" + row.status + "' />";
                            } else {
                                status += "<input id='" + row.id + "' type='checkbox' disabled class='switch-checkboxes' data-id='" + row.id + "' data-status='" + row.status + "' />";
                            }
                            return status;
                        }
                    }
                },
                {"data": "id",
                    render: function (data, type, row, meta) {
                        if (type === "display") {
                            var edit_button = "<button type='button' class='to-update-top-menu btn btn-lg btn-info' data-toggle='modal' onclick='window.editFormManageStudent(" + row.id + ")'><i class='fa fa-pencil text-info' style='cursor: pointer;' title='Edit'></i>&nbsp;Edit</button>";
                            var delete_button = "<button type='button' class='to-delete-top-menu btn btn-danger btn-lg' onclick=window.deleteFormManageStudent('" + row.id + "','" + encodeURI(row.email) + "','" + encodeURI(row.userName) + "','" + encodeURI(row.firstName + " " + row.lastName) + "','" + encodeURI(row.phoneNo) + "','" + encodeURI(row.status) + "')><i class='fa fa-trash text-danger' style='cursor: pointer; color: white;' title='Delete'></i>&nbsp;Delete</button>";
                            return "<table style='margin-top: -5px; margin-bottom: -5px'><tr><td width='10px'>" + edit_button + "</td><td>" + delete_button + '</td></tr></table>'; //data-target='#myModalUpdate' 
                        }
                    }
                }
            ],
            "columnDefs": [

                {
                    "targets": [0],
                    "className": "text-right w-5"
                },
                {
                    "targets": [1, 2, 3, 4, 5, 6, 7],
                    "className": "text-left w-10"
                },
                {
                    "title": "S/No", "targets": 0,
                    render: function (data, type, row, meta) {
                        return (meta.row + meta.settings._iDisplayStart + 1) + ".";
                    }
                },
                {"title": "Profile Picture", "targets": 1},
                {"title": "Reg. No", "targets": 2},
                {"title": "Full Name", "targets": 3},
                {"title": "Email", "targets": 4},
                {"title": "Phone No", "targets": 5},
                {"title": "Status", "targets": 6},
                {"title": "Actions", "targets": 7}
                //id, userImage, email, username, firstName, lastName, otherNames, phoneNo, status 
            ]
        });
        this.setState({dataTableObj: obj});
        var _this = this;
        $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked', onClick: function (event, state) { //onSwitchChange
                var itemId = $(this).attr('data-id');
                var status = "";
                if (state) {
                    status = "A";
                } else {
                    status = "I";
                }
                _this.switchCheckBox(parseInt(itemId), status);
            }
        });

    };
    
    cancelRecord() {

        //this.setState({ updating: true });
        MessageAlert("info", "Record canceled successfully");
        /*this.setState({ updating: false });
         this.setState({ updateView: false });
         this.setState({ newRecord: false });*/
        HideModal("ImageArea");
        this.populateDataTable();
        document.getElementById("manageStudent").style.display = 'none';
        document.getElementById("ImageArea").style.display = 'none';
        //$("data-area").style.display = "none";
        $("#data-list").css({pointerEvents: "auto"});
        $("#data-list").css({top: "0"});
        $("#data-list").css({left: "0"});
        $("#data-list").css({zIndex: "10"});
        $("#data-list").css({opacity: "1.0"});
        //$("#data-list").css({ backgroundColor : "none"});

    }

    async saveRecord() {
        //if(document.getElementById("saveButton").innerHTML === '<i class="fa fa-save"> Save </i>'){ //   > Update
        if (document.getElementById("saveButton").innerHTML.toString().indexOf(" Save ") !== -1) { //   > Update
            await APICall("/students/save", {
                registrationNumber: $("#regNumber").val(),
                lastName: $("#lastName").val(),
                firstName: $("#firstName").val(),
                middleName: $("#middleName").val(),
                sessionId: $("#studentSession").val(),
                termId: $("#studentTerm").val(),
                classId: $("#studentClass").val(),
                sectionId: $("#studentSection").val(),
                gender: $("#gender").val(),
                dateOfBirth: $("#dateOfBirth").val(),
                birthPlace: $("#birthPlace").val(),
                nationality: $("#studentCountry").val(),
                stateOfOrigin: $("#studentState").val(),
                localGovernmentArea: $("#studentLga").val(),
                religion: $("#religion").val(),
                languages: $("#languages").val(),
                guardianTitle: $("#guardianTitle").val(),
                guardianNames: $("#guardianName").val(),
                guardianAddress: $("#guardianAddress").val(),
                guardianRelationship: $("#guardianRelationship").val(),
                contactAddress: $("#email").val(),
                guardianEmail: $("#guardianEmail").val(),
                guardianTelephone: $("#guardianTelephone").val(),
                userPicture: $('#userdp_').attr('src'),
                disability: $("#disability").val(),
                active: ($(".switch-checkboxes").bootstrapSwitch('state')) ? 'A' : 'I',
                createdBy: sessionStorage.getItem("userid").toString(),
                status: 'A', //($(".switch-checkboxes").bootstrapSwitch('state')) ? "A" : "I",
                organizationId: sessionStorage.getItem("orgid").toString()
            },
            "POST").then(data => {
                if (data.status === 200) {
                    //this.setState({ menuRoleData: data.result, loading: false, updating: true });
                    MessageAlert("success", "Record updated successfully");
                    /*this.setState({ updating: false });
                     this.setState({ updateView: false });
                     this.setState({ newRecord: false });*/
                    document.getElementById("manageStudent").style.display = 'none';

                    //$("data-area").style.display = "none";
                    $("#data-list").css({pointerEvents: "auto"});
                    $("#data-list").css({top: "0"});
                    $("#data-list").css({left: "0"});
                    $("#data-list").css({zIndex: "10"});
                    $("#data-list").css({opacity: "1.0"});
                    this.populateDataTable();
                } else {
                    MessageAlert("error", data.message, "Error!!!");

                    //this.setState({ newRecord: true });
                    //this.refs.username.focus();
                }
                //this.setState({ updating: false });

            }).catch(error => { // JSON-string from `response.json()` call
                console.error("error::: " + error);
                //this.setState({ loading: false });
            });
        } else {
            this.updateRecord();
        }
        //if(document.getElementById("saveButton").innerHTML === '<i class="fa fa-save"> Update </i>'){
        //    url = "/users/update";
        //}
    }

    async updateRecord() {
//        this.setState({ updating: true });
        await APICall("/students/update",{
            id: $("#id_").val(),
            registrationNumber: $("#regNumber").val(),
            lastName: $("#lastName").val(),
            firstName: $("#firstName").val(),
            middleName: $("#middleName").val(),
            sessionId: $("#studentSession").val(),
            termId: $("#studentTerm").val(),
            classId: $("#studentClass").val(),
            sectionId: $("#studentSection").val(),
            gender: $("#gender").val(),
            dateOfBirth: $("#dateOfBirth").val(),
            birthPlace: $("#birthPlace").val(),
            nationality: $("#studentCountry").val(),
            stateOfOrigin: $("#studentState").val(),
            localGovernmentArea: $("#studentLga").val(),
            religion: $("#religion").val(),
            languages: $("#languages").val(),
            guardianTitle: $("#guardianTitle").val(),
            guardianNames: $("#guardianName").val(),
            guardianAddress: $("#guardianAddress").val(),
            guardianRelationship: $("#guardianRelationship").val(),
            guardianEmail: $("#guardianEmail").val(),
            guardianTelephone: $("#guardianTelephone").val(),
            userPicture: $('#userdp_').attr('src'),
            disability: $("#disability").val(),
            active: ($(".switch-checkboxes").bootstrapSwitch('state')) ? 'A' : 'I',
            createdBy: sessionStorage.getItem("userid").toString(),
            status: 'A', //($(".switch-checkboxes").bootstrapSwitch('state')) ? "A" : "I",
            organizationId: sessionStorage.getItem("orgid").toString()
        },
        "PUT").then(data => {
            if (data.status === 200) {
                //this.setState({ menuRoleData: data.result, loading: false });
                MessageAlert("success", "Record updated successfully");
                /*this.setState({ updating: false });
                 this.setState({ updateView: false });*/
                this.populateDataTable();

                document.getElementById("manageStudent").style.display = 'none';
                $("#data-list").css({pointerEvents: "auto"});
                $("#data-list").css({top: "0"});
                $("#data-list").css({left: "0"});
                $("#data-list").css({zIndex: "10"});
                $("#data-list").css({opacity: "1.0"});

            } else {
                MessageAlert("error", data.message, "Error!!!");
                //this.setState({ updating: false });
                //this.setState({ updateView: true });
                //this.refs.username.focus();
            }
            //this.setState({ updating: false });

        }).catch(error => { // JSON-string from `response.json()` call
            console.error("error::: " + error);
            //this.setState({ loading: false });
        });
    }

    async showManageStudentUpdate(itemId) {
        //console.log("itemId::: "+itemId);
        //this.setState({ loading: true });
        await APICall("/students/selectone", {id: itemId}, "POST")
        .then(data => {
            if (data.status === 200) {
                //console.log(JSON.stringify(data.result));
                this.setState({studentData: data.result});
                setTimeout(() => {
                    $("#studentSession").select2();
                    $("#studentTerm").select2();
                    $("#studentClass").select2();
                    $("#studentSection").select2();
                    $("#studentCountry").select2();
                    $("#studentState").select2();
                    $("#studentLga").select2();

                    $("#id_").val(data.result.id);
                    $("#regNumber").val(data.result.registrationNumber);
                    $("#regNumber").attr("disabled", true);
                    $("#regNumber").prop("readonly", true);
                    $("#lastName").val(data.result.lastName);
                    $("#firstName").val(data.result.firstName);
                    $("#middleName").val(data.result.middleName);
                    $("#studentSession").val(data.result.sessionId).trigger('change');
                    $("#studentTerm").val(data.result.termId).trigger('change');
                    $("#studentClass").val(data.result.classId).trigger('change');
                    $("#studentSection").val(data.result.sectionId).trigger('change');
                    $("#gender").val(data.result.gender).trigger('change');
                    $("#dateOfBirth").val(data.result.dateOfBirth);
                    $("#birthPlace").val(data.result.birthPlace);
                    $("#studentCountry").val(data.result.nationality).trigger('change');
                    $("#studentState").val(data.result.stateOfOrigin).trigger('change');
                    $("#studentLga").val(data.result.localGovernmentArea).trigger('change');
                    $("#religion").val(data.result.religion);
                    $("#languages").val(data.result.languages);
                    $("#guardianTitle").val(data.result.guardianTitle).trigger('change');
                    $("#guardianName").val(data.result.guardianNames);
                    $("#guardianAddress").val(data.result.guardianAddress);
                    $("#guardianRelationship").val(data.result.guardianRelationship);
                    $("#guardianEmail").val(data.result.guardianEmail);
                    $("#guardianTelephone").val(data.result.guardianTelephone);
                    $('#userdp_').attr('src', data.result.userPicture);
                    $("#disability").val(data.result.disability);
                    (data.result.status === "A") ? $(".switch-checkboxes").bootstrapSwitch('state', true) : $(".switch-checkboxes").bootstrapSwitch('state', false);
                    $("#firstName").focus();
                }, 1000);
                //, updateView: true, loading: false  
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });

        $("#data-list").css({pointerEvents: "none"});
        $("#data-list").css({top: "0"});
        $("#data-list").css({left: "0"});
        $("#data-list").css({zIndex: "10"});
        $("#data-list").css({opacity: "0.5"});
        //$("#data-list").css({ backgroundColor : "rgba(0,0,0,0.5)"});

    }
    //
    startDelete(itemId, email, username, fullname, phoneno, status) {
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this record?\n\nEmail: " + decodeURI(email) + "\nUsername: " + decodeURI(username) + "\nFullname: " + decodeURI(fullname) + "\nPhone No: " + decodeURI(phoneno) + "\nStatus: " + decodeURI(status) + "\n\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/students/delete", {id: itemId}, "DELETE").then(data => {
                    if (data.status === 200) {
                        //this.setState({ loading: false, updating: false });
                        MessageAlert("success", "Record deleted");
//                        this.setState({ updating: false });
//                        this.setState({ updateView: false });
//                        this.setState({ newRecord: false });
                        this.populateDataTable();
                    } else {
                        MessageAlert("error", data.message, "Error!!!");
                    }
                }) // JSON-string from `response.json()` call
                .catch(error => {
                    console.error("error::: " + error);
//                    this.setState({ loading: false });
                });
            }
        });
    }

    addNewRecord() {
        //this.setState({ loading: true });
        setTimeout(() => {
            $("#usertypes").select2();
            $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked'});
            $(".switch-checkboxes").bootstrapSwitch('state', false);
            $("#regNumber").focus();
        }, 1000);
        //this.setState({newRecord: true});
        $("#manageStudent").css("display", "block");
        $("#formHeader").html("<strong>Add New Student</strong> ");
        $("#saveButton").html("<i class='fa fa-save' /> Save ");

        this.setState({studentData: []});
        $("#regNumber").val("");
        $("#regNumber").attr("disabled", false);
        $("#regNumber").prop("readonly", false);
        $("#lastName").val("");
        $("#firstName").val("");
        $("#middleName").val("");
        $("#studentSession").val(0).trigger('change');
        $("#studentTerm").val(0).trigger('change');
        $("#studentClass").val(0).trigger('change');
        $("#studentSection").val(0).trigger('change');
        $("#gender").val(0).trigger('change');
        $("#dateOfBirth").val("");
        $("#birthPlace").val("");
        $("#studentCountry").val(0).trigger('change');
        $("#studentState").val(0).trigger('change');
        $("#studentLga").val(0).trigger('change');
        $("#religion").val("");
        $("#languages").val("");
        $("#guardianTitle").val(0).trigger('change');
        $("#guardianName").val("");
        $("#guardianAddress").val("");
        $("#guardianRelationship").val(0).trigger('change');
        $("#guardianEmail").val("");
        $("#guardianTelephone").val("");
        $('#userdp_').attr('src', './images/default_avatar.jpg');
        $("#disability").val("");

        $("#data-list").css({pointerEvents: "none"});
        $("#data-list").css({top: "0"});
        $("#data-list").css({left: "0"});
        $("#data-list").css({zIndex: "10"});
        $("#data-list").css({opacity: "0.5"});
        //$("#data-list").css({ backgroundColor : "rgba(0,0,0,0.5)"});
        //this.setState({ loading: false });
    }

    viewDoc(arg, arg1, arg2, arg3) {
        if (arg === "./images/default_logo.jpg") {
            this.triggerFileInput(arg1, arg2, arg3);
            return true;
        }
        sessionStorage.setItem("theDoc", arg);
        var oWin = window.open("viewdocument.html", "_blank", "directories=0,scrollbars=1,resizable=0,location=0,status=0,toolbar=0,menubar=0,width=500,height=600,left=50,top=50");
        if (oWin === null || typeof (oWin) === "undefined") {
            console.log("Popup must be enabled on this browser to see the report");
        }
    }

    deleteDoc(itemId) {
        swal({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this document?\n\nThis action will cause permanent loss of data and cannot be reversed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                APICall("/documents/delete", { id: itemId }, "DELETE").then(data => {
                    if (data.status === 200) {
                        MessageAlert("success", "Record deleted");
                        this.loadDocumentsData(sessionStorage.getItem("student_id").toString());
                    } else {
                        MessageAlert("error", data.message, "Error!!!");
                    }
                }) // JSON-string from `response.json()` call
                .catch(error => {
                    console.error("error::: " + error);
                });
            }
        });
    }

    amountWords(amount) {
        var naira = "";
        var kobo = "";
        if (amount.match(".")) {
            var num_split = amount.split('.');
            naira = capAdd(toWords(num_split[0])) + " Naira";
            if (parseInt(num_split[1]) > 0) {
                kobo = capAdd(toWords(num_split[1])) + " Kobo";
            }
        } else {
            naira = capAdd(toWords(amount)) + " Naira";
        }

        var amount_in_words = naira + " " + kobo + " Only";
        //var temp = amount_in_words.split("  ");
        //temp = temp.join(" ");
        //temp = temp.split(" ");
        //temp = temp.join("_");
        //amount_in_words = temp;
        return amount_in_words;
    }
    // selected={sessionStorage.getItem("currentsession") === item.sessionDescription}
    // defaultValue={sessionStorage.getItem("currentsession")}

    // selected={sessionStorage.getItem("currentterm") === item.termDescription}
    // defaultValue={sessionStorage.getItem("currentterm")}

    /*    &nbsp;&nbsp;&nbsp;
     <button style={{ marginTop: "0px", marginBottom: "10px", marginLeft: "0px" }}
     className="btn btn-primary btn-sm clickable" onClick={this.populateDataTable} data-toggle="modal">
     <i className="fa fa-search"></i> Search Students</button>
     &nbsp;&nbsp;&nbsp;
     <button style={{ marginTop: "0px", marginBottom: "10px", marginLeft: "0px" }}
     className="btn btn-primary btn-sm clickable" onClick={this.populateDataTable} data-toggle="modal">
     <i className="fa fa-list"></i> List Students</button>*/
//     onChange={this.onChangeFileHandler} ref={(ref) => this.fileUploaded3 = ref} id="excel-file-upload" name="ExcelFileUpload"

    render() {
        const mystyle = {
            margin: "4px, 4px",
            padding: "4px",
            overflowX: "hidden",
            overflowY: "auto",
            textAlign: "justify",
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
                                            <h5 style={{marginTop: "10px", marginBottom: "10px"}}><strong>Manage Students Register</strong></h5>
                                            <div className="col-sm-12">
                                                <div className="col-sm-3 form-group has-feedback">
                                                    <label><b>Session:</b></label>
                                                    <select className="select2 js-states full-width form-control custom_select" id="studentSession_" ref="studentSession_" style={{width: "250px"}} >
                                                        <option value='0'>Select a Session...</option>
                                                        {
                                                            [].concat(this.state.sessionData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <option key={item.id} data-sessionid2={item.termId} className="clickable" value={item.id}>{item.sessionDescription}</option>
                                                            )
                                                        }
                                                    </select>      
                                                </div>
                                                <div className="col-sm-3 form-group has-feedback">
                                                    <label><b>Term:</b></label>
                                                    <select className="select2 js-states full-width form-control custom_select" id="studentTerm_" ref="studentTerm_" style={{width: "250px"}} >
                                                        <option value='0'>Select a Term...</option>
                                                        {
                                                            [].concat(this.state.termData)
                                                                    .sort((a, b) => a.id > b.id)
                                                                    .map((item, i) =>
                                                                        <option key={item.id} className="clickable" value={item.id}>{item.termDescription}</option>
                                                                    )
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-sm-3 form-group has-feedback">
                                                    <label><b>Class:</b></label>
                                                    <select className="select2 js-states full-width form-control custom_select" id="studentClass_" ref="studentClass_" style={{width: "250px"}} >
                                                        <option value='0'>Select a Class...</option>
                                                        {
                                                            [].concat(this.state.classData)
                                                                    .sort((a, b) => a.id > b.id)
                                                                    .map((item, i) =>
                                                                        <option key={item.id} data-sectionid2={item.sectionId} className="clickable" value={item.id}>{item.classDescription}</option>
                                                                    )
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-sm-3 form-group has-feedback">
                                                    <label><b>Section:</b></label>
                                                    <select className="select2 js-states full-width form-control custom_select" id="studentSection_" ref="studentSection_" style={{width: "250px"}} >
                                                        <option value='0'>Select a Section...</option>
                                                        {
                                                            [].concat(this.state.sectionData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <option key={item.id} className="clickable" value={item.id}>{item.sectionDescription}</option>
                                                            )
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="col-sm-3 form-group has-feedback">
                                                    <label><b>Nationality:</b></label>
                                                    <select className="select2 js-states full-width form-control custom_select" id="studentCountry_" ref="studentCountry_" style={{width: "250px"}} >
                                                        <option value='0'>Select a Country...</option>
                                                        {
                                                            [].concat(this.state.countryData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <option key={item.id} className="clickable" value={item.id}>{item.countryName}</option>
                                                            )
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-sm-3 form-group has-feedback">
                                                    <label><b>State of Origin:</b></label>
                                                    <select className="select2 js-states full-width form-control custom_select" id="studentState_" ref="studentState_" style={{width: "250px"}} >
                                                        <option value='0'>Select a State...</option>
                                                        {
                                                            [].concat(this.state.stateData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <option key={item.id} className="clickable" value={item.id}>{item.stateName}</option>
                                                            )
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-sm-3 form-group has-feedback">
                                                    <label><b>Local Govt. Area:</b></label>
                                                    <select className="select2 js-states full-width form-control custom_select" id="studentLga_" ref="studentLga_" style={{width: "250px"}} >
                                                        <option value='0'>Select an LGA...</option>
                                                        {
                                                            [].concat(this.state.lgaData)
                                                            .sort((a, b) => a.id > b.id)
                                                            .map((item, i) =>
                                                                <option key={item.id} className="clickable" value={item.id}>{item.lgaName}</option>
                                                            )
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-sm-3 form-group has-feedback">
                                                    <label><b>Birth Place:</b></label>
                                                    <input type="text" className="form-control"  style={{width: "250px"}} placeholder="Birth Place" id="birthPlace_" ref="birthPlace_" onChange={() => this.populateDataTable()} />
                                                </div>
                
                                            </div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <button style={{marginTop: "0px", marginBottom: "10px", marginLeft: "0px"}}
                                                    className="btn btn-primary btn-sm clickable" onClick={this.addNewRecord} data-toggle="modal">
                                                <i className="fa fa-plus"></i> Add a New Student</button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button style={{marginTop: "0px", marginBottom: "10px", marginLeft: "0px"}}
                                                    className="btn btn-primary btn-sm clickable" onClick={this.uploadFile} data-toggle="modal">
                                                <i className="fa fa-upload"></i> Import Students</button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button style={{marginTop: "0px", marginBottom: "10px", marginLeft: "0px"}}
                                                    className="btn btn-primary btn-sm clickable" onClick={this.populateDataTable} data-toggle="modal">
                                                <i className="fa fa-download"></i> Export Students</button>
                                            &nbsp;&nbsp;&nbsp;
                                            <input type="text" className="form-control"  style={{width: "250px", height: "37.5px", display: "inline-block"}} placeholder="Type student to search...." id="searchStudent" ref="searchStudent" onChange={() => this.populateDataTable()} />
                
                
                                        </div>
                                    </div>
                                    <div className="panel-body col-md-12" style={mystyle}>
                                        <br />
                                        <table className="table table-striped table-clean table-hover transactions-table" id="myTable"></table>
                                        <div id="loadingLabel"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    <div className="modal modal-body animated rotateIn faster" data-keyboard="false" data-backdrop="static" style={{position: "absolute", top: "-80px", left: "-300px", height: "800px", backgroundColor: "transparent", display: "none"}} id="manageStudent">
                        <div className="modal-dialog">
                            <div className="modal-content" style={{width: "1010px", height: "700px"}}>
                                <div className="modal-header modal-header-primary">
                                    <div className="panel-title">
                                        <div id="formHeader"></div>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <div className="col-sm-12 col-md-4">
                                        <div id="regularstudents" style={{height: "700px"}}>
                                            <div id="f1_upload_process" style={{zIndex: "100", visibility: "hidden", position: "absolute", textAlign: "center", width: "400px", top: "100px", left: "400px"}}>Loading...<br/><img src="imageloader.gif" /><br /></div>
                                            <div className="panel-body accordion md-accordion accordion-blocks" id="infolist" style={{width: '950px', height: "700px"}}>
                                                <h3><a href="#">Personal Information</a></h3>
                                                <div style={{height: "auto"}}>
                                                    <div className="col-sm-12 col-md-4">
                                                        <div className="form-group has-feedback" style={{"borderRight": "1px solid #eee"}}>
                                                            <div className="user-info text-center">
                                                                <br />
                                                                <img id="userdp_" style={{"width": "150px", cursor: "pointer"}} 
                                                                     src={this.state.studentData.userImage} 
                                                                     alt={this.state.studentData.lastName} 
                                                                     className="img-circle profile-img"
                                                                     onClick={() => this.triggerFileInput("the-file-input", "userdp_", 0)} />
                                                                <h3 className="title">{this.state.studentData.lastName} {this.state.studentData.firstName}</h3>
                                                                <small className="info">{this.state.studentData.email}</small>
                                                                <input id="the-file-input" type="file" accept="image/*" onChange={() => this.imageChanged("1")}
                                                                       style={{width: "0px", height: "0px", visibility: "hidden"}} ref={(ref) => this.fileUploaded1 = ref} />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <b>Status:</b>&nbsp;<input id="status" ref="status" type="checkbox" className="switch-checkboxes" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6">
                                                        <div className="col-sm-6 form-group has-feedback">
                                                            <label><b style={{color: "red"}}>Registration No:</b></label>
                                                            <input type="text" className="form-control"  defaultValue={this.state.studentData.regNumber} id="regNumber" ref="regNumber" name="regNumber" required />
                                                            <input type="hidden" className="form-control" defaultValue={this.state.studentData.id} id="id_" ref="id" />
                                                            <input type="hidden" className="form-control" defaultValue={this.state.studentData.organizationId} ref="organizationId" />
                                                        </div>
                                                        <div className="col-sm-6 form-group has-feedback">
                                                            <label><b style={{color: "red"}}>Last Name:</b></label>
                                                            <input defaultValue={this.state.studentData.lastName} type="text" className="form-control" id="lastName" ref="lastName" required />
                                                        </div>
                                                        <div className="col-sm-6 form-group has-feedback">
                                                            <label><b style={{color: "red"}}>First Name:</b></label>
                                                            <input defaultValue={this.state.studentData.firstName} type="text" className="form-control" id="firstName" ref="firstName" required />
                                                        </div>
                                                        <div className="col-sm-6 form-group has-feedback">
                                                            <label><b>Middle Name:</b></label>
                                                            <input defaultValue={this.state.studentData.middleName} type="text" className="form-control" id="middleName" ref="middleName" />
                                                        </div>
                                                        <div className="col-sm-6 form-group has-feedback">
                                                            <label><b style={{color: "red"}}>Gender:</b></label>
                                                            <select className="select2 js-states full-width form-control custom_select" id="gender" ref="gender" >
                                                                {
                                                                    [].concat([{"id": 0, "description": "Select a Gender..."}, {"id": 1, "description": "Male"}, {"id": 2, "description": "Female"}, {"id": 3, "description": "Others"}])
                                                                    .sort((a, b) => a.id > b.id)
                                                                    .map((item, i) =>
                                                                        <option key={item.id} className="clickable" value={item.id}>{item.description}</option>
                                                                    )
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="col-sm-6 form-group has-feedback">
                                                            <label><b style={{color: "red"}}>Birth Date:</b></label>
                                                            <input defaultValue={this.state.studentData.dateOfBirth} type="date" className="form-control" id="dateOfBirth" ref="dateOfBirth" required />
                                                        </div>
                                                        <div className="col-sm-6 form-group has-feedback">
                                                            <label><b>Religion:</b></label>
                                                            <input defaultValue={this.state.studentData.religion} type="text" className="form-control" id="religion" ref="religion" />
                                                        </div>
                                                        <div className="col-sm-6 form-group has-feedback">
                                                            <label>Languages</label>
                                                            <input defaultValue={this.state.studentData.languages} type="text" className="form-control" id="languages" ref="languages" />
                                                        </div>
                
                                                        <br style={{"clear": "both"}} />
                                                    </div>
                                                </div>
                
                                                <h3><a href="#">Class/Section/Nationality</a></h3>
                                                <div style={{height: "auto"}}>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b style={{color: "red"}}>Session:</b></label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="studentSession" ref="studentSession" style={{width: "412px"}} >
                                                            <option value='0'>Select a Session...</option>
                                                            {
                                                                [].concat(this.state.sessionData)
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} data-sessionid_={item.termId} className="clickable" value={item.id}>{item.sessionDescription}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b style={{color: "red"}}>Term:</b></label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="studentTerm" ref="studentTerm" style={{width: "412px"}} >
                                                            <option value='0'>Select a Term...</option>
                                                            {
                                                                [].concat(this.state.termData)
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} className="clickable" value={item.id}>{item.termDescription}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b style={{color: "red"}}>Class:</b></label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="studentClass" ref="studentClass" style={{width: "412px"}} >
                                                            <option value='0'>Select a Class...</option>
                                                            {
                                                                [].concat(this.state.classData)
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} data-sectionid_={item.sectionId} className="clickable" value={item.id}>{item.classDescription}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b style={{color: "red"}}>Section:</b></label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="studentSection" ref="studentSection" style={{width: "412px"}} >
                                                            <option value='0'>Select a Section...</option>
                                                            {
                                                                [].concat(this.state.sectionData)
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} className="clickable" value={item.id}>{item.sectionDescription}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b>Nationality:</b></label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="studentCountry" ref="studentCountry" style={{width: "412px"}} >
                                                            <option value='0'>Select a Country...</option>
                                                            {
                                                                [].concat(this.state.countryData)
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} className="clickable" value={item.id}>{item.countryName}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b>State of Origin:</b></label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="studentState" ref="studentState" style={{width: "412px"}} >
                                                            <option value='0'>Select a State...</option>
                                                            {
                                                                [].concat(this.state.stateData)
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} className="clickable" value={item.id}>{item.stateName}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b>Local Govt. Area:</b></label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="studentLga" ref="studentLga" style={{width: "412px"}} >
                                                            <option value='0'>Select an LGA...</option>
                                                            {
                                                                [].concat(this.state.lgaData)
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} className="clickable" value={item.id}>{item.lgaName}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b>Birth Place:</b></label>
                                                        <input defaultValue={this.state.studentData.birthPlace} type="text" className="form-control" id="birthPlace" ref="birthPlace" />
                                                    </div>
                                                    <div className="col-sm-12 form-group has-feedback">
                                                        <label>Disabilities</label>
                                                        <textarea defaultValue={this.state.studentData.disability} className="form-control" id="disability" ref="disability" row="3" />
                                                    </div>
                                                </div>
                
                                                <h3><a href="#">Parent/Guardian</a></h3>
                                                <div style={{height: "auto"}}>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b>Title:</b></label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="guardianTitle" ref="guardianTitle">
                                                            {
                                                                [].concat([{"id": 0, "description": "Select a Title..."},
                                                                    {"id": 1, "description": "Mr"},
                                                                    {"id": 2, "description": "Mrs"},
                                                                    {"id": 3, "description": "Miss"},
                                                                    {"id": 4, "description": "Malam"},
                                                                    {"id": 5, "description": "Madam"},
                                                                    {"id": 6, "description": "Dr"},
                                                                    {"id": 7, "description": "Prof"},
                                                                    {"id": 8, "description": "Engr"},
                                                                    {"id": 9, "description": "Sir"},
                                                                    {"id": 10, "description": "Alhaji"},
                                                                    {"id": 11, "description": "Alhaja"},
                                                                    {"id": 12, "description": "Others"}
                                                                ])
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} className="clickable" value={item.id}>{item.description}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b style={{color: "red"}}>Parent/Guardian Name:</b></label>
                                                        <input defaultValue={this.state.studentData.guardianName} type="text" className="form-control" id="guardianName" ref="guardianName" required />
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b>Email Address:</b></label>
                                                        <input defaultValue={this.state.studentData.guardianEmail} type="text" className="form-control" id="guardianEmail" ref="guardianEmail" />
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b>Telephone No:</b></label>
                                                        <input defaultValue={this.state.studentData.guardianTelephone} type="text" className="form-control" id="guardianTelephone" ref="guardianTelephone" />
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b>Home Address:</b></label>
                                                        <textarea defaultValue={this.state.studentData.guardianAddress} type="text" className="form-control" id="guardianAddress" ref="guardianAddress" />
                                                    </div>
                                                    <div className="col-sm-6 form-group has-feedback">
                                                        <label><b>Relationship With Ward:</b></label>
                                                        <select className="select2 js-states full-width form-control custom_select" id="guardianRelationship" ref="guardianRelationship">
                                                            {
                                                                [].concat([{"id": 0, "description": "Select a Relationship..."},
                                                                    {"id": 1, "description": "Father"},
                                                                    {"id": 2, "description": "Mother"},
                                                                    {"id": 3, "description": "Uncle"},
                                                                    {"id": 4, "description": "Aunt"},
                                                                    {"id": 5, "description": "Brother"},
                                                                    {"id": 6, "description": "Sister"},
                                                                    {"id": 7, "description": "Cousin"},
                                                                    {"id": 8, "description": "Nephew"},
                                                                    {"id": 9, "description": "Niece"},
                                                                    {"id": 10, "description": "Others"}
                                                                ])
                                                                .sort((a, b) => a.id > b.id)
                                                                .map((item, i) =>
                                                                    <option key={item.id} className="clickable" value={item.id}>{item.description}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                
                                                <h3><a href="#">Supporting Documents</a></h3>
                                                <div style={{height: "400px"}}>
                                                    <div className="col-sm-12 form-group has-feedback">
                                                        <div className={this.state.switching ? "animated fadeOutDown" : "animated fadeInUp faster"}>
                                                            <link href="./css/tiles.css" rel="stylesheet" type="text/css" />
                                                            {
                                                            this.state.loading ? <Spinner /> :
                                                            <div className="tiles">
                                                                {
                                                                    this.state.documentData.map(item =>
                                                                        <div className="tile" key={item.id} style={{cursor: "pointer"}}>
                                                                            <div className="corner" /><div className="check" />
                                                                            {(() => {
                                                                                if (item.id !== 0) {
                                                                                    return (
                                                                                        <div className="tile-body">
                                                                                            <img style={{"width": "100px", cursor: "pointer"}} 
                                                                                                 src={item.documentValue} 
                                                                                                 className="img-rounded profile-img"
                                                                                                 />
                                                                                            <div className="tile-object">
                                                                                                <div className="name" style={{color: '#000000'}}>
                                                                                                    <a onClick={() => this.viewDoc(item.documentValue, "the-file-input" + item.id, "userdp_" + item.id, item.id.toString())} style={{cursor: "pointer"}}><b>View</b></a>
                                                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                    <a onClick={() => this.deleteDoc(item.id)}><b>Delete</b></a>
                                                                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                } else {
                                                                                    return (
                                                                                        <div className="tile-body" onClick={() => this.triggerFileInput("the-file-input0", "userdp_0", 0)}>
                                                                                            <img id={"userdp_0"} style={{"width": "100px", cursor: "pointer"}} 
                                                                                                 src={item.documentValue} 
                                                                                                 className="img-rounded profile-img"
                                                                                                 />
                                                                                            <input id={"the-file-input0"} type="file" accept="image/*" onChange={() => this.imageChanged("2")}
                                                                                                   style={{width: "0px", height: "0px", visibility: "hidden"}} ref={(ref) => this.fileUploaded2 = ref} />
                                                                                            <div className="tile-object">
                                                                                                <div className="name" style={{color: '#ffffff'}}>
                                                                                                    {item.documentName}&nbsp;&nbsp;&nbsp;&nbsp;<br /><br /><br /><br />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            })()};
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {this.state.updating ?
                                <Spinner size="1rem" /> :
                                <div className="col-sm-12 col-md-4">
                                    <div className="col-sm-4" style={{display: "inline", top: "550px", left: "-340px"}}>
                                        <button onClick={this.cancelRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel </button>
                                    </div>
                                    <div className="col-sm-4" style={{display: "inline", top: "550px", left: "-300px"}}>
                                        <button id="saveButton" onClick={this.saveRecord} type="button" className="btn bg-primary btn-wide" ></button>
                                    </div>                
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel panel-primary modal vert-center fade animated rotateIn faster" id="ImageArea" tabIndex="-1" role="dialog" aria-labelledby="modal6Label" style={{display: 'none', height: "750px"}}>
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
                                        <div id="PreviewImage" style={{width: '100%', maxWidth: '100%'}} />
                                        <hr />
                                        <div className="row" id="user-results">
                                            <div className="col-sm-12">
                                                <div className="widget-11-table auto-overflow" style={{height: 'auto', textAlign: "center"}}>
                                                    {
                                                        this.state.updating ? <Spinner size="1.5rem"/> :
                                                        <div className="col-sm-12">
                                                            <div className="col-sm-6">
                                                                <button type="button" className="btn btn-lg btn-info btn-wide btn-rounded" data-dismiss="modal" aria-label="Close" onClick={this.cancelRecord}><i className="fa fa-times" />Cancel</button>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <button type="button" className="btn btn-lg btn-info btn-wide btn-rounded" onClick={this.saveNewImage} style={{margin: '0 auto', display: 'block'}}><i className="fa fa-save" />Save Image</button>
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

                <div className="modal modal-body animated rotateIn faster" data-keyboard="false" data-backdrop="static" style={{position: "absolute", top: "-80px", left: "-200px", height: "500px", backgroundColor: "transparent", display: "none"}} id="uploadFile">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{width: "700px", height: "400px"}}>
                            <div className="modal-header modal-header-primary">
                                <div className="panel-title">
                                    <div id="formUploadHeader">Select An Excel File To Upload</div>
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="col-sm-12 col-md-12">
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <form method="post" action="#" id="#">
                                                    <div className="form-group files color">
                                                        <label>Click  the upload area below to select your file or drag file to the upload area:</label>
                                                        <input type="file" onChange={this.onChangeFileHandler} className="form-control" multiple="" id="excel-file-upload" name="excel-file-upload"  ref={(ref) => this.excelFileUploaded = ref} />
                                                        { this.state.uploadPercentage > 0 && <ProgressBar now={this.state.uploadPercentage} active label={`${this.state.uploadPercentage}%`} /> }
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>    
                            </div>
                            <div className="modal-footer">
                                <div className="col-sm-6 col-md-6"></div>
                                <div className="col-sm-3 col-md-3">
                                    <button onClick={this.onClickPostFileHandler} type="button" className="btn btn-success btn-block" style={{display: "inline-block"}}><i className="fa fa-upload" />Upload</button> 
                                </div>
                                <div className="col-sm-3 col-md-3">
                                    <button onClick={this.cancelFileUpload} type="button" className="btn btn-gray btn-wide m-r-20" style={{display: "inline-block"}} ><i className="fa fa-times" />Cancel </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
