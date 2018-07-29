/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*jslint node: true, vars: true */
/*global gEngine, Scene, MyGame,  vec2 ,Math*/
"use strict"; 

function Level5(){
    
    this.mCamera = null;
     this.mCamera2=null;
    this.mCui = null;
    this.mHero = null;
    
    this.kHero= "assets/animation.png";
    this.kMud= "assets/Mud.png";   
    this.kBall= "assets/Ball.png";
    this.kWall= "assets/wall.png";
    this.kStar = "assets/yellow.png";
    this.kBlackHole= "assets/BlackHole.png";
    this.kDoor="assets/2D_GAME_door.png";
    this.kRubbish="assets/2D_GAME_rubbish.png";
    this.kTooth="assets/tooth.png";
    this.kbg="assets/background.png";    
    this.kCue="assets/Star.wav";
    this.kBGM = "assets/Lopu.mp3";
    this.starcount = 0;
    this.totalcount = 5;
    
    this.restart = true;
    this.skip=false;
    
    this.mKeyNBar= null;
    this.time= 0;
    this.LastKeyNTime=0;
    this.KeyNCount=0;
    
    this.BHsize = 0;
    this.BHflag = 0;
    
    this.timeLaunch=0;
}

gEngine.Core.inheritPrototype(Level5, Scene);

Level5.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kHero);
    gEngine.Textures.loadTexture(this.kMud);
    gEngine.Textures.loadTexture(this.kWall);
    gEngine.Textures.loadTexture(this.kBall);
    gEngine.Textures.loadTexture(this.kStar);
    gEngine.Textures.loadTexture(this.kBlackHole);
    gEngine.Textures.loadTexture(this.kTooth);
    gEngine.Textures.loadTexture(this.kDoor);
    gEngine.Textures.loadTexture(this.kRubbish);
    gEngine.Textures.loadTexture(this.kbg);
    gEngine.AudioClips.loadAudio(this.kCue);
    gEngine.AudioClips.playBackgroundAudio(this.kBGM);

};

Level5.prototype.unloadScene = function () {
     gEngine.Textures.unloadTexture(this.kHero);
     gEngine.Textures.unloadTexture(this.kMud);
     gEngine.Textures.unloadTexture(this.kBall);
     gEngine.Textures.unloadTexture(this.kWall);
     gEngine.Textures.unloadTexture(this.kStar);
     gEngine.Textures.unloadTexture(this.kBlackHole);
     gEngine.Textures.unloadTexture(this.kTooth);
     gEngine.Textures.unloadTexture(this.kDoor);
     gEngine.Textures.unloadTexture(this.kRubbish);
    gEngine.Textures.unloadTexture(this.kbg); 
    gEngine.AudioClips.unloadAudio(this.kCue);
    gEngine.AudioClips.stopBackgroundAudio();
    
    if(this.skip){
        //var nextLevel =new Level6();
        var nextLevel =new AllLevel(5);
         gEngine.ResourceMap.loadstar("level5",this.starcount);
        gEngine.Core.startScene(nextLevel);
     }
    else{
        if(this.restart){
        var nextLevel =new Level5();
        gEngine.Core.startScene(nextLevel);
        }
        else
        {  
             gEngine.ResourceMap.loadstar("level5",this.starcount);
                var nextLevel =new PassScene(5,this.starcount);
                gEngine.Core.startScene(nextLevel);
        }
        
    }
};

