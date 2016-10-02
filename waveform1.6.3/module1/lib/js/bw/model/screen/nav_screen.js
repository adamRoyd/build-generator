/**
* @author Andy Galletly
*/
function NavScreen(xml_node) 
{
	var self = this ;
	Screen.call(self, xml_node);
	self.type = "navigation";
	
	self.navModel ;
	
	self.menuBtn ;
	self.exitBtn ;
	self.helpBtn ;
	self.resourcesBtn ;
	
	self.nextBtn ;
	self.backBtn ;
	
	self.navHolder ;
	
	self.dispatcher = $(document.createElement('div'));	
	self.dispatcher.attr('id', ('dispatcher_' + self.id ));
	
	self.setNavModel = function( nav )
	{
		self.navModel = nav ;
	}
	
	self.base_screenSetupComplete = self.screenSetupComplete   ;
	self.screenSetupComplete  = function()
	{	
		self.base_screenSetupComplete ()
		tweenTo(self.view.oHolder, 0, {autoAlpha:100, display:'block'})
		self.showing();
		self.setupInitialButtons() ;
		//self.initNav();
		self.dispatcher.trigger( 'navigationSetupComplete' ) ; 
	}
	
	
	self.positionNavAtHome = function()
	{
		//TweenMax.to( self.navHolder.getDiv(), 0.5, {left: '0%', top: '0%', ease:Back.easeOut }) ;
	}
	
 	self.setupInitialButtons = function()
	{	
		self.menuBtn = self.view.getScreenElementById( 'menuBtn' );
		self.nextBtn = self.view.getScreenElementById( 'nextBtn' );
		self.backBtn = self.view.getScreenElementById( 'backBtn' );
		
		
		self.disableDirectionalNav() ;
	} 
	
	
	self.initNav = function()
	{
		self.setupInitialButtons() ;
		
		if( currentScreen )
		{
			if( masterObj.bHasMenu )
			{
				self.enableMenuBtn();
			}
			self.showBack();
			self.showNext();
			TweenMax.delayedCall( 0, function(){ navObj.showTopicTitle(currentTopic.sLabel) } );
		}
		
	}
	
	self.showBack = function()
	{
		if( currentScreen )
		{
			if( allowEnableBack() || currentScreen.checkOverrideBack() )
			{
				self.enableBtn(self.backBtn.getDiv() );			
			}
			else
			{
				self.disableBtn(self.backBtn.getDiv() );
			}
		}
	}
	
	self.showNext = function()
	{
		if( currentScreen )
		{
			if( allowEnableNext() || currentScreen.checkOverrideNext())
			{
				self.enableBtn(self.nextBtn.getDiv() );	
			}
			else
			{
				self.disableBtn(self.nextBtn.getDiv() );
			}
		}
	}
	
	self.disableDirectionalNav = function()
	{
		self.disableBtn( self.menuBtn.getDiv() ) ;		
		self.disableBtn( self.nextBtn.getDiv() ) ;
		self.disableBtn( self.backBtn.getDiv() ) ;
	}
	
	self.enableMenuBtn = function()
	{
		self.menuBtn = self.view.getScreenElementById( 'menuBtn' );
		self.enableBtn( self.menuBtn.getDiv() ) ;
	}
	
	self.disableBtn = function(btn)
	{
		disableElement(btn);
		//tweenTo(btn, 0.2, {autoAlpha:0, display:'block'});
	};
	
	self.enableBtn = function(btn)
	{
		enableElement(btn);
		//tweenTo(btn, 0.3, {autoAlpha:1, display:'block'});
	};
	
}
NavScreen.prototype = Screen;