/**
* @author Andy Galletly
*/
function Topic(xml_node) 
{
	var self = this ;
	
	self.score_data_prefix = 'score';
	
	self.xml = xml_node;
	self.id = self.xml.attr("id");
	self.index = null;
	self.iGroup = self.xml.attr("group");
	self.sLabel = self.xml.attr("label");
	self.sLongLabel = self.xml.attr("longlabel");
	if(!self.sLongLabel)
	{
		self.sLongLabel = self.sLabel;
	}
	self.attempts = 0;
	self.assessment = Boolean(self.xml.attr("assessment")=="true");
	self.locked = Boolean(self.xml.attr("locked")=="true");
	self.mastery_score = Number(self.xml.attr("masteryscore"));
	self.iBestScore = 0;
	self.iCurrentScore = 0;
	self.iPassed = 0;
	self.allScreens = new Array();
	self.arScreens = new Array();
	
	self.completed = false;
	
	self.resourcesID = null;
	
	self.dispatcher = $(document.createElement('div'));	
	self.dispatcher.attr('id', ('dispatcher_' + self.id ));
	
	
	if( self.xml.attr( "resourcesid" ) )
	{
		self.resourcesID = self.xml.attr( "resourcesid" );
	}
	
	self.iCurrentPos = 0;
	
	self.status = "notattempted";
	if( self.locked )
	{
		self.status = "locked";
	}
	
	self.initialise = function(  )
	{
		trackingObj.dispatcher.bind('ready', self.setStatusFromTracking);
	}
	
	self.createScreens = function () 
	{
	    var screens = new Array();
		var topic_id = self.id;
	    $(self.xml).find('page').each(function () 
	    {
	        var screen = new TopicScreen($(self), self);
	        screens.push(screen);
	    })
	    self.allScreens = screens;
	    screens = null;
	}
	
	self.createScreenArray = function()
	{
		for (var i=0; i<self.xml.children().length; i++) 
		{
			var node = $( self.xml.children()[i] );
			
			if( node.prop( 'nodeName' ) == "pool")
			{
				var pool_xml = node;
				
				var sort_array = new Array();
				
				for(var a = 0; a<pool_xml.children().length; a++)
				{
					sort_array.push( a );
				}
				
				var serve = Number( pool_xml.attr( 'serve' ) );
				var rand = pool_xml.attr('randomise') == "true";
				
				if(rand)
				{
					var rand_array = new Array();
					rand_array = sort_array.sort(function() {return 0.5 - Math.random()})
					sort_array = rand_array;
				}
				
				
				var n = 0;
				while (n < serve) 
				{
					var num = Number( sort_array[n] );
					
					var screen_node = $( pool_xml.children()[ sort_array[n] ] );
					
					var screenObj = new TopicScreen(screen_node, self);
						self.arScreens.push( screenObj )
						n++;
				}
			} 
			else
			{
				var screenObj = new TopicScreen(node, self);
				self.arScreens.push( screenObj )
				
			}
		}
		
		for( var i = 0; i < self.arScreens.length; i++ )
		{
			var screen = self.arScreens[ i ];
			screen.dispatcher.bind( 'passed', self.updateScore ) ;
			screen.dispatcher.bind( 'failed', self.updateScore ) ;
			screen.dispatcher.bind( 'completed', self.updateStatus ) ;
		}
		
	}
	
	self.setScore = function( n )
	{
		self.iCurrentScore = Number( n );
		
		if ( devmode ) console.log( 'Log TOPIC '+self.id+' SCORE '+self.iCurrentScore+' > '+self.iBestScore )
		
		if( self.iCurrentScore > self.iBestScore )
		{
			self.iBestScore = self.iCurrentScore;
			trackingObj.updateScore();
		}
		self.updateStatus();
	}
	
	self.updateScore = function()
	{
		var score = 0;
		var scored_screens = 0;
	
		for( var i = 0; i < self.arScreens.length; i++ )
		{
			var screen = self.arScreens[i];
			if( screen.getScored() )
			{
				scored_screens ++;
				if( screen.getPassed() )
				{
					score ++;
				}
			}
		}
	
	
		var percent =  Math.round( ( score / scored_screens )  * 100 );
	
		self.iCurrentScore = percent;
		self.iPassed = score;
		if( !isNaN(self.iCurrentScore) )
		{
			if( ( self.iCurrentScore > self.iBestScore ) /*&& self.getAssessment()*/ )
			{
				self.iBestScore = self.iCurrentScore ;
			}
		}
		
		
		trackingObj.setCustomData( self.score_data_prefix+self.id, self.iBestScore );
		trackingObj.updateScore();
		
		self.dispatcher.trigger( 'updatescore' ) ; 
	}
	

	self.reCreate = function(keepstatus) // does keepstatus make sense as a thing?
	{		
		var screen_array = [];
		self.arScreens = [];
		
		// var oldstatus = self.getStatus;
		
		self.createScreenArray()
		
		// if(keepstatus && oldstatus)
		// {
			// self.setStatus( oldstatus );
		// }
		
		
		for( var i = 0; i < self.arScreens.length; i++ )
		{
			var screen = self.arScreens[i];
			screen.resetProperties()
		}
	}
	
	self.updateAttempts = function()
	{
		self.attempts++;
	}

	self.getScreenById = function( screen_id )
	{
		var rtn = getItemById( screen_id, self.arScreens );
		return rtn;
	}
	
	self.markPreviousScreensCompleted = function( screen_id )
	{
		if( self.getScreenById( screen_id ) )
		{
			for( var i = 0; i < self.arScreens.length; i++ )
			{
				var screen = self.arScreens[i];
		
				if( screen.id == screen_id )
				{
					break;
				}
				screen.setVisited( true );
				screen.setCompleted( true );
			}
		}
	}

	self.markAllScreensCompleted = function()
	{
		if( self.arScreens.length>0 )
		{
			for( var i = 0; i < self.arScreens.length; i++ )
			{
				var screen = self.arScreens[i];
		
				screen.setVisited( true );
				screen.setCompleted( true );

			}
		}
	}
	
	self.unlock = function()
	{
		if( self.locked )
		{
			self.locked = false;
			self.setStatus( "notattempted" );
		}
	}
	
	self.setStatusFromTracking = function()
	{
		self.index = masterObj.getTopicPositionById( self.id );
		var suspend_status = trackingObj.getSuspendStatus( self.index );
		
		switch( suspend_status )
		{
			case "0": 
				if( !self.completed )
				{
					self.locked = false;
					self.setStatus( "notattempted" );
				}
				break;
			case "1": 
				if( !self.completed )
				{
					self.locked = false;
					self.setStatus( "incomplete" );
					self.attempted = true;

				}
				break;
			case "2": 
				if( self.getAssessment() )
				{
					self.locked = false;
					self.setStatus( "passed" );
					self.completed = true;
					self.attempted = true;

				}
				else
				{
					self.locked = false;
					self.setStatus( "completed" );
					self.completed = true;
					self.attempted = true;
				}
				break;
			case "3": 
				if( !self.completed )
				{
					self.setStatus( "locked" );
					self.locked = true;
				}
				break;
			default: 
					self.setStatus( "notattempted" );
				
				break;
		}
		if( self.assessment )
		{
			self.setBestScore();
		}
	}
	
	
	self.updateStatus = function()
	{
		if( self.locked )
		{
			self.unlockTopic = masterObj.getTopicById( self.xml.attr("unlock") );
			if( self.unlockTopic )
			{
				if( self.unlockTopic.completed )
				{
					self.unlock();
				}
			}
			else
			{
				var all_completed = trackingObj.previousTopicsCompleted( self );
				if( all_completed )
				{
					self.unlock();
				}
			}
		}
		
		var visited_count = 0;
		var completed_count = 0;
		
		if( self.arScreens.length >0 )
		{
		
			for( var i = 0; i < self.arScreens.length; i++ )
			{
				var screen = self.arScreens[i];
				
				if( screen.getVisited() )
				{
					visited_count ++;
				}
				
				if( screen.getCompleted() )
				{
					completed_count ++;
				}
			}
			
			if( ( visited_count > 0 ) && ( self.status != "completed" ) )
			{
				self.status = "incomplete";
				self.attempted = true;
			}

			if( completed_count == self.arScreens.length && ( visited_count > 0 ) )
			{
				self.status = "completed";
				self.completed = true;
				self.attempted = true;
			}

			if( self.assessment && ( visited_count > 0 ) )
			{
				if( self.iBestScore >= self.mastery_score )
				{
					self.status = "passed";
					self.completed = true;
					self.attempted = true;
				}
				else
				{
					self.status = "incomplete";
					self.completed = false;
					self.attempted = true;
				}
			}
		}
		
		if( self.completed )
		{
			self.dispatcher.trigger( 'completed' ) ; 
		}
		if( navObj )
		{
			navObj.showBack();
			navObj.showNext();
		}
		
		self.dispatcher.trigger( 'statusupdated' ) ; 
	}
	/* ================== GET + SET ================== */
	
	
	self.getPassedCount = function()
	{
		return Math.round(self.iPassed);
	}
	
	self.getScore = function()
	{
		return Math.round( self.iCurrentScore );
	}
	
	self.getBestScore = function()
	{
		return Math.round( self.iBestScore );
	}
	
	self.getScoreCount = function()
	{
		var score = 0;
		var scored_screens = 0;
	
		for( var i = 0; i < self.arScreens.length; i++ )
		{
			var screen = self.arScreens[i];
			if( screen.getScored() )
			{
				scored_screens ++;
				if( screen.getPassed() )
				{
					score ++;
				}
			}
		}
		return score;
	}
	self.setBestScore = function()
	{
		var score_data = Number( trackingObj.getCustomData( self.score_data_prefix+self.id ) );
		if( !isNaN( score_data ) )
		{			
			self.iBestScore = score_data;
		}
	}
	

	self.setStatus = function( _var )
	{
		if( self.getStatus() != _var )
		{
			self.status = _var;
			self.dispatcher.trigger( 'statusupdated' ) ; 
		}
	}
	self.getStatus = function( )
	{
		return self.status;
	}
	
	self.setAssessment = function( _var )
	{
		self.assessment = Boolean( _var )
	}
	
	self.getAssessment = function( )
	{
		return self.assessment;
	}
	
	self.setAttempted = function( _var )
	{
		if( !self.getAttempted() && Boolean( _var ) )
		{
			self.attempted = true;
			self.dispatcher.trigger( 'attempted' );
		}
		else
		{
			self.attempted = false;
		}
	}
	
	self.getAttempted = function( )
	{
		return self.attempted;
	}
	
	self.setCompleted = function( _var )
	{
		if( !self.getAttempted() && Boolean( _var ) )
		{
			self.completed = true;
			self.setStatus( "completed" );
			self.dispatcher.trigger( 'completed' );
		}
		else
		{
			self.completed = false;
		}
		trackingObj.updateTracking()
	}
	
	self.getCompleted = function( )
	{
		return self.completed;
	}
	
	self.getPassed = function( )
	{
		var passed = false;
		if( self.getAssessment() )
		{
			if( self.getBestScore() >= self.mastery_score )
			{
				passed = true;
			}
		}
		return passed;
	}
	
	
	self.initialise();
	self.createScreenArray();	
}