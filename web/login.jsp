<%! long querystring = java.lang.System.currentTimeMillis(); %>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title></title>
        <link id="IconURL" rel="shortcut icon" href="" />
        
        <!-- ========== COMMON STYLES ========== -->
        <link rel="stylesheet" href="./css/bootstrap.min.css" media="screen" >
        <link rel="stylesheet" href="./css/select2/select2.css" media="screen" >
        <link rel="stylesheet" href="./css/font-awesome.min.css" media="screen" >
        <link rel="stylesheet" href="./css/animate-css/animate.min.css" media="screen" >

        <link rel="stylesheet" href="./css/lobipanel/lobipanel.min.css" media="screen">
        <link rel="stylesheet" href="./js/iziToast/css/iziToast.min.css">
        <link rel="stylesheet" href="./css/cropper.css">
        <link rel="stylesheet" href="./css/sweet-alert/sweetalert.css" media="screen">
        <link rel="stylesheet" href="css/iziModal/iziModal.min.css" media="screen">

        <!-- ========== PAGE STYLES ========== -->
        <link rel="stylesheet" href="./css/icheck/skins/flat/blue.css" >

        <!-- ========== THEME CSS ========== -->
        <link rel="stylesheet" href="./css/main.css" media="screen" >
        <link rel="stylesheet" href="./js/iziToast/css/iziToast.min.css">
        <link href="./css/toastr/toastr.min.css" rel="stylesheet" />

        <style>
            /* This part is read by every device/viewport */
            .widget-1:after {
                background-image: none !important;
            }

            .menu-widgets {
                cursor: pointer !important;
            }

            .menu-widgets:hover {
                background-color: #000 !important;
            }

            .menu-widgets:after {
                opacity: .09 !important;
            }

            .menu-widgets:hover:after {
                opacity: .29 !important;
            }

            .widget-8.taller-w-8 {
                height: 175px !important;
            }

            .widget-8.taller-w-8 h3 {
                margin-top: 20px !important;
            }

            .ar-3-2.no-before:before {
                display: none !important;
            }

            @media (min-width: 1024px) {
                #chart-container-main {
                    min-height: 535.63px;
                }
            }
        </style>

        <style>

            .mdl-card {
                width: 90%;
                min-height: 0;
                margin: 10px auto;
            }

            .mdl-card__supporting-text {
                width: 100%;
                padding: 0;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step {
                /*width: 25%;*/
                /* 100 / no_of_steps */
            }

            .mdl-stepper-step{
                cursor: pointer !important;
            }
            /* Begin actual mdl-stepper css styles */
            .mdl-stepper-horizontal-alternative {
                display: table;
                width: 100%;
                margin: 0 auto;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step {
                display: table-cell;
                position: relative;
                padding: 24px;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step:hover,
            .mdl-stepper-horizontal-alternative .mdl-stepper-step:active {
                background-color: rgba(0, 0, 0, .06);
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step:active {
                border-radius: 15% / 75%;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step:first-child:active {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step:last-child:active {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step:hover .mdl-stepper-circle {
                background-color: #757575;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step:first-child .mdl-stepper-bar-left,
            .mdl-stepper-horizontal-alternative .mdl-stepper-step:last-child .mdl-stepper-bar-right {
                display: none;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step .mdl-stepper-circle {
                width: 24px;
                height: 24px;
                margin: 0 auto;
                background-color: #9E9E9E;
                border-radius: 50%;
                text-align: center;
                line-height: 2em;
                font-size: 12px;
                color: white;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step.active-step .mdl-stepper-circle {
                background-color: rgb(33, 150, 243);
            }


            .mdl-stepper-horizontal-alternative .mdl-stepper-step .mdl-stepper-title {
                margin-top: 16px;
                font-size: 14px;
                font-weight: normal;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step .mdl-stepper-title,
            .mdl-stepper-horizontal-alternative .mdl-stepper-step .mdl-stepper-optional {
                text-align: center;
                color: rgba(0, 0, 0, .26);
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step.active-step .mdl-stepper-title {
                font-weight: 900;
                color: rgba(0, 0, 0, .87);
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step.active-step.step-done .mdl-stepper-title,
            .mdl-stepper-horizontal-alternative .mdl-stepper-step.active-step.editable-step .mdl-stepper-title {
                font-weight: 300;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step .mdl-stepper-optional {
                font-size: 12px;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step.active-step .mdl-stepper-optional {
                font-weight: 900;
                color: rgba(0, 0, 0, .87);
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step .mdl-stepper-bar-left,
            .mdl-stepper-horizontal-alternative .mdl-stepper-step .mdl-stepper-bar-right {
                position: absolute;
                top: 36px;
                height: 1px;
                border-top: 1px solid #BDBDBD;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step .mdl-stepper-bar-right {
                right: 0;
                left: 50%;
                margin-left: 20px;
            }

            .mdl-stepper-horizontal-alternative .mdl-stepper-step .mdl-stepper-bar-left {
                left: 0;
                right: 50%;
                margin-right: 20px;
            }
            
            .modal-header-info {
                color:#fff;
                padding:9px 15px;
                border-bottom:1px solid #eee;
                background-color: #5bc0de;
                -webkit-border-top-left-radius: 5px;
                -webkit-border-top-right-radius: 5px;
                -moz-border-radius-topleft: 5px;
                -moz-border-radius-topright: 5px;
                 border-top-left-radius: 5px;
                 border-top-right-radius: 5px;
            }
            
            .modal-header-primary {
                color:#fff;
                padding:9px 15px;
                border-bottom:1px solid #eee;
                background-color: #065e91;
                -webkit-border-top-left-radius: 5px;
                -webkit-border-top-right-radius: 5px;
                -moz-border-radius-topleft: 5px;
                -moz-border-radius-topright: 5px;
                 border-top-left-radius: 5px;
                 border-top-right-radius: 5px;
            }
        </style>
        
        <!-- ========== MODERNIZR ========== -->
        <script src="./js/modernizr/modernizr.min.js"></script>

        <script src="./react/react.development.js" crossorigin></script>
        <script src="./react/react-dom.development.js" crossorigin></script>
        <script src="./react/babel.min.js" charset="utf-8"></script>
        <script src="./js/iziToast/js/iziToast.min.js"></script>
        <style>

            body{
                //background-image: url(images/7.jpg);
                //background-color: lightblue;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: 0px -145px;
                background-color: rgba(0,0,0,0.5);
            }
            .bg-gray {
                background-color: rgba(0,0,0,0.5);
            }
        </style>
        <link href="./css/spinner.css" rel="stylesheet" />
        <script src="./js/jquery/jquery-2.2.4.min.js"></script>
        <script>
            $(document).ready(function () {
                $('#IconURL').attr('href', IconURL);
                $('title').text(ApplicationName + ': School Home');
            });
        </script>
    </head>
    <body class="">
        <div class="main-wrapper">

            <div class="login-bg-color" style="background: rgba(255,255,255,0.3); margin-top: -100px">
                <div class="row">
                    <div class="col-md-8">
                        <div class="panel login-box" id="login-container" style="box-shadow: none; background: transparent; height: 570px">

                        </div>
                        <!-- /.panel -->
                        <p class="text-center" style="color: white;"><small></small></p>
                    </div>
                    <!-- /.col-md-6 col-md-offset-3 -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /. -->

        </div>
        <!-- /.main-wrapper -->

        <!-- ========== COMMON JS FILES ========== -->
        <script src="./js/pace/pace.min.js"></script>
        <script src="./js/counterUp/jquery.counterup.min.js"></script>
        <script src="./js/waypoint/waypoints.min.js"></script>
        <script src="./js/iziToast/js/iziToast.min.js"></script>
        <script src="./js/cropper.min.js"></script>
        <script src="./js/sweet-alert/sweetalert.min.js"></script>

        
        <script src="./js/jquery-ui/jquery-ui.min.js"></script>
        <script src="./js/bootstrap/bootstrap.min.js"></script>
        <script src="./js/select2/select2.min.js"></script>
        <script src="./js/pace/pace.min.js"></script>
        <script src="./js/lobipanel/lobipanel.min.js"></script>
        <script src="./js/iscroll/iscroll.js"></script>
        <script src="./js/toastr/toastr.min.js"></script>
        <!-- ========== PAGE JS FILES ========== -->
        <script src="./js/icheck/icheck.min.js"></script>

        <!-- ========== THEME JS ========== -->
        <script src="./js/main.js"></script>
        <script>
            $(function () {

            });
        </script>

        <script type="text/javascript" src="./globals.js?v=<%= querystring %>"></script>
        <script src="./components/login.js?v=<%= querystring %>" type="text/babel"></script>
        <script src="./components/spinner.js?v=<%= querystring %>" type="text/babel"></script>
        <script type="text/babel">
            ReactDOM.render(
                    <Login />,
                    document.getElementById("login-container")
                    );
        </script>
        <script>
            var SchoolImageBase64 = "";  
            var AdminImageBase64 = ""; 
            var AdminId = ""; 
            var AdminEmail = ""; 
            var FirstName = ""; 
            var LastName = ""; 
            var OtherNames = ""; 
            var PhoneNumber = "";
            
            var SchoolCode = "";
            var SchoolName = "";
            var AddressLine1 = "";
            var AddressLine2 = "";
            var AddressLine3 = "";
            var AddressLine4 = "";
            var PhoneNo = "";
            var SchoolEmail = "";
            var SchoolFax = "";
            var SchoolLevel = "";
            
            UpdatePlugins = function () {
                $("#content-area select[data-init-plugin=select2]").select2();
                $("#content-area select[multiple]").select2();
                //class="js-switch"
                var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
                elems.forEach(function (html) {
                    var switchery = new Switchery(html, { size: 'small', color:'#0989EB'});
                });
            };
            var SetupScreens = ['admin', 'school', 'submit'];
            var AdvanceTo = function (filename) {
                //alert("filename::: "+filename);
                /*var classesA = [];
                $('#svgcanvas div').each(function() {
                    classesA.push($(this).attr('class')+" | ");
                });
                alert(classesA);*/
                if(filename==='submit'){
                    $("#submit1").css("display", "inline");
                    $("#submit2").css("display", "inline");
                    toastr["success"]("You have completed the setup.", "Setup Complete!");
                }
                var query = Math.round(Math.random() * 100);
                $('#content-area').fadeTo(500,0.2);
                $('.mdl-stepper-step').removeClass('active-step');
                $('#content-area').load("/SchoolApp/partials/" + filename + ".html?v=" + query.toString(), UpdatePlugins);
                //$( "#"+filename ).show();
                //setTimeout(function () {
                    var SavedStep = localStorage.getItem('active_step');
                    SavedStep = parseInt(SavedStep) + 1;
                    
                    //alert(SavedStep);
                    $('#ref' + SavedStep.toString()).addClass('active-step');
                    //$('.mdl-stepper-step[ref=' + SavedStep.toString() + ']').addClass('active-step');
                    $('#content-area').fadeTo(500,1);
                //}, 700); $('#svgcanvas div')
                //alert($('#ref2').attr('class'));
                /*var classesB = [];
                $('#ref2').each(function() {
                    classesB.push($(this).attr('class')+" | ");
                });
                alert(classesB);*/

            };
            

            NextStep = function () {
                var SavedStep = localStorage.getItem('active_step');
                SavedStep = parseInt(SavedStep);
                var nextStep = SavedStep + 1;
                if (nextStep < (SetupScreens.length -0)) {
                    $("#submit1").css("display", "none");
                    $("#submit2").css("display", "none");
                    localStorage.setItem('active_step', nextStep.toString());
                    AdvanceTo(SetupScreens[nextStep]);
                }else {
                    $("#submit1").css("display", "inline");
                    $("#submit2").css("display", "inline");
                    toastr["success"]("You have completed the setup.", "Setup Complete!");
                }
            };

            PreviousStep = function () {
                var SavedStep = localStorage.getItem('active_step');
                SavedStep = parseInt(SavedStep);
                var nextStep = SavedStep - 1;
                if (nextStep >= 0) {
                    $("#submit1").css("display", "none");
                    $("#submit2").css("display", "none");
                    localStorage.setItem('active_step', nextStep.toString());
                    AdvanceTo(SetupScreens[nextStep]);
                } else {
                    toastr["error"]("You can not do previous here.", "No previous form exists!");
                }
            };

            /*$(document).ready(function () {$(document).ready(function () {
                //$('.mdl-stepper-step').click(function () {
                $('.mdl-stepper-step').click(function () {
                    alert("Adewale");
                    var ref = $(this).attr('ref');
                    var nextStep = ref - 1;
                    localStorage.setItem('active_step', nextStep.toString());
                    localStorage.setItem('nextStep', nextStep.toString());
                    AdvanceTo(SetupScreens[nextStep]);
                });

                var SavedStep = localStorage.getItem('active_step');
                if (SavedStep) {
                    SavedStep = parseInt(SavedStep);
                    AdvanceTo(SetupScreens[SavedStep]);
                } else {
                    localStorage.setItem('active_step', '0');
                    AdvanceTo(SetupScreens[0]);
                }


            });
            
            function submitforms() {
                //id, school_name, address_line1, address_line2, address_line3, address_line4, telephone_number, fax_number, 
                //school_email, date_created, created_by, status, vendor_id, school_code, school_logo, school_level
                $.ajax({
                    type: "POST",
                    url: "/schoolinfo/save",
                    data: {},
                    contentType: "application/x-www-form-urlencoded; multipart/form-data; charset=utf-8; ",
                    dataType: "text",
                    cache: false,
                    async: false,
                    success: function (data) {
                        if (data.indexOf("< %= Utility.ActionResponse.UPDATED.toString()%>") !== -1) {
                            swal("Company Setup!!!", "Company Successfully setup!", "success");
                            toastr["success"]("Company Successfully setup!", "Company Setup!!!");
                            gotoLink("/codem00001");
                        } else {
                            swal("Company Setup!!!", "Company Setup failed!", "error");
                            toastr["error"]("Company Setup failed!", "Company Setup!!!");
                        }
                    },
                    //error: function(jqXHR, textStatus, errorThrown) {
                    error: function (a, b, c) {
                        //alert(2 + "   " + b + "   " + c);
                        swal("Company Setup!!!", "The server is not accessible!", "error");
                        toastr["error"]("The server is not accessible!", "Company Setup!!!");
                    }
                });       
                            
                $.ajax({
                    type: "POST",
                    url: "/schoolinfo/save",
                    data: {schoolCode: SchoolCode, schoolName: SchoolName, 
                        addressLine1: AddressLine1, addressLine2: AddressLine2, 
                        addressLine3: AddressLine3, addressLine4: AddressLine4, 
                        telephoneNumber: PhoneNo, emailAddress: SchoolEmail, 
                        faxNumber: SchoolFax, schoolLevel: SchoolLevel, 
                        schoolLogo: SchoolLogo, createdBy: "0", status: "", vendorId: "0"},
                    //contentType: "application/json; charset=utf-8",
                    contentType: "application/x-www-form-urlencoded; multipart/form-data; charset=utf-8; ",
                    dataType: "text",
                    cache: false,
                    async: false,
                    success: function (data) {
                        if (data.indexOf("< %= Utility.ActionResponse.UPDATED.toString()%>") !== -1) {
                            swal("Company Setup!!!", "Company Successfully setup!", "success");
                            toastr["success"]("Company Successfully setup!", "Company Setup!!!");
                            gotoLink("/codem00001");
                        } else {
                            swal("Company Setup!!!", "Company Setup failed!", "error");
                            toastr["error"]("Company Setup failed!", "Company Setup!!!");
                        }
                    },
                    //error: function(jqXHR, textStatus, errorThrown) {
                    error: function (a, b, c) {
                        //alert(2 + "   " + b + "   " + c);
                        swal("Company Setup!!!", "The server is not accessible!", "error");
                        toastr["error"]("The server is not accessible!", "Company Setup!!!");
                    }
                });
            }*/
        </script>
    </body>
</html>
