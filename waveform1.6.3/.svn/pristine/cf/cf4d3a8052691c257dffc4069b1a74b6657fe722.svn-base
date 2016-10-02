/**
* @author Andy Galletly
*/
function TopicScreen(xml_node, topic_obj) 
{
	var self = this ;
	Screen.call(self, xml_node);
	
	self.navspeed = 0.6;
	
	self.type = "topic"
	
	self.topic = topic_obj;
	
	self.topicId = self.topic.id;
	
	self.resourcesID = null;
	
	if( self.oXML.attr( "resourcesid" ) )
	{
		self.resourcesID = self.oXML.attr( "resourcesid" );
	}
	if( self.oXML.attr( "topicref" ) )
	{
		self.topicref = self.oXML.attr( "topicref" );
	}

	self.nextDir = self.oXML.attr( "nextDir" );
	
	self.classname = self.oXML.attr( "class" );
	
	if( !self.nextDir )
	{
		self.nextDir = "next" ;
	}
	
	self.bNextLocked = false;

	if(self.oXML.attr("n"))
	{
		self.bNextLocked = Boolean( self.oXML.attr( 'n' ) == '0' );
	}
	
	self.bBackLocked = false;
	if(self.oXML.attr("b"))
	{
		self.bBackLocked = Boolean( self.oXML.attr( 'b' ) == '0' );
	}
	
	self.nextRef = self.oXML.attr( "nref" );
	self.backRef = self.oXML.attr( "bref" );
	

	self.super_screenCompleted = self.screenCompleted;
	self.screenCompleted = function()
	{
		self.super_screenCompleted();
		self.topic.updateStatus();
	}
	
	self.show = function( nav_direction )
	{
		console.trace("TOPIC SCREEN SHOW CALLED") ;
		var $holder_div = self.view.oHolder
		if( $holder_div )
		{
			tweenTo( $holder_div , 0, { autoAlpha:1 , display:'block' } );
			switch( nav_direction )
			{
				case 'next': 
					tweenTo($holder_div, 0, { x: 1014, y: 0 } );
					tweenTo($holder_div, self.navspeed, { x: 0, y: 0, onComplete: self.showing } );
					break;
				case 'back': 
					tweenTo($holder_div, 0, { x: -1014, y: 0 } );
					tweenTo($holder_div, self.navspeed, { x: 0, y: 0, onComplete: self.showing } );
					break;
				case 'phonemenu': 
				case 'menu': 
					self.leave( nav_direction );
					break;
				case 'default':
					tweenTo( $holder_div, 0, { x: 0, y: 450, autoAlpha:0 } );
					tweenTo( $holder_div , self.navspeed, { y: 0, autoAlpha:1 , display:'block' , onComplete: self.showing} );
					break;
				case 'phone':
				default: 
					tweenTo( $holder_div, 0, { x: 0, y: 0, autoAlpha:0 } );
					tweenTo( $holder_div , 0, { autoAlpha:1 , display:'block' , onComplete: self.showing} );
					break;
			}
		}
	}
	
	self.leave = function( nav_direction )
	{
		var $holder_div = self.view.oHolder
		if( $holder_div )
		{
			switch( nav_direction )
			{
				case 'next': 
					tweenTo($holder_div, self.navspeed, { x: -1014, y: 0, onComplete: self.view.removeScreen } );
					break;
				case 'back': 
					tweenTo($holder_div, self.navspeed, { x: 1014, y: 0, onComplete: self.view.removeScreen } );
					break;
				case 'menu': 
					tweenTo($holder_div, self.navspeed, { y: 644, onComplete: self.view.removeScreen } );
					break;
				case 'phonemenu':
				case 'phone':
				default: 
					tweenTo( $holder_div ,0, { autoAlpha:0 , display:'none', onComplete: self.view.removeScreen } );
					break;
			}
		}
		
		currentScreen.dispatcher.unbind( 'ready_to_leave' );
	}
	
	/* =============== GET + SET ================= */
	
	self.super_setAnswered = self.setAnswered;
	self.setAnswered = function( _val )
	{
		self.super_setAnswered( _val );
	}
	
	
}
TopicScreen.prototype = Screen;