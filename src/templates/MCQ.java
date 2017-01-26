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
		super(doc,screenContent);		
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
		String introText = getHeadingContent("QUESTION TEXT");
		String prompt = getHeadingContent("PROMPT");
		prompt = addClass(prompt,"prompt");
		
		introText = introText + "\n" + prompt;	
		CDATASection question = doc.createCDATASection(introText);
		Node introTextNode = getNodeById("text", "screentext");
		replaceText(introTextNode,question);
	};		
	
	private void editOptions() {

		String options = getHeadingContent("OPTIONS");
		
		options = options.replaceAll("(?m)^\\s*$[\n\r]{1,}", ""); // remove empty lines

		/* 
		 * option string contains the option number, option text and true/false attribute 
		*  Iterate through the lines and perform operation in groups of threes.
		*/
		
		Iterator<String> it = new ArrayList<String>(Arrays.asList(options.split("\n"))).iterator();
		Node custom = doc.getElementsByTagName("custom").item(0);
		Node option;
		CDATASection cdata;
		int correctCount = 0;
		
		while(it.hasNext()){
			
			////OPTION NUMBER////
			String optionNumber = it.next().replaceAll("\\<.*?>","").replaceAll(" ","");
			//System.out.println("OPTION NUMBER " + optionNumber);
			
			//get the corresponding option node
			option = doc.getElementsByTagName("option").item(Integer.parseInt(optionNumber) - 1);
			if(option == null){
				//clone the first node and append to custom node
				option = doc.getElementsByTagName("option").item(0).cloneNode(true);
				custom.appendChild(option);
			}
			
			/////OPTION TEXT/////
			String optionText = it.next();
			//System.out.println("OPTION TEXT" + optionText);
			cdata = doc.createCDATASection(optionText);
			replaceText(option,cdata);
			
			////TRUE OR FALSE ATTRIBUTE////
			String correct = it.next();

			if(correct.toLowerCase().replaceAll("\\<.*?>","").trim().equals("correct")){
				editAttribute(option, "correct", "true");
				correctCount ++;
			} else{
				editAttribute(option, "correct", "false");
			}
			
		}
		
		///MCQ SETTINGS///
		Node settings = doc.getElementsByTagName("settings").item(0);

		if(correctCount>1){
			editAttribute(settings, "radiomode", "false");
		} else{
			editAttribute(settings, "radiomode", "true");
		}
		
	}
	
	protected void editFeedbacks(){

		CDATASection pass = doc.createCDATASection(getHeadingContent("CORRECT TEXT"));
		CDATASection partial = doc.createCDATASection(getHeadingContent("PARTIAL TEXT"));
		CDATASection fail = doc.createCDATASection(getHeadingContent("FAIL TEXT"));
		
		Node passNode = getNodeById("text", "feedback_pass");
		Node partialNode = getNodeById("text", "feedback_partial");
		Node failNode = getNodeById("text", "feedback_fail");		
		
		replaceText(passNode,pass);
		replaceText(partialNode,partial);
		replaceText(failNode,fail);
	
	}	

}
