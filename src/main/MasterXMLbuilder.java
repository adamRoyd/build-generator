package main;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

public class MasterXMLbuilder {
	
	DocumentBuilderFactory docFactory;
	DocumentBuilder docBuilder;	
	Document doc;

	public void MasterXMLbuilder(){

	};
	
	public void loadMasterFile(){

		try{
			//load document
			String filepath = "xml/templates/_template_master.xml";
			docFactory = DocumentBuilderFactory.newInstance();
			docBuilder = docFactory.newDocumentBuilder();
			doc = docBuilder.parse(filepath);
		}
		
		catch(Exception e){
			
		}
		
	}
	
	public void createPageNodes(String screenNumber, String screenType, String projectCode){
		
		Node topic1 = doc.getElementsByTagName("topic").item(0);
		Node topic2 = doc.getElementsByTagName("topic").item(1);
		
		Element page = doc.createElement("page");
		Attr id = doc.createAttribute("id");
		Attr filepath = doc.createAttribute("xml");
		id.setValue(screenNumber); //set id number
		filepath.setValue("lib/xml/" + screenNumber + ".xml");
		page.setAttributeNode(id);
		page.setAttributeNode(filepath);
		customPageNodes(page,screenType);
		topic2.appendChild(page);		
		
	}
	
	public void customPageNodes(Element p, String s){
		if(s.toLowerCase().contains("photostory")){
			Attr type = doc.createAttribute("type");
			type.setValue("photostory");
			p.setAttributeNode(type);
		}
		if(s.toLowerCase().contains("multiple choice question")){
			Attr type = doc.createAttribute("type");
			type.setValue("mcq");
			p.setAttributeNode(type);			
		}
	}
	
	public void printMaster(){
		//print result
		try{
			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer transformer = tFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(System.out);
			transformer.transform(source, result);		
		}
		catch(Exception e){
			
		}
	}
	
	public void editMasterXML(){
		//////////   EDIT XML   /////////////


		//add page nodes to topic 2

		for(int i=1;i<10;i++){

		}
		
		//TO DO: 
		//PUT ATTRIBUTE GENERATION INSIDE ITERATOR
	
		
		//add node with content
		//page.appendChild(doc.createTextNode("THIS IS TEXT"));
		//topic2.appendChild(page);

		
		//change the topic 1's attribute (for testing)
		//NamedNodeMap attr = topic1.getAttributes();
		//Node nodeattr = attr.getNamedItem("label");
		//nodeattr.setTextContent("THIS WORKS");		
		////////////////////////////////////		
	}
	

}
