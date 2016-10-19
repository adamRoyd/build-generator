package main;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.http.impl.io.SocketOutputBuffer;
import org.apache.poi.hwpf.extractor.WordExtractor;

public class ScreenNumberExtractor {
	
	//TO DO
	//put screen content into a list of hashmaps, 
	//each hashmap representing a screen	

	public ScreenNumberExtractor(){

	}

	protected ArrayList<String> getScreenContent(String str){
		//split string by its screen numbers
		Iterator<String> it = new ArrayList<String>(Arrays.asList(str.split("SCREEN 0"))).iterator();
		ArrayList<String> screens = new ArrayList<String>();
		while(it.hasNext()){
			String s = it.next();
			
			//RETURN HASHMAP OF ITEMS OF THE SCREEN
			
			screens.add(s);
			}
		
		return screens;
	}
		

	
	private boolean isScreenNumber(String s){
		return s.contains("SCREEN") && s.contains("_") && s.contains("0");


	}		
	

	private String cleanScreenNumber(String s){
		s = s.replaceAll("[^\\d_]", ""); //regEx ^(any thing thats not) \\d_ (a digit or underscore) 
		//s = s.substring(0, 6);
		return s;
	}
		

	protected HashMap<String,String> findScreens(String str){
		HashMap<String,String> screenMap = new HashMap<String,String>();
		ArrayList<String> number = new ArrayList<String>();
		ArrayList<String> type = new ArrayList<String>();
		
		//iterate and add lines to either the number or type lists
		Iterator<String> it = new ArrayList<String>
		(Arrays.asList(str.split("\n"))).iterator();
		
		while(it.hasNext()){
			String s1 = it.next();
	
			if(isScreenNumber(s1)){
				cleanScreenNumber(s1);
				number.add(s1);
				//screen type follows screen number
				it.next();
				String s2 = it.next(); 
				type.add(s2);

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
           


