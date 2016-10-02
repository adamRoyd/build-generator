
function Tracking(){
	var self = this ;
	
	self.sSuspend_data = "";
	self.sSuspend_score = 0;
	self.sLesson_status = "incomplete";
	self.sLesson_location = null;
	self.custom_data = [];
	self.lms_ready = false;
	
	self.dispatcher = createDispatcher('tracking');
	
	self.trackingConnection = new lmsConnection() ;
	
	self.init = function()
	{
		self.trackingConnection.createConnection( masterObj.projectCode, self.connectedCallback, self.connectionFailedCallback ) ;
	}
	
	self.connectedCallback = function()
	{
		self.readTrackingFromLMS();
	}
	
	self.connectionFailedCallback = function()
	{
		alert("Failed to connect to SCORM API. Tracking data not available.") ;
		self.readTrackingFromLMS();
	}
	
	self.readTrackingFromLMS = function()
	{
		self.sSuspend_data = 	self.trackingConnection.module_suspend_data;
		self.sSuspend_score = 	self.trackingConnection.module_score;
		self.sLesson_status = 	self.trackingConnection.module_lesson_status;
		self.sLesson_location = self.trackingConnection.module_lesson_location;
		
		if( self.sSuspend_data == "null" || self.sSuspend_data == "undefined" )
		{
			self.sSuspend_data = "" ;
		}
		
		var split_suspend = self.sSuspend_data.split( '|' );
		
		if(masterObj.arTopics.length>split_suspend[0].length)
		{
			self.sSuspend_data = "" ;
			for(var i=0; i<masterObj.arTopics.length; i++)
			{
				if(masterObj.arTopics[i].locked)
				{
					self.sSuspend_data += "3";
				}
				else
				{
					self.sSuspend_data += "0";
				}				
			}
		}
		else
		{
			self.sSuspend_data = split_suspend[0];
			for( var i = 0; i < split_suspend.length; i++ )
			{
				var data = split_suspend[ i ].split(":");
				
				if( data.length>1 )
				{
					if( data[0] == 'role' )
					{
						var role = Number( data[ 1 ] );
						setRole( role );
					}
			
					self.setCustomData( data[0], data[1] );
				}
			}
		}
		
		self.lms_ready = true;
		self.dispatcher.trigger('ready');
	
	}
	
	self.updateScore = function()
	{
		var assessment_count = 0;
		var total_score = 0;
		for(var i=0; i<masterObj.arTopics.length; i++)
		{
			var topic = masterObj.arTopics[i];
			
			if(topic.assessment)
			{
				assessment_count ++;
				total_score += topic.getBestScore();
			}
			
		}
		
		var percent = total_score / assessment_count;
		
		var score_number = 0;
		if( self.sSuspend_score != 'null' )
		{
			score_number = Number( self.sSuspend_score )
		}			
		if( percent > score_number )
		{
			self.sSuspend_score = percent;
		}
		
	}
	
	self.updateTracking = function()
	{
		//console.log("update tracking called") ;
	
		
		var completed = false;

		self.updateSuspendData();
		
		self.updateScore()
		
		var completion_mode = masterObj.getCompletionMode() 
		
		switch( completion_mode )
		{
			case "pass": 
				completed = self.checkPassed();
				break;
			case "screens": 
				completed = self.checkTopicCompletion();
				break;
			case "topics": 
				completed = self.checkTopicCompletion();
				break;
			case "both": 
				completed = Boolean( self.checkTopicCompletion() && self.checkPassed() );
				break;
				
		}
		
		self.updateScore()
		
		if( completed )
		{
			if( completion_mode == "pass" )
			{
				self.sLesson_status = "passed";
			}
			else
			{
				self.sLesson_status = "completed";
			}
		}
		
		if( menuObj )
		{
			menuObj.updateTopicButtonStatus();
		}	
		
		if( currentScreen )
		{
			self.sLesson_location = currentScreen.id;
		}
		
		self.saveToAPI();
		
	}
	
	
	self.updateSuspendData = function()
	{
		
		if( self.lms_ready )
		{
			self.sSuspend_data = "";
			var allCompleteToselfPoint = true ;
			
			for(var i=0; i<masterObj.arTopics.length; i++)
			{
				var topic = masterObj.arTopics[i];
				
				topic.updateStatus();
				
				
				switch( topic.getStatus() )
				{
					case "notattempted": self.sSuspend_data += "0";
						break;
					case "incomplete": self.sSuspend_data += "1";
						break;
					case "completed": self.sSuspend_data += "2";
						break;
					case "passed": self.sSuspend_data += "2";
						break;
					case "locked": self.sSuspend_data += "3";
						break;
					default: self.sSuspend_data += "0";
						break;
				}			
			}
			//self.sSuspend_data += ',role:' + user_role;
			
			self.sSuspend_data += self.getCustomDataAsString();
		}
	}
	
	self.previousTopicsCompleted = function( topic )
	{
		var rtn = true;
		for( var i = 0; i < masterObj.arTopics.length; i++ )
		{
			var item = masterObj.arTopics[ i ];
			
			if( item == topic )
			{
				break;
			}
			
			if( ( !item.getCompleted() ) && ( !item.locking_ignore ) )
			{
				rtn = false;
			}
			
		}
		
		return rtn;
	}
	
	self.checkTopicCompletion = function()
	{
		var all_complete = true;
		for(var i=0; i<masterObj.arTopics.length; i++)
		{
			var topic = masterObj.arTopics[i];
			
			topic.updateStatus();
			if( !topic.getCompleted() )
			{
				all_complete = false;
				break;
				
			}
		}
		
		return all_complete;
	}
	
	self.checkPassed = function()
	{
		var all_passed = true;
		
		for(var i=0; i<masterObj.arTopics.length; i++)
		{
			var topic = masterObj.arTopics[i];
			
			topic.updateStatus();
			
			if( !topic.getPassed() && topic.getAssessment() )
			{					
				all_passed = false;
			}
		}
		
		return all_passed;
	}
	
	self.getCustomDataAsString = function()
	{
		
		var rtn_string = '';
		for( var i = 0; i < self.custom_data.length; i++ )
		{
			var item = self.custom_data[ i ];
			rtn_string += '|' + item.id + ':' + item.data;
		}
		return rtn_string
	}
	
	self.getBookmark = function()
	{
	
		var bookmarked_screen = masterObj.getScreenById( self.sLesson_location )
		if(bookmarked_screen)
		{
			return self.sLesson_location;
		}
		else
		{
			return null;
		}
	}
	
	self.getSuspendStatus = function( topic_index )
	{
		var arSuspend = self.sSuspend_data.split("");
		
		return arSuspend[ topic_index ];
	}
	
	self.getCustomData = function( id )
	{
		var rtn = null;
		for( var i = 0; i < self.custom_data.length; i++ )
		{
			var item = self.custom_data[ i ];
			if( item.id == id )
			{
				rtn = item.data;
				break;
			}
		}
		return rtn
	}
	
	self.setCustomData = function( id, data )
	{
		var data_found = false;
		for( var i = 0; i < self.custom_data.length; i++ )
		{
			var item = self.custom_data[ i ];
			if( item.id == id )
			{
				item.data = data;
				data_found = true;
				break;
			}
		}
		if( !data_found )
		{
			var new_item = {};
			new_item.id = id;
			new_item.data = data;
			self.custom_data.push(new_item);
		}
		
		self.updateSuspendData();
		self.saveToAPI();
	}
	
	self.saveToAPI = function( pClose )
	{
		if( self.lms_ready )
		{
			
			self.trackingConnection.setLessonLocation( self.sLesson_location ) ;
			self.trackingConnection.setLessonStatus( self.sLesson_status ) ;
			self.trackingConnection.setSuspendData( self.sSuspend_data ) ;
			self.trackingConnection.setScore( self.sSuspend_score ) ;
			self.trackingConnection.updateLMS() ;
			
		}
	}
	
	self.closeCourse = function()
	{
		self.trackingConnection.closeConnection() ;
	}
}