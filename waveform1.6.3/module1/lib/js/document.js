/**
 * window events
 * @author Andy Galletly
 */

var doc;
var win;

var devmode = false;

if (!window.console) console = {};
if (!window.console.log) console.log = function (txt) { };
if (!window.console.trace) console.trace = function(){ console.log( "console.trace doesn't work in IE "); };
if (!window.console.warn) console.warn = function(txt){ console.log( "WARN > " + txt); };
if (!window.console.error) console.error = function(txt){ console.log( "ERROR > " + txt); };
if (!window.console.group) console.group = function(txt){ console.log( "GROUP > " + txt); };
if (!window.console.groupEnd) console.groupEnd = function(txt){ console.log( "GROUPEND " ); };

// nasty ie fix
if (!Event.prototype.preventDefault)
{
	Event.prototype.preventDefault = function ()
	{
		try
		{
			this.keyCode = 0;
		}
		catch (e)
		{}
		this.returnValue = false;
	}
}
if (!Event.prototype.stopImmediatePropagation)
{
	Event.prototype.stopImmediatePropagation = function ()
	{
		if ( devmode ) console.warn( 'stopImmediatePropagation is not a function (IE8?)' );
		this.returnValue = true;
	}
}

function isFunction(x)
{
	return Object.prototype.toString.call(x) == '[object Function]';
}

function trace(txt)
{
	//if (bDevMode) {
	console.log("TRACE " + txt);
	//}
}

function loadXML(xml_url, success_function) 
{
	
    if ( typeof loadXMLAsJavascript != 'undefined' && loadXMLAsJavascript == true ) 
	{
        setTimeout(
			function () 
			{
			    xml_url = xml_url.split('xml/')[1];
			    xml_url = "_" + xml_url.split('.xml').join('_xml');
			    var data = eval(xml_url);
			    success_function(data);
			},
			0
		);
    } else {
        $.ajax(
            {
                type: "GET",
                url: xml_url,
                dataType: "xml",
                error: xmlError,
                success: function (data) 
				{
                    success_function(data);
                }
            }
        );
    }

}

function xmlError(e, s)
{
	var sMsg = "XML " + s;
	sMsg += "\n" + e.statusText;
	sMsg += "\nIf you are running this course offline, remember some browsers cannot load xml when offline."
	alert(sMsg);
}

function init()
{
	loadJS();
	openerUpdate();
}

function openerUpdate()
{
	try
	{
		top.opener.update();
	}
	catch (e)
	{}
}

function openerClose()
{
	try
	{
		top.opener.courseClose();
	}
	catch (e)
	{}
}

function courseClose()
{	
	try
	{
		trackingObj.closeCourse() ;		
	}
	catch (e)
	{}
	try
	{
		top.opener.splashClose()
	}
	catch (e)
	{}
}
