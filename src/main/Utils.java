package main;


import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.docx4j.Docx4J;
import org.docx4j.Docx4jProperties;
import org.docx4j.TraversalUtil;
import org.docx4j.XmlUtils;
import org.docx4j.convert.out.HTMLSettings;
import org.docx4j.convert.out.html.SdtToListSdtTagHandler;
import org.docx4j.convert.out.html.SdtWriter;
import org.docx4j.finders.ClassFinder;
import org.docx4j.finders.SectPrFinder;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.openpackaging.parts.relationships.Namespaces;
import org.docx4j.relationships.Relationship;
import org.docx4j.wml.ContentAccessor;
import org.docx4j.wml.DelText;
import org.docx4j.wml.SectPr;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

public class Utils {

	
	protected static String convertMLtoHTML(WordprocessingMLPackage wordMLPackage,String inputfilepath) throws Docx4JException{
		
		// HTML exporter setup
		// .. the HTMLSettings object
    	HTMLSettings htmlSettings = Docx4J.createHTMLSettings();

    	
    	htmlSettings.setWmlPackage(wordMLPackage);

    	String userCSS = "html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, img,  ol, ul, li, table, caption, tbody, tfoot, thead, tr, th, td " +
    			"{ margin: 0; padding: 0; border: 0;}" +
    			"body {line-height: 1;} ";
    	htmlSettings.setUserCSS(userCSS);

    	// list numbering
    	SdtWriter.registerTagHandler("HTML_ELEMENT", new SdtToListSdtTagHandler()); 

		// output to an OutputStream.		
		OutputStream os = new ByteArrayOutputStream();

		// XHTML output
    	Docx4jProperties.setProperty("docx4j.Convert.Out.HTML.OutputMethodXML", true);

    	//plug in html settings into stream
		Docx4J.toHTML(htmlSettings, os, Docx4J.FLAG_EXPORT_PREFER_XSL);
		String htmlString = ((ByteArrayOutputStream)os).toString();

		//CLEAN UP HTML CODE
		Whitelist w1 = Whitelist.simpleText();
		w1.addTags("p", "ul", "b", "li","strong","ol");
		htmlString = Jsoup.clean(htmlString, w1);
		htmlString = htmlString.replace("<p>&nbsp;</p>", "").replace("&nbsp;", " "); //remove nbsp's
		htmlString = htmlString.replaceAll("<p></p>",""); //remove empty p tags
		htmlString = htmlString.replaceAll("(?m)^[ \t]*\r?\n", ""); //remove empty line breaks

		
		//System.out.println(htmlString);
		
		// Clean up, so any ObfuscatedFontPart temp files can be deleted 
		if (wordMLPackage.getMainDocumentPart().getFontTablePart()!=null) {
			wordMLPackage.getMainDocumentPart().getFontTablePart().deleteEmbeddedFontTempFiles();
		}		
		// This would also do it, via finalize() methods
		htmlSettings = null;
		wordMLPackage = null;
		
		return htmlString;	
	}
	
	
	protected static void removeHFFromFile(WordprocessingMLPackage wordMLPackage) throws Exception {
		
		MainDocumentPart mdp = wordMLPackage.getMainDocumentPart();

		SectPrFinder finder = new SectPrFinder(mdp);
	    new TraversalUtil(mdp.getContent(), finder);
	    for (SectPr sectPr : finder.getSectPrList()) {
	    	sectPr.getEGHdrFtrReferences().clear();
	    }
	    
	    // Remove rels
	    List<Relationship> hfRels = new ArrayList<Relationship>(); 
	    for (Relationship rel : mdp.getRelationshipsPart().getRelationships().getRelationship() ) {
	    	
	    	if (rel.getType().equals(Namespaces.HEADER)
	    			|| rel.getType().equals(Namespaces.FOOTER)) {
	    		hfRels.add(rel);
	    	}
	    }
	    for (Relationship rel : hfRels ) {
	    	mdp.getRelationshipsPart().removeRelationship(rel);
	    }

	}	
	
	protected static void acceptAllChanges(WordprocessingMLPackage wordMLPackage){
		
		//get main document part
		MainDocumentPart mdp = wordMLPackage.getMainDocumentPart();
		 
		//find instances of wordML delText tag//
		ClassFinder finder = new ClassFinder(DelText.class);
		new TraversalUtil(mdp,finder);
		
		//find instances of DelText in the document and remove them
		for(Object o : finder.results){
			if(o instanceof DelText){
				DelText bm = (DelText) o;
				//System.out.println("DELTEXT VALUE: " + bm.getValue());
				try{
					// Can't just remove the object from the parent,
					// since in the parent, it may be wrapped in a JAXBElement
					List<Object> theList = null;
					if (bm.getParent() instanceof List) {
						theList = (List)bm.getParent(); // eg body.getContent()
					} else {
						theList = ((ContentAccessor)(bm.getParent())).getContent();
					}
					Object deleteMe = null;
					for (Object ox : theList) {
						if (XmlUtils.unwrap(ox).equals(bm)) {
							deleteMe = ox;
							break;
						}
					}
					if (deleteMe!=null) {
						theList.remove(deleteMe);						
					}				
				}
				catch (ClassCastException cce) {
				//	log.error(cce.getMessage(), cce);
				}
			}
		}
		
		
		//print word XML
//		System.out.println(
//				XmlUtils.marshaltoString(mdp.getJaxbElement(), true, true) );			
	}
	

	
	
	protected static ArrayList<String> getScreenContent(String str){
		//split string by its screen numbers
		Iterator<String> it = new ArrayList<String>(Arrays.asList(str.split("SCREEN 0"))).iterator();
		ArrayList<String> screens = new ArrayList<String>();
		while(it.hasNext()){
			String s = it.next();
			screens.add(s);
			}
		
		return screens;
	}	

		
}
 



