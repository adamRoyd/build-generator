package main;

import java.io.File;
import java.util.HashMap;

public class Main {

	public static void main(String[]args) throws Exception{

		File f = new File("DGO658005.doc");
		
		ScreenNumberExtractor w = new ScreenNumberExtractor(f);

		HashMap<String,String> m = w.findScreens(w.getDocumentAsString(w.my_word));
		
		System.out.println(m);
    }	
	
}
