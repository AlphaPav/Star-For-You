/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
"use strict";  

function Level6(){
    //texture
    this.kSprite="assets/animation.png";
    this.kSpiked="assets/tooth.png";
    this.kStar="assets/yellow.png";
    this.kHole="assets/Hole.png";
    this.kCue="assets/Star.wav";
    //camera
    this.mCamera=null;
    this.mCamera2=null;
    this.mCui=null;
    
    //object
    this.mHero=null;
    this.mSpiked=null;
    this.mMsg=null;
    this.mMsg2=null;
    this.mMsg3=null;
    this.mStaritem=null;
    this.mHole=null;
    
    //Set
    this.mPlatformSet=null;
    this.mSpringSet=null;
    this.mStarSet=null;
    this.mHoleSet=null;
   
    //variable
    this.springcount=0;
    this.springflag=0;
    this.springfirst=0;
    this.touchspring=0;
    
    this.starcount=0;
    this.time=500;
    this.time2=650;
    this.wholeTime=3600;//3600===1min
    
    //flags
    this.restart=0;//0 for not restart
}

gEngine.Core.inheritPrototype(Level6, Scene);

Level6.prototype.loadScene=function(){
    gEngine.Textures.loadTexture(this.kSprite);
    gEngine.Textures.loadTexture(this.kSpiked);
    gEngine.Textures.loadTexture(this.kStar);
    gEngine.Textures.loadTexture(this.kHole);
};

Level6.prototype.unloadScene=function(){
    gEngine.Textures.unloadTexture(this.kSprite);
    gEngine.Textures.unloadTexture(this.kSpiked);
    gEngine.Textures.unloadTexture(this.kStar);
    gEngine.Textures.unloadTexture(this.kHole);
    this.mHero.setWASDDelta(2);
    gEngine.Physics.setSystemtAcceleration(400);
    if(this.restart){
        var new_level=new StartScene();
        gEngine.Core.startScene(new_level);
    }
  //  var new_level=new Level3();
    //gEngine.Core.startScene(new_level);
};

