package main;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.docx4j.Docx4J;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.samples.AbstractSample;

public class Main extends AbstractSample{

	// Config for non-command line version
	static {
	
    	inputfilepath = System.getProperty("user.dir") + "/scripts/simpledoc.docx";

	}	
	
	public static void main(String[]args) throws Exception {
		
		try {
			getInputFilePath(args);
		} catch (IllegalArgumentException e) {
		}
		
		// LOAD DOCUMENT
		WordprocessingMLPackage wordMLPackage;
		if (inputfilepath==null) {
			System.out.println("No imput path passed, creating dummy document");
			 wordMLPackage = WordprocessingMLPackage.createPackage();
			SampleDocument.createContent(wordMLPackage.getMainDocumentPart());	
		} else {
			System.out.println("Loading file from " + inputfilepath);
			wordMLPackage = Docx4J.load(new java.io.File(inputfilepath));
		}

		//Convert doc to html and return string
		HTMLConverter htmlConverter = new HTMLConverter();
		String documentString = htmlConverter.convertMLtoHTML(wordMLPackage, inputfilepath);
		
		//split string into an arraylist of strings, corresponding to the scrrens
		ScreenContentExtractor screenContentExtractor = new ScreenContentExtractor();
		ArrayList<String> contentList = screenContentExtractor.getScreenContent(documentString);
		
		//pass screen arrayList into the XMLbuilder that determines the template to use
		XMLManager manager = new XMLManager();
		manager.allocateScreen(contentList);
		
		//NEXT create textGraphicbuilder class to create the xml

    }	
	
}
