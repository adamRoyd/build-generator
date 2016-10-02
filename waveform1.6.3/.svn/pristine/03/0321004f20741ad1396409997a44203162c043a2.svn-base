/**
* @author Andy Galletly
*/
function ScreenView(s)
{
	var self = this;
	self.screen = s;
	self.oXML;
	self.eventsXml;
	self.arScreenElements = [];
	self.arAllScreenElements = [];
	self.courseHolder = $('#courseholder');
	self.oHolder = null;
	self.screenTarget;
	self.arImageElements = [];
	self.arEvents = [];
	self.assEvents = {};
	self.arTriggers = [] ;
	self.feedback_array = [];
	self.feedback_elements_array = [];
	
	self.tween_array = []

	self.preloader = new Preloader( self.screen );
	
	self.reload_on_resize = false;
	if( self.screen.phonexml != self.screen.desktopxml )
	{
		self.reload_on_resize = true;
	}

	if( self.screen.reload_on_resize )
	{
		self.reload_on_resize = true;
	}
	self.complete_on_load = true;
	
	self.initScreen = function(t)
	{
		self.screen.setVisited( true );
		self.arScreenElements = [];
		self.arAllScreenElements = [];
		self.arImageElements = [];
		self.arEvents = [];
		self.assEvents = {};
		self.arTriggers = [] ;
		self.feedback_array = [];
		self.feedback_elements_array = [];
	
	    self.screenTarget = t;
	    if ( devmode ) console.log("view screen initScreen() " + self.screen.id );
	 
	    self.oHolder = $(document.createElement('div'));
		self.oHolder.attr( 'id', 'screenHolder_' + self.screen.id );
		self.oHolder.attr( 'class', 'screenHolder' );
		self.oHolder.addClass( self.screen.screentype + ' topic' + self.screen.topicId + ' screen' + self.screen.id );
		
	    $(self.screenTarget).append(self.oHolder);
		tweenTo(self.oHolder, 0, {autoAlpha:0, display:'none'});
	    
		self.oHolder.css('height', '100%');
		self.oHolder.css('width', '100%');
	    
		self.oXML = self.screen.viewXML;
		
		
		
		if( self.reload_on_resize )
		{
			_respondo.dispatcher.unbind( 'updateSize' , self.reload );
			_respondo.dispatcher.bind( 'updateSize' , self.reload );
		}
		
		self.init_screen_element_xml = $(self.oXML).children()[0]
		
		

		if( $(self.oXML).children()[0].nodeName != 'data' )
		{
			self.init_screen_element_xml = $(self.oXML);
		}
		
		self.initScreenElements()
		
		TweenMax.delayedCall( 0.1, self.preloadImages );
		
	}
	
	self.initScreenElements = function()
	{
		self.arScreenElements = self.createScreenElements( self.init_screen_element_xml );
	}
	
	self.reloadOnResize = function()
	{
		if( !self.reload_on_resize )
		{
			self.reload_on_resize = true;
			_respondo.dispatcher.unbind( 'updateSize' , self.reload );
			_respondo.dispatcher.bind( 'updateSize' , self.reload );
		}
	}
	
	self.reload = function()
	{
		self.screen.reload()
	}
	
	self.kill = function()
	{
		for( var i = 0; i < self.tween_array.length; i++ )
		{
			var tween = self.tween_array[ i ];
			tween.kill();
		}
		self.preloader.dispatcher.unbind( 'loaded' );
		self.preloader.kill();
		_respondo.dispatcher.unbind( 'updateSize' , self.reload );
		for(var i = 0; i<self.arAllScreenElements.length; i++)
		{
			var elm_obj = self.arAllScreenElements[i];
			elm_obj.kill();
		}
		self.arAllScreenElements = [];
		
		if( self.screen.templateView.kill )
		{
			self.screen.templateView.kill()
		}
			
		if( self.oHolder )
		{
			if( self.oHolder.length>0 )
			{
				self.oHolder.empty().remove();
			}
		}
		//self.screen.kill();
	}
	
	self.preloadImages = function()
	{
		self.preloader.dispatcher.bind( 'loaded', self.allImagesLoaded );
		self.preloader.loadImageArray( self.arImageElements );
		
	}
	
	self.allImagesLoaded = function()
	{	
		tweenTo( self.oHolder, 0, { delay:0, autoAlpha:0, display:'block' } );
		self.screenLoaded();
	}
	
	self.createScreenElements = function(xml)
	{
		var scrn_obj = self.screen;
	    var scr_elements = new Array();
	    $(xml).children().each(function () 
		{
	    	if(this.nodeName=="settings")
	    	{
		    	self.createSettings(this);
	    	}
			else	if(this.nodeName=="events")
	    	{
		    	self.createEvents(this);
	    	}
	    	else
	    	{
		    	var oElement = self.createScreenElement(this, scrn_obj);
				// console.log("NEW ELEMENT > "+oElement.id);
		    	scr_elements.push(oElement);
	    	}
	    })
	    
		if( self.screen.scored )
		{
			self.complete_on_load = false;
		}
	    
	    self.attachScreenElements(scr_elements)
	    	
		return scr_elements;
	}
	
	self.createSettings = function( settings_xml )
	{
		self.complete_on_load = Boolean( $(settings_xml).attr( 'autocomplete' ) != 'false' );
		self.reload_on_resize = Boolean( $(settings_xml).attr( 'resizereload' ) == 'true' );
		
		
		if( self.reload_on_resize )
		{
			_respondo.dispatcher.unbind( 'updateSize' , self.reload );
			_respondo.dispatcher.bind( 'updateSize' , self.reload );
		}
	}
	
	self.createEvents = function( events_xml )
	{
		self.eventsXml = events_xml;
		self.arEvents = [];
		self.assEvents = {};
		self.arTriggers = [] ;
		// if ( devmode ) console.log( "create events: "+events_xml )
	
		var eventNodes = $(events_xml).children();
		
		for(var i=0; i<eventNodes.length; i++)
		{
			
			var evtxml = eventNodes[i];
			
			var eventType = evtxml.nodeName ;
			
			switch( eventType )
			{
				case "event":
					var evt_obj = new ScreenEvent(evtxml, self)
					self.arEvents.push( evt_obj );
					self.assEvents[ evt_obj.id ] = evt_obj ;
					evt_obj.setup();
				break ;
				
				case "trigger":
					var trig_obj = new TriggerEvent(evtxml, self)
					self.arTriggers.push( trig_obj );
					trig_obj.setup();
				break ;
				
				case "sequence":
					var evt_obj = new SequenceEvent(evtxml, self)
					self.arEvents.push( evt_obj );
					evt_obj.setup();
				break ;
				
				default:
					console.warn("* * * UNKOWN EVENT TYPE REQUESTED: " + eventType ) ;
				break ;
			}
		}
	}
	
	self.createScreenElement = function(xml_node)
	{
		var scrn_obj = self.screen;
		var oElement = new ScreenElement(xml_node, scrn_obj);
		self.arAllScreenElements.push(oElement);
		if( oElement.view )
		{
			oElement.view.createElement();
		}
		else
		{
			// if ( devmode ) console.log( 'Log oElement has no view ' + oElement.id + ' : ' + oElement.type )
		}
		return oElement;
	}
	
	self.attachScreenElements = function(arr)
	{
	    
	    for (var i=0; i<arr.length; i++)
	    {
			var oElement = arr[i];
			if( oElement.view )
			{
				oElement.view.attachTscreen();
			}
	    }
		
		
	}
	
	self.tweenScreenElements = function( arr )
	{
		var elements = arr;
		
		if( !arr )
		{
			elements = self.arAllScreenElements;
		}
		
		if ( devmode ) console.log( 'Log TWEEN SCREEN ELEMENTS ' + self.screen.id )
		for (var i=0; i< elements.length; i++)
		{
			var oElement =  elements[i];
			if( oElement.view )
			{
				oElement.doTween();
			}
	    }
	}
	
	self.removeFromArray = function(elm_obj)
	{
		for( i in self.arAllScreenElements )
		{
			if( self.arAllScreenElements[i] == elm_obj )
			{
				self.arAllScreenElements.splice( i, 1 );
				break;
			}
		}
		
	}
	
	
	self.bookmarkResume = function()
	{
		// console.log("bookmarkResume");
		bookmarkResume()
	}

	self.bookmarkMenu = function()
	{
		// console.log("bookmarkMenu");
		bookmarkMenu();
	}
	
	self.screenLoaded = function()
	{
		self.screen.templateView.screenElementsReady();
		self.screen.screenLoaded();
		
	}
	
	self.ready = function()
	{
		self.tweenScreenElements();
		console.log("READY")

		if( self.complete_on_load )
		{
			self.screen.screenCompleted();
		}
		
		TweenMax.delayedCall(0, self.initEvent);
	}
	
	self.doEvents = function(evt, type, target)
	{
		if( evt )
		{
			var events_arr = evt.split(",");
			
			if( type == null )
			{
				type = "click" ;
			}
			
			if(type=="over")
			{
			}
			if(type=="out")
			{
			}
			
			if(type=="click")
			{
				for(var i=0; i<events_arr.length; i++)
				{
					self.doEventById(events_arr[i], type, target);
					
				}
			}
			else
			{
				self.doEventById(events_arr[events_arr.length-1], type, target);
			}
		}
	}
	
	self.doClickById = function( id )
	{
		if(id)
		{
			self.doEvents( id, 'click' );
		}
	}
	
	self.getEventById = function( id )
	{
		var rtn = null;
		for(var i=0; i<self.arEvents.length; i++)
		{
			var evt = self.arEvents[i];
			if( evt.id == id )
			{
				rtn = evt;
			}
		}
		return rtn
	}
	
	self.doEventById = function(id, type, target)
	{
		for(var i=0; i<self.arEvents.length; i++)
		{
			var evt = self.arEvents[i];
			
			var activate = true
			
			//if ( devmode ) console.log( 'Log EVENT '+evt.id+' SCREENSIZE ' + evt.screensize + ' : ' + _respondo.screen_type )
			if( evt.screensize )
			{
				//if ( devmode ) console.log( 'Log EVENT SCREENSIZE ' + evt.screensize + ' : ' + _respondo.screen_type )
				if( evt.screensize!=_respondo.screen_size )
				{
					activate = false;
				}
			}
			if( activate )
			{
				if(id == evt.id)
				{				
					switch(type)
					{
						case "over": evt.over(target);
							break;
						case "out": evt.out(target);
							break;
						case "click": evt.click(target);
							break;
						default: evt.click(target);
							type = 'click';
							break;
					}
				}
			}
		}
		
		// check trigz
		if( type == 'click' )
		{
			self.checkTriggers( id ) ;
		}
	}

	self.checkTriggers = function( eventId )
	{
		for( var i = 0; i < self.arTriggers.length; i++ )
		{
			var trig = self.arTriggers[ i ] ;		
			
			if( trig.allComplete() && trig.containsEvent( eventId ))
			{
				trig.activate(  );
			}
		}
	}
	
	self.initEvent = function()
	{
		if( !self.initEventCalled )
		{
			self.initEventCalled = true ;
			self.doClickById('init');
		}		
		
		if( $('.in-topic').length )
		{
			self.doClickById('in_topic');
		}
		else
		{
			self.doClickById('in_menu');
		}
		
	}
	
	
	self.createFeedback = function( fb_xml )
	{
		var feedback_obj = {};
		feedback_obj.id = fb_xml.attr( "id" );
		feedback_obj.fb_xml = fb_xml;
		feedback_obj.event = fb_xml.attr( "event" );
		self.feedback_array.push( feedback_obj );
	}
		
	self.getFeedbackById = function( id )
	{
		var rtn = getItemById( id, self.feedback_array );
		
		if( !rtn )
		{
			for( var i = 0; i < self.feedback_array.length; i++ )
			{
				var feedback_object = self.feedback_array[ i ];
				var fb_id_array = String( feedback_object.id ).split( ',' );
				if( fb_id_array.length > 1 )
				{
					for( var j = 0; j < fb_id_array.length; j++ )
					{
						var item = fb_id_array[ j ];
						if( item == id )
						{
							rtn = feedback_object;
							break;
						}
					}
					
					if( rtn )
					{
						break;
					}
				}
			}
		}
		
		return rtn;
	}
	
	self.checkFeedback = function( id )
	{
		var fb = self.getFeedbackById( id );
		var rtn = false;
		if(fb)
		{
			rtn = true;
		}
		return rtn;
	}
	
	self.applyFeedback = function( id )
	{
		var fbObj = null;
		switch( id )
		{
			case "pass":
				fbObj = self.getFeedbackById( "pass" );
			break ;
		
			case "fail":
				fbObj = self.getFeedbackById( "fail" );
			break ;
		
			case "partial":
				fbObj = self.getFeedbackById( "partial" );
				if( !fbObj )
				{
					fbObj = self.getFeedbackById( "fail" );
				}
			break ;
		}
		
		if( !fbObj )
		{
			fbObj = self.getFeedbackById( id );
		}
		
		if( fbObj )
		{
			self.feedback_elements_array = [];
			self.feedback_elements_array = self.createScreenElements( fbObj.fb_xml );
			TweenMax.delayedCall(0.1, function() { self.tweenScreenElements( self.feedback_elements_array ); } );

			if( fbObj.event )
			{
				self.doClickById( fbObj.event ) ;
			}

			if( _respondo.phone() )
			{
				var fb_element = self.getScreenElementById( 'fb' );
				if( fb_element )
				{
					scrollToDiv( fb_element.getDiv() )
				}
			}
		}
	}
	
	self.removeFeedback = function()	
	{
		for( var i = 0; i < self.feedback_elements_array.length; i++ )
		{
			var item = self.feedback_elements_array[ i ];
			item.view.removeFromScreen();
		}
	}
	
	self.removeScreen = function()
	{
		if( self.oHolder )
		{
			
			self.kill()
			var holderdiv = self.oHolder;
			if( self.screen.templateView.killScreen )
			{
				self.screen.templateView.killScreen()
			}
			// if ( devmode ) console.log("removeScreen "+holderdiv);
			self.oHolder.empty().remove();
			self.oHolder = null;
		}
	}
	
	self.getScreenElementById = function(id)
	{
		// console.log("getScreenElementById "+id)
		//self.arScreenElements
		var elm = null;
		for(var i = 0; i<self.arAllScreenElements.length; i++)
		{
			var elm_obj = self.arAllScreenElements[i];
			// console.log("CHECK ELEMENT "+elm_obj.id+" - "+id);
			if(elm_obj.id == id)
			{
				elm = elm_obj;
				break;
			}
		}
			
		return elm;
	}
	
	self.removeScreenElementById = function(id)
	{
		// if ( devmode ) console.log("getScreenElementById "+id)
		//self.arScreenElements
		var new_array = [];
		
		for(var i = 0; i<self.arAllScreenElements.length; i++)
		{
			var elm_obj = self.arAllScreenElements[i];
			// if ( devmode ) console.log("CHECK ELEMENT "+elm_obj.id+" - "+id);
			if(elm_obj.id == id)
			{
				elm_obj.getDiv().empty().remove();
			}
			else
			{
				new_array.push( elm_obj );
			}
		}
		
		self.arAllScreenElements = new_array;
		
	}
		
	self.enableButton = function(btn_name)
	{
		var btn = self.getScreenElementById(btn_name);
		
		// console.log("ENABEL BUTTON "+btn)
		btn.view.oContent.attr('disabled', false);
		tweenTo( btn.getDiv(), 0.3, {autoAlpha:1} );
	}
	
	self.disableButton = function(btn_name)
	{
		var btn = self.getScreenElementById(btn_name);
		btn.view.oContent.attr('disabled', true);
		tweenTo( btn.getDiv(), 0.3, {autoAlpha:0.5} );
	}
	
	self.disable = function()
	{
		if ( devmode ) console.log( 'Log DISABLE SCREEN ' + self.screen.id)
		
		self.oHolder.addClass( 'disabled' );
		
		if( self.screen.templateView.disable )
		{
			self.screen.templateView.disable()
		}
	}
	
	self.enable = function()
	{
		if ( devmode ) console.log( 'Log ENABLE SCREEN ' + self.screen.id)
		if( self.oHolder )
		{
			self.oHolder.removeClass( 'disabled' );
		
		
			if( self.screen.templateView.enable )
			{
				self.screen.templateView.enable()
			}
		}
	}
	
}
