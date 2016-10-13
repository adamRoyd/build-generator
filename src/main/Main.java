package main;

import java.io.File;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.poi.util.SystemOutLogger;

public class Main {

	public static void main(String[]args) throws Exception{

		File f = new File("DGO658005.doc");
		
		ScreenNumberExtractor w = new ScreenNumberExtractor(f);

		HashMap<String,String> m = w.findScreens(w.getDocumentAsString(w.my_word));

		String[] paragraphArray = w.getDocumentAsParagraphs(w.my_word);
		
		for(int i=0;i<paragraphArray.length;i++){
			System.out.println(paragraphArray[i]);
		}
		
		
		WriteXMLFile x = new WriteXMLFile();
		
		String projectCode = "dgo658005";

		MasterXMLbuilder masterXML = new MasterXMLbuilder();
		masterXML.loadMasterFile();
		
		//iterate through map
		Iterator it = m.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
			
			//System.out.println(pair.getKey() + "=" + pair.getValue());
			
			String screenNumber = (String) pair.getKey();
			String screenType = (String) pair.getValue();
			String filepath = projectCode + "_" + pair.getKey();
			

			//writefile method creates xml file from template
			//x.writeFile("D:/eclipse/Build generator/xml/" + filepath + ".xml", screenType);
			
			//create page nodes in master xml
			//masterXML.createPageNodes(screenNumber,screenType,projectCode);	
			
			//remove to avoid errors
			it.remove();
		}
		
		//masterXML.printMaster();


    }	
	
}
