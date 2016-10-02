function ScreenEvent(xml_node, scrn_view){
	var self = this ;
	self.screen_view = scrn_view;
	self.oXML = $(xml_node);
	self.id = this.oXML.attr("id");
	self.screensize = null
	self.enabled = true;
	if( self.oXML.attr("screensize") )
	{
		self.screensize = this.oXML.attr("screensize");
	}

	
	self.clickEvents;
	self.overEvents;
	self.outEvents;
	
	self.overFilter;
	self.outFilter;
	
	self.triggered = false ;
	
	self.maxTriggers = -1 ;
	self.totalTriggers = 0 ;
	
	this.setup = function()
	{
		if( self.oXML.attr("maxTriggers") )
		{
			self.maxTriggers = Number( self.oXML.attr("maxTriggers")) ;
		}
	
		var xmlnodes = this.oXML.children();
		
		for(var i = 0; i<xmlnodes.length; i++)
		{
			switch(xmlnodes[i].nodeName)
			{
				case "rollover": this.overEvents = this.createActions( $(xmlnodes[i]).children() );
					
					this.overFilter = $(xmlnodes[i]).attr( 'filters' );
					break;
				case "rollout": this.outEvents = this.createActions( $(xmlnodes[i]).children() );
					
					this.outFilter = $(xmlnodes[i]).attr( 'filters' );
					break;
				case "click": this.clickEvents = this.createActions( $(xmlnodes[i]).children() );
					break;
				default: this.clickEvents = this.createActions( this.oXML.children() );
					break;
			}
		}
	}
	
	self.disable = function()
	{
		self.enabled = false;
	}
	
	self.enable = function()
	{
		self.enabled = true;
	}
	
	this.createActions = function ( arr )
	{
		var new_arr = [];
		for( var i = 0; i<arr.length; i++ ) 
		{
			new_arr.push( new EventAction(arr[i], self.screen_view, self.id) )
		}
		
		return new_arr;
	}
	
	
	this.over = function(target)
	{
		if( self.enabled )
		{
			if(this.overEvents)
			{	
				for(var i = 0; i<this.overEvents.length; i++)
				{
					//this.doAction(this.overEvents[i]);
					this.overEvents[i].activate(target); 
				}
				if(this.overFilter)
				{
					target.view.applyFilters(this.overFilter);
				}
			}
		}
	}
	
	this.out = function(target)
	{
		if( self.enabled )
		{
			if(this.outEvents)
			{
			//console.log("out "+this.outEvents.length)
				for(var i = 0; i<this.outEvents.length; i++)
				{
					//this.doAction(this.outEvents[i]);
					this.outEvents[i].activate(target); 
				}	
				if(this.outFilter)
				{
					target.view.applyFilters(this.outFilter);
				}
			}
		}		
	}
	
	this.click = function(target)
	{		
	
		if( self.enabled )
		{
			if( self.totalTriggers < self.maxTriggers || self.maxTriggers == -1 )
			{
			
				self.totalTriggers++ ;
				if( self.clickEvents )
				{
					for(var i = 0; i<self.clickEvents.length; i++)
					{
						//this.doAction(this.clickEvents[i]);	
						this.clickEvents[i].activate(target); 
					}
				}
			}
			
			if( !self.triggered )
			{
				self.triggered = true ;
			}
		}
	}
	
	this.doAction = function(actn)
	{
		
	}
}