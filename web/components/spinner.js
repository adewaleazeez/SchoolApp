class Spinner extends React.Component {
    constructor(props){
    super(props); 
    this.state = {
      size: "3rem"
    };
}

    componentDidMount(){
      if(this.props.size){
        this.setState({size: this.props.size});
      }
    }

    render() {
        return(
				
		<div className="spinner-border"  role="status" style={{height: this.state.size, width: this.state.size}}>
        <span className="sr-only">Loading...</span>
      </div>
        );
    }
}