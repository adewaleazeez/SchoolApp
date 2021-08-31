class Logout extends React.Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {

        $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li class="active">Logout</li>`);
        $('#rightlinks').html('');

        APICall("logout", {},"POST")
        .then(data => {
            sessionStorage.clear();
            window.location.href="./user-login";
        }) 
        .catch(error => {
            sessionStorage.clear();
            window.location.href="./user-login";
        });

    }

    render() {
        return (
            <Spinner />
        );
    }
}