package templates;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import main.XMLEditor;

public class RevealText extends XMLEditor{

	Document doc;
	String screenContent;
	
	public RevealText(Document doc, String screenContent){
		this.doc = doc;
		this.screenContent = screenContent;
	}	
	
	public Document editXML(){

		editIntroText();
		
		editReveals();

		return doc;
	}
	
	private void editIntroText(){

		String openingText = getHeadingContent(screenContent, "OPENING TEXT");
		String prompt = getHeadingContent(screenContent,"PROMPT");
		prompt = addClass(prompt,"prompt");
		openingText = openingText + prompt;
		
		Node introText = doc.getElementsByTagName("text").item(0);
		replaceText(introText, doc.createCDATASection(openingText));		
	}


	private void editReveals() {
		////HEADINGS and REVEALS////
		int count = 1;
		Node revealHolder = getNodeById(doc, "box", "revealHolder");
		Node headingNode;
		Node headingTextNode;
		Node revealNode;
		Node revealTextNode;
		String headingText = "";
		String revealText = "";
		
		while(true){
			headingText = getHeadingContent(screenContent, "HEADING " + count + " TEXT", "TEXT FOR HEADING " + count);
			revealText = getHeadingContent(screenContent, "TEXT FOR HEADING " + count);
			if(headingText == ""){
				break;
			}
			headingNode = getNodeById(doc, "box", "click" + count);
			if(headingNode == null){
				constructHeadingNode(doc,count);
				constructRevealNode(doc,count);
				constructEvent(doc,count);
				
				//TO DO change the id of the text child in the reveal box
			}

			headingTextNode = getNodeById(doc,"text", "clickText" + count);
			replaceText(headingTextNode, doc.createCDATASection(headingText));
			
			revealTextNode = getNodeById(doc, "text", "reveal" + count + "text");
			replaceText(revealTextNode,doc.createCDATASection(revealText));

			count++;
		}
	}

	private void constructEvent(Document doc, int count) {
		Node eventHolder = getNodeById(doc,"event","reset");
		
		//create anim node
		Element animNode = doc.createElement("anim");
		Attr animTime = doc.createAttribute("animtime");
		animTime.setValue("0.25");
		animNode.setAttributeNode(animTime);
		Attr type = doc.createAttribute("type");
		type.setValue("alphaout");
		animNode.setAttributeNode(type);

		animNode.setTextContent("reveal_click" + count);
		eventHolder.appendChild(animNode);
		
		//create enable node
		Element enableNode = doc.createElement("enable");
		enableNode.setTextContent("click" + count);
		eventHolder.appendChild(enableNode);

	}

	private void constructRevealNode(Document doc, int count) {
		Node revealHolder = getNodeById(doc, "box", "revealHolder");
		Node revealNode = getNodeById(doc,"box","reveal_click1").cloneNode(true);

		editAttribute(revealNode,"id","reveal_click" + count);
		//change id of child text node
		NodeList revealNodeList = revealNode.getChildNodes();
		for(int i=0;i<revealNodeList.getLength();i++){
			
			Node n = revealNodeList.item(i);
			if("text".equals(n.getNodeName())){

				editAttribute(n,"id","reveal" + count + "text");
			}
		}
		revealHolder.appendChild(revealNode);
	}

	private void constructHeadingNode(Document doc, int count) {
		
		Node revealHolder = getNodeById(doc, "box", "revealHolder");
		Node headingNode = getNodeById(doc,"box","click1").cloneNode(true);
		editAttribute(headingNode,"id","click" + count);
		editAttribute(headingNode,"event","reset,showreveal," + count);
		
		//change id of child text node
		NodeList headingNodeList = headingNode.getChildNodes();
		for(int i=0;i<headingNodeList.getLength();i++){
			
			Node n = headingNodeList.item(i);
			if("text".equals(n.getNodeName())){
				
				editAttribute(n,"id","clickText" + count);
			}
		}				
		revealHolder.appendChild(headingNode);		
	};	
	
	
}
