
var js_array = [];

var anticache = ""; //"?r="+Math.random(10);

var devmode = true;

if (typeof loadXMLAsJavascript != 'undefined' && loadXMLAsJavascript == true) {
    js_array.push("lib/js/complied_xml.js" + anticache);
}

js_array.push("lib/js/plugins/jPlayer/jquery.jplayer.min.js" + anticache);

js_array.push("lib/js/bw/control/respondo.js" + anticache);
js_array.push("lib/js/bw/utils/utils.js" + anticache);
js_array.push("lib/js/bw/view/view_utils.js" + anticache);
js_array.push("lib/js/bw/control/tracking.js" + anticache);

js_array.push("lib/js/bw/view/screen_elements/sprite.js" + anticache);

js_array.push("lib/js/bw/view/menu.js" + anticache);

js_array.push("lib/js/bw/view/preloader.js" + anticache);
js_array.push("lib/js/bw/view/v_screen.js" + anticache);

js_array.push("lib/js/bw/view/v_screen_element.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/text_object.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/line.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/box.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/pagecounter.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/image.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/status.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/button.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/tabs.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/pointer.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/slider_reveal.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/timed_element.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/timeline.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/timer.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/video_player.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/audio_player.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/sub_screen.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/sub_dialogue.js" + anticache);
js_array.push("lib/js/bw/view/screen_elements/score.js" + anticache);

js_array.push("lib/js/bw/model/master.js" + anticache);
js_array.push("lib/js/bw/model/coursetext.js" + anticache);
js_array.push("lib/js/bw/model/screen/screen.js" + anticache);
js_array.push("lib/js/bw/model/screen/sub_screen.js" + anticache);
js_array.push("lib/js/bw/model/screen/topic_screen.js" + anticache);
js_array.push("lib/js/bw/model/screen/dialogue_screen.js" + anticache);
js_array.push("lib/js/bw/model/screen/sub_dialogue.js" + anticache);
js_array.push("lib/js/bw/model/screen/menu_screen.js" + anticache);
js_array.push("lib/js/bw/model/screen/nav_screen.js" + anticache);
js_array.push("lib/js/bw/model/screen_element.js" + anticache);
js_array.push("lib/js/bw/model/screen_event.js" + anticache);
js_array.push("lib/js/bw/model/trigger_event.js" + anticache);
js_array.push("lib/js/bw/model/event_action.js" + anticache);
js_array.push("lib/js/bw/model/sequence_event.js" + anticache);
js_array.push("lib/js/bw/model/topic.js" + anticache);
js_array.push("lib/js/bw/model/navigation.js" + anticache);

js_array.push("lib/js/bw/screentypes/column_sort.js" + anticache);
js_array.push("lib/js/bw/screentypes/drag_drop.js" + anticache);
js_array.push("lib/js/bw/screentypes/mcq.js" + anticache);
js_array.push("lib/js/bw/screentypes/list_sort.js" + anticache);
js_array.push("lib/js/bw/screentypes/mcq_graphical.js" + anticache);
js_array.push("lib/js/bw/screentypes/parallax.js" + anticache);
js_array.push("lib/js/bw/screentypes/photostory.js" + anticache);
js_array.push("lib/js/bw/screentypes/score.js" + anticache);
js_array.push("lib/js/bw/screentypes/sliding_scale.js" + anticache);
js_array.push("lib/js/bw/screentypes/text_graphic.js" + anticache);
js_array.push("lib/js/bw/screentypes/wipe_reveal_h.js" + anticache);
js_array.push("lib/js/bw/screentypes/scroll.js" + anticache);

for (var i = 0; i < js_array.length; i++)
{
	var item = js_array[i];
	js_array[i] = item;
}

var loadedResources = {};

function processResources(resources)
{
	var hasAllResources = true;
	for (var i = 0; i < resources.length; i++)
	{

		if (!loadedResources[resources[i]])
		{
			hasAllResources = false;
		}
		loadedResources[resources[i]] = true;
	}
	if (hasAllResources)
	{
		return true;
	}
	else
	{
		return false;
	}

}

function loadJS() 
{
    if (typeof loadCompiledCSSandJavascriptAndXML != 'undefined' && loadCompiledCSSandJavascriptAndXML == true) 
    {
        jsLoaded();
    } 
    else 
    {
        Modernizr.load(
            {
                load: js_array,
                complete: jsLoaded
            }
        );
    }
}


var currentTopic;
var currentScreen;
var currentDialogue;
var menuScreen;

var previousScreen;

var _respondo = null;

var masterObj = null;
var coursetextObj = null;
var trackingObj = null;
var menuObj = null;
var navObj = null;