Level5.prototype.initialize= function(){
    this.mCamera = new Camera(
        vec2.fromValues(400, 150), // position of the camera
       400,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
     this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
     
      this.mCamera2= new Camera(
        vec2.fromValues(400, 300), // position of the camera
        320,                     // width of camera
        [722, 480, 64, 120]         // viewport (orgX, orgY, width, height)
    );
      this.mCamera2.setBackgroundColor([0.9, 0.9, 0.9, 1]);
     gEngine.DefaultResources.setGlobalAmbientIntensity(3);
      
     this.mCui = new Camera(
            vec2.fromValues(40,20),
            90,
            [0,540,120,60]);
    this.mCui.setBackgroundColor([0.662, 0.388, 0.376,1]);
   this.mbg = new TextureRenderable(this.kbg);
    this.mbg.getXform().setPosition(400,300);
    this.mbg.getXform().setSize(800,600);
    
    
    this.mMsg = new FontRenderable("0/10");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(43,27);
    this.mMsg.setTextHeight(15);
    
    this.mStaritem = new TextureRenderable(this.kStar);
    this.mStaritem.setColor([1,1,1,0]);
    this.mStaritem.getXform().setPosition(20,24);
    this.mStaritem.getXform().setSize(30,30);
    this.mMsg2 = new FontRenderable("Level 5");
    this.mMsg2.setColor([0, 0, 0, 1]);
    this.mMsg2.getXform().setPosition(20,9);
    this.mMsg2.setTextHeight(11);
    
    this.mAllObjs = new GameObjectSet();  
    
    this.initializeLever();
    
    var Xsum =this.RightPoint.getXform().getXPos()+this.LeftPoint.getXform().getXPos();
    var Ysum =this.RightPoint.getXform().getYPos()+this.LeftPoint.getXform().getYPos();
    
    this.mDoor=new Item(520,560,0,50,50,this.kDoor);
    this.mAllObjs.addToSet(this.mDoor);
    
    this.heroheight =40;
    this.herowidth =40;
    this.mHero = new Hero(this.kHero, Xsum*1.0/2, Ysum*1.0/2+this.lever.getXform().getHeight()+ this.heroheight/2,this.herowidth,this.heroheight,1024);
    this.mHero.getRigidBody().setMass(0);
    this.mAllObjs.addToSet(this.mHero);
    
    this.mChaserSet = new GameObjectSet(); 
    
    this.initializeStar();
    this.initializeBlackHole();
    this.initializeRubbish();
    this.initializeKeyN();
    this.initializeTooth();
};

Level5.prototype.initializeTooth= function(){
    this.mToothset = new GameObjectSet(); 
    
    var i,obj;
    for(i=0;i<20;i++){
        obj=new Item(555,300+15*i,180,15,15,this.kTooth);
        this.mToothset.addToSet(obj);
    }
    
};

Level5.prototype.initializeRubbish= function(){
    this.mRubbishset = new GameObjectSet();
    
    this.mR1=new Item(500,150,0,60,60,this.kRubbish);
    this.mRubbishset.addToSet(this.mR1);
    this.mR2=new Item(300,450,0,60,60,this.kRubbish);
    this.mRubbishset.addToSet(this.mR2);
};

Level5.prototype.initializeLever= function(){
    
    this.mOtherObjs= new GameObjectSet(); 
     
    this.LeftPoint = new LeverEndPoint(this.kBall,240,0,12, 12);  
    this.mOtherObjs.addToSet(this.LeftPoint);
    this.RightPoint = new LeverEndPoint(this.kBall,560,0,12, 12);  
    this.mOtherObjs.addToSet(this.RightPoint);
    this.LeftBorder = new LeverBorder(this.kWall,240,300,4,600);  
    this.mOtherObjs.addToSet(this.LeftBorder);
    this.RightBorder = new LeverBorder(this.kWall,560,300,4,600);  
    this.mOtherObjs.addToSet(this.RightBorder);
    var Xdiff= this.RightPoint.getXform().getXPos()-this.LeftPoint.getXform().getXPos();
    var Ydiff =this.RightPoint.getXform().getYPos()-this.LeftPoint.getXform().getYPos();
    var Xsum =this.RightPoint.getXform().getXPos()+this.LeftPoint.getXform().getXPos();
    var Ysum =this.RightPoint.getXform().getYPos()+this.LeftPoint.getXform().getYPos();
    var length= Math.sqrt(Math.pow(Xdiff,2)+Math.pow(Ydiff,2));
    this.lever = new Lever(this.kMud, Xsum*1.0/2, Ysum*1.0/2,length,4);
    this.mOtherObjs.addToSet(this.lever);
 
    
};

Level5.prototype.initializeStar= function(){
    this.mStarset = new GameObjectSet();    
    
    this.mStar = new Star(this.kHero,  440, 60,30,30);
    this.mStarset.addToSet(this.mStar);
    this.mStar2 = new Star(this.kHero, 350, 150,20,20);
    this.mStarset.addToSet(this.mStar2);
    this.mStar3 = new Star(this.kHero, 460, 300,28,28);
    this.mStarset.addToSet(this.mStar3);
    this.mStar4 = new Star(this.kHero, 320,350,20,20);
    this.mStarset.addToSet(this.mStar4);
    this.mStar5 = new Star(this.kHero,470, 470,18,18);
    this.mStarset.addToSet(this.mStar5);
    //this.mStar6 = new Star(this.kHero,400,400,25,25);
    //this.mStarset.addToSet(this.mStar6);
    
};

Level5.prototype.initializeBlackHole= function(){
    this.mBlackHoleset = new GameObjectSet(); 
  
    this.mBH=new Item(320,110,4,10,10,this.kBlackHole);
    this.mBlackHoleset.addToSet(this.mBH);
    this.mBH1=new Item(410,280,12,10,10,this.kBlackHole);
    this.mBlackHoleset.addToSet(this.mBH1);
    this.mBH2=new Item(430,470,9,15,15,this.kBlackHole);
    this.mBlackHoleset.addToSet(this.mBH2);
    
};


Level5.prototype.initializeKeyN= function(){
    this.mKeyNTip = new FontRenderable("Hold [N] to skip to Level6");
    this.mKeyNTip.setColor([0.447,0.286,0.219, 1]);
    this.mKeyNTip.getXform().setPosition(250,20);
    this.mKeyNTip.setTextHeight(7);
    this.mAllObjs.addToSet(this.mKeyNTip);
    
    this.mKeyNBar =new Renderable();
    this.mKeyNBar.setColor([0.447,0.286,0.219,1]);
    this.mKeyNBar.getXform().setPosition(310,10);
    this.mKeyNBar.getXform().setSize(100,1.5);
    this.mAllObjs.addToSet(this.mKeyNBar);
};

Level5.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.7, 0.7, 0.7, 1.0]); // clear to deep gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();
    this.mbg.draw(this.mCamera);
    // Step  C: Draw all the squares   
    this.mStarset.draw(this.mCamera);
    this.mBlackHoleset.draw(this.mCamera); 
    this.mChaserSet.draw(this.mCamera);
    this.mRubbishset.draw(this.mCamera); 
    this.mToothset.draw(this.mCamera);
    this.mOtherObjs.draw(this.mCamera);
    this.mAllObjs.draw(this.mCamera); 
    
    this.mCamera2.setupViewProjection();
    this.mbg.draw(this.mCamera2);
    this.mStarset.draw(this.mCamera2);
    this.mBlackHoleset.draw(this.mCamera2);
    this.mChaserSet.draw(this.mCamera2);
    this.mRubbishset.draw(this.mCamera2); 
    this.mToothset.draw(this.mCamera2);
    this.mAllObjs.draw(this.mCamera2);
    this.mOtherObjs.draw(this.mCamera2);
    
      // this.mCollisionInfos = []; 
    this.mCui.setupViewProjection();
    this.mMsg2.draw(this.mCui);
    this.mMsg.draw(this.mCui); //mcamera->canvus? 
    this.mStaritem.draw(this.mCui);
};

