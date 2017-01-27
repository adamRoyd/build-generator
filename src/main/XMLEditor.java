package main;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class XMLEditor {
	
	String filepath;
	
	String screenContent;
	Document doc;
	
	public XMLEditor(Document doc, String screenContent){
		this.doc = doc;
		this.screenContent = screenContent;		
	}
	
	public Document editXML(){
		//called if screentype is not recognised
		return doc;
	}
	
	//if possible, include id in replacetext method for debugging
	protected void replaceText(Node node, String content, String id){
		if(node == null){
			System.out.println(id + " NODE DOES NOT EXIST");
		}
		//replace text if there is content and node exists
		if(node != null && content.length() != 0){	
			
			//clean up text
			content = content.replaceAll("\\n", "");
			
			removeChilds(node);
			node.appendChild(doc.createCDATASection(content));
		}
	}
	
	protected void replaceText(Node node, String content){
		if(node == null){
			System.out.println("NODE WITH NO ID DOES NOT EXIST");
		}
		//replace text if there is content and node exists
		if(node != null && content.length() != 0){	
			
			//clean up text
			content = content.replaceAll("\\n", "");
			
			removeChilds(node);
			node.appendChild(doc.createCDATASection(content));
		}
	}	
	
	protected void removeChilds(Node node){
		while(node.hasChildNodes()){
			node.removeChild(node.getFirstChild());
		}
	}
	
	protected void editAttribute(Node node, String attr, String value){
		NamedNodeMap attributes = node.getAttributes();
		Node attribute = attributes.getNamedItem(attr);
		attribute.setTextContent(value);
	}
	
	protected String addClass(String text, String classType){
		if(text == null || text.length()<3){
			return "";
		}

		String classHTML = "<p class=\"" + classType + "\">";  
		//text = new StringBuilder(text).insert(3, classHTML).toString();
		text = text.replace("<p>",classHTML);
		return text;
	}		
	
	protected String getHeadingContent(String heading){
		
		//split content by paragraph breaks
		Iterator<String> it = new ArrayList<String>(Arrays.asList(screenContent.split("\\n"))).iterator();
		String text = "";
		while(it.hasNext()){
			String line = it.next();
			
			if(line.contains(heading) && isAHeading(line)){
				//add the subsequent lines to the text String
				//stops when it reaches a new heading (i.e. OPTIONS)
				while(it.hasNext()){ 
					line = it.next();					
					if(isAHeading(line)){
						break;
					}
					line = line.trim();
					text += "\n" + line;
					
				}
				
			}
		}
		text = text.replaceAll("(?m)^[ \t]*\r?\n", "");
		return text;
	}
	
	
	protected Node getNodeById(String nodeType, String id){
		
		String expression = "//" + nodeType + "[@id=\"" + id + "\"]";
		XPath xpath = XPathFactory.newInstance().newXPath();
		try {
			XPathExpression expr = xpath.compile(expression);
			Object exprResult = expr.evaluate(doc, XPathConstants.NODE);
			Node node = (Node) exprResult;
			if(node == null){
				//System.out.println(id + " IS NOT A NODE");
			}
			return node;
		} catch (XPathExpressionException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	protected NodeList getNodeListById(String nodeType, String id){
		
		String expression = "//" + nodeType + "[@id=\"" + id + "\"]";
		XPath xpath = XPathFactory.newInstance().newXPath();
		try {
			XPathExpression expr = xpath.compile(expression);
			NodeList nodeList = (NodeList) expr.evaluate(doc, XPathConstants.NODESET);
			if(nodeList == null){
				//System.out.println(id + " IS NOT A NODE");
			}
			return nodeList;
		} catch (XPathExpressionException e) {
			e.printStackTrace();
		}
		return null;
	}	
	
	
	protected void editFeedbacks(){

		String correctText = getHeadingContent("CORRECT TEXT");
		String partialText = getHeadingContent("CORRECT TEXT");		
		String failText = getHeadingContent("CORRECT TEXT");		
		
		Node passNode = getNodeById("text", "feedback_pass");
		Node partialNode = getNodeById("text", "feedback_partial");
		Node failNode = getNodeById("text", "feedback_fail");	
		
		replaceText(passNode,correctText, "feedback_pass");
		replaceText(partialNode,partialText, "feedback_partial");
		replaceText(failNode,failText, "feedback_fail");
	
	}		
	
	protected void editImagePath(String id, String extension, String imageType) {
		
		String imagePath = "lib/images/content/" + getFilePath() + extension + "." + imageType;

		Node n = getNodeById("image",id);
		replaceText(n,imagePath,id);
	};	
	
	protected void editImagePath(Node n, String extension, String imageType) {
		
		String imagePath = "lib/images/content/" + getFilePath() + extension + "." + imageType;

		replaceText(n,imagePath);
	};		

	
	protected void checkImageAsset(String extension){
		//TO DO - discern between jpeg and png assets

		String directory = System.getProperty("user.dir") 
				+ "/../module1/lib/images/content/";
		
		String imagePath = directory + getFilePath() + extension;
		
		if(new File(imagePath + ".jpg").exists() == false || new File(imagePath + ".png").exists() == false){
			
			try {
				createPlaceholderImage(directory, imagePath);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}

		
	}
	
	private void createPlaceholderImage(String directory, String imagePath) throws IOException {
		
		InputStream is = null;
		OutputStream os = null;
		
		try{
			is = new FileInputStream(new File(directory + "placeholder.jpg"));
			os = new FileOutputStream(new File(imagePath + ".jpg"));
			byte[] buffer = new byte[1024];
			int length;
			while ((length = is.read(buffer)) > 0) {
                os.write(buffer, 0, length);
            }
		} finally{
			is.close();
			os.close();
		}	
	}

	protected boolean isAHeading(String line){
		line = line.replaceAll("\\(.*?\\)", "").replaceAll("\\[.*?\\]", "").trim(); //remove bracketedText
		if(isAllUpperCase(line) || isATopicHeading(line)){
			return true;
		}
		else{
			return false;
		}
	}
	
	private boolean isATopicHeading(String line) {
		
		line = line.replaceAll("\\<.*?>","").trim(); //remove html tags
		
		if(line.startsWith("Topic") || line.startsWith("TOPIC")){
			return true;
		}
		
		return false;
	}

	protected boolean isAllUpperCase(String s){
		s = s.replaceAll("\\<.*?>",""); //remove html tags
		//if line is just an html tag
		if(s.equals(" ") || s.equals("")){
			return false;
		}
		//if string is just a number
		if(isNumeric(s)){
			return false;
		}
		for(char c : s.toCharArray()){
			if(Character.isLetter(c) && Character.isLowerCase(c)){
				return false;
			}
		}
		return true;
	}	
	
	protected boolean isNumeric(String s) {
		s = s.replaceAll("\\<.*?>",""); //remove html tags
		s = s.replaceAll(" ", "");
		if(s.equals(" ")){
			return false;
		}
		try{
			double d = Double.parseDouble(s);
		}
		catch(NumberFormatException nfe){
			return false;			
		}
		return true;
	}

	public String getFilePath(){
		return this.filepath;
	}	
	
	public void setFilePath(String filepath) {
		this.filepath = filepath;
	}

	

}