var coursetext_ready = false;
var master_ready = false;
var lms_ready = false;

function jsLoaded()
{
	initMaster();
	initCourseText();
}

function resetLMS()
{
	try {
		// ACTION
		trackingObj.trackingConnection.resetLMS();
		trackingObj.readTrackingFromLMS();
	}
	catch (e) {
	   if ( devmode ) console.log( 'Log CATCH ERROR %o', e )
	}
}

function initMaster()
{
		
	masterObj = new Master();
	masterObj.init("lib/xml/master.xml");
	
	trackingObj = new Tracking(masterObj);
	try {
		_editor();
	}
	catch(err) {
		if ( devmode ) console.log( 'Log NO EDITOR %o', err );
	}
	
}

function initCourseText()
{
	coursetextObj = new CourseText();
	coursetextObj.init("lib/xml/coursetext.xml");
}

function coursetextXMLReady()
{
	coursetext_ready = true;
	courseReady();
}

function masterXMLReady()
{
	master_ready = true;
	courseReady();


}

function bookmarkResume()
{
	// console.log( "bookmarkResume " + trackingObj.getBookmark() );
	jumpScreen(String(trackingObj.getBookmark()));
}

function bookmarkMenu()
{
	closeDialogue();
	menuObj.showMenu();
}

function updateTracking()
{
	trackingObj.updateTracking();
}

function courseReady()
{
	if (master_ready && coursetext_ready)
	{
		trackingObj.init();
		_respondo = new Respondo();
		// console.log("course ready");
		navObj = new Nav();

		menuObj = new Menu(masterObj);
		menuObj.createUI();
		
		_respondo.init();
		navObj.createNav();
		masterObj.courseReady();
		
	}
}

function menuReady()
{
	var bookmarked_screen = trackingObj.getBookmark();
	if (bookmarked_screen && (masterObj.getDialogueById("bookmark")))
	{
		openDialogue("bookmark");
	}
	else
	{
		menuObj.showMenu();
		if (masterObj.splashDialogue){
			openDialogue(masterObj.splashDialogue);
		}
	}
}

function loadTopic(topicID)
{
	navObj.navDir = "default";
	//navObj.showContent();
	masterObj.loadTopic(topicID);

	navObj.showTopicTitle(currentTopic.sLabel);
	navObj.inTopic();
}

function allowEnableNext()
{
	var rtn = false;
	if (currentTopic)
	{
		if (currentTopic.iCurrentPos < currentTopic.arScreens.length - 1)
		{
			rtn = true;
		}
		else if (masterObj.bNavBetweenTopics)
		{
			rtn = true;
			if ((masterObj.iCurrentPos == masterObj.arTopics.length - 1) && (currentTopic.iCurrentPos == currentTopic.arScreens.length - 1))
			{
				rtn = false;
			}
		}

		if( currentScreen )
		{
			if ( !currentScreen.getCompleted() )
			{
				rtn = false;
			}
			
			if( masterObj.getUnlockScreenMode() )
			{
				rtn = true;
			}
		}
	}
	return rtn;
}

function allowEnableBack()
{
	var rtn = false;
	if (currentTopic)
	{
		if (currentTopic.iCurrentPos > 0)
		{
			rtn = true;
		}
		else if (masterObj.bNavBetweenTopics)
		{
			rtn = true;
			if ((masterObj.iCurrentPos === 0) && (currentTopic.iCurrentPos === 0))
			{
				rtn = false;
			}
			else
			{
				var prev_topic = masterObj.getPreviousTopic();
				if( !prev_topic.getCompleted() )
				{
					rtn = false;
				}
			}
		}

		if (currentScreen.bBackLocked)
		{
			rtn = false;
		}
		if (currentTopic.assessment && (currentTopic.iCurrentPos !== 0))
		{
			rtn = false;
		}
	}
	return rtn;
}

function unlockNext()
{
	currentScreen.bNextLocked = false;
	enableNext();
}

function enableNext()
{

	if (allowEnableNext())
	{
		navObj.initNav() ;
	}
}

function openExit()
{
	openDialogue("exit");
}

function openHelp()
{
	openDialogue("help");
}

function openGlossary()
{
	openLink(getVarText("glossaryLink"));
}

function openResources()
{
	var resource_name = "resources";

	if (currentTopic && currentTopic.resourcesID)
	{
		resource_name = currentTopic.resourcesID;
	}

	if (currentScreen && currentScreen.resourcesID)
	{
		resource_name = currentScreen.resourcesID;
	}

	// console.log( "OPEN RESOURCE " + resource_name );

	openDialogue(resource_name);
}

