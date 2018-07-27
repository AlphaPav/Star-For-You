/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,MyGame,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Level1() {
    
    this.kSprite = "assets/animation.png";
    this.kRubbish="assets/2D_GAME_rubbish.png";
    this.kStar = "assets/yellow.png";
    this.kDoor="assets/2D_GAME_door.png";
    this.kTooth="assets/tooth.png";
    this.kkeyLeft="assets/keyLeft.png";
    this.kkeyRight="assets/keyRight.png";
    this.kkeySpace="assets/keySpace.png";
    // The camera to view the scene
    this.mCamera = null;
    this.mCamera2=null;
    
    this.mPlatformset = null;
    this.mRubbishset = null;
    this.mStarset = null;
    
    this.mCollisionInfos = [];
  
    this.mCurrentObj = 0;
    this.mHero = null;
    
    this.mCui = null;
    this.mStaritem = null;
    this.mMsg = null;
    
    this.size=0;
    this.flag=0;
    
    this.starcount = 0;
    this.totalcount = 8;
    
        
    this.mKeyNBar= null;
    this.time= 0;
    this.LastKeyNTime=0;
    this.KeyNCount=0;
    
    this.restart = true;
    this.skip= false;
    this.FalgPlatform8= 0; //go right;
    this.FalgPlatform16= 0; //go down;
    this.FalgPlatform23= 0; //go right;
    this.FalgPlatform24= 0; //go down;
}

gEngine.Core.inheritPrototype(Level1, Scene);


Level1.prototype.loadScene = function () {
     
    gEngine.Textures.loadTexture(this.kSprite);
    gEngine.Textures.loadTexture(this.kDoor);
    gEngine.Textures.loadTexture(this.kRubbish);
    gEngine.Textures.loadTexture(this.kStar);
    gEngine.Textures.loadTexture(this.kTooth);
    gEngine.Textures.loadTexture(this.kkeyLeft);
    gEngine.Textures.loadTexture(this.kkeyRight);
    gEngine.Textures.loadTexture(this.kkeySpace);
};

Level1.prototype.unloadScene = function () {
    
    gEngine.Textures.unloadTexture(this.kSprite);
    gEngine.Textures.unloadTexture(this.kDoor);
    gEngine.Textures.unloadTexture(this.kRubbish);
    gEngine.Textures.unloadTexture(this.kStar);
    gEngine.Textures.unloadTexture(this.kTooth);
    gEngine.Textures.unloadTexture(this.kkeyLeft);
    gEngine.Textures.unloadTexture(this.kkeyRight);
    gEngine.Textures.unloadTexture(this.kkeySpace);
   
    if(this.skip){
        var nextLevel =new MyGame();
        gEngine.Core.startScene(nextLevel);
     }
    else{
        if(this.restart){
        var nextLevel =new Level1();
        gEngine.Core.startScene(nextLevel);
        }else
            {   if(this.starcount<this.totalcount){
               var new_level=new LoseScene(1);
               gEngine.Core.startScene(new_level);
             }
            else {
                var nextLevel =new MyGame();
                gEngine.Core.startScene(nextLevel);
            }
        }
    }
 
    
    //gEngine.ResourceMap.asyncLoadRequested()("Cui",this.mCui);
   
};

