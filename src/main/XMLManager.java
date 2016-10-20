package main;

import java.io.File;
import java.util.ArrayList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;

public class XMLManager {

	XMLEditor editor;
	DocumentBuilderFactory docFactory;
	DocumentBuilder docBuilder;	
	Document doc;
	
	public XMLManager(){
		
	}
	
	
	protected void allocateScreen(ArrayList<String> contentList) {
		
		for(String content : contentList){
		String[] lines = content.split("\\r?\\n");
		
			if(lines.length>1){ //1st screen passed through is a dud with only 1 value
				String screenNumber = cleanScreenNumber(lines[0]);
				String screenType = cleanScreenType(lines[1]);
				//System.out.println(screenNumber + " " + screenType);
				buildScreen(screenNumber,screenType,content); //this should be with an interface / factory pizza method
			}
		}
	}

	private void buildScreen(String screenNumber, String screenType, String content) {
		
		writeFile(screenNumber,screenType,content);
		//WriteXMLFile.writefile(doc)
		
	}
	
	protected void writeFile(String screenNumber, String screenType, String screenContent){

		String filepath = screenNumber + ".xml";
		File xmlFile = new File("xml/templates/_template_" + screenType + ".xml");

		
		try{
			////////////////LOAD XML FILE////////////////////
			docFactory = DocumentBuilderFactory.newInstance();
			docBuilder = docFactory.newDocumentBuilder();
			doc = docBuilder.parse(xmlFile);
			doc.getDocumentElement().normalize();
			
			////////////////EDIT XML FILE///////////////////
			if(screenType.contains("text")){ 
			editor = new TextGraphic(); //polymorphic
			doc = editor.editXML(doc,screenContent);
			}
			////////////////WRITE XML FILE///////////////////
			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer transformer = tFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.CDATA_SECTION_ELEMENTS, "script");
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			DOMSource source = new DOMSource(doc);
			//StreamResult result = new StreamResult(new File("D:/eclipse/Build_generator/xml/" + filepath));
			//transformer.transform(source, result);
			//for logging
			StreamResult consoleResult = new StreamResult(System.out);
			transformer.transform(source, consoleResult);			
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}	


	private String cleanScreenNumber(String s){
		s = s.replaceAll("[^\\d_]", ""); //regEx ^(any thing thats not) \\d_ (a digit or underscore) 
		//s = s.substring(0, 6);
		return s;
	}	
	
	private String cleanScreenType(String s){
		String type = null;

		if(s.toLowerCase().contains("photostory")){
			type = "photostory";
		}
		if(s.toLowerCase().contains("text and graphic")){
			type = "text_graphic";
		}
		if(s.toLowerCase().contains("multiple choice question")){
			type = "mcq";
		}
		if(s.toLowerCase().contains("animation") || s.toLowerCase().contains("video")){
			type = "video";
		}
		if(s.toLowerCase().contains("drag")){
			type = "drag_drop";
		}		
		if(s.toLowerCase().contains("graphic reveal")){
			type = "text_graphic_reveal";
		}						
		if(s.toLowerCase().contains("tab")){
			type = "tab_reveal";
		}			
		return type;
	}	
	
	private boolean isScreenNumber(String s){
		return s.contains("SCREEN") && s.contains("_") && s.contains("0");
	}			
	
	
}
