package main;

import org.w3c.dom.Document;

public class XMLEditor {

	TemplateMCQeditor mcq;
	
	public XMLEditor(){
		mcq = new TemplateMCQeditor();
	}
	
	
	public Document editXML(Document doc, String screenType) {
			
		if(screenType.toLowerCase().contains("multiple choice question")){
			doc = mcq.editXML(doc);
		}

		return doc;
	}

}
