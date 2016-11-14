package utils;

import java.util.List;

import org.docx4j.TraversalUtil;
import org.docx4j.XmlUtils;
import org.docx4j.finders.ClassFinder;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.wml.ContentAccessor;
import org.docx4j.wml.DelText;

public class AcceptAllChanges {

	public static void acceptAllChanges(WordprocessingMLPackage wordMLPackage){
			
			//get main document part
			MainDocumentPart mdp = wordMLPackage.getMainDocumentPart();
			 
			//find instances of wordML delText tag//
			ClassFinder finder = new ClassFinder(DelText.class);
			new TraversalUtil(mdp,finder);
			
			//find instances of DelText in the document and remove them
			for(Object o : finder.results){
				if(o instanceof DelText){
					DelText bm = (DelText) o;
					//System.out.println("DELTEXT VALUE: " + bm.getValue());
					try{
						// Can't just remove the object from the parent,
						// since in the parent, it may be wrapped in a JAXBElement
						List<Object> theList = null;
						if (bm.getParent() instanceof List) {
							theList = (List)bm.getParent(); // eg body.getContent()
						} else {
							theList = ((ContentAccessor)(bm.getParent())).getContent();
						}
						Object deleteMe = null;
						for (Object ox : theList) {
							if (XmlUtils.unwrap(ox).equals(bm)) {
								deleteMe = ox;
								break;
							}
						}
						if (deleteMe!=null) {
							theList.remove(deleteMe);						
						}				
					}
					catch (ClassCastException cce) {
					//	log.error(cce.getMessage(), cce);
					}
				}
			}
			
			
			//print word XML
	//		System.out.println(
	//				XmlUtils.marshaltoString(mdp.getJaxbElement(), true, true) );			
	}	
	
}
