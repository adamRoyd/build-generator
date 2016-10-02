/**
* @author Andy Galletly
*/

// flat jplayer
var global_video_html_block = $( ' \
<div class="jp-video jp-flat-video">\
	<div class="jp-closed-captions"></div>\
	<div class="jp-jplayer"></div>\
	<div class="jp-gui">\
		<div class="jp-play-control jp-control">\
			<a class="jp-play jp-button"></a>\
			<a class="jp-pause jp-button"></a>\
		</div>\
		<div class="jp-bar">\
			<div class="jp-seek-bar">\
				<div class="jp-play-bar"></div>\
				<!--<div class="jp-details"><span class="jp-title"></span></div>-->\
				<!--<div class="jp-timing"><span class="jp-current-time"></span></div>-->\
				<div class="jp-timing"><span class="jp-duration"></span></div>\
			</div>\
		</div>\
		<div class="jp-screen-control jp-control">\
			<a class="jp-full-screen jp-button"></a>\
			<a class="jp-restore-screen jp-button"></a>\
		</div>\
	</div>\
	<div class="jp-no-solution">\
		Media Player Error<br />\
		To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.\
	</div>\
</div>\
' );

function VideoPlayerView( m )
{
	var self = this;
	TimedElementView.call(self, m);
	
	self.jplayer_div = null;
	self.jplayer_skin = global_video_html_block.clone();
		
	self.use_closed_captions		= false;
	
	self.isPlaying = false ;
	self.show_closed_captions 	= false;
	self.has_closed_captions 		= false;
	
	self.ccbuttontext = 'subtitles';
	if ( self.xml_node.attr("ccbuttontext") ) 
	{ 
		self.ccbuttontext = self.xml_node.attr("ccbuttontext"); 
	}
	
	self.controls = false; 
	if ( self.xml_node.attr("controls") ) 
	{ 
		if ( self.xml_node.attr("controls").toLowerCase() == "true" ) 
		{ 
			self.controls = true; 
		} 
	}
	self.postertype = 'jpg'; 
	if ( self.xml_node.attr("postertype") ) 
	{ 
		self.postertype = self.xml_node.attr("postertype"); 
	}
	if ( self.xml_node.attr( "useclosedcaptions" ) )
	{
		if ( self.xml_node.attr( "useclosedcaptions" ).toLowerCase() == "true" )
		{
			self.use_closed_captions = true;
		} 
	}

	self.stopothers = true;
	if ( self.xml_node.attr( "stopothers" ) )
	{
		if ( self.xml_node.attr( "stopothers" ).toLowerCase() == "false" )
		{
			self.stopothers = false;
		} 
	}
	if ( self.xml_node.attr( "closedcaptionsoninit" ) )
	{
		if ( self.xml_node.attr( "closedcaptionsoninit" ).toLowerCase() == "true" )
		{
			 self.show_closed_captions = true;
		} 
	}
	
	self.reload = true;
	self.vid_width 		= self.xml_node.attr('width') ;
	self.vid_height 	= self.xml_node.attr('height') ;
	self.src_url 			= self.xml_node.attr('src');
	self.vttcuepoints = [];
	
	self.jp_container_id = 'jp_container_' + self.oDiv.attr( 'id' );
	self.jp_content_id = 'jp_' + self.oDiv.attr( 'id' );
	self.no_suffix = self.src_url.substr(0, self.src_url.lastIndexOf("."));
			
	self.base_setContent = self.setContent;
	
	
	self.setContent = function()
	{
		self.oContent = self.jplayer_skin;
		self.base_setContent();
		
		self.jplayer_div = $( self.oDiv.find( ".jp-jplayer" )[0] );
	
		self.jplayer_skin.attr( 'id', self.jp_container_id );
		self.jplayer_div.attr( 'id', self.jp_content_id );
		
		
		self.createCues( self.xml_node.children() );
		
		// (seemingly) delays apply player until html elements have rendered.
		setTimeout( self.applyPlayer , 0 );
	
	}
	
	self.hideCCtracks = function()
	{
		
		if( self.video_element )
		{
			if( self.video_element[0].textTracks )
			{
				for( var i = 0; i < self.video_element[0].textTracks.length; i++ )
				{
					var item = self.video_element[0].textTracks[ i ];
					if ( devmode ) console.log( 'Log HIDE TRACK ' + item.label )
					if(item.OFF)
					{
						item.mode = item.OFF;
					}
					else
					{
						item.mode = 'hidden';
					}
				}
			}
		}
	}
	self.showCCtracks = function()
	{
		if( self.video_element )
		{
			if( self.video_element[0].textTracks )
			{
				
				for( var i = 0; i < self.video_element[0].textTracks.length; i++ )
				{
					var item = self.video_element[0].textTracks[ i ];
					if ( devmode ) console.log( 'Log SHOW TRACK ' + item.label )

					if(item.SHOWING)
					{
						item.mode = item.SHOWING;
					}
					else
					{
						item.mode = 'showing';
					}
				}
			}
		}
	}
	
	
	self.toggleCC = function()
	{
		//self.show_closed_captions = true
		if( self.show_closed_captions )
		{
			self.toggleHideCC()
		}
		else
		{
			self.toggleShowCC()
		}
	}
	
	self.toggleShowCC = function()
	{
	
		self.showCCtracks()
		var ccdiv = $(self.jplayer_skin.find( '.jp-closed-captions' )[ 0 ]);
		ccdiv.fadeIn();
		self.cc_button.addClass('on');
		self.show_closed_captions = true
	}
	self.toggleHideCC = function()
	{
		self.hideCCtracks()
		var ccdiv = $(self.jplayer_skin.find( '.jp-closed-captions' )[ 0 ]);
		ccdiv.fadeOut();
		self.cc_button.removeClass('on');
		self.show_closed_captions = false
	}
	
	
	self.base_kill = self.kill;
	self.kill = function()
	{
		self.vttcuepoints = [];
		self.jplayer_div.jPlayer( 'destroy' );
		self.jplayer_skin.empty().remove();
		self.jplayer_div.empty().remove();
		self.base_kill()
	}
	
	self.play = function()
	{
		
		self.jplayer_div.jPlayer( 'play' );
		TweenMax.delayedCall( 0.1, self.checkPlaying );
	}	
		
	self.checkPlaying = function()
	{
		/*
			This is a delayed backup play for ie8. 
			When using the Flash version of the player, calls to play a previously hidden jplayer will fail
			Adding a second play call to the jplayer forces it to play
		*/
		
		if( !self.isPlaying )
		{
			if ( devmode ) console.log( 'Log PLAYING VID ' )
			self.play() ;
		}	
		else
		{
			self.oDiv.addClass('started')
		}
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
	
	self.attachCCButton = function()
	{
		//self.show_closed_captions = true;
		self.cc_button = $( '<div class="ccbutton"></div>');
		self.cc_button.append( $( '<p>'+self.ccbuttontext+'</p>' ) );
		self.jplayer_skin.append( self.cc_button );
		applyClick(self.cc_button, self.toggleCC );
	
		if (self.show_closed_captions) {
			self.toggleShowCC();
		}
	}
	
	self.loadVTT = function()
	{
		if ( self.use_closed_captions )
		{
			
		$.ajax({
			type: "GET",
            url : self.no_suffix+ '.vtt',
            dataType: "text",
            success : function (data) 
			{
				self.has_closed_captions = true;
				
				if( self.video_element )
				{
					// native subtitle track
					var _track = $('<track label="English" srclang="en" src="' +self.no_suffix+ '.vtt" kind="subtitles" default />')
					self.video_element.append( _track );
					
					if( !self.video_element[0].textTracks )
					{
						
						self.createVTTCues( data );
					}
					
					if( isFF() )
					{
						_track.remove();
						self.createVTTCues( data );
					}
				}
				else
				{
					self.createVTTCues( data );
				}
				
				self.attachCCButton();
				
            },
            error : function (data) 
			{
				self.has_closed_captions = false;
            }
        });
		}
	}
	
	
	self.ClosedCaption = function( line )
	{
		var cptn = this
		cptn.firstlinesplit = line.split( ' --> ' );
		cptn.start_time = self.convertTimeCodeToSeconds( cptn.firstlinesplit[ 0 ] ); 
		cptn.end_time = self.convertTimeCodeToSeconds( cptn.firstlinesplit[ 1 ] ); 
	
		cptn.text = '';
		
		cptn.addText = function( text_line )
		{
			if( text_line.length > 1 )
			{
				cptn.text += '<p>' + text_line + '</p>';
			}
		}
	}
	
	self.createVTTCues = function( data )
	{
	
		var newlines = data.split('\n');
		
		var current_caption = null;
		
		for( var i = 0; i < newlines.length; i++ )
		{
			var line = newlines[ i ];
			if( line.indexOf( '-->' )>-1 )
			{
				var caption = new self.ClosedCaption( line );
				current_caption = caption;
				self.vttcuepoints.push( caption );
			}
			else if( current_caption )
			{
				current_caption.addText( line )
			}
		}
	}
	
	
	
	self.applyPlayer = function()
	{
		var ancestor_string = '#' + self.jp_container_id;
		
		self.jplayer_div.jPlayer(
		{
			ready: function () 
			{
				self.video_element = $(self.jplayer_div.find('video')[0]);
				if ( devmode ) console.log( 'Log self.video_element %o', self.video_element )
				if( self.video_element.length<1 )
				{
					self.video_element = null;
				}
				if ( devmode ) console.log( 'Log self.video_element %o', self.video_element )
				
				$(this).jPlayer("setMedia", 
				{
					m4v: self.src_url,
					poster: self.no_suffix + '.' + self.postertype
				});
				
				
				if( self.autoplay )
				{
					self.play();
				}
				if( !self.controls )
				{
					self.jplayer_skin.find('.jp-gui').empty();
				}
				self.loadVTT();
				
			},
			play: function() {
				
				
				
				$(this).jPlayer("option", "autohide", {
					full: true,
					restored: true
				});
				// Avoid multiple jPlayers playing together.

				if (self.stopothers) {
					// pause others and reset playhead to 0
					$(this).jPlayer("pauseOthers", 0);
				}
				self.isPlaying = true ;

				var cue = self.findCue( 'start' );
				if( cue )
				{
					self.doCue( cue );
				}
			},
			// When paused, show the GUI
			pause: function() {
				$(this).jPlayer("option", "autohide", {
					full: false,
					restored: false
				});
				self.isPlaying = false ;
			},
			// Enable clicks on the video to toggle play/pause
			click: function(event) {
				if(event.jPlayer.status.paused) {
					self.play()
				} else {
					self.pause();
				}
			},
			timeupdate: function(event) 
			{
				self.oDiv.addClass('started');
				self.timeUpdate( event.jPlayer.status.currentTime );
			},
			ended:function (event){
				var cue = self.findCue( 'end' );
				if( cue )
				{
					self.doCue( cue );
				}
			},
			sizeFull: {
				width: "100%",
				height: "auto",
				cssClass: "jp-flat-video-full"
			},
			resize : self.resized,
			cssSelectorAncestor: ancestor_string,
			swfPath: "lib/js/plugins/jPlayer",
			solution: "html,flash",
			supplied: "m4v",
			size: {
				width: self.vid_width,
				height: self.vid_height,
				cssClass: "jp-video-auto"
			},
			noFullWindow: {
				android_phone: /android [0-3]/
			},
			smoothPlayBar: true,
			keyEnabled: false,
			globalVolume: true
		});
	
	}
	
	self.resized = function( event )
	{
		var paused = event.jPlayer.status.paused;
		if( self.oDiv.find('.jp-state-full-screen').length>0 )
		{
			$('body').addClass('fullscreenvideo');
			
			// only do this if html player is used, flash player freaks out. ( IE8 shouldn't need this fix anyway )
			if( event.jPlayer.html.used && $('.lte9').length )
			{
				// fix for IE9, moves the player to a seperate div outside of the course div
				self.movePlayerToTop();
			}
		}
		else
		{
			$('body').removeClass('fullscreenvideo');
			if( event.jPlayer.html.used )
			{
				self.dockPlayer();
			}
		}
		
		// continue playing if already playing
		if( !paused )
		{
			self.play();
		}
	}
	
	self.movePlayerToTop = function()
	{
		self.jplayer_skin.appendTo( $( 'body' ) );
	}
	
	self.dockPlayer = function()
	{
		self.jplayer_skin.appendTo( self.oDiv );
	}
	
	self.base_timeUpdate = self.timeUpdate;
	self.timeUpdate = function( t )
	{
		self.base_timeUpdate( t );
		var new_time = t; // Math.round( t );
	
			
			var vttcue = self.findVTTCue( self.currentTime );
			
			
			if( vttcue )
			{
				if( vttcue != self.current_vttcue )
				{
					self.current_vttcue = vttcue;
					self.doCue( vttcue );
				}
			} else {
				self.current_vttcue = null;
				self.noCue( );				
			}

	
	}
	
	self.base_doCue = self.doCue;
	self.doCue = function( cue )
	{
		self.base_doCue(cue);
		
		if( cue.text )
		{
			var ccdiv = $(self.jplayer_skin.find( '.jp-closed-captions' )[ 0 ]);
			
			if( !self.show_closed_captions )
			{
				ccdiv.fadeOut(0);
			}
			
			ccdiv.empty().append( cue.text );
		}
		
	}
	
	self.noCue = function(  )
	{
		var ccdiv = $(self.jplayer_skin.find( '.jp-closed-captions' )[ 0 ]);			
		ccdiv.empty();
	}
	
	self.base_endCue = self.endCue;
	self.endCue = function( cue )
	{
		self.base_endCue( cue );
		if( cue.text )
		{
			var ccdiv = $( self.jplayer_skin.find( '.jp-closed-captions' )[ 0 ] ); 
			ccdiv.empty();
		}
	}
	
	
	self.findVTTCue = function( timecode )
	{
		var cue = null;
		for( var i = 0; i < self.vttcuepoints.length; i++)
		{
			var cuepoint = self.vttcuepoints[ i ];
			if( cuepoint.id == timecode )
			{
				cue = cuepoint;
				break;
			}
			if( ( timecode >= cuepoint.start_time ) && ( timecode <= cuepoint.end_time ) )
			{
				cue = cuepoint;
				break;
			}
		}
		
		return cue;
	}
	
}
VideoPlayerView.prototype = TimedElementView;
