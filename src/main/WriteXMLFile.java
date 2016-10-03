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

	DocumentBuilderFactory docFactory;
	DocumentBuilder docBuilder;	
	Document doc;
	
	public WriteXMLFile(){

	}
	
	protected void writeFile(String filepath, String screenType){
		
		File xmlFile = getScreenTemplate(screenType);
		
		try{
			docFactory = DocumentBuilderFactory.newInstance();
			docBuilder = docFactory.newDocumentBuilder();
			doc = docBuilder.parse(xmlFile);
			doc.getDocumentElement().normalize();
			
			//use a transformer for output
			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer transformer = tFactory.newTransformer();
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(new File(filepath));
			transformer.transform(source, result);
			
			//for logging
			//StreamResult consoleResult = new StreamResult(System.out);
			//transformer.transform(source, consoleResult);			
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
	
	private File getScreenTemplate(String s){
		String filepath = null;
		System.out.println(s);
		switch(s){
			case "SCREEN TYPE: Text and graphic" : 
				filepath = "_template_text_graphic.xml";
				break;
			case "SCREEN TYPE: Photostory" :
				filepath = "_template_photostory.xml";
				break;
			default : filepath = "_template_text_graphic.xml";
		}
		
		return new File(filepath);
	}
}
