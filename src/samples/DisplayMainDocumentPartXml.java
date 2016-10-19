
package samples;


import org.docx4j.XmlUtils;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.samples.AbstractSample;


/**
 * Simple example showing how to see the
 * document's XML (MainDocumentPart).
 * 
 * If you want to see all the parts
 * as a Flat OPC XML document, see 
 * the ExportInPackageFormat sample.
 * 
 * @author jharrop
 *
 */
public class DisplayMainDocumentPartXml extends AbstractSample {

		public static void main(String[] args) throws Exception {

			/*
			 * You can invoke this from an OS command line with something like:
			 * 
			 * java -cp dist/docx4j.jar:dist/log4j-1.2.15.jar
			 * org.docx4j.samples.DisplayMainDocumentPartXml inputdocx
			 * 
			 * Note the minimal set of supporting jars.
			 * 
			 * If there are any images in the document, you will also need:
			 * 
			 * dist/xmlgraphics-commons-1.4.jar:dist/commons-logging-1.1.1.jar
			 */

			try {
				getInputFilePath(args);
			} catch (IllegalArgumentException e) {
				inputfilepath = System.getProperty("user.dir")
						+ "/simpledoc.docx";
			}
			
			WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(new java.io.File(inputfilepath));
			MainDocumentPart documentPart = wordMLPackage.getMainDocumentPart();
			
		   	// Pretty print the main document part
			System.out.println(
					XmlUtils.marshaltoString(documentPart.getJaxbElement(), true, true) );
			
		}
		
		

	}