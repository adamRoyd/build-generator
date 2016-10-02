function BoxElementView( m )
{		
	var self = this ;
	ScreenElementView.call(self, m);
	
	self.setContent = function()
	{
		self.oContent.width( '100%' );
		self.oContent.height( '100%' );
		self.oContent.addClass( 'background' );
		
		if( !self.xml_node.attr('bgcol') )
		{
			//self.oContent.css( 'background-color', tidyColour( "FFFFFF" ) );
		}
		else
		{
			self.oContent.css( 'background-color', tidyColour( self.xml_node.attr('bgcol') ) );
			self.oContent.css( 'opacity', Number( self.xml_node.attr('bgalpha') ) );
		}
		
		if( self.xml_node.attr('scroll')=='true' )
		{
			self.oDiv.addClass( 'scrolling' )
		}
		
		if( self.xml_node.attr('corner') )
		{
			self.oContent.css( 'border-radius', self.xml_node.attr('corner') );
		}
		
		if( self.xml_node.attr('linewidth') || self.xml_node.attr('linecol') )
		{
			self.oContent.css( 'border-width', self.xml_node.attr('linewidth')  + "px" );
			self.oContent.css( 'border-color', tidyColour( self.xml_node.attr('linecol') ) );
			self.oContent.css( 'border-style', "solid" );
			self.oContent.css( 'border-radius', self.oContent.corner );
		}
		
		self.oDiv.append(self.oContent);
		
		self.appendChildren( self.xml_node )
		
	}
}
BoxElementView.prototype = ScreenElementView;