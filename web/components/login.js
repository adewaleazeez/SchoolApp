class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            admin_user_name: "",
            school_level: "",
            school_name: "",
            address: "",
            line2: "",
            line3: "",
            line4: "",
            phone: "",
            fax: "",
            school_email: "",
            error: false, 
            errorMessage: "Authentication failed", 
            register: {}, updating: false, loading: false, registerView: false
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleForgotPassword = this.handleForgotPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showLogin = this.showLogin.bind(this);
        //this.handleRegister = this.handleRegister.bind(this);
        this.showRegister = this.showRegister.bind(this);
    }

    showLogin() {
        this.setState({registerView: false });
    }
    
    componentDidMount(){
        //this.refs.email.focus();
        $('#email').focus();
        localStorage.setItem('active_step', '0');
        AdvanceTo(SetupScreens[0]);
    }
    
    showRegister() {
        this.setState({registerView: true });
        localStorage.setItem('nextStep', "0");
        AdvanceTo(SetupScreens[parseInt(localStorage.getItem('nextStep'))]);
        $('#modal-help').modal('show');
    }
    
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            $('#signin').click();
        }
    }
    
    handleForgotPasswordKeyPress(e) {
        if (e.key === 'Enter') {
            $('#forgorpasswordid').click();
        }
    }
 
    handleLogin(){
        sessionStorage.clear();
        this.setState({registerView: false},function(){
            var orgid = null;
            APICall("/token/generate-token", {username: this.refs.email.value, password: this.refs.password.value}, "POST")
            .then(data => {
                if(data.message === "success"){
                    sessionStorage.setItem("token", data.result.token);
                    sessionStorage.setItem("username", data.result.username);
                    sessionStorage.setItem("userid", data.result.userid);
                    sessionStorage.setItem("orgid", data.result.orgid);
                    sessionStorage.setItem("selectedid", 0);
                    sessionStorage.setItem("userimage", data.result.userimage);
                    sessionStorage.setItem("firstname", data.result.firstname);
                    sessionStorage.setItem("lastname", data.result.lastname);
                    sessionStorage.setItem("email", data.result.email);
                    sessionStorage.setItem("adminstatus", data.result.status);
                    sessionStorage.setItem("currentsession", data.result.currentsession);
                    sessionStorage.setItem("currentterm", data.result.currentterm);
                    orgid = data.result.orgid;
                }else{
                    MessageAlert("warning", "Invalid Username/Password!!!", "Login Failed");
                    //this.setState({error: true, errorMessage: data.message});
                    this.setState({registerView: false});
                }
            }) 
            .catch(error => {
                this.setState({registerView: false});
                console.error(error);
            });
            
            setTimeout(() => {
                APICall("/schoolinfo/selectone/"+orgid, {}, "GET")
                .then(data => {

                    if(data.message === "success"){
                        sessionStorage.setItem("orgname", data.result.schoolName);
                        window.location.href="./user-dashboard";
                        this.setState({registerView: false});
                    }
                }) 
                .catch(error => {
                    this.setState({registerView: false});
                    console.error(error);
                });
            }, 500);
        });
        //false
    }
    
    handleSubmit(){
        $('#modal-submit').modal('show');
        sessionStorage.clear();
        this.setState(function(){
            APICall("/token/get-anonymous-token", {username: "decoy", password: "decoy"}, "POST")
            .then(data => {
                if(data.message == "success"){
                    toastr["success"]("Token successfully generated.", "Authentication Validated!");
                    sessionStorage.setItem("token", data.result.token);
                    this.setState(function(){
                        APICall("/schoolinfo/save", 
                            {
                                schoolCode: SchoolCode, schoolName: SchoolName, 
                                addressLine1: AddressLine1, addressLine2: AddressLine2, 
                                addressLine3: AddressLine3, addressLine4: AddressLine4, 
                                telephoneNumber: PhoneNo, emailAddress: SchoolEmail,
                                faxNumber: SchoolFax, schoolLevel: SchoolLevel, 
                                schoolLogo: SchoolImageBase64, createdBy: "1", status: "A", vendorId: "0"
                            }, 
                            "POST")
                        .then(data => {
                            if(data.message === "success"){
                                var school_id = data.result.id;
                                this.setState(function(){
                                    toastr["success"]("School record successfully saved.", "School Record Saved!");
                                    APICall("/users/save", 
                                        {
                                            username: AdminId, email: AdminEmail, 
                                            firstName: FirstName, lastName: LastName,
                                            otherNames: OtherNames, phoneNo: PhoneNumber, 
                                            userImage: AdminImageBase64, organizationId: school_id,
                                            active: "Yes", createdBy: "1", status: "A", userTypes: "1"
                                        }, 
                                        "POST")
                                    .then(data => {
                                        console.log("data.message   "+data.message);
                                        if(data.message == "success"){
                                            toastr["success"]("You have successfully completed the setup. An email has been sent to "+AdminEmail+", check the email for the details of your login.", "Setup Completed!!!");
                                            alert("Setup Completed!!!\n\nYou have successfully completed the setup. An email has been sent to "+AdminEmail+", check the email for the details of your login.");
                                            this.setState({registerView: false});
                                            sessionStorage.clear();
                                            window.location.href = "./user-login";
                                            $('#modal-submit').modal('hide');
                                        }else{
                                            console.log("school_id   "+school_id);
                                            APICall("/schoolinfo/delete", 
                                                {
                                                    id: school_id
                                                }, 
                                                "DELETE")
                                            .then(data => {
                                                //console.log(data.message);
                                                //console.log(data.status);
                                                //console.log(data.result);
                                                //if(data.message == "success"){}
                                            }) 
                                            .catch(error => {
                                                //this.setState({registerView: false});
                                                console.error(error);
                                            });  

                                            toastr["error"](data.message, "Admin Record Failed!");
                                            alert("Admin Record Failed!\n\n"+data.message);
                                            //this.setState({error: true, errorMessage: data.data});
                                            //this.setState({registerView: false});
                                            //sessionStorage.clear();
                                            //window.location.href = "./user-login";
                                            $('#modal-submit').modal('hide');
                                        }
                                    }) 
                                    .catch(error => {
                                        //this.setState({registerView: false});
                                        console.error(error);
                                    });
                                });
                            }else{
                                toastr["error"](data.message, "School Record Failed!");
                                alert("School Record Failed!\n\n"+data.message);
                                this.setState({error: true, errorMessage: data.data});
                                //sessionStorage.clear();
                                //window.location.href = "./user-login";
                                $('#modal-submit').modal('hide');
                                //this.setState({registerView: false});
                            }
                        }) 
                        .catch(error => {
                            //this.setState({registerView: false});
                            console.error(error);
                        });
                    });
                    //this.setState({registerView: false});
                }else{
                    toastr["error"]("Bad Credentials, Access not granted to the application.", "Access Denied!");
                    alert("Access Denied!\n\nBad Credentials, Access not granted to the application.");
                    //this.setState({error: true, errorMessage: data.data});
                    sessionStorage.clear();
                    window.location.href = "./user-login";
                    $('#modal-submit').modal('hide');
                    //this.setState({registerView: false});
                }
            }) 
            .catch(error => {
                //this.setState({registerView: false});
                console.error(error);
            });
            
        });
        
    }
    
    handleForgotPassword(){
        sessionStorage.clear();
        this.setState(function(){
            APICall("/token/get-anonymous-token", {username: "decoy", password: "decoy"}, "POST")
            .then(data => {
                if(data.message == "success"){
                    toastr["success"]("Token successfully generated.", "Authentication Validated!");
                    sessionStorage.setItem("token", data.result.token);
                    this.setState(function(){
                        APICall("/users/resetPassword", {username: $('#username').val()}, "PUT")
                        .then(data => {
                            if(data.message === "success"){
                                toastr["success"]("A new password was generated and sent to your email: "+data.result.email, "Password Reset Successful!");
                                alert("Password Reset Successful!\n\nA new password was generated and sent to your email: "+data.result.email);
                                window.location.href="./user-login";
                            }else{
                                MessageAlert("error", "Invalid Username!!!", "Password Reset Failed");
                                toastr["error"]("Invalid User Name, password reset failed.", "Password Reset Failed!");
                                alert("Password Reset Failed!\n\nInvalid User Name, password reset failed.");
                                //this.setState({error: true, errorMessage: data.message});
                                this.setState({registerView: false});
                            }
                        }) 
                        .catch(error => {
                            this.setState({registerView: false});
                            console.error(error);
                        });
                    });
                }else{
                    toastr["error"]("Bad Credentials, Access not granted to the application.", "Access Denied!");
                    alert("Access Denied!\n\nBad Credentials, Access not granted to the application.");
                    this.setState({error: true, errorMessage: data.data});
                    sessionStorage.clear();
                    window.location.href = "./user-login";
                    $('#modal-submit').modal('hide');
                    //this.setState({registerView: false});
                }
            }) 
            .catch(error => {
                //this.setState({registerView: false});
                console.error(error);
            });
            
        });
        //false
    }
    
    handleRegister(){
        this.showLogin();
    }
    
    NextStep(){
        NextStep();
    }
    
    PreviousStep(){
        PreviousStep();
    }
    
    submitforms(){
        submitforms();
    }
    
    boxClick(ref){
        var nextStep = ref - 1;
        localStorage.setItem('active_step', nextStep.toString());
        localStorage.setItem('nextStep', nextStep.toString());
        AdvanceTo(SetupScreens[nextStep]);
    }
    
    hideModal(){
        $('#modal-help').modal('hide');
    }
    
    showHelp(){
        $('#modal-help').modal('show');
    }
    
    showForgotPassword(){
        $('#modal-forgot-password').modal('show');
        $('#username').focus();
    }
    
    returnToLogin(){
        window.location.href = "./user-login";
    }
    
    loginFocus(){
        $('#email').focus();
    }
    
    render() {
        return (
            <div className="app flex-row align-items-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-12">
                            <div className="panel-group">
                            {!this.state.registerView ?
                                <div className="flatpanel col-md-offset-2" style={{marginLeft: '380px'}}>
                                    <div className="bg-white rounded-left panel-primary col-md-6 mt-50 animated rotateIn faster" style={{ width: '60%' , height: '350px' }}>
                                        <div className="panel-body ">
                                            <form>
                                                <h1>Login</h1>
                                                <p className="text-muted">Sign In to your account</p>
                                                <div className="input-group mb-3">
                                                    <span className="input-group-addon" >
                                                        <i className="fa fa-user"></i>
                                                    </span>
                                                    <input type="text" className="form-control" placeholder="Username" autoComplete="email"  id="email"  ref="email" onKeyPress={this.handleKeyPress}/>
                                                </div>
                                                <div className="input-group mb-4">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-lock"></i>
                                                    </span>
                                                    <input type="password" className="form-control"  placeholder="Password" ref="password" autoComplete="current-password" onKeyPress={this.handleKeyPress}/>
                                                </div>

                                                <div className="row">
                                                    <div xs="6" className="form-group col-md-6">
                                                        {
                                                            this.state.loading? <Spinner size="1rem" />:
                                                            <button type="button" onClick={this.handleLogin} className="btn btn-primary btn-rounded" 
                                                            style={{ width: '80', marginTop: '20px' }} id="signin">Sign in</button>
                                                        }
                                                        {
                                                            this.state.error? <div className="alert alert-danger small" style={{ padding : '5px 10px', marginTop: '15px'}}>{this.state.errorMessage}</div>:null
                                                        }
                                                    </div>
                                                    <div xs="6" className="text-right col-md-6">
                                                        <div style={{ height: '25px' }}></div>
                                                        <a href="#" onClick={this.showForgotPassword} >Forgot&nbsp;password?</a>
                                                    </div>

                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="text-white bg-primary py-5 d-md-down-none col-md-4 mt-50 animated rotateIn faster" style={{ width: '40%' , height: '350px' }}>
                                        <div className="text-center panel-body">
                                            <div>
                                                <h2>Sign up</h2>
                                                <p>If you are new to Smart Systems, you can register for a new account by clicking the Register button below.
                                                </p>
                                                <div style={{ height: '50px' }}></div>
                                                <a>
                                                    <button onClick={this.showRegister} color="primary" className="mt-3" style={{ width: '150px'}} tabIndex={ - 1}>Register Now!</button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div style={{ width: '1200px', marginLeft: '80px', position: 'absolute', top: '0px', left: '0px', bottom: 'auto', right: 'auto'}} className="Box text-white panel panel-primary border-3-top mt-5  animated rotateIn faster">
                                    <div className="panel-heading">
                                        <div className="panel-title">
                                            <h5 style={{ marginTop: '0px', marginLeft: '0px' }}><strong style={{ color: 'white'}}>New Registration</strong></h5>
                                        </div>
                                    </div>
                                    <div className="padding-0 text-center">
                                        <h2>Smart System Platform Setup</h2>
                                        <p>In order for Smart System to perform optimally, you are required to complete the following setup.</p>
                                        <p className="small hint-text">This should take only a few minutes. Click <a style={{ cursor: 'pointer', color: 'green'}} onClick={this.showHelp}><b>Help....</b></a> to show the Help Form or click <a style={{ cursor: 'pointer', color: 'blue'}} onClick={this.returnToLogin}><b>Login....</b></a> to return to Login page</p>
                                    </div>
                                    
                                    <div className="mdl-card mdl-shadow--2dp">
                                        <div className="mdl-card__supporting-text">
                                            <div id="svgcanvas" className="mdl-stepper-horizontal-alternative">
                                                <div className="mdl-stepper-step active-step" id="ref1" ref="1" onClick={() => this.boxClick('1')} >
                                                    <div className="mdl-stepper-circle"><span>1</span></div>
                                                    <div className="mdl-stepper-title">Admin</div>
                                                    <div className="mdl-stepper-optional">Details</div>
                                                    <div className="mdl-stepper-bar-left"></div>
                                                    <div className="mdl-stepper-bar-right"></div>
                                                </div>
                                                <div className="mdl-stepper-step" id="ref2" ref="2" onClick={() => this.boxClick('2')} >
                                                    <div className="mdl-stepper-circle"><span>2</span></div>
                                                    <div className="mdl-stepper-title">School</div>
                                                    <div className="mdl-stepper-optional">Details</div>
                                                    <div className="mdl-stepper-bar-left"></div>
                                                    <div className="mdl-stepper-bar-right"></div>
                                                </div>
                                                <div className="mdl-stepper-step" id="ref3" ref="3" onClick={() => this.boxClick('3')} >
                                                    <div className="mdl-stepper-circle"><span>3</span></div>
                                                    <div className="mdl-stepper-title">Submit</div>
                                                    <div className="mdl-stepper-optional">Forms</div>
                                                    <div className="mdl-stepper-bar-left"></div>
                                                    <div className="mdl-stepper-bar-right"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{width: '150px', margin: '10px auto', height: '50px'}}>
                                        <button onClick={this.NextStep} className="btn btn-primary btn-xs pull-right" style={{ width: '68px'}}>Next <i className="fa fa-caret-right"></i></button>
                                        <button onClick={this.PreviousStep} className="btn btn-primary btn-xs pull-left"><i className="fa fa-caret-left"></i> Previous </button>
                                        <button onClick={this.handleSubmit} id="submit1" style={{ display: 'none' }} className="btn btn-primary btn-xs pull-center"><i className="fa fa-upload"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Submit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                                    </div>
                                    <div id="content-area" className="m-b-30 " style={{ marginBottom: '10px', marginLeft: '100px', fontSize: '12px', height: '100%', width: '100%' }}>

                                    </div>
                                    <div style={{width: '150px', margin: '100px auto', height: '50px'}}>
                                        <button onClick={this.NextStep} className="btn btn-primary btn-xs pull-right" style={{ width: '68px'}}>Next <i className="fa fa-caret-right"></i></button>
                                        <button onClick={this.PreviousStep} className="btn btn-primary btn-xs pull-left"><i className="fa fa-caret-left"></i> Previous </button>
                                        <button onClick={this.handleSubmit} id="submit2" style={{ display: 'none'}} className="btn btn-primary btn-xs"><i className="fa fa-upload"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Submit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                                    </div>
                                </div>
                            }
                            </div>
                        </div>
                    </div>
                    <div className="modal fade slide-up disable-scroll" style={{ display: 'none' }} id="modal-help" tabIndex="-1" role="dialog" aria-hidden="false">
                        <div className="modal-dialog ">
                            <div className="modal-content-wrapper">
                                <div className="modal-content">
                                    <div className="modal-header clearfix text-left col-sm-10">
                                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                            <i className="pg-close fs-14"></i>
                                        </button>
                                        <h5><strong id="level-header-text">How to setup the Admin and School details forms</strong></h5>
                                    </div>
                                    <div className="modal-body m-t-20">
                                        <div className="" role="form">
                                            <div className="col-sm-10 form-group form-group-default required ">
                                                <ol>
                                                    <li>The <b>Admin Details</b> form is the first of all the forms in the setup. </li>
                                                    <li>Make sure you fill all <b>Admin</b> details like Id, Email, Names, Phones and passport.</li>                                   
                                                    <li>While you are on <b>Admin Details</b> form, click the <b>Next</b> button to navigate to <b>School details</b> form, you can also click on the <b>Previous</b> button to navigate back to the previous form.</li>
                                                    <li>Complete all fields on the <b>School Details</b> form i.e. Code/Acronym, Name, Address, Phone, Fax, Email, Level and the school logo.</li>
                                                    <li>To upload the <b>Admin</b> passport or <b>School</b> Logo, click on the image to show the image picker dialogue box, navigate to your desired picture and double-click to select it.</li>
                                                    <li>Use the <b>Cropper box</b> by dragging and expanding the box over your image to capture the area of the image you want to cover, click on <b>Save Image</b> button to show the image on your form.</li>
                                                    <li>Navigate to the last form by clicking the <b>Next</b> button while you are on the <b>School Details</b> form, the last form is the <b>Submit</b> form, the <b>Submit</b> button shows on this form and you can click the <b>Submit</b> button to submit all forms.</li>
                                                    <li>You can equally navigate to any form by clicking on the form title in the main form.</li>
                                                    <li>You can click the <b>Close Help</b> button below to close this form.</li>
                                                    <li>To bring this <b>Help</b> form up again, click the <b>Help....</b> link on the main form.</li>
                                                </ol>
                                            </div>
                                            <button className="btn btn-sm btn-danger m-t-30" onClick={this.hideModal}><i className="fa fa-recycle"></i> <span id="level-form-button">Close Help</span></button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade slide-up disable-scroll" style={{ display: 'none' }} id="modal-submit" tabIndex="0" role="dialog" aria-hidden="false">
                        <div className="modal-dialog ">
                            <div className="modal-content-wrapper">
                                <div className="modal-content">
                                    <div className="col-sm-10 form-group form-group-default required " style={{ marginLeft: '300px' }} id="data-area">
                                        <h5><strong id="level-header-text" style={{color: 'white'}}>Data submission in Progress..........</strong></h5>
                                        <Spinner size="5rem" />
                                   </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal modal-primary animated rotateIn faster" id="modal-forgot-password">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header modal-header-primary">
                                    <div className="panel-title">
                                        <h5 style={{ marginTop: "30px", marginLeft: "-10px" }}><strong>Forgot Password</strong></h5>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-8 col-sm-12 col-lg-6">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label>User Name:</label>
                                                            <input type="text" placeholder="User Name" className="form-control" id="username" onKeyPress={this.handleForgotPasswordKeyPress} />
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
                                                    <button  data-dismiss="modal" type="button" onClick={this.loginFocus} className="btn btn-gray btn-wide m-r-20" ><i className="fa fa-times" />Cancel</button>
                                                    <button onClick={this.handleForgotPassword} type="button" id="forgorpasswordid" className="btn bg-primary btn-wide" ><i className="fa fa-check" />Submit</button>
                                                </div>
                                            }
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                  <button type="button" onClick={this.loginFocus} className="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


                                    