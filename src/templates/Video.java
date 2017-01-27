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
		super(doc,screenContent);		
		this.doc = doc;
		this.screenContent = screenContent;
	}	
	
	public Document editXML(){

		editIntroText();

		addTranscript();
		
		editVideoPath();
		
		return doc;
	}

	private void editIntroText() {

		String title = getHeadingContent("TITLE");
		String introText = getHeadingContent("TEXT");
		String prompt = getHeadingContent("PROMPT");
		title = addClass(title, "title");
		prompt = addClass(prompt,"prompt");
		introText = title + introText + prompt;		
		Node textNode = getNodeById("text", "screentext");
	
		replaceText(textNode, introText);		
	}

	private void addTranscript() {
		
		String transcriptText = getHeadingContent("TRANSCRIPT");
		Element transcript = doc.createElement("transcript");
		transcript.appendChild(doc.createCDATASection(transcriptText));
		Node video = getNodeById("video", "vid");
		removeChilds(video);
		video.appendChild(transcript);
	};
	
	private void editVideoPath() {
		
		String videoPath = "lib/video/" + getFilePath() + ".mp4";
		Node video = getNodeById("video", "vid");
		NamedNodeMap attrs = video.getAttributes();
		Node srcAttr = attrs.getNamedItem("src");
		srcAttr.setTextContent(videoPath);
	};	
	
}