Level1.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(400, 300), // position of the camera
        800,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
        //small camera
    this.mCamera2=new Camera(
        vec2.fromValues(1000,300), // position of the camera
        2016,                     // width of camera
        [600, 540, 200, 60]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera2.setBackgroundColor([0.9, 0.9, 0.9, 0.1]); 
        
    this.mCui = new Camera(
            vec2.fromValues(40,20),
            80,
            [0,540,120,60]);
    this.mCui.setBackgroundColor([0.8,0.8,0.8,1]);
    
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
   
    this.mRubbishset = new GameObjectSet(); 
    this.mStarset = new GameObjectSet(); 
    
    this.initializePlatform();
   this.mMsg = new FontRenderable("0/8");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(43,27);
    this.mMsg.setTextHeight(15);
    
    this.mStaritem = new TextureRenderable(this.kStar);
    this.mStaritem.setColor([1,1,1,0]);
    this.mStaritem.getXform().setPosition(20,24);
    this.mStaritem.getXform().setSize(30,30);
    this.mMsg2 = new FontRenderable("Level 1");
    this.mMsg2.setColor([0, 0, 0, 1]);
    this.mMsg2.getXform().setPosition(20,9);
    this.mMsg2.setTextHeight(11);
    
    this.initializeStar();
    this.initializeTooth();
    this.mDoor=new Item(1950,510,0,100,100,this.kDoor);
    this.initializeGuideobj();
    this.initializeKeyN();
};
Level1.prototype.initializeKeyN = function(){
    
    this.mKeyNset=new GameObjectSet(); 
    this.mKeyNTip = new FontRenderable("Hold [N] to skip to Level2");
    this.mKeyNTip.setColor([0.6,0.6,0.6, 1]);
    this.mKeyNTip.getXform().setPosition(100,50);
    this.mKeyNTip.setTextHeight(14);
    this.mKeyNset.addToSet(this.mKeyNTip);
    
    this.mKeyNBar =new Renderable();
    this.mKeyNBar.setColor([0.6,0.6,0.6,1]);
    this.mKeyNBar.getXform().setPosition(205,30);
    this.mKeyNBar.getXform().setSize(200,3);
    this.mKeyNset.addToSet(this.mKeyNBar);
};
Level1.prototype.initializeGuideobj= function(){
     
    this.mguideset =new GameObjectSet(); 
    
    this.mguidekeyLeft= new TextureRenderable(this.kkeyLeft);
    this.mguidekeyLeft.getXform().setPosition(20,170);
    this.mguidekeyLeft.getXform().setSize(32,16);
    this.mguideset.addToSet(this.mguidekeyLeft);
     
    this.mguidekeyRight = new TextureRenderable(this.kkeyRight);
    this.mguidekeyRight.getXform().setPosition(60,170);
    this.mguidekeyRight.getXform().setSize(32,16);
    this.mguideset.addToSet(this.mguidekeyRight);
    
        
    this.mguidekeySpace = new TextureRenderable(this.kkeySpace);
    this.mguidekeySpace.getXform().setPosition(40,190);
    this.mguidekeySpace.getXform().setSize(32,16);
    this.mguideset.addToSet(this.mguidekeySpace);
    this.mguideMsg1 = new FontRenderable("Single/Double Jump");
    this.mguideMsg1.setColor([1, 1, 1, 0.9]);
    this.mguideMsg1.getXform().setPosition(10,215);
    this.mguideMsg1.setTextHeight(13);

};
Level1.prototype.initializePlatform= function () {
    this.mPlatformset = new GameObjectSet(); 
    this.mHero = new Hero(this.kSprite, 30,125,50,50);
   // this.mHero = new Hero(this.kSprite,1270,300,50,50);
    this.mFirstObject = this.mPlatformset.size();
    this.mCurrentObj = this.mFirstObject;
    this.mPlatformset.addToSet(this.mHero);
    
    this.platform1=new MapObject(40,100,0,80,16,null);
    this.mPlatformset.addToSet(this.platform1);
    this.platform2=new MapObject(120,270,0,60,16,null);
    this.mPlatformset.addToSet(this.platform2);
    this.platform3=new MapObject(158,189,90,178,16,null);
    this.mPlatformset.addToSet(this.platform3);
    this.platform4=new MapObject(275,92,0,250,16,null);
    this.mPlatformset.addToSet(this.platform4);
    this.platform5=new MapObject(230,300,90,300,16,null);
    this.mPlatformset.addToSet(this.platform5);
    this.platform6=new MapObject(258,380,0,40,16,null);
    this.mPlatformset.addToSet(this.platform6);
    this.platform7=new MapObject(288,230,0,100,16,null);
    this.mPlatformset.addToSet(this.platform7);
    this.platform8=new MapObject(370,450,0,80,16,null);  //move left and right
    this.mPlatformset.addToSet(this.platform8);
    this.platform9=new MapObject(500,510,90,180,16,null); 
    this.mPlatformset.addToSet(this.platform9);
    this.platform10=new MapObject(500,180,90,360,16,null); 
    this.mPlatformset.addToSet(this.platform10);
    this.platform11=new MapObject(472,300,0,40,16,null); 
    this.mPlatformset.addToSet(this.platform11);
    this.platform12=new MapObject(518,352,0,40,16,null); 
    this.mPlatformset.addToSet(this.platform12);
    this.platform13=new MapObject(630,510,90,180,16,null); 
    this.mPlatformset.addToSet(this.platform13);
    this.platform14=new MapObject(630,150,90,300,16,null); 
    this.mPlatformset.addToSet(this.platform14);
    this.platform15=new MapObject(658,292,0,40,16,null); 
    this.mPlatformset.addToSet(this.platform15);
    this.platform16=new MapObject(760,400,0,120,16,null);  //move up and down
    this.mPlatformset.addToSet(this.platform16);
    this.platform17=new MapObject(1100,400,0,400,16,null); 
    this.mPlatformset.addToSet(this.platform17);
    this.platform18=new MapObject(1175,470,0,250,16,null);  
    this.mPlatformset.addToSet(this.platform18);
    this.platform19=new MapObject(960,200,0,120,16,null); 
    this.mPlatformset.addToSet(this.platform19);
    this.platform20=new MapObject(1270,270,0,60,16,null); 
    this.mPlatformset.addToSet(this.platform20);
    this.platform21=new MapObject(1150,100,0,120,16,null); // below tooth 
    this.mPlatformset.addToSet(this.platform21);
    this.platform22=new MapObject(1430,120,0,140,16,null); 
    this.mPlatformset.addToSet(this.platform22);
    this.platform23=new MapObject(1600,200,0,100,16,null);  //move left and right
    this.mPlatformset.addToSet(this.platform23);
    this.platform24=new MapObject(1800,450,0,100,16,null);  //move up and down
    this.mPlatformset.addToSet(this.platform24);
    this.platform25=new MapObject(1950,450,0,100,16,null);  //door
    this.mPlatformset.addToSet(this.platform25);
    this.platform26=new MapObject(-8,300,90,600,16,null);  //wall left
    this.mPlatformset.addToSet(this.platform26);
    this.platform27=new MapObject(1000,608,0,2000,16,null);  //wall up
    this.mPlatformset.addToSet(this.platform27);
    this.platform28=new MapObject(2008,300,90,600,16,null);  //wall right
    this.mPlatformset.addToSet(this.platform28);
 
};
Level1.prototype.initializeStar= function (){
    this.mStar1 = new Star(this.kSprite, 120, 300,40,40);
    this.mStarset.addToSet(this.mStar1);
    this.mStar2 = new Star(this.kSprite, 270,180,40,40);
    this.mStarset.addToSet(this.mStar2);
    this.mStar3 = new Star(this.kSprite, 280,300,40,40);
    this.mStarset.addToSet(this.mStar3);
    this.mStar4 = new Star(this.kSprite, 370,500,40,40);
    this.mStarset.addToSet(this.mStar4);
    this.mStar5 = new Star(this.kSprite, 570,300,40,40);
    this.mStarset.addToSet(this.mStar5);
    this.mStar6 = new Star(this.kSprite,850,480,40,40);
    this.mStarset.addToSet(this.mStar6);
    this.mStar7 = new Star(this.kSprite,950,250,40,40);
    this.mStarset.addToSet(this.mStar7);
    this.mStar8 = new Star(this.kSprite,1270,310,40,40);//1270,270 platform 
    this.mStarset.addToSet(this.mStar8);
    this.mStar9 = new Star(this.kSprite,1690,250,40,40);//1600,200 platform 
    this.mStarset.addToSet(this.mStar9);
    this.mStar10 = new Star(this.kSprite,570,400,40,40);
    this.mStarset.addToSet(this.mStar10);
};

