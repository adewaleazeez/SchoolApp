class Profile_1 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true, user: {}, updating: false, filePresent: false, workingImage: {},
            mainContainerClass: 'col-md-12 col-lg-10 animated rotateIn faster'
        }

        this.updateProfile = this.updateProfile.bind(this);
        this.reloadUser = this.reloadUser.bind(this);
        this.triggerFileInput = this.triggerFileInput.bind(this);
        this.saveNewImage = this.saveNewImage.bind(this);
        this.getImageData = this.getImageData.bind(this);
        this.imageChanged = this.imageChanged.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.initializeCropper = this.initializeCropper.bind(this);
    }

    triggerFileInput = function () {
        $('#the-file-input').trigger('click');
    }

    getImageData = function () {
        return this.state.workingImage.cropper('getCroppedCanvas').toDataURL('image/jpeg');
    }


    renderImage = function (file) {
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

    initializeCropper = function () {
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

    saveNewImage = function () {
        var ImageBase64 = this.getImageData();
        //this.updatePicture(ImageBase64);
        //$WorkingImage.cropper('destroy');
        
        $('#user_dp').attr('src', ImageBase64);
        HideModal("ImageArea");
        //$WorkingImage.cropper('destroy');
        //$('#ImageArea').modal('hide');

    }


    updatePicture = function (Base64Image) {
        this.setState({ updating: true });
        APICall("updatedp", { Base64Image: Base64Image }, 'POST')
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

    reloadUser = function () {
        this.setState({ loading: true });
        APICall("user.json", {}, 'GET')
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

    imageChanged = function () {
        //var fileInput = this;
        $('#ImageArea').modal('show');
        setTimeout(() =>
            this.renderImage(this.fileUploaded.files[0])
            , 1000);
    }

    componentDidMount = function () {
        $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li class="active">Profile</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</B>");
        this.reloadUser();

        setTimeout(()=>{
            this.setState({mainContainerClass: "col-md-12 col-lg-10"});
        }, 1000);
        
        $("#image_").attr('src', sessionStorage.getItem("userimage"));
        $("#username").html(sessionStorage.getItem("username"));
        $("#email").html(sessionStorage.getItem("email"));
        $("#fullname").html(sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname"));
    }

    updateProfile() {
        this.setState({ updating: true });
        setTimeout(() => {
            MessageAlert("success", "Record updated successfully");
            this.setState({ updating: false });
            this.loadData();
        }, 1500);
    }

    cancelRecord() {
        
        //this.setState({ updating: true });
        //MessageAlert("info", "Record canceled successfully");
        window.location.href="./user-dashboard";

    }
    
    render() {
        return (
            <div className={this.state.mainContainerClass}>
                {this.state.loading ? <Spinner />
                    :
                    <div className="panel panel-primary border-3-top animated rotateIn faster">
                        <div className="panel-heading">
                            <div className="panel-title">
                                <h5 className="">Profile</h5>
                            </div>
                        </div>
                        <div className="panel-body">
                            <form onSubmit={this.handleSave} id="frmNewAccount">
                                <div className="col-sm-12 col-md-4">
                                    <div className="form-group has-feedback" style={{ "borderRight": "1px solid #eee" }}>
                                        <div className="user-info text-center">
                                            <img id="image_" style={{ "width": "200px", cursor: "pointer" }} src={this.state.user.displayPictureURL} alt={this.state.user.lastName} className="img-circle profile-img"
                                                onClick={this.triggerFileInput} />
                                            <h3 className="title" id="fullname">{this.state.user.lastName} {this.state.user.firstName}</h3>
                                            <small className="info" id="email">{this.state.user.email}</small>
                                            <!--input id="the-file-input" type="file" accept="image/*" onChange={this.imageChanged}
                                                style={{ width: "0px", height: "0px", visibility: "hidden" }} ref={(ref) => this.fileUploaded = ref} /-->
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div className="form-group has-feedback">
                                        <label>Lastname</label>
                                        <input defaultValue={this.state.user.lastName} type="text" className="form-control" id="txtSurname" ref="Surname" required />
                                    </div>
                                    <div className="form-group has-feedback">
                                        <label>Firstname</label>
                                        <input defaultValue={this.state.user.firstName} type="text" className="form-control" id="txtOthernames" ref="Othernames" required />
                                    </div>
                                    <div className="form-group has-feedback">
                                        <label>Phone Number</label>
                                        <input defaultValue={this.state.user.phone} type="tel" className="form-control" id="txtPhoneNumber" ref="PhoneNumber" required />
                                    </div>
                                    <div className="form-group">
                                        {this.state.updating ?
                                            <Spinner size="1em" /> :
                                                    <button onClick={this.cancelRecord} type="button" className="btn btn-gray btn-wide m-r-20" ><span className="btn-label btn-label-right"><i className="fa fa-times" /></span> Cancel </button>
                                        }

                                    </div>


                                    <br style={{ "clear": "both" }} />
                                </div>

                                <br style={{ "clear": "both" }} />



                            </form>

                        </div>
                    </div>
                }
                <div className="panel panel-primary modal vert-center fade animated rotateIn faster" id="ImageArea" tabIndex="-1" role="dialog" aria-labelledby="modal6Label" style={{ display: 'none' }}>
                    <div className="modal-dialog  modal-md" role="document">
                        <div className="modal-content">
                            <div className="modal-header" style={{borderBottom: "0"}}>
                                <h5 className="bold modal-title" id="modal6Label"> 
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                </h5>
                            </div>
                            <div className="modal-body">
                                <div className="panel">
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5></h5>
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
                                                    <button type="button" className="btn btn-lg btn-info btn-wide btn-rounded" onClick={this.saveNewImage} style={{ margin: '0 auto', display: 'block' }}>Save Image</button>
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