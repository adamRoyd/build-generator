package templates;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import main.XMLEditor;

public class TabReveal extends XMLEditor{

	Document doc;
	String screenContent;
	
	public TabReveal(Document doc, String screenContent){
		super(doc,screenContent);
		this.doc = doc;
		this.screenContent = screenContent;
	}

	public Document editXML(){

		editIntroText();
		
		editNumberOfClicks();
		
		editNumberOfReveals();
		
		editClickContent();

		editRevealContent();
		
		editRevealImages();

		return doc;
	}

	private void editRevealImages() {

		Node tabsNode = doc.getElementsByTagName("tabs").item(0);
		NodeList reveals = ((Element) tabsNode).getElementsByTagName("reveal");
		
		for(int i=0;i<getNumberOfItems();i++){
			
			editImagePath(((Element) reveals.item(i)).getElementsByTagName("image").item(0),"_0" + (i + 1),"jpg");
			
			checkImageAsset("_0" + (i + 1));
		}
	}

	private void editRevealContent() {
		
		Node tabsNode = doc.getElementsByTagName("tabs").item(0);
		NodeList reveals = ((Element) tabsNode).getElementsByTagName("reveal");
		Node revealTextNode;
		String tabText;
		
		for(int i=0;i<getNumberOfItems();i++){
			
			revealTextNode = ((Element) reveals.item(i)).getElementsByTagName("text").item(0);
			
			tabText = getHeadingContent("TAB " + (i + 1) + " TEXT");
			
			replaceText(revealTextNode, doc.createCDATASection(tabText));
		}
	}

	private void editClickContent() {
		
		Node tabsNode = doc.getElementsByTagName("tabs").item(0);
		NodeList clicks = ((Element) tabsNode).getElementsByTagName("click");
		Node click;
		String tabTitle;
		
		for(int i=1;i<=getNumberOfItems();i++){
			
			click = clicks.item(i);
			tabTitle = getHeadingContent("TAB " + i + " TITLE");
			replaceText(click, doc.createCDATASection(tabTitle));
		}		
	}

	private void editNumberOfClicks() {

		Node tabsNode = doc.getElementsByTagName("tabs").item(0);
		NodeList clicks = ((Element) tabsNode).getElementsByTagName("click");
		Node click;
		
		for(int i=0;i<getNumberOfItems();i++){
			
			click = clicks.item(i);
			
			//clone node if needed
			if(click == null){
				click = clicks.item(1).cloneNode(true); //first node has 'selected=true'
				tabsNode.appendChild(click);
			}
			
		}
	}
	
	private void editNumberOfReveals() {

		Node tabsNode = doc.getElementsByTagName("tabs").item(0);
		NodeList reveals = ((Element) tabsNode).getElementsByTagName("reveal");
		Node reveal;
		
		for(int i=0;i<getNumberOfItems();i++){
			
			reveal = reveals.item(i);
			
			//clone node if needed
			if(reveal == null){
				reveal = reveals.item(0).cloneNode(true);
				tabsNode.appendChild(reveal);
			}
			
		}
	}	

	private int getNumberOfItems() {
		
		int count = 1;
		
		while(true){
			
			String s = getHeadingContent("TAB " + count + " TEXT");
			
			if(s == ""){
				break;
			}
			
			count ++;
			
		}
		
		return count - 1; //starts at 1
	}

	private void editIntroText(){

		String introText = getHeadingContent("OPENING TEXT");
		String prompt = getHeadingContent("PROMPT");

		prompt = addClass(prompt,"prompt");
		introText = introText + prompt;

		Node text = getNodeById("text", "screentext");
		CDATASection cdata = doc.createCDATASection(introText);
		replaceText(text,cdata);		
	}

	
}
