package templates;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import main.XMLEditor;

public class ColumnSort extends XMLEditor{

	Document doc;
	String screenContent;
	
	public ColumnSort(Document doc, String screenContent){
		super(doc,screenContent);		
		this.doc = doc;
		this.screenContent = screenContent;
	}		
	
	public Document editXML(){
		
		editIntroText();
		
		//editColumns();
		
		editFeedbacks();

		
		return doc;
	};	
	
	
	private void editColumns() {

		Node customNode = doc.getElementsByTagName("custom").item(0);
		
		NodeList columnNodes = ((Element) customNode).getElementsByTagName("column");
		Node columnNode;
		int count = 0;
		
		String options = getHeadingContent("OPTIONS");
		options = options.replaceAll("(?m)^\\s*$[\n\r]{1,}", ""); // remove empty lines

		Iterator<String> it = new ArrayList<String>(Arrays.asList(options.split("\n"))).iterator();
		
		while(it.hasNext()){
			String s = it.next();
			
			columnNode = columnNodes.item(count);
			
			//clone node if needed
			if(columnNode == null){
				columnNode = columnNodes.item(0).cloneNode(true);
				customNode.appendChild(columnNode);
				editAttribute(getNodeListById("column","1").item(1), "id", Integer.toString(count));
			}
			
			if(isNumeric(s)){
				break;
			}
			
			count ++;
		}
		
	}

	private void editIntroText() {

		String openingText = getHeadingContent( "QUESTION TEXT");
		String prompt = getHeadingContent("PROMPT");
		prompt = addClass(prompt, "prompt");
		openingText = openingText + prompt;

		Node node = getNodeById( "text", "screentext");
		replaceText(node, openingText,"screentext");		
	}	
	

	
}
