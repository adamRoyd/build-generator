function SequenceEvent(xml_node, scrn_view){
	var self = this ;
	self.screen_view = scrn_view;
	self.oXML = $(xml_node);
	self.id = this.oXML.attr("id");
	
	self.clickEvents;
	
	self.triggered = false ;
	
	self.maxTriggers = -1 ;
	self.totalTriggers = 0 ;
	self.final_event;
	self.current_event_count = 0;
	
	this.setup = function()
	{
		if( this.oXML.attr("maxTriggers") )
		{
			self.maxTriggers = Number( this.oXML.attr("maxTriggers")) ;
		}
		if( this.oXML.attr("final") )
		{
			self.final_event = this.oXML.attr("final") ;
		}
	
		var xmlnodes = this.oXML.children();
		
		for(var i = 0; i<xmlnodes.length; i++)
		{
			switch(xmlnodes[i].nodeName)
			{
				case "click": this.clickEvents = this.createActions( $(xmlnodes[i]).children() );
					break;
				default: this.clickEvents = this.createActions( this.oXML.children() );
					break;
			}
		}
	}
	
	this.createActions = function ( arr )
	{
		var new_arr = [];
		for( var i = 0; i<arr.length; i++ ) 
		{
			new_arr.push( new EventAction(arr[i], self.screen_view, self.id) )
		}
		
		// new_arr = shuffleArray( new_arr );
		
		return new_arr;
	}
	
	this.click = function(target)
	{
		// if ( devmode ) console.log( 'Log SEQUENCE ' + self.current_event_count )
		if( self.current_event_count< this.clickEvents.length )
		{
			var current_event = this.clickEvents[ self.current_event_count ]
			// if ( devmode ) console.log( 'Log SEQUENCE %o', current_event  )
			current_event.activate( target ); 
			self.current_event_count ++;
		}
		else
		{
			// if ( devmode ) console.log( 'Log SEQUENCE EVENT ' + self.final_event )
			self.screen_view.doClickById( self.final_event );
			self.current_event_count = 0;
			// self.clickEvents = shuffleArray( self.clickEvents );
		}
	}
	
}