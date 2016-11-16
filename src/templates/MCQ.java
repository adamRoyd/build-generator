package templates;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

import main.XMLEditor;

public class MCQ extends XMLEditor{

	Document doc;
	String screenContent;
	
	public MCQ(Document doc, String screenContent){
		this.doc = doc;
		this.screenContent = screenContent;
	}

	public Document editXML(){
		
		editIntroText();
		
		editOptions();
		
		editFeedbacks();
		
		return doc;
	}

	private void editIntroText() {
		String title = getHeadingContent(screenContent,"TITLE");
		String introText = getHeadingContent(screenContent, "QUESTION TEXT");
		String prompt = getHeadingContent(screenContent,"PROMPT");
		title = addClass(title, "title");
		prompt = addClass(prompt,"prompt");
		
		introText = title + "\r" + introText + "\r" + prompt;	
		CDATASection question = doc.createCDATASection(introText);
		Node introtext = getNodeById(doc,"text", "introText");
		replaceText(introtext,question);
	};		
	
	private void editOptions() {

		String options = getHeadingContent(screenContent,"OPTIONS");
		
		options = options.replaceAll("(?m)^\\s*$[\n\r]{1,}", ""); // remove empty lines

		/* option string contains the option number, option text and true/false attribute 
		*  Iterate through the lines and perform operation in groups of threes.
		*/
		System.out.println(options);
		Iterator<String> it = new ArrayList<String>(Arrays.asList(options.split("\r"))).iterator();
		Node custom = doc.getElementsByTagName("custom").item(0);
		Node option;
		CDATASection cdata;
		int correctCount = 0; //count number of correct options
		
		while(it.hasNext()){
			
			////OPTION NUMBER////
			String optionNumber = it.next().replaceAll("\\<.*?>","").trim();
			System.out.println("OPTION NUMBER " + optionNumber);
			
			//get the corresponding option node
			option = doc.getElementsByTagName("option").item(Integer.parseInt(optionNumber) - 1);
			if(option == null){
				//clone the first node and append to custom node
				option = doc.getElementsByTagName("option").item(0).cloneNode(true);
				custom.appendChild(option);
			}
			
			//OPTION TEXT//
			String optionText = it.next();
			//System.out.println("OPTION TEXT" + optionText);
			cdata = doc.createCDATASection(optionText);
			replaceText(option,cdata);
			
			//TRUE OR FALSE ATTRIBUTE//
			String correct = it.next();
			NamedNodeMap attr = option.getAttributes();
			Node nodeAttr = attr.getNamedItem("correct");
			if(correct.toLowerCase().replaceAll("\\<.*?>","").replaceAll(" ","").equals("correct")){
				nodeAttr.setTextContent("true");
				correctCount ++;
			} else{
				nodeAttr.setTextContent("false");
			}
			
		}
		
		///MCQ SETTINGS///
		Node settings = doc.getElementsByTagName("settings").item(0);
		NamedNodeMap attr = settings.getAttributes();
		Node radioModeNode = attr.getNamedItem("radiomode");
		if(correctCount>1){
			radioModeNode.setTextContent("false");
		} else{
			radioModeNode.setTextContent("true");
		}
		
	}
	
	protected void editFeedbacks(){

		CDATASection pass = doc.createCDATASection(getHeadingContent(screenContent,"CORRECT TEXT"));
		CDATASection partial = doc.createCDATASection(getHeadingContent(screenContent,"PARTIAL TEXT"));
		CDATASection fail = doc.createCDATASection(getHeadingContent(screenContent,"INCORRECT TEXT"));
		
		Node passNode = getNodeById(doc, "text", "text_pass");
		Node partialNode = getNodeById(doc, "text", "text_partial");
		Node failNode = getNodeById(doc, "text", "text_fail");		
		
		replaceText(passNode,pass);
		replaceText(partialNode,partial);
		replaceText(failNode,fail);
	
	}	

}
