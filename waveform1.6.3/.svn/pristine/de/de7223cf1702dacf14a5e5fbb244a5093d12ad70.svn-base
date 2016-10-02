
// console.log("screentype score.js");
		
function score(s)
{
	var self = this;

	this.screen 				= s;
	this.oXML 					= null;

	// elements
	this.oDiv;
	
	
	
	this.passNode;
	
	this.failNode;
	
	// console.log("screentype score() obj");
	this.custom = function( model )
	{
		this.oModel = model;
		this.oXML = this.oModel.oXML;
		this.oDiv = this.oModel.view.oDiv;
		
		for ( var i = 0; i < $(this.oXML).children().length; i++)
		{
			var xml_node = $(this.oXML).children() [ i ] ;
			// console.log( i + " - " + xml_node.nodeName );
			
			switch ( xml_node.nodeName )
			{
				case "settings": 	this.createSettings( $( xml_node ) ) ;
					break;
					
				case "pass":			this.passNode = xml_node;
					break;
					
				case "fail": 			this.failNode = xml_node;
					break;
			}
		}
		
		//currentTopic.updateScore();
		
		
	}
	
	this.createSettings = function( xml_node )
	{
		//console.log("SETTINGS")
	}
	
	this.screenElementsReady = function()
	{
		// console.log("screentype score.js screenElementsReady()");
		
		var feedback_node = this.failNode;
		
	//	trackingObj.updateScore();
		currentTopic.updateAttempts();
		var topic_score = currentTopic.getScore();
		
		if( topic_score >= currentTopic.mastery_score )
		{
			currentTopic.setCompleted();
			feedback_node = this.passNode;
		}
		
		/*
		var failtext = this.screen.view.getScreenElementById( "failtext_1" );
		*/
		
		
		// for( var i = 0; i < $(feedback_node).children().length; i++ )
		// {
			// var node = $(feedback_node).children()[ i ];
			
			
			
		trackingObj.updateTracking()
		
		this.appendFeedback( $(feedback_node) );
		
		$('.scoredata').empty().append( topic_score );
		
				var feedback_text = "";
				var topic_refs = [];
				for( var i = 0; i < currentTopic.arScreens.length; i++ )
				{
					var item = currentTopic.arScreens[ i ];
					
					if( item.topicref && ( !item.getPassed() ) )
					{
						if( $.inArray( item.topicref, topic_refs ) == -1 )
						{
							topic_refs.push( item.topicref );
						}
					}
				}
				
				topic_refs.sort();
				
				for( var i = 0; i < topic_refs.length; i++ )
				{
					var item = topic_refs[ i ];
					var item_text =  this.screen.getVar( "failtext_" + item );
					
					feedback_text += item_text;
				}
		
		$('.feedbackdata').empty().append( feedback_text );
			
	}
	
	this.appendFeedback = function( fbNode )
	{
	
		this.arFeedbackElements = [];
		this.arFeedbackElements = this.screen.view.createScreenElements( fbNode );
	
		
	
	}
	
	this.printCert = function()
	{
		console.log( "PRINT CERTIFICATE" )
	}
	
	this.restartQuiz = function()
	{
		masterObj.resetAssessment()
	}
}

