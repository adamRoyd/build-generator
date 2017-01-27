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
		super(doc,screenContent);		
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

		String openingText = getHeadingContent("OPENING TEXT");
		String prompt = getHeadingContent("PROMPT");
		prompt = addClass(prompt, "prompt");
		openingText = openingText + prompt;
		Node introTextNode = getNodeById("text", "screentext");
		replaceText(introTextNode, openingText,"introText");
	}


	private void editDragsAndDropboxes() {
		
		
		//get options text
		String options = getHeadingContent("OPTIONS");
		options = options.replaceAll("(?m)^\\s*$[\n\r]{1,}", ""); // remove empty lines
		
		//separate options by option number 
		Iterator it = new ArrayList<String>(Arrays.asList(options.split("<p>\\d</p>"))).iterator();

		///DROP BOXES/////
		//1st entry is the dropboxes
		
		while(it.hasNext()){
			String s = (String) it.next();
			ArrayList<String> dropBoxes = new ArrayList<String>(Arrays.asList(s.split("\n")));
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
			String[]array = s.split("\n");
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
		Node dragParent = getNodeById("box","drag_items");
		CDATASection cdata;
		int dragCount = 1;
		for(String drag : dragItems){

			dragNode = getNodeById("box", "drag" + dragCount);
			
			//create new node if none left
			if(dragNode == null){
				dragNode = getNodeById("box","drag1").cloneNode(true);
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
					replaceText(n,drag,"drag" + dragCount);
				}
			}			

			dragCount++;
		}

		///EDIT DROP SETTINGS////
		Node custom = getNodeById("custom","dragdrop");
		//TO DO create drag nodes using the drag box id's, and edit the match attribute
			
	};	
	
}
