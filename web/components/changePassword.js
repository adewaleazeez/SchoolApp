class ChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false, user: {}
        }

        this.changePassword = this.changePassword.bind(this);
    }

    

    componentDidMount() {
        $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li class="active">Password Change</li>`);
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</B>");
    }


    async changePassword(){

        var OldPassword = this.refs.oldPassword.value;
        var NewPassword = this.refs.newPassword.value;
        var RetypePassword = this.refs.retypePassword.value;
        if(!NewPassword || !OldPassword || !RetypePassword){
            MessageAlert("error", "Please fill all password fields");
            return;
        }

        if(NewPassword.trim() === "" || OldPassword.trim() === "" || RetypePassword.trim() === ""){
            MessageAlert("error", "Fill all password fields");
            return;
        }

        if(NewPassword !==  RetypePassword){
            MessageAlert("error", "New password and confirmation do not match");
            return;
        }

        this.setState({loading: true});

        //end of delete segment
        //APICall("changepassword", {OldPassword: OldPassword, NewPassword: NewPassword})
        await APICall("/users/changePassword", {id: sessionStorage.getItem("userid"), password: OldPassword, passwordSalt: NewPassword}, "PUT")
        .then(data => {
            this.setState({loading: false});
            if(data.status === 200){
                MessageAlert("success", "Password updated, please login again ...", "You are being logged out");
                window.location.href = "#/logout";
            }else{
                MessageAlert("error", data.message, "Failed");
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            this.setState({loading: false});
            MessageAlert("error", "Password could not be changed", "Fatal error");
        });
    }

    render() {
        return (
            <div className="col-md-12 col-lg-10 animated rotateIn faster">
            {this.state.loading? <Spinner/>
            :
                <div className="panel panel-primary border-3-top">
                    <div className="panel-heading">
                        <div className="panel-title">
                            <h5 className="">Change Password</h5>
                        </div>
                    </div>
                    <div className="panel-body">
                        <form id="frmNewAccount">
                            <div className="col-sm-12 col-md-6">
                                <div className="form-group has-feedback">
                                    <label></label>
                                    <input style={{marginBottom: "10px"}} type="password" className="form-control" ref="oldPassword"  placeholder="old password" />
                                    <input style={{marginBottom: "10px"}} type="password" className="form-control" ref="newPassword"  placeholder="new password" />
                                    <input style={{marginBottom: "10px"}} type="password" className="form-control" ref="retypePassword"  placeholder="retype new password" />
                                </div>
                                <div className="form-group">
                                {this.state.loading? <Spinner size="1em" />:
                                <button style={{marginTop: "30px"}}  onClick={this.changePassword} type="button" className="btn btn-primary btn-labeled">Change Password <span className="btn-label btn-label-right"><i className="fa fa-lock" /></span></button>
                                }
                                    
                                </div>

                                    <br style={{ "clear": "both" }} />
                                </div>

                                <br style={{ "clear": "both" }} />



                        </form>

                    </div>
                </div>
            }
            </div>
        );
    }
}