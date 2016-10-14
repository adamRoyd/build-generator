package main;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Main {

	public static void main(String[]args) throws Exception{

		File f = new File("DGO658005.doc");
		
		ScreenNumberExtractor w = new ScreenNumberExtractor(f);

		String documentString = w.getDocumentAsString(w.my_word);
		
		HashMap<String,String> m = w.findScreens(documentString);
		
		ArrayList<HashMap<String,String>> content = w.getScreenContent(documentString);
	
		WriteXMLFile x = new WriteXMLFile();
		
		String projectCode = "dgo658005";

		MasterXMLbuilder masterXML = new MasterXMLbuilder();
		masterXML.loadMasterFile();
		
		//iterate through map
		Iterator it = m.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
			
			System.out.println(pair.getKey() + "=" + pair.getValue());
			
			String screenNumber = (String) pair.getKey();
			String screenType = (String) pair.getValue();
			String filepath = projectCode + "_" + pair.getKey();
			

			//writefile method creates xml file from template
			//x.writeFile("/xml/" + filepath + ".xml", screenType);
			
			//create page nodes in master xml
			//masterXML.createPageNodes(screenNumber,screenType,projectCode);	
			
			//remove to avoid errors
			it.remove();
		}

		
		//masterXML.printMaster();


    }	
	
}
