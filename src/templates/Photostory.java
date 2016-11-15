package templates;

import java.util.ArrayList;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import main.XMLEditor;

public class Photostory extends XMLEditor{
	
	Document doc;
	String screenContent;
	
	public Photostory(Document doc, String screenContent){
		this.doc = doc;
		this.screenContent = screenContent;
	}
	
	public Document editXML(){
		

		ArrayList<String> cellList = splitContentIntoCells(screenContent); 
		
		editCells(cellList);

		
		return doc;
	}

	private void editCells(ArrayList<String> cellList) {
		
		Node cellNode;
		CDATASection cdata;
		Node custom = doc.getElementsByTagName("custom").item(0);
		int cellNumber = 0;
	
		for(String cellContent : cellList){
			
			//get cell node
			cellNode = doc.getElementsByTagName("cell").item(cellNumber);
			
			if(cellNode == null){
				cellNode = doc.getElementsByTagName("cell").item(0).cloneNode(true);
				custom.appendChild(cellNode);
			}
			
			//get text content
			String titleText = getHeadingContent(cellContent, "HEADLINE");
			String text = getHeadingContent(cellContent, "TEXT");
			String promptText = getHeadingContent(cellContent, "PROMPT");
			titleText = addClass(titleText,"headline");
			promptText = addClass(promptText,"prompt");
			text = titleText + "\r" + text + "\r" + promptText;
			cdata = doc.createCDATASection(text);
			
			//get text child node of cell and replace text
			NodeList cellChilds = cellNode.getChildNodes();
			for(int i=0;i<cellChilds.getLength();i++){
				Node n = cellChilds.item(i);

				if("text".equals(n.getNodeName())){
					
					replaceText(n,cdata);
				}
			}
			
			cellNumber++;
		}
		
	}

	private ArrayList<String> splitContentIntoCells(String s) {
		ArrayList<String> list = new ArrayList<String>();
		
		//split content based on frame number
		String[]arr = s.split("<p><b>\\d</b></p>");
		
		for(int i=0;i<arr.length;i++){

			list.add(arr[i]);
		}
		
		//first item is the page description
		list.remove(0); 
		
		return list;
	};
	

}
