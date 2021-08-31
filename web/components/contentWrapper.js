class ContentWrapper extends React.Component {
    constructor(props) {
        super(props);
    }



    componentDidMount() {

    }

    render() {
        return (
            <div className="content-wrapper">
                <div className="content-container">
                <SideBar user={this.props.user} account={this.props.account} />
                    <MainPage bank={this.props.bank} accountData={this.props.accountData} user={this.props.user} account={this.props.account} loadInit={this.props.loadInit} />
                </div>
            </div>
        );
    }
}