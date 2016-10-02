
// console.log("screentype text_graphic.js");
		
function parallax(s)
{
	var self = this; 
	self.oModel;
	self.screen 				= s;
	self.oXML 					= null;
	self.width;
	self.height;

	// elements
	self.oDiv;
	var parallaxHolder ;
	self.parallaxWindow;
	self.scroll_percent = 0;
	self.scroll_increment = 0.4;
	
	self.draggable;
	
	self.layerArray = [] ;
	// console.log("screentype text_graphic() obj");
	this.custom = function(model){
		// console.log("screentype tab_reveal.js custom()");
		
		this.oModel = model;
		this.oXML = this.oModel.oXML;
		this.oDiv = this.oModel.view.oDiv;
		
		this.width = $(this.oXML).attr('width');
		this.height = $(this.oXML).attr('height');
		this.x = $(this.oXML).attr('x');
		this.y = $(this.oXML).attr('y');
		
		self.scrubber = Boolean( $(self.oXML).attr('scrubber') == 'true' );
		
		self.parallaxWidth = this.width ;
		
		//this.oCustom = oCustom;
		
		//var parallaxHolder = $( document.createElement('div') );
		parallaxHolder = $('<div class="parallax_holder" id="parallax_holder"></div>');
		
		//style="left: 0px; width: 1014px; height: 644px; overflow-x: visible; "
		$(parallaxHolder).css( "position", 'absolute' );
		$(parallaxHolder).css( "width", this.width );
		$(parallaxHolder).css( "height", this.height );
		//$(parallaxHolder).css( "background", "#ff6666" );

		//$(parallaxHolder).css( "overflow-x", "auto" );

		//this.oDiv.css( "overflow", "hidden" );
		//parallaxHolder.attr('src', '../images/ui/menu_'+(i+1)+'.png');												
		this.oDiv.append(parallaxHolder);
		self.parallaxHolder = parallaxHolder ;
		
		
		for ( var i = 0; i < $(this.oXML).children().length; i++)
		{
			var xml_node = $(this.oXML).children() [ i ] ;
			var next_xml_node = $(this.oXML).children() [ i+1 ] ;
			
			switch ( xml_node.nodeName )
			{
				case "settings": 	this.createSettings( $( xml_node ) ) ;
					break;
				
				case "layer": 
					var id = this.layerArray.length + 1;				
					var oLayer = new this.createLayer( id, $( xml_node ), this );
					this.layerArray.push( oLayer );
					
					
					//this.screen.view.createScreenElements(xml_node);
					//this.parallaxHolder.createScreenElements(xml_node);
				break;
			}
		}
		
		this.attachControls();
		
	}
	
	this.disable = function()
	{
		var draggable = Draggable.get(self.scrubLayer.layerDiv);
		if( draggable )
		{
			draggable.disable()
		}
	}
	
	this.enable = function()
	{
		var draggable = Draggable.get(self.scrubLayer.layerDiv);
		if( draggable )
		{
			draggable.enable();
		}
	}
	
	
	this.createLayer = function( id, layer_node, oCustom )
	{ 
		//this.screen.view.createScreenElements(layer_node);

		this.oCustom = oCustom;
		this.id = id;
		//this.clicktext = $( click_node.text() );
		this.layerID = this.oCustom.screen.id + '_layer_' + this.id		
		
		this.layerDiv = $('<div class="layer" id="' + this.layerID + '"></div>');
		
		
		this.layerWidth = layer_node.attr("width") ;
		
		this.layerDiv.width(this.layerWidth);
		this.layerDiv.height(self.height);
		
		$(parallaxHolder).append( this.layerDiv );	

		
		var layerchildren = layer_node.children();
		for( var i = 0; i < layerchildren.length; i++ )
		{
			var node = $( layerchildren[ i ] );
			
			if( node.attr( 'target') == "undefined" || !node.attr( 'target') )
			{
				node.attr( 'target', this.layerDiv.attr("id") );
			}
			
			if( !node.attr( 'id' ) )
			{
				node.attr( 'id', 'layer_' + this.id + '_item' + i );
			}
		}
		
		
		this.layer_node = layer_node ;
	}
	
	this.attachContents = function()
	{
	
		for( var i = 0; i < this.layerArray.length; i++ )
		{
			var oLayer = this.layerArray[ i ];
			
			oLayer.oCustom = this;
			oLayer.oLayer = oLayer;
						
			this.screen.view.createScreenElements(oLayer.layer_node);
		}
	}
	
	this.attachControls = function()
	{
		if(self.scrubber)
		{
			// scrubber code needs re-writing
		}	
		else
		{
		
			self.scrubLayer = self.layerArray[ self.layerArray.length-1 ]
		
			self.parallaxHolder.scroll( function() 
			{
			
			
				var max_offset = ( self.parallaxHolder[0].scrollWidth  - (self.width*2));
				var current_x = self.parallaxHolder.scrollLeft();
				self.scroll_percent = ( current_x / max_offset );
			
				if(self.scroll_percent>1)
				{
					self.scroll_percent = 1;
				}
				
				if(self.scroll_percent<0)
				{
					self.scroll_percent = 0;
				}
			  
				if( current_x != 0)
				{
					self.moveLayers(  )
					self.parallaxHolder.scrollLeft(0)
				}
			});
			self.draggable = Draggable.create( self.scrubLayer.layerDiv, 
			{
				type: "left",
				bounds:{minX: 0- ( self.scrubLayer.layerDiv.width() - self.width ), maxX:0 },
				edgeResistance:1,
				zIndexBoost: false,
				throwProps:true,
				
				onDrag:function() 
				{
					self.updateScrollPercent( ) ;
					self.moveLayers( self.scrubLayer.layerDiv )
				},
				onDragEnd:function() 
				{
					self.updateScrollPercent( ) ;
					self.moveLayers( self.scrubLayer.layerDiv )
				},
				onThrowUpdate :function()
				{
					self.updateScrollPercent( ) ;
					self.moveLayers( self.scrubLayer.layerDiv )
				},
				onThrowComplete :function()
				{
					self.updateScrollPercent( ) ;
					self.moveLayers( self.scrubLayer.layerDiv )
				},
				ease:Strong.easeOut
				/*snap:{ 
					x:[ 590, 775 ], 
					y:[ 160 ]
					}*/
									
			});
		}
		/*	
		self.sliderTab = sliderTabDiv ;
		self.sliderTrack = sliderTrackDiv ;	
		*/
	}
	
	this.onDrag = function( dragObject )
	{
		self.moveLayers( dragObject.x ) ;
	}
	
	this.onThrow = function( dragObject )
	{
		self.moveLayers( dragObject.x ) ;
	}
	
	this.onLayerDrag = function( dragObject )
	{
		self.moveSlider( dragObject.x ) ;
	}
	
	this.onLayerThrow = function( dragObject )
	{
		self.moveSlider( dragObject.x ) ;
	}
	
	this.screenElementsReady = function()
	{
		this.attachContents();
		
		
		this.setupScrollControls() ;		
	}

	this.setupScrollControls = function()
	{
		//tweenTo( self.parallaxHolder, 2, { x: -700, yoyo : true, repeat : -1 }) ;		
		
	}		
	
	this.parallaxJump = function(percentage){
		var currPercentage = (percentage < 1) ? 1 : (percentage > 99) ? 99 : percentage;
		var trackWidth = parseInt( self.sliderTrack.css('width') ) - parseInt( self.sliderTab.css('width') ) ;
		var x = Number(currPercentage) * trackWidth / 100;

		self.moveSlider(-x)
		self.moveLayers()
	}
	
	
	
	/* ============================= MOUSE MOVEMENT CODE ================================== */

	var dragobj = null;


	function update(e)
	{
		self.moveLayers() ;
	}

	
	self.updateScrollPercent = function()
	{
		var max_offset = 0- ( $(self.scrubLayer.layerDiv).width() - self.width );
		var current_x = self.scrubLayer.layerDiv.position().left;
		self.scroll_percent = (current_x / max_offset);

		if(self.scroll_percent>1)
		{
			self.scroll_percent = 1;
		}
		
		if(self.scroll_percent<0)
		{
			self.scroll_percent = 0;
		}
	}
	
	self.scrollRight = function()
	{
		self.scroll_percent += self.scroll_increment;
		if(self.scroll_percent>1)
		{
			self.scroll_percent = 1;
		}
		self.moveLayers( );
	}
	
	self.scrollLeft = function()
	{
		self.scroll_percent -= self.scroll_increment;
		if(self.scroll_percent<0)
		{
			self.scroll_percent = 0;
		}
		self.moveLayers( );
	}
	
	self.moveLayers = function( control_layer_div )
	{
		// apply scroll position update to each layer
		for( var i = 0; i < this.layerArray.length; i++ )
		{
			var oLayer = this.layerArray[ i ];
			
			
			if(oLayer.layerDiv != control_layer_div)
			{
				var layer_width = oLayer.layerWidth ;			
				var width_diff = self.parallaxWidth - layer_width ;

				
				var xPos = ( width_diff * self.scroll_percent );
				
				if( xPos > 0)
				{ 
					xPos = 0 ;
				}
				
				var time = 0.5;
				
				if( control_layer_div )
				{
					time = 0;
				}
				
				
				tweenTo( oLayer.layerDiv, time, { left: xPos }) ;
			}
		}
	}
	
	this.moveSlider = function( layerX )
	{
		//console.log("moveSlider " + layerX)
		// move the slider to the correct position
		var layerDiv = this.layerArray[0].layerDiv;
		
		var trackWidth = parseInt( self.sliderTrack.css('width') ) - parseInt( self.sliderTab.css('width') ) ;
		
		var paraWidth = self.parallaxWidth ;
		var lWidth = layerDiv.layerWidth ;			
		var wDiff = paraWidth - lWidth ;
		
		var xPos = ( 0 - layerX );
		//console.log("moveSlider " + xPos )
		
		tweenTo( self.sliderTab, 0.2, { x: xPos }) ;
	}
	this.parallaxJumpToPercentage = function(percentage){
		self.parallaxJump(percentage);
	}
}

