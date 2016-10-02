function EventAction(xml_node, scrn_view, id){
	
	var self = this ;
	self.id = id ;
	self.screen_view = scrn_view;
	self.tween_array = self.screen_view.tween_array;
	self.screen = scrn_view.screen;
	self.oXML = xml_node;

	self.active_element;
	
	self.activate = function(elm)
	{
		self.active_element = elm;
		var actn = self.oXML ;
		var target = self.getTargetElement();
		var $div = null;
		if( target )
		{
			$div = target.getDiv();
		}
		
		switch(actn.nodeName)
		{
			case "anim":
				var settings = new Object();
				settings.delay = parseNumberString( $(actn).attr('animdelay'));
				settings.ease = $(actn).attr('animease');
				settings.type = $(actn).attr('anim');
				if( !settings.type )
				{
					settings.type = $(actn).attr('type');
				}
				
				if( $(actn).attr('complete') )
				{
					settings.onComplete = self.screen_view.doEventById;
					settings.onCompleteParams = [ $(actn).attr('complete') ];
				}
				
				settings.time = parseNumberString( $(actn).attr('animtime'));
				if(!target)
				{
					if ( devmode ) console.log('NO TARGET %o', actn)
				}
				else
				{
					target.doTween( settings );
				}
//				this.screen_view.doTween(target, settings)
				break;
				
			case "remove":
			
				
				if(target)
				{
					target.view.removeFromScreen()
				}
				break;
			
		case "timer":
		case "media":
	
				
				var delay = 0;
				
				if( $( actn ).attr( 'delay' ) )
				{
					delay = parseNumberString( $( actn ).attr( 'delay' ) );
				}
				
				var func = function(){ if ( devmode ) console.warn( 'Media event - No Action' ) }
				
				if( target )
				{
					var action  = $( actn ).attr( 'action' );
				
					switch( action )
					{
						case "play": 
								func = target.view.play;
							break;
						case "pause": 
								func = target.view.pause;
							break;
						case "stop": 
								func = target.view.stop;
							break;
						case "reset": 
								func = target.view.reset;
							break;
					}
				}
			
				self.tween_array.push( TweenMax.delayedCall( delay, func ) );
			
				break;
				
			case "toggle":
				
				if( $div.css('opacity') <=0 )
				{
					TweenMax.set( $div, { autoAlpha: 1, display: 'block' } ) ;
				}
				else
				{
					TweenMax.set( $div, { autoAlpha: 0, display: 'none' } ) ;
				}
				break;
			case "show":
			
				TweenMax.set( $div, { autoAlpha: 1, display: 'block' } ) ;
				
				break;
			case "hide":
				TweenMax.set( $div, { autoAlpha: 0, display: 'none' } ) ;
				
				break;
				
			case "enable":
				target.enable();
				break;
				
			case "disable":
				target.disable();
				break;
				
			case "dialogue":
				var _dialogue_function = function()
				{
			
					if( masterObj.getDialogueById($(actn).attr('id')) )
					{
						openDialogue( $(actn).attr('id') )
					}
					else
					{
					
						var oDialogue = new DialogueScreen( $(actn) );
						
						currentDialogue = oDialogue;
						navObj.navDir = "menu";
						loadCurrentDialogue();
					}
				}
				
				var delay = parseNumberString( $(actn).attr('delay') )
				
				if( delay>0 )
				{
					self.tween_array.push( TweenMax.delayedCall( delay, _dialogue_function) );
				}
				else
				{
					_dialogue_function();
				}
				
				break;
			case "link":
				var link_url = $(actn).text();
				window.open( link_url, "_blank" );
				break;
			
			case "jump":
				var screenId = $(actn).text();
				jumpScreen( screenId ) ;
				break;
				
			case "function":
			
				var func_name = $(actn).attr('name');
				var delay = parseNumberString( $(actn).attr('delay') );// * 1000;
				var arg = $(actn).text();
				/*
				if( arg )
				{
					eval(func_name)( arg );
				}
				else
				{
					eval(func_name)();
				}
				*/
				var target_func = null;
				var target_func_is_function = false;
				if(target)
				{
					var target_func = target.view[ func_name ];
					if( $.isFunction ( target_func ) )
					{
						target_func_is_function = true;
					}
				}
				var templateView = self.screen.templateView;
				var template_func = templateView[ func_name ];
				
				var screen_func = self.screen[ func_name ];
				
				
				var callback_function = null
				
				
				if( target_func_is_function )
				{
					if( arg )
					{
						callback_function = function(){ $.proxy( target_func, target.view )(arg) };
					}
					else
					{
						callback_function = function(){ $.proxy( target_func, target.view )() };
					}
				}
				else if( $.isFunction ( template_func ) )
				{
					if( arg )
					{
						callback_function = function(){ $.proxy( template_func, templateView )(arg) };
					}
					else
					{
						callback_function = function(){ $.proxy( template_func, templateView )() };
					}
				}
				else if( $.isFunction ( screen_func) )
				{ 
					if( arg )
					{
						callback_function = function(){ $.proxy( screen_func, self.screen )(arg) };
					}
					else
					{
						callback_function = function(){ $.proxy( screen_func, self.screen )() };
					}
				}
				else
				{
					var global_func = window[ func_name ];
					if ( $.isFunction ( global_func ) )
					{
						if( arg )
						{
							callback_function = function(){ global_func(arg) };
						}
						else
						{
							callback_function = function(){ global_func() };
						}
					}
				}
				if( callback_function )
				{
					if(delay)
					{
						self.tween_array.push( TweenMax.delayedCall(delay, callback_function) );
					}
					else
					{
						callback_function();
					}
				}
				//setTimeout( callback_function  , delay );
				break;
			case "event":
				var event_id = $(actn).attr('id');
				var delay = parseNumberString( $(actn).attr('delay') );
				var eventfunc = function(){ self.screen_view.doClickById(event_id); };
			
				if( delay > 0 )
				{
					self.tween_array.push( TweenMax.delayedCall(delay, eventfunc) );
				}
				else
				{
					eventfunc();
				}
			break;
			case "screenevent":
				var event_id = $(actn).attr('id');
				var delay = parseNumberString( $(actn).attr('delay') );
				
				var targetScreen = getScreenById( $(actn).attr('target'), this.screen_view.screen ) ;
				
				// console.log("targetScreen: %O", targetScreen.view ) ;
				
				if( targetScreen )
				{
					var eventfunc = function(){ targetScreen.view.doClickById(event_id); };
					if( delay > 0 )
					{
						self.tween_array.push( TweenMax.delayedCall(delay, eventfunc) );
					}
					else
					{
						eventfunc();
					}
				}
				else
				{
					if ( devmode ) console.warn("Screen Event - " + event_id + " - called on bad screen id: " +  $(actn).attr('target')) ;
				}
			break;
			case "filter":
				if ( devmode ) console.warn( 'WARN: FILTER DISABLED. Use "class" instead. (<class add="addClass" remove="removeClass" delay="timedelay" time="durtation">item</class>)' );
				/*
				var target = elm;
				if( $(actn).text() != "[ITEM]" )
				{
					target = this.screen_view.getScreenElementById($(actn).text());
				}
				var filter = $(actn).attr('type');
				var delay = Number( $(actn).attr('delay') );
				var filterswitch = function(){ target.applyFilters( filter ); };
				TweenMax.delayedCall(delay, filterswitch);
				*/
				break;
			case "class": // <class add="addClass" remove="removeClass" delay="timedelay" time="durtation">item</class>
				var addclass = $(actn).attr('add');
				var removeclass = $(actn).attr('remove');
				var d = parseNumberString( $(actn).attr('delay') );
				var t = parseNumberString( $(actn).attr('time') );
				if(!t)
				{
					t = 0;
				}
				tweenTo( $div, t, { delay: d, className: "+=" + addclass } );
				tweenTo( $div, t, { delay: d, className: "-=" + removeclass } );
				break;
			case "translate":
			
				
              			//  <translate x="300" y="80" rotation="-90" animtime="" animdelay="" animease="">table1</translate>
				var settings = new Object();
				
				if( $(actn).attr('animdelay') )
				{
					settings.delay = parseNumberString( $(actn).attr('animdelay') );
				}
				if( $(actn).attr('animease') )
				{
					settings.ease = $(actn).attr('animease');
				}
				
				if( $(actn).attr('x') )
				{
					settings.x = parseNumberString( $(actn).attr('x') );
				}
				
				if( $(actn).attr('y') )
				{
					settings.y = parseNumberString( $(actn).attr('y') );
				}
				
				if( $(actn).attr('left') )
				{
					settings.left = parseNumberString( $(actn).attr('left') );
				}
				
				if( $(actn).attr('top') )
				{
					settings.top = parseNumberString( $(actn).attr('top') );
				}

				
				if( $(actn).attr('z') )
				{
					settings.zIndex = $(actn).attr('z');
				}
				if( $(actn).attr('scale') )
				{
					settings.scale = parseNumberString( $(actn).attr('scale') );
				}
				
				if( $(actn).attr('rotation') )
				{
					settings.rotation = parseNumberString( $(actn).attr('rotation') );
				}
				
				var time = 0;
				if( $(actn).attr('animtime') )
				{
					time = parseNumberString( $(actn).attr('animtime') );
				}	
				
				if( $(actn).attr('complete') )
				{
					settings.onComplete = self.screen_view.doEventById;
					settings.onCompleteParams = [ $(actn).attr('complete') ];
				}
				
				if( $(actn).attr('repeat') )
				{
					settings.repeat = parseNumberString( $(actn).attr('repeat'));
				}
				
				if( $(actn).attr('yoyo') == "true" )
				{
					settings.yoyo = true;
				}
				
				
				tweenTo( $div, time, settings );
				
			break;
				
			case "scroll":
				var id = $(actn).attr('id');
				var delay = null
				if( $(actn).attr('delay') )
				{
					delay = Number( $(actn).attr('delay') );
				}
				if( id )
				{
					if( !$div )
					{
						$div = $( '#'+id) ;
					}
					
					
					// if ( devmode ) console.log( 'Log SCROLL TO DIV %o' , $div )
					
					if($div)
					{
						if( delay )
						{
							TweenMax.delayedCall( delay, scrollToDiv, [ $div ] );
						}
						else
						{
							scrollToDiv( $div );
						}
					}
				}
				else
				{
					var time = Number( $(actn).attr('time') );
					var yposition = Number( $(actn).attr('y') );
					var xposition = Number( $(actn).attr('x') );
					
					var scroll_settings = {};
					if( !isNaN(yposition) )
					{
						scroll_settings.y = yposition
					}
					if( !isNaN(xposition) )
					{
						scroll_settings.x = xposition
					}
					
					if( delay )
					{
						self.tween_array.push( tweenTo( window, time, { delay: delay, scrollTo:scroll_settings } ) );
					}
					else
					{
						self.tween_array.push( tweenTo( window, time, { scrollTo:scroll_settings } ) );
					}
				}
//				this.screen_view.doTween(target, settings)

				
			break ;
				
			case "screencompleted":
				self.screen.screenCompleted();
				
			break ;
			
			case "log":
				if ( devmode ) console.log( 'EVENT LOG (screen:' + self.screen.id + ') - ' + $(actn).text() )
				
			break ;
				
			case "check":
				this.performCheck( actn )
				
			break ;
				
			case "feedback":
				self.screen_view.applyFeedback( $(actn).attr( 'id' ) )
				
			break ;
		}
	}
	
	self.getTargetElement = function(  )
	{
		var $action_xml = $( self.oXML );
		var target_id = '[ITEM]';
		var target = self.active_element;
		
		if( $action_xml.attr( 'target' ) )
		{
			target_id = $action_xml.attr( 'target' );
		}
		else if ( $action_xml.attr( 'id' ) )
		{
			target_id = $action_xml.attr( 'id' );
		}
		else if ( $action_xml.text() )
		{
			target_id = $action_xml.text();
		}
		
		if( target_id != "[ITEM]" )
		{
			if( self.active_element )
			{
				if( target_id.indexOf('[ITEM]')>-1 ) // if [ITEM] is part of target ID, split and join with active_element ID 
				{
					target_id = target_id.split( '[ITEM]' ).join(  self.active_element.id );
				}
			}
			target = self.screen_view.getScreenElementById( target_id );
		}
		/*
		if( ( !target ) && ( target_id != '[ITEM]' ) )
		{
			if ( devmode ) console.warn( 'WARN: EVENT TARGET NOT FOUND ' + target_id );
		}
		*/
		return target
	}
	
	this.performCheck = function( node )
	{
		//screenId="6_320" variable="completed" value="true" event="showComplete_1"
		
		var checkScreen = this.screen ;
		if( $(node).attr('screenId'))
		{
			var screenId = $(node).attr('screenId') ;
			checkScreen = masterObj.getScreenById(screenId) ;
		}
		
		var topicId = null ;
		if( $(node).attr('topicId'))
		{
			var topicId = $(node).attr('topicId') ;
			var checkTopic = masterObj.getTopicById(topicId) ;
		}
		
		var variable = $(node).attr('variable');
		var value = $(node).attr('value');
		var event = $(node).attr('event');		
		
		
		var variableToCheck ;
		if( topicId )
		{
			if( checkTopic )
			{
				variableToCheck = checkTopic[ variable ] ;
			}
		}
		else
		{
			if( checkScreen )
			{
				variableToCheck = checkScreen[ variable ] ;
			}
		}
		
		
		
		/*
		console.log("\n_______________________________________________PREFORM CHECK") ;
		console.log("          checkScreen: " + checkScreen ) ;
		console.log("          checkScreen.id: " + checkScreen.id ) ;
		console.log("          variable: " + variable ) ;
		console.log("          value: " + value ) ;
		console.log("          event: " + event ) ;
		console.log("          variableToCheck: " + variableToCheck ) ;
		*/
		if( String( variableToCheck ) == String( value ))
		{
			//console.log("          MATCHING!" ) ;
			this.screen_view.doEventById( event ) ;
		}
	}
}