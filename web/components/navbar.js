class Navbar extends React.Component {
    constructor(props){
        super(props);
    }


    componentDidMount(){
        $('.small-nav-handle').on('click', function(event){
            event.preventDefault();
            $('.left-sidebar').toggleClass('small-nav');
            $('.navbar-header').toggleClass('small-nav-header');
        });
    
        // Toggle Mobile Nav
        $('.mobile-nav-toggle').on('click', function(event){
            event.preventDefault();
            $('.left-sidebar').toggle();
        });
        
        $("#user_dp").attr('src', sessionStorage.getItem("userimage"));
        $("#username").html(sessionStorage.getItem("username")+" <img src='"+sessionStorage.getItem("userimage")+"' style='border-radius: 50%; width: 20px; height: 20px' alt='"+sessionStorage.getItem("username")+"' class='img-circle profile-img' /><span class='caret' />");
        $("#fullname").html(sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname")+" <img src='"+sessionStorage.getItem("userimage")+"' style='border-radius: 50%; width: 20px; height: 20px' alt='"+sessionStorage.getItem("username")+"' class='img-circle profile-img' /><span class='caret' />");
    }

    render() {
        // /onChange={(e)=>this.handleChanges(e, "email")}
        return(
            <nav className="navbar top-navbar bg-white">
        <div className="container-fluid">
          <div className="row">
            <div className="navbar-header no-padding">
              <a className="navbar-brand" href="user-dashboard">
                <img src={ReverseLogoURL} alt={ApplicationName} className="logo" style={{height: "15px", marginTop: "2px"}} />
              </a>
              <span className="small-nav-handle hidden-sm hidden-xs">
                <i className="fa fa-outdent" />
              </span>
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <i className="fa fa-ellipsis-v" />
              </button>
              <button type="button" className="navbar-toggle mobile-nav-toggle">
                <i className="fa fa-bars" />
              </button>
            </div>
            {/* /.navbar-header */}
            <div className="collapse navbar-collapse" id="navbar-collapse-1">
              <ul className="nav navbar-nav" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut">
                <li className="hidden-xs hidden-xs">
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut">
                
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle small" data-toggle="dropdown" role="button" 
                  aria-haspopup="true" aria-expanded="false" id="fullname">{this.props.user.lastName}
                    <span className="caret" />
                  </a>
                  <ul className="dropdown-menu profile-dropdown">
                    <li className="profile-menu bg-gray">
                      <div>
                        <img src={this.props.user.displayPictureURL} alt={this.props.user.username} id="user_dp" className="img-circle profile-img" />
                        <div className="profile-name">
                          <h6 className="small" id="fullname" style={{marginBottom: "0px", top: "5px", position: "relative"}}>{this.props.user.lastName}</h6>
                          <a href="#/profile"><span className="text-info bold">View Profile</span></a>
                        </div>
                        <div className="clearfix" />
                      </div>
                    </li>
                    <li>
                      <a href="#/changepassword">
                        <i className="fa fa-lock" /> Change Password</a>
                    </li>
                    <li role="separator" className="divider" />
                    <li>
                      <a href="#/logout" className="color-danger text-center">
                        <i className="fa fa-sign-out" /> Logout</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
        );
    }
}