
// console.log("screentype drag_drop.js");
		
function drag_drop(s)
{
	var self = this;
	self.screen 				= s;
	self.screen_view		= self.screen.view;
	self.oXML 					= null;

	// elements
	self.oDiv;
	
	// buttons
	self.resetBtn;
	self.submitBtn;
	self.smaBtn;
	self.scaBtn;
	
	// object arrays
	self.dragArray 			= [];
	self.dropArray 			= [];
	
	self.totalRequiredDrops = 0 ;
	self.submitPressed = false ;
	
	self.custom = function( model )
	{
		self.oModel = model;
		self.oXML 	= self.oModel.oXML;
		self.oDiv 		= self.oModel.view.oDiv;
		
		for ( var i = 0; i < $(self.oXML).children().length; i++)
		{
			var xml_node = $(self.oXML).children() [ i ] ;
			
			switch ( xml_node.nodeName )
			{
				case "settings": 	self.createSettings( $( xml_node ) ) ;
					break;
					
				case "drag":		self.dragArray.push( new self.drag( $( xml_node ) ) );
					break;
					
				case "drop":		self.dropArray.push( new self.drop( $( xml_node ) ) );
					break;
					
				case "fb": 			self.screen_view.createFeedback( $( xml_node ) );
					break;
			}
		}
		
		self.resetBtn = self.screen.view.getScreenElementById( 'resetBtn' );
		self.submitBtn = self.screen.view.getScreenElementById( 'submitBtn' );
		self.smaBtn = self.screen.view.getScreenElementById( 'smaBtn' );
		self.scaBtn = self.screen.view.getScreenElementById( 'scaBtn' );
	
		self.setupParams() ;		
	}
	
	self.resetScreen = function()
	{
		self.screen_view.removeFeedback();
		
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			var oDrag = self.dragArray[ i ];
			oDrag.inTarget		= false ;
			oDrag.targetDrop		= null ;
			oDrag.answeredDrop	= null ;
			
			tweenTo( $( oDrag.drag ), 0.2, { scaleX:1, scaleY:1, left: oDrag.origX, top: oDrag.origY } );
			
		}
		
		for( var i = 0; i < self.dropArray.length; i++ )
		{
			var oDrop = self.dropArray[ i ];
			oDrop.dragArray = [] ;
			oDrop.userArray = [] ;
			oDrop.correctArray = [] ;
		}
		self.submitPressed = false;
		self.enableAllDrags();
		
		disableContentButton( self.screen.view.getScreenElementById( 'resetBtn' ) );
	}
	
	self.submit = function()
	{
		self.screen.setAnswered( true ); 
		self.disableAllDrags() ;
		self.checkAnswers() ;
	}

	self.screenElementsReady = function()
	{
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			var oDrag = self.dragArray[ i ];
		
			oDrag.origH = oDrag.drag.outerHeight();
			oDrag.origW = oDrag.drag.outerWidth();
			tweenTo( $( oDrag.drag ), 0, { scaleX:1, scaleY:1, left: oDrag.origX, top: oDrag.origY } );
		}
		
	}
	
	/* ============================= S E T T T I N G S  &  F E E D B A C K ============================= */
	
	self.createSettings = function( oXML )
	{
		self.dropscale  	= Number( oXML.attr( "dropscale" ) );
	}
		
	self.setupParams = function() 
	{
		self.totalRequiredDrops = 0;
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			var item = self.dragArray[ i ];
			if( item.match != 0 )
			{
				self.totalRequiredDrops++;
			}
		}
	}
	
	/* ============================= D R A G  O B J E C T ============================= */
	
	self.drag = function( oXML, id )
	{
		var drag_obj = this;
		//	this.oCustom 		= oCustom;
		drag_obj.bCorrect 		= Boolean( oXML.attr( "correct" ) == "true" );
		drag_obj.id 					= oXML.attr( "id" );
		drag_obj.match			= oXML.attr( "match" );

		drag_obj.inTarget		= false ;
		drag_obj.targetDrop		= null ;
		drag_obj.answeredDrop	= null ;
		drag_obj.targetY		= 0 ;

		var elementStr = oXML.text() ;
		var element = self.screen.view.getScreenElementById( elementStr )
		if( element )
		{
			var dragElement 		= element.view.oDiv;		

			drag_obj.drag = dragElement;
			drag_obj.drag.addClass('dragElement')
			// drag_obj.drag.oCustom = this.oCustom ;
			drag_obj.drag.data('dragObject', this);


			drag_obj.origX			= parseInt( $(dragElement).css( "left" ));
			drag_obj.origY			= parseInt( $(dragElement).css( "top" ));

			drag_obj.origH = $(dragElement).outerHeight();
			drag_obj.origW = $(dragElement).outerWidth();

			drag_obj.resetPosition = function(  )
			{

				tweenTo( drag_obj.drag, 0, { rotation: 2}) ;
				tweenTo( drag_obj.drag, 0.3, { rotation: 0, left : drag_obj.origX, top : drag_obj.origY, scale: 1}) ;
				drag_obj.targetDrop	= null ;
				drag_obj.inTarget		= false ;
			}

			drag_obj.draggable = 	Draggable.create(drag_obj.drag, {
				edgeResistance:1,
				type:"left,top",
				bounds : self.screen.view.oHolder,
				onDragStart : function(){ self.startDrag(drag_obj) },

				onDragEnd : function(e) 
				{
					var i =  self.dropArray.length;
					while (--i > -1) 
					{
						var drop_element = self.dropArray[ i ].drop;
						if( isFunction( this.hitTest ) )
						{
							var drop_element_id = "#" + drop_element.attr( 'id' );

							var hit = false;
							try
							{
								hit = this.hitTest( drop_element_id, '55%' );
							}
							catch(err)
							{ 
								/* ERROR LOG */
								if ( devmode ) console.log( 'CATCH ERROR, (probably IE8) so using less good, hitCheck function of hitTest :' + err );
								// alternative hit test for stupid IE8
								hit = self.hitCheck( drag_obj.drag[0], drop_element[0] )
							}
							if ( hit ) 
							{
								//onDrop(this.target,  self.dropArray[i]);
								drag_obj.targetDrop = self.dropArray[i];
								drag_obj.inTarget = true;
							}
						}
					}
					self.stopDrag( drag_obj )
				}
			});
		}
	}
	
	self.hitCheck = function(o, l)
	{
		function getOffset(o)
		{
			for(var r = {l: o.offsetLeft, t: o.offsetTop, r: o.offsetWidth, b: o.offsetHeight};
			o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop);
			return r.r += r.l, r.b += r.t, r;
		}

		for(var b, s, r = [], a = getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
		b = getOffset(l[--i]), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
		&& (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
		return j ? !!r.length : r;
		
	};
	
	
	self.startDrag = function( drag_object )
	{
		if(  drag_object.inTarget ) 
		{
			self.setDragStart( drag_object ) ;
			
		}
		tweenTo( drag_object.drag, 0.2, { scale: 1.1, rotation: 2});
	}	
	
	self.setDragStart = function( drag_object )
	{
		drag_object.targetDrop.removeDrag( drag_object )
		var targ_drop = drag_object.targetDrop;
		drag_object.targetDrop = null ;
		drag_object.inTarget = false ;
		self.checkTotalDrops() ;
	}
	
	self.dragEnd = function( drag_object )
	{
	
		for( var i = 0; i < self.dropArray.length; i++ )
		{
			var item = self.dropArray[ i ];
			
			if(  Draggable.hitTest( item.drop, drag_object.drag, "50%" ) )
			{
				drag_object.targetDrop = item;
			}
		}
		
		self.stopDrag( drag_object )
	}
	
	self.stopDrag = function( drag_object )
	{
		if( drag_object.inTarget )
		{
			var dropObj = drag_object.targetDrop;
			if( dropObj.dragArray.length >= dropObj.maxdrop )
			{
				drag_object.inTarget = false;
				drag_object.resetPosition();
			}
			else
			{
				// object is in target - positioning handled by drop object
				dropObj.addDrag( drag_object );
			}
		}
		else
		{
			// not placed on any target, reset to original position
			drag_object.inTarget = false;
			drag_object.resetPosition();
		}
		
		self.checkTotalDrops()
	}
	
	/* ============================= D R O P  O B J E C T ============================= */
	
	self.drop = function( oXML )
	{
		var drop_obj = this;
		//	this.oCustom 		= oCustom;
		drop_obj.id 			= oXML.attr('id');
		var elementStr = oXML.text() ;
		var dropElement 		= self.screen.view.getScreenElementById( elementStr ).view.oDiv;		
		drop_obj.drop = dropElement;
		
		//this.id             = oXML.attr( "id" ) ;
		drop_obj.dropposition   = parseInt( oXML.attr( "dropposition" )) ;
		drop_obj.stackitems     = parseInt( oXML.attr( "stackitems" )) ;
		drop_obj.stackpaddingv  = Number( oXML.attr( "stackpaddingv" )) ;
		drop_obj.stackpaddingh  = Number( oXML.attr( "stackpaddingh" )) ;
		drop_obj.maxdrop        = parseInt( oXML.attr( "maxdrop" )) ;
		drop_obj.x_offset        = Number( oXML.attr( "xoffset" )) ;
		drop_obj.y_offset        = Number( oXML.attr( "yoffset" )) ;
		
		drop_obj.x = Number( drop_obj.drop.css('left').split('px')[0] );
		drop_obj.y = Number( drop_obj.drop.css('top').split('px')[0] );
		drop_obj.width = drop_obj.drop.outerWidth();
		drop_obj.height = drop_obj.drop.outerHeight();
		
		drop_obj.yoffset = drop_obj.y + drop_obj.y_offset;
		drop_obj.xoffset = drop_obj.x + drop_obj.x_offset;
		
		// this.drop.oCustom = this.oCustom ;
		drop_obj.drop.data('dropObject', drop_obj);
		drop_obj.dragArray = [] ;
		
		drop_obj.userArray = [] ;
		drop_obj.correctArray = [] ;
		
		drop_obj.setCorrectDrags = function()
		{
			drop_obj.correctArray = []
			for( var i = 0; i < self.dragArray.length; i++ )
			{
				var found_match = false;
				var dragObj = self.dragArray[ i ];
				var match_ids = dragObj.match.split(",");
				for( var j= 0; j < match_ids.length; j++ )
				{
					if( drop_obj.id == match_ids[ j ] )
					{
						found_match = true;
					}
				}
				if(found_match)
				{
					drop_obj.correctArray.push( dragObj );
				}
			}
		}
	
		drop_obj.getCorrectAnswerCount = function()
		{
			var correct_count = 0;
			for( var i = 0; i < drop_obj.dragArray.length; i++ )
			{
				var found_match = false;
				var dragObj = drop_obj.dragArray[ i ];
				var match_ids = dragObj.match.split(",");
				for( var j= 0; j < match_ids.length; j++ )
				{
					if( drop_obj.id == match_ids[ j ] )
					{
						found_match = true;
					}
				}
				if(found_match)
				{
					correct_count++;
				}
			}
		
			return correct_count;
		}
		
		drop_obj.getIncorrectAnswerCount = function()
		{
			var incorrect_count = 0;
			for( var i = 0; i < drop_obj.dragArray.length; i++ )
			{
				var found_match = false;
				var dragObj = drop_obj.dragArray[ i ];
				var match_ids = dragObj.match.split(",");
				for( var j= 0; j < match_ids.length; j++ )
				{
					if( drop_obj.id == match_ids[ j ] )
					{
						found_match = true;
					}
				}
				if(!found_match)
				{
					incorrect_count++;
				}
			}
		
			return incorrect_count;
		}
			
		drop_obj.addDrag = function( dragObj )
		{
			drop_obj.dragArray.push( dragObj )
			drop_obj.tidy();
		}
			
		drop_obj.removeDrag = function( dragObj )
		{
			var new_array = [];
			for( var i = 0; i < drop_obj.dragArray.length; i++ )
			{
				var item = drop_obj.dragArray[ i ];
				if( dragObj != item )
				{
					new_array.push( item )
				}
			}
			
			drop_obj.dragArray = new_array;
			
			drop_obj.tidy();
		}
		
		drop_obj.tidy = function()
		{
			// this looks like it's a fix for getting position of sub-screenElements
			// however this will break the stack positioning in a zoomed browser
			drop_obj.x = drop_obj.drop.offset().left;
			drop_obj.y = drop_obj.drop.offset().top;
			
			var row_height = 0;
			
			if( drop_obj.dragArray.length>0 )
			{
				if( drop_obj.maxdrop > 1 )
				{
					for( var i = 0; i < drop_obj.dragArray.length; i++ )
					{
						var item = drop_obj.dragArray[ i ];
						
						item.tx = drop_obj.xoffset;
						item.ty = drop_obj.yoffset;
						
						if( i > 0 )
						{
							var prev_item = drop_obj.dragArray[ i-1 ];
							
							var drag_width = prev_item.origW * self.dropscale
							var drag_height = prev_item.origH * self.dropscale
							
							item.tx = prev_item.tx + drag_width + drop_obj.stackpaddingh;
							
							
							item.ty = prev_item.ty;
							
							if( drag_height > row_height )
							{
								row_height = drag_height;
							}
		
							// if ( devmode ) console.log( 'Log dragdrop DROPZONE WIDTH ' + drop_obj.width )
							// if ( devmode ) console.log( 'Log dragdrop itemx ' + ( item.tx - drop_obj.x )  )
							// if ( devmode ) console.log( 'Log dragdrop item width ' +  ( item.origW * self.dropscale )  )
							// if ( devmode ) console.log( 'Log dragdrop x offset ' + drop_obj.x_offset )
							
							//if( ( item.tx - drop_obj.x ) + ( item.origW * self.dropscale ) + drop_obj.x_offset > (drop_obj.width ) )
							if(  ( item.origW * self.dropscale ) + drop_obj.x_offset > (drop_obj.width - drop_obj.x_offset) )
							{
								item.tx = drop_obj.xoffset;
								
								
								item.ty = prev_item.ty + row_height + drop_obj.stackpaddingv;
								row_height = 0;
							}
						}
						
						tweenTo( item.drag, 0.2, { left:  item.tx, top: item.ty, rotation: 0, scale: self.dropscale, transformOrigin:"left top"} );
					}
					
					var item = drop_obj.dragArray[ drop_obj.dragArray.length-1 ];
				}
				else
				{

					var item = drop_obj.dragArray[ 0 ];
						
						
					
					var drag_width = item.origW * self.dropscale
					var drag_height = item.origH * self.dropscale
					
					item.tx = drop_obj.xoffset + (drop_obj.width - drag_width )/2
					item.ty = drop_obj.yoffset + (drop_obj.height - drag_height )/2
					
					tweenTo( item.drag, 0.2, { left:  item.tx, top: item.ty, rotation: 0, scale: self.dropscale, transformOrigin:"left top"} );

				}
			}
		}
		
	}
	
	
	/* ============================= D R A G  &  D R O P  C O U N T S  &  L O G I C ============================= */
	
	self.checkTotalDrops = function()
	{
		
		var totalActiveDrops = 0;
		
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			var dragObj = self.dragArray [ i ];
			if( dragObj.inTarget )
			{
				totalActiveDrops++
			}
		}
		/*
		for( var i = 0; i < self.dropArray.length; i++ )
		{
			var item = self.dropArray[ i ];
			item.tidy();
		}
		*/
		if( totalActiveDrops >= self.totalRequiredDrops )
		{
			self.totalRequiredDropsReached() ;
		}
		else
		{
			self.totalRequiredDropsNotReached() ;
		}
	}
	
	self.totalRequiredDropsReached = function()
	{
		
		if( !self.submitPressed )
		{
			
			enableContentButton( self.submitBtn );
		}
	}
	
	self.totalRequiredDropsNotReached = function()
	{
		// hide submit button
		disableContentButton( self.submitBtn );
	}
	
	self.checkAnswers = function()
	{
		// currently DOES NOT account for un-needed drag objects with match id of -1
	
		for( var i = 0; i < self.dropArray.length; i++ )
		{
			var dropObj = self.dropArray[ i ];
			dropObj.setCorrectDrags( );
			dropObj.userArray = dropObj.dragArray.slice(0);
		}
	
	
		var correctAnswers = 0 ;
		var incorrectAnswers = 0 ;
		
		for( var i = 0; i < self.dropArray.length; i++ )
		{
			var dropObj = self.dropArray[ i ];
			correctAnswers += dropObj.getCorrectAnswerCount();
			incorrectAnswers += dropObj.getIncorrectAnswerCount();
		}
		var is_passsed = false;
		var feedback_id = "fail"
		if( ( correctAnswers == self.totalRequiredDrops ) && ( incorrectAnswers == 0 ) )
		{
			feedback_id = "pass";
			is_passsed = true
		}
		else if( correctAnswers > 0 )
		{
			feedback_id = "partial"
			enableContentButton( self.scaBtn );
		}
		else
		{
			enableContentButton( self.scaBtn );
		}
		
		if( is_passsed )
		{
			self.screen.pass();
		}
		else
		{
			self.screen.fail();
		}
		
		self.screen_view.applyFeedback( feedback_id ) ;
		
		disableContentButton( self.submitBtn );
	
		if( self.resetBtn && ( !self.screen.getScored() ) )
		{
			enableContentButton( self.resetBtn );
		}
	}
	
	self.enableAllDrags = function()
	{
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			self.dragArray[ i ].draggable[ 0 ].enable();
		}
	}
	
	self.disableAllDrags = function()
	{
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			self.dragArray[ i ].draggable[ 0 ].disable();
			if( $('.lte8').length<1 )
			{
				self.dragArray[ i ].drag.css('z-index','');
				self.dragArray[ i ].drag.css("z-index", "");
			}
		}
	}
		
	self.displayCorrectAnswers = function()
	{
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			var dragObj = self.dragArray[ i ];
			dragObj.inTarget = false;
		}
		
		for( var i = 0; i < self.dropArray.length ; i++ )
		{
			var dropObj = self.dropArray[ i ];
			dropObj.setCorrectDrags( );
			dropObj.dragArray = dropObj.correctArray;
			for( var j = 0; j < dropObj.dragArray.length; j++ )
			{
				var item = dropObj.dragArray[ j ];
				item.inTarget = true;
			}
			dropObj.tidy();
		}
		
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			var dragObj = self.dragArray[ i ];
			if( dragObj.match == 0 )
			{
				dragObj.resetPosition( );
			}
		}
	}
	
	self.displayMyAnswers = function()
	{
	
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			var dragObj = self.dragArray[ i ];
			dragObj.inTarget = false;
		}
	
		for( var i = 0; i < self.dropArray.length ; i++ )
		{
			var dropObj = self.dropArray[ i ];
			dropObj.dragArray = dropObj.userArray;
			for( var j = 0; j < dropObj.dragArray.length; j++ )
			{
				var item = dropObj.dragArray[ j ];
				item.inTarget = true;
			}
			dropObj.tidy();
		}
		
		
		
		for( var i = 0; i < self.dragArray.length; i++ )
		{
			var dragObj = self.dragArray[ i ];
			if( !dragObj.inTarget )
			{
				dragObj.resetPosition( )
			}
		}
		
	}
		
		
	/* ============================= B U T T O N   L O G I C ============================= */
	
	self.showAnswers = function()
	{
		self.displayCorrectAnswers() ;
		disableContentButton( self.scaBtn );
		enableContentButton( self.smaBtn );
	}
	
	self.showMyAnswers = function()
	{
		self.displayMyAnswers() ;
		disableContentButton( self.smaBtn );
		enableContentButton( self.scaBtn );
	}
	
	self.reset = function()
	{
		self.resetScreen() ;
		disableContentButton( self.smaBtn );
		disableContentButton( self.scaBtn );
		disableContentButton( self.resetBtn );
	}
	
	
	
}





