class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.renderGenderChart = this.renderGenderChart.bind(this);
        this.renderAttendanceChart = this.renderAttendanceChart.bind(this);
    }



    componentDidMount() {
        this.props.loadInit();
        var titleText = $('#page-title').text();
        if (titleText !== "Dashboard") {
            this.props.setTitle({
                title: "Dashboard", description: "How you are doing so far"
            });

            $('#breadcrumb').html(`<li><a href="#/"><i class="fa fa-home"></i> Home</a></li><li class="active">Dashboard</li>`);
            $('#rightlinks').html("<b>"+sessionStorage.getItem("orgname")+"</b>");
        }

        setTimeout(() =>
            $('.counter').counterUp(), 2000);

        this.renderGenderChart(40, 60);
        var attendanceData = [{ day: "Mon 1st Apr", value: 790 }, { day: "Tue 2nd Apr", value: 999 },
        { day: "Wed 3rd Apr", value: 895 }, { day: "Thur 4th Apr", value: 980 }, { day: "Fri 5th Apr", value: 900 }];
        this.renderAttendanceChart(attendanceData);
    }

    renderAttendanceChart(attendanceLog) {
        AmCharts.makeChart("chartAttendance", {
            "type": "serial",
            "theme": "light",
            "fontFamily": "Poppins",
            "dataProvider": attendanceLog,
            "valueAxes": [{
                "axisAlpha": 0,
                "position": "left"
            }],
            "graphs": [{
                "id": "g1",
                "balloonText": "[[category]][[value]]",
                "bullet": "round",
                "bulletSize": 8,
                "lineColor": "#d1655d",
                "lineThickness": 2,
                "negativeLineColor": "#637bb6",
                "type": "smoothedLine",
                "valueField": "value"
            }],
            "chartCursor": {
                "categoryBalloonDateFormat": "YYYY",
                "cursorAlpha": 0,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "valueLineAlpha": 0.5,
                "fullWidth": true
            },
            "valueField": "value",
            "titleField": "gender",
            "startDuration": 0,
            "innerRadius": 35,
            "pullOutRadius": 20,
            "marginTop": 0,
            "categoryField": "day"
        });
    }

    renderGenderChart(female, male) {
        var genderData = [{ "gender": "Female", "value": female }, { "gender": "Male", "value": male }];
        var genderChartObject = AmCharts.makeChart("chartGender", {
            "type": "pie",
            "theme": "light",
            "fontFamily": "Poppins",
            "dataProvider": genderData,
            "valueField": "value",
            "titleField": "gender",
            "startDuration": 0,
            "innerRadius": 35,
            "pullOutRadius": 20,
            "marginTop": 0,
            "titles": [{
                "text": ""
            }]
        });
    }

    render() {
        return (
            <div className=" animated rotateIn faster">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ "marginBottom": "5px" }}>
                    <a className="bg-primary dashboard-stat-2">
                        <div className="stat-content">
                            <span className="number counter">{Numberformat(this.props.accountData.activeStudents)}</span>
                            <span className="name">Students</span>
                        </div>
                        <span className="stat-footer"><strong>{Numberformat(this.props.accountData.presentStudents)}</strong> present today</span>
                    </a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ "marginBottom": "5px" }}>
                    <a className="bg-warning dashboard-stat-2">
                        <div className="stat-content">
                            <span className="number counter">{Numberformat(this.props.accountData.teachers)}</span>
                            <span className="name">Teachers</span>
                        </div>
                        <span className="stat-footer"><strong>{Numberformat(this.props.accountData.presentTeachers)}</strong> present today</span>
                    </a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ "marginBottom": "5px" }}>
                    <a className="bg-success dashboard-stat-2">
                        <div className="stat-content">
                            <span className="number">{this.props.accountData.currency}{Numberformat(this.props.accountData.feesCollected)}</span>
                            <span className="name">Fees Collected</span>
                        </div>
                        <span className="stat-footer"><strong>{this.props.accountData.currency}{Numberformat(this.props.accountData.feesCollectedToday)}</strong> paid today</span>
                    </a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ "marginBottom": "5px" }}>
                    <a className="bg-danger dashboard-stat-2">
                        <div className="stat-content">
                            <span className="number counter">{Numberformat(this.props.accountData.debtors)}</span>
                            <span className="name">Debtors</span>
                        </div>
                        <span className="stat-footer"><strong>{this.props.accountData.currency}{Numberformat(this.props.accountData.outstandingFees)}</strong> outstanding</span>
                    </a>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" style={{ "marginBottom": "0px" }}>
                    <div className="panel" style={{ backgroundColor: "transparent" }}>
                        <div className="panel-heading">
                            <div className="panel-title">
                            <h6 className="text-muted"><b>Gender Distribution</b></h6>
                            </div>
                        </div>
                        <div className="panel-body" >
                            <div id="chartGender" style={{ width: "450px", height: "250px", margin: "0 auto" }} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" style={{ "marginBottom": "0px" }}>
                    <div className="panel" style={{ backgroundColor: "transparent" }}>
                        <div className="panel-heading">
                            <div className="panel-title">
                                <h6 className="text-muted"><b>Attendance: Last 5 days</b></h6>
                            </div>
                        </div>
                        <div className="panel-body" >
                            <div id="chartAttendance" style={{ width: "100%", height: "250px", margin: "0 auto" }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}