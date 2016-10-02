function ImageElementView( m )
{		
	var self = this ;
	ScreenElementView.call( self, m );
	self.url =  self.xml_node.text() ;
	self.img_element = $( '<img src="' + self.url + '" />' );
	self.url_has_desktop = false;
	self.url_has_phone = false;
	
	self.setContent = function()
	{
		self.url_has_desktop = Boolean( self.url.indexOf( '_desktop/' )>-1 )
		self.url_has_phone = Boolean( self.url.indexOf( '_phone/' )>-1 )
		
		if( self.url_has_phone || self.url_has_desktop )
		{
			self.resizeListen = true;
		}
		self.oContent.empty()
		
		self.setImage()
		
		self.oDiv.append(self.oContent);
		
	}
	
	self.super_screenSizeUpdate = self.screenSizeUpdate;
	self.screenSizeUpdate = function()
	{
		self.super_screenSizeUpdate();
		if( self.oDiv.length>0 )
		{
			
			
			if( Boolean( self.url.indexOf( '_desktop/' )>-1 ) )
			{
				if( _respondo.phone() )
				{
					self.url = self.url.split( '_desktop/' ).join( '_phone/' );
				}
			}
			if( Boolean( self.url.indexOf( '_phone/' )>-1 ) )
			{
				if( _respondo.desktop() )
				{
					self.url = self.url.split( '_phone/' ).join( '_desktop/' );
				}
			}
			
			if( self.img_element.attr( 'src' ) !=  self.url )
			{
				self.img_element.attr( 'src', self.url );
			}
		}
		
		if( self.testScreenSize() )
		{			
			self.setImage();
		}
	}
	
	self.setImage = function()
	{
		self.oContent.append( self.img_element );
		self.screen_view.arImageElements.push( self.url )
		self.oDiv.append(self.oContent);
	}
	
	
	self.swapImage = function( div, suffix )
	{
		var path;
		var img = $(div.find('img')[0]);
		
		// get / store original image path
		if (div.data( "originalImage" ) ) {
			path = div.data( "originalImage" );
			console.log("originalImage = " + path)
		} else {
			path = img.attr('src');
			div.data( "originalImage", path );
			console.log("setting originalImage to " + path)
		}
		
		// Apply suffix 
		if( suffix && suffix.length > 0 )	{
			var pathArray = path.split(".");
			var fileType = pathArray[ pathArray.length-1 ] ;
			var fileName = path.split("." + fileType)[0];
			path = fileName +  "_" + suffix + "." + fileType;
		}		
		
		img.attr( 'src', path )
	}
}
ImageElementView.prototype = ScreenElementView;