/**
* @author Andy Galletly
*/
function SubScreen(xml_node) 
{
	var self = this ;
	Screen.call(self, xml_node);
	
	self.type = "sub";
	if(!self.screentype)
	{
		self.screentype = 'text_graphic';
	}
	
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
	
	self.super_screenSetupComplete = self.screenSetupComplete;
	self.screenSetupComplete = function()
	{
		self.super_screenSetupComplete();
		self.show();
	}
}
SubScreen.prototype = Screen;