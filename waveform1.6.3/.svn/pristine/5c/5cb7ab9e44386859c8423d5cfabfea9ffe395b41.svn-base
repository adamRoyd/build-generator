function PagecounterView( m )
{
	var self = this ;
	BoxElementView.call( self, m );
	
	self.contentstring = self.xml_node.text();
	
	self.type = self.xml_node.attr('type');
	self.allow_jump = self.xml_node.attr('jump');
	self.oDiv.addClass('pagecounter');
	

	self.update = function()
	{
		if( currentScreen )
		{
			self.current_page_number = Number( masterObj.getScreenPosById( currentScreen.id ) ) + 1;
			self.total_page_number = Number( currentTopic.arScreens.length );
			switch( self.type )
			{
				case 'text': self.displayText();
					break;
				//case 'bar': self.displayBar();
				//	break;
				case 'icons':
				default: self.displayIcons();
					break;
			}
		}
	}
	
	self.displayText = function()
	{
		self.oDiv.find('.from').empty().append( String( self.current_page_number ) );
		self.oDiv.find('.to').empty().append( String( self.total_page_number ) );
	}
	
	self.displayIcons = function()
	{
		self.oDiv.empty();
		for( var i = 0; i < currentTopic.arScreens.length; i++ )
		{
			var item = currentTopic.arScreens[ i ];
			var $item = $( '<div class="screen" />' );
			$item.data('screen', item)
			if ( item.getVisited() ) 
			{
				$item.addClass("visited")
			}
			
			if( item == currentScreen )
			{
				$item.addClass("current")
			}
			
			if (item.getScored()) 
			{
				$item.addClass("scored")
				if( item.getAnswered() )
				{
					if (item.getPassed()) 
					{
						$item.addClass("passed")
					}
					else
					{
						$item.addClass("failed")
					}
				}
			}
			
			
			self.oDiv.append( $item );
			if( self.allow_jump )
			{
				applyClick( $item,
					function() 
					{
						var elm = $(this).data( 'elm' )
						var screen = elm.data( 'screen' );
						if ( screen.getVisited() ) 
						{
							jumpScreen( screen.id );
						}
					}
				)
			}
		}
		
	}
	
	// self.displayBar = function()
	// {
	// }
	
}
PagecounterView.prototype = BoxElementView;