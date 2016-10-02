/**
* @author Andy Galletly
*/

var global_audio_html_block = $( ' \
		<div class="jp-jplayer"></div>\
		<div class="jp-flat-audio">\
			<div class="jp-play-control jp-control">\
				<a class="jp-play jp-button"></a>\
				<a class="jp-pause jp-button"></a>\
			</div>\
			<div class="jp-bar">\
				<div class="jp-seek-bar">\
					<div class="jp-play-bar"></div>\
					<div class="jp-details"><span class="jp-title"></span></div>\
					<div class="jp-timing"><span class="jp-duration"></span></div>\
				</div>\
			</div>\
			<div class="jp-no-solution">\
				Media Player Error<br />\
				Update your browser or Flash plugin\
			</div>\
		</div>\
		' );

function AudioPlayerView( m )
{
	var self = this;
	TimedElementView.call(self, m);
	
	self.jplayer_div = null;
	self.jplayer_skin = global_audio_html_block.clone();
	
	self.controls = false;
	self.loop = false;
	self.stopothers = false;

	if ( self.xml_node.attr("controls") ) 
	{ 
		if ( self.xml_node.attr("controls").toLowerCase() == "true" ) 
		{ 
			self.controls = true; 
		} 
	}
	
	if ( self.xml_node.attr("loop") ) 
	{ 
		if ( self.xml_node.attr("loop").toLowerCase() == "true" ) 
		{ 
			self.loop = true; 
		} 
	}
	
	if ( self.xml_node.attr("stopothers") ) 
	{ 
		if ( self.xml_node.attr("stopothers").toLowerCase() == "true" ) 
		{ 
			self.stopothers = true; 
		} 
	}
	
	self.src_url 			=  self.xml_node.attr('src') ;
	
	self.jp_container_id = 'jp_container_' + self.oDiv.attr( 'id' );
	self.jp_content_id = 'jp_' + self.oDiv.attr( 'id' );
	
	self.no_suffix = self.src_url.substr(0, self.src_url.lastIndexOf("."));
		
	self.base_setContent = self.setContent;
	self.setContent = function()
	{
		self.oContent = self.jplayer_skin;
		self.base_setContent();
		
		self.jplayer_div = $( self.oDiv.find( ".jp-jplayer" )[0] );
		self.jplayer_skin = $( self.oDiv.find( ".jp-flat-audio" )[0] );
		
		self.jplayer_skin.data('control', self);
		
		self.jplayer_skin.attr( 'id', self.jp_container_id );
		self.jplayer_div.attr( 'id', self.jp_content_id );
		
		self.createCues( self.xml_node.children() );
		
		// (seemingly) delays apply player until html elements have rendered.
		setTimeout( self.applyPlayer , 0 );
	
	}
	
	self.base_kill = self.kill;
	self.kill = function()
	{
		self.jplayer_div.jPlayer( 'destroy' );
		self.jplayer_div.empty().remove();
		self.base_kill()
	}
	
	self.play = function()
	{	
		/* stop others */
		if (self.stopothers) {
			$(".jp-jplayer").jPlayer("stop");
		}
		/* play this one */
		self.jplayer_div.jPlayer( 'play' );
		
	}
	
	self.pause = function()
	{
		self.jplayer_div.jPlayer( 'pause' );
	}
	
	self.stop = function()
	{
		self.jplayer_div.jPlayer( 'pause' );
	}
	
	self.reset = function()
	{
		self.jplayer_div.jPlayer( 'stop' );
	}
	
	self.changeSource = function( url )
	{
	}
	
	self.applyPlayer = function()
	{
		var ancestor_string = '#' + self.jp_container_id;
		if( !self.controls )
		{
			$( ancestor_string ).hide(0)
		}
		
		self.jplayer_div.jPlayer(
		{
			ready: function () 
			{
				$( this ).jPlayer( "setMedia", 
				{
					mp3:	self.src_url
				});
				
				if( self.autoplay )
				{
					self.play();
				}
			},
			timeupdate: function( event ) 
			{ 
				self.timeUpdate( event.jPlayer.status.currentTime );
			},
			ended:function ( event )
			{
				var cue = self.findCue( 'end' );
				if( cue )
				{
					self.doCue( cue );
				}
				if( self.loop )
				{
					self.play();
				}
			},
			cssSelectorAncestor: ancestor_string,
			swfPath: "lib/js/plugins/jPlayer",
			solution: "html,flash",
			supplied: "mp3",
			wmode: "window",
			smoothPlayBar: true,
			keyEnabled: false,
			globalVolume: true
		});
	
	}
	

}
AudioPlayerView.prototype = TimedElementView;
