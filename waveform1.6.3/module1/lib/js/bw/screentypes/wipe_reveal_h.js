	
function wipe_reveal_h(s)
{
	var self = self
	self.screen 				= s;
	self.oXML 					= null;

	// elements
	self.oDiv;
	self.currentWipe;
	
	
	// object arrays
	self.wipeArray 		= [];

	
	// settings
//wipetween="true" wipetweentime="0.5" bgcolour="0xEE3324" rocolour="0xF6F4F5" selcolour="0xF6F4F5" txtrocolour="0x000000" txtselcolour="0x000000"
	self.wipetween="true";
	self.wipetweentime="0.5";
	
	self.bgcolour="0xEE3324";
	self.rocolour="0xF6F4F5";
	self.selcolour="0xF6F4F5";
	self.txtrocolour="0x000000";
	self.txtselcolour="0x000000";
	
	self.custom = function(model){
		// console.log("screentype wipe_reveal_h.js custom()");
		
		
		self.oModel = model;
		self.oXML = self.oModel.oXML;
		self.oDiv = self.oModel.view.oDiv;
		
		self.width = $(self.oXML).attr('width');
		
		
		for ( var i = 0; i < $(self.oXML).children().length; i++)
		{
			var xml_node = $(self.oXML).children() [ i ] ;
			var next_xml_node = $(self.oXML).children() [ i+1 ] ;
			
			switch ( xml_node.nodeName )
			{
				case "settings": 	self.createSettings( $( xml_node ) ) ;
					break;
				
				case "click": var id = self.wipeArray.length + 1;
					var oWipe = new self.createWipe( id, $( xml_node ), $( next_xml_node ), self );
					self.wipeArray.push( oWipe );
					i++;
					break;
			}
		}
	}
	
	self.screenElementsReady = function()
	{
		self.attachContents();
		self.selectWipe(1);
		// console.log("screentype wipe_reveal_h.js screenElementsReady()");
	}

	self.selectWipe = function(wipe_id)
	{
		// console.log("SELECT WIPE "+wipe_id)
		
		self.currentWipe = self.getWipeById(wipe_id)
		
		for(var i = 0; i <  self.wipeArray.length; i++)
		{
			var oWipe = self.wipeArray[ i ];
			if( oWipe == self.currentWipe )
			{
				self.openWipe( oWipe );
			}
			else
			{
				self.closeWipe( oWipe );
			}
		}
		
	}
	
	self.openWipe = function (oWipe)
	{
		var targ_height = self.oDiv.height() - ( 40 * self.wipeArray.length );
		disableElement( oWipe.clickDiv )
		
		tweenTo( oWipe.clicktext, 0.2, {color: self.txtselcolour })
		tweenTo( oWipe.clickDiv, 0.2, {css:{ backgroundColor: self.selcolour } } );
		tweenTo( oWipe.revealDiv, self.wipetweentime, { css: { 'height': targ_height } } );
	}
	self.closeWipe = function (oWipe)
	{
		enableElement( oWipe.clickDiv )
		tweenTo( oWipe.clicktext, 0.2, {color: "#FFFFFF" })
		tweenTo( oWipe.clickDiv, 0.2, {css:{ backgroundColor: self.bgcolour } } );
		tweenTo( oWipe.revealDiv, self.wipetweentime, { css: { 'height': 0 } } );
	}
	
	self.createSettings = function( settings_xml )
	{
		self.wipetween 		= Boolean( settings_xml.attr( "wipetween" ) == "true" );
		self.wipetweentime 	= Number( settings_xml.attr( "wipetweentime" ) );
		
		self.bgcolour 		= tidyColour( settings_xml.attr( 'bgcolour' ) ) ;
		self.rocolour 		= tidyColour( settings_xml.attr( 'rocolour' ) ) ;
		self.selcolour 		= tidyColour( settings_xml.attr( 'selcolour' ) ) ;
		self.txtrocolour 	= tidyColour( settings_xml.attr( 'txtrocolour' ) ) ;
		self.txtselcolour 	= tidyColour( settings_xml.attr( 'txtselcolour' ) ) ;
	}
	
	self.createWipe = function( id, click_node, reveal_node, oCustom )
	{
		// console.log("CREATE WIPE "+self.id+" "+reveal_node.attr("id"))
		var wipe = this;
		wipe.id = id;
		wipe.clicktext = $( click_node.text() );
		
		wipe.wipeDiv = $('<div class="wipeh" id="' + self.screen.id + '_wipeh_' + wipe.id + '"></div>');
		
		wipe.clickDiv = $('<div class="wipeh_click" id="' + self.screen.id + '_wipeh_click_' + wipe.id + '"></div>');
		
		
		wipe.revealID = self.screen.id + '_wipeh_reveal_' + wipe.id
		
		wipe.revealDiv = $('<div class="wipeh_content" id="' + wipe.revealID + '"></div>');
	
		wipe.clickDiv.append( wipe.clicktext );
	
		wipe.wipeDiv.append( wipe.clickDiv );
		wipe.wipeDiv.append( wipe.revealDiv );
	
		self.oDiv.append( wipe.wipeDiv );
		
		var revealchildren = reveal_node.children();
		for( var i = 0; i < revealchildren.length; i++ )
		{
			var node = $( revealchildren[ i ] );
			
			// console.log( "set target " + self.revealID )
			
			node.attr( 'target', self.revealID );
			if( !node.attr( 'id' ) )
			{
				node.attr( 'id', 'wipeh_reveal_' + self.id + '_item' + i );
			}
		}
		
		wipe.reveal_node = reveal_node

	}
	
	self.attachContents = function()
	{
	
		for( var i = 0; i < self.wipeArray.length; i++ )
		{
			var oWipe = self.wipeArray[ i ];
			
			oWipe.clickDiv.css( 'background-color', self.bgcolour );
			
			oWipe.clickDiv.oCustom = self;
			oWipe.clickDiv.oWipe = oWipe;
			
			//oWipe.revealDiv.css( 'top', oWipe.clickDiv.height() );
			
			applyClick(
				oWipe.clickDiv,
				
				function () {
					var elm = $( self ).data( 'elm' );
					elm.oCustom.selectWipe( elm.oWipe.id );
				},
				
				function () {
					var elm = $( self ).data( 'elm' );
					var oWipe = elm.oWipe;
					
					tweenTo(oWipe.clicktext, 0.2, {color: elm.oCustom.txtrocolour })
					tweenTo(elm, 0.2, {css:{ backgroundColor: elm.oCustom.rocolour } } );
				},
				
				function () {
					var elm = $( self ).data( 'elm' );
					var oWipe = elm.oWipe;
					
					tweenTo(oWipe.clicktext, 0.2, {color: "#FFFFFF" })
					tweenTo(elm, 0.2, {css:{ backgroundColor: elm.oCustom.bgcolour } } );
				}
			);
			
			self.screen.view.createScreenElements(oWipe.reveal_node);
		}
	}
	
	self.getWipeById = function( id )
	{
		var rtn = getItemById( id, self.wipeArray );
			
		return rtn;
	}
	
	
}
