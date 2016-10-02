/**
* Coursetext model version 0.1
* @author Andy Galletly
*/

function CourseText() 
{
	var self = this;
	self.oXML;
	self.arVars = new Array();
	
	var storedText =new Array();
	
	self.init = function (sXML) 
	{
	    doc = $(document);
	    win = $(window);
	    loadXML(sXML, self.xmlReady);
	}
	
	self.xmlReady = function (data) 
	{
		self.oXML = data;
 		// console.log("master.js CourseText > xmlReady");
		
		self.createVars();
		
		coursetextXMLReady()
	}
	
	self.getUrlVars = function()
	{
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push( { id:hash[0], sData:hash[1] } );
		}
		return vars;
	}
	
	self.createVars = function()
	{
		var ar_vars = [];
		// console.log("coursetext.js createVars "+ self.oXML.childNodes.length)
		
	    $(self.oXML).find('text').each(function () 
		{
	       
			var varObj = new Object();

			if( $(this).attr( 'id' ) )
			{
				varObj.id = $(this).attr( 'id' );
			}
			
			if( $(this).attr( 'target' ) )
			{
				varObj.id = $(this).attr( 'target' ).split( "." ).join( "_" );
			}
			varObj.sData = $(this).text();

			ar_vars.push( varObj );
	    })
		
		var get_vars = self.getUrlVars();
		
		for( var i = 0; i < get_vars.length; i++ )
		{
			var item = get_vars[ i ];
			ar_vars.push( item );
		}		
		
		self.arVars = ar_vars;
	}
	
	self.getVarById = function( id )
	{
		var rtn = null;
		for(var i = 0; i<self.arVars.length; i++)
		{
			var oVar = self.arVars[i];
			if(oVar.id == id)
			{
				rtn = oVar.sData;
			}
		}
		
		return rtn ;
	}
	
	self.storeText = function( str, id )
	{
		// if ( devmode ) console.log( "STORING TEXT " + id + ": " + str ) ;
		var newStoredText = { text : str.replace(/\r?\n/g, '<br />'), id : id } ;
		storedText.push ( newStoredText ) ;
	}
	
	self.retrieveText = function( id )	
	{
		var str = 'returned text!' ;
		
		for( var i = 0; i < storedText.length; i++ )
		{
			if( storedText[ i ].id == id )
			{
				str = storedText[ i ].text ;
			}
		}
		
		return str ;
	}
}