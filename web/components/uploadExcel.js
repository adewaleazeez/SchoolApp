class uploadExcel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    };

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    grabUploadedFile(uploadedFiles) {
        uploadedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onabort = () => {
                this.setState({ uploadErrorMessage: "File upload aborted, refresh screen and retry" });
            };
            reader.onerror = () => {
                this.setState({ uploadErrorMessage: "File upload failed, refresh screen and retry" });
            }
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result;
                //console.log(binaryStr);
                this.startUpload(base64Str);
            };
            reader.readAsText(file);
        });
    }

    startUpload(base64Str) {
        this.setState({ uploading: true, uploadErrorMessage: null });
        //5 minutes timeoutoverride = 300000, allow more time for uploading of data
        APICall("uploadendpoint", "POST", {base64Str}, 300000)
        .then((data) => {
            console.log(data);
        });
    }
    
    
    
    render(){
		return <input type="file" onChange={(e)=>this.grabUploadedFile(e)} /> //not sure about this, you can also try installing 'react-dropzone' you will find some snippets there https://www.npmjs.com/package/react-dropzone
    }
	
}