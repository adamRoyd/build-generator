package main;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

public class TemplateMCQeditor {



	public Document editXML(Document doc){
		
		editOptions(doc);
	
		return doc;
	};
	
	private void editOptions(Document doc){
		Node custom = doc.getElementsByTagName("custom").item(0);
		Element option = doc.createElement("option");
		Attr correct = doc.createAttribute("correct");
		correct.setValue("THISwORKS");
		option.setAttributeNode(correct);
		custom.appendChild(option);
	}


}