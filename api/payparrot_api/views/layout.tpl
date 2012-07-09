

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>PayParrot</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="/css/web.css" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Duru+Sans' rel='stylesheet' type='text/css'>
    <!-- <link href="/css/bootstrap-responsive.css" rel="stylesheet"> -->
    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
    </style>

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="https://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    <script type="text/javascript">

      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-30870849-1']);
      _gaq.push(['_setDomainName', 'payparrot.com']);
      _gaq.push(['_setAllowLinker', true]);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();

    </script>   
  </head>

  <body>

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#" style="padding:5px 10px;">
      <img src="/img/logo.png">
          </a>
          <div class="nav-collapse pull-right">
            <ul class="nav">
              <li class="active"><a href="#">Home</a></li>
              <!-- <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li> -->
              <li><a href="/login">Login</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">

      %include

    <footer>
      <br>
      <div class="divider"></div>      
      <p>&copy; PayParrot 2012</p>
    </footer>
    </div> <!-- /container -->


  

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script data-main="js/web" src="js/libs/require.min.js"></script>

  </body>
</html>
