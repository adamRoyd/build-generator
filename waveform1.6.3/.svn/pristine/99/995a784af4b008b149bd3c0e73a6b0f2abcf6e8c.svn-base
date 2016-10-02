
// console.log("screentype mcq.js");
		
function mcq_graphical(s)
{
	var self = this;
	self.screen 				= s;
	self.screen_view			= self.screen.view;
	self.oXML 					= null;

	// elements
	self.oDiv;
	self.submitBtn;
	self.resetBtn;
	
	// object arrays
	self.optionArray 		= [];
	self.feedbackArray 		= [];
	self.arFeedbackElements = [];
	
	// settings
	self.radiomode 			= true;
	self.showticks 			= true;
	
	self.oSelectedOption = null;
	
	
	
	self.custom = function( model )
	{
		self.oModel = model;
		self.oXML 	= $( self.oModel.oXML );
		self.oDiv 		= self.oModel.view.oDiv;
		
		
		for ( var i = 0; i < self.oXML.children().length; i++)
		{
			var xml_node = self.oXML.children() [ i ] ;
			// console.log( i + " - " + xml_node.nodeName );
			
			switch ( xml_node.nodeName )
			{
				case "settings": 	self.createSettings( $( xml_node ) ) ;
					break;
					
				case "option":		self.optionArray.push( new self.Option( $( xml_node ), self.optionArray.length + 1 ) );
					break;
					
				case "fb": 			self.screen_view.createFeedback( $( xml_node ) );
					break;
			}
		}
		
	}


	self.initOptions = function()
	{
	

		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			
			oOpt.oCustom = self.oCustom;
			oOpt.option.data("id", oOpt.id ) ;
			
			applyClick(
				oOpt.option,
				
				function () {
					var elm = $( this ).data( 'elm' );
					self.selectOption( elm.data("id") );
				}
			);
			
		}
	}
	
	//	<settings radiomode="false" />
	self.createSettings = function( oXML )
	{
		self.radiomode 		= Boolean( oXML.attr( "radiomode" ) == 'true' );
	}
	
	//	<option correct="false">element_id</option>
	self.Option = function( oXML, id )
	{
		var option_object = this;
		option_object.bCorrect 		= Boolean( oXML.attr( "correct" ) == "true" );
		option_object.id 					= id;
		option_object.elementid 		= oXML.text();

		option_object.option 			= self.screen.view.getScreenElementById( option_object.elementid ).view.oDiv;
		
		option_object.option.addClass( 'option' );
		option_object.option.addClass( 'option' + id );

		option_object.unselected_class = option_object.option.attr('class');
	}
	
	// <fb id="1" event="submit">
		// <text />
		// <image />
	// </fb>
	self.Feedback = function( oXML )
	{
		var feedback_object = this;
		feedback_object.id = oXML.attr( "id" );
		feedback_object.oXML = oXML;
	}
	
	self.selectOption = function(id)
	{
		var opt = self.getOptionById( id );

		if( self.radiomode )
		{
			if(self.oSelectedOption)
			{
				self.showUnselectedState( self.oSelectedOption ) ;
			}
			
			if(opt)
			{
				self.oSelectedOption = opt;
				
				self.showSelectedState( opt ) ;	
			}
		}
		else
		{
			if( opt.selected )
			{
				self.showUnselectedState( opt ) ;
				
			}
			else
			{
				self.showSelectedState( opt ) ;
			}
		}
		
		self.checkEnableSubmit();

	}
	
	self.checkEnableSubmit = function()
	{
		var do_enable = false;
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			
			if( oOpt.selected )
			{
				do_enable = true;
			}
		}
		
		if(do_enable)
		{
			self.enableSubmit();
		}
		else
		{
			self.disableSubmit();
		}
		
	}
	
	self.showSelectedState = function( opt )
	{
		opt.selected = true;
		tweenTo(opt.option, 0, {className: '+=selected'} );
	}
	
	self.showUnselectedState = function( opt )
	{
		opt.selected = false;
		tweenTo(opt.option, 0, {className: '-=selected'} );
	}
	
	self.disableSubmit = function()
	{
		disableContentButton( self.submitBtn );
	}
	
	self.enableSubmit = function()
	{
		enableContentButton( self.submitBtn );
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
			
			enableElement( oOpt.option );
		}
	}
	
	self.submit = function()
	{
	
		self.screen.setAnswered( true ); 
		self.disableOptions();
		
		var correct_count = 0;
		var correct_choices = 0;
		var incorrect_choices = 0;
		//new var to store the selected options index
		var selected_option_index;
		
		
		var is_passsed = false;
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
		
			if( oOpt.bCorrect )
			{
				if( !self.screen.getScored() && self.showticks)
				{
					oOpt.tick = $('<div class="tick"></div>')
					oOpt.option.append( oOpt.tick )
				}
			
				correct_count++
				if( oOpt.selected )
				{
					correct_choices++;
					//record index
					selected_option_index = i;
				}
			}
			else
			{
				if( oOpt.selected )
				{
					incorrect_choices++;
					//record index
					selected_option_index = i;
				}
			}
		}
		
		if( ( correct_count == correct_choices ) && ( incorrect_choices == 0 ) )
		{
			is_passsed = true;
		}
		
		var feedback_id = "fail";
		//check for pass node and switch on its existence
		//else check for at least 1 numeric node
		//if both fail raise alert

		if( ( correct_choices > 0 ) && ( ( correct_choices < correct_count ) || ( incorrect_choices > 0 ) ) )
		{
			feedback_id = "partial";
			self.screen.partial( )
		}
		else if ( is_passsed )
		{
			feedback_id = "pass";
			self.screen.pass( )

		}
		else
		{
			feedback_id = "fail";
			self.screen.fail( )
		}
	

		selected_id = selected_option_index+1;


	
		disableContentButton( self.submitBtn );
	
		if( self.resetBtn && ( !self.screen.getScored() ) )
		{
			enableContentButton( self.resetBtn );
		}
		
		if( is_passsed )
		{
			self.screen.pass( )
		}
		else
		{
			self.screen.fail( )
		}
		
	
		if( self.screen_view.checkFeedback( selected_id ) )
		{
			feedback_id = selected_id;
		}
		
		self.screen_view.applyFeedback( feedback_id ) ;
	}
	
	self.reset = function()
	{
		self.screen_view.removeFeedback();
		
		for( var i = 0; i < self.optionArray.length; i++ )
		{
			var oOpt = self.optionArray[ i ];
			
			if( oOpt.tick )
			{
				oOpt.tick.remove();
				oOpt.tick = null;
			}
			if( oOpt.selected )
			{
				oOpt.selected = false;
				oOpt.option.removeClass("selected");
			}
		}
		
		self.enableOptions();
		
		disableContentButton( self.resetBtn );
		
	}
	

	self.screenElementsReady = function()
	{
	
		self.submitBtn = self.screen.view.getScreenElementById( 'submitBtn' );
		self.resetBtn = self.screen.view.getScreenElementById( 'resetBtn' );
		self.initOptions()
		self.enableOptions();
		// console.log("screentype mcq.js screenElementsReady()");
	}

	self.getOptionById = function( id )
	{
		var rtn = getItemById( id, self.optionArray );
			
		return rtn;
	}

	self.getFeedbackById = function( id )
	{
		var rtn = getItemById( id, self.feedbackArray );
			
		return rtn;
	}
	
	
}
