<?php
$querystring = time();
?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title> </title>
        <link id="IconURL" rel="shortcut icon" href="" />
        <!-- ========== COMMON STYLES ========== -->
        <link rel="stylesheet" href="./css/bootstrap.min.css" media="screen">
        <link rel="stylesheet" href="./css/font-awesome.min.css" media="screen">
        <link rel="stylesheet" href="./css/animate-css/animate.min.css?v=2" media="screen">
        <link rel="stylesheet" href="./css/lobipanel/lobipanel.min.css" media="screen">
        <link rel="stylesheet" href="./css/select2/select2.min.css">
        <link rel="stylesheet" href="./js/iziToast/css/iziToast.min.css">
        <link rel="stylesheet" href="./css/cropper.css">
        <link rel="stylesheet" href="./css/sweet-alert/sweetalert.css" media="screen">

        <link rel="stylesheet" type="text/css" href="./datatables/DataTables-1.10.18/css/dataTables.bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="./datatables/Buttons-1.5.4/css/buttons.bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="./datatables/Responsive-2.2.2/css/responsive.bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="./datatables/Scroller-1.5.0/css/scroller.bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="./datatables/Select-1.2.6/css/select.bootstrap.min.css" />

        <!-- ========== PAGE STYLES ========== -->
        <link rel="stylesheet" href="./css/prism/prism.css" media="screen">
        <link rel="stylesheet" href="./css/icheck/skins/flat/blue.css" >

        <!-- ========== THEME CSS ========== -->
        <link rel="stylesheet" href="./css/main.css" media="screen">
        <link rel="stylesheet" href="./css/spacing-helpers.css">

        <!-- ========== MODERNIZR ========== -->
        <script src="./js/modernizr/modernizr.min.js"></script>

        <script src="./react/react.development.js"></script>
        <script src="./react/react-dom.development.js"></script>
        <script src="./react/react-router-dom.min.js"></script>
        <script src="./react/babel.min.js"></script>
        <style>
            .tiles{
                margin-left: 30px !important;
            }

            .alternate-form-label{
                line-height: 14px !important;
                margin-bottom: 10px !important;
                font-weight: normal !important;    height: 31px;
            }
            @media (max-width: 991px){
                .alternate-form-label{
                    line-height: 14px !important;
                    margin-bottom: 10px !important;
                    font-weight: bold !important;
                    height: auto;
                }
                .sidebar-content .sidebar-nav{
                    margin-top: -20px;
                }
                .sidebar-content .user-info{
                    display: none;
                }
            }
            @media (max-width: 767px){
                .alternate-form-label{
                    line-height: 14px !important;
                    margin-bottom: 0px !important;
                    font-weight: bold !important;
                    height: auto;
                }
            }



            .sa-icon.sa-icon{
                display: none !important;
            }
            .sweet-alert button{
                font-size: 14px;
                padding: 7px 22px;
            }
            .sweet-alert p{
                font-size: 14px;
                font-family: arial, helvetica, sans-serif;
                max-width: 400px;
                margin: 0 auto;
            }
            .sweet-alert h2{
                font-size: 20px;margin: 25px 0 5px 0px;
            }
            .flatpanel{
                background: transparent !important;
                box-shadow: none !important;
            }

            .breadcrumb>.active {
                font-weight: bold;
                color: #2CACDE;
            }
            .dashboard-stat-2{
                border: 0px !important;
            }

            a[title='JavaScript charts']{
                display: none !important;
            }
            #user_dp:hover {
                opacity: 0.5;
            }
            .panel.forced-center{
                margin-left: auto; margin-right: auto;
            }

            .inlineList li{
                display: inline-block !important;
                padding: 15px;
            }

            .inlineList li:last-child{
                border-right: 0;
            }

            .inlineList li:first-child{
                padding-left: 0px;
            }
            .smallInput{
                box-shadow: none !important;
                font-size: 12px !important;
            }
            .w-100{
                width: 100px !important;
            }
            .theme-color{
                color: #2CACDE !important;
            }
            #RecordsTable tr {
                cursor: pointer;
            }

            .left-sidebar {
                background-color: #2CACDE;
                box-shadow: 0 2px 22px 0 rgba(0,0,0,.02), 0 2px 30px 0 rgba(0,0,0,.15) !important;
            }

            .navbar-header.navbar-header {
                background-color: #2CACDE;
                box-shadow: 0 -10px 30px 0 rgba(0,0,0,.15) !important;
            }

            .panel {
                /*  box-shadow: none !important;*/
                border-top: none !important;
            }
            .side-nav.side-nav {
                color: #ffffff !important;
            }

            .main-page.main-page{
                background-color: #ffffff;
            }

            .side-nav.side-nav .nav-header {
                color: #000000 !important;
            }

            #RecordsTable.table.table {
                font-size: 90%;
            }

            #RecordsTable.table.table.transactions-table{
                font-size: 80%;
            }

            .iframe-container {
                overflow: hidden;
                padding-top: 69%;
                position: relative;
            }

            .iframe-container iframe {
                border: 0;
                height: 100%;
                left: 0;
                position: absolute;
                top: 0;
                width: 100%;
            }

            .bold.bold {
                font-weight: bold;
            }

            .smalldata>span {
                margin: 5px 0px;
                display: inline-block;
            }

            .table>tbody>tr>td,
            .table>tbody>tr>th,
            .table>tfoot>tr>td,
            .table>tfoot>tr>th,
            .table>thead>tr>td,
            .table>thead>tr>th {
                padding: 15px;
            }

            html,body{
                background-color: #ffffff;
            }
            .topbar-container.topbar-container{
                background: #ECE9E6;  /* fallback for old browsers */
                background: -webkit-linear-gradient(to right, #FFFFFF, #ECE9E6);  /* Chrome 10-25, Safari 5.1-6 */
                background: linear-gradient(to right, #FFFFFF, #ECE9E6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

            }
            .topbar-container .page-title-div{
                background-color: transparent !important;
            }

            .grey-fade-bg{
                background: #ECE9E6;  /* fallback for old browsers */
                background: -webkit-linear-gradient(to right, #FFFFFF, #ECE9E6);  /* Chrome 10-25, Safari 5.1-6 */
                background: linear-gradient(to right, #FFFFFF, #ECE9E6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

            }

            .secretkey-hidden{
                visibility: hidden;
            }

            @media (min-width: 768px){
                .modal-content {
                    box-shadow: 0 5px 5px rgba(0,0,0,.5);
                }
            }
            .modal-content{
                border-radius: 3px;
            }

            .form-control{
                border-radius: 2px;
                box-shadow: inset 0px 2px 1px rgba(0,0,0,.075);
            }

            .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
                box-shadow: none;
                border-color: #66afe9;
                border-width: 2px;
            }
            .clickable{
                cursor: pointer !important;
            }
        </style>
        <link href="./css/spinner.css" rel="stylesheet" />
        <script src="./js/jquery/jquery-2.2.4.min.js"></script>
        <script>
            $(document).ready(function () {
                alert("Adewale");
                $('#IconURL').attr('href', IconURL);
                $('title').text(ApplicationName + ': Merchant Home');
            });
        </script>
    </head>

    <body class="top-navbar-fixed">
        <div class="main-wrapper" id="page-main">

        </div>
        <!-- /.main-wrapper -->

        <!-- ========== COMMON JS FILES ========== -->

        <script src="./js/jquery-ui/jquery-ui.min.js"></script>
        <script src="./js/bootstrap/bootstrap.min.js"></script>
        <script src="./js/pace/pace.min.js"></script>
        <script src="./js/lobipanel/lobipanel.min.js"></script>
        <script src="./js/iscroll/iscroll.js"></script>
        <script src="./js/counterUp/jquery.counterup.min.js"></script>
        <script src="./js/waypoint/waypoints.min.js"></script>
        <script src="./js/select2/select2.min.js"></script>
        <script src="./js/icheck/icheck.min.js"></script>
        <script src="./js/iziToast/js/iziToast.min.js"></script>
        <script src="./js/cropper.min.js"></script>
        <script src="./js/sweet-alert/sweetalert.min.js"></script>

        <script src="./js/prism/prism.js"></script>
        <script src="./js/amcharts/amcharts.js"></script>
        <script src="./js/amcharts/serial.js"></script>
        <script src="./js/amcharts/pie.js"></script>
        <script src="./js/amcharts/plugins/animate/animate.min.js"></script>
        <script src="./js/amcharts/plugins/export/export.min.js"></script>
        <link rel="stylesheet" href="./js/amcharts/plugins/export/export.css" type="text/css" media="all" />
        <script src="./js/amcharts/themes/light.js"></script>



        <script type="text/javascript" src="./datatables/JSZip-2.5.0/jszip.min.js"></script>
        <script type="text/javascript" src="./datatables/pdfmake-0.1.36/pdfmake.min.js"></script>
        <script type="text/javascript" src="./datatables/pdfmake-0.1.36/vfs_fonts.js"></script>
        <script type="text/javascript" src="./datatables/DataTables-1.10.18/js/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="./datatables/DataTables-1.10.18/js/dataTables.bootstrap.min.js"></script>
        <script type="text/javascript" src="./datatables/Buttons-1.5.4/js/dataTables.buttons.min.js"></script>
        <script type="text/javascript" src="./datatables/Buttons-1.5.4/js/buttons.bootstrap.min.js"></script>
        <script type="text/javascript" src="./datatables/Buttons-1.5.4/js/buttons.html5.min.js"></script>
        <script type="text/javascript" src="./datatables/Buttons-1.5.4/js/buttons.print.min.js"></script>
        <script type="text/javascript" src="./datatables/Responsive-2.2.2/js/dataTables.responsive.min.js"></script>
        <script type="text/javascript" src="./datatables/Responsive-2.2.2/js/responsive.bootstrap.min.js"></script>
        <script type="text/javascript" src="./datatables/Scroller-1.5.0/js/dataTables.scroller.min.js"></script>
        <script type="text/javascript" src="./datatables/Select-1.2.6/js/dataTables.select.min.js"></script>

        <!-- ========== PAGE JS FILES ========== -->
        <script src="./js/prism/prism.js"></script>

        <!-- ========== THEME JS ========== -->
        <script src="./js/main.js"></script>
        <script>
        $(function () {

        });
        </script>

        <!-- ========== ADD custom.js FILE BELOW WITH YOUR CHANGES ========== -->
        <script type="text/javascript" src="./globals.js"></script>
        <?php
        foreach (glob(getcwd() . '\components\*.js') as $file) {
            $filepathElements = explode('\\', $file);
            $currentFileName = end($filepathElements);
            echo '<script src="./components/' . $currentFileName . '?v=' . $querystring . '" type="text/babel"></script>';
        }
        ?>

        <script type="text/babel">
        ReactDOM.render(
                <App />,
                    document.getElementById("page-main")
                );
        </script>
    </body>

</html>