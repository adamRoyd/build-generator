package utils;

import java.util.ArrayList;
import java.util.List;

import org.docx4j.TraversalUtil;
import org.docx4j.finders.SectPrFinder;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.openpackaging.parts.relationships.Namespaces;
import org.docx4j.relationships.Relationship;
import org.docx4j.wml.SectPr;

public class RemoveHeaderFooter {

	public static void remove(WordprocessingMLPackage wordMLPackage) throws Exception {
		
		MainDocumentPart mdp = wordMLPackage.getMainDocumentPart();

		SectPrFinder finder = new SectPrFinder(mdp);
	    new TraversalUtil(mdp.getContent(), finder);
	    for (SectPr sectPr : finder.getSectPrList()) {
	    	sectPr.getEGHdrFtrReferences().clear();
	    }
	    
	    // Remove rels
	    List<Relationship> hfRels = new ArrayList<Relationship>(); 
	    for (Relationship rel : mdp.getRelationshipsPart().getRelationships().getRelationship() ) {
	    	
	    	if (rel.getType().equals(Namespaces.HEADER)
	    			|| rel.getType().equals(Namespaces.FOOTER)) {
	    		hfRels.add(rel);
	    	}
	    }
	    for (Relationship rel : hfRels ) {
	    	mdp.getRelationshipsPart().removeRelationship(rel);
	    }

	}		
	
}
