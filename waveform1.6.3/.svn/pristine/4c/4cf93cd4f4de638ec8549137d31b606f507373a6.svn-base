/**
* @author Dan Bibby
*
* These are global functions that are soley used for controlling view settings and manipulations, often called from screen events
*
*/
var old_scroll = 0;
function scrollTop()
{
	old_scroll = $(window).scrollTop()
	if ( devmode ) console.log('new oldscroll '+old_scroll)
	tweenTo(window, 0.1, {scrollTo:{y:0, x:0}, ease:Power4.easeOut});
}

function oldScroll()
{
	if ( devmode ) console.log('oldscroll '+old_scroll)
	tweenTo(window, 0.1, {scrollTo:{y:old_scroll, x:0}, ease:Power4.easeOut});
}

function toggleVisible( id )
{
	var elm = currentScreen.view.getScreenElementById( id ) ;
	var div = elm.view.oDiv ;
	
	var opacity  = div.css( 'opacity' ) ;
	
	if( opacity == 0 )
	{
		TweenMax.to( div, 0, { autoAlpha : 1 }) ;
	}
	else
	{
		TweenMax.to( div, 0, { autoAlpha : 0 }) ;
	}
	
}

function enableButtonFromId( id )
{
	var elm = currentScreen.view.getScreenElementById( id ) ;
	var div = elm.view.oDiv ;
	enableContentButton( elm );	
}

function doStringReplacements( text )
{
	var fullText = text;
	
	if( String( fullText ).indexOf("storedText")>-1 )
	{
		
		var startIndex = fullText.indexOf( "[storedText" ) ;
		var endIndex = 0 ;
		var endArr = fullText.split( "]" ) ;
		
		var pos = 0 ;
		for( var i = 0; i < endArr.length; i++ )
		{
			pos += endArr[ i ].length ;
			
			if( pos > startIndex )
			{					
				endIndex  = pos ;
				break ;
			}			
		}				
		var diff = ( endIndex - startIndex ) + 1;			
		var textToReplace = fullText.substr( startIndex, diff )
		
		var startPlus = startIndex + 1 ;
		var diff = endIndex - startPlus ;			
		var storeRef = fullText.substr( startPlus, diff ) ;			
		var referenceArr = storeRef.split( "|" ) ;
		var textToGet = referenceArr[ 1 ] ;
					
		var storedText = coursetextObj.retrieveText( textToGet ) ;

		
		fullText = fullText.split( textToReplace ).join( storedText ) ;
	}
	
	return fullText ;

}


function spriteAnim(elm, time, settings )
{
	if ( devmode ) console.log( 'Log spriteAnim' )
	elm.css('background-image', 'url(' + settings.url + ')');

	var column_count = settings.colunmns;
	var row_count = settings.rows;

	var sheet_width = settings.width;
	var sheet_height = settings.height;

	var frameheight = settings.frameheight;
	var framewidth = settings.framewidth;

	if(!frameheight)
	{
		frameheight = elm.height()
	}
	if(!framewidth)
	{
		framewidth = elm.width()
	}
	
	elm.height( frameheight );
	elm.width( framewidth );

	var max_x = 0-(sheet_width - framewidth)
	var max_y = sheet_height - frameheight;

	var row_delay = time / (row_count)
	var row_height = max_y / (column_count-1)

	var columnSteppedEase = new SteppedEase(column_count-1)

	var timeline = new TimelineMax({});

	for(var i = 0; i<row_count; i++)
	{
		timeline.to( elm, 0, {  'background-position': '0px ' + (0-(i*row_height)) + 'px'}) 
		timeline.to( elm, row_delay, { 'background-position': max_x + 'px ' + (0-(i*row_height)) + 'px', ease:columnSteppedEase }) 
	} 

	timeline.stop();
	elm.data('sprite_anim', timeline);
	return timeline;
}
