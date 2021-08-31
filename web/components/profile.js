class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true, user: {}, updating: false, filePresent: false, workingImage: {},
            roleData: [], mainContainerClass: 'col-md-12 col-lg-10 animated rotateIn faster'
        };

        this.loadRoleData = this.loadRoleData.bind(this);
    }

    componentDidMount() {
        $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li class="active">Profile</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</B>");
        //this.reloadUser();

        this.setState({mainContainerClass: "col-md-12 col-lg-10"});
        this.showProfile(sessionStorage.getItem("userid"));
        
        this.loadRoleData();
        
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

    async showProfile(itemId) {
        //console.log("itemId::: "+itemId);
        //this.setState({ loading: true });
        await APICall("/users/selectone", {id: itemId}, "POST")
        .then(data => {
            if (data.status === 200) {
                //console.log(JSON.stringify(data.result));
                //this.setState({ userData: data.result});
                $("#username_").val(data.result.userName);
                $("#email_").val(data.result.email);
                $("#firstname").val(data.result.firstName);
                $("#lastname").val(data.result.lastName);
                $("#othernames").val(data.result.otherNames);
                $("#phoneno").val(data.result.phoneNo);

                $("#userdp").attr('src', sessionStorage.getItem("userimage"));
                $("#username_p").html(data.result.userName);
                $("#fullname_p").html(sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname"));
                $("#email_p").html(data.result.email);
                
                setTimeout(() => {
                    $("#usertypes").select2();
                    $('.switch-checkboxes').bootstrapSwitch({onText: 'Active', offText: 'Blocked'});
                    
                    var object = eval('[' + data.result.userTypes + ']');
                    $('#usertypes').val(object).trigger('change');
                }, 500);
                $('#userdp2').attr('src', data.result.userImage);
                //, updateView: true, loading: false  
            }
        })
        .catch(error => {
            console.error(error);
            //this.setState({ loading: false });
        });
    }
    
    render() {
        return (
            <div className={this.state.mainContainerClass}>
                <div className="panel panel-primary border-3-top animated rotateIn faster">
                    <div className="panel-heading">
                        <div className="panel-title">
                            <h5 className="">Profile</h5>
                        </div>
                    </div>
                    <div className="panel-body">
                        <form id="frmNewAccount">
                            <div className="col-sm-12 col-md-4">
                                <div className="form-group has-feedback" style={{ "borderRight": "1px solid #eee" }}>
                                    <div className="user-info text-center">
                                        <img id="userdp" style={{ "width": "200px", cursor: "pointer" }} src={this.state.user.displayPictureURL} alt={this.state.user.lastName} className="img-circle profile-img" />
                                        <div className="title" id="username_p"></div>
                                        <div className="title" id="fullname_p"></div>
                                        <small className="info" id="email_p"></small>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        Status:&nbsp;&nbsp;&nbsp;<input id="status_" checked readOnly type="checkbox" className="switch-checkboxes" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-sm-12 col-md-6">
                                <div className="col-sm-6 form-group has-feedback">
                                    <label>Username</label>
                                    <input type="text" className="form-control" id="username_" readOnly />
                                </div>
                                <div className="col-sm-6 form-group has-feedback">
                                    <label>email</label>
                                    <input type="text" className="form-control" id="email_" readOnly />
                                </div>
                                <div className="col-sm-6 form-group has-feedback">
                                    <label>Firstname</label>
                                    <input type="text" className="form-control" id="firstname" readOnly />
                                </div>
                                <div className="col-sm-6 form-group has-feedback">
                                    <label>Lastname</label>
                                    <input type="text" className="form-control" id="lastname" readOnly />
                                </div>
                                <div className="col-sm-6 form-group has-feedback">
                                    <label>Other Names</label>
                                    <input type="tel" className="form-control" id="othernames" readOnly />
                                </div>
                                <div className="col-sm-6 form-group has-feedback">
                                    <label>Phone Number</label>
                                    <input type="tel" className="form-control" id="phoneno" readOnly />
                                </div>
                                <div className="col-sm-12 form-group has-feedback">
                                    <label>User Type</label>
                                    <select className="select2 js-states full-width form-control custom_select" disabled id="usertypes" multiple="multiple">
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
                                    <div className="col-sm-12 form-group">
                                        <div className="col-sm-4" style={{display: "inline", marginLeft: "-30px"}}>
                                            <a href="#/dashboard" className="btn btn-danger" role="button">
                                                <span><i className="fa fa-times" />Cancel</span>
                                            </a>
                                        </div>
                                   </div>
                                </div>
                                <br style={{ "clear": "both" }} />
                            </div>
                            <br style={{ "clear": "both" }} />
                        </form>
                    </div>
                </div>
                
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