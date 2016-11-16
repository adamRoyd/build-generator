package templates;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.ListIterator;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import main.XMLEditor;

public class DragDrop extends XMLEditor{

	Document doc;
	String screenContent;
	
	public DragDrop(Document doc, String screenContent){
		this.doc = doc;
		this.screenContent = screenContent;
	}			
	
	public Document editXML(){
		
		editIntroText();

		//editDragsAndDropboxes(doc,screenContent);
		
		editFeedbacks();
		
		return doc;
	}

	private void editIntroText() {

		String openingText = getHeadingContent(screenContent, "OPENING TEXT");
		String prompt = getHeadingContent(screenContent,"PROMPT");
		prompt = addClass(prompt, "prompt");
		openingText = openingText + prompt;
		Node introTextNode = getNodeById(doc, "text", "introText");
		CDATASection cdata = doc.createCDATASection(openingText);
		replaceText(introTextNode, cdata);
	}


	protected void editFeedbacks(){

		CDATASection pass = doc.createCDATASection(getHeadingContent(screenContent,"CORRECT TEXT"));
		CDATASection partial = doc.createCDATASection(getHeadingContent(screenContent,"PARTIAL TEXT"));
		CDATASection fail = doc.createCDATASection(getHeadingContent(screenContent,"INCORRECT TEXT"));
		
		Node passNode = getNodeById(doc, "text", "text_pass");
		Node partialNode = getNodeById(doc, "text", "text_partial");
		Node failNode = getNodeById(doc, "text", "text_fail");		
		
		replaceText(passNode,pass);
		replaceText(partialNode,partial);
		replaceText(failNode,fail);
	
	}	
	
	private void editDragsAndDropboxes() {
		
		
		//get options text
		String options = getHeadingContent(screenContent, "OPTIONS");
		options = options.replaceAll("(?m)^\\s*$[\n\r]{1,}", ""); // remove empty lines
		
		//separate options by option number 
		Iterator it = new ArrayList<String>(Arrays.asList(options.split("<p>\\d</p>"))).iterator();

		///DROP BOXES/////
		//1st entry is the dropboxes
		
		while(it.hasNext()){
			String s = (String) it.next();
			ArrayList<String> dropBoxes = new ArrayList<String>(Arrays.asList(s.split("\r")));
			//remove first item from list as it is not a dropbox
			ListIterator listIterator = dropBoxes.listIterator();
			listIterator.next();
			listIterator.remove();
			System.out.println("/////DROP BOXES//////");
			for(String boxes : dropBoxes){
				//TO DO THE STUFF
				System.out.println(boxes);
			}
			it.remove();
			break;
		}
		
		
		///DRAG ITEMS and MATCHES///
		//rest of the entries are the drag items and the options
		ArrayList<String> dragItems = new ArrayList<String>();
		ArrayList<String> matchList = new ArrayList<String>(); 

		while(it.hasNext()){
			String s = (String) it.next();
			s = s.replaceAll("(?m)^\\s*$[\n\r]{1,}", ""); // remove empty lines
			String[]array = s.split("\r");
			//first entry is the drag item
			dragItems.add(array[0]);
			//create the match numbers from the rest of the array
			for(int i=1;i<array.length;i++){
				if(array[i].contains("�")){
					matchList.add(Integer.toString(i));
					break;
				} 
			}
			
		}
		
		for(String matches : matchList){
			System.out.println("MATCH: " + matches);
		}
		
		Node dragNode;
		Node dragParent = getNodeById(doc,"box","drag_items");
		CDATASection cdata;
		int dragCount = 1;
		for(String drag : dragItems){
			cdata = doc.createCDATASection(drag);
			dragNode = getNodeById(doc,"box", "drag" + dragCount);
			
			//create new node if none left
			if(dragNode == null){
				dragNode = getNodeById(doc,"box","drag1").cloneNode(true);
				NamedNodeMap attr = dragNode.getAttributes();
				Node id = attr.getNamedItem("id");
				id.setTextContent("drag" + dragCount);
				dragParent.appendChild(dragNode);
			}
			
			//loop through drag child nodes
			NodeList list = dragNode.getChildNodes();
			for(int j=0;j<list.getLength();j++){
				Node n = list.item(j);
				//locate the text node
				if("text".equals(n.getNodeName())){
					replaceText(n,cdata);
				}
			}			

			dragCount++;
		}

		///EDIT DROP SETTINGS////
		Node custom = getNodeById(doc,"custom","dragdrop");
		//TO DO create drag nodes using the drag box id's, and edit the match attribute
			
	};	
	
}
