
var devmode = true;

if (!window.console) console = {};
if (!window.console.log) console.log = function (txt) { };
if (!window.console.trace) console.trace = function(){ console.log( "console.trace doesn't work in IE "); };
if (!window.console.warn) console.warn = function(txt){ console.log( "WARN > " + txt); };
if (!window.console.group) console.group = function(txt){ console.log( "GROUP > " + txt); };
if (!window.console.groupEnd) console.groupEnd = function(txt){ console.log( "GROUPEND " ); };


var sErrorMsg;
function fnIsMozilla(){if(document.all){return false;} else {return true;}}

var audioplayer = null;
//flash check
//requires swfobject.js
var iMinFlashVersion = 10;
//end flash check

var _respondo;

function stopAudio()
{
	audioplayer.jPlayer('pause');
}

function testVolume() {
	audioplayer.jPlayer('stop');
	audioplayer.jPlayer('play');
}


function init() 
{
	_respondo = new Respondo();
	
	_respondo.dispatcher.bind('updateSize' , updateSize);
	_respondo.init();
		
	//do system checks and report if system fails spec
	var sHTML = new String();
	
	doErrorChecks()
	
}

function updateSize()
{
	if( _respondo.phone() )
	{
		$( '#splashstyle' ).attr( 'href' , 'lib/css/splash_phone.css' );
	}
	else
	{
		$( '#splashstyle' ).attr( 'href' , 'lib/css/splash_desktop.css' );
	}
}

function doErrorChecks() 
{
	//system checks

	var bIncFlashCheck = false;
	var bPassedChecks = true;
    
	
	if ( $.browser.msie ) 
	{
		if( $.browser.version < 9 ){
			bIncFlashCheck = true;
		}

		// IE8 in compatibility mode reports as being IE7 with documentMode 8
		// alert("IE " + $.browser.version + " - " + document.documentMode) ;
		if( $.browser.version < 8 )
		{
			if( document.documentMode )
			{
				if( document.documentMode < 8 )
				{
					browserError();
					bPassedChecks = false;	
				}
			}
			else
			{
				browserError();
				bPassedChecks = false;	
			}
		}
	}	
	
	//Plug in checks
	if (bIncFlashCheck) 
	{
		if ( !$.flash.hasVersion( iMinFlashVersion ) ) 
		{
            		pluginError()
			bPassedChecks = false;
		}
    	}

	if( bPassedChecks )
	{
		writeSplash();
	}
}

function launchCourse(){
	//open course window
	var sWinAtts = "width=1014,height=644,location=0,menubar=0,resizable=1,scrollbars=1,status=1,toolbar=0,screenX=100,screenY=100,personalbar=no,left=0,top=0";
	var oContentWindow = window.open(courseFile,'course',sWinAtts);
	stopAudio();
	if(oContentWindow){
		//course launched
		//bring the content window into focus
		oContentWindow.focus();
	} else {
		//window blocked by poup blocker
		popupError()
	}
}


function popupError()
{
	showDiv( 'popuperror' );
}

function pluginError()
{
	showDiv( 'pluginerror' );
}

function browserError()
{
	showDiv( 'browsererror' );
}

function writeSplash(){
	audioplayer = $("#audioplayer");
	
	audioplayer.jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "lib/audio/audio_test.mp3"
			});
		},
		swfPath: "lib/js/plugins/jPlayer",
		supplied: "mp3",
		wmode: "window",
		volume: 1
	})

	showDiv( 'launch' );
	
	$( '#start' ).click(function()
	{
		launchCourse()
	})
	$( '#sound' ).click(function()
	{
		testVolume()
	})
}

function showDiv( div_id )
{
	hideDivs();
	$( '#' + div_id ).css('display', 'block');
}

function update(){
	showDiv( 'courseactive' );
}
function splashClose()
{
	showDiv( 'courseclosed' );
}

function hideDivs()
{
	$( '#courseactive' ).hide();
	$( '#courseclosed' ).hide();
	$( '#browsererror' ).hide();
	$( '#pluginerror' ).hide();
	$( '#popuperror' ).hide();
	$( '#launch' ).hide();
}

function Respondo()
{
	var self = this;
	self.screen_size = null;
	self.css_tag = null;

	self.dispatcher = $('<div id="dispatcher_respondo">');

	self.init = function ()
	{
		$(window).resize(self.checkScreenSize);
		self.checkScreenSize();
	}

	self.ready = function()
	{
		if( self.screen_size )
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	self.checkScreenSize = function ()
	{
		if ( devmode ) console.log( 'Log checkScreenSize' )
		self.screen_width = document.documentElement.clientWidth;

		var prev_screen_size = self.screen_size;

		var responsivemode = true;
		
		
		if( responsivemode )
		{
			if (self.screen_width <= 768)
			{
				self.screen_size = 'phone';
			}
			else if (self.screen_width >= 769)
			{
				self.screen_size = 'desktop';
			}
		}
		else
		{
			self.screen_size = 'desktop';
		}
		
		
		if (prev_screen_size != self.screen_size)
		{
			self.updateSize();
		}
	}

	self.updateSize = function ()
	{
	    if (typeof loadCompiledCSSandJavascriptAndXML != 'undefined' && loadCompiledCSSandJavascriptAndXML == true) {
	        $('#ui_css').attr('href', 'lib/css/' + self.screen_size + '_compiled.css');
	    } else {
	        $('#ui_css').attr('href', 'lib/css/' + self.screen_size + '/ui.css');
	    }
		self.dispatcher.trigger('updateSize');
	}

	self.desktop = function ()
	{
		return Boolean(self.screen_size == 'desktop');
	}

	self.phone = function ()
	{
		return Boolean(self.screen_size == 'phone');
	}

}

