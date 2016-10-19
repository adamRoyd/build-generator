package main;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;

import org.docx4j.Docx4J;
import org.docx4j.Docx4jProperties;
import org.docx4j.convert.out.HTMLSettings;
import org.docx4j.convert.out.html.SdtToListSdtTagHandler;
import org.docx4j.convert.out.html.SdtWriter;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

public class HTMLConverter {

	public HTMLConverter(){
		
	}
	
	protected String convertMLtoHTML(WordprocessingMLPackage wordMLPackage,String inputfilepath) throws Docx4JException{
		
		// HTML exporter setup (required)
		// .. the HTMLSettings object
    	HTMLSettings htmlSettings = Docx4J.createHTMLSettings();

    	htmlSettings.setWmlPackage(wordMLPackage);
    	

    	String userCSS = "html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, img,  ol, ul, li, table, caption, tbody, tfoot, thead, tr, th, td " +
    			"{ margin: 0; padding: 0; border: 0;}" +
    			"body {line-height: 1;} ";
    	htmlSettings.setUserCSS(userCSS);

    	// list numbering:  comment out 1 or other of the following, depending on whether
    	// you want list numbering hardcoded, or done using <li>.
    	SdtWriter.registerTagHandler("HTML_ELEMENT", new SdtToListSdtTagHandler()); 
//    	htmlSettings.getFeatures().remove(ConversionFeatures.PP_HTML_COLLECT_LISTS);
		
		// output to an OutputStream.		
		OutputStream os = new ByteArrayOutputStream();


		// If you want XHTML output
    	Docx4jProperties.setProperty("docx4j.Convert.Out.HTML.OutputMethodXML", true);
    	
    	//plug in html settings into stream
		Docx4J.toHTML(htmlSettings, os, Docx4J.FLAG_EXPORT_PREFER_XSL);
		String htmlString = ((ByteArrayOutputStream)os).toString();

		//CLEAN UP HTML CODE
		Whitelist w1 = Whitelist.simpleText();
		w1.addTags("p", "ul", "b", "li","strong","ol");
		String clean = Jsoup.clean(htmlString, w1);
		clean = clean.replace("<p>Â&nbsp;</p>", "");
		clean = clean.replace("Â&nbsp;", " ");
		clean = clean.replaceAll("(?m)^[ \t]*\r?\n", ""); //remove empty line breaks
		//System.out.println(clean);
	
		
		// Clean up, so any ObfuscatedFontPart temp files can be deleted 
		if (wordMLPackage.getMainDocumentPart().getFontTablePart()!=null) {
			wordMLPackage.getMainDocumentPart().getFontTablePart().deleteEmbeddedFontTempFiles();
		}		
		// This would also do it, via finalize() methods
		htmlSettings = null;
		wordMLPackage = null;
		
		return clean;	
	}
	
}
