package utils;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;


public class ScreenSplitter{
	
	public static ArrayList<String> getScreenContent(String str){
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
 



