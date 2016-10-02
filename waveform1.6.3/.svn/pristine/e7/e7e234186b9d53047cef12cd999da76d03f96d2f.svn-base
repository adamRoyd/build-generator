/**
* @author Andy Galletly
*/

function TabsElementView( m )
{		
	var self = this ;
	ScreenElementView.call( self, m );
	self.click_nodes = [];
	self.reveal_nodes = [];
	self.click_array = [];
	self.reveal_array = [];
	self.auto_select_delay = 0;
	self.current_click = null;
	
	self.setContent = function()
	{
		self.resizeListen = true;
		self.oDiv.append(self.oContent);
	
		for( var i = 0; i < self.xml_node.children().length; i++ )
		{
			var item = self.xml_node.children()[ i ];
			switch( item.nodeName )
			{
				case 'click': self.click_nodes.push(item);
					break;
				case 'reveal': self.reveal_nodes.push(item);
					break;
			}
		}
	
		if( self.xml_node.attr( 'autoselectdelay' ) )
		{
			self.auto_select_delay = self.xml_node.attr( 'autoselectdelay' )
		}
	
		self.createClicks();
		self.createReveals();
		
		TweenMax.delayedCall(0, self.attachRevealContent)
		TweenMax.delayedCall( self.auto_select_delay, self.autoSelect)
	}
	
	self.super_screenSizeUpdate = self.screenSizeUpdate;
	self.screenSizeUpdate = function()
	{
		self.super_screenSizeUpdate();
		
		if( _respondo.desktop() )
		{
			self.revealholder.remove();
			self.clickholder.after( self.revealholder );
			if( ! self.current_click )
			{
				self.autoSelect();
			}
		}
		
		if( self.current_click )
		{
			self.selectTab( self.current_click );
		}
	}
	self.createClicks = function()
	{
		self.clickholder = $( '<div class="clickholder">' );
		self.oContent.append( self.clickholder );
		
		var click_xml_nodes = self.click_nodes
		for( var i = 0; i < click_xml_nodes.length; i++ )
		{
			var item = $( click_xml_nodes[ i ] );
			
			var clickdiv = $( '<div class="click">' );
			clickdiv.data( 'id', i );
			clickdiv.data( 'event', item.attr( 'event' ) );
			clickdiv.data( 'selected', item.attr( 'selected' ) );
			clickdiv.append( item.text() );
			self.clickholder.append( clickdiv )
			applyClick(
				clickdiv,
				function () 
				{
					var elm = $( this ).data( 'elm' );
					self.selectTab( elm );	
				}
			)	
			self.click_array.push( clickdiv );
			
		}
	}
	
	self.createReveals = function()
	{
		self.revealholder = $( '<div class="revealholder">' );
		self.oContent.append( self.revealholder );
		
		var reveal_xml_nodes = self.reveal_nodes
		for( var i = 0; i < reveal_xml_nodes.length; i++ )
		{
			var item = $( reveal_xml_nodes[ i ] );
			var div_id = self.idprefix + self.oModel.id + '_reveal_' + i ;
			var revealdiv = $( '<div class="reveal" id="' + div_id + '">' );
			revealdiv.data( 'id', i );
			self.revealholder.append( revealdiv );
			
			var boxchildren = item.children();
			for( var j = 0; j < boxchildren.length; j++ )
			{
				var node = $( boxchildren [ j ] )
				
				node.attr( 'target', div_id );
				if( !node.attr( 'id' ) )
				{
					node.attr( 'id', div_id + "_item" + j );
				}
			}
			revealdiv.xml = item;
			
			tweenTo( revealdiv, 0, { autoAlpha: 0, display: 'none' } );
			self.reveal_array.push( revealdiv );
		}
	}
	
	self.attachRevealContent = function()
	{
		for( var i = 0; i < self.reveal_array.length; i++ )
		{
			var item = self.reveal_array[ i ];
			
			self.screen_view.createScreenElements( item.xml );
		}
	}
	
	self.autoSelect = function()
	{
		for( var i = 0; i < self.click_array.length; i++ )
		{
			var item = self.click_array[ i ];
			if( item.data( 'selected' ) == 'true' )
			{
				if( _respondo.desktop() )
				{
					self.selectTab( item );
				}
			}
		}
	}
	
	self.closeTab = function()
	{
		for( var i = 0; i < self.click_array.length; i++ )
		{
			var item = self.click_array[ i ];
			item.removeClass( 'selected' );
			applyClick(
				item,
				function () 
				{
					var elm = $( this ).data( 'elm' );
					self.selectTab( elm );	
				}
			);
		}
		self.current_click = null;
			
		for( var i = 0; i < self.reveal_array.length; i++ )
		{
			var item = self.reveal_array[ i ];
		
			item.addClass('inactive')
			if( _respondo.desktop() )
			{
				tweenTo( item, 0.2, { autoAlpha: 0, y: self.revealholder.height() } );
			}
			else
			{
				tweenTo( item, 0, { autoAlpha: 0,y: 0 } );
			}

		}
	
	}
	
	self.selectTab = function( click )
	{
		var reveal = self.reveal_array[ click.data( 'id' ) ];
		if( self.current_click )
		{
			self.closeTab();
		}
		self.current_click = click
		self.current_click.addClass( 'selected' );
		
		for( var i = 0; i < self.reveal_array.length; i++ )
		{
			var item = self.reveal_array[ i ];
			if( item != reveal )
			{
				item.addClass('inactive')
				if( _respondo.desktop() )
				{
					tweenTo( item, 0.2, { autoAlpha: 0, y: self.revealholder.height() } );
				}
				else
				{
					tweenTo( item, 0, { autoAlpha: 0,y: 0 } );
				}
	
			}
		}
		
		var startfunc = function()
		{ 	
			for( var i = 0; i < self.click_array.length; i++ )
			{
				var item = self.click_array[ i ];
				enableElement( item )
			}
			disableElement( click )
		};
		
		var completefunc = function()
		{ 
			self.screen_view.doClickById( click.data('event') ) 
			if( _respondo.phone() )
			{
				self.revealholder.remove();
				click.after( self.revealholder );
				var scrollYPos = click.offset().top - 70;
				tweenTo(window, 0.5, {scrollTo:{y:scrollYPos, x:0}, ease:Power4.easeOut});
			
			
			
				applyClick(
					self.current_click,
					function()
					{
						self.current_click.removeClass( 'selected' );
						self.closeTab()
					}
				)	
				enableElement( click )
			}
		};
		
		reveal.removeClass('inactive')
		
		if( _respondo.desktop() )
		{
			tweenTo( reveal, 0, { autoAlpha: 0, display: 'block', y: 0-self.revealholder.height() } );
			tweenTo( reveal, 0.3, { autoAlpha: 1, y: 0, onStart: startfunc, onComplete: completefunc } );
		}
		else
		{
			tweenTo( reveal, 0, { autoAlpha: 0, y: 0, transform: null, display: 'block' } );
			tweenTo( reveal, 0, { autoAlpha: 1, onStart: startfunc, onComplete: completefunc } );
		}
	}
	
	
}
TabsElementView.prototype = ScreenElementView;
