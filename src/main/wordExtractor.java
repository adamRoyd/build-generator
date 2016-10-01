package main;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

import org.apache.poi.hwpf.extractor.WordExtractor;

public class wordExtractor {
	
	public static void main(String[]args) throws Exception{
	
		FileInputStream input_document = new FileInputStream(new File("DGO658005.doc"));
		
		WordExtractor my_word = new WordExtractor(input_document);
		
		input_document.close();
		
		//string of document (getparagraphtext?)
		String text = my_word.getText();
		
		//remove line breaks
		text = text.replace("\n", "").replace("\r", "");
		
		//remove duplicate spaces
		text = text.replaceAll("\\s+", " ");
		
		//string to array
		String strArray[] = text.split(" ");
		
		//to arraylist
		ArrayList<String> list = new ArrayList<String>(Arrays.asList(strArray));
		
		//iterator
		Iterator<String> it = list.iterator();
		String s;
		while(it.hasNext()){
			s = it.next();
			if(!s.contains("SCREEN")){
				it.remove();
			}
		}
		
		for(String str : list){
			System.out.println(str);
		}
		

    }
           
}