function openDialogue(id)
{
	hideInvisibleButtons();

	masterObj.loadDialogue(id);
}

function closeDialogue()
{
	showInvisibleButtons();

	navObj.closeDialogue();
}

function backButtonPressed()
{
	navObj.backButtonPressed();
}

function nextButtonPressed()
{
	navObj.nextButtonPressed();
}

function goNext()
{

	navObj.navDir = "next";
	
	var scrn = currentTopic.arScreens[0];

	if (currentTopic.iCurrentPos < currentTopic.arScreens.length - 1)
	{
		navObj.disableBackNext();
		currentTopic.iCurrentPos++;
		
		//load screen
		scrn = currentTopic.arScreens[currentTopic.iCurrentPos];
		masterObj.loadScreen(scrn);
	}
	else
	{
		navObj.disableBackNext();
		
		// increment topic
		masterObj.iCurrentPos++;
		currentTopic = masterObj.arTopics[masterObj.iCurrentPos];
				
		// zero topicScreenIndex
		currentTopic.iCurrentPos=0;
		
		//load screen
		scrn = currentTopic.arScreens[currentTopic.iCurrentPos];
		masterObj.loadScreen(scrn);
	}
}

function goBack()
{
	navObj.navDir = "back";
	var scrn = currentTopic.arScreens[currentTopic.arScreens.length - 1];
	if (currentTopic.iCurrentPos > 0)
	{
		navObj.disableBackNext();
		currentTopic.iCurrentPos--;
		// console.log("GO BACK "+currentTopic.iCurrentPos)
		scrn = currentTopic.arScreens[currentTopic.iCurrentPos];
		masterObj.loadScreen(scrn);
	}
	else
	{
		navObj.disableBackNext();
		masterObj.iCurrentPos--;
		// console.log("GO NEXT "+currentTopic.iCurrentPos)
		currentTopic = masterObj.arTopics[masterObj.iCurrentPos];
		currentTopic.iCurrentPos = currentTopic.arScreens.length-1;
		scrn = currentTopic.arScreens[currentTopic.iCurrentPos];
		masterObj.loadScreen(scrn);
	}
}

function returnToMenu()
{
	masterObj.returnToMenu()
}

function exitCourse()
{
	//trackingObj.closeCourse();
	top.close();
}

function getPrevIntro()
{
	var ret_obj = null;
	var arr = currentTopic.arScreens;
	var curScrnObj = currentScreen;
		for (var i = 0; i < arr.length; i++)
		{
			var scrn = arr[i];
			if (scrn == curScrnObj)
			{
				break;
			}
			if (scrn.bHasIntro)
			{
				ret_obj = scrn;
			}
		}
		return ret_obj;
}


function loadMenuScreen()
{
	// console.log("course.js > Load current screen");

	menuScreen = masterObj.getMenuById("menuscreen");
	menuObj.oMenuScreen = menuScreen;

	menuScreen.initScreen($('#menuscreen'));

}

function loadCurrentDialogue()
{

	if (currentDialogue)
	{

		if (currentScreen)
		{
			currentScreen.view.disable();
		}

		// console.log("course.js > Load current dialogue");

		if (navObj)
		{
			navObj.showDialogueWindow();
		}
		currentDialogue.initScreen($('#dialogueholder'));

	}
}

function screenReady(type)
{

	switch (type)
	{
		case "menu":
			tweenTo($('#menuscreen'), 0.3,{	autoAlpha : 1, display : 'block'	});

			tweenTo($('#screenHolder_menuscreen'), 0.3,	{ autoAlpha : 1, display : 'block' } );

			menuReady();
			menuObj.showMenu();
			menuObj.disableMenuButtons();
			menuObj.enableMenuButtons();
			break;
		case "dialogue":
			navObj.initDialogueWindow();
			break;
		case "sub":
			// nothin'
			break;
		case "navigation":
		
			break ;
		default:
			// updateTracking();
			// hideMenu();
			// navObj.showContent();
			break;
	}
}

function hideMenu()
{
	menuObj.hideMenu();
}

function unlockFirstTopic()
{
	menuObj.unlockFirstTopic() ;
}


var sound_muted = false;
function muteSound()
{
	sound_muted = true;
	
	var $sounds = $('.jp-flat-audio');
	if( $sounds.length>0 )
	{
		$sounds.data('control').reset();
	}
}

function unmuteSound()
{
	sound_muted = false;
	var $sounds = $('.jp-flat-audio');
	if( $sounds.length>0 )
	{
		$sounds.data('control').play();
	}
}