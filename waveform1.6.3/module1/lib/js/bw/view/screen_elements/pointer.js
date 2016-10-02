/**
* @author Andy Galletly
*/

function PointerElementView( m )
{		
	var self = this ;
	ScreenElementView.call( self, m );
	
	
	self.setContent = function()
	{
		self.arrow = $( '<div class="arrow" />' );
		self.arrow.css( 'border', 'solid' );
		self.arrow.css( 'border-color', tidyColour( $(self.oModel.xml).attr("colour") ) );
		self.arrow.css( 'border-width', $(self.oModel.xml).attr("width")/2 );
		self.oDiv.append( self.arrow );
	}
	
	
	
}
PointerElementView.prototype = ScreenElementView;