Level1.prototype.initializeTooth= function(){
    this.mToothset = new GameObjectSet(); 
     
    this.mTooth=new Item(1290,442,270,40,20,this.kTooth);
    this.mToothset.addToSet(this.mTooth);
    this.mTooth1=new Item(1270,442,270,40,20,this.kTooth);
    this.mToothset.addToSet(this.mTooth1);
    this.mTooth2=new Item(1250,442,270,40,20,this.kTooth);
    this.mToothset.addToSet(this.mTooth2);
    this.mTooth3=new Item(1230,442,270,40,20,this.kTooth);
    this.mToothset.addToSet(this.mTooth3);
    
    this.mTooth4=new Item(1100,120,90,40,20,this.kTooth); //platform(1150,100,0,120,16)
    this.mToothset.addToSet(this.mTooth4);
    this.mTooth5=new Item(1120,120,90,40,20,this.kTooth); //platform(1150,100,0,120,16)
    this.mToothset.addToSet(this.mTooth5);
    this.mTooth6=new Item(1140,120,90,40,20,this.kTooth); //platform(1150,100,0,120,16)
    this.mToothset.addToSet(this.mTooth6);
    this.mTooth7=new Item(1160,120,90,40,20,this.kTooth); //platform(1150,100,0,120,16)
    this.mToothset.addToSet(this.mTooth7);
    this.mTooth8=new Item(1180,120,90,40,20,this.kTooth); //platform(1150,100,0,120,16)
    this.mToothset.addToSet(this.mTooth8);
    this.mTooth9=new Item(1200,120,90,40,20,this.kTooth); //platform(1150,100,0,120,16)
    this.mToothset.addToSet(this.mTooth9);
};
// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level1.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mPlatformset.draw(this.mCamera);
    this.mRubbishset.draw(this.mCamera);
    this.mStarset.draw(this.mCamera);
    this.mToothset.draw(this.mCamera);
    this.mDoor.draw(this.mCamera);
    this.mguideset.draw(this.mCamera);
    this.mKeyNset.draw(this.mCamera);
    this.mguideMsg1.draw(this.mCamera);
    
    this.mCamera2.setupViewProjection();
    this.mPlatformset.draw(this.mCamera2);
    this.mRubbishset.draw(this.mCamera2);
    this.mStarset.draw(this.mCamera2);
    this.mToothset.draw(this.mCamera2);
    this.mDoor.draw(this.mCamera2);
    
    this.mCui.setupViewProjection();
    this.mMsg.draw(this.mCui); //mcamera->canvus?
    this.mMsg2.draw(this.mCui);
    this.mStaritem.draw(this.mCui);

    this.mCollisionInfos = []; 
    
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!

