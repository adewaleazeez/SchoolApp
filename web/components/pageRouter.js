class PageRouter extends React.Component {
    constructor(props){
        super(props);        
    }

    componentDidMount(){
        
    }

    render() {
        return(
            <ReactRouterDOM.HashRouter>
                <div>
                    <ReactRouterDOM.Route exact path="/"  render={(routeProps) => (<Dashboard {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/dashboard"  render={(routeProps) => (<Dashboard {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/menu/:parentMenuId" render={(routeProps) => (<Menus {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/profile" render={(routeProps) => (<Profile {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/changepassword" render={(routeProps) => (<ChangePassword {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/logout" render={(routeProps) => (<Logout {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/banksetup" render={(routeProps) => (<BankSetup {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/school-information" render={(routeProps) => (<SchoolInformation {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/classes-sections" render={(routeProps) => (<ClassesSections {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/subjects" render={(routeProps) => (<Subjects {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/session-term" render={(routeProps) => (<SessionTerm {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/student-registration" render={(routeProps) => (<StudentRegistration {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/fee-types" render={(routeProps) => (<FeeTypes {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/affective-skills" render={(routeProps) => (<AffectiveSkills {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/top-menu" render={(routeProps) => (<TopMenu {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/sub-menu" render={(routeProps) => (<SubMenu {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/user-type" render={(routeProps) => (<UserTypes {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/menu-role" render={(routeProps) => (<MenuRole {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/manage-users" render={(routeProps) => (<ManageUsers {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/access-control" render={(routeProps) => (<AccessControl {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/upload-excel" render={(routeProps) => (<UploadExcel {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/psychomotor-traits" render={(routeProps) => (<PsychomotorTraits {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/scales-grades" render={(routeProps) => (<ScaleGrades {...routeProps} {...this.props} /> )} />
                    <ReactRouterDOM.Route exact path="/examination-grades" render={(routeProps) => (<ExaminationGrades {...routeProps} {...this.props} /> )} />
                </div>
            </ReactRouterDOM.HashRouter>
        );
    }
}
