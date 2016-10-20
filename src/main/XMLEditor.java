package main;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

public class XMLEditor {



	public Document editXML(Document doc,String screenContent){
		
		String introText = getIntroTextContent(screenContent);
		
		Node text = doc.getElementsByTagName("text").item(0);
		CDATASection cdata = doc.createCDATASection(introText);
		text.appendChild(cdata);
		return doc;
	};
	
	protected String getIntroTextContent(String s){
		Iterator<String> it = new ArrayList<String>(Arrays.asList(s.split("\\r?\\n"))).iterator();
		String introText = null;
		while(it.hasNext()){
			String line = it.next();
			if(line.contains("TEXT")){
				//add the rest of the lines to the introtext.
				//this can also equate to FALSE when we reach a new element (i.e. OPTIONS)
				while(it.hasNext()){ 
					line = it.next();
					introText += "\r" + line;
					//System.out.println(line);
				}
			}

		}
		return introText;
	}



}