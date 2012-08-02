<div class="row">
	<div class="span8">
		<h3>Notifications settings</h3><br>
		<form id='notification-url-data'>
		<table class="table">
			<tr>
				<td>
					<p>
						Redirect URL: 
						<small>URL Where Parrots will be redirected after creating the subscription. This url also needs to receive PayParrots parameters</small>
					</p>
					
				</td>
				<td>
					<input type='text' value='<%= callback_url %>' name='callback_url'>
				</td>
			</tr>
			<tr>
				<p>
					Notifications URL: 
					<small>URL Where will post notifications to your server <a href="#">Learn more</a> </small>
				</p>
				</td>
				<td>
					<input type='text' value='<%= notification_url %>' name='notification_url'>
				</td>
			</tr>
			<tr>
				<td></td>
				<td><button class="edit btn btn-primary">Edit</button></td>
			</tr>
		</table>
		</form>
	</div>
	<div class="span4">
		<h3>How notifications works?</h3>
		<p>
			PayParrot has to channels to communicate with your server. 
			<h4>Redirections</h4>
			<p> Every time that users generate subscriptions to your service through PayParrot he will be redirected yo a custom URL that you provide us. That URL goes with a POST method with parameters about "subscription_activated" notifications.</p>
			<h4>Server notifications</h4>
			<p> Every time that an action is executed regarding a Parrot, we notify your servers with this informations. There are four types of notifications:
				<ul>
					<li>
						subscription_activated
						<small>When a subscription is activated. POST data also goes with a custom parameter that you defined in the payment button (i.e., your internal user id, or your internal subscription id).</small>
					</li>
					<li>
						payment_success
						<small>Sent each time a payment (tweet) trhough a Parrot's twitter account is made successfully.</small>
					</li>
					<li>
						<small>Sent each time a payment (tweet) trhough a Parrot's twitter account failed (revoked acces).</small>
					</li>
					<li>
						subscription_deactivated
						<small>Sent when a Parrot cancel the subscription to your service, or when more than 3 failed payments ocurred.</small>
					</li>															
				</ul>
			</p>
			For more information, please read de <a href="#">API & Integration documentation</a>.
		</p>
	</div>
</div>


<div class="row">
	<div class="span6">

	</div>
</div>