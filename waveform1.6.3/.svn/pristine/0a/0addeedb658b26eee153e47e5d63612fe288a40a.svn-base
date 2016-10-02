
// if ( devmode ) console.log("screentype mcq.js");
		
function mcq(s)
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
	
	// settings
	self.optionwidth 		= 100;
	self.optionoffset 		= 100;
	self.radiomode 			= true;
	self.randomise 			= false;
	self.maxoptions 		= null;
	self.selectedoptions 	= 0;
	self.eventonanswer ;
	
	
	self.requiredchoices = 1;
	self.defaultPointsValue = 1 ;
	self.oSelectedOption = null ;
	
	self.attempted = false;
	self.passed = false;
	
	// if ( devmode ) console.log("screentype mcq() obj");
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
					
				case "option":		self.optionArray.push( new self.option( $( xml_node ), self.optionArray.length + 1 ) );
					break;
					
				case "fb": 			self.screen_view.createFeedback( $( xml_node ) );
					break;
			}
		}
		
		self.appendOptions() ;		
	}


	self.appendOptions = function()
	{
	
		var options_array = self.optionArray
		if( self.randomise )
		{
			var options_array = shuffleArray ( self.optionArray );
		}
		
		for( var i = 0; i < options_array.length; i++ )
		{
			var oOpt = options_array[ i ];
			
			self.oDiv.append( oOpt.option );
			
		}
	}

	self.initOptions = function()
	{
	

		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			
			// if ( devmode ) console.log( " > apply click to option " + oOpt.id );
			
			applyClick(
				oOpt.option,
				function () {
					var elm = $( this ).data( 'elm' );
					self.selectOption( elm.oObj.id );						
				}
			);
		}
	}
	
	self.rolloverOption = function( opt )
	{
		//opt.radio.addClass("mcq_radio_over");
	}
	
	self.rolloutOption = function( opt )
	{
		//opt.radio.removeClass("mcq_radio_over");
	}
	
	//	<settings optwidth="180" optionoffset="10" radiomode="true" randomise="false" />
	self.createSettings = function( oXML )
	{
		self.radiomode 		= Boolean( oXML.attr( "radiomode" ) == 'true' );
		self.randomise 		= Boolean( oXML.attr( "randomise" ) == 'true' );
		self.maxoptions = Number(  oXML.attr( "maxoptions" ) );
		self.requiredchoices = Number(  oXML.attr( "requiredchoices" ) );
		self.eventonanswer = oXML.attr( "eventonanswer" );
		self.autosubmit = Boolean( oXML.attr( "autosubmit" ) == 'true' );
		
		self.unlockOnIncorrect = true ;
	
		
		if( oXML.attr( "unlockOnIncorrect" ) )
		{
	
			self.unlockOnIncorrect = oXML.attr( "unlockOnIncorrect" ) === 'true' ;			
		}
		
	
		
	}
	
	//	<option correct="false"><![CDATA[<p class="option" align="center">Agree</p>]]></option>
	self.option = function( oXML, id )
	{
		var opt_obj = this;
		opt_obj.oCustom 		= self;
		opt_obj.bCorrect 		= Boolean( oXML.attr( "correct" ) == "true" );
		
		opt_obj.iPoints 		= Number( oXML.attr( "points" ) );
		
		if( isNaN( opt_obj.iPoints ))
		{
			opt_obj.iPoints = self.defaultPointsValue ;
		}
		
		opt_obj.id 			= id;
		opt_obj.option 	= $( '<div id="' + self.screen.id + '_mcq_option_' + id + '" class="option"></div>' );
		opt_obj.radio = $('<div class="radio"></div>');
		opt_obj.option.append( opt_obj.radio );
		
		var text = $(oXML.text());
		if( masterObj.bCheatMode && opt_obj.bCorrect )
		{
			text.prepend( "* " );
		}
		
		opt_obj.option.append( text );
		
		opt_obj.option.oObj = opt_obj;
		
	}
	
	
	self.selectOption = function(id)
	{
		var opt = self.getOptionById( id );
		
		if( self.radiomode )
		{
			if(opt)
			{
				if(self.oSelectedOption)
				{
					self.setDeselected( self.oSelectedOption ) ;
				}
			
				self.oSelectedOption = opt;
				self.setSelected( opt ) ;
				
			}
		}
		else
		{
			if( opt.selected )
			{
				self.setDeselected( opt ) ;
			}
			else
			{
				if( self.maxoptions )
				{
					if( self.selectedoptions < self.maxoptions )
					{
						self.setSelected( opt ) ;
					}
				}
				else
				{
					self.setSelected( opt ) ;
				}
			}
			self.updateOptionCount(); 
		}
		
		self.checkEnableSubmit();

	}
	
	self.blurEvent = function()
	{
		//alert("OASIS"); 
		self.updateOptionDisplay(); 
	}
	
	
	self.setSelected = function( opt )
	{
		opt.selected = true;
		opt.option.addClass("selected");
		tweenTo(opt.option, 0, {className:'+=selected'});
	}
	
	self.setDeselected = function( opt )
	{
		opt.selected = false;
		tweenTo(opt.option, 0, {className:'-=selected'});
	}
	
	
	self.updateOptionCount = function()
	{
		self.selectedoptions = 0;
		for( var i = 0 ; i< self.optionArray.length; i++)
		{
			var opt = self.optionArray[ i ]
			if( opt.selected )
			{
				self.selectedoptions++
			}
			
		}

	}
	
	self.checkEnableSubmit = function()
	{
		var do_enable = false;
		var optionschosen = 0;
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			
			if( oOpt.selected )
			{
				optionschosen++;
				do_enable = true;
			}
		}
		
		if(optionschosen < self.requiredchoices)
		{
			do_enable = false;
		}
		
		if(do_enable)
		{
			if( self.eventonanswer )
			{
				self.screen_view.doEventById( self.eventonanswer );
			}
			else
			{
				self.enableSubmit();
			}
		}
		else
		{
			self.disableSubmit();
		}
		
	}
	
	self.disableSubmit = function()
	{
		disableContentButton( self.submitBtn );
	}
	
	self.enableSubmit = function()
	{
		var submit_btn = self.submitBtn;
		
		self.attempted = true;
		
		self.screen.dispatcher.trigger( 'attempted' ) ;
		
		if( submit_btn )
		{
			enableContentButton( submit_btn );
		}
		else if ( self.autosubmit )
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
			
			disableElement( oOpt.option );
		}
	}
	
	self.enableOptions = function()
	{
		
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			// if ( devmode ) console.log( " > enable option " + oOpt.id );
			
			enableElement( oOpt.option );
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
				
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
		
			if( oOpt.bCorrect )
			{
				//only show ticks if not assessed
				if( !self.screen.getScored() )
				{
					oOpt.tick = $('<div class="tick"></div>')
					oOpt.option.addClass( 'correct' );
					oOpt.radio.append( oOpt.tick )
				}
			
				correct_count++
				if( oOpt.selected )
				{
					correct_choices++
					selected_id = oOpt.id;
				}
			}
			else
			{
				if( oOpt.selected )
				{
					incorrect_choices++;
					selected_id = oOpt.id;
				}
				//only show ticks if not assessed
				if( !self.screen.getScored() )
				{
					oOpt.tick = $('<div class="cross"></div>')
					oOpt.radio.append( oOpt.tick )
				}
			}
		}
		
		var feedback_id = "fail";
		
		self.passed = false;
		if( ( correct_count == correct_choices ) && ( incorrect_choices == 0 ) )
		{
			self.passed = true;
			feedback_id = "pass";
			self.screen.pass();
		}
		else if( ( correct_choices > 0 ) && ( ( correct_choices < correct_count ) || ( incorrect_choices > 0 ) ) )
		{
			
			feedback_id = "partial";
			self.screen.partial();
		}
		else
		{
			feedback_id = "fail";
			self.screen.fail();
		}
	
		if( self.screen_view.checkFeedback( selected_id ) )
		{
			feedback_id = selected_id
		}
		
		
		
		self.screen_view.applyFeedback( feedback_id ) ;
	
		disableContentButton( self.submitBtn );
	
		if( self.resetBtn && ( !self.screen.getScored() ) )
		{
		
			self.enableReset() ;
			
			self.disableSubmit();
		}
				
		if( self.passed )
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
		
		self.enableOptions();
		
		self.disableReset() ;
		self.screen_view.doClickById('reset');
	}
	

	self.screenElementsReady = function()
	{
		self.submitBtn = self.screen.view.getScreenElementById( 'submitBtn' );
		self.resetBtn = self.screen.view.getScreenElementById( 'resetBtn' );
		self.initOptions()
		self.enableOptions();
		// if ( devmode ) console.log("screentype mcq.js screenElementsReady()");
	}

	self.getOptionById = function( id )
	{
		var rtn = getItemById( id, self.optionArray );
			
		return rtn;
	}

	
	
}
