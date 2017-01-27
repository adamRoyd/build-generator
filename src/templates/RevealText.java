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
		super(doc,screenContent);		
		this.doc = doc;
		this.screenContent = screenContent;
	}	
	
	public Document editXML(){

		editIntroText();
	
		editNumberOfReveals();
		
		editNumberOfClicks();
		
		editContents();

		return doc;
	}
	
	private void editNumberOfReveals() {
		
		Node reveals = getNodeById("box", "reveals");
		Node revealNode;
		String nodeType = getNodeType("reveals");

		for(int i=1;i<=getNumberOfItems();i++){
			revealNode = getNodeById(nodeType,"reveal_click" + i);
			
			//clone node if required
			if(revealNode == null){
				revealNode = getNodeById(nodeType,"reveal_click1").cloneNode(true);
				reveals.appendChild(revealNode);
				//change id of cloned node
				editAttribute(getNodeListById(nodeType,"reveal_click1").item(1), "id", "reveal_click" + i);
			}

		}
	}
	
	private void editNumberOfClicks() {
		
		Node reveals = getNodeById("box", "clicks");
		Node revealNode;
		String nodeType = getNodeType("clicks");
		
		for(int i=1;i<=getNumberOfItems();i++){
			revealNode = getNodeById(nodeType,"click" + i);
			
			//clone node if required
			if(revealNode == null){
				revealNode = getNodeById(nodeType,"click1").cloneNode(true);
				reveals.appendChild(revealNode);
				//change id of cloned node
				editAttribute(getNodeListById(nodeType,"click1").item(1), "id", "click" + i);
			}

		}
	}	



	private String getNodeType(String parentId) {
		
		Node parent = getNodeById("box",parentId);

		NodeList boxNodes = ((Element) parent).getElementsByTagName("box");
		
		if(boxNodes.getLength() == 0){
			return "text";
		} else{
			return "box";
		}

	}

	private int getNumberOfItems() {
		
		int count = 0;
		String s = "";
		
		while(true){
			s = getHeadingContent("TEXT FOR REVEAL " + (count + 1));
			if(s == ""){
				break;
			}
			count ++;
			
		}
		
		return count;
	}

	private void editContents() {
		Node clickNode;
		Node revealNode;
		String clickText = "";
		String revealText = "";
		String clickNodeType = getNodeType("clicks");
		String revealNodeType = getNodeType("reveals");		
		
		for(int i=1;i<=getNumberOfItems();i++){
			
			//REPLACE CLICK TEXT
			if(clickNodeType.equals("text")){
				clickNode = getNodeById("text","click" + i);
			} else{
				clickNode = ((Element) getNodeById("box","click" + i)).getElementsByTagName("text").item(0);
			}
			
			clickText = getHeadingContent("REVEAL HEADING " + i);
			replaceText(clickNode, doc.createCDATASection(clickText));
			
			//REPLACE REVEAL TEXT
			if(revealNodeType.equals("text")){
				revealNode = getNodeById("text","reveal_click" + i);
			} else{
				revealNode = ((Element) getNodeById("box","reveal_click" + i)).getElementsByTagName("text").item(0);
			}
			
			revealText = getHeadingContent("TEXT FOR REVEAL " + i);
			replaceText(revealNode, doc.createCDATASection(revealText));
			
		}
	}


	

	private void editIntroText(){

		String openingText = getHeadingContent("OPENING TEXT");
		String prompt = getHeadingContent("PROMPT");
		prompt = addClass(prompt,"prompt");
		openingText = openingText + prompt;
		
		Node introText = doc.getElementsByTagName("text").item(0);
		replaceText(introText, doc.createCDATASection(openingText));		
	}
	
}
