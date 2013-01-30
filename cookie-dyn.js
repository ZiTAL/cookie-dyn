var cookie = function(params)
{
	var _params = {};

	this.__construct = function(params)
	{
		for(var i in params)
			_params[i] = params[i];
	};

	this.set = function(params)
	{
		this.setSync(params);
		this._executeCallback(params);
	};

	this.setSync = function(params)
	{
		var text = params['name']+"="+params['value'];
        if(params['expires'])
			text = text+"; expires="+params['expires'];

		var dyn_cookies = this._getDyn();
		dyn_cookies.push(text);

		_params['res'].setHeader('Set-Cookie', dyn_cookies);
	};

	this.remove = function(params)
	{
		this.removeSync(params);
		this._executeCallback(params);
	};

    this.removeSync = function(params)
    {
        var past = new Date(new Date().getTime()-1).toUTCString();
        var text = params['name']+"=todelete; expires="+past;

		var dyn_cookies = this._getDyn();
		dyn_cookies.push(text);

        _params['res'].setHeader('Set-Cookie', dyn_cookies);
    };

	this._getStaticList = function()
	{
		var cookies_list = [];

		var text = _params['req'].headers.cookie;
		var m = text.match(/(|;\ )([^=]+)=([^;\ ]+|[^$]+)/g);

		if(m.length>0)
		{
			for(var i in m)
			{
				var s = m[i].match(/([^=;\ ]+)=([^$]+)/);
				if(s.length==3)
				{
					cookies_list.push(
					{
						name: s[1],
						value: s[2]
					});
				}
			}
		}
		return cookies_list;
	};

	this._getDynamicList = function()
	{
		var cookies_list = [];
		var list = this._getDyn();
		for(var i in list)
		{
			var s = list[i].match(/([^=]+)=([\s\S]+);\ expires/);
			if(s===null)
				s = list[i].match(/([^=]+)=([^$]+)/);

			if(s!==null)
			{
				cookies_list.push(
				{
					name: s[1],
					value: s[2]
				});
			}
		}

		return cookies_list;

	};

	this.get = function(params)
	{
		var result = this.getSync(params);
		params['result'] = result;
		this._executeCallback(params);
	};

	this.getSync = function(params)
	{
		var sum = [];

		var cookies_list = this._getStaticList();
		for(var i in cookies_list)
			sum.push(cookies_list[i]);

		cookies_list = this._getDynamicList();
		for(i in cookies_list)
			sum.push(cookies_list[i]);

		if(params['name'])
		{
			for(i in sum)
			{
				if(typeof(sum[i]['name'])!='undefined' && typeof(sum[i]['value'])!='undefined' && sum[i]['name']==params['name'])
					return sum[i]['value'];
			}
			return false;
		}
		else
			return sum;
	};

	this._executeCallback = function(params)
	{
		if(typeof(params['callback'])=='function')
			params['callback'](params);
	};

	this._hasDyn = function()
	{
		if(typeof(_params['res'].getHeader('set-cookie'))=='object')
			return true;
			
		return false;
	};

	this._getDyn = function()
	{
		if(this._hasDyn())
			return  _params['res'].getHeader('set-cookie');

		return [];
	};

	this.__construct(params);
};

/*
var c = new cookie(req, res);
c.set('user', 'black.wolf');
console.log(c.getSync('Cookie'));
c.removeSync('Cookie');
*/

module.exports = cookie;