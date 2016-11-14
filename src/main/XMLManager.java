package main;

import java.io.File;
import java.util.ArrayList;
import java.util.ListIterator;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;

import templates.ColumnSort;
import templates.DragDrop;
import templates.Hotspot;
import templates.MCQ;
import templates.Master;
import templates.Photostory;
import templates.RevealText;
import templates.TextGraphic;
import templates.Video;

public class XMLManager {

	XMLEditor editor;
	DocumentBuilderFactory docFactory;
	DocumentBuilder docBuilder;	
	Document doc;
	Master masterxmlbuilder;
	Document masterXML;
	String projectCode;
	
	public XMLManager(){
		masterxmlbuilder = new Master();
		masterXML = masterxmlbuilder.loadMasterFile();		
		masterxmlbuilder.clearTopicScreens();
	}

	
	protected void createScreens(ArrayList<String> contentList) {
		
		//remove the first item - it is not a screen
		ListIterator listIterator = contentList.listIterator();
		listIterator.next();
		listIterator.remove();
		
		
		for(String content : contentList){
		String[] lines = content.split("\\r?\\n");

			if(lines.length>1){ //1st screen passed through is a dud with only 1 value
				String screenNumber = cleanScreenNumber(lines[0]);
				String screenType = cleanScreenType(lines[1]);
				
				if(screenType.equals("unknown")){
					masterxmlbuilder.createPageNodes(screenNumber, screenType, projectCode);
					System.out.println("UNKNOWN TEMPLATE: " + lines[1]);
				} else{
					masterxmlbuilder.createPageNodes(screenNumber, screenType, projectCode);
					writeFile(screenNumber,screenType,content);
				}

			}
		}
	}

	
	public void writeMaster() {

		masterxmlbuilder.writeMaster();	
	}	


	protected void writeFile(String screenNumber, String screenType, String screenContent){


		
		String filepath = projectCode + "_" + "0" + screenNumber;
					
		File xmlFile;

		//write new file or update existing file
		if( new File(System.getProperty("user.dir") + "/../module1/lib/xml/" + filepath + ".xml").exists()){
			xmlFile = new File(System.getProperty("user.dir") +
					"/../module1/lib/xml/" + filepath + ".xml");
		} else{
			xmlFile = new File(System.getProperty("user.dir") +
					"/xml_templates/_template_" + screenType + ".xml");
		}
		
		try{
			////////////////LOAD XML FILE////////////////////
			docFactory = DocumentBuilderFactory.newInstance();
			docBuilder = docFactory.newDocumentBuilder();
			doc = docBuilder.parse(xmlFile);
			doc.getDocumentElement().normalize();		
			
			////////////////EDIT XML FILE///////////////////
			switch(screenType){

				case "text_graphic":
					editor = new TextGraphic(doc,screenContent);
					break;
				case "mcq":
					editor = new MCQ(doc,screenContent);
					break;
				case "photostory":
					editor = new Photostory(doc,screenContent);
					break;
				case "text_reveal":
					editor = new RevealText(doc,screenContent);
					break;
				case "column_sort":
					editor = new ColumnSort(doc,screenContent);
					break;
				case "drag_drop":
					editor = new DragDrop(doc,screenContent);
					break;
				case "hotspot":
					editor = new Hotspot(doc,screenContent);
					break;
				case "video":
					editor = new Video(doc,screenContent);
					break;
				default: 
					System.out.println(screenNumber + " no change");
					editor = new XMLEditor();
					
			}
			
			editor.setFilePath(filepath);
			doc = editor.editXML();
			
			////////////////WRITE XML FILE///////////////////
			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer transformer = tFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.CDATA_SECTION_ELEMENTS, "script");
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");			
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(new File(System.getProperty("user.dir") 
					+ "/../module1/lib/xml/" + filepath + ".xml"));
			transformer.transform(source, result);
			//logging
			//StreamResult consoleResult = new StreamResult(System.out);
			//transformer.transform(source, consoleResult);	
			System.out.println("SCREEN: " + projectCode + "_0" + screenNumber + " TYPE: " + screenType);
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}

	private String cleanScreenNumber(String s){
		s = s.replaceAll("[^\\d_]", ""); //remove non-digits and keep underscore
		return s;
	}	
	
	private String cleanScreenType(String s){
		String type = null;
		
		if(s.toLowerCase().contains("photostory")){
			type = "photostory";
		}
		else if(s.toLowerCase().contains("text and graphic")){
			type = "text_graphic";
		}
		else if(s.toLowerCase().contains("multiple choice question")){
			type = "mcq";
		}
		else if(s.toLowerCase().contains("video")){
			type = "video";
		}
		else if(s.toLowerCase().contains("drag")){
			type = "drag_drop";
		}		
		else if(s.toLowerCase().contains("graphic reveal")){
			type = "text_graphic_reveal";
		}						
		else if(s.toLowerCase().contains("tab")){
			type = "tab_reveal";
		}
		else if(s.toLowerCase().contains("column sort")){
			type = "column_sort";
		}
		else if(s.toLowerCase().contains("hotspot")){
			type = "hotspot";
		}
		else if(s.toLowerCase().contains("text reveal")){
			type = "text_reveal";
		}
		else{
			type="unknown";
		}
		
		return type;
	}	
	
	public String getProjectCode(){
		return this.projectCode;
	}
	
	public void setProjectCode(String projectCode){
		this.projectCode = projectCode;
	}
	
	
}
