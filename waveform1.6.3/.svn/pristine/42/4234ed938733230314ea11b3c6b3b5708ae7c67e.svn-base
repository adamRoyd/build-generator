/**
* Menu v0.1
* @author Andy Galletly
*/
function Menu()
{
	// if ( devmode ) console.log("menu.js Menu() ");
	this.oMenuScreen = null;
	this.oHolder = $('#menuholder');
	
	this.oCourse = masterObj;
	this.oCurrentTopic;
	this.oCurrentScreen;
	
	var self = this ;
	
	this.createUI = function()
	{	
		// if ( devmode ) console.log("menu.js createUI :course has menu:"+this.oCourse.bHasMenu)	
		if(this.oCourse.bHasMenu)
		{
			this.oMenuScreen = $('#menuScreen');
			this.createMenu();
		}
		else
		{
			menuReady();
		}
	}
	
	this.createMenu = function()
	{

		loadMenuScreen();
		
	}
	
	this.updateTopicButtonStatus = function()
	{
		for(var i = 0; i<this.oCourse.arTopics.length; i++)
		{
			//if ( devmode ) console.log("UPDATE TOPIC " + i + " STATUS: " + this.oCourse.arTopics[i] ) ;
		
			var topic = this.oCourse.arTopics[i];
			
			var btn = topic.menu_button
			var status = topic.status_div
			
			
			if(status)
			{
				status.attr("class", "topicStatus " + topic.getStatus() );
			//status.css("top", ( btn.outerHeight( true ) / 2 ) - 10 );
			}
			
		}
	}
	
	

	this.disableMenuButtons = function(){
	
		if (masterObj.bDevUnlockMode) {
			// sd - allow access to all topics in dev mode
			return;
		}
		
		for(var i = 0; i<this.oCourse.arTopics.length; i++)
		{
		
			var topic = this.oCourse.arTopics[i];
			
			var btn = topic.menu_button;
			
			if(btn)
			{
				disableElement(btn)
			}
		}
		
		this.oMenuScreen.disable();
	}

	this.enableMenuButtons = function(){
	
		var prev_topics_completed = true;
		
		for(var i = 0; i<this.oCourse.arTopics.length; i++)
		{
			// dont enable if locked			
			var topic = this.oCourse.arTopics[i];	
			topic.updateStatus();
			var btn = topic.menu_button;
			
			// sd - don't automatically unlock the first topic - if it's locked the design will require it to be unlocked in an alternative way - i.e. completing a video etc.
			if( topic.locked && prev_topics_completed && i>0 )
			{
				topic.locked = false;
			}
			
			if(btn && ( !topic.locked ) )
			{
				enableElement(btn)
			}			
			
			if( topic.getStatus() != "completed" )
			{
				prev_topics_completed = false;
			}
		}		
		
		this.updateTopicButtonStatus();
		
		this.removeZIndexes($('#menuscreen'));
			
		this.oMenuScreen.enable();		
	}
	
	this.unlockFirstTopic = function(){	
		var topic = this.oCourse.arTopics[0];
		var btn = topic.menu_button;
		topic.locked = false;
		this.enableMenuButtons();
		updateTracking();
	}
	
	this.removeZIndexes = function(element)
	{
		$(element).css("z-index", '');
		
		var child_elements = $(element).children();
		
		for(var i = 0; i<child_elements.length; i++)
		{
			var child = child_elements[ i ];
			this.removeZIndexes(child)
		}
		
	}
	
	this.registerMenuButton = function( screenElement )
	{
		
		var topic_btn_div = screenElement.getDiv();
		
		var topic_id = screenElement.topicId;
		
		var topic = masterObj.getTopicById( topic_id );
		
		var topic_status_div = $(document.createElement('div'));
		topic_status_div.attr( "class", "topicStatus "+topic.getStatus() );
		topic_btn_div.append( topic_status_div )
		
		
		topic.menu_button = topic_btn_div;
		
		topic.status_div = topic_status_div;
		
		topic.menu_button.data('topic_id', topic_id);
		
		topic_status_div.css( "left", screenElement.status_x );
		topic_status_div.css( "top", screenElement.status_y );


		topic_btn_div.data('oy', topic_btn_div.oModel.y ) // topic_btn_div.position().top
		topic_btn_div.addClass('menuTopicBtn');
		applyClick(
			topic_btn_div, 
			function()
			{
				self.pressMenuButton( this ) ;
				
			}
		) 
	
		//disableElement(topic_btn_div)	
		
	}
	
	this.pressMenuButton = function( btn )
	{
		var elm = $(btn).data('elm')
		loadTopic( elm.data('topic_id') );
		//self.outMenuButton( btn ) ;
	}
	
	
	
	this.hideMenu = function()
	{
		if(this.oCourse.bHasMenu)
		{
			if( this.oMenuScreen.length )
			{
				this.oMenuScreen.disable();
			}
			this.disableMenuButtons();
			
			if( _respondo.desktop() )
			{
				tweenTo(this.oHolder, 0.2, {autoAlpha:0, display:'none'});
				tweenTo( $( '#contentholder' ), 0.2, {autoAlpha:1, display:'block'});
			}
			else
			{
				tweenTo( $( '#contentholder' ), 0, {y:0});
				tweenTo( this.oHolder, 0, {y:0});
				tweenTo(this.oHolder, 0.3, {autoAlpha:0, y:0, display:'none'});
				tweenTo( $( '#contentholder' ), 0.3, {autoAlpha:1, y:0, display:'block'});
			}
		}
	}
	
	
	this.showMenu = function()
	{
		if(this.oCourse.bHasMenu)
		{
			this.oMenuScreen.enable();
			this.enableMenuButtons();
			
			
			
			self.oMenuScreen.view.doEventById("showMenu") ;
			
			if( _respondo.desktop() )
			{
				tweenTo(this.oHolder, 0.2, {autoAlpha:1, display: 'block'})
				tweenTo( $( '#contentholder' ), 0.2, {autoAlpha:0, display:'none'});
			}
			else
			{
				tweenTo( $( '#contentholder' ), 0, {y:0});
				tweenTo( this.oHolder, 0, {y:0});
				tweenTo(this.oHolder, 0.3, {autoAlpha:1, y:0, display: 'block' })
				tweenTo( $( '#contentholder' ), 0.3, {autoAlpha:0, y:0, display:'none'});
			}
		}
		//navObj.enableUIButtons();
		
		
	}
	
}



