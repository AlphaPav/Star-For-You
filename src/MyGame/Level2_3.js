/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Level2_3() {
    
    this.kSprite = "assets/animation.png";
    this.kHole = "assets/Hole.png";
    this.kRubbish="assets/2D_GAME_rubbish.png";
    this.kStar = "assets/yellow.png";
    this.kDoor="assets/2D_GAME_door.png";
    // The camera to view the scene
    this.mCamera = null;
    this.mCamera2=null;
    
    this.mPlatformset = null;
    this.mRubbishset = null;
    this.mStarset = null;
    this.mAllObjs=  null;
    this.mCollisionInfos = [];
  
    this.mCurrentObj = 0;
    this.mHero = null;
    
    this.mCui = null;
    this.mStaritem = null;
    this.mMsg = null;
    
    this.size=0;
    this.flag=0;
    
    this.starcount = 0;
    this.totalcount = 10;
    this.springcount = 0;
    this.springflag = 0;
    this.springfirst = 0;
    
    this.restart = true;
    this.skip=false;
    this.mKeyNBar= null;
    this.time= 0;
    this.LastKeyNTime=0;
    this.KeyNCount=0;
}

gEngine.Core.inheritPrototype(Level2_3, Scene);


Level2_3.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kDoor);
    gEngine.Textures.loadTexture(this.kSprite);
    gEngine.Textures.loadTexture(this.kHole);
    gEngine.Textures.loadTexture(this.kRubbish);
    gEngine.Textures.loadTexture(this.kStar);
    if(gEngine.ResourceMap.isAssetLoaded("star")){
        //this.mCui = gEngine.ResourceMap.retrieveAsset("Cui");
        this.starcount = gEngine.ResourceMap.retrieveAsset("star");
    }
    
};

Level2_3.prototype.unloadScene = function () {
     gEngine.Textures.unloadTexture(this.kDoor);
    gEngine.Textures.unloadTexture(this.kSprite);
    gEngine.Textures.unloadTexture(this.kHole);
    gEngine.Textures.unloadTexture(this.kRubbish);
    gEngine.Textures.unloadTexture(this.kStar);
 
    if(this.skip)
      {
          var nextLevel =new Level3();
          gEngine.Core.startScene(nextLevel);
      }
      else{
          if(this.restart){
               var nextLevel =new Level2_3();
               gEngine.Core.startScene(nextLevel);
           }
           else{
                gEngine.ResourceMap.loadstar("star",this.starcount);
                if(this.starcount<this.totalcount){
                    var new_level=new LoseScene(2);
                    gEngine.Core.startScene(new_level);
                }
                else{
                    var new_level=new Level3();
                    gEngine.Core.startScene(new_level);
                }
           }
      }
    //gEngine.ResourceMap.asyncLoadRequested()("Cui",this.mCui);
   
};

