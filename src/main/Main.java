/*
 *  Copyright 2016, XXXXXXXXXXXXX.
 *   
 *  This file is part of XXXXXX.
    XXXXXX is licensed under the Apache License, Version 2.0 (the "License"); 
    you may not use this file except in compliance with the License. 
    You may obtain a copy of the License at 
        http://www.apache.org/licenses/LICENSE-2.0 
    Unless required by applicable law or agreed to in writing, software 
    distributed under the License is distributed on an "AS IS" BASIS, 
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
    See the License for the specific language governing permissions and 
    limitations under the License.
 */

package main;

import java.util.ArrayList;

import org.docx4j.Docx4J;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.samples.AbstractSample;

import utils.AcceptAllChanges;
import utils.HTMLconverter;
import utils.RemoveHeaderFooter;
import utils.ScreenSplitter;

public class Main extends AbstractSample{

	// Config for non-command line version
	static {
    	inputfilepath = System.getProperty("user.dir") + "/scripts/DDP123001.docx";
	}
	

	public static void main(String[]args) throws Exception {
		
		try {
			getInputFilePath(args);
		} catch (IllegalArgumentException e) {
		}
		
		//Get project code
		//String projectCode = args[1];
		String projectCode = "ddp123001";	
		System.out.println("PROJECT CODE = " + projectCode);
		
		// Load document
		System.out.println("Loading file from " + inputfilepath);
		WordprocessingMLPackage wordMLPackage = Docx4J.load(new java.io.File(inputfilepath));
		
		//accept all changes
		AcceptAllChanges.acceptAllChanges(wordMLPackage);
		
		//Remove header and footer
		RemoveHeaderFooter.remove(wordMLPackage);

		//Convert doc to html and return string
		String documentString = HTMLconverter.convertMLtoHTML(wordMLPackage, inputfilepath);
		
		//Split string into an arraylist of strings, corresponding to the screens
		ArrayList<String> contentList = ScreenSplitter.getScreenContent(documentString);
		
		//pass screen arrayList into the XMLManager that determines the template to use
		XMLManager manager = new XMLManager();
		manager.setProjectCode(projectCode);
		manager.createScreens(contentList);
		manager.writeMaster();
		
		System.out.println("////////FINISHED//////////");

    }

}
