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
	
    	inputfilepath = System.getProperty("user.dir") + "/BOE858.docx";

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
		

		ScreenNumberExtractor screenNumberExtractor = new ScreenNumberExtractor();
		ArrayList<String> content = screenNumberExtractor.getScreenContent(documentString);
		
		//TO DO: ArrayList of screens achieved. Now split each arraylist item into a hashmap
		
	
		for(String s : content){
			System.out.println("THIS IS ANOTHER SCREEN");
			System.out.println(s);
		}
		
		//WriteXMLFile x = new WriteXMLFile();	
		//masterXML.printMaster();


    }	
	
}
