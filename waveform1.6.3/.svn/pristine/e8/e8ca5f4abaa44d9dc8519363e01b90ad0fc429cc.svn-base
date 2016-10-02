function LineElementView( m )
{		
	var self = this ;
	ScreenElementView.call(self, m);
	
	self.setContent = function()
	{
		self.oContent.width( xml_node.attr('x2') - xml_node.attr('x') );
		self.oContent.height( xml_node.attr('y2') - xml_node.attr('y') );
		
		self.oContent.css( 'border-color', tidyColour( xml_node.attr('colour') ) );
		self.oContent.css( 'border-width', xml_node.attr('weight') );
		self.oContent.css( 'border-style', 'dashed' );
		self.oContent.css( 'border-right', 'none' );
		self.oContent.css( 'border-bottom', 'none' );
		
		self.oDiv.append(self.oContent);
	}
}
LineElementView.prototype = ScreenElementView;