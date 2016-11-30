package templates;

import org.w3c.dom.Document;

import main.XMLEditor;

public class ColumnSort extends XMLEditor{

	Document doc;
	String screenContent;
	
	public ColumnSort(Document doc, String screenContent){
		super(doc,screenContent);		
		this.doc = doc;
		this.screenContent = screenContent;
	}		
	
	public Document editXML(){
		
		
		//System.out.println(screenContent);
		
		return doc;
	};	
	
}
