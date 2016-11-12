package templates;

import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

import main.XMLEditor;

public class Video extends XMLEditor{
	
	Document doc;
	String screenContent;
	
	public Video(Document doc, String screenContent){
		this.doc = doc;
		this.screenContent = screenContent;
	}	
	
	public Document editXML(Document doc,String screenContent){
		
		editIntroText();

		addTranscript(doc,screenContent);
		
		editVideoPath(doc);
		
		return doc;
	}

	private void editIntroText() {

		String title = getHeadingContent(screenContent,"TITLE");
		String introText = getHeadingContent(screenContent, "TEXT");
		String prompt = getHeadingContent(screenContent,"PROMPT");
		title = addClass(title, "title");
		prompt = addClass(prompt,"prompt");
		introText = title + introText + prompt;		
		Node textNode = getNodeById(doc, "text", "screentext");
		CDATASection cdata = doc.createCDATASection(introText);
		replaceText(textNode, cdata);		
	}

	private void addTranscript(Document doc, String screenContent) {
		
		String transcriptText = getHeadingContent(screenContent,"TRANSCRIPT");
		Element transcript = doc.createElement("transcript");
		transcript.appendChild(doc.createCDATASection(transcriptText));
		Node video = getNodeById(doc, "video", "vid");
		removeChilds(video);
		video.appendChild(transcript);
	};
	
	private void editVideoPath(Document doc) {
		
		String videoPath = "lib/video/" + getFilePath() + ".mp4";
		Node video = getNodeById(doc, "video", "vid");
		NamedNodeMap attrs = video.getAttributes();
		Node srcAttr = attrs.getNamedItem("src");
		srcAttr.setTextContent(videoPath);
	};	
	
}
