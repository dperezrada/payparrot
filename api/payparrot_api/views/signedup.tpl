%if status:
	<div class="alert alert-success">
		Thanks for signing up. You can now log in.
	</div>

    <form action="/login" method="POST">
      <table class="table">
        <tr>
          <td>E-Mail</td>
          <td><input type='text' name='email'></td>
        </tr>
        <tr>
          <td>Password</td>
          <td><input type='password' name='password'></td>
        </tr>            
        <tr>
          <td></td>
          <td><input type="submit" name="" class="btn"></td>
        </tr>                        
      </table>
    </form>
%else:
	<div class="row">
		<div class="span12">
			<div class="alert alert-error">The selected e-mail address is alredy in use. Please try with anoher one.</div>
		    <div class="span6"  style="text-align:left;margin-top:0px">
		      
		      <form id='signup-form' class="form-horizontal" action='/signup' method='POST'>
		      	<fieldset>
		      		<div class="control-group">
		      			<label class="control-label"></label>
		      			<div class="controls">
							<h4 style="">Create a new account</h4>
		      			</div>
		      		</div>
		      	</fieldset>
		        <fieldset>
		          <div class="control-group">
		            <label class="control-label" for="input01">Company Name</label>
		            <div class="controls">
		              <input type="text" class="input-xlarge" id="input01" name="company" value="{{company}}">
		            </div>
		          </div>
		          <div class="control-group">
		            <label class="control-label" for="input01">Personal Name</label>
		            <div class="controls">
		              <input type="text" class="input-xlarge" id="input01" name="name" value="{{name}}">
		            </div>
		          </div>
		          <div class="control-group">
		            <label class="control-label" for="input01">E-Mail</label>
		            <div class="controls">
		              <input type="text" class="input-xlarge" id="input01" name="email" value="{{email}}">
		            </div>
		          </div>
		          <div class="control-group">
		            <label class="control-label" for="input01">Password</label>
		            <div class="controls">
		              <input type="password" class="input-xlarge" id="input01" name="password" value="{{password}}">
		            </div>
		          </div>                                       
		          <div class="form-actions">
		            <button type="submit" class="btn btn-success btn-large">Create my account</button>
		          </div>
		        </fieldset>
		      </form>          
		    </div>
		</div>
    </div>
%end
%rebase layout