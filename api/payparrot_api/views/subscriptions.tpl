

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>PayParrot</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="/css/style.css" rel="stylesheet">
    <script data-main="/js/subscriptions" src="/js/libs/require.min.js"></script>
    <!-- link href='https://fonts.googleapis.com/css?family=Duru+Sans' rel='stylesheet' type='text/css' -->
    <!-- <link href="/css/bootstrap-responsive.css" rel="stylesheet"> -->
    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
      .pane{
        display:none;
      }
      /*.pane::first-child{
        display: block;
      }*/
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

      // (function() {
      //   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      //   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      //   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      // })();
      window.account_id = "{{account_id}}";

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
            <img src="/img/logo-mini.png">
          </a>
          <div class="nav-collapse">
            <ul id='navbar' class="nav">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Help <b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">Support</a></li>
                </ul>
              </li>
            </ul>
            <ul class="nav pull-right">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">My account <b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <!-- <li><a href="javascript:void(0);" class="muted">Billing</a></li> -->
                  <li><a href="/logout">Logout</a></li>
                </ul>
              </li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">

      <div class="row">
        <div class="span12">
          <h2>Please select a plan for your account</h2>
        </div>
      </div>

      <p>Your current plan: <span id='current-plan'></span></p>

      <div class="row" style="margin-top:50px;">
        <div class="span12 plans">
          <div class="pricing_column social">
            <div class="plan_title">Social</div>
            <div class="divider"></div>
            <div class="plan_tweets">
              <p>Parrots/month</p>
              25
            </div>
            <div class="divider"></div> 
            <div style="margin:25px 0;">
              <p>1 tweet / month</p>
            </div>
            <div class="divider"></div>             
            <button class='btn-success btn-large btn btn-set-plan' data='social'>Start</button>  
          </div>
          <div class="pricing_column standard">
            <div class="plan_title">Standard</div>
            <div class="divider"></div>
            <div class="plan_tweets">
              <p>Parrots/month</p>
              300
            </div>
            <div class="divider"></div>
            <div style="margin:25px 0;">
              <p>$25 / month</p>
            </div>
            <div class="divider"></div>                         
            <button class='btn-success btn-large btn btn-set-plan' data='standard'>Buy now</button>  
          </div>
          <div class="pricing_column pro">
            <div class="plan_title">Pro</div>
            <div class="divider"></div>
            <div class="plan_tweets">
              <p>Parrots/month</p>
              1000
            </div>
            <div class="divider"></div>
            <div style="margin:25px 0;">
              <p>$50 / month</p>
            </div>
            <div class="divider"></div>                                     
            <button class='btn-success btn-large btn btn-set-plan' data='pro'>Buy now</button>  
          </div>
          <div class="pricing_column premium">
            <div class="plan_title">Premium</div>
            <div class="divider"></div>
            <div class="plan_tweets">
              <p>Parrots/month</p>
              5000
            </div>
            <div class="divider"></div>
            <div style="margin:25px 0;">
              <p>$100 / month</p>
            </div>
            <div class="divider"></div>                         
            <button class='btn-success btn-large btn btn-set-plan' data='premium'>Buy now</button>  
          </div>                         
        </div>
        <div style="text-align:center;">
          <button class='btn btn-primary btn-small btn-cancel'>Cancel my subscription</button>
        </div>
      </div>

    
      <br>
      <div class="divider"></div>

      <footer>
        <p>&copy; PayParrot 2012</p>
      </footer>

    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    

  </body>
</html>