Level1.prototype.updatePlatformMovingObjs=function(){
    if (this.FalgPlatform8===0) // left and right
    {
          this.platform8.getXform().incXPosBy(1);
          this.mHero.CheckUpdate(this.platform8,0,1);
          if(this.platform8.getXform().getXPos()>410){
              this.FalgPlatform8=1;
          }
    }
    else{
         this.platform8.getXform().incXPosBy(-1);
         this.mHero.CheckUpdate(this.platform8,0,-1);
         if(this.platform8.getXform().getXPos()<340){
              this.FalgPlatform8=0;
          }
    }
  
    
   if (this.FalgPlatform16===0)//(750,400,0,100,16,null);
    {
          this.platform16.getXform().incYPosBy(-2);
          this.mHero.CheckUpdate(this.platform16,1,-2);
          if(this.platform16.getXform().getYPos()< 200){
              this.FalgPlatform16=1;
          }
    }
    else{
         this.platform16.getXform().incYPosBy(2);
         this.mHero.CheckUpdate(this.platform16,1,2);
         if(this.platform16.getXform().getYPos()>500){
              this.FalgPlatform16=0;
          }
    }
    
     if (this.FalgPlatform23===0)//1600,200,0,100,16
    {
          this.platform23.getXform().incXPosBy(2);
          this.mHero.CheckUpdate(this.platform23,0,2);
          if(this.platform23.getXform().getXPos()>1700){
              this.FalgPlatform23=1;
          }
    }
    else{
         this.platform23.getXform().incXPosBy(-2);
          this.mHero.CheckUpdate(this.platform23,0,-2);
         if(this.platform23.getXform().getXPos()<1520){
              this.FalgPlatform23=0;
          }
    }
    
    
    if (this.FalgPlatform24===0)//1800,450
    {
          this.platform24.getXform().incYPosBy(-2);
          this.mHero.CheckUpdate(this.platform24,1,-2);
          if(this.platform24.getXform().getYPos()< 200){
              this.FalgPlatform24=1;
          }
    }
    else{
         this.platform24.getXform().incYPosBy(2);
         this.mHero.CheckUpdate(this.platform24,1,2);
         if(this.platform24.getXform().getYPos()>550){
              this.FalgPlatform24=0;
          }
    }
};
Level1.prototype.update = function () {
    
  
    //this.platform4.getXform().incRotationByDegree(1);
    
    if(this.mHero.getXform().getXPos()>=400){
        this.mCamera.setWCCenter(this.mHero.getXform().getXPos(),300);
    }
    if(this.mHero.getXform().getXPos()>1600){
        this.mCamera.setWCCenter(1600,300);
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
    this.mKeyNset.update(this.mCamera);
    
    var obj = this.mPlatformset.getObjectAt(this.mCurrentObj);
    
    obj.keyControl();
    obj.getRigidBody().userSetsState();
    
    this.updatePlatformMovingObjs();
    
    this.mPlatformset.update(this.mCamera);
    this.mRubbishset.update(this.mCamera);
    this.mStarset.update(this.mCamera);
    this.mPlatformset.update(this.mCamera2);
    this.mRubbishset.update(this.mCamera2);
    this.mStarset.update(this.mCamera2);
   
    gEngine.Physics.processCollision(this.mPlatformset, this.mCollisionInfos);
    
    if(this.mHero.getXform().getYPos()<0){
        this.restart = true;
        gEngine.GameLoop.stop();
    }

  
    var h = [];
    var i;
    for(i=0;i<this.mRubbishset.size();i++){
        if(this.mHero.boundTest(this.mRubbishset.getObjectAt(i),h)){
            this.restart = true;
            gEngine.GameLoop.stop();
        }
    }
    
    var h = [];
    var i;
    for(i=0;i<this.mStarset.size();i++){
        if(this.mHero.boundTest(this.mStarset.getObjectAt(i),h)){
            this.starcount++;
            this.mStarset.getObjectAt(i).setVisibility(false);
            this.mStarset.removeFromSet(this.mStarset.getObjectAt(i));
        }
    }
    
    var h = [];
    var i;
    for(i=0;i<this.mToothset.size();i++){
        if(this.mHero.boundTest(this.mToothset.getObjectAt(i),h)){
            this.restart = true;
            gEngine.GameLoop.stop();
        }
    }
    
    var msg = this.starcount + "/" + this.totalcount;
    this.mMsg.setText(msg);
    
    if(this.mHero.boundTest(this.mDoor)){
        this.restart=false;
        gEngine.GameLoop.stop();
     }
};
