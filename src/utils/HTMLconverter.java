package utils;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.util.Vector;

import org.apache.commons.lang3.StringUtils;
import org.docx4j.Docx4J;
import org.docx4j.Docx4jProperties;
import org.docx4j.convert.out.HTMLSettings;
import org.docx4j.convert.out.html.SdtToListSdtTagHandler;
import org.docx4j.convert.out.html.SdtWriter;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.safety.Whitelist;
import org.jsoup.select.Elements;

public class HTMLconverter {

	public static String convertMLtoHTML(WordprocessingMLPackage wordMLPackage,String inputfilepath) throws Docx4JException{
		
		// HTML exporter setup
		// .. the HTMLSettings object
    	HTMLSettings htmlSettings = Docx4J.createHTMLSettings();

    	
    	htmlSettings.setWmlPackage(wordMLPackage);

    	String userCSS = "html, body, div, b, span, h1, h2, h3, h4, h5, h6, p, a, img,  ol, ul, li, table, caption, tbody, tfoot, thead, tr, th, td " +
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
		//w1.addAttributes("span", "style");
		htmlString = Jsoup.clean(htmlString, w1);
		htmlString = htmlString.replace("<p>&nbsp;</p>", "").replace("&nbsp;", " "); //remove nbsp's
		htmlString = htmlString.replaceAll("<p></p>",""); //remove empty p tags
		htmlString = htmlString.replaceAll("(?m)^[ \t]*\r?\n", ""); //remove empty line breaks
		
		//BOLD TEXT
		//use DOM parser to locate 'style="font-weight:bold"' and delete other style attributes
		//htmlString = createBoldTags(htmlString);
		


		// Clean up, so any ObfuscatedFontPart temp files can be deleted 
		if (wordMLPackage.getMainDocumentPart().getFontTablePart()!=null) {
			wordMLPackage.getMainDocumentPart().getFontTablePart().deleteEmbeddedFontTempFiles();
		}		
		// This would also do it, via finalize() methods
		htmlSettings = null;
		wordMLPackage = null;
		
		return htmlString;	
	}

	private static String createBoldTags(String htmlString) {

		Document doc = Jsoup.parse(htmlString);
		Elements e = doc.getElementsByTag("span");
		
		
		for(Element element : e){
			String[] styles = element.attr("style").split(";");
			Vector<String> filteredItems = new Vector<String>();
			for(String item : styles){
				String key = (item.split(":"))[0].trim().toLowerCase();
				if(key.contains("font-weight")){
					filteredItems.add(item);
				}
			}
			if(filteredItems.size() == 0){
				element.removeAttr("style");
			} else{
				element.removeAttr("style");
				element.tagName("b");
			}
		}
		
		String s = doc.html();
		s = s.replace("<span>", "").replace("</span>", "");
		
		return s;

	}	
	
}
