class PageBody extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <section className="section">
                <div className="container-fluid">
                    <div className="row">
                        <div style={{ minHeight: '300px' }}>
                        <PageRouter  accountData={this.props.accountData} loadInit={this.props.loadInit} user={this.props.user} account={this.props.account} setTitle={this.props.setTitle} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}