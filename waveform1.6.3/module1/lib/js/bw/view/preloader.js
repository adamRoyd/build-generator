/**
* @author Andy Galletly
*/
function Preloader( screen )
{
	var self = this;
	
	
	self.id = screen.id;
	
	if ( devmode ) console.log( 'Log PRELOADER ID ' + self.id )

	self.dispatcher = $(document.createElement('div'));	
	self.dispatcher.attr('id', ('dispatcher_preloader' + self.id ));
	self.dispatcher.attr('class', ('preloaderdispatcher') );
	
	self.loadergraphic;
	self.loadbarcontainer;
	self.loadbar;
	
	self.imageArray = []
	
	self.loadImageArray = function( _array )
	{
		if( screen.type == 'sub' )
		{
			self.holder = screen.view.screenTarget;
		}
		else
		{
			self.holder = $( '#loaderholder' );
		}	
		
		self.imageArray = self.imageArray.concat( _array );
		if ( devmode ) console.log( 'Log PRELOADER '+self.id+' loading images %o' , self.imageArray );
		if( self.imageArray.length > 0 )
		{
			self.createLoader();
			
			if( navObj.loadbar )
			{
				navObj.loadbar.width( 0 );
			}
			
			var loader = $.imgpreloader( { paths: self.imageArray } );
			loader.done( self.loadComplete );
			loader.progress( self.loadProgress );
			
			
			
		}
		else
		{
			self.loadComplete();
		}
	}
	
	self.loadProgress = function( $image, $allImages, $properImages, $brokenImages, isBroken, percentage ) 
	{
		if( self.loadbarcontainer )
		{
			if( self.loadbar )
			{
				// if ( devmode ) console.log( 'Log PERCENT ' + percentage )
				self.loadbar.css( 'width', percentage + '%' );
			}
		}
		if( isBroken )
		{
			self.loadComplete();
		}
	}
	
	self.loadComplete = function()
	{
		self.dispatcher.trigger( 'loaded' );
		if( self.loader )
		{
			self.loader.empty().remove();
		}
	}
	
	self.createLoader = function()
	{
		if( !self.loader )
		{
			// loader graphic
			self.loader = $( '<div class="preloader preloader_' + self.id + '"></div>' );
			self.loadergraphic = $( '<img src="lib/images/ui/_circle_loader.gif" />' );
			self.loadbarcontainer = $( '<div class="loadbarcontainer"></div>' );
			self.loadbar = $( '<div class="loadbar"></div>' );
			
			self.loader.append(self.loadbarcontainer);
			self.loader.append(self.loadergraphic);
			self.loadbarcontainer.append(self.loadbar);
			self.holder.append(self.loader);
		}
	};
	
	self.kill = function()
	{
		if( self.loader )
		{
			self.loader.empty().remove();
		}
		self.dispatcher.empty().remove();
	}
	
}