Level5.prototype.update = function () {
    var deltaY = 1;
    var xformLeft = this.LeftPoint.getXform();
    var xformRight = this.RightPoint.getXform();

//camera movement
    this.mCamera.update();
    this.mCamera2.update();
    this.mCui.update();
    
    if(this.mHero.getXform().getYPos()>=150){
        this.mCamera.setWCCenter(400,this.mHero.getXform().getYPos());
    }
    if(this.mHero.getXform().getYPos()>=450){
        this.mCamera.setWCCenter(400,450);
    }
     
    
    // Support hero movements
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        if(xformLeft.getYPos()<570)
        {    xformLeft.incYPosBy(deltaY);
        }  
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        if(xformLeft.getYPos()>0)
        {
            xformLeft.incYPosBy(-deltaY);
        }
    }
    
     if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if(xformRight.getYPos()<570)
        {   xformRight.incYPosBy(deltaY);
        }  
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if(xformRight.getYPos()>0)
        {   xformRight.incYPosBy(-deltaY);
        }
    }
    
    var Ydiff =this.RightPoint.getXform().getYPos()-this.LeftPoint.getXform().getYPos();
    var Xdiff =this.RightPoint.getXform().getXPos()-this.LeftPoint.getXform().getXPos();
    var Ysum =this.RightPoint.getXform().getYPos()+this.LeftPoint.getXform().getYPos();
    var Xsum =this.RightPoint.getXform().getXPos()+this.LeftPoint.getXform().getXPos();
    var length= Math.sqrt(Math.pow(Xdiff,2)+Math.pow(Ydiff,2));
    var angle = Math.atan(Ydiff *1.0/Xdiff);

    this.lever.getXform().setSize(length,4);
    this.lever.getXform().setPosition(Xsum*1.0/2, Ysum*1.0/2);
    this.lever.getXform().setRotationInRad(angle);
    
    this.lever.getRigidBody().setTransform(this.lever.getXform());
    this.lever.getRigidBody().mWidth=length;
    
    var heronewY= (this.mHero.getXform().getXPos()-this.LeftPoint.getXform().getXPos())*Ydiff/Xdiff+
            (this.LeftPoint.getXform().getYPos()+ this.lever.getXform().getHeight()+this.mHero.getXform().getHeight()/2+ 2)  - 9* Math.cos(angle);
    var heronewX= this.mHero.getXform().getXPos()- 9* Math.sin(angle);
    if( heronewY >600) heronewY= 600 ;
    if( heronewY <0) heronewY= 0 ;
    if( heronewX >560-this.herowidth/2) heronewX= 560-this.herowidth/2 ;
    if( heronewX <240+this.herowidth/2) heronewX= 240+this.herowidth/2 ;
    this.mHero.getXform().setPosition(heronewX,heronewY);
    this.mHero.getXform().setRotationInRad(angle); 
    
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
        var newwidth =100 -2.5*this.KeyNCount;
        this.mKeyNBar.getXform().setSize(newwidth,1.5);
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
        this.mKeyNBar.getXform().setSize(100,1.5);
        this.KeyNCount=0;
    }
    
    this.mAllObjs.update();
    this.mOtherObjs.update();
    this.mStarset.update();
    this.mBlackHoleset.update();
    this.mRubbishset.update();
    this.mChaserSet.update();
    this.mToothset.update();
    this.updateBH();  
    this.updateChaser();
    this.mHero.updateChaser(this.mChaserSet);
    
    var h = [];
    var i;
    for(i=0;i<this.mStarset.size();i++){
        if(this.mHero.boundTest(this.mStarset.getObjectAt(i))){
            this.starcount++;
            this.mStarset.getObjectAt(i).setVisibility(false);
            this.mStarset.removeFromSet(this.mStarset.getObjectAt(i));
            gEngine.AudioClips.playACue(this.kCue);
        }
    }
    
    var msg = this.starcount + "/" + this.totalcount;
    this.mMsg.setText(msg);
    
    var h=[];
    if(this.mHero.boundTest(this.mDoor)){
        this.restart=false;
        gEngine.GameLoop.stop();
    }
    
    var h = [];
    var i;
    for(i=0;i<this.mBlackHoleset.size();i++){
        if(this.mHero.boundTest(this.mBlackHoleset.getObjectAt(i))){
            this.restart = true;
            gEngine.GameLoop.stop();
        }
    }
    
    var i;
    for(i=0;i<this.mRubbishset.size();i++){
        if(this.mHero.boundTest(this.mRubbishset.getObjectAt(i))){
            this.restart = true;
            gEngine.GameLoop.stop();
        }
    }
    
     var i;
    for(i=0;i<this.mToothset.size();i++){
        if(this.mHero.boundTest(this.mToothset.getObjectAt(i))){
            this.restart = true;
            gEngine.GameLoop.stop();
        }
    }

};

