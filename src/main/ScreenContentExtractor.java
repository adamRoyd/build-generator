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

public class ScreenContentExtractor {

	public ScreenContentExtractor(){

	}
	
	/*
	 * Class that returns an array list of strings that are the individual html
	 * for each screen.
	 */

	protected ArrayList<String> getScreenContent(String str){
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
           


