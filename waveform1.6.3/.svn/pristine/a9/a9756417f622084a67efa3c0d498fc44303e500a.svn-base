/**
* Navigation v0.1
* @author Andy Galletly
*/
function Nav()
{
	var self = this ;
	self.oHolder = $('#navholder');
	self.courseHolder = $('#courseholder');
	self.oMaster = masterObj;
	
	self.nextBtn = null;
	self.backBtn = null;
	self.menuBtn = null;
    
	self.navDir = "menu";
	
	self.courseTitle_div = null;
	self.courseTitle = null;
	self.topicTitle_div = null;
	self.topicTitle = null;
	self.loadergraphic = null;
	self.loadbarcontainer = null;
	self.loadbar = null;
	
	//self.pagecounter = null;
	
	self.navButtonsArray = [] ;
	
	self.navScreen ;
	
	self.createNav = function()
	{		
		//self.createLoader() ;
		self.loadNavScreen() ;
	};
	
	self.loadNavScreen = function()
	{		
		self.navScreen = masterObj.getNavById( "navscreen" ) ;
		
		self.navScreen.setNavModel( self ) ;
		self.navScreen.initScreen($('#navholder'));
		
		self.navScreen.dispatcher.bind( 'navigationSetupComplete', self.navScreenSetupComplete  ) ;
	}
	
	self.navScreenSetupComplete = function()
	{
		
	//	self.createPageCounter() ;
		tweenTo(self.oHolder, 0, {autoAlpha:1, display:'block'});
		//self.createLoader() ;
	}
	// --------------------------------------  L O A D E R -------------------------------------- //
	
	self.createLoader = function()
	{
		// loader graphic
		self.loadergraphic = $( '<div id="preloader"><img src="lib/images/ui/_circle_loader.gif" /></div>' );
		self.loadbarcontainer = $( '<div id="loadbarcontainer"></div>' );
		self.loadbar = $( '<div id="loadbar"></div>' );
		tweenTo(self.loadergraphic, 0, {autoAlpha:0, display:'block'});
		self.loadergraphic.append(self.loadbarcontainer);
		self.loadbarcontainer.append(self.loadbar);
		self.oHolder.append(self.loadergraphic);
	};
	
	
	
	// --------------------------------------  P A G E   C O U N T E R -------------------------------------- //
	
	// self.createPageCounter = function()
	// {		
		// self.pagecounter = new Pagecounter();
		
		
		// self.navScreen.view.oHolder.append(self.pagecounter.view);	
		
	// };
	
	// --------------------------------------  C O U R S E / T O P I C    T I T L E S -------------------------------------- //

	
	self.showTopicTitle = function()
	{	
		if( currentTopic ) 
		{			
			$('.ui_topic_title').empty().append(currentTopic.sLongLabel);
			
		}				
	};
	

	
	// --------------------------------------  N E X T / B A C K   B U T T O N S -------------------------------------- //
	
	self.disableBackNext = function()
	{
		self.navScreen.disableDirectionalNav() ;	
	};
	
	self.initNav = function()
	{
			if ( devmode ) console.trace( 'INIT NAV' );
		if( currentScreen )
		{
			currentTopic = currentScreen.topic;
			self.courseHolder.attr('class','');
			self.courseHolder.addClass( 'in-topic' );
			self.courseHolder.addClass( 'topic' + currentTopic.id );

			self.navScreen.initNav() ;
			self.navScreen.doClickById( 'in_topic' );
		}
	};
	
	self.inMenu = function(  )
	{
		self.navScreen.doClickById( 'in_menu' );
	}
	self.inTopic = function(  )
	{
		self.navScreen.doClickById( 'in_topic' );
	}
	
	
	self.nextButtonPressed = function()
	{
		if( currentScreen.checkOverrideNext() )
		{
			currentScreen.overrideNext() ;
		}
		else
		{
			if(!navObj.navigating)
			{
				self.navigating = true;
				self.navDir = 'next';
				goNext();
			}
		}
	};
	
	self.backButtonPressed  = function()
	{
		if( currentScreen.checkOverrideBack() )
		{
			currentScreen.overrideBack() ;
		}
		else
		{
			
			if(!navObj.navigating)
			{
				self.navigating = true;
				self.navDir = 'back';
				goBack();
			}
		}
	};

	// --------------------------------------  S H O W / H I D E   N A V -------------------------------------- //
	
	self.showNext = function()
	{
		self.navScreen.showNext()
	}
	self.showBack = function()
	{
		self.navScreen.showBack()
	}
	
	
	self.showNav = function()
	{
		tweenTo(self.oHolder, 0.3, {autoAlpha:1, display:'block'});
	};
	
	self.hideNav = function()
	{
		self.disableBackNext();
	//	self.pagecounter.hide();
	};
	
	self.showContent = function()
	{
	
		if(currentScreen)
		{
			//tweenTo($('#contentholder'), 0.5, {autoAlpha:1, display:'block'});

			self.animateScreenIntview();


		}
		
	};
	
	self.hideContent = function()
	{
		self.courseHolder.attr('class','');
		tweenTo( $('#contentholder'), 0.3, { autoAlpha:0, display:'none', onComplete:function(){ $('#contentholder').empty(); } } );
	};
	
	self.animateScreenIntview = function()
	{	
		var holderdiv = currentScreen.view.oHolder;
		// if( previousScreen )
		// {
			// self.removePreviousScreen();
		// }
		
		var previousHolderdiv = null;
		
		
		if( !previousScreen )
		{
			navObj.navDir = "default";
		}
		
		if( _respondo.phone() )
		{
			if( navObj.navDir != 'menu' )
			{
				navObj.navDir = "phone";
			}
			else
			{
				navObj.navDir = "phonemenu";
			}
			
			tweenTo(window, 0.2, {scrollTo:{y:0, x:0}, ease:Power4.easeOut});
		}
		
		currentScreen.dispatcher.bind('showing', self.newScreenInView );
		currentScreen.show( navObj.navDir );
		if( previousScreen )
		{
			previousScreen.leave( navObj.navDir )
		}
		
		self.showTopicTitle();
		
		self.navScreen.doClickById('update');

	};
		
	self.removePreviousScreen = function()
	{
		previousScreen.view.removeScreen();
	};

	self.newScreenInView = function()
	{
		navObj.navigating = false;
		self.initNav()
	}
	
	// --------------------------------------  D I A L O G U E   H A N D L I N G  -------------------------------------- //
	
	self.showDialogueWindow = function()
	{
		$('#courseholder').addClass( 'dialogueOpen' );
		$('#dialogueholder').width(currentDialogue.width);
		$('#dialogueholder').height(currentDialogue.height);

		tweenTo($('#dialoguemask'), 0, {autoAlpha:0});		
		tweenTo($('#dialoguemask'), 0.5, {autoAlpha:1, display:'block'});

		if( _respondo.desktop() )
		{
			tweenTo($('#dialogueholder'), 0, {autoAlpha:0, left: currentDialogue.x, marginLeft: 0 - (currentDialogue.width/2) , top: '50%', marginTop: 0 - (currentDialogue.height/2) });
			tweenTo($('#dialogueholder'), 0.5, {autoAlpha:1, display:'block' });
		}
		else
		{
			tweenTo($('#dialogueholder'), 0, {autoAlpha:0 });
			tweenTo($('#dialogueholder'), 0.3, {autoAlpha:1,display:'block' });
		}
	};
	
	self.initDialogueWindow = function()
	{
	
		$('#dialogueholder').css('z-index', 100);
		tweenTo($('#dialogueholder'), 0, {autoAlpha:1});
		tweenTo(currentDialogue.view.oHolder, 0, {autoAlpha:1 , onComplete: currentDialogue.view.ready});

		if(currentDialogue.closebutton)
		{
			var closeBtn = $( '<div class="dialogueCloseBtn"></div>' );
			closeBtn.css('position', 'absolute');
			
			if( !isNaN( currentDialogue.closeX ))
			{
				closeBtn.css('left', currentDialogue.closeX);
			}
			else
			{
				closeBtn.css('right', '10px');
			}
			
			if( !isNaN( currentDialogue.closeY ))
			{
				closeBtn.css('top', currentDialogue.closeY);
			}
			else
			{
				closeBtn.css('top', '10px');
			}
			
			closeBtn.append( getVarText( "dialogue_close_label" ));						
			$('#dialogueholder').append(closeBtn);
				
			applyClick
			(
				closeBtn,
			
				function()
				{
					closeDialogue();
				}
			);			
		}		
	};
	
	self.closeDialogue = function()
	{
		if( currentDialogue )
		{
			currentDialogue.kill();
				
			tweenTo($('#dialoguemask'), 0.3, {autoAlpha:0});
			
			if( _respondo.desktop() )
			{
				tweenTo($('#dialogueholder'), 0.3, {autoAlpha:0, display:'none', onComplete:function()
					{
						$('#dialogueholder').empty();
					}
				});
			}
			else
			{
				tweenTo($('#dialogueholder'), 0, {autoAlpha:1, display:'block'});
				tweenTo($('#dialogueholder'), 0.2, {autoAlpha:0, display:'none', onComplete:function()
					{
						$('#dialogueholder').empty();
					}
				});
			}
			currentDialogue = null;
		}
		$('#courseholder').removeClass( 'dialogueOpen' );
		
		if( currentScreen )
		{
			currentScreen.enable();
		}
		else
		{
			if ( devmode ) console.warn( 'WARN: NO CURRENT SCREEN' );
		}
	};
	
}