Level5.prototype.updateBH = function () {
    
    if(this.BHsize===0){
        this.BHflag=1;
    }
    else if(this.BHsize===40){
        this.BHflag=0;
    }
    if(this.BHflag===1){
        this.BHsize=this.BHsize+0.5;
    }
    else{
        this.BHsize=this.BHsize-0.5;
    }
    //console.log(this.BHsize);
    var i,obj;
    for(i=0;i<this.mBlackHoleset.size();i++){
        obj=this.mBlackHoleset.getObjectAt(i);
        obj.getXform().setSize(10+this.BHsize,10+this.BHsize);
        obj.setBoundRadius((10+this.BHsize)/2);
        obj.getXform().incRotationByDegree(1);
    }
};

Level5.prototype.updateChaser = function () {
    
    if(this.mHero.getXform().getYPos()<300){
        this.timeLaunch++;    
        if(this.timeLaunch === 200){
            var c = new Chaser(this.kRubbish,this.mR1.getXform().getXPos(),this.mR1.getXform().getYPos(),10,10,0.7,300);
            this.mChaserSet.addToSet(c);
            this.timeLaunch=0;
        }
        //console.log(this.timeLaunch);
    }
    else if(this.mHero.getXform().getYPos()>300){
        this.timeLaunch++;    
        if(this.timeLaunch === 200){
            var c = new Chaser(this.kRubbish,this.mR2.getXform().getXPos(),this.mR2.getXform().getYPos(),10,10,0.7,300);
            this.mChaserSet.addToSet(c);
            this.timeLaunch=0;
        }
    }
    
    var i, obj;
    for (i=0; i<this.mChaserSet.size(); i++) {
        obj = this.mChaserSet.getObjectAt(i);       
            if (obj.hasExpired()) {
                this.mChaserSet.removeFromSet(obj);
            }                              
    }
};

