class SideBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            topLevelMenus: []
        };
        this.loadMenus = this.loadMenus.bind(this);
    }

    async loadMenus() {
        //console.log("Top userid:::: "+sessionStorage.getItem("token"));
        //APICall("menuToplevel.json", {}, "GET")
        //APICall("/topmenu/selectall", {}, "GET")
        await APICall("/topmenu/selectbyuserid", {userid: sessionStorage.getItem("userid"), organizationId: sessionStorage.getItem("orgid")}, "POST")
            .then(data => {
            //if (data.status === "success") {
            if (data.status === 200) {
                this.setState({
                    //topLevelMenus: data.data
                    topLevelMenus: data.result
                });
            } else {
                //window.location.href = "./login.html";
            }
        })
        .catch(error => {
            console.error(error);
        });
    }

    componentDidMount() {
        $("#user_dp").attr('src', sessionStorage.getItem("userimage"));
        $("#email").html(sessionStorage.getItem("email"));
        $("#username_").html(sessionStorage.getItem("username"));
        $("#fullname_").html(sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname"));
        $("#image_").attr('src', sessionStorage.getItem("userimage"));
        this.loadMenus();
        $(document).on('click', '.side-nav a', function(){
            var screenWidth = $(window).width();
            if (screenWidth <= 991) {
                $('.mobile-nav-toggle').trigger('click');
            }
        });
    }

    render() {
        return(
            <div className="left-sidebar box-shadow">
                <div className="sidebar-content">
                    <div className="user-info">
                        <a href="#/profile">
                            <img style={{width: "90px", height: "90px"}} id="image_" className="img-circle profile-img"/>
                            <div id="username_"></div>
                            <div id="fullname_"></div>
                            <div className="info" id="email">{this.props.user.email}</div>
                        </a>
                    </div>
                    <div className="sidebar-nav">
                        <ul className="side-nav color-gray">
                            <li className="nav-header">
                                <span ><hr/></span>
                            </li>
                            <li>
                                <a href="#/dashboard">
                                    <i className="fa fa-bar-chart" />
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            {
                                this.state.topLevelMenus.map(menu =>
                                <li key={menu.id}>
                                    <a href={"#/menu/" + menu.id }>
                                        <i className={menu.icon} />
                                        <span>{menu.name}</span>
                                    </a>
                                </li>)

                            }
                        </ul>
                        <div className="purchase-btn hidden-sm hidden-xs" style={{"paddingLeft": "15px", "textAlign": "left" }}>
                            <a href="#/logout" className="btn btn-danger btn-labeled btn-sm">Log out
                                <span className="btn-label btn-label-right">
                                    <i className="fa fa-power-off" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
