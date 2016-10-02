
// console.log("screentype text_graphic.js");
		
function photostory(s)
{
	var self = this; 
	self.oModel;
	self.screen 				= s;
	self.screen_view			= self.screen.view;
	self.oXML 					= null;
	self.width;
	self.height;

	// elements
	self.oDiv;
	self.nextBtn ;
	self.backBtn ;
	self.progressHolder = $( document.createElement('div') );
	
	self.overrideNav = false;
	self.progressIconArray = [] ;
	self.cellArray = [] ;
	 
	self.activeCellID = 0 ;
	self.totalCells = 0 ;
	
	// console.log("screentype text_graphic() obj");
	self.custom = function(model)
	{
		// console.log("screentype tab_reveal.js custom()");

		self.oModel = model;
		self.oXML = self.oModel.oXML;
		self.oDiv = self.oModel.view.oDiv;
		
		self.width = Number( $(self.oXML).attr('width') );
		self.height = Number( $(self.oXML).attr('height') );
		self.x = $(self.oXML).attr('x');
		self.y = $(self.oXML).attr('y');
		
		self.photostoryWidth = self.width ;
		
		
		self.photostoryHolder = $('<div class="photostory_holder" id="' + self.screen.id + '_photostory_holder"></div>');
		
		self.photostoryHolder.css( "overflow", "hidden" );
		self.oDiv.addClass('photostory');
		self.oDiv.append(self.photostoryHolder);
		
		self.strip = $('<div class="strip"></div>');
		
		self.photostoryHolder.append( self.strip );
		
		
		self.progressHolder.attr('class', 'progress');		
		self.oDiv.append(self.progressHolder);
		
		for ( var i = 0; i < $(this.oXML).children().length; i++)
		{
			
			var xml_node = $(this.oXML).children() [ i ] ;
			
			switch ( xml_node.nodeName )
			{
				case "settings": 	this.createSettings( $( xml_node ) ) ;
					break;
				
				case "cell": 
					var id = this.cellArray.length;
					var oCell = new this.createCell( id, $( xml_node ), this );
					this.cellArray.push( oCell );
					
				break;
			}
		}
		
		this.totalCells = this.cellArray.length ;

	}
	
	self.kill = function()
	{
	//	_respondo.dispatcher.unbind( 'updateSize' , self.updateSize );
	}
	
	self.createSettings = function( settings_xml )
	{
		self.dragnav = Boolean( $(settings_xml).attr('dragnav') == "true" );
		self.buttony = Number( $(settings_xml).attr('buttony'));
		self.buttonSpacing = Number( $(settings_xml).attr('buttonspacing'));
		self.overrideNav = Boolean( $(settings_xml).attr('overridenav') == 'true' );
		
		self.screen.reloadOnResize();;
		//_respondo.dispatcher.unbind( 'updateSize' , self.updateSize );
		//_respondo.dispatcher.bind( 'updateSize' , self.updateSize );
	}
	
	self.createCell = function( id, cell_node )
	{ 
		//this.screen.view.createScreenElements(cell_node);
		var cell_object = this;
		cell_object.id = id;
		//this.clicktext = $( click_node.text() );
		
		cell_object.cellID = self.screen.id + '_cell_' + cell_object.id	;
		cell_object.cellDiv = $('<div class="cell" id="' + cell_object.cellID + '"></div>');
		
		cell_object.cellpos = ( id * self.width )
		cell_object.cellDiv.css( "left", cell_object.cellpos) ;
		cell_object.cellDiv.css( "top", 0) ;
		
		
		cell_object.cellDiv.css('width', self.width )
		cell_object.cellDiv.css('height', self.height );

		
		
		cell_object.event = cell_node.attr("event") ;
				
		cell_object.layerWidth = cell_node.attr("width") ;
		
		self.strip.append( cell_object.cellDiv );
		
		var layerchildren = cell_node.children();
		for( var i = 0; i < layerchildren.length; i++ )
		{
			var node = $( layerchildren[ i ] );
			
			node.attr( 'target', cell_object.cellID );
			if( !node.attr( 'id' ) )
			{
				node.attr( 'id', 'cell_' + cell_object.id + '_item' + i );
			}
		}
			
		cell_object.cell_node = cell_node ;
		
		TweenMax.delayedCall(0, function(){ self.screen_view.createScreenElements(cell_object.cell_node) } );
	}
	
	self.attachControls = function()
	{
		if( self.progressHolder )
		{
			self.progressHolder.empty();
			self.progressIconArray = [];
		}
		var width = 0;
		
		for( var i = 0; i < this.cellArray.length; i++)
		{
			//photostoryProgressHolder
			
			var progressIconDiv = $( document.createElement('div') );
			//var progressIcon = $( document.createElement('img') );
			//progressIcon.attr('src', '../images/ui/photostory/photostory_progress.png');
			progressIconDiv.attr('class', 'progressButton');		
			progressIconDiv.css('top', self.buttony);			
			progressIconDiv.id = i ;
			progressIconDiv.event = self ;
			
			  
			//progressIconDiv.append(progressIcon);	
			self.progressHolder.append(progressIconDiv);	
			
			var position =  ((progressIconDiv.width()+self.buttonSpacing)*i) ;
			progressIconDiv.css('left', position );
			
			width = progressIconDiv.position().left + progressIconDiv.width()
			
			progressIconDiv.event = this.cellArray[ i ].event; 
			
			self.progressIconArray.push( progressIconDiv ) ;
			
			applyClick(
					progressIconDiv,
					
					function () {
						var elm = $( this ).data( 'elm' );
						self.selectProgressIcon( elm );						
					}
				);
		}
		
		
		//var width = self.progressHolder.width();
		self.progressHolder.css("left", (self.width / 2) - ( width / 2 )) ;
		
		
		
	}
	
	self.updateSize = function()
	{
		self.screen.reloadScreen();
	
	}
	
	
	self.screenElementsReady = function()
	{
		self.attachControls()
		//setTimeout( self.setupScrollControls, 100) ;
		TweenMax.delayedCall(0, self.setupScrollControls)		
	}

	self.setupScrollControls = function()
	{
		//tweenTo( self.photostoryHolder, 2, { x: -700, yoyo : true, repeat : -1 }) ;
		
		var snaparray_x = [];
		for( var i = 0; i < self.cellArray.length; i++ )
		{
			var oCell = self.cellArray[ i ];
			oCell.cellpos = ( i ) * self.photostoryHolder.width();
			oCell.cellDiv.css( "left", ( oCell.cellpos )) ;
			snaparray_x.push( 0-oCell.cellpos )
		}
		
		if( self.dragnav )
		{
			if( _respondo.desktop() )
			if ( !(isIE()==8) )
			{
			Draggable.create(
				self.strip, 
				{
					type:"left", 
					edgeResistance:4, 
					throwProps:true, 
					zIndexBoost:false,
					snap: {
						left: snaparray_x
						},
					onThrowComplete : function()
						{
							self.activateCell()
						}
						
				}
			);
			}
		}
		//this.init() ;
		self.activateCell()
		
		
	}	
	

	
	/* ============================= SCREEN SPECIFIC FUNCTIONALITY ================================== */
	
	self.displayCellById = function( id, t )
	{
		if( !t )
		{
			t = 0.5
		}
		tweenTo( self.strip, t, { left: -id * self.photostoryWidth, onComplete: self.activateCell } );
	}
	
	self.activateCell = function()
	{
		var id=0;
		for( var i = 0; i < self.cellArray.length; i++ )
		{
			var oCell = self.cellArray[ i ];
			
			if( Math.round( self.strip.position().left ) == Math.round( 0-oCell.cellpos ) )
			{
				id = i
			}
		}
	
		self.activeCellID = id ;
		self.screen_view.doEventById( self.progressIconArray[ self.activeCellID ].event, "click" );
		self.updateProgressDisplay( id );
		navObj.initNav() ;
	}
	
	self.lastpos = function()
	{
		return ( self.progressIconArray.length * self.photostoryWidth );
	}
	
	self.nextCell = function()
	{
		self.activeCellID++ ;
		

		
		self.updateProgressDisplay( self.activeCellID );
		self.displayCellById( self.activeCellID ); 
		navObj.initNav() ;
	}
	
	self.backCell = function()
	{
		self.activeCellID-- ;
		self.updateProgressDisplay( self.activeCellID );
		self.displayCellById( self.activeCellID ); 
		navObj.initNav() ;
	}
	
	// ------------------ OVERRIDE NAV CHECKS ---------------------- //
	
	/*
		These functions are called from screen.js in order to check whether this template wants to override the nav buttons
		If it does, it returns true in the check, then performs the actual override
		If not, false is returned, and the navigation continues its goNext called
		
		The following 4 functions will be needed for any template requiring an override.
		A template with no override defined will always return false at screen.js level
	*/
	
	self.checkOverrideNext = function()
	{
		if( self.overrideNav )
		{
			if( self.activeCellID >= (self.totalCells -1 ) || _respondo.phone() )
			{
				return false ;
			}
			else
			{
				return true ;
			}
		}
		else
		{
			return false ;
		}
	}
	
	self.overrideNext = function()
	{
		self.nextCell( );
	}
	
	self.checkOverrideBack = function()
	{
		if( self.overrideNav )
		{
			if( self.activeCellID == 0 || _respondo.phone() )
			{
				return false ;
			}
			else
			{
				return true ;
			}
		}
		else
		{
			return false ;
		}	
	}
	
	self.overrideBack = function()
	{
		self.backCell( );
	}
	
	// ------------------ END OF OVERRIDE NAV CHECKS ---------------------- //

	self.selectProgressIcon = function( elm )
	{
		// enable all 
		self.enableAllProgressButtons() ;
		
		self.displayCellById( elm.id );
		
		self.updateProgressDisplay( elm.id );
		
		
	}
	
	self.updateProgressDisplay = function( id )
	{
		self.enableAllProgressButtons() ;
		disableElement( self.progressIconArray[ id ] );
		self.progressIconArray[ id ].addClass( "selected" );
	}
		
	self.enableAllProgressButtons = function()
	{
		for( var i = 0 ; i < self.progressIconArray.length; i++)
		{
			enableElement( self.progressIconArray[ i ] ) ;
			self.progressIconArray[ i ].removeClass( "selected" );
		}
	}
	
	
}
