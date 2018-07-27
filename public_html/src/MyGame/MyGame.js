/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    
    this.kSprite = "assets/animation.png";
    this.kHole = "assets/Hole.png";
    this.kRubbish="assets/2D_GAME_rubbish.png";
    this.kStar = "assets/yellow.png";

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
    
    this.restart = true;
    this.skip=false;
    this.mKeyNBar= null;
    this.time= 0;
    this.LastKeyNTime=0;
    this.KeyNCount=0;
}

gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
     
    gEngine.Textures.loadTexture(this.kSprite);
    gEngine.Textures.loadTexture(this.kHole);
    gEngine.Textures.loadTexture(this.kRubbish);
    gEngine.Textures.loadTexture(this.kStar);
    
};

MyGame.prototype.unloadScene = function () {
    
    gEngine.Textures.unloadTexture(this.kSprite);
    gEngine.Textures.unloadTexture(this.kHole);
    gEngine.Textures.unloadTexture(this.kRubbish);
    gEngine.Textures.unloadTexture(this.kStar);
 
    if(this.skip)
      {    gEngine.ResourceMap.loadstar("star",this.starcount);
          var nextLevel =new BalanceLevel();
          gEngine.Core.startScene(nextLevel);
      }
      else{
          if(this.restart){
               var nextLevel =new MyGame();
               gEngine.Core.startScene(nextLevel);
           }
           else{
               gEngine.ResourceMap.loadstar("star",this.starcount);
               var nextLevel =new BalanceLevel();
               gEngine.Core.startScene(nextLevel);
           }
      }
    //gEngine.ResourceMap.asyncLoadRequested()("Cui",this.mCui);
   
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(400, 300), // position of the camera
        800,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
        //small camera
    this.mCamera2=new Camera(
        vec2.fromValues(440,300), // position of the camera
        904,                     // width of camera
        [668, 510, 132, 90]         // viewport (orgX, orgY, width, height)
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
    
    
    this.mHero = new Hero(this.kSprite, 60,135,50,50);
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

    this.platform1=new MapObject(100,100,0,200,16,null);
    this.mPlatformset.addToSet(this.platform1);
  
    this.platform2=new MapObject(192,225,90,250,16,null);
    this.mPlatformset.addToSet(this.platform2);
    
    this.platform3=new MapObject(250,342,0,100,16,null);
    this.mPlatformset.addToSet(this.platform3);
    
    this.platform4=new MapObject(500,285,0,150,16,null);
    this.mPlatformset.addToSet(this.platform4);
    
    this.platform5=new MapObject(163,168,0,40,16,null);
    this.mPlatformset.addToSet(this.platform5);
    
    this.platform6=new MapObject(780,300,90,600,16,null);
    this.mPlatformset.addToSet(this.platform6);
    this.platform7=new MapObject(880,300,90,600,16,null);// right wall
    this.mPlatformset.addToSet(this.platform7);
  
    var angle1 = Math.atan(140.0/50.0)*180*1.0/ 3.1415926;
    var len1= Math.sqrt(Math.pow(50,2)+Math.pow(300,2));
    this.platform9=new MapObject(830,450,angle1,len1,16,null);
    this.mPlatformset.addToSet(this.platform9);
    this.platform8=new MapObject(830,150,angle1,len1,16,null);
    this.mPlatformset.addToSet(this.platform8);
    this.platform10=new MapObject(830,450,180-angle1,len1,16,null);
    this.mPlatformset.addToSet(this.platform10);
    this.platform11=new MapObject(830,150,180-angle1,len1,16,null);
    this.mPlatformset.addToSet(this.platform11);
     this.platform12=new MapObject(830,300,0,100,16,null);
    this.mPlatformset.addToSet(this.platform12);

    this.platform13=new MapObject(-8,300,90,600,16,null);//left wall
    this.mPlatformset.addToSet(this.platform13);
    this.platform14=new MapObject(440,608,0,896,16,null);//top wall
    this.mPlatformset.addToSet(this.platform14);

    this.mHole=new Item(695,450,0,80,80,this.kHole);
    //this.mHole.setBoundRadius(40);
    //this.mItemset.addToSet(this.mHole);
    
    this.mRubbish=new Item(500,650,0,60,60,this.kRubbish);
    this.mRubbishset.addToSet(this.mRubbish);
    //this.createBounds();
    this.mRubbish2=new Item(250,430,0,50,50,this.kRubbish);
    this.mRubbishset.addToSet(this.mRubbish2);
    
    this.mStar = new Star(this.kSprite,500,320,40,40);
    this.mStarset.addToSet(this.mStar);
    
    this.mStar2 = new Star(this.kSprite, 50, 220,40,40);
    this.mStarset.addToSet(this.mStar2);
    this.initializeKeyN();
  
};

MyGame.prototype.initializeKeyN= function(){
    
    this.mKeyNTip = new FontRenderable("Hold [N] to skip to Level2.2");
    this.mKeyNTip.setColor([0.6,0.6,0.6, 1]);
    this.mKeyNTip.getXform().setPosition(70,50);
    this.mKeyNTip.setTextHeight(14);
    this.mAllObjs.addToSet(this.mKeyNTip);
    
    this.mKeyNBar =new Renderable();
    this.mKeyNBar.setColor([0.6,0.6,0.6,1]);
    this.mKeyNBar.getXform().setPosition(185,30);
    this.mKeyNBar.getXform().setSize(200,3);
    this.mAllObjs.addToSet(this.mKeyNBar);
};
// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mRubbishset.draw(this.mCamera);
    this.mStarset.draw(this.mCamera);
    this.mPlatformset.draw(this.mCamera);
    this.mHole.draw(this.mCamera);
    this.mAllObjs.draw(this.mCamera); 
    
    this.mCamera2.setupViewProjection();
    this.mPlatformset.draw(this.mCamera2);
    this.mRubbishset.draw(this.mCamera2);
    this.mStarset.draw(this.mCamera2);
    this.mHole.draw(this.mCamera2);
    
    this.mCui.setupViewProjection();
    this.mMsg.draw(this.mCui); //mcamera->canvus? 
    this.mMsg2.draw(this.mCui);
    this.mStaritem.draw(this.mCui);
    this.mCollisionInfos = []; 
    
};


// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    if(this.mHero.getXform().getXPos()>=400){
        this.mCamera.setWCCenter(this.mHero.getXform().getXPos(),300);
    }
    if(this.mHero.getXform().getXPos()>480){
        this.mCamera.setWCCenter(480,300);
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
    
    
    this.mHole.getXform().incRotationByDegree(-0.5);
    //this.platform4.getXform().incRotationByDegree(1);

    var obj = this.mPlatformset.getObjectAt(this.mCurrentObj);
    
    obj.keyControl();
    obj.getRigidBody().userSetsState();
    
    this.mPlatformset.update(this.mCamera);
    this.mRubbishset.update(this.mCamera);
    this.mStarset.update(this.mCamera);
   
    
    this.mPlatformset.update(this.mCamera2);
    this.mRubbishset.update(this.mCamera2);
    this.mStarset.update(this.mCamera2);
    
    if(this.mHero.getXform().getPosition()[0]>=350){
        this.mRubbish.getXform().incYPosBy(-2.5);
    }
    /*if(this.mHero.getXform().getPosition()[0]>=550){
        this.mRubbish.getXform().setPosition(500,650);
    }*/
    
//change the rubbish2 's size
    if(this.size===0){
        this.flag=1;
    }
    else if(this.size===75){
        this.flag=0;
    }
    if(this.flag===1){
        this.size=this.size+1;
    }
    else{
        this.size=this.size-1;
    }
    this.mRubbish2.getXform().setSize(50+this.size,50+this.size);
    this.mRubbish2.setBoundRadius((50+this.size)/2);
    
    gEngine.Physics.processCollision(this.mPlatformset, this.mCollisionInfos);
    

    if(this.mHero.getXform().getYPos()<0)
    {
        this.restart = true;
        gEngine.GameLoop.stop();
    }

    if(this.mHero.boundTest(this.mHole))
    {
        this.restart = false;
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
};
