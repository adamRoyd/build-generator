
// console.log("screentype sliding_scale.js");
		
function sliding_scale(s)
{
	var self = this;
	self.screen 			= s;
	self.screen_view		= self.screen.view;
	self.oXML 				= null;

	// elements
	self.oDiv;
	self.sliderguide;
	self.slider;
	self.track;
	self.submitBtn;
	self.resetBtn;
	
	// object arrays
	self.optionArray 		= [];
	
	// settings
	self.width 				= 400;
	self.optionwidth 		= 100;
	self.linewidth 			= 1;
	self.linecolour 			= "#000000";
	self.resetpos 			= 170;
	self.draggable; 
	self.oSelectedOption = null;
	
	// console.log("screentype sliding_scale() obj");
	self.custom = function( model )
	{
		self.oModel	= model;
		self.oXML 	= self.oModel.oXML;
		self.oDiv 		= self.oModel.view.oDiv;
		
		// console.log( "CUSTOM " + this.oXML );
		
		for ( var i = 0; i < $(this.oXML).children().length; i++)
		{
			var xml_node = $(this.oXML).children() [ i ] ;
			// console.log( i + " - " + xml_node.nodeName );
			
			switch ( xml_node.nodeName )
			{
				case "settings": 	this.createSettings( $( xml_node ) ) ;
					break;
					
				case "option":			this.optionArray.push( new this.option( $( xml_node ), this.optionArray.length + 1, this ) );
					break;
					
				case "fb": 			self.screen_view.createFeedback( $( xml_node ) );
					break;
			}
		}
		
		this.createSlider();
		
		
	}
	
	this.createSlider = function()
	{
		this.track = $( '<div class="slider_track"></div>' );
		this.track.width( this.width + this.linewidth );
		this.track.height( this.linewidth );
		this.track.css( 'background-color', this.linecolour );
		
		this.sliderguide = $( '<div class="slider_guide"></div>' );
		this.slider = $( '<div class="slider"></div>' );
		
		this.oDiv.append( this.track );
		
		var opt_spacing = this.width / ( this.optionArray.length - 1 );
		
		this.oDiv.append( this.sliderguide );
		
		for( var i = 0; i < this.optionArray.length; i++ )
		{
			var oOpt = this.optionArray[ i ];
			oOpt.pos = opt_spacing * i;
			oOpt.option_line.css( 'left', oOpt.pos );
			
			oOpt.option.css( 'left', oOpt.pos - ( this.optionwidth / 2 ) );
			oOpt.option.css( 'top', this.optiony );
			
			this.oDiv.append( oOpt.option_line );
			
			this.oDiv.append( oOpt.option );
			
		}
		
		
		this.sliderguide.append( this.slider );
	}
	
	this.enableSlider = function ()
	{
		for( var i = 0; i < this.optionArray.length; i++ )
		{
			var oOpt = this.optionArray[ i ];
			
			applyClick(
				oOpt.option,
				
				function () {
					var elm = $( this ).data( 'elm' );
					elm.oObj.oCustom.selectOption( elm.oObj.id );
				}
			);
		}
		
		this.sliderguide.width( this.width + this.slider.width() );
		this.sliderguide.css( 'left', 0 - this.slider.width() / 2 );
		//this.sliderguide.css( 'top', 0 - this.slider.height() / 2 );
		
		this.slider.data('oCustom', this );
		
		
		if( isNaN( this.resetpos ) )
		{
			this.resetpos = 0
		}
		
		this.slider.css( 'left', this.resetpos - ( this.slider.width() / 2 ) )
		
		self.draggable = Draggable.create(this.slider, 
		{
			edgeResistance:1,
			type:"left",
			bounds : self.sliderguide,//{minX: self.sliderguide.position().left, maxX:self.sliderguide.position().left + self.sliderguide.width()},
			throwProps:true,
			onDragEnd : function(e) 
			{
				self.evaluateDragPosition( );
			} 
		})
		
	}
	
	this.evaluateDragPosition = function()
	{
		
		var cur_pos = Number( this.slider.css( 'left' ).split( 'px' ) [ 0 ] ) - ( this.slider.width()/ 2 );
		
		// console.log('EVQALUATE DRAG POSITION ' + this.slider.css( 'left' ) +" : "+ cur_pos);
		
		
		var closest_opt = this.optionArray[0];
		
		for( var i = 0; i < this.optionArray.length; i++ )
		{
			var oOpt = this.optionArray[ i ];
			
			var optdist = Math.abs( cur_pos - oOpt.pos ) 
			var closestdist = Math.abs( cur_pos - closest_opt.pos ) 
			
				// console.log ( "compare OPTION ID " + oOpt.id + " - " + optdist)
				// console.log ( "compare OPTION ID " + closest_opt.id + " - " + closestdist)
			
			if ( optdist < closestdist )
			{
				closest_opt = oOpt;
				// console.log ( "CLOSEST OPTION ID " + closest_opt.id )
			}
		}
		
		this.selectOption( closest_opt.id )
	}
	
	
	//	<slidesettings width="450" optionwidth="140" linewidth="2" linecolour="0xD7D9DB" reset="170" /><!--  reset="option_1" -->
	this.createSettings = function( oXML )
	{
		this.width 				= Number( oXML.attr( "width" ) );
		this.optionwidth  		= Number( oXML.attr( "optionwidth" ) );
		this.optiony  			= Number( oXML.attr( "optiony" ) );
		if( isNaN(this.optiony ))
		{
			this.optiony = -20 ;
		}		
		this.linewidth 			= Number( oXML.attr( "linewidth" ) );
		this.linecolour 		= "#"+oXML.attr( "linecolour" ).split( "x" ) [ 1 ];
		this.resetpos 			= oXML.attr( "reset" );
		
	}
	
	//	<option correct="false"><![CDATA[<p class="option" align="center">Agree</p>]]></option>
	this.option = function( oXML, id, oCustom )
	{
		this.oCustom 		= oCustom;
		this.pos 			= 0;
		this.bCorrect 		= Boolean( oXML.attr( "correct" ) == "true" );
		this.id 			= id;
		this.option 		= $( '<div id="' + oCustom.screen.id + '_scale_option_' + id + '" class="option">' + oXML.text() + '</div>' );
		this.option.width( oCustom.optionwidth );
		
		this.option.height( 30 );
		
		this.option_line 	= $( '<div class="option_line"></div>' );
		this.option_line.width( oCustom.linewidth );
		this.option_line.css( 'background-color', oCustom.linecolour );
		
		this.option.oObj = this;
		
	}
	
	this.selectOption = function(id)
	{
		var opt = this.getOptionById( id );
		if(opt)
		{
			oSelectedOption = opt;
			var targ = opt.pos;// - ( this.slider.width() / 2 );
			tweenTo(this.slider, 0.5, { left: targ } );
			this.enableSubmit();
		}
	}
	
	this.enableSubmit = function()
	{
		enableContentButton( self.submitBtn );
	}
	
	this.disableDrag = function()
	{
		self.draggable[0].disable();
		
		for( var i = 0; i < this.optionArray.length; i++ )
		{
			var oOpt = this.optionArray[ i ];
			
			disableElement( oOpt.option );
		}
	}
	
	this.enableDrag = function()
	{
		self.draggable[0].enable();
		
		for( var i = 0; i < this.optionArray.length; i++ )
		{
			var oOpt = this.optionArray[ i ];
			
			enableElement( oOpt.option );
		}
	}
	
	this.submit = function()
	{
		self.screen.setAnswered( true ); 
	
		this.disableDrag()
		
		// console.log( "option " + oSelectedOption.id + " correct: " + oSelectedOption.bCorrect );
		var is_passsed = false;
		
		var feedback_id = "fail";
		
		if( oSelectedOption.bCorrect )
		{
			is_passsed = true
			feedback_id = "pass";
		}
	
		if( self.screen_view.checkFeedback( oSelectedOption.id  ) )
		{
			feedback_id = oSelectedOption.id;
		}
	
		if( is_passsed )
		{
			self.screen.pass(  )
		}
		else
		{
			self.screen.fail(  )
		}
		
		self.screen_view.applyFeedback( feedback_id ) ;
	
		disableContentButton( self.submitBtn );
		
		if( self.resetBtn && ( !self.screen.getScored() ) )
		{
			enableContentButton( self.resetBtn );
		}
		
		
	}
	
	this.reset = function()
	{
		self.screen_view.removeFeedback();
		
		if( this.resetpos.indexOf("option_") > -1 )
		{
			var resetOpt = getOptionById( this.resetpos.split("option_")[1] );
			this.resetpos = resetOpt.pos
		}
		
		tweenTo( this.slider, 0.3, {left: this.resetpos - ( this.slider.width() / 2 ) } );
		
		disableContentButton( self.resetBtn );
		
		this.enableDrag()
	}
	

	this.screenElementsReady = function()
	{
		self.submitBtn  = self.screen.view.getScreenElementById( 'submitBtn' );
		self.resetBtn  = self.screen.view.getScreenElementById( 'resetBtn' );
		this.enableSlider();
		// console.log("screentype sliding_scale.js screenElementsReady()");
	}

	this.getOptionById = function( id )
	{
		var rtn = getItemById( id, this.optionArray );
			
		return rtn;
	}
	
	
	
}
