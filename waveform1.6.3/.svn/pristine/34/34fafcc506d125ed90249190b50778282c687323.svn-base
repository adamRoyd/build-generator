function TextElementView( m )
{		
	var self = this ;
	ScreenElementView.call(self, m);
	self.view = self ;
	
	self.setContent = function()
	{
		self.oContent.remove();
		// if ( devmode ) console.log( 'Log TEXT OBJECT SET CONTENT ' + self.oModel.id )
		if( self.xml_node.attr( 'type' ) == 'input' )
		{	
			self.oContent = document.createElement("textArea");
			$(self.oContent).css( 'padding', '5px');
			$(self.oContent).css( 'width', self.xml_node.attr( 'width' ));
			$(self.oContent).css( 'height', self.xml_node.attr( 'height' ));
			$(self.oContent).css( 'box-sizing', 'border-box' );
			$(self.oContent).css( 'resize', 'none' );
			
			var initialVal = self.xml_node.text()
			$(self.oContent).attr("initialVal",initialVal)
			$(self.oContent).val(initialVal);
			
			$(self.oContent).focus(function(){
				if ( self.value == $(self).attr("initialVal") ) {
					self.value = "";
				}
			});
			
			if (self.oContent.addEventListener) 
			{
				self.oContent.addEventListener('input', function() 
				{
					// event handling code for sane browsers
					self.screen_view.doEventById("inputUpdated") ;
					
					
					coursetextObj.storeText( self.value, self.xml_node.attr( 'id' )  )
				}, 
				false);
			} 
			else if (self.oContent.attachEvent) 
			{
				self.oContent.attachEvent('onpropertychange', function() 
				{
					self.screen_view.doEventById("inputUpdated") ;
					
					//courseTextObj.storeText( )
				});
			}		
		}
		else
		{
			
			var fullText = self.xml_node.text()  ;
			
			fullText = doStringReplacements( fullText ) ;
			
			self.oContent = $(fullText);
			
			if( self.xml_node.attr('scroll') && self.xml_node.attr('scroll') == "true" )
			{
				self.oDiv.css('overflow', 'auto');
			}
		}
		
		self.oDiv.append(self.oContent);
	}
	
	self.update = function(  )
	{
		self.setContent();
		
	}
	
}
TextElementView.prototype = ScreenElementView;