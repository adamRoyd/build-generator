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
		
		//editQuoteText();
		
		editImagePath("image1","");

		checkImageAsset("");
		
		return doc;
	}
	
	private void editQuoteText() {

		String quoteText = getHeadingContent("QUOTE TEXT");
		Node quote = getNodeById("text","quoteText");
		replaceText(quote,doc.createCDATASection(quoteText));		
	}


	private void editIntroText(){
		
		String title = getHeadingContent("TITLE");
		String introText = getHeadingContent("BODY TEXT");
		String prompt = getHeadingContent("PROMPT");
		title = addClass(title, "title");
		prompt = addClass(prompt,"prompt");
		introText = title + introText + prompt;

		Node text = getNodeById("text", "screentext");
		CDATASection cdata = doc.createCDATASection(introText);
		replaceText(text,cdata);		
	}

	
}
