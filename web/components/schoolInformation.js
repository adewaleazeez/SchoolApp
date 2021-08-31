class SchoolInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            schoolName: "",
            addressLine1: "",
            addressLine2: "",
            addressLine3: "",
            addressLine4: "",
            telephoneNumber: "",
            faxNumber: "",
            schoolEmail: "",
            status: "",
            schoolCode: "",
            schoolLogo: "",
            schoolLevel: "",
            schoolInfo: {}, updating: false, filePresent: false, workingImage: {}, loading: false, updateView: false
        };
        this.showUpdate = this.showUpdate.bind(this);
        this.cancelRecord = this.cancelRecord.bind(this);
        this.updateSchoolInfo = this.updateSchoolInfo.bind(this);
        this.loadSchoolInfo = this.loadSchoolInfo.bind(this);
        this.triggerFileInput = this.triggerFileInput.bind(this);
        this.saveNewImage = this.saveNewImage.bind(this);
        this.getImageData = this.getImageData.bind(this);
        this.imageChanged = this.imageChanged.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.initializeCropper = this.initializeCropper.bind(this);
    }

    componentDidMount() {
        $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li><a href="#/menu/:parentMenuId"></a>Setup</li><li class="active">School Information</li>`);
        $('#rightlinks').html("<b>" + sessionStorage.getItem("orgname") + "</b>");
        this.loadSchoolInfo();
    };

    cancelRecord() {
        this.setState({ updating: true });
        //setTimeout(() => {
            MessageAlert("info", "Record canceled successfully");
            this.setState({ updating: false });
            this.setState({ updateView: false });
            this.setState({ newRecord: false });
            this.loadSchoolInfo();
        //}, 1500);
    };

    async loadSchoolInfo() {
        setTimeout(() => {
            $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked'});
        }, 500);
        this.setState({ loading: true });
        //APICall("schoolinfo.json", {}, "GET").then(data => {
        await APICall("/schoolinfo/selectone/"+sessionStorage.getItem("orgid"), {}, "GET").then(data => {
            //console.log(JSON.stringify(data.result));
            if (data.status === 200) {
                sessionStorage.setItem("schoolid", data.result.id);
                this.setState({ schoolInfo: data.result, loading: false });
                (data.result.status==="A") ? $(".switch-checkboxes").prop('checked', true) : $(".switch-checkboxes").prop('checked', false);
            }else{
                sessionStorage.setItem("schoolid", null);
                window.location.href = "./user-login";
                MessageAlert("error", "Your session has expired, please login again.", "Session Expired!!!");
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            this.setState({ loading: false });
        });
    }

    async updateSchoolInfo() {
        this.setState({ updating: true });
        await APICall("/schoolinfo/update", 
        {
            id: sessionStorage.getItem("schoolid"),
            schoolName: this.refs.schoolName.value,
            addressLine1: this.refs.addressLine1.value,
            addressLine2: this.refs.addressLine2.value,
            addressLine3: this.refs.addressLine3.value,
            addressLine4: this.refs.addressLine4.value,
            telephoneNumber: this.refs.telephoneNumber.value,
            faxNumber: this.refs.faxNumber.value,
            emailAddress: this.refs.schoolEmail.value,
            status: ($(".switch-checkboxes").bootstrapSwitch('state')) ? "A" : "I",
            schoolCode: this.refs.schoolCode.value,
            schoolLogo: $('#school_logo').attr('src'), 
            schoolLevel: this.refs.schoolLevel.value
        }, 
        "PUT").then(data => {
            if (data.status === 200) {
                this.setState({ schoolInfo: data.result, loading: false });
                MessageAlert("success", "Record updated successfully");
                this.setState({ updating: false });
                this.setState({ updateView: false });
                this.loadSchoolInfo();
            }else{
                MessageAlert("error", data.message, "Error!!!");
                this.setState({ updating: false });
                this.setState({ updateView: true });
                this.refs.schoolCode.focus();
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            console.error("error::: "+error);
            this.setState({ loading: false });
        });
    }

    showUpdate() {
        this.setState({ updateView: true });
        this.loadSchoolInfo();
    }

    triggerFileInput() {
        $('#the-file-input').trigger('click');
    };

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

    };

    saveNewImage() {
        var SchoolImageBase64 = this.getImageData();
        //this.updatePicture(ImageBase64);
        //$WorkingImage.cropper('destroy');

        $('#school_logo').attr('src', SchoolImageBase64);
        
        HideModal("ImageArea");
        //$WorkingImage.cropper('destroy');
        //$('#ImageArea').modal('hide');

    };
    
    imageChanged() {
        //var fileInput = this;
        $('#ImageArea').modal('show');
        setTimeout(() => this.renderImage(this.fileUploaded.files[0]), 1000);
    };
    
    
    render() {
        return (
                <div className="col-md-12" id="data-area">
                {this.state.loading ? <Spinner /> :
                    <div>
                        {!this.state.updateView ?
                            <div className="flatpanel">
                                <div  style={{maxWidth: "1000px"}} className="panel panel-primary border-3-top animated rotateIn faster">
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "30px" }}><strong>School Information</strong></h5>
                                        </div>
                                    </div>
                                    <div className="row">
                                        
                                        <div className="col-sm-12 col-md-8">
                                                    
                                            <div className="panel-body">

                                                <table className="table table-striped" style={{ "fontSize": "90%" }}>
                                                    <tbody>
                                                        <tr>
                                                            <th style={{ width: "150px" }}>School Code:</th>
                                                            <td>{this.state.schoolInfo.schoolCode}</td>
                                                        </tr>
                                                        <tr>
                                                            <th style={{ width: "150px" }}>School Name:</th>
                                                            <td>{this.state.schoolInfo.schoolName}</td>
                                                        </tr>
                                                        <tr>
                                                            <th style={{ width: "150px" }}>Address:</th>
                                                            <td>{this.state.schoolInfo.addressLine1+', '+this.state.schoolInfo.addressLine2+', '+this.state.schoolInfo.addressLine3+', '+this.state.schoolInfo.addressLine4}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Phone Number:</th>
                                                            <td>{this.state.schoolInfo.telephoneNumber}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Fax Number:</th>
                                                            <td>{this.state.schoolInfo.faxNumber}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Email:</th>
                                                            <td>{this.state.schoolInfo.schoolEmail}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Level:</th>
                                                            <td>{(this.state.schoolInfo.schoolLevel === 1) ? 'Primary' : 'Secondary'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Status:</th>
                                                            <td><input type="checkbox" disabled checked data-on-text="Active" data-off-text="Blocked" className="switch-checkboxes" /></td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                                <a style={{ marginTop: "15px", marginBottom: "30px", marginLeft: "10px" }}
                                                   className="btn btn-primary btn-md" onClick={this.showUpdate}><i className="fa fa-pencil"></i> Edit</a>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <div className="panel-body">
                                                <div className="form-group has-feedback" style={{border: "1px solid #eee"}}>
                                                    <div className="user-info text-center">
                                                        <img style={{width: "200px", height: "280px", cursor: "pointer"}} 
                                                            src={this.state.schoolInfo.schoolLogo} 
                                                            alt={this.state.schoolInfo.schoolName} 
                                                            className="img-rounded profile-img"
                                                            disabled />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                
                            </div>
                            :
                            <div className="flatpanel">
                                <div style={{maxWidth: "800px"}} className="panel panel-primary border-3-top animated rotateIn faster">
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: "0px", marginLeft: "10px" }}><strong>Update School Information</strong></h5>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <form >
                                            <div className="row">
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group has-feedback" style={{border: "1px solid #eee"}}>
                                                        <div className="user-info text-center">
                                                            <img id="school_logo" style={{width: "200px", height: "280px", cursor: "pointer"}} 
                                                                src={this.state.schoolInfo.schoolLogo} 
                                                                alt={this.state.schoolInfo.schoolName} 
                                                                className="img-rounded profile-img"
                                                                onClick={this.triggerFileInput} />
                                                            <input id="the-file-input" type="file" accept="image/*" onChange={this.imageChanged}
                                                                style={{ width: "0px", height: "0px", visibility: "hidden" }} ref={(ref) => this.fileUploaded = ref} />
                                                        </div>
                                                    </div>
                                                    <h5>School Logo(Click above)</h5>
                                                    <div className="form-group">
                                                        Status:&nbsp;<input id="status" ref="status" disabled type="checkbox" className="switch-checkboxes" />
                                                    </div>
                                                </div>
                                                
                                                <div className="col-md-4 col-sm-12">
                                                    <div className="form-group">
                                                        <label>School Code:</label>
                                                        <input type="text" tabIndex="1" disabled className="form-control" defaultValue={this.state.schoolInfo.schoolCode} ref="schoolCode" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Address Line 1:</label>
                                                        <input type="text" tabIndex="3" className="form-control" defaultValue={this.state.schoolInfo.addressLine1} ref="addressLine1" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Address Line 3:</label>
                                                        <input type="text" tabIndex="5" className="form-control" defaultValue={this.state.schoolInfo.addressLine3} ref="addressLine3" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Phone:</label>
                                                        <input type="tel" tabIndex="7" className="form-control" defaultValue={this.state.schoolInfo.telephoneNumber} ref="telephoneNumber" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Contact Email:</label>
                                                        <input type="email" tabIndex="11" className="form-control" defaultValue={this.state.schoolInfo.schoolEmail} ref="schoolEmail" />
                                                    </div>
                                                    
                                                </div>

                                                <div className="col-md-4 col-sm-12">
                                                    <div className="form-group">
                                                        <label>School Name:</label>
                                                        <input type="text" tabIndex="2" className="form-control" defaultValue={this.state.schoolInfo.schoolName} ref="schoolName" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Address Line 2:</label>
                                                        <input type="text" tabIndex="4" className="form-control" defaultValue={this.state.schoolInfo.addressLine2} ref="addressLine2" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Address Line 4:</label>
                                                        <input type="text" tabIndex="6" className="form-control" defaultValue={this.state.schoolInfo.addressLine4} ref="addressLine4" />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Fax:</label>
                                                        <input type="tel" tabIndex="8" className="form-control" defaultValue={this.state.schoolInfo.faxNumber} ref="faxNumber" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>School Level:</label>
                                                        <select  className="form-control" defaultValue={this.state.schoolInfo.schoolLevel} ref="schoolLevel" id="txtSchoolLevel" tabIndex="10">
                                                            <option value="0">--Select Level--</option>
                                                            <option value="1">Primary</option>
                                                            <option value="2">Secondary</option>
                                                        </select>
                                                    </div>
                                                    
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <hr/>
                                                {this.state.updating ?
                                                <Spinner size="1rem" /> :
                                                <div className="btn-group pull-right" role="group">
                                                    <button onClick={this.cancelRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                    <button onClick={this.updateSchoolInfo} type="button" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Update</button>
                                                </div>
                                                }
                                            </div>
                                        </form>
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
                        }
                    </div>
                }
            </div>
        );
    }
}