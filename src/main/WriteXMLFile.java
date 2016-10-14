package main;

import java.io.File;
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
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
	XMLEditor xmlEditor;
	
	public WriteXMLFile(){
		xmlEditor = new XMLEditor();
	}
	
	protected void writeFile(String filepath, String screenType){
		
		File xmlFile = getScreenTemplate(screenType);
		
		try{
			docFactory = DocumentBuilderFactory.newInstance();
			docBuilder = docFactory.newDocumentBuilder();
			doc = docBuilder.parse(xmlFile);
			doc.getDocumentElement().normalize();
			
			doc = xmlEditor.editXML(doc,screenType);
			
			//use a transformer for output
			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer transformer = tFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			DOMSource source = new DOMSource(doc);
//			StreamResult result = new StreamResult(new File(filepath));
//			transformer.transform(source, result);
			
			//for logging
			//StreamResult consoleResult = new StreamResult(System.out);
			//transformer.transform(source, consoleResult);			
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
	
	private File getScreenTemplate(String s){
		String filepath = "xml/templates/_dud.xml";

		if(s.toLowerCase().contains("photostory")){
			filepath = "xml/templates/_template_photostory.xml";
		}
		if(s.toLowerCase().contains("text and graphic")){
			filepath = "xml/templates/_template_text_graphic.xml";
		}
		if(s.toLowerCase().contains("multiple choice question")){
			filepath = "xml/templates/_template_mcq.xml";
		}
		if(s.toLowerCase().contains("animation") || s.toLowerCase().contains("video")){
			filepath = "xml/templates/_template_video.xml";
		}
		if(s.toLowerCase().contains("drag")){
			filepath = "xml/templates/_template_drag_drop.xml";
		}
		if(s.toLowerCase().contains("drag")){
			filepath = "xml/templates/_template_drag_drop.xml";
		}				
		if(s.toLowerCase().contains("graphic reveal")){
			filepath = "xml/templates/_template_text_graphic_reveal.xml";
		}						
		
		return new File(filepath);
	}
}
