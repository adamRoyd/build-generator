/**
* @author Andy Galletly
*/
function ScreenElement(xml_node, s)
{
	var self = this;
	self.screen = s;
	self.screen_view = self.screen.view;
	self.oXML = xml_node;
	self.xml = xml_node;
	self.id = $(self.xml).attr("id");
	self.type = self.xml.nodeName;
	
	self.topicId = $(self.xml).attr("topicbtn");
	self.status_x = Number( $(self.xml).attr("status_x") );
	self.status_y = Number( $(self.xml).attr("status_y") );
	
	self.sTarget = $(self.xml).attr("target");
	
	self.sEvent = null;
	self.sFilters = null;
	
	self.height = null;
	self.width = null
	self.x = 0;
	self.y = 0;
	self.z = null;
	self.rotation = 0;
	self.draggable = false;
	
	self.animtype = "none";
	self.animtime = 0;
	self.animdelay = 0;
	self.animease = "Strong.easeOut"
	
	self.screensize = null;
	self.classname = '';
	
	self.tabbable = true;
	
	self.enabled = true;
	
	self.view = null;
	
	self.setup = function()
	{
		if($(self.xml).attr("height"))
		{
			// Assume a percentage and if not cast it as a number
			self.height = parseNumberString( $(self.xml).attr("height") );
			// if (self.height.indexOf("%") == -1) {
				// self.height = Number(self.height)
			// }
		}
		if($(self.xml).attr("width"))
		{
			self.width = parseNumberString( $(self.xml).attr("width") );
			// if (self.width.indexOf("%") == -1) {
				// self.width = Number(self.width)
			// }
		}
		if($(self.xml).attr("z"))
		{
			self.z = Number($(self.xml).attr("z"));
		}
		if($(self.xml).attr("x"))
		{
			self.x = parseNumberString( $( self.xml ).attr( "x" ) );
		}
		if($(self.xml).attr("y"))
		{
			self.y = parseNumberString($(self.xml).attr("y"));
		}
		if($(self.xml).attr("rotation"))
		{
			self.rotation = parseNumberString($(self.xml).attr("rotation"));
		}
		if($(self.xml).attr("event"))
		{
			self.sEvent = $(self.xml).attr("event");
		}
		if($(self.xml).attr("filters"))
		{
			self.sFilters = $(self.xml).attr("filters");
		}
		if($(self.xml).attr("class"))
		{
			self.classname = $(self.xml).attr("class");
		}
		if($(self.xml).attr("draggable") != "false" )
		{
			self.draggable = $(self.xml).attr("draggable");
		}
		if($(self.xml).attr("tabbable") )
		{
			self.tabbable = $(self.xml).attr("tabbable");
		}
		
		if($(self.xml).attr("anim"))
		{
			self.animtype = $(self.xml).attr("anim");
		}
		if($(self.xml).attr("ease"))
		{
			self.animease = $(self.xml).attr("ease");
		}

		if($(self.xml).attr("animtime"))
		{
			self.animtime = Number($(self.xml).attr("animtime"));
		}

		if($(self.xml).attr("animdelay"))
		{
			self.animdelay = Number($(self.xml).attr("animdelay"));
		}

		if( $( self.xml ).attr( 'screensize' ) )
		{
			self.screensize = $( self.xml ).attr( 'screensize' );
		}


		if( $( self.xml ).attr( 'enabled' ) )
		{
			self.enabled = Boolean( $( self.xml ).attr( 'enabled' ) != 'false' );
		}
		
		if ( devmode ) console.log( 'Log xml ENABLED ' + self.id + ' - ' + self.enabled )
		
		switch( self.type )
		{
			//case 'text': self.view = new TextScreenElement(self);

			case "var": self.createVar();
				break;
		
			case "screen": self.view = new SubScreenView( self );
				break;	
			case "dialogue": self.view = new SubDialogueView( self );
				break;
			case "text": self.view = new TextElementView( self );
				break;
			case "line": self.view = new LineElementView( self );
				break;
			case "pointer": self.view = new PointerElementView( self );
				break;
			case "box": self.view = new BoxElementView( self );
				break;
			case "image": self.view = new ImageElementView( self );
				break;
			case "status": self.view = new StatusElementView( self );
				break;
			case "button": self.view = new ButtonElementView( self );
				break;
			case "tabs": self.view = new TabsElementView( self );
				break;
			case "sliderreveal": self.view = new SliderRevealElementView( self );
				break;
			case "video": self.view = new VideoPlayerView( self );
				break;
			case "audio": self.view = new AudioPlayerView( self );
				break;
			case "score": self.view = new ScoreElementView( self );
				break;
			case "timer": self.view = new TimerView( self );
				break;
			case "timeline": self.view = new TimelineView( self );
				break;
			case "pagecounter": self.view = new PagecounterView( self );
				break;
	/*			
			case "tabs": self.createTabs();
				break;
				
			// Media Element Class //	
			case "sprite": self.createSprite();
				break;
				
			case "audio": self.createAudio();
				break;
				
			case "video": self.createVideo();
				break;
				
			case "timer": self.createTimer();
				break;
				
			case "custom": self.templateView.custom( self.oModel );
				break;
			
		*/		
			case "fb":
				// fall through
			case "feedback": self.screen_view.createFeedback( $( self.oXML ) );
				break;	
			default: self.view = new ScreenElementView(self);
		}
		
		
	}
	
	self.createVar = function()
	{
		self.screen.setVar( $( self.xml ).attr("id"), $( self.xml ).text() );
	}
	
	self.kill = function()
	{
		if( self.view )
		{
			self.view.kill()
			self.view = null;
		}
	}
	
	self.getDiv = function()
	{
		return self.view.oDiv;
	}
	
	self.enable = function()
	{
		if( self.view )
		{
			var func = self.view.templateView[ $( self.oXML ).attr( "func" ) ];
			var screen_func = self.screen[ $( self.oXML ).attr( "func" ) ];

			var click_function;
			var event_function = function(){};

			var evnt = $( self.oXML ).attr( "event" )

			// if(!evnt)
			// {
			// 		self.sEvent = self.id + "_buttonclick"
			// }


			if( $.isFunction ( func ) )
			{
				click_function = function()
				{ 
					$.proxy( func, self.templateView )( ); 
				}
			}
			else if( $.isFunction ( screen_func ) )
			{
				click_function = function()
				{ 
					$.proxy( screen_func, self.screen )( ); 
				}
			}
			else
			{ 
				var globalfunc = eval( $( self.oXML ).attr( "func" ) );
				if ( $.isFunction ( globalfunc ) )
				{
					click_function = function()
					{
						globalfunc();
					}
				}
			}

			self.click_function = click_function;
			//if ( devmode ) console.log("Enable "+self.id + " with event name: " + self.sEvent)

			if( self.topicId )
			{
				menuObj.registerMenuButton( self );
			}

			if( ( self.sEvent || self.click_function ) && self.view )
			{
				self.enabled = true;

				self.view.oDiv.removeClass( 'disabled' )

				var evt = self.sEvent;
				var scrn = self.screen;
				var scrn_view = scrn.view;

				if ( devmode ) console.log( 'Log ENABLE '+self.id+ ' -  (self.view.oDiv.data(\'btn\') ) - %o ', self.view.oDiv.data('btn')  );


				if(!self.view.oDiv.data('btn'))
				{
					applyClick(
						self.view.oDiv,

						function () {
							var elm = $(this).data('elm')
							if(self.enabled)
							{
								// if (devmode) console.log("EVENT CLICK " + model.sEvent)
								scrn_view.doEvents(self.sEvent, "click", self);
								if( self.click_function )
								{
									self.click_function();
								}
							}
						},

						function () {
							var elm = $(this).data('elm')

							if(self.enabled)
							{
								// console.log("onover "+model.sEvent)
								scrn_view.doEvents(self.sEvent, "over", self);
							}
						},

						function () {
							var elm = $(this).data('elm')
							if(self.enabled)
							{
								// console.log("onout "+model.sEvent)
								scrn_view.doEvents(self.sEvent, "out", self)
							}
						}
					);
					scrn_view.doEvents(self.sEvent, "out", self);
					if (self.initDisabled == "true") {
						self.disable();
					}
				}
				else
				{
					enableElement(self.view.oDiv);
					scrn_view.doEvents(self.sEvent, "out", self);
				}
			}
		}
		else
		{
			if ( devmode ) console.warn( 'WARN: SCREEN ELEMENT HAS NO VIEW ' + self.id + ' - ' + self.type );
		}
		
	}
	
	self.doTween = function( settings )
	{
		if( !settings )
		{
			var settings = new Object();
			settings.delay 	= self.animdelay;
			settings.ease 	= self.animease;
			settings.type 	= self.animtype;
			settings.time 	= self.animtime;
		}
		self.view.doTween( settings )
	}
	
	self.applyFilters = function( filters )
	{
		self.view.applyFilters( filters );
	}
	
	self.disable = function()
	{
		disableElement(self.view.oDiv);
	}
	
	self.show = function()
	{
		self.view.doTween();
	}
	
	self.setup();
	
	
}
