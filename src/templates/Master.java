package templates;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class Master {
	
	DocumentBuilderFactory docFactory;
	DocumentBuilder docBuilder;	
	Document doc;

	public Master(){

	};
	
	public Document loadMasterFile(){

		try{
			//load document
			String filepath = System.getProperty("user.dir") + "/../module1/lib/xml/master.xml";
			docFactory = DocumentBuilderFactory.newInstance();
			docBuilder = docFactory.newDocumentBuilder();
			doc = docBuilder.parse(filepath);
		}
		
		catch(Exception e){
			
		}

		return doc;
		
	}

	public void clearTopicScreens(){
		NodeList topics = doc.getElementsByTagName("topic");
		for(int i=0;i<topics.getLength();i++){
			Node t = topics.item(i);
			while(t.hasChildNodes()){
				t.removeChild(t.getFirstChild());
			}
		}
	}
	
	public void createPageNodes(String screenNumber, String screenType, String projectCode){
		
		int topicNumber = Integer.parseInt(screenNumber.substring(0,1));
				
		Node topic = getNodeById("topic", Integer.toString(topicNumber)); //indexed at 0
		Element page = doc.createElement("page");
		Attr id = doc.createAttribute("id");
		Attr filepath = doc.createAttribute("xml");
		id.setValue(screenNumber); //set id number
		filepath.setValue("lib/xml/" + projectCode + "_0" + screenNumber + ".xml");
		page.setAttributeNode(id);
		page.setAttributeNode(filepath);
		addLabelTypeAttribute(page,screenType);
		topic.appendChild(page);
	}
	
	public void addLabelTypeAttribute(Element p, String screenType){
		//method that adds a label or type attribute to the screen node based on its screenType.
		Attr typeOrLabel;
		if(screenType.equals("photostory") || screenType.equals("mcq") || screenType.equals("drag_drop")){
			typeOrLabel = doc.createAttribute("type");
		} else{
			typeOrLabel = doc.createAttribute("label");
		}
		typeOrLabel.setValue(screenType);
		p.setAttributeNode(typeOrLabel);
	}
	
	public void writeMaster(){
		//print result
		try{
			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer transformer = tFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(new File(System.getProperty("user.dir") + "/../module1/lib/xml/master.xml"));
			transformer.transform(source, result);
			//for logging
			//StreamResult consoleResult = new StreamResult(System.out);
			//transformer.transform(source, consoleResult);				
		}
		catch(Exception e){
			
		}
	}

	protected Node getNodeById(String nodeType, String id){
		
		String expression = "//" + nodeType + "[@id=\"" + id + "\"]";
		XPath xpath = XPathFactory.newInstance().newXPath();
		try {
			XPathExpression expr = xpath.compile(expression);
			Object exprResult = expr.evaluate(doc, XPathConstants.NODE);
			Node node = (Node) exprResult;
			if(node == null){
				System.out.println(id + " IS NOT A NODE");
			}
			return node;
		} catch (XPathExpressionException e) {
			e.printStackTrace();
		}
		return null;
	}	
	
}
