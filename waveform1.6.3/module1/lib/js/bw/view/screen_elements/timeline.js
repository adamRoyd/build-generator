/**
* @author Andy Galletly
*/
/*
	<timeline control="scroll" time="60">
		<tween element="text_1" time="0.5"><![CDATA[ x: 20, y: 50 ]]></tween>
	</timeline>
*/
function TimelineView( m )
{
	var self = this;
	TimedElementView.call(self, m);
	
	self.screen.dispatcher.bind( 'kill', self.kill );
	
	self.timer_div = $('<div class="timer"></div>');
	self.timer_tween = null;

	self.time = Number( self.xml_node.attr("time") );
	
	self.control = self.xml_node.attr("control");
	
	self.base_setContent = self.setContent;
	self.setContent = function()
	{
		self.oContent = self.timer_div;
		self.base_setContent();

		self.screen.dispatcher.on( 'ready', function(){ TweenMax.delayedCall( 0,self.applyTimeline ) } ) ;
	}
	
	self.applyTimeline = function()
	{
		if ( devmode ) console.log( 'Log applyTimeline' )
		self.timer_tween = new TimelineMax();
		
		self.timer_tween.add( TweenMax.to(self.oContent, self.time, {}) );
		
		for( var i = 0; i < self.xml_node.children().length; i++ )
		{
			var item =  $(self.xml_node.children()[ i ] );
			
			
			if( item[0].nodeName == "tween" )
			{
				var element_id = item.attr( 'element' );
				
				if ( devmode ) console.log( 'Log '+i+' TWEEN ELEMENT ' + element_id )
				var element_div = self.screen_view.getScreenElementById( element_id ).getDiv() ;
				var tween_settings_object = self.createTweenObject( item.text() ); 
				
				var tween_time =  Number( item.attr( 'time' ) )
			
				var timeoffset = 0;
				if( item.attr( 'timeoffset' ) )
				{
					timeoffset =  item.attr( 'timeoffset' );
				}
				
				if( item.attr( 'event' ) )
				{
					element_div.data( 'complete_event', item.attr( 'event' ) )
					tween_settings_object.onComplete = function()
					{
						self.screen_view.doClickById( $( this.target ).data( 'complete_event' ) ) ;
					}
				}
				
				var tween = new TweenMax( element_div, tween_time, tween_settings_object );
				self.timer_tween.add( tween, timeoffset );
				
			}
			self.timer_tween.smoothChildTiming = true;
		}
		
		if ( self.autoplay )
		{
			self.play();
		}
		else
		{
			self.pause();
		}
		
		if( self.control=='scroll' )
		{
			self.addScrollListener();
		}
	}
	
	self.addScrollListener = function()
	{
		
		$(window).bind('scroll',self.updateTimelineByScrollPosition)
		
	}
	
	self.updateTimelineByScrollPosition = function()
	{
		var current = $(window).scrollTop();
		var max = $(document).height() - $(window).height();
		var pos = current / max;
		
		var seek_time = self.time * pos
		
		tweenTo(self.timer_tween, 0.2, {time:seek_time, ease:Linear.easeNone});
		
	}
	
	self.createTweenObject = function( string )
	{
		var obj = {};

		var string_array = string.split(",");
		for( var i = 0; i < string_array.length; i++ )
		{
			var item_split = string_array[ i ].split(":");
			
			obj[ item_split[0].replace(/\s+/g, '') ]  =  item_split[1].replace(/\s+/g, '');
		}

		return obj;
	}
	
	self.base_kill = self.kill;
	self.kill = function()
	{
		self.screen.dispatcher.unbind('ready');
		$(window).unbind('scroll', self.updateTimelineByScrollPosition);
		self.timer_tween.kill();
		self.base_kill()
	}
	
	self.play = function()
	{
		self.timer_tween.play();
	}
	
	self.pause = function()
	{
		self.timer_tween.pause();
	}
	
	self.stop = function()
	{
		self.timer_tween.pause();
	}
	
	self.reset = function()
	{
		self.current_cue = null;
		self.timer_tween.pause(0);
		self.timeUpdate();
	}
	
	self.timeUpdate = function( )
	{
	}
	
	
}
TimelineView.prototype = TimedElementView;
