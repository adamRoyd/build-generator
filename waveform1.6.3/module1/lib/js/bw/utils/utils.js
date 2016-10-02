function isEven(n) 
{
  return n == parseFloat(n)? !(n%2) : void 0;
}

function tweenTo(mc, t, obj)
{
	var twn = null;
	if( mc )
	{
		twn = TweenMax.to(mc, t, obj);
	}
	return twn
}

function scrollToDiv( div )
{

	if( _respondo.screen_type != 'desktop' )
	{
		var scrollYPos = div.position().top;
		tweenTo(window, 0.5, {scrollTo:{y:scrollYPos, x:0}, ease:Power4.easeOut});
	}
}

function createDispatcher( id )
{
	var dispatcher = $('<div id="dispatcher_' + id + '">');	
	return dispatcher;
}

function tidyColour(colour_string)
{
	var col = colour_string;
	
	if( String(colour_string).indexOf("0x")>-1 )
	{
		col = "#" + colour_string.split( "0x" )[ 1 ];
	}
	
	if(String(col).indexOf("#")==-1)
	{
		col = "#"+col;
	}
	
	return col;
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getRandomNumber( low_number, high_number )
{	
	var difference = high_number - low_number ;
	
	var randomSection = Math.random() * difference ;
	var randomSectionToTwoDecimalPlaces = Math.round( randomSection* 100)/100 ;
	
	
	return randomSectionToTwoDecimalPlaces + low_number;
}



function parseNumberString( num_string )
{
	var return_number = null;
	if( num_string )
	{
		if( num_string.indexOf( 'rand_' )>-1 )
		{
			// handle the random
			var numbers = num_string.split( 'rand_' )[1].split( ',' );
			if( numbers.length<2 )
			{
				numbers = [ '0', numbers[0] ];
			}

			var low_number = Number( numbers[ 0 ] )
			var high_number = Number( numbers[ 1 ] )

			return_number = getRandomNumber( low_number, high_number )
		}
		else
		{
			if( num_string.indexOf( '%' )>-1 )
			{
				// leave as string? (might work)
				return_number = num_string
			}
			else
			{
				return_number = Number( num_string );
			}
		}
	}
	return return_number;
}

function isOdd(num) 
{ 
	return Boolean( ( num % 2 ) === 0 );
}

function killHover()
{

	if ('createTouch' in document)
	{
		try
		{
			var ignore = /:hover/;
			for (var i=0; i<document.styleSheets.length; i++)
			{
				var sheet = document.styleSheets[i];
				for (var j=sheet.cssRules.length-1; j>=0; j--)
				{
					var rule = sheet.cssRules[j];
					if (rule.type === CSSRule.STYLE_RULE && ignore.test(rule.selectorText))
					{
						sheet.deleteRule(j);
					}
				}
			}
		}
		catch(e){}
	}
	if ( devmode ) console.groupEnd( )
}

function printDiv(divName) 
{
	if ( devmode ) console.log("attempting to print " + divName)
	/*
     var originalContents = document.body.innerHTML;
     var printContents = document.getElementById(divName).innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
	 */
	var w=window.open( '', masterObj.sCourseTitle );
	w.document.write('<html><head><title>' + masterObj.sCourseTitle + '</title><link rel="stylesheet" type="text/css" href="../css/print.css"></head><body>' + $('#'+divName).html() +'</body></html>' );
	w.document.close();
	w.focus();
	
	//w.close();
    window.setTimeout(
		function() {
			w.print();
			w.close();
		}, 
		50
	);
}

/*
*	attach an invisible (based on the class 'invisibutton') button to the element
*	and apply click over and out functions
*	the button can be easily enabled and disabled
*/
function applyClick(elm, func, overfunc, outfunc) 
{
	removeClick(elm)
	
		var btn = $('<button />')
        .attr("disabled", "disabled")
        .addClass("invisibutton")
        .width('100%')
        .height('100%')
        .click(func)
        .mouseover(overfunc)
        .mouseout(outfunc)
        .focusin(overfunc)
        .focusout(outfunc);
	
	$(elm).data('clickfunc', func);
	$(elm).data('overfunc', overfunc);
	$(elm).data('outfunc', outfunc);
	
     btn.mouseover(function(){
		tweenTo($(elm), 0, {className:'+=over'});
		
		if( $(elm).data('overtween') )
		{
			$(elm).data('overtween').kill();
		}
		
		var twn = tweenTo($(elm), 0.2, {className:'+=animover'});
		
		$(elm).data('overtween', twn);
	})
     btn.mouseout(function(){
		tweenTo($(elm), 0, {className:'-=over'});
		if( $(elm).data('overtween') )
		{
			$(elm).data('overtween').kill();
		}
		
		var twn = tweenTo($(elm), 0.3, {className:'-=animover'});
		
		$(elm).data('overtween', twn);

		
	})
	
	btn.focusin(function(){
		if( !$(this).data("mouseDown" ) )
		{
			$(this).addClass('tabbed');
			tweenTo($(elm), 0, {className:'+=over'});
			if( $(elm).data('overtween') )
			{
				$(elm).data('overtween').kill();
			}
			
			var twn = tweenTo($(elm), 0.2, {className:'+=animover'});
			
			$(elm).data('overtween', twn);
		}
	})
	btn.focusout(function(){
		$(this).removeData("mouseDown");
		$(this).removeClass('tabbed');
		tweenTo($(elm), 0, {className:'-=over'});
		if( $(elm).data('overtween') )
		{
			$(elm).data('overtween').kill();
		}
		
		var twn = tweenTo($(elm), 0.3, {className:'-=animover'});
		
		$(elm).data('overtween', twn);
	})
	btn.mouseout(function(){
		$(this).removeData("mouseDown");
		$(this).removeClass('tabbed');
	})
	btn.click(function(){
		$(this).data("mouseDown", true);
		$(this).removeClass('tabbed');
	})
	btn.mousedown(function(){
		$(this).data("mouseDown", true);
		$(this).removeClass('tabbed');
	})
	
	if( Modernizr.touch )
	{
		btn.unbind( 'mouseover' );
		btn.unbind( 'mouseout' );
		btn.unbind( 'focusin' );
		btn.unbind( 'focusout' );
	}
	
	btn.data('elm', elm);
    elm.data('btn', btn);
    elm.append(btn);
	
	if( elm.find( '> .after' ).length<1 )
	{
		elm.append( '<div class="after"></div>');
	}
	
	
    btn.removeAttr("disabled");
}

function removeClick(elm)
{
	var btn = elm.data( 'btn' );
	if( btn )
	{
		btn.unbind( 'click' );
		btn.unbind( 'mouseover' );
		btn.unbind( 'mouseout' );
		btn.unbind( 'focusin' );
		btn.unbind( 'focusout' );
		btn.remove()
	}
}

function reApplyClick( elm )
{
	applyClick(elm, $(elm).data('clickfunc'), $(elm).data('overfunc'), $(elm).data('outfunc')) 
}

function disableElement(elm)
{
	if(elm)
	{
		if( elm.data('btn') )
		{
			removeClick(elm)
			elm.addClass('disabled');
			elm.data('btn').removeData("mouseDown");
			elm.data('btn').removeClass('tabbed');
			elm.data('btn').attr("disabled", "disabled");
			elm.data('btn').css( 'display', 'none' ) ;
			
			tweenTo($(elm), 0, {className:'-=over'});
			if( $(elm).data('overtween') )
			{
				$(elm).data('overtween').kill();
			}
			
			var twn = tweenTo($(elm), 0, {className:'-=animover'});
		}
	}
}

function enableElement(elm)
{
	if(elm)
	{
		if( elm.data('btn') )
		{
			reApplyClick( elm )
			elm.removeClass('disabled');
			elm.data('btn').removeAttr("disabled");
			elm.data('btn').css( 'display', 'block' ) ;
			elm.data('btn').mouseout();
		}
	}
}

function enableContentButton(elm)
{
	if( elm )
	{
		//elm.view.oDiv.removeClass('disabled');
		elm.enable();
	}
}

function disableContentButton(elm)
{
	if( elm )
	{
		//elm.view.oDiv.addClass('disabled');
		elm.disable();
	}
}

function jumpScreen(screen_id)
{
	//navObj.showContent()
	var screen_obj = masterObj.getScreenById(screen_id);
	
	if( screen_obj )
	{
		var matching_ids = false
		if(currentScreen)
		{
			matching_ids = Boolean( String(screen_id) == String(currentScreen.id) );
		}
		if( !matching_ids )
		{
			navObj.disableBackNext();
			masterObj.loadScreenObj( screen_obj );
			masterObj.iCurrentPos = masterObj.getTopicPositionById(currentTopic.id);
		}
	}
}


function showInvisibleButtons()
{
	$( "#courseholder" ).find( ".invisibutton" ).show()
}
function hideInvisibleButtons()
{
	$( "#courseholder" ).find( ".invisibutton" ).hide()
}


function removeElement( elm )
{
	// console.log("REMOVE  "+$( elm ).attr( 'id' ) );
	$( elm ).empty().remove();
}

function openLink( url )
{
	window.open( url, "_blank" );
}

function isFF()
{
	var ffVersion = null;
	
	// if ie8 
	
	
	
	if ( $.browser.mozilla ) 
	{
		//alert( jQuery.browser.version );
		ffVersion = jQuery.browser.version ;
	}
	
	
	
	return ffVersion ;
}

function isIE()
{
	var ieVersion = null;
	
	// if ie8 
	
	
	
	if ( $.browser.msie ) 
	{
		//alert( jQuery.browser.version );
		ieVersion = jQuery.browser.version ;
	}
	
	
	
	return ieVersion ;
}

// --------- GETS & SETS ----------- //

function getVarText( str )
{
	return coursetextObj.getVarById( str ) ;
}

function stripPX( val )
{
	return Number( val.split( 'px' )[ 0 ] );
}

function inArray( test_item, arr )
{
	var in_array = false;
	for( var i = 0; i < arr.length; i++ )
	{
		var item = arr[ i ];
		if( item == test_item )
		{
			in_array = true;
		}
	}
	return in_array;
}


function getItemById( id, arr )
{
	var rtn = null;
	
	for( var i = 0; i < arr.length; i++ )
	{
		var oObj = arr[ i ];
		
		if( id == oObj.id )
		{
			rtn = oObj;
			break;
		}
	}
	
	return rtn;
}

function getScreenById( id, calledFromScreen )
{
	var screen = null ;
	
	screen = masterObj.getScreenById( id ) ;
	
	if( !screen )
	{
		screen = masterObj.getNavById( id ) ;
	}
	
	if( !screen )
	{
		screen = masterObj.getMenuById( id ) ;
	}
	
	// console.log("screen pre-subscreen check: %O", screen ) ;
	
	if( !screen )
	{
		var subScreenElement = calledFromScreen.view.getScreenElementById( id ) ;
		
		
		if( subScreenElement )
		{
			
			if( subScreenElement.type != "screen" )
			{
				screen = null ;
			}
			else
			{
				screen = subScreenElement.view.screenObject ;
			}
		}
	}
	
	if( !screen )
	{
		var currentScreenElementsArray = $( '.screenElement.screen' ) ;
		
		for( var i = 0; i < currentScreenElementsArray.length; i++ )
		{
			var item = currentScreenElementsArray[ i ];
			
			var subScreen = $(item).data( 'subScreenView' ).screenObject ; 
			
			screen = subScreen ;
			
		}
	}
	
	return screen ;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
