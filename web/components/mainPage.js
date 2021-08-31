class MainPage extends React.Component {
    constructor(props){
        super(props);        
        this.state = {
            title: "", description: ""
        };
        this.updateTitleArea = this.updateTitleArea.bind(this);
    }
    componentDidMount(){
    }

    updateTitleArea(titleData){
        this.setState(titleData);
    }

    render() {
        return(
            <div className="main-page">
                <PageTitle user={this.props.user} account={this.props.account} data={this.state} />
                <PageBody bank={this.props.bank} accountData={this.props.accountData} user={this.props.user} account={this.props.account} setTitle={this.updateTitleArea} loadInit={this.props.loadInit} />
            </div>
        );
    }
}