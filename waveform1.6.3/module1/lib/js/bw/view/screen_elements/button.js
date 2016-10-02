function ButtonElementView( m )
{
	var self = this ;
	ScreenElementView.call( self, m );
	
	self.setContent = function()
	{
		self.oContent.addClass('btn');
		
		
		
		// applyClick( self.oDiv, click_function );
		
		self.oContent.append( $( self.oModel.oXML ).text() );
		
		self.oDiv.append(self.oContent);
		
	}
	
	
}
ButtonElementView.prototype = ScreenElementView;