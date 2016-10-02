// simple SCORM v1.0b
function lmsConnection(  )
{
	var self = this ;

	self.connection_error_message = "Cannot locate the LMS API adapter";
	self.api_error_message = "Cannot find the API";
	self.api_update_error_message = "Cannot update from the API";
	self.api_connection_lost = "Your connection has been lost. If you continue with the course, your progress from this point on will not be recorded and, importantly, your completion will not be recorded in the LMS. If you wish to continue with the training at this time, you will need to close this browser window and re launch the course.";
	
	self.findAPI_attempts = 0;
	self.max_findAPI_attempts = 300;
	
	self.save_to_cookie = false;
	self.cookie_path = "lite_scorm";
	self.latest_update_time;

	self.module_time_initialised; //time launched
	
	self.top  = window.top;
	self.oAPI;
	self.project_code;
	
	self.callback_function;
	self.fail_function;
	
	self.api_student_name;
	self.api_lesson_location;
	self.api_lesson_status;
	self.api_score;
	self.api_suspend_data;
	
	self.module_student_name 	= "Student,Joe"; 
	self.module_lesson_location 	= "0";  // string of upto 255 characters 
	self.module_lesson_status 	= "incomplete";
	self.module_score 				= "null";
	self.module_suspend_data 	= "0";  // string of upto 4096 characters 
	self.module_session_time		= "00:00:00";

	self.createConnection = function( proj_code, callback, fail_callback )
	{
		self.callback_function = callback;
		self.fail_function = fail_callback;
		self.project_code = proj_code;
		self.getAPI();
	}
	
	self.enableCookieSaving = function()
	{
		self.save_to_cookie = true;
	}
	
	self.clearCookie = function()
	{
		//console.log("CLEAR COOKIE")
		self.eraseCookie( "cookie_student_name" );
		self.eraseCookie( "cookie_lesson_location" );
		self.eraseCookie( "cookie_lesson_status" );
		self.eraseCookie( "cookie_score" );
		self.eraseCookie( "cookie_suspend_data" );
		self.eraseCookie( "lms_update_time" );
		self.eraseCookie( "cookie_update_time" );
		
		self.module_student_name 	= "Student,Joe"; 
		self.module_lesson_location 	= "0";  // string of upto 255 characters 
		self.module_lesson_status 	= "browsed";
		self.module_score 					= "null";
		self.module_suspend_data 	= "0";  // string of upto 4096 characters 
		self.module_session_time		= "00:00:00";
		self.api_student_name 			= null;
		self.api_lesson_location 		= null;
		self.api_lesson_status 			= null;
		self.api_score 						= null;
		self.api_suspend_data 			= null;
		
		//console.log("CLEAR COOKIE: SUSPEND DATA " + self.module_suspend_data)
		
		self.updateLMS();
	}
	
	/* GETS */
	self.getStudentName = function()
	{
		return self.module_student_name;
	}
	
	self.getStudentEmail = function()
	{
		return "";
	}	
	
	self.getLessonLocation = function()
	{
		return self.module_lesson_location;
	}
	
	self.getLessonStatus = function()
	{
		return self.module_lesson_status;
	}
	
	self.getScore = function()
	{
		var score = Number(self.module_score);
		if (isNaN(score))
		{
			score = 0;
		}
		
		return score;
	}
	
	self.getSuspendData = function()
	{
		return self.module_suspend_data;
	}
		
	self.getCertificateCode = function()
	{
		return "";
	}
	/* END GETS */
	
	/* SETS */
	self.setStudentName = function( student_name )
	{
		self.module_student_name = student_name;
	}
	
	self.setLessonLocation = function( lesson_loc )
	{
		//console.log("SET LESSON LOCATION " + lesson_loc)
		self.module_lesson_location = lesson_loc;
	}
	
	self.setLessonStatus = function( status )
	{
		self.module_lesson_status = status;
	}
	
	self.setScore = function( score )
	{
		self.module_score = score;
	}
	
	self.setSuspendData = function( data )
	{
		self.module_suspend_data = data;
	}
	
	self.resetLMS = function(  )
	{
		console.warn( 'WARN: DANGER resetLMS' );
		console.trace();
		self.setLessonLocation( '0' );
		self.setLessonStatus( 'incomplete' );
		self.setScore( '0' );
		self.setSuspendData( '0' );
		self.updateLMS()
		console.warn( 'WARN: Close course window to keep resetLMS changes' );
	}
	
	/* END SETS */

	self.testCompletion = function(  )
	{
	}
	
	self.updateVarsFromLMS = function()
	{
		if( self.checkAPI() )
		{
			try
			{
			// self.oAPI.LMSSetValue( "cmi.core.entry", "resume" );
				self.api_student_name 		= self.oAPI.LMSGetValue("cmi.core.student_name");
								
				self.api_lesson_location 	= self.oAPI.LMSGetValue("cmi.core.lesson_location");
				self.api_lesson_status 		= self.oAPI.LMSGetValue("cmi.core.lesson_status").toLowerCase();
				self.api_score 					= self.oAPI.LMSGetValue("cmi.core.score.raw");
				var raw_suspend_data 		= self.oAPI.LMSGetValue("cmi.suspend_data");
				
				/*
				if( raw_suspend_data.indexOf( ":" ) > -1 )
				{
					
					self.api_suspend_data 		= raw_suspend_data.split( ":" )[0];
					self.api_update_time			= raw_suspend_data.split( ":" )[1];
				
					
					if( self.save_to_cookie && self.api_update_time )
					{
						self.createCookie( "lms_update_time", self.api_update_time );
					}
					else
					{
						self.eraseCookie( "lms_update_time" );
					}
					
				}
				else
				{
					self.eraseCookie( "lms_update_time" );
					self.api_suspend_data 		= raw_suspend_data;
				}
				*/
				
				self.eraseCookie( "lms_update_time" );
				self.api_suspend_data 		= raw_suspend_data;
				
				if( self.save_to_cookie && ( self.readCookie( "cookie_update_time" ) > self.readCookie( "lms_update_time") ) )
				{
					self.updateFromCookies()
					self.updateLMS();
				}
				else
				{
					if( self.api_lesson_status == "not attempted" || self.api_lesson_status == "" || self.api_lesson_status == " " )
					{
						// if not attempted or no status, set the LMS to browsed.
						self.updateLMS();
					}
					//else
					//{
					
						if( self.api_student_name )
						{
							self.module_student_name 	= self.api_student_name;
						}
						if( self.api_lesson_location )
						{
							self.module_lesson_location 	= self.api_lesson_location;
						}
						if( self.api_lesson_status )
						{
							self.module_lesson_status 	= self.api_lesson_status;
						}
						if( self.api_score )
						{
							self.module_score 	= self.api_score;
						}
						if( self.api_suspend_data )
						{
							self.module_suspend_data 	= self.api_suspend_data;
						}
					//}
		
				}
			} 
			catch(e)
			{
				alert( self.api_update_error_message + " - " + e.message )
				
			}
		}
		else
		{
		
			if( self.save_to_cookie )
			{
				self.updateFromCookies()
			}
		
		}
		
	}
	
	self.formatTime = function( t )
	{
		var time = new Date( t )
		var hrs = time.getUTCHours();   if (hrs < 10) {hrs = "0" + hrs.toString()}
		var min = time.getUTCMinutes(); if (min < 10) {min = "0" + min.toString()}
		var sec = time.getUTCSeconds(); if (sec < 10) {sec = "0" + sec.toString()}
		var string_time = hrs + ":" + min + ":" + sec;
		return string_time;
	}
	
	self.updateLMS = function()
	{		
		self.latest_update_time = new Date().getTime();
		
		if( self.checkAPI() )
		{
			self.module_session_time = self.formatTime( self.latest_update_time - self.module_time_initialised );
			
			var send_update = false;
			//self.oAPI.LMSSetValue( "cmi.core.student_name", self.module_student_name ); // string of upto 255 characters 
			
			
			if( self.api_lesson_location != self.module_lesson_location )
			{
				self.oAPI.LMSSetValue( "cmi.core.lesson_location", self.module_lesson_location ); // string of upto 255 characters 
				self.api_lesson_location = self.module_lesson_location ;
				send_update = true;
			}
			
			if( self.api_lesson_status != self.module_lesson_status )
			{
				self.oAPI.LMSSetValue( "cmi.core.lesson_status", self.module_lesson_status);
				self.api_lesson_status = self.module_lesson_status ;
				send_update = true;
			}

			if( String(self.api_score) != String(self.module_score) )
			{
				if( String(self.module_score) != "null" )
				{
					self.oAPI.LMSSetValue( "cmi.core.score.raw", String(self.module_score) );
					self.oAPI.LMSSetValue( "cmi.core.score.min", "0" );
					self.oAPI.LMSSetValue( "cmi.core.score.max", "100" );
					self.api_score = self.module_score ;
					send_update = true;
				}
			}
			
			
			if( self.api_suspend_data != self.module_suspend_data )
			{
				self.oAPI.LMSSetValue("cmi.suspend_data", self.module_suspend_data ); // string of upto 4096 characters
				self.api_suspend_data = self.module_suspend_data ;
				send_update = true;
			}
			
			
			if( self.api_session_time != self.module_session_time )
			{
				self.oAPI.LMSSetValue( "cmi.core.session_time", self.module_session_time );
				self.api_session_time = self.module_session_time ;
				send_update = true;
			}
			
			if( send_update )
			{
				self.oAPI.LMSCommit("");
				
			}
			
			if( self.save_to_cookie )
			{
				self.createCookie( "lms_update_time", self.latest_update_time );
			}
		}
		if( self.save_to_cookie )
		{
			self.updateCookies()
		}
		
		//self.updateVarsFromLMS();
	}
	
	self.updateCookies = function()
	{
		//console.log("UPDATE COOKIES " + self.module_suspend_data)
		self.createCookie( "cookie_student_name", self.module_student_name );
		self.createCookie( "cookie_lesson_location", self.module_lesson_location );
		self.createCookie( "cookie_lesson_status", self.module_lesson_status );
		self.createCookie( "cookie_score", self.module_score );
		self.createCookie( "cookie_suspend_data", self.module_suspend_data );
		self.createCookie( "cookie_update_time", self.latest_update_time );
	}
	
	self.updateFromCookies = function()
	{
		//console.log("UPDATE FROM COOKIE " + self.module_suspend_data)
		self.module_student_name = self.readCookie( "cookie_student_name" );
		self.module_lesson_location = self.readCookie( "cookie_lesson_location" );
		self.module_lesson_status = self.readCookie( "cookie_lesson_status" );
		self.module_score = self.readCookie( "cookie_score" );
		self.module_suspend_data = self.readCookie( "cookie_suspend_data" );
	}
	
	self.closeConnection = function()
	{
		self.updateLMS();
		
		if( self.checkAPI() )
		{
			
			self.oAPI.LMSSetValue( "cmi.core.exit", "suspend" );
			self.oAPI.LMSCommit("");
			self.oAPI.LMSFinish("");
		}
	}


	self.initialiseAPI = function()
	{
		self.module_time_initialised = new Date().getTime();
		
		if( self.oAPI )
		{
			self.oAPI.LMSInitialize("");
		}
		
		self.updateVarsFromLMS();
		
		if( self.callback_function )
		{
			self.callback_function();
		}
	}
	
	
	
	/* --------------------------------------  API CONNECTION ------------------------------------------ */
	
	self.checkAPI = function()
	{
		try
		{ 
			//self.oAPI.LMSGetValue("cmi.core.lesson_status").toLowerCase();
			var last_error = self.oAPI.LMSGetLastError();
			if( last_error != "0" )
			{
				alert( "LMS ERROR: " + last_error );
			}
			return true; 
		}
		catch ( e )
		{
			if( self.oAPI )
			{
				//self.oAPI = null;
				alert( self.api_connection_lost );
			}
			return false; 
		}
	}
	
	self.testOpener = function( _win )
	{
		var rtn  = false;
		

			try {
				if( _win.opener )
				{
					rtn = true;
				}
				else
				{
					rtn = false;
				}
			}
			catch (e) 
			{
			   rtn = false;
			}
		
		return rtn;
	}
	
	self.getAPI = function() {
		var theAPI = self.findAPI( window );
		if ( (theAPI == null) && self.testOpener(self.top) ) {
			theAPI	= self.findAPI(self.top.opener);
			if ((theAPI == null) && self.testOpener( self.top.opener ) ) {
				theAPI	= self.findAPI(self.top.opener.opener);
			} 
		}
		if (theAPI == null) {
			if( self.connection_error_message )
			{
				if( !self.save_to_cookie )
				{
				//	alert( self.connection_error_message );
					self.fail_function();
				}
			}
		}
		else
		{
			self.oAPI = theAPI;
			self.initialiseAPI();
		}
	}
	
	self.findAPI = function(win) {
	
		try
		{ 
			//console.log("FIND API - window name - " + win.name);
		}
		catch(e)
		{
			//console.log( "FIND API - window has no name - " + win )
		}
		
		try
		{ 
		
			while ( (win.API == null) && (win.parent != null) &&  (win.parent != win) )
			{	
				self.findAPI_attempts++;
				if (self.findAPI_attempts > self.max_findAPI_attempts) {
					if( self.api_error_message )
					{
						alert( self.api_error_message )
					}
					return null;
				}
				win = win.parent;
			}
			return win.API;
		} 
		catch (e) 
		{ 
			return null;
		}
	}
	
	
	/* ----------------------------------- cookie management ------------------------------- */
	
	self.createCookie = function(name,value,days) {
	
		if(!days)
		{
			var days = 7;
		}
	
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	self.readCookie = function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if ( (c.indexOf(nameEQ) == 0)) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	self.eraseCookie = function(name) {
		self.createCookie(name,"",-1);
	}
	
}
