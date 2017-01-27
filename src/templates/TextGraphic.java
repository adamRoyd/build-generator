package templates;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import main.XMLEditor;

public class TextGraphic extends XMLEditor{

	Document doc;
	String screenContent;
	
	public TextGraphic(Document doc, String screenContent){
		super(doc,screenContent);
		this.doc = doc;
		this.screenContent = screenContent;
	}

	public Document editXML(){
	
		editIntroText();

		editImagePath(doc.getElementsByTagName("image").item(0),"","jpg");

		checkImageAsset("");
		
		return doc;
	}

	private void editIntroText(){

		String introText = getHeadingContent("BODY TEXT");
		String prompt = getHeadingContent("PROMPT");

		prompt = addClass(prompt,"prompt");
		introText = introText + prompt;

		Node text = getNodeById("text", "screentext");
		replaceText(text,introText,"screentext");		
	}

	
}
