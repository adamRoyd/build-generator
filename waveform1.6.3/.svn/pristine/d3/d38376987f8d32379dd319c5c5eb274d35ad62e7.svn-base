function Respondo()
{
	var self = this;
	self.screen_size = null;
	self.css_tag = null;

	self.dispatcher = $('<div id="dispatcher_respondo">');

	self.init = function ()
	{
		$(window).resize(self.checkScreenSize);
		self.checkScreenSize();
	}

	self.ready = function()
	{
		if( self.screen_size )
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	self.checkScreenSize = function ()
	{
		if ( devmode ) console.log( 'Log checkScreenSize' )
		self.screen_width = document.documentElement.clientWidth;

		var prev_screen_size = self.screen_size;

		var responsivemode = true;
		
		try {
			// ACTION

			responsivemode = masterObj.responsiveMode;

		
		}
		catch (e) {
		   if ( devmode ) console.log( 'Log CATCH ERROR %o', e )
		}
	
		if( responsivemode )
		{
			if (self.screen_width <= 768)
			{
				self.screen_size = 'phone';
			}
			else if (self.screen_width >= 769)
			{
				self.screen_size = 'desktop';
			}
		}
		else
		{
			self.screen_size = 'desktop';
		}
		
		
		if (prev_screen_size != self.screen_size)
		{
			self.updateSize();
		}
	}

	self.updateSize = function ()
	{
	    if (typeof loadCompiledCSSandJavascriptAndXML != 'undefined' && loadCompiledCSSandJavascriptAndXML == true) {
	        $('#ui_css').attr('href', 'lib/css/' + self.screen_size + '_compiled.css');
	    } else {
	        $('#ui_css').attr('href', 'lib/css/' + self.screen_size + '/ui.css');
	    }
		self.dispatcher.trigger('updateSize');
	}

	self.desktop = function ()
	{
		return Boolean(self.screen_size == 'desktop');
	}

	self.phone = function ()
	{
		return Boolean(self.screen_size == 'phone');
	}

}
