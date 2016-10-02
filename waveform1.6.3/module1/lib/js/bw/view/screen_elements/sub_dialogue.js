function SubDialogueView( m )
{		
	var self = this ;
	ScreenElementView.call(self, m);
		
	self.screenObject = new SubDialogue( self.xml_node, self );
	self.oModel.animtype = "hidden";
	self.closebtn = Boolean( self.xml_node.attr( 'closebtn' ) != 'false' );
	
	self.bitId = self.oModel.bitId;
	
	self.$maskDiv = $( '<div class="dialoguemask" />' );
	self.$holderDiv = $( '<div class="dialogueholder" />' );
	self.$closeBtn = $( '<div class="dialogueCloseBtn" />' );
	self.$closeBtn.append( getVarText( "dialogue_close_label" ));

	self.closeEvent = null;
	if( self.xml_node.attr( 'closeevent' ) )
	{
		self.closeEvent = self.xml_node.attr( 'closeevent' );
	}
	
	
	self.setContent = function()
	{
		tweenTo( self.oDiv, 0, { autoAlpha: 0, display: 'none' } );
		self.oDiv.append( self.$maskDiv );
		self.oDiv.append( self.$holderDiv );
		self.oDiv.css({
			'top': '0px',
			'left': '0px',
			'height': '100%',
			'width': '100%'
		});
		
		if( !self.oModel.y )
		{
			self.oModel.y = ( 644 - self.oModel.height ) / 2;
		}
		if( !self.oModel.x )
		{
			self.oModel.x = ( 1014 - self.oModel.width ) / 2;
		}
		
		
		self.$holderDiv.css({
			'position': 'absolute',
			'top': self.oModel.y + 'px',
			'left': self.oModel.x + 'px',
			'height': self.oModel.height + 'px',
			'width': self.oModel.width + 'px'
		});
		
	}
	
	self.appendClose = function()
	{

		self.$holderDiv.append( self.$closeBtn );
		
		
		applyClick
		(
			self.$closeBtn,
		
			self.hide
		);	
	}
	
	self.load = function()
	{
		if( self.closebtn )
		{
			self.appendClose()
		}
		self.screenObject.dispatcher.bind( 'ready' , self.show );
		self.screenObject.initScreen( self.$holderDiv );
	}
	
	self.show = function()
	{
		masterObj.setBit( self.oModel.bitId );
		self.screenObject.dispatcher.unbind( 'ready' , self.show );
		if ( devmode ) console.log( 'Log SHOW' )
	
		tweenTo( self.$maskDiv, 0.5, { autoAlpha: 1, display: 'block' } );
		//tweenTo( self.$holderDiv, 0.5, { autoAlpha: 1, display: 'block' } );
		tweenTo( self.oDiv, 0.5, { autoAlpha: 1, display: 'block' } );
		
		
		tweenTo(self.$holderDiv, 0, {autoAlpha:0, left: self.oModel.x, top: self.oModel.y, rotationX:-90, transformOrigin:"50% 50% 200", transformPerspective:-800});
		tweenTo(self.$holderDiv, 0.5, {autoAlpha:1, left: self.oModel.x, top: self.oModel.y, display:'block', rotationX:0, transformOrigin:"50% 50% 200", transformPerspective:-800, ease: Back.easeOut, clearProps:"transform"});
	}
	
	self.hide = function()
	{
		tweenTo( self.$maskDiv, 0.5, { autoAlpha: 0, display: 'none' } );
		//tweenTo( self.$holderDiv, 0.5, { autoAlpha: 0, display: 'none' } );
		tweenTo( self.oDiv, 0.5, { autoAlpha: 0, display: 'none' } );
		
		
		tweenTo( self.$holderDiv, 0, {autoAlpha:1, left: self.oModel.x, top: self.oModel.y, display:'block', rotationX:0, transformOrigin:"50% 50% 200", transformPerspective:-800});
		tweenTo( self.$holderDiv, 0.3, {autoAlpha:0, display:'none', left: self.oModel.x, rotationX:90, transformOrigin:"50% 50% 200", transformPerspective:-800, onComplete:function()
			{
				masterObj.revertBit();
				self.screenObject.kill();
				self.$holderDiv.empty();
				if(self.closeEvent)
				{
					self.screen_view.doClickById( self.closeEvent );
				}
			}
		});
		
		
	}
	
}
SubDialogueView.prototype = ScreenElementView;