Level6.prototype.initialize=function(){
    gEngine.Physics.setSystemtAcceleration(600);
    this.initialize_Camera();
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.mPlatformSet=new GameObjectSet();
    this.mSpringSet= new GameObjectSet();
    this.mStarSet= new GameObjectSet();
    this.mHoleSet = new GameObjectSet();
    
    this.mMsg = new FontRenderable("0");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(43,27);
    this.mMsg.setTextHeight(15);
    this.mStaritem = new TextureRenderable(this.kStar);
    this.mStaritem.getXform().setPosition(20,24);
    this.mStaritem.getXform().setSize(30,30);
    this.mMsg2 = new FontRenderable("Level 6");
    this.mMsg2.setColor([0, 0, 0, 1]);
    this.mMsg2.getXform().setPosition(20,9);
    this.mMsg2.setTextHeight(11);
    this.mMsg3=new FontRenderable("60s");
    this.mMsg3.setColor([0,0,0,1]);
    this.mMsg3.getXform().setPosition(65,27);
    this.mMsg3.setTextHeight(15);
    
    this.mHero=new Hero(this.kSprite,750,600,40,40,1024);
    this.mHero.setWASDDelta(3);
    this.mFirstObject = this.mPlatformSet.size();
    this.mCurrentObj = this.mFirstObject;
    this.mPlatformSet.addToSet(this.mHero);
    
    this.initialize_Platform();
    this.initialize_Spring();
        
    //this.mSpiked = new Item(600,920,90,40,40,this.kSpiked);
    this.initialize_Star();
};
Level6.prototype.initialize_Camera=function(){
    this.mCamera=new Camera(
        vec2.fromValues(750,600),
        800,
        [0,0,800,600]
        );
    this.mCamera.setBackgroundColor([0.8,0.8,0.8,1]);

    this.mCamera2=new Camera(
        vec2.fromValues(3000,600),
        6000,
        [680,510,120,90]
        );
    this.mCamera2.setBackgroundColor([0.9,0.9,0.9,1]);
    
    this.mCui = new Camera(
            vec2.fromValues(40,20),
            100,
            [0,525,150,75]);
    this.mCui.setBackgroundColor([0.8,0.8,0.8,1]);
};
Level6.prototype.initialize_Platform=function(){
    this.mPlatform1=new MapObject(750,565,0,100,16,null);
    this.mPlatformSet.addToSet(this.mPlatform1);
    this.mPlatform2=new MapObject(450,300,0,120,16,null);
    this.mPlatformSet.addToSet(this.mPlatform2);
    this.mPlatform3= new MapObject(750,8,0,1500,16,null);//down bound
    this.mPlatformSet.addToSet(this.mPlatform3);
    this.mPlatform4 = new MapObject(-8,600,0,16,1200,null);//left bound
    this.mPlatformSet.addToSet(this.mPlatform4);
    this.mPlatform5 = new MapObject(1504,640,0,16,1120,null);//first scene right up bound
    this.mPlatformSet.addToSet(this.mPlatform5);
    this.mPlatform7 = new MapObject(1504,40,0,16,80,null);//first scene right down bound
    this.mPlatformSet.addToSet(this.mPlatform7);
    this.mPlatform6 = new MapObject(750,1208,0,1500,16,null);//up bound
    this.mPlatformSet.addToSet(this.mPlatform6);
    this.mPlatform8 = new MapObject(25,600,0,50,16,null);//Spring2's platform
    this.mPlatformSet.addToSet(this.mPlatform8);
    this.mPlatform9 = new MapObject(500,1050,0,140,16,null);
    this.mPlatformSet.addToSet(this.mPlatform9);
    this.mPlatform10 = new MapObject(600,900,0,300,16,null);//danger platform
    this.mPlatformSet.addToSet(this.mPlatform10);
    this.mPlatform11 = new MapObject(1200,450,0,180,16,null);
    this.mPlatformSet.addToSet(this.mPlatform11);
    this.mPlatform12 = new MapObject(1475,600,0,50,16,null);//Spring4'ss platform
    this.mPlatformSet.addToSet(this.mPlatform12);
};
Level6.prototype.initialize_Spring=function(){
    this.mSpring1= new Spring(this.kSprite,200,43,50,50,574,0);
    this.mSpringSet.addToSet(this.mSpring1);
    this.mSpring2 = new Spring(this.kSprite,25, 633, 50, 50, 574,0);
    this.mSpringSet.addToSet(this.mSpring2);
    this.mSpring3 = new Spring(this.kSprite,1400, 43, 50, 50,574,0);
    this.mSpringSet.addToSet(this.mSpring3);
    this.mSpring4 = new Spring(this.kSprite,1475, 633, 50, 50, 574,0);
    this.mSpringSet.addToSet(this.mSpring4);
};
Level6.prototype.initialize_Star=function(){
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
    this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
    this.mStarSet.addToSet(this.mStar);
};
Level6.prototype.draw=function(){
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);
    
    this.mCamera.setupViewProjection();
    this.mSpringSet.draw(this.mCamera);
    this.mPlatformSet.draw(this.mCamera);   
  //  this.mSpiked.draw(this.mCamera);
    this.mStarSet.draw(this.mCamera);
    this.mHoleSet.draw(this.mCamera);
    
    this.mCamera2.setupViewProjection();
    this.mPlatformSet.draw(this.mCamera2);
    this.mSpringSet.draw(this.mCamera2);
 //   this.mSpiked.draw(this.mCamera2);
    this.mStarSet.draw(this.mCamera2);
    
    this.mCui.setupViewProjection();
    this.mMsg.draw(this.mCui); 
    this.mMsg2.draw(this.mCui); 
    this.mMsg3.draw(this.mCui);
    this.mStaritem.draw(this.mCui);
    
    this.mCollisionInfos = [];
};

