function ScoreElementView( m )
{
	var self = this ;
	ScreenElementView.call( self, m );
	
	self.contentstring = self.xml_node.text();
	
	self.stars = [];
	
	self.source = null;
	if( self.xml_node.attr( 'source' ) )
	{
		self.source = self.xml_node.attr( 'source' );
	}
	self.initscore = 0;
	if( self.xml_node.attr( 'initscore' ) )
	{
		self.initscore = Number( self.xml_node.attr( 'initscore' ) );
	}
	self.maxscore = 100;
	if( self.xml_node.attr( 'maxscore' ) )
	{
		self.maxscore = Number( self.xml_node.attr( 'maxscore' ) );
	}
	self.passscore = 80;
	if( self.xml_node.attr( 'passscore' ) )
	{
		self.passscore = Number( self.xml_node.attr( 'passscore' ) );
	}
	if( self.xml_node.attr( 'incrementevent' ) )
	{
		self.incrementevent = self.xml_node.attr( 'incrementevent' );
	}
	
	self.topic = null;
	if( self.xml_node.attr( 'topic' ) )
	{
		self.topic = masterObj.getTopicById( self.xml_node.attr( 'topic' ) );
	}
	
	self.score = self.initscore;
	self.displayScore = self.score;
	
	self.setContent = function()
	{
		if( self.source )
		{
			self.score = Number( trackingObj.getCustomData( self.source ) );
			if( isNaN( self.score ) )
			{
				self.score = self.initscore;
			}
		}
		//self.oDiv.append( scorebg )
		self.oDiv.append(self.oContent);
		self.bar = $( '<div class="bar" />' )
		self.oContent.append( self.bar );
		self.set( self.score );
	}
	
	self.applyScore = function()
	{
		/*self.oContent = self.contentstring;
		self.oContent = self.oContent.split( '[score]' ).join( String( Math.round( self.displayScore ) ) );
		self.oDiv.empty().append(self.oContent);	*/
		
		var old_count = self.stars.length;
		var new_score = self.displayScore
		
		
		//self.oContent.find('.update_score').empty().append( $( '<p>' + new_score + '/' + self.maxscore + '</p>' ) );
		

			var percent = ( new_score / self.maxscore ) * 100;
			self.bar.css( 'width', percent + '%' );
		
	}
	
	self.increase = function( n )
	{
		self.set( Number ( self.score ) + Number( n ) );
	
	}
	
	self.decrease = function( n )
	{
		self.set( Number ( self.score ) - Number( n ) );
	}
	
	self.reset = function( )
	{
		self.displayScore = self.initscore;
		self.score = self.initscore;
		self.set( self.score );
		self.applyScore ( );
	}
	
	self.set = function( n )
	{
		if( ( n > self.score ) && ( n <= self.maxscore ) )
		{
			self.screen_view.doClickById( self.incrementevent )
		}
		self.score = n;
		
		if( self.score >= self.maxscore )
		{
			self.score = self.maxscore;
		}
		
		trackingObj.setCustomData( self.source, self.score )
		if( self.topic )
		{
			self.topic.setScore ( Math.round( ( self.score / self.maxscore ) * 100 ) );
		}
		
		tweenTo( self, 0.5, {displayScore: self.score, onUpdate: self.applyScore });
		
		if( self.score >= self.passscore )
		{
			self.screen_view.doClickById( self.xml_node.attr( 'passevent' ) )
		}
		else
		{
			self.screen_view.doClickById( self.xml_node.attr( 'failevent' ) )
		}
	}
	
}
ScoreElementView.prototype = ScreenElementView;