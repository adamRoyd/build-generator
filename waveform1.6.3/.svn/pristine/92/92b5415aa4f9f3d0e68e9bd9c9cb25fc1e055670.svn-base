/**
* @author Andy Galletly
*/
function SubDialogue(xml_node, screen_element) 
{
	var self = this ;
	DialogueScreen.call(self, xml_node);
	
	self.type = "sub_dialogue";
	
	self.hide = function()
	{
		screen_element.hide();
	}
	
}
SubDialogue.prototype = DialogueScreen;