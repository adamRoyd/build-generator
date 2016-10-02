function StatusElementView( m )
{
	var self = this ;
	ScreenElementView.call( self, m );
	
	self.topicArray = [] ;
	self.topicIDArray = self.xml_node.attr( 'topic' ).split(',') ;
	
	self.setContent = function()
	{
		for( var i = 0; i < self.topicIDArray.length; i++ )
		{
			self.topicArray.push( masterObj.getTopicById( self.topicIDArray[ i ] ) ) ;
		}
		
		self.topicStatusCSS = "topicStatus" ;
		
		if(  self.xml_node.attr( 'useStatusCSS' ))
		{
			self.topicStatusCSS =  self.xml_node.attr( 'useStatusCSS' );
		}
		
		self.oContent.attr( "class", self.topicStatusCSS + " notattempted" );		
		
		self.oDiv.append(self.oContent);	
		self.setupTopicListener() ;
	}
	
	self.updateStatus = function()
	{
		var notattemptedCount = 0 ;
		var incompleteCount = 0 ;
		var completedCount = 0 ;
		var lockedCount = 0 ;
		
		for( var i = 0; i < self.topicArray.length; i++ )
		{
			var topicObject = self.topicArray[ i ];
			switch( topicObject.getStatus() )
			{
				case 'notattempted' : notattemptedCount++ ; break ;
				case 'incomplete' : incompleteCount++ ; break ;
				case 'completed' : completedCount++ ; break ;
				case 'passed' : completedCount++ ; break ;
				case 'locked' : lockedCount++ ; break ;
			}			 
		}
		
		var totalStatus = "notattempted" ;
		
		if( completedCount > 0 )
		{
			totalStatus = "completed" ;
		}
		
		if( notattemptedCount > 0 )
		{
			totalStatus = "notattempted" ;
		}
		
		if( notattemptedCount > 0 && completedCount > 0 )
		{
			totalStatus = "incomplete" ;
		}
		
		if( incompleteCount > 0 )
		{
			totalStatus = "incomplete" ;
		}
		
		if( lockedCount == self.topicArray.length )
		{
			totalStatus = "locked" ;
		}
		
		self.oContent.attr( "class", self.topicStatusCSS + " " + totalStatus );
	}
	
	self.setupTopicListener = function()
	{
		for( var i = 0; i < self.topicArray.length; i++ )
		{
			var topicObject = self.topicArray[ i ];
			if( topicObject )
			{
				topicObject.dispatcher.bind( 'statusupdated', self.updateStatus  ) ;
			}
		}
		self.updateStatus();
	}
	
	
}
StatusElementView.prototype = ScreenElementView;