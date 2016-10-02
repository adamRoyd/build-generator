/**
* @author Andy Galletly
*/

function Sprite( view, xml )
{
	var self = this;
	
	self.sprite_div = $('<div class="sprite"></div>');
	self.currentTime = -1;
	self.screen = view.screen;
	self.screen_view = self.screen.view;
	self.time = Number( xml.attr("time") );
	self.columns = Number( xml.attr("columns") );
	self.rows = Number( xml.attr("rows") );
	self.sheetwidth = Number( xml.attr("sheetwidth") );
	self.sheetheight = Number( xml.attr("sheetheight") );
	self.sheeturl = null;
	if( xml.attr("sheeturl") )
	{
		self.sheeturl = String( xml.attr("sheeturl") );
	}
	self.name = String( xml.attr("spritename") );
	self.width = Number( xml.attr("width") );
	self.height = Number( xml.attr("height") );
	self.cuepoints = [ 0 ];
	self.timeline = null;
	view.oContent = self.sprite_div;
	
	self.posx = 0 ;
	if( xml.attr("posx"))
	{
		self.posx = Number( xml.attr("posx")) ;
	}
	
	self.posy = 0 ;
	if( xml.attr("posy"))
	{
		self.posy = Number( xml.attr("posy")) ;
	}
	
		
	self.init = function()
	{
		view.oDiv.append( self.sprite_div );
		if( self.time )
		{
			self.initAnim();
		}
		else
		{
			if(self.sheeturl)
			{
				//self.sprite_div.css('background-image', 'url("' + self.sheeturl + '")' );
				view.oDiv.css('background-image', 'url("' + self.sheeturl + '")' );
			}
			else
			{
				//self.sprite_div.addClass( self.name );
				view.oDiv.addClass( self.name );
			}
		}
	}
	
	self.initAnim = function()
	{
		self.autoplay = false ;
	
		if ( xml.attr("autoplay") ) 
		{ 
			if ( xml.attr("autoplay").toLowerCase() == "true" ) 
			{ 
				self.autoplay = true ;
			} 
		}
	
		
		if( xml.children().length>0 )
		{
			self.createCues( xml.children() );
		}
		
		spriteAnim(self.sprite_div, self.time, {
			url: 					self.sheeturl, 
			framewidth:		self.width,
			frameheight: 	self.height,
			colunmns:		self.colunmns, 
			rows:				self.rows, 
			width:				self.sheetwidth, 
			height:				self.sheetheight
		});
		
		self.timeline = self.sprite_div.data('sprite_anim');
		
		/*
		self.timeline.eventCallback("onStart", function(){
			var cue = self.findCue( 'start' );
			if( cue )
			{
				if( cue != self.current_cue )
				{
					self.doCue( cue );
				}
			}
		});
		self.timeline.eventCallback("onComplete", function(){
			var cue = self.findCue( 'end' );
			if( cue )
			{
				if( cue != self.current_cue )
				{
					self.doCue( cue );
				}
			}
		});
		self.timeline.eventCallback("onUpdate", function(){
				self.timeUpdate(  );
		});
		self.timeUpdate( )
		
		*/
		if ( self.autoplay )
		{
			self.play();
		}
	}
	
	self.kill = function()
	{
		if( self.timeline )
		{
			self.timeline.kill();
		}
		self.cuepoints = [];
	}
	
	self.play = function()
	{
		self.timeline.play();
	}
	
	self.pause = function()
	{
		self.timeline.pause();
	}
	
	self.stop = function()
	{
		self.timeline.pause();
	}
	
	self.reset = function()
	{
		self.current_cue = null;
		self.timeline.pause(0);
		self.timeUpdate();
	}
		
	self.createCues = function( cue_nodes )
	{
		for( var i = 0; i < cue_nodes.length; i++ )
		{
			var node = $( cue_nodes[ i ] );
			var cue = { id: node.attr('id'), start_time: node.attr( 'starttime' ), end_time: node.attr( 'endtime' ), event: node.attr( 'event' ) , text: node.text()  };
			
			self.cuepoints.push( cue )
		}
	}
	
	self.timeUpdate = function( )
	{
		var new_time = Math.round( self.time * self.timeline.progress() );
		if(!new_time)
		{
			new_time = 0;
		}
		
		if( new_time != self.currentTime )
		{
			self.currentTime = new_time;
			
			
			if( self.current_cue )
			{
				if( self.current_cue.end_time < new_time )
				{
					self.endCue( self.current_cue )
				}
			}
			
			
			var cue = self.findCue( self.currentTime );
			if( cue )
			{
				if( cue != self.current_cue )
				{
					self.doCue( cue );
				}
			}
		}
	}
	
	self.doCue = function( cue )
	{
		self.current_cue = cue;
			
		if( cue.event )
		{
			self.screen_view.doEventById( cue.event );
		}
	}
	
	self.endCue = function( )
	{
	
		if( self.current_cue.endevent )
		{
			self.screen_view.doEventById( self.current_cue.endevent );
		}
		self.current_cue = null;
	}
	
	self.findCue = function( timecode )
	{
		var cue = null;
		for( var i = 0; i < self.cuepoints.length; i++)
		{
			var cuepoint = self.cuepoints[ i ];
			if( cuepoint.id == timecode )
			{
				cue = cuepoint;
				break;
			}
			if( !cuepoint.end_time && cuepoint.start_time )
			{
				cuepoint.end_time = cuepoint.start_time + 0.1;
			}
			if( ( timecode >= cuepoint.start_time ) && ( timecode <= cuepoint.end_time ) )
			{
				cue = cuepoint;
				break;
			}
		}
		
		return cue;
	}
	
	self.init();
	
}
