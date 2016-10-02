/**
* @author Andy Galletly
*/
function DialogueScreen(xml_node) 
{
	var self = this ;
	Screen.call(self, xml_node);

	self.type = "dialogue";
	
	if(!self.screentype)
	{
		self.screentype = 'text_graphic';
	}
		
	self.closebutton = Boolean( self.oXML.attr("closebtn") != "false" );
	
	self.height = self.oXML.attr("height");
	self.width = self.oXML.attr("width");
	self.x = '50%';
	
	
	
	self.y = self.oXML.attr("y");
	if( !self.oXML.attr("y") )
	{
		self.y = ( 644/2)  - (self.height/2);
	}
	
	self.closeX = null ;
	if( self.oXML.attr("closeX"))
	{
		self.closeX = parseInt( self.oXML.attr("closeX"));
	}
	
	self.closeY = null ;
	if( self.oXML.attr("closeY"))
	{
		self.closeY = parseInt( self.oXML.attr("closeY"));
	}
		
	self.oTarget;
	
	self.super_loadXML = self.loadXML;
	self.loadXML = function()
	{
		if( !$( self.oXML ).attr( 'xml' ) )
		{
			var xml_data = self.oXML;
			self.xmlReady( xml_data );
		}
		else
		{
			self.super_loadXML();
		}
	}
}

DialogueScreen.prototype = Screen;