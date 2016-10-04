package main;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.poi.hwpf.extractor.WordExtractor;

public class ScreenNumberExtractor {
	
	FileInputStream input_document;	
	WordExtractor my_word;

	public ScreenNumberExtractor(File f) throws IOException{
		input_document = new FileInputStream(f);	
		my_word = new WordExtractor(input_document);
		input_document.close();
		cleanUpDocument(my_word);
	}
	
	protected String getDocumentAsString(WordExtractor w){
		cleanUpDocument(w);
		return w.getText();
	}
	
	private String cleanUpDocument(WordExtractor w){
		//one big string out of document
		String s = w.getText();
		//remove line breaks and duplicate spaces
		//s = s.replace("\n", "").replace("\r", "").replaceAll("\\s+", " ");
		return s;
	}
	
	protected HashMap<String,String> findScreens(String str){
		HashMap<String,String> screenMap = new HashMap<String,String>();
		ArrayList<String> number = new ArrayList<String>();
		ArrayList<String> type = new ArrayList<String>();
		
		//iterate and add lines to either the number or type lists
		Iterator<String> it = new ArrayList<String>(Arrays.asList(str.split("\n"))).iterator();
		while(it.hasNext()){
			String s1 = it.next();
			String s2 = s1;
			if(s1.contains("TYPE")){

				type.add(s1);				
			}			
			if(s2.contains("SCREEN") && s2.contains("_") && s2.contains("0")){
				s2 = s2.replaceAll("[^\\d_]",""); //regEx ^(any thing thats not) \\d_ (a digit or underscore) 
				number.add(s2);
			}
		}

		number.removeAll(Arrays.asList("",null)); //remove empty elements

		if(number.size() != type.size()){
			System.out.println("LISTS ARE DIFFERENT SIZE");
		}
		
		for(int i=0;i<type.size();i++){
			screenMap.put(number.get(i), type.get(i));
		}
		
		return screenMap;
	}	

	private String findProjectCode(String str){
		//TO DO
		return str;
	}
}
           


