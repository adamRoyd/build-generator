package templates;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import main.XMLEditor;

public class MCQ_Graphical extends XMLEditor{

	Document doc;
	String screenContent;
	
	public MCQ_Graphical(Document doc, String screenContent){
		super(doc,screenContent);
		this.doc = doc;
		this.screenContent = screenContent;
	}

	public Document editXML(){
	
		editIntroText();
		
		editFeedbacks();

		//editImagePath(doc.getElementsByTagName("image").item(0),"","jpg");

		//checkImageAsset("");
		
		return doc;
	}

	private void editIntroText(){

		String introText = getHeadingContent("QUESTION TEXT");
		String prompt = getHeadingContent("PROMPT");

		prompt = addClass(prompt,"prompt");
		introText = introText + prompt;

		Node text = getNodeById("text", "screentext");
		CDATASection cdata = doc.createCDATASection(introText);
		replaceText(text,cdata);		
	}
	
	protected void editFeedbacks(){

		CDATASection pass = doc.createCDATASection(getHeadingContent("CORRECT TEXT"));
		CDATASection partial = doc.createCDATASection(getHeadingContent("PARTIAL TEXT"));
		CDATASection fail = doc.createCDATASection(getHeadingContent("FAIL TEXT"));
		
		Node passNode = getNodeById("text", "feedback_pass");
		Node partialNode = getNodeById("text", "feedback_partial");
		Node failNode = getNodeById("text", "feedback_fail");		
		
		replaceText(passNode,pass);
		replaceText(partialNode,partial);
		replaceText(failNode,fail);
	
	}		

	
}
