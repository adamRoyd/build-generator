
function column_sort(s)
{
	var self = this;
	
	self.screen 				= s;
	self.screen_view 		= self.screen.view;
	self.xml_node 			= null;

	// elements
	self.table;
	self.rowHolder;
	self.titleHolder;
	
	// buttons
	self.submitBtn;
	self.resetBtn;
	
	// object arrays
	self.columnArray 		= [];
	self.rowArray 			= [];
	
	// settings
	self.row_left_pos 		= 10;
	self.width 					= 500;
	self.optionwidth 		= 100;
	self.randomise 			= false;
	self.radiomode			= true;
	
	
	self.oSelectedOption = null;
	
	// console.log("screentype column_sort() obj");
	self.custom = function( model )
	{
		
		self.oModel = model;
		self.xml_node = $( self.oModel.oXML );
		
		self.width = self.xml_node.attr('width');
		
		for ( var i = 0; i < self.xml_node.children().length; i++)
		{
			var xml_node = self.xml_node.children() [ i ] ;
			switch ( xml_node.nodeName )
			{
				case "settings": 	self.createSettings( $( xml_node ) ) ;
					break;
				
				case "column": 		self.columnArray.push( new self.column( $( xml_node ), self.columnArray.length + 1 ) );
					break;
				
				case "row":			self.rowArray.push( new self.row( $( xml_node ), self.rowArray.length + 1 ) );
					break;
					
				case "fb": 			self.screen_view.createFeedback( $( xml_node ) );
					break;
			}
		}
		
		self.table = $( '<table>' );
		self.oModel.view.oDiv.append( self.table );
		
		
		
		self.createColumns();
		
		if( self.randomise )
		{
			self.rowArray = shuffleArray( self.rowArray );
		}
		
		self.createRows();

	}
	
	self.screenElementsReady = function()
	{
		self.resetBtn = self.screen.view.getScreenElementById( 'resetBtn' );
		self.submitBtn = self.screen.view.getScreenElementById( 'submitBtn' );
		self.initOptions();
		self.enableOptions();
	}
	
	self.createSettings = function(xml_node)
	{
		self.optionwidth = xml_node.attr( 'optwidth' );
		self.optionheight = xml_node.attr( 'optheight' );
		self.randomise = Boolean( xml_node.attr( 'randomise' ) != 'false' );
		self.radiomode = Boolean( xml_node.attr( 'radiomode' ) != 'false' );
	}
	
	
	self.feedback = function( xml_node )
	{
		var feedback = this;
		feedback.id = xml_node.attr( "id" );
		feedback.xml_node = xml_node;
	}
	
	self.createColumns = function()
	{
		self.titleHolder = $('<tr><th class="empty"></th></tr>');
		for(var i=0; i<self.columnArray.length; i++)
		{
			var oCol = self.columnArray[i];
			oCol.titlediv = $('<th width="'+self.optionwidth+'" style="width:'+self.optionwidth+'px">'+oCol.title+'</th>');
			self.titleHolder.append(oCol.titlediv);
			
		}
		
		self.table.append( self.titleHolder );
	}
	
	self.createRows = function()
	{
		for(var i = 0; i<self.rowArray.length; i++)
		{
			var row = self.rowArray[i];
			
			row.table_row = $('<tr>');
			//row.table_row.css('width', 	self.width);
			
			var rowstatement = $('<td class="statement">' + row.text + '</td>');
			
			if( isOdd( i ) )
			{
				row.table_row.addClass( 'odd' );
			}
			else
			{
				row.table_row.addClass( 'even' );
			}
				
			row.table_row.append( rowstatement );
			
			self.table.append(row.table_row);
			
			for(var j = 0; j<self.columnArray.length; j++)
			{
				var column = self.columnArray[j];
				var column_radio = $('<div class="radio" id="'+ self.screen.id + '_row' + row.id + '_option' + column.id + '"></div>');
				var radio_holder = $('<td class="radiocell">');
				
				column_radio.row = row;
				
				column_radio.id = column.id;
				
				row.rowOptions.push( column_radio )
				
				radio_holder.append( column_radio )
				
				row.table_row.append(radio_holder);
				
			}
			
		}
		
	}
	
	self.initOptions = function()
	{
		for(var i = 0; i<self.rowArray.length; i++)
		{
			var row = self.rowArray[i];
			
			for(var j = 0; j<row.rowOptions.length; j++)
			{
				var option = row.rowOptions[ j ];
				
				var rowheight = row.table_row.height() 
				
				applyClick(
					option,
					
					function () {
						var elm = $( this ).data( 'elm' );
						self.selectOption( elm );
					}
					
				);
			}
		}
	}
	
	
	self.enableOptions = function()
	{
		for(var i = 0; i<self.rowArray.length; i++)
		{
			var row = self.rowArray[i];
			
			for(var j = 0; j<row.rowOptions.length; j++)
			{
				var option = row.rowOptions[j];
				
				enableElement(option)
			}
		}
	
	}
	
	self.disableOptions = function()
	{
		
		for(var i = 0; i<self.rowArray.length; i++)
		{
			var row = self.rowArray[i];
			
			for(var j = 0; j<row.rowOptions.length; j++)
			{
				var option = row.rowOptions[j];
				disableElement(option)
			}
		}
	
	}
	
	self.resetOptions = function()
	{
		
		for(var i = 0; i<self.rowArray.length; i++)
		{
			var row = self.rowArray[i];
			row.selectedOption.removeClass( "selected" );
			row.selectedOption = null;
			
			for(var j = 0; j<row.rowOptions.length; j++)
			{
				var option = row.rowOptions[j];
				
				if( option.tick )
				{
					option.tick.remove();
				}
				
				option.data('selected', false);
				option.removeClass( "selected" );
				option.removeClass( "over" );

				enableElement(option)
			}
		}
	
	
	}
	
	self.column = function( xml_node, id )
	{
		// column object
		var column = this;
		column.id 		= id;
		column.title		= xml_node.text();
	}
	
	self.row = function( xml_node, id )
	{
		// row object
		var row = this;
		row.id				= id;
		row.text		= xml_node.text();
		row.correctColumn = xml_node.attr( 'correct' ).split( ',' );
		row.rowOptions = [];
		row.selectedOption = null;
		
		row.selectedOptions = function()
		{
			var selected_array = [];
			for( var i = 0; i < row.rowOptions.length; i++ )
			{
				var item = row.rowOptions[ i ];
				if( item.data('selected') )
				{
					selected_array.push( item );
				}
			}
			return selected_array;
		}
		
	}
	
	self.selectOption = function( radio )
	{
		var row = radio.row;
		
		if(	self.radiomode )
		{
			for( var i = 0; i < row.rowOptions.length; i++ )
			{
				var item = row.rowOptions[ i ];
				if( item.data('selected') )
				{
					item.data( 'selected', false );
					item.removeClass( 'selected' );
					item.removeClass( "over" );
					enableElement( item )
				}
			}
		}
		
		if( radio.data('selected') )
		{
			enableElement(radio)
			radio.removeClass( 'selected' );
			radio.removeClass( 'over' );
			radio.data( 'selected', false );
		}
		else
		{
			
			if(	self.radiomode )
			{
				disableElement(radio)
			}
			radio.addClass( 'selected' );
			radio.data( 'selected', true );
		}
		
		row.selectedOption = radio;
		
		self.checkEnableSubmit();
	}
	
	self.checkEnableSubmit = function()
	{
		var do_enable_submit = true;
		for(var i = 0; i<self.rowArray.length; i++)
		{
			var row = self.rowArray[i];
			
			if( row.selectedOptions().length<1 )
			{
				do_enable_submit = false;
			}
		}
		
		if( do_enable_submit )
		{
			self.enableSubmit();
		}
		else
		{
			self.disableSubmit();
		}
	}
	
	self.enableSubmit = function()
	{
		enableContentButton( self.submitBtn );
	}
	self.disableSubmit = function()
	{
		disableContentButton( self.submitBtn );
	}
	
	self.submit = function()
	{
		self.screen.setAnswered( true ); 
		self.disableOptions();
		
		var correct_count = 0;
		var incorrect_count = 0;
		var total_correct_options = 0;
		for(var i = 0; i<self.rowArray.length; i++)
		{
			var row = self.rowArray[i];
			
			var row_incorrect = 0;
			
			for(var j = 0; j<row.rowOptions.length; j++)
			{
				var option = row.rowOptions[j];
				
				
				if( inArray( option.id , row.correctColumn ) )
				{
					if( !self.screen.getScored() )
					{
						option.tick = $('<div class="tick"></div>')
						option.append( option.tick )
					}
					if( !option.data( 'selected' ) )
					{
						incorrect_count++;
					}
					else
					{
						correct_count++
					}
					total_correct_options ++;
				}
				else
				{
					if( option.data( 'selected' ) )
					{
						incorrect_count++;
					}
				}
			}
		}
		var is_passsed = false;
		var feedback_id = 'fail'
				
		if( ( correct_count == total_correct_options ) && ( incorrect_count < 1 ) )
		{
			is_passsed = true;
			feedback_id = 'pass';
			self.screen.pass();
		}
		else if( correct_count > 0 )
		{
			feedback_id = 'partial';
			self.screen.partial();
			
		}
		else
		{
			self.screen.fail();
		}
		
		
		disableContentButton( self.submitBtn );
	
		if( self.resetBtn && ( !self.screen.getScored() ) )
		{
			enableContentButton( self.resetBtn );
		}
		
		self.screen_view.applyFeedback( feedback_id ) ;
	}

	
	
	self.reset = function()
	{
		self.screen_view.removeFeedback();
		
		self.resetOptions()
		
		disableContentButton( self.resetBtn );
		
		self.screen_view.doClickById( 'reset' );
	}
	
	
	
}
