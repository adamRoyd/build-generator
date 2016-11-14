package main;

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
	
	public XMLEditor(){
	}

	public Document editXML(Document doc,String screenContent){
		
		return doc;
	};
	
	public Document editXML(){
		//method should be overridden by child class
		return doc;
	}
	
	protected void replaceText(Node node, CDATASection cdata){
		removeChilds(node);
		node.appendChild(cdata);
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
	
	protected String getHeadingContent(String screenContent,String heading){
		
		//split content by paragraph breaks
		Iterator<String> it = new ArrayList<String>(Arrays.asList(screenContent.split("\\r?\\n"))).iterator();
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
					text += "\r" + line;
				}
			}
		}
		text = text.replaceAll("(?m)^[ \t]*\r?\n", "");
		return text;
	}
	
	//this method also specifies the heading on which to stop adding content
	protected String getHeadingContent(String screenContent,String startHeading,String endHeading){
		Iterator<String> it = new ArrayList<String>(Arrays.asList(screenContent.split("\\r?\\n"))).iterator();
		String text = "";
		while(it.hasNext()){
			String line = it.next();
			
			if(line.contains(startHeading) && isAHeading(line)){
				//add the rest of the lines to the text.
				//this equates to FALSE when we reach a new heading (i.e. OPTIONS)
				while(it.hasNext()){ 
					line = it.next();					
					if(line.contains(endHeading) && isAHeading(line)){
						break;
					}					
					text += "\r" + line;
				}
			}
		}
		text = text.replaceAll("(?m)^[ \t]*\r?\n", "");
		return text;
	}	
	
	protected Node getNodeById(Document doc, String nodeType, String id){
		
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
	
	private boolean isAHeading(String line){
		line = line.replaceAll("\\(.*?\\)", "").trim(); //remove bracketedText
		if(isAllUpperCase(line)){
			return true;
		}
		else{
			return false;
		}
	}
	
	protected boolean isAllUpperCase(String s){
		s = s.replaceAll("\\<.*?>",""); //remove html tags
		//if line is just an html tag
		if(s.equals(" ") || s.equals("")){
			return false;
		}
		//if string is just a number (IS THIS WISE? MAYBE ONLY USE FOR MCQ's)
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
	
	protected String addClass(String text, String classType){
		if(text == null || text.length()<3){
			return "";
		}
		String classHTML = " class=\"" + classType + "\"";  
		text = new StringBuilder(text).insert(3, classHTML).toString();
		return text;
	}	
	
	protected String getIntroText(String s){
		String title = getHeadingContent(s,"TITLE");
		String introText = getHeadingContent(s, "TEXT");
		String prompt = getHeadingContent(s,"PROMPT");
		title = addClass(title, "title");
		prompt = addClass(prompt,"prompt");
		introText = title + "\r" + introText + "\r" + prompt;	
		return introText;
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