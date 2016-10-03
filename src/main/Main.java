package main;

import java.io.File;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Main {

	public static void main(String[]args) throws Exception{

		File f = new File("DGO658005.doc");
		
		
		
		ScreenNumberExtractor w = new ScreenNumberExtractor(f);

		HashMap<String,String> m = w.findScreens(w.getDocumentAsString(w.my_word));
		
		WriteXMLFile x = new WriteXMLFile();
		
		String projectCode = "dgo658005";
		
		//iterate through map
		Iterator it = m.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
			//System.out.println(pair.getKey() + "=" + pair.getValue());
			
			String filepath = projectCode + "_" + pair.getKey();
			String screenType = (String) pair.getValue();
			
			x.writeFile("xml/" + filepath + ".xml", screenType);
			
			it.remove();
		}
		

		
		//System.out.println(x.doc.getLocalName());
    }	
	
}