Level2_3.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(560, 300), // position of the camera
        800,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
        //small camera
    this.mCamera2=new Camera(
        vec2.fromValues(480,300), // position of the camera
        976,                     // width of camera
        [704, 540, 96, 60]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera2.setBackgroundColor([0.9, 0.9, 0.9, 0.1]); 
        
    this.mCui = new Camera(
            vec2.fromValues(40,20),
            80,
            [0,540,120,60]);
    this.mCui.setBackgroundColor([0.8,0.8,0.8,1]);
    
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.mPlatformset = new GameObjectSet(); 
    this.mRubbishset = new GameObjectSet(); 
    this.mStarset = new GameObjectSet(); 
    this.mAllObjs= new GameObjectSet(); 
    
    
    this.mHero = new Hero(this.kSprite, 910,450,50,50);
    this.mHole=new Item(910,450,0,80,80,this.kHole);

    this.mFirstObject = this.mPlatformset.size();
    this.mCurrentObj = this.mFirstObject;
    this.mPlatformset.addToSet(this.mHero);
    
    //this.mHero.setBoundRadius(30);
    
     this.mMsg = new FontRenderable("0/10");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(43,27);
    this.mMsg.setTextHeight(15);
    
    this.mStaritem = new TextureRenderable(this.kStar);
    this.mStaritem.getXform().setPosition(20,24);
    this.mStaritem.getXform().setSize(30,30);
    this.mMsg2 = new FontRenderable("Level 2");
    this.mMsg2.setColor([0, 0, 0, 1]);
    this.mMsg2.getXform().setPosition(20,9);
    this.mMsg2.setTextHeight(11);


    this.mLastHole=new Item(50,450,0,80,80,this.kHole);
 
    this.platform1=new MapObject(900,330,0,120,16,null);  // man fall
    this.mPlatformset.addToSet(this.platform1);
  
    this.platform2=new MapObject(870,240,0,160,16,null);
    this.mPlatformset.addToSet(this.platform2);
    
    
    this.mLeft=  new Spring(this.kSprite,925,273,50,50,274,0);
    //this.platform3=new MapObject(934,266,0,32,16,null); // spring
    //this.mPlatformset.addToSet(this.platform3);
    
    this.platform4=new MapObject(470,50,0,150,16,null);
    this.mPlatformset.addToSet(this.platform4);
    
    this.platform5=new MapObject(290,210,0,120,16,null);  //door platform
    this.mPlatformset.addToSet(this.platform5);
    this.mDoor=new Item(300,250,0,60,60,this.kDoor);
    
    this.platform6=new MapObject(130,300,90,600,16,null);
    this.mPlatformset.addToSet(this.platform6);
    this.platform7=new MapObject(230,300,90,600,16,null);
    this.mPlatformset.addToSet(this.platform7);
    var angle1 = Math.atan(140.0/50.0)*180*1.0/ 3.1415926;
    var len1= Math.sqrt(Math.pow(50,2)+Math.pow(300,2));
    this.platform9=new MapObject(180,450,angle1,len1,16,null);
    this.mPlatformset.addToSet(this.platform9);
    this.platform8=new MapObject(180,150,angle1,len1,16,null);
    this.mPlatformset.addToSet(this.platform8);
    this.platform10=new MapObject(180,450,180-angle1,len1,16,null);
    this.mPlatformset.addToSet(this.platform10);
    this.platform11=new MapObject(180,150,180-angle1,len1,16,null);
    this.mPlatformset.addToSet(this.platform11);
     this.platform12=new MapObject(180,300,0,100,16,null);
    this.mPlatformset.addToSet(this.platform12);

    this.platform13=new MapObject(968,300,90,600,16,null);//right wall
    this.mPlatformset.addToSet(this.platform13);
    this.platform14=new MapObject(480,608,0,976,16,null);//top wall
    this.mPlatformset.addToSet(this.platform14);
    this.platform15=new MapObject(-8,300,90,600,16,null);//left wall
    this.mPlatformset.addToSet(this.platform15);
 
    this.mRubbish=new Item(600,650,0,60,60,this.kRubbish);
    this.mRubbishset.addToSet(this.mRubbish);

    
    this.mStar = new Star(this.kSprite,880,270,40,40);
    this.mStarset.addToSet(this.mStar);
    
    this.mStar2 = new Star(this.kSprite, 500, 220,40,40);
    this.mStarset.addToSet(this.mStar2);
    this.initializeKeyN();
  
};

Level2_3.prototype.initializeKeyN= function(){
    
    this.mKeyNTip = new FontRenderable("Hold [N] to skip to Level3");
    this.mKeyNTip.setColor([0.6,0.6,0.6, 1]);
    this.mKeyNTip.getXform().setPosition(720,50);
    this.mKeyNTip.setTextHeight(14);
    this.mAllObjs.addToSet(this.mKeyNTip);
    
    this.mKeyNBar =new Renderable();
    this.mKeyNBar.setColor([0.6,0.6,0.6,1]);
    this.mKeyNBar.getXform().setPosition(825,30);
    this.mKeyNBar.getXform().setSize(200,3);
    this.mAllObjs.addToSet(this.mKeyNBar);
};
// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level2_3.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mRubbishset.draw(this.mCamera);
    this.mStarset.draw(this.mCamera);
    this.mPlatformset.draw(this.mCamera);
    this.mLastHole.draw(this.mCamera);
    this.mHole.draw(this.mCamera);
    this.mDoor.draw(this.mCamera);
    this.mAllObjs.draw(this.mCamera); 
    this.mLeft.draw(this.mCamera);
      
    this.mCamera2.setupViewProjection();
    this.mLastHole.draw(this.mCamera2);
    this.mPlatformset.draw(this.mCamera2);
    this.mRubbishset.draw(this.mCamera2);
    this.mStarset.draw(this.mCamera2);
    this.mHole.draw(this.mCamera2);
    this.mDoor.draw(this.mCamera2);
    this.mLastHole.draw(this.mCamera2);
      this.mLeft.draw(this.mCamera2);
    
    this.mCui.setupViewProjection();
      this.mMsg2.draw(this.mCui); 
    this.mMsg.draw(this.mCui); //mcamera->canvus? 
    this.mStaritem.draw(this.mCui);
    this.mCollisionInfos = []; 
    
};


// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Level2_3.prototype.update = function () {
    if(this.mHero.getXform().getXPos()<=560){
        this.mCamera.setWCCenter(this.mHero.getXform().getXPos(),300);
    }
    if(this.mHero.getXform().getXPos()<400){
        this.mCamera.setWCCenter(400,300);
    }
    this.mCamera.update();
    
    
    this.time++;
    var flag =0;
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.N)) 
    {
        if(this.LastKeyNTime=== this.time-1){
            this.KeyNCount++;
        }
        else{
            this.KeyNCount=1;
        }
        var newwidth =200 -5*this.KeyNCount;
        this.mKeyNBar.getXform().setSize(newwidth,3);
        if(newwidth<=0)
        {
             this.skip=true;
            gEngine.GameLoop.stop();
        }
        this.LastKeyNTime=this.time;
        flag =1;  // accept space 
    }
    if(flag===0)
    {
        this.mKeyNBar.getXform().setSize(200,3);
        this.KeyNCount=0;
    }
    this.mAllObjs.update(this.mCamera); 
    
    if(this.mHero.boundTest(this.mLeft)){
        
        if(this.springflag === 0){
            this.x=this.mHero.getXform().getXPos();
            this.y=this.mHero.getXform().getYPos();
            this.springflag=1;
        }
        
        //this.springcount++;
        
        if(this.springfirst===0){
            if(this.springcount<5)
            {
                this.mLeft.update();
                this.mHero.getXform().setPosition(this.x,this.y);
                this.springcount++;
            }
            else{
                this.mHero.getXform().setPosition(this.x,this.y);
                this.mHero.getRigidBody().setVelocity(-370,this.mHero.getRigidBody().getVelocity()[1]);
                this.springcount=0;
                this.springflag=0;
                this.springfirst=1;
            }           
        }
        else{
            if(this.springcount<6)
            {
                this.mLeft.update();
                this.mHero.getXform().setPosition(this.x,this.y);
                this.springcount++;
            }
            else{
                this.mHero.getXform().setPosition(this.x,this.y);
                this.mHero.getRigidBody().setVelocity(-370,this.mHero.getRigidBody().getVelocity()[1]);
                this.springcount=0;
                this.springflag=0;
                this.springfirst=1;
            }            
        }
        
        
        
        //console.log(this.springcount);
    }
    
    
    this.mHole.getXform().incRotationByDegree(-0.5);
    this.mLastHole.getXform().incRotationByDegree(-0.5);


    var obj = this.mPlatformset.getObjectAt(this.mCurrentObj);
    
    obj.keyControl();
    obj.getRigidBody().userSetsState();
    
    this.mPlatformset.update(this.mCamera);
    this.mRubbishset.update(this.mCamera);
    this.mStarset.update(this.mCamera);
   
    
    this.mPlatformset.update(this.mCamera2);
    this.mRubbishset.update(this.mCamera2);
    this.mStarset.update(this.mCamera2);
    
    
    this.mRubbish.getXform().incYPosBy(-2.5);
    if(this.mRubbish.getXform().getYPos()<30){
        this.mRubbish.getXform().setPosition(600,650);
    }
    
    gEngine.Physics.processCollision(this.mPlatformset, this.mCollisionInfos);
    

    if(this.mHero.getXform().getYPos()<0)
    {
        this.restart = true;
        gEngine.GameLoop.stop();
    }


    
    var h = [];
    var i;
    for(i=0;i<this.mRubbishset.size();i++){
        if(this.mHero.boundTest(this.mRubbishset.getObjectAt(i))){
            this.restart = true;
            gEngine.GameLoop.stop();
        }
    }
    
    var h = [];
    var i;
    for(i=0;i<this.mStarset.size();i++){
        if(this.mHero.boundTest(this.mStarset.getObjectAt(i))){
            this.starcount++;
            this.mStarset.getObjectAt(i).setVisibility(false);
            this.mStarset.removeFromSet(this.mStarset.getObjectAt(i));
        }
    }
    
    var msg = this.starcount + "/" + this.totalcount;
    this.mMsg.setText(msg);
    
    if(this.mHero.boundTest(this.mDoor)){
        this.restart=false;
        gEngine.GameLoop.stop();
    }
};
