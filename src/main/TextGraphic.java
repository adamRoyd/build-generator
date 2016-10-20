package main;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

public class TextGraphic extends XMLEditor{


	public Document editXML(Document doc,String screenContent){
		
		String introText = getIntroTextContent(screenContent);
		
		Node text = doc.getElementsByTagName("text").item(0);
		CDATASection cdata = doc.createCDATASection(introText);
		text.appendChild(cdata);
		return doc;
	};
	
	
	
}
