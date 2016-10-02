function SubScreenView( m )
{		
	var self = this ;
	ScreenElementView.call(self, m);
		
	self.screenObject = new SubScreen( self.xml_node );
	self.autoload = true;
	
	self.setContent = function()
	{
		
		if( self.xml_node.attr('autoload') == 'false' )
		{
			self.autoload = false;
		}
		
		if( self.xml_node.attr('scroll') == 'true' )
		{
			self.oDiv.addClass( 'scrolling' )
		}
		
		self.oDiv.data('subScreenView', self )
		
		if( self.autoload )
		{
			self.load();
		}
	}
	
	self.load = function()
	{
		if ( devmode ) console.log( 'Log LOAD SUB SCREEN'  )
		self.screenObject.dispatcher.bind( 'loaded', self.subScreenLoaded );
		self.screenObject.initScreen( self.oDiv )
	}
	
	self.subScreenLoaded = function(  )
	{
		if ( devmode ) console.log( 'Log SUB SCREEN LOADED'  )
		self.screenObject.show();
	}
	
	self.super_kill = self.kill;
	self.kill = function(  )
	{
		if ( devmode ) console.trace( "KILL SUB SCREEN " + self.oModel.id );
		self.screenObject.kill();
		
		self.super_kill()
	}
	
}
SubScreenView.prototype = ScreenElementView;