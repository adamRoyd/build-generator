function TriggerEvent(xml_node, scrn_obj){
	var self = this ;
	this.screen = scrn_obj;
	this.oXML = $(xml_node);
	this.id = this.oXML.attr("id");
	var eventIDArray = this.oXML.attr("events").split(',');	
	var eventsArray = [] ;
	var triggered = false; 
	self.retrigger = 1 ; // set to default to only trigger once
	
	this.setup = function()
	{
		eventsArray = this.createActions( this.oXML.children() );
		//if ( devmode ) console.log( 'Log RETRIGGER ' + this.oXML.attr('retrigger') )
		if(this.oXML.attr('retrigger'))
		{
			self.retrigger = Number(this.oXML.attr('retrigger'))
		}
	}
	
	this.createActions = function ( arr )
	{
		var new_arr = [];
		for( var i = 0; i<arr.length; i++ ) 
		{
			new_arr.push( new EventAction(arr[i], scrn_obj, self.id) )
		}		
		return new_arr;
	}
	
	this.allComplete = function()
	{
		var allComp = true ;		
		var eventAssArray = self.screen.assEvents ;
		
		for( var i=0; i < eventIDArray.length; i++ )
		{	
			if( !eventAssArray[ eventIDArray[ i ] ].triggered )
			{
				allComp = false ;
			}
		}		
		return allComp ;
	}
	
	this.activate = function(elm)
	{

		if( !triggered )
		{
			for(var i = 0; i<eventsArray.length; i++)
			{
				//this.doAction(this.clickEvents[i]);	
				var actn = eventsArray[i].oXML ;
				//console.log("EVENT ACTION TRIGGERED: " + actn.nodeName ) ;
				switch(actn.nodeName)
				{
					case "click":
						
					break ;
					
					default:
						eventsArray[i].activate(elm); 
					break;
				}
			}
			
			
			// currently only deals with single or infinite triggers 
			if( self.retrigger > 0)
			{
				triggered = true ;
			}
		}

	}	
	
	this.containsEvent = function( eventId )
	{
		var hasEvent = false ;
		
		for(var i = 0; i < eventIDArray.length; i++)
		{
			//console.log("              Check trigger events - looking for id: " + eventId + " : Found : " + eventIDArray[ i ] ) ;
		
			if( eventIDArray[ i ] == eventId )
			{
				hasEvent = true ;
			}
		}
		
		return hasEvent ;
	}
}