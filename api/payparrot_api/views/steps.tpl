

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
    <script data-main="/js/steps" src="/js/libs/require.min.js"></script>
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

      <!-- Main hero unit for a primary marketing message or call to action -->

      <div class="subnav steps" style='margin-top:0px'>
        <ul class='nav nav-pills'>
          <li class='active'><a href='javascript:void(0)'> <span class="badge badge-default">1</span> Tweeting messages</a></li>
          <li><a href='javascript:void(0)'> <span class="badge badge-info">2</span> Company picture</a></li>
          <li><a href='javascript:void(0)'> <span class="badge badge-info">3</span> Notification URLs</a></li>          
        </ul>
      </div>
      <div class="progress progress-striped active" style='margin-top:10px;'>
        <div class="bar" style="width: 25%;"></div>
      </div>

      <div class="alert alert-error" style="display:none;"></div>

      <div id='setup-messages' class="row pane" style="display:block;margin-bottom:0px;margin-top:00px;">
        <div class="span12">
          <h3>Set up your tweeting messages</h3>
          <p>Every time a user wants to get your service in exchange of a monthly tweet, we will randomly pick one of your messages to send on his behalf. Select a couple of messages to start. You can edit them later.</p>
          <hr>
        </div>
        <div class="span12">
          <form id='form-data-messages' class='form-inline' onSubmit='return false;'>
            <label class="control-label" for="input01">Message 1</label>
            <fieldset>
              <input type="text" class="span8 input-small" placeholder="Message (115 characters)" name="message1" maxlength=115>
              <input type="text" class="span3 input-small" placeholder="URL" name="url1">
            </fieldset>
            <label class="control-label" for="input02">Message 2</label>
            <fieldset>
              <input type="text" class="span8 input-small" placeholder="Message (115 characters)" name="message2" maxlength=115>
              <input type="text" class="span3 input-small" placeholder="URL" name="url2">
            </fieldset>
            <label class="control-label" for="input03">Message 3</label>
            <fieldset>
              <input type="text" class="span8 input-small" placeholder="Message (115 characters)" name="message3" maxlength=115>
              <input type="text" class="span3 input-small" placeholder="URL" name="url3">
            </fieldset>
            <div class="form-actions">
                <button type="submit" class="btn btn-success btn-next">Next step</button>
            </div>
          </form>
        </div>
      </div>

      <div id='setup-logo' class="row pane" style="margin-bottom:0px;margin-top:00px;">
        <div class="span12">
          <h3>Company logo</h3>
          <p>We don't host your logo. Please provide us a link direct to your image</p>
          <hr>
        </div>
        <div class="span12">
          <form id='form-data-logo' class='form-inline' onSubmit='return false;'>
            <label class="control-label" for="input01">Link to your image</label>
            <fieldset>
              <input type="text" class="span3 input-small" placeholder="URL" name="url">
            </fieldset>
            <div class="form-actions">
                <button type="submit" class="btn btn btn-back">Back</button>
                <button type="submit" class="btn btn-success btn-next">Next step</button>
            </div>
          </form>
        </div>
      </div>

      <div id='setup-notifications' class="row pane" style="margin-bottom:0px;margin-top:00px;">
        <div class="span12">
          <h3>Notification and Redirect URLs</h3>
          <p>Redirect URL is where PayParrot redirects a user after a payment, with parameters about that payment</p>
          %if notifications_active:
            <p>Notification URL is where PayParrot send POST requests with parameters, after every action related to your account (subscription created, payent executed, subscription cancelled, etc)</p>
          %end
          <hr>
        </div>
        <div class="span12">
          <form id='form-data-notifications' class='form-inline' onSubmit='return false;'>
            <label class="control-label" for="input01">Redirect URL</label>
            <fieldset>
              <input type="text" class="span3 input-small" placeholder="URL" name="url1">
            </fieldset>
            %if notifications_active:
              <label class="control-label" for="input01">Notification URL</label>
              <fieldset>
                <input type="text" class="span3 input-small" placeholder="URL" name="url2">
              </fieldset>
            %end
            <div class="form-actions">
                <button type="submit" class="btn btn btn-back">Back</button>
                <button type="submit" class="btn btn-success btn-finish">Set up my account</button>
            </div>
          </form>
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