var flag=0;//0 for go right
Level6.prototype.update=function(){
    var obj = this.mPlatformSet.getObjectAt(this.mCurrentObj);
    
    obj.getRigidBody().userSetsState();
    
    gEngine.Physics.processCollision(this.mPlatformSet, this.mCollisionInfos);
    
    this.mPlatformSet.update();
    if(this.mPlatformSet.getObjectAt(10).getXform().getXPos()>=950){
        flag=1;
    }
    else if(this.mPlatformSet.getObjectAt(10).getXform().getXPos()<=600){
        flag=0;
    }
    if(flag===0){
        this.mPlatformSet.getObjectAt(10).getXform().incXPosBy(5);
        //this.mSpiked.getXform().incXPosBy(5);
        this.mHero.CheckUpdate_Platform(this.mPlatformSet.getObjectAt(10),0,5);
    }
    else{
        this.mPlatformSet.getObjectAt(10).getXform().incXPosBy(-5);
       // this.mSpiked.getXform().incXPosBy(-5);
        this.mHero.CheckUpdate_Platform(this.mPlatformSet.getObjectAt(10),0,-5);
    }
    
    
    this.mCamera.update();
    this.mCamera.setWCCenter(this.mHero.getXform().getXPos(),this.mHero.getXform().getYPos());
    
    this.updateSpring(this.mSpring1,1);
    this.updateSpring(this.mSpring2,1);
    this.updateSpring(this.mSpring3,1);
    this.updateSpring(this.mSpring4,1);
    
    //console.log(this.touchspring);
    
    if(this.touchspring===0){
        obj.keyControl(this.mPlatformSet,this.mSpringSet,450);
    }
    
    this.time--;
    this.time2--;
    this.mStarSet.update();
    var i,j;
    for(i=0;i<this.mStarSet.size();i++){
        //if Hero touch the Star
        if(this.mHero.boundTest(this.mStarSet.getObjectAt(i))){
            this.starcount++;
            this.mStarSet.getObjectAt(i).setVisibility(false);
            this.mStarSet.removeFromSet(this.mStarSet.getObjectAt(i));
        }
        //if the Star life goes end
        if(this.time===0){
            for(j=0;j<this.mStarSet.size()/2;j++){
                this.mStarSet.getObjectAt(j).setVisibility(false);
                this.mStarSet.removeFromSet(this.mStarSet.getObjectAt(j));
            }
        }
        if(this.time2===0){
            for(j=0;j<this.mStarSet.size()/2;j++){
                this.mStarSet.getObjectAt(j).setVisibility(false);
                this.mStarSet.removeFromSet(this.mStarSet.getObjectAt(j));
            }
        }
        
    }
    
    if(this.mStarSet.size()<10){
        for(i=0;i<10-this.mStarSet.size();i++){
            this.mStar = new Star(this.kSprite,Math.random()*1400+50,Math.random()*1100+50,40,40);
            this.mStarSet.addToSet(this.mStar);
        }
    }

    var msg = this.starcount+ " ";
    this.mMsg.setText(msg);
    
    if(this.wholeTime>0){
        this.wholeTime--;
       
    }
    if(this.wholeTime%60===0){
        var k=this.wholeTime/60;
        msg=k+"s";
        this.mMsg3.setText(msg);
    }
    if(this.wholeTime===0){
        if(this.starcount>=1){
            if(this.mHoleSet.size()===0){
                this.mHole=new Item(1200,240,0,80,80,this.kHole);
                this.mHoleSet.addToSet(this.mHole);
            }
        }
        else{
            this.restart=1;
            gEngine.GameLoop.stop();
        }
        
    }
  /*  if(this.mHero.getXform().getXPos()<=50){
         gEngine.GameLoop.stop();
    }*/
};
Level6.prototype.updateSpring=function(Spring,dir){
    this.Spring=Spring;
    if(dir===1){
        if((this.mHero.getXform().getYPos()-this.mHero.mHeight/2)<=(this.Spring.getXform().getYPos()+this.Spring.getXform().getHeight()/2)
            &&(this.mHero.getXform().getYPos()>=this.Spring.getXform().getYPos())
            &&(this.mHero.getXform().getXPos()>(this.Spring.getXform().getXPos()-this.Spring.getXform().getWidth()/2)+5)
            &&(this.mHero.getXform().getXPos()<(this.Spring.getXform().getXPos()+this.Spring.getXform().getWidth()/2)-5)
            &&(this.mHero.getRigidBody().getVelocity()[1]<=0)){
            
            
           
            if(this.springflag === 0){
                this.x=this.mHero.getXform().getXPos();
                this.y=this.mHero.getXform().getYPos();
                this.springflag=1;
                this.touchspring=1;
            }
        
        //this.springcount++;
       // console.log(this.mHero.getXform().getXPos()+"  "+this.mHero.getXform().getYPos());
            if(this.springfirst===0){
                if(this.springcount<5)
                {
                    this.Spring.update();
                    this.mHero.getXform().setPosition(this.x,this.y);
                    this.springcount++;
                }
                else{
                    this.mHero.getXform().setPosition(this.x,this.y);
                    this.mHero.getRigidBody().setVelocity(0,690);
                    this.springcount=0;
                    this.springflag=0;
                    this.springfirst=1;
                    this.touchspring=0;
                }           
            }
            else{
                if(this.springcount<6)
                {
                    this.Spring.update();
                    this.mHero.getXform().setPosition(this.x,this.y);
                    this.springcount++;
                }
                else{
                    this.mHero.getXform().setPosition(this.x,this.y);
                    this.mHero.getRigidBody().setVelocity(0,690);
                    this.springcount=0;
                    this.springflag=0;
                    this.springfirst=1;
                    this.touchspring=0;
                }            
            }
        } 
    
    }
};