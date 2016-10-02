/**
* @author Andy Galletly
*/

function SliderRevealElementView( m )
{		
	var self = this ;
	ScreenElementView.call( self, m );
	
	
	self.setContent = function()
	{
		self.resizeListen = true;
		self.oDiv.append( self.oContent );
		TweenMax.delayedCall( 0, self.attachContent );
	}
	
	self.attachContent = function(  )
	{
		var start_div_id = self.idprefix + self.oModel.id + '_start';
		self.start_div = $( '<div class="start" id="' + start_div_id + '">' );
		self.oContent.append( self.start_div );
		
		var end_div_id = self.idprefix + self.oModel.id + '_end';
		self.end_div = $( '<div class="end" id="' + end_div_id + '">' );
		self.oContent.append( self.end_div );
		
		for( var i = 0; i < self.xml_node.children().length; i++ )
		{
			var item = self.xml_node.children()[ i ];
			
			switch( item.nodeName )
			{
				case 'start': self.createContent( $( item ), self.start_div );
					break;
				case 'end': self.createContent( $( item ), self.end_div );
					break;
				case 'controller': self.controller_xml = $( item );
					self.createController(  );
					break;
			}
		}
	}
	
	self.super_screenSizeUpdate = self.screenSizeUpdate;
	self.screenSizeUpdate = function()
	{
		self.super_screenSizeUpdate();
		
		if( self.sliderguide )	self.sliderguide.empty().remove();
		if( self.toggle )	self.toggle.empty().remove();
		
		self.createController();
		
	}

	
	self.createContent = function( xml_node, $container )
	{
		var boxchildren = xml_node.children();
		for( var j = 0; j < boxchildren.length; j++ )
		{
			var node = $( boxchildren [ j ] )
			var div_id = $container.attr( 'id' )
			node.attr( 'target', div_id );
			if( !node.attr( 'id' ) )
			{
				node.attr( 'id', div_id + "_item" + j );
			}
		}

		self.screen_view.createScreenElements( xml_node );
		
	}
	
	self.createController = function(  )
	{
		var xml_node = self.controller_xml
		if( xml_node )
		{
			if( _respondo.desktop() )
			{
				self.sliderguide = $( '<div class="slider_guide"></div>' );
				self.slider = $( '<div class="slider"></div>' );
							
				self.sliderguide.width( Number( xml_node.attr( 'width' ) ) );
				self.sliderguide.css( 'left', Number( xml_node.attr( 'x' ) ) );
				self.sliderguide.css( 'top', Number( xml_node.attr( 'y' ) ) );
				
				self.sliderguide.append( self.slider ) 
				self.oContent.append( self.sliderguide );
				
				self.draggable = Draggable.create(self.slider, 
				{
					edgeResistance:1,
					type: "left",
					bounds: self.sliderguide,
					throwProps: true,
					onDrag: function(e) 
					{
						self.evaluateDragPosition( );
					} ,
					onThrowUpdate: function(e) 
					{
						self.evaluateDragPosition( );
					},
					onThrowComplete: function(e) 
					{
						self.evaluateDragPosition( );
					},
				});
				tweenTo( self.end_div, 0, { width: '' + 0 + '%' } );
				tweenTo( self.end_div, 0, { display: 'block', autoAlpha: 1 } );
				tweenTo( self.start_div, 0, { display: 'block', autoAlpha: 1 } );
				self.evaluateDragPosition();
			}
			else
			{
				tweenTo( self.end_div, 0, { width: '' + 100 + '%' } );
				self.currentview = self.start_div;
				tweenTo( self.end_div, 0, { display: 'none', autoAlpha: 0 } );
				/*
				self.toggle = $( '<div class="toggle"><p>Toggle</p></div>' );
				self.oContent.prepend( self.toggle );
				
				applyClick( self.toggle,
					self.toggleView
				);
				*/
			}
		}
	}
	
	self.evaluateDragPosition = function()
	{
		var max = self.sliderguide.width() - self.slider.outerWidth();
		
		var percent = ( self.slider.position().left / max ) * 100;
		
		tweenTo( self.end_div, 0.2, { width: '' + percent + '%' } );
		
	}
	
	self.toggleView = function()
	{
		if( self.start_div == self.currentview )
		{
			self.currentview = self.end_div;
			tweenTo( self.start_div, 0, { display: 'none', autoAlpha: 0 } );
			tweenTo( self.end_div, 0, { display: 'block', autoAlpha: 1 } );
		}
		else
		{
			self.currentview = self.start_div;
			tweenTo( self.end_div, 0, { display: 'none', autoAlpha: 0 } );
			tweenTo( self.start_div, 0, { display: 'block', autoAlpha: 1 } );
		}
	}
	
}
SliderRevealElementView.prototype = ScreenElementView;
