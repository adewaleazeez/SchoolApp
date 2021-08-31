class Menus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parentMenuId: 0, parentMenu: null, childMenus: [], visibleMenus: [], loading: true, parentMenus: [],
            loading: true, switching: false
        };

        this.initView = this.initView.bind(this);
        this.loadChildMenus = this.loadChildMenus.bind(this);
        this.getTopLevelMenus = this.getTopLevelMenus.bind(this);
        this.navigateURL = this.navigateURL.bind(this);
    }


    componentDidMount() {
        $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
        this.getTopLevelMenus();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.parentMenuId !== this.state.parentMenuId) {
            if(this.state.parentMenus.length<=0)   {
                this.getTopLevelMenus();
            }else{
                var parentMenuId = nextProps.match.params.parentMenuId;
                this.initView(parentMenuId);
            }
        }
    }

    initView(topLevelId) {
        var parentMenuId;
        if (topLevelId) {
            parentMenuId = topLevelId;
        } else {
            parentMenuId = this.props.match.params.parentMenuId;
        }
        if (!parentMenuId) {
            //if parent menu is not available, display all top level menus
            this.setState({
                childMenus: null, visibleMenus: this.state.parentMenus, parentMenu: parentMenu, loading: false
            });
        } else {
            this.setState({ parentMenuId: parentMenuId },
                function () {
                    this.loadChildMenus(parentMenuId);
                });
        }
    }

    async loadChildMenus(parentMenuId) {
        //console.log("Sub userid:::: "+sessionStorage.getItem("token"));
        this.setState({ loading: true });
        var parentMenu = $.grep(this.state.parentMenus, function (e) { return e.id == parentMenuId })[0];
        //APICall("menuChildren.json", {}, "GET")
        //APICall("/submenu/selectall", {}, "GET")
        await APICall("/submenu/selectbyuserid", {userid: sessionStorage.getItem("userid"), organizationId: sessionStorage.getItem("orgid")}, "POST")
            .then(data => {
            //console.log("A. ");
            //console.log(data);
            //if (data.status === "success") {
            if (data.status === 200) {
                //var childMenus = $.grep(data.data, function (e) { return e.parentId == parentMenuId });
                var childMenus = $.grep(data.result, function (e) { return e.parentId == parentMenuId });
                //console.log("B. ");
                //console.log(childMenus);
                this.setState({
                    childMenus: childMenus, visibleMenus: childMenus, parentMenu: parentMenu, loading: false
                });
                $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li class="active">` + parentMenu.name + `</li>`);
            } else {
                this.setState({
                    childMenus: null, visibleMenus: this.state.parentMenus, parentMenu: parentMenu, loading: false
                });
            }
        })
        .catch(error => {
            //console.log("C. ");
            //console.log(error);
            this.setState({ loading: false });
            $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li class="active">Menu</li>`);
            this.setState({
                childMenus: null, visibleMenus: this.state.parentMenus
            });
        });
    }

    async getTopLevelMenus() {
        this.setState({ loading: true });
        //APICall("/topmenu/selectall", {}, "GET")
        //APICall("menuToplevel.json", {}, "GET")
        await APICall("/topmenu/selectbyuserid", {userid: sessionStorage.getItem("userid"), organizationId: sessionStorage.getItem("orgid")}, "POST")
            .then(data => {
                //console.log(data.data);
                //console.log(data.status);
                //if (data.status === "success") {
                if (data.status === 200) {
                    this.setState({
                        //parentMenus: data.data
                        parentMenus: data.result
                    },
                        function () {
                            this.initView();
                        });
                } else {
                    this.initView();
                }

            })
            .catch(error => {
                console.error(error);
                this.initView();
            });
    }

    navigateURL(url){
        this.setState({switching: true}, function(){
            setTimeout(()=>{
                if(url.toLowerCase().startsWith("http")){
                    window.location.href = url;
                }else{
                    window.location.href ="./"+ url;
                }
            },500);
            
        });
        
    }

    render() {
        return (
            <div className={this.state.switching? "animated fadeOutDown":"animated fadeInUp faster"}>
                <link href="./css/tiles.css" rel="stylesheet" type="text/css" />
                {
                    this.state.loading ? <Spinner /> :
                        <div className="tiles">
                            {
                                this.state.visibleMenus.map(menu =>
                                    <div className="tile" key={menu.id} onClick={()=>this.navigateURL(menu.url)} style={{ cursor: "pointer" }}>
                                        <div className="corner" /><div className="check" />
                                        <div className="tile-body"><i className={menu.icon + " bg-blue-steel"} /></div>
                                        <div className="tile-object">
                                            <div className="name" style={{ color: '#222222' }}>
                                                {menu.name}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                }

            </div>
        );
    }
}