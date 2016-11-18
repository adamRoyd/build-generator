package templates;

import org.w3c.dom.Attr;
import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import main.XMLEditor;

public class Hotspot extends XMLEditor{

	Document doc;
	String screenContent;
	
	public Hotspot(Document doc, String screenContent){
		this.doc = doc;
		this.screenContent = screenContent;
	}	
	
	public Document editXML(){
		
		editIntroText();
		
		editHotspotContent();
		
		return doc;
	};	
	
	private void editIntroText() {

		String openingText = getHeadingContent(screenContent, "OPENING TEXT");
		String prompt = getHeadingContent(screenContent,"PROMPT");
		prompt = addClass(prompt, "prompt");
		openingText = openingText + prompt;
		CDATASection cdata = doc.createCDATASection(openingText);
		Node node = getNodeById(doc, "text", "introText");
		replaceText(node, cdata);		
	}

	private void editHotspotContent() {
		////HEADINGS and REVEALS////
		int count = 1;
		String revealText = "";
		String labelText = "";
		Node revealTextNode;
		Node labelNode;
		Node revealTitleNode;
		
		while(true){

			revealText = getHeadingContent(screenContent, "REVEAL " + count + " TEXT");
			if(revealText == ""){
				break;
			}
			Node revealNode = getNodeById(doc, "box", "reveal_hotspot" + count);
			if(revealNode == null){
				constructReveal(count);
				constructHotspot(count);
				constructLabel(count);
				constructEvent(count);				
			}
			
			revealTextNode = getNodeById(doc, "text", "reveal" + count + "text");
			replaceText(revealTextNode,doc.createCDATASection(revealText));
			
			
			labelText = getHeadingContent(screenContent,"REVEAL " + count + " ICON PLACEMENT");
			labelNode = getNodeById(doc,"text","hotspotLabel" + count);
			revealTitleNode = getNodeById(doc,"text","reveal" + count + "title");

			replaceText(labelNode,doc.createCDATASection(labelText));
			replaceText(revealTitleNode,doc.createCDATASection(labelText));

			count++;
		}	
		
		
	
	}

	private void constructReveal(int count) {

		Node revealHolder = getNodeById(doc, "box", "revealHolder");
		//clone heading node
		Node revealNode = getNodeById(doc,"box","reveal_hotspot1").cloneNode(true);	
		
		editAttribute(revealNode,"id","reveal_hotspot" + count);
				
		revealHolder.appendChild(revealNode);		
		
		//change id of revealtext
		NodeList revealText1List = getNodeListById(doc, "text", "reveal1text");
		editAttribute(revealText1List.item(1),"id","reveal" + count + "text");
		
		//change id of titlebanner
		NodeList title1bannerList = getNodeListById(doc, "box", "title1banner");
		editAttribute(title1bannerList.item(1),"id","title" + count + "banner");
		
		//change id of revealtitle
		NodeList reveal1titleList = getNodeListById(doc, "text", "reveal1title");
		editAttribute(reveal1titleList.item(1),"id","reveal" + count + "title");	
		
		//change id of revealmedia
		NodeList reveal1mediaList = getNodeListById(doc, "box", "reveal1media");	
		editAttribute(reveal1mediaList.item(1),"id","reveal" + count + "media");	
	}

	private void constructHotspot(int count) {
		//clone hotspot 1 to create other hotspots
		Node hotspotHolder = getNodeById(doc, "box", "hotspotHolder");
		Node firstHotspotNode = getNodeById(doc,"box","hotspot1");
		Node hotspot = firstHotspotNode.cloneNode(true);
		editAttribute(hotspot, "id", "hotspot" + count);
		editAttribute(hotspot,"x",Integer.toString(count * 30));
		hotspotHolder.appendChild(hotspot);
	}

	private void constructLabel(int count) {

		Node labelHolder = getNodeById(doc, "box", "labelHolder");
		Node labelNode = getNodeById(doc,"text","hotspotLabel1");
		Node n = labelNode.cloneNode(true);
		editAttribute(n, "id", "hotspotLabel" + count);
		labelHolder.appendChild(n);		
	}	
	
	private void constructEvent(int count) {
		
		Node eventHolder = getNodeById(doc,"event","reset");
		
		//create anim node
		Element animNode = doc.createElement("anim");
		Attr animTime = doc.createAttribute("animtime");
		animTime.setValue("0.25");
		animNode.setAttributeNode(animTime);
		Attr type = doc.createAttribute("type");
		type.setValue("alphaout");
		animNode.setAttributeNode(type);

		animNode.setTextContent("reveal_hotspot" + count);
		eventHolder.appendChild(animNode);
		
		//create enable node
		Element enableNode = doc.createElement("enable");
		enableNode.setTextContent("hotspot" + count);
		eventHolder.appendChild(enableNode);

	}	
	
}
