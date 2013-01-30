cookie-dyn
==========

cookies library for node.js with dynamic cookies support

example:
```
var http = require('http');
var cookie = require('cookie-dyn');
var server = http.Server(function(req, res)
{
	var expires = new Date(new Date().getTime()+86409000).toUTCString();

	var c = new cookie(
	{
		req: req,
		res: res
	});

	c.set(
	{
		name:		'user',
		value:		'źital',
		expires:	expires,
		callback:	function()
		{
			console.log('set: user -> zital');
		}
	});

	c.setSync(
	{
		name: 'userSync',
		value: 'zital'
	});
	console.log('set: userSync -> zital');

	c.get(
	{
		name: 'user',
		callback: function(params)
		{
			console.log("get: user -> "+params['result']);
		}
	});

	console.log("get: userSync -> "+ c.getSync(
	{
		name: 'userSync'
	}));

	c.remove(
	{
		name: 'user',
		callback: function(params)
		{
			console.log('remove: user');
		}
	});
	c.removeSync({name: 'userSync'});
	console.log('remove: userSync');

	res.end('watch: Firebug -> Cookies');
});
server.listen(8000);

```