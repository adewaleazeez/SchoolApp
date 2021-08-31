<?php 
    $querystring = time();
?>
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
        <link rel="stylesheet" href="./css/font-awesome.min.css" media="screen" >
        <link rel="stylesheet" href="./css/animate-css/animate.min.css" media="screen" >

        <!-- ========== PAGE STYLES ========== -->
        <link rel="stylesheet" href="./css/icheck/skins/flat/blue.css" >

        <!-- ========== THEME CSS ========== -->
        <link rel="stylesheet" href="./css/main.css" media="screen" >

        <!-- ========== MODERNIZR ========== -->
        <script src="./js/modernizr/modernizr.min.js"></script>
        
        <script src="react/react.development.js" crossorigin></script>
        <script src="react/react-dom.development.js" crossorigin></script>
        <script src="react/babel.min.js"></script>
        <style>
        body{
            background-image: url(images/bg.jpg);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: 0px -145px;
        }
        .bg-gray {
            background-color: rgba(0,0,0,0.5);
        }
        </style>
        <link href="./css/spinner.css" rel="stylesheet" />
        <script src="./js/jquery/jquery-2.2.4.min.js"></script>
        <script>
            $(document).ready(function(){
                $('#IconURL').attr('href', IconURL);
                $('title').text(ApplicationName +': Merchant Home');
            });
        </script>
    </head>
    <body class="">
        <div class="main-wrapper">

            <div class="login-bg-color" style="background: rgba(255,255,255,0.3);">
                <div class="row">
                    <div class="col-md-4 col-md-offset-4">
                        <div class="panel login-box" id="login-container" style="box-shadow: none; background: transparent;">
                            
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
        
        <script src="./js/jquery-ui/jquery-ui.min.js"></script>
        <script src="./js/bootstrap/bootstrap.min.js"></script>
        <script src="./js/pace/pace.min.js"></script>
        <script src="./js/lobipanel/lobipanel.min.js"></script>
        <script src="./js/iscroll/iscroll.js"></script>

        <!-- ========== PAGE JS FILES ========== -->
        <script src="./js/icheck/icheck.min.js"></script>

        <!-- ========== THEME JS ========== -->
        <script src="./js/main.js"></script>
        <script>
            $(function(){
                
            });
        </script>

        <script type="text/javascript" src="./globals.js?v=<?php echo $querystring; ?>"></script>
        <script src="./components/login.js?v=<?php echo $querystring; ?>" type="text/babel"></script>
        <script src="./components/spinner.js?v=<?php echo $querystring; ?>" type="text/babel"></script>
        <script type="text/babel">
            ReactDOM.render(
            <Login />,
                document.getElementById("login-container")
            );
        </script>
    </body>
</html>
