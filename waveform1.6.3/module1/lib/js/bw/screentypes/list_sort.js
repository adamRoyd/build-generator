
// if ( devmode ) console.log("screentype list_sort.js");
		
		// FUNCTIONALITY
		// http://codepen.io/agsystems/pen/BypmJv
		
		
function list_sort(s)
{
	var self = this ;
	self.screen 				= s;
	self.screen_view 		= self.screen.view;
	self.oXML 					= null;

	// elements
	self.oDiv;
	self.submitBtn;
	self.resetBtn;
	
	// object arrays
	self.optionArray 		= [];
	
	
	
	// if ( devmode ) console.log("screentype list_sort() obj");
	self.custom = function( model )
	{
		self.oModel = model;
		self.oXML 	= self.oModel.oXML;
		self.oDiv 	= self.oModel.view.oDiv;
		
		// if ( devmode ) console.log( "CUSTOM " + this.oXML );
		
		for ( var i = 0; i < $(self.oXML).children().length; i++)
		{
			var xml_node = $(self.oXML).children() [ i ] ;
			// if ( devmode ) console.log( i + " - " + xml_node.nodeName );
			
			switch ( xml_node.nodeName )
			{
				case "settings": 	self.createSettings( $( xml_node ) ) ;
					break;
					
				case "option":		self.optionArray.push( new self.option( $( xml_node ), self.optionArray.length + 1, this ) );
					break;
					
				case "fb": 			self.screen_view.createFeedback( $( xml_node ) );
					break;
			}
		}
		
		self.appendOptions() ;		
	}


	self.appendOptions = function()
	{
	
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			
			self.oDiv.append( oOpt.option );
			
		}

	}

	self.initOptions = function()
	{


		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];

			oOpt.draggable = Draggable.create(oOpt.inner, {type:"y", edgeResistance:0.65, onDragStart:self.startDrag, onDragEnd:self.stopDrag });

		}
		disableContentButton( self.submitBtn );
		disableContentButton( self.resetBtn );
		disableContentButton( self.scaBtn );	
	}


	self.startDrag = function()
	{
		var targ = this.target
		$(targ).parent().addClass('dragging');
		
		tweenTo( $(targ), 0.2, { scale: 1.1, rotation: 2});
	}

	self.stopDrag = function(  )
	{
		var targ = this.target
		tweenTo( $(targ), 0.2, { scale: 1, rotation: 0});
		self.sortByY();
		self.enableSubmit()
	}
	
	self.sortByY = function()
	{
		self.oDiv.find('.list_sort_item').sort(self.y_sort).appendTo(self.oDiv);

		TweenMax.to($('.inner'), 0, {y:0})
		self.oDiv.find('.dragging').removeClass('dragging')
	}

	// accending sort
	self.y_sort = function( a, b )
	{
		return ( $( b ).find( '.inner' ).offset().top ) <= ( $( a ).find( '.inner' ).offset().top ) ? 1 : -1;    
	}

	// accending sort
	self.correct_sort = function( a, b )
	{
		return ( $( b ).data('obj').correct ) <= ( $( a ).data('obj').correct ) ? 1 : -1;    
	}

	// accending sort
	self.original_sort = function( a, b )
	{
		return ( $( b ).data('obj').id ) <= ( $( a ).data('obj').id ) ? 1 : -1;    
	}
		
	//	<settings optwidth="180" optionoffset="10" radiomode="true" randomise="false" />
	self.createSettings = function( oXML )
	{
		self.unlockOnIncorrect = true ;
		if( oXML.attr( "unlockOnIncorrect" ) )
		{
			self.unlockOnIncorrect = oXML.attr( "unlockOnIncorrect" ) === 'true' ;			
		}
		
	}
	
	//	<option correct="false"><![CDATA[<p class="option" align="center">Agree</p>]]></option>
	self.option = function( oXML, id, oCustom )
	{
		var opt_obj = this;
		opt_obj.draggable 		= null;
		opt_obj.oCustom 		= oCustom;
		opt_obj.bCorrect = false;
		opt_obj.correct 		= Number( oXML.attr( "correct" ) );
		
		opt_obj.iPoints 		= Number( oXML.attr( "points" ) );
		
		if( isNaN( opt_obj.iPoints ))
		{
			opt_obj.iPoints = self.defaultPointsValue ;
		}
		
		opt_obj.id 			= id;
		opt_obj.option 	= $( '<div class="list_sort_item" />' );
		opt_obj.inner 	= $( '<div class="inner" />' );
		
		opt_obj.option.data('obj', opt_obj);
		
		opt_obj.option.append( opt_obj.inner );
		
		var text = $( oXML.text() );
		if( masterObj.bCheatMode && ( opt_obj.correct>0) )
		{
			text.prepend( "*"+opt_obj.correct+" " );
		}
		
		opt_obj.inner.append( text );
		
		opt_obj.option.width( oCustom.optionwidth );
		
		opt_obj.option.oObj = opt_obj;
		
	}
	
	
	self.disableSubmit = function()
	{
		disableContentButton( self.submitBtn );
	}
	
	self.enableSubmit = function()
	{
		var submit_btn = self.submitBtn;
		if( submit_btn )
		{
			enableContentButton( submit_btn );
		}
		else
		{
			self.submit()
		}
	}
	
	
	self.disableReset = function()
	{
		disableContentButton( self.resetBtn );
	}
	
	self.enableReset = function()
	{	
		enableContentButton( self.resetBtn );
	}
	
	self.disableOptions = function()
	{
		
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			if( oOpt.draggable )
			{
				oOpt.draggable[0].disable( );
			}
		}
	}
	
	self.enableOptions = function()
	{
		
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			// if ( devmode ) console.log( " > enable option " + oOpt.id );
			
			if( oOpt.draggable )
			{
				oOpt.draggable[0].enable( );
			}
		}
	}
	
	
	
	self.submit = function()
	{
	
		self.disableOptions();
	
		self.screen.setAnswered( true ); 
		
		var correct_count = 0;
		var correct_choices = 0;
		var incorrect_choices = 0;
		
		var screen_points = 0;
		
		var selected_id = null
		var fbObj = null;
		
		var option_fb = null;
		
		var answeredCorrectly = false ;
		
		var option_elements = self.oDiv.find( '.list_sort_item' );
		
		for( var i = 0; i < option_elements.length; i++ )
		{
			var oOpt = $(option_elements[ i ]).data('obj');
		
			if( ( oOpt.correct - 1 ) == i )
			{

				//only show ticks if not assessed
				if( !self.screen.getScored() )
				{
					oOpt.tick = $('<div class="tick"></div>')
					oOpt.option.append( oOpt.tick )
				}
			
				correct_choices++
				
			}
			else
			{
		
				incorrect_choices++;

			}
		}
		
		var feedback_id = "fail";
		
		if( ( self.optionArray.length == correct_choices ) )
		{
			answeredCorrectly = true ;
			feedback_id = "pass";
		}
		else if( correct_choices > 0 )
		{
			
			feedback_id = "partial";
		}
		else
		{
			feedback_id = "fail";
		}
	
		if( self.screen_view.checkFeedback( selected_id ) )
		{
			feedback_id = selected_id
		}
	
		if( answeredCorrectly )
		{
			self.screen.setPassed( true )
		}
		else
		{
			self.screen.setPassed( false )
		}
		
		if( !self.screen.getScored() )
		{
			
			if( !answeredCorrectly )
			{
				enableContentButton( self.scaBtn );
			}
		}
		
		self.screen_view.applyFeedback( feedback_id ) ;
	
		disableContentButton( self.submitBtn );
	
		if( self.resetBtn && ( !self.screen.getScored() ) )
		{
		
			self.enableReset() ;
			
			self.disableSubmit();
		}
				
		if( answeredCorrectly )
		{
		//	unlockNext() ;
		}
		else
		{
			if( self.unlockOnIncorrect )
			{
		//		unlockNext() ;
			}
		}
		
	}
	
	self.showCorrect = function()
	{
		self.oDiv.find('.list_sort_item').sort(self.correct_sort).appendTo(self.oDiv);
		
		disableContentButton( self.scaBtn );
	}
	
	self.reset = function()
	{
		self.screen_view.removeFeedback();
		
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			
			if( oOpt.tick )
			{
				oOpt.tick.remove()
			}
			if( oOpt.selected )
			{
				self.setDeselected( oOpt ) ;
			}
		}
		self.oDiv.find('.list_sort_item').sort(self.original_sort).appendTo(self.oDiv);
		
		self.enableOptions();
		
		self.disableReset() ;
		self.screen_view.doClickById('reset');
		disableContentButton( self.scaBtn );	
	}
	

	self.screenElementsReady = function()
	{
		self.submitBtn = self.screen.view.getScreenElementById( 'submitBtn' );
		self.resetBtn = self.screen.view.getScreenElementById( 'resetBtn' );
		self.scaBtn = self.screen.view.getScreenElementById( 'scaBtn' );
		self.initOptions()
	//	self.enableOptions();
		// if ( devmode ) console.log("screentype mcq.js screenElementsReady()");
	}

	self.getOptionById = function( id )
	{
		var rtn = getItemById( id, self.optionArray );
			
		return rtn;
	}

	
	
}
