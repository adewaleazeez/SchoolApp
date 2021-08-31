class PageTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //$('#breadcrumb').html(this.props.data.breadCrumbHTML);
        //$('#rightlinks').html(this.props.data.rightLinksHTML);
        //console.log(this.props.data);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row page-title-div" style={{"display": "none"}}>
                    <div className="col-md-6">
                        <h4 className="title" id="page-title">{this.props.data.title}</h4>
                        <p className="sub-title">{this.props.data.description}</p>
                    </div>
                </div>
                <div className="row breadcrumb-div">
                    <div className="col-md-6">
                        <ul className="breadcrumb" id="breadcrumb">
                            <li>
                                <a href="user-dashboard">
                                    <i className="fa fa-home" /> Home</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-6 text-right" id="rightlinks">
                    </div>
                </div>
            </div>
        );
    }
}