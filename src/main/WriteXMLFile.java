package main;

import java.io.File;
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

public class WriteXMLFile {

	File xmlFile = new File("_template_text_graphic.xml");
	DocumentBuilderFactory docFactory;
	DocumentBuilder docBuilder;	
	Document doc;
	
	public WriteXMLFile() throws ParserConfigurationException, SAXException, IOException, TransformerException{
		docFactory = DocumentBuilderFactory.newInstance();
		docBuilder = docFactory.newDocumentBuilder();
		doc = docBuilder.parse(xmlFile);
		doc.getDocumentElement().normalize();
		System.out.println(doc.getDocumentElement().getNodeName());
		
		//use a transformer for output
		TransformerFactory tFactory = TransformerFactory.newInstance();
		Transformer transformer = tFactory.newTransformer();
		DOMSource source = new DOMSource(doc);
		StreamResult result = new StreamResult(System.out);
		transformer.transform(source, result);
	}
}
