/**
* @author Andy Galletly
*/
function ScreenElementView(m)
{
	var self = this
	self.oModel = m;
	self.idprefix = self.oModel.screen.id + "_";
	self.oDiv = $('<div>');
	self.oDiv.addClass( 'screenElement' );
	self.oDiv.attr('id', self.idprefix + self.oModel.id);
	
	self.oContent = $( '<div />' );
	self.oContentHolder;
	self.screen = self.oModel.screen;
	self.templateView = self.screen.templateView;
	self.screen_view = self.screen.view;
	self.resizeListen = false;
	
	self.xml_node = $( self.oModel.xml );
	
	
	
	
	
	self.createElement = function()
	{
		self.oContentHolder = self.screen_view.oHolder;
		
		
		if(self.oModel.sTarget)
		{
			var targetElement = self.screen_view.getScreenElementById( self.oModel.sTarget );
			// console.log("TARGET "+self.oModel.sTarget+" - "+targetElement);
			
			if( !targetElement )
			{
				self.oContentHolder = $( "#" + self.oModel.sTarget );
			}
			else
			{
				self.oContentHolder = targetElement.view.oDiv;
			}
		}
		
		self.oDiv.oModel = self.oModel;
		self.oDiv.view = self;
		
		if ( devmode ) console.log( 'Log XPOS ' + self.oModel.x )
		self.oDiv.css('left', self.oModel.x);
		self.oDiv.css('top', self.oModel.y);
		if( self.oModel.z )
		{
			self.oDiv.css('z-index', self.oModel.z);
		}
		tweenTo( self.oDiv, 0, { rotation: self.oModel.rotation } )
		
		if( self.oModel.draggable )
		{
			var bound_div = self.screen_view.oHolder;
			if( self.oModel.draggable != "true" )
			{
				
				
				var boundsElement = self.screen_view.getScreenElementById( self.oModel.draggable ) ;
								
				if( boundsElement )
				{
					bound_div = boundsElement.view.oDiv;
				}
				else
				{
					bound_div = $( "#" + self.oModel.draggable ) ;
				}
			}
			self.oDraggable = 	Draggable.create(self.oDiv, {
				edgeResistance:1,
				type:"left,top",
				bounds : bound_div,
				throwProps:true,
				throwResistance: 1
			} );
		
		}
				
		if(self.oModel.width)
		{
			self.oDiv.css('width', self.oModel.width);
		}
		
		if(self.oModel.height)
		{
			self.oDiv.css('height', self.oModel.height);
		}
		
		// very handy for IE8 :after css (use .after instead)
		if( self.oDiv.find( '> .after' ).length<1 )
		{
			self.oDiv.append( '<div class="after"></div>');
		}
		
		self.oDiv.addClass( 'screenElement' );
		self.oDiv.addClass( this.oModel.type );
		self.oDiv.addClass( this.oModel.id );
		if( !self.oModel.enabled )
		{
			self.oDiv.addClass( 'disabled' );
		}
		
		if( self.oModel.classname )
		{
			self.oDiv.addClass( self.oModel.classname )
		}
		
		if( self.oModel.screensize )
		{
			self.resizeListen = true;
		}
		
		
		self.setContent();

		self.screenSizeUpdate()
		
		if(self.oModel.sFilters)
		{
			self.applyFilters( self.oModel.sFilters );
		}
		
		self.oDiv.find(':last-child').addClass('last-child');
	}
	
	self.appendChildren = function( xml_node )
	{
		
		var boxchildren = xml_node.children();
		for(var i = 0; i<boxchildren.length; i++)
		{
			var node = $(boxchildren[i])
			
			// console.log( "set target " + self.oModel.id )
			
			node.attr( 'target', self.oModel.id );
			if( !node.attr( 'id' ) )
			{
				node.attr( 'id', self.oModel.id + "_item" + i );
			}
		}
		self.screen_view.createScreenElements( xml_node )
	}
	
	self.update = function(  )
	{
		if ( devmode ) console.log( 'Log UPDATE ' + self.oModel.id )
		self.setContent();	
	}
	
	self.attachTscreen = function()
	{

		//	if ( devmode ) console.log( 'Log attachTscreen %O', self.oContentHolder  )
		
		if( self.oModel.animtype != "none" )
		{
			tweenTo(self.oDiv, 0, {alpha:0.01})
		}
		self.oContentHolder.append(self.oDiv);
		if( self.oModel.screensize )
		{
			self.screenSizeUpdate();
		}
	}
	
	self.testScreenSize = function()
	{
		var matchSize = false;
		if( self.oModel.screensize )
		{
			if ( devmode ) console.log( 'Log '+self.oModel.id+' testScreenSize ' + _respondo.screen_type + '  ' + self.oModel.screensize )
			if( _respondo.desktop() && ( self.oModel.screensize.indexOf( 'desktop' ) > -1 ) )
			{
				matchSize = true;
			}
			if( _respondo.phone() && ( self.oModel.screensize.indexOf( 'phone' ) > -1 ) )
			{
				matchSize = true;
			}
		}
		else
		{
			matchSize = true;
		}
		return matchSize;
	}
	
	self.screenSizeUpdate = function()
	{
		if( self.oModel.screensize && _respondo.ready() )
		{
			if( self.testScreenSize() )
			{
				if( self.contents )
				{
					self.oDiv.append( self.contents );
					self.contents = null;
				}
			}
			else
			{
				self.contents = self.oDiv.contents();
				self.oDiv.empty();
			}
			
			
		}
	}
	
	self.doTween = function( settings_obj )
	{
		//self.oModel.screen.view.doTween( self.oModel, settings );
		
		var scrn_elm = self.oModel;
		var animtime = settings_obj.time
		var item = self.oDiv
		
		
		var twnObj = new Object();
		twnObj.delay = settings_obj.delay;
		twnObj.ease = settings_obj.ease;
		
		// console.log("DO TWEEN "+scrn_elm.id + " > " + settings_obj.type);
		
		//item.css('display', 'block');
		twnObj.display = 'block';
		
		switch(settings_obj.type)
		{
			case "alpha": 
				twnObj.autoAlpha = 1;
				break;
			case "alphaout": 
				twnObj.autoAlpha = 0;
				twnObj.display = 'none';
				break;
			case "top": 
				tweenTo( item, 0, { top:0-100 } );
				twnObj.autoAlpha = 1;
				twnObj.top = scrn_elm.y;
				break;
			case "right": tweenTo( item, 0, { left: 1014 } );
				twnObj.autoAlpha = 1;
				twnObj.left = scrn_elm.x;
				break;
			case "rightout": tweenTo( item, 0, { right: 0 } );
				twnObj.autoAlpha = 0;
				twnObj.left = -100;
				break;
			case "bottom": 
				tweenTo( item, 0, { top:650 } );
				twnObj.autoAlpha = 1;
				twnObj.top = scrn_elm.y;
				break;
			case "left": tweenTo( item, 0, { left:0-item.width() } );
				twnObj.autoAlpha = 1;
				twnObj.left = scrn_elm.x;
				break;
			case "hidden":
				twnObj.autoAlpha = 0;
				twnObj.delay = 0;
				animtime = 0;
				twnObj.display = 'none';
				break;
			case "none": 
			default:
				twnObj.autoAlpha = 1;
				twnObj.delay = 0;
				animtime = 0;
				break;
		}
		

		twnObj.onComplete = function()
		{
//			if ( devmode ) console.log( 'Log TWEEN COMPLETE - ENABLE ' + self.oModel.id + ' - ' + self.oModel.enabled )
			if( self.oModel.view )
			{
				if( self.oModel.enabled )
				{
					self.oModel.enable(); 
				}
			}
		};
		
		_respondo.dispatcher.unbind( 'updateSize', self.screenSizeUpdate );
		
		if( self.resizeListen )
		{
			_respondo.dispatcher.bind( 'updateSize' , self.screenSizeUpdate );
			self.screenSizeUpdate();
		}

		self.activetween = tweenTo( item, animtime, twnObj );
		
		
	}
	
	self.applyFilters  = function( sFilters )
	{
		self.oDiv;
		if(!sFilters)
		{
			var sFilters = self.oModel.sFilters;
		}
		if( sFilters )
		{
			var filter_array =  sFilters.split("|");
			
			for(var i = 0; i<filter_array.length; i++)
			{
				var filter = filter_array[i];
				var filtertype = filter.split("_")[0].toLowerCase();
				var filtersettings = filter.split("_")[1];
				
				switch ( filtertype )
				{
			
					case "swapimage": self.swapImage( self.oDiv, filtersettings );
						break;
					case "css": self.oDiv.addClass( filtersettings );
						break;
					case "cssremove": self.oDiv.removeClass( filtersettings );
						break;
					default : self.oDiv.addClass( sFilters );
						break;					
				}				
			}
		}
	}
	
	self.removeFromScreen = function()
	{
		var screen_view = self.oModel.screen.view;
		var elm_obj = self.oModel;
		var div = self.oDiv
		tweenTo(div, 0.2, 
		{
			autoAlpha:0, 
			y: '+=10',
			onComplete:function()
			{
				div.empty().remove();
				screen_view.removeFromArray( elm_obj );
			} 
		});
		
		
	}
	
	self.kill = function()
	{
		if( self.activetween )
		{
			self.activetween.kill();
		}
		_respondo.dispatcher.unbind( 'updateSize', self.screenSizeUpdate );
		if( self.oContent )
		{
		
			if(  self.oContent.kill )
			{
				self.oContent.kill();
			}
			
			if( self.oContent.empty )
			{
				self.oContent.empty().remove();
			}
		
		}
		self.oDiv.empty().remove();
	}
	
	self.remove = function()
	{
		var screen_view = self.oModel.screen.view;
		$( self.oDiv ).empty().remove();
		var elm_obj = self.oModel;
		screen_view.removeFromArray(elm_obj)
	}
	
	self.setContent = function()
	{
		switch(self.oModel.type)
		{

		//KEEP?	 or convert to screen element...
			case "custom": self.templateView.custom( self.oModel );
				break;
				
		//CONVERT TO SUBCLASS
			//case "line": self.createLine();
				//break;
				
		//	case "box": self.createBox();
			//	break;
				
		//	case "image": self.createImage();
			//	break;
				
		//	case "status": self.createStatus();
			//	break;
				
		//	case "button": self.createButton();
			//	break;
				
		//	case "tabs": self.createTabs();
			//	break;
				
		//	case "audio": self.createAudio();
			//	break;
				
		//	case "video": self.createVideo();
			//	break;
				
		//	case "timer": self.createTimer();
			//	break;
				
			// case "sprite": self.createSprite();
				// break;
				
		   default:
			  break;
		}
	}
	
	
	self.createScreen = function()
	{
		if ( devmode ) console.log( 'Log CREATE SCREEN SUBCLASSED' )
	}
		
	self.createLine = function()
	{ 
		if ( devmode ) console.log( 'Log CREATE LINE SUBCLASSED' )
	}
	
	self.createBox = function()
	{ 
		if ( devmode ) console.log( 'Log CREATE BOX SUBCLASSED' )
	}
	
	self.createText = function()
	{
		if ( devmode ) console.log( 'Log CREATE TEXT SUBCLASSED' )
	}
	
	self.createImage = function()
	{
		if ( devmode ) console.log( 'Log CREATE IMAGE SUBCLASSED' )
	}
	
	self.createStatus = function()
	{
		if ( devmode ) console.log( 'Log CREATE STATUS SUBCLASSED' )
	}
	
	self.createButton = function()
	{
		if ( devmode ) console.log( 'Log CREATE BUTTON SUBCLASSED' )
	}
	
	self.createTabs = function()
	{
		if ( devmode ) console.log( 'Log CREATE TABS SUBCLASSED' )
	}

	/* MEDIA */
	self.createVideo = function()
	{
		if ( devmode ) console.log( 'Log CREATE VIDEO SUBCLASSED' )
	}
	
	self.createAudio = function()
	{		
		if ( devmode ) console.log( 'Log CREATE AUDIO SUBCLASSED' )
	}
	
	self.createTimer = function()
	{
		if ( devmode ) console.log( 'Log CREATE TIMER SUBCLASSED' )
	}
	
	self.createSprite = function()
	{
		// var xml = $(self.oModel.oXML);
		// self.oDiv.data('view', self);
		
		// self.oContent = new Sprite( self, xml );
		if ( devmode ) console.log( 'Log CREATE SPRITE SUBCLASSED' )
	}
	
}
