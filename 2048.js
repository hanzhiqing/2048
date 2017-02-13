function setCookie(name,value){
  var now=new Date();
  now.setMonth(now.getMonth()+1);
  document.cookie=name+"="+value
         +";expires="+now.toGMTString();
}

function getCookie(name){
  var cookies=
    document.cookie.split("; ");
  for(var i=0;i<cookies.length;i++){
    if(cookies[i].startsWith(name)){
      return cookies[i].split("=")[1]
    }
  }
}
var game={
  data:null,
  RN:4,
  CN:4,
  score:0,
  top:0,
  state:1,
  RUNNING:1,
  GAMEOVER:0,
  CSIZE:100,
  MARGIN:16,
  
  init:function(){
    
    for(var r=0,arr=[];r<this.RN;r++){
      
      for(var c=0;c<this.CN;c++){
        
        arr.push(""+r+c);
      }
    }
    
    var html=arr.join(
      '" class="grid"></div><div id="g'
    );
    
    html='<div id="g'+html
        +'" class="grid"></div>'
    
    var htmlc=html.replace(
      /g(\d{2})|grid/g,
      function(kword,$1){
        
        return kword=="grid"?
                    "cell":"c"+$1;
      }
    );
    
    var panel=
    document.getElementById("gridPanel");
    
    panel.innerHTML=html+htmlc;
    
    var width=
      this.CN*(this.CSIZE+this.MARGIN)
      +this.MARGIN;
    
    var height=
      this.RN*(this.CSIZE+this.MARGIN)
      +this.MARGIN;
    
    panel.style.width=width+"px";
    
    panel.style.height=height+"px";
  },

  start:function(){
    
    this.top=getCookie("top")||0;
    this.init();
    this.score=0;
    
    this.state=this.RUNNING;
    this.data=[];
    
    for(var r=0;r<this.RN;r++){
      
      this.data[r]=[];
      
      for(var c=0;c<this.CN;c++){
        
        this.data[r][c]=0
      }
    }
    this.randomNum();
    this.randomNum();
    this.updateView();
    
    
    
    document.onkeydown=function(e){
      
      
      switch(e.keyCode){
        case 37:
          this.moveLeft(); break;
        case 38:
          this.moveUp(); break;
        case 39:
          this.moveRight(); break;
        case 40:
          this.moveDown(); break;
      }
    }.bind(this);
  },
  
  updateView:function(){
    for(var r=0;r<this.RN;r++){
      for(var c=0;c<this.CN;c++){
        var div=
          document.getElementById(
            "c"+r+c
          );
        
        if(this.data[r][c]!=0){
          
          div.innerHTML=this.data[r][c];
         
          div.className=
            "cell n"+this.data[r][c];
        }else{
          
          div.innerHTML="";
          
          div.className="cell";
        }
      }
    }
    
    document.getElementById("score")
            .innerHTML=this.score;
    
    document.getElementById("top")
            .innerHTML=this.top;
    
    if(this.state==this.GAMEOVER){
      
      document.getElementById("gameOver")
              .style.display="block";
      
      document.getElementById("fScore")
              .innerHTML=this.score;
      
      if(this.score>this.top){
        setCookie("top",this.score);
      }
    }else{
      
      document.getElementById("gameOver")
              .style.display="none";
    }
  },
  
  randomNum:function(){
    while(true){
    
      var r=
       Math.floor(Math.random()*this.RN);
    
      var c=
       Math.floor(Math.random()*this.CN);
    
      if(this.data[r][c]==0){
      
        
        this.data[r][c]=
          Math.random()<0.5?2:4;
        break;
      }
    }
  },
  isGameOver:function(){
    
    for(var r=0;r<this.RN;r++){
      for(var c=0;c<this.CN;c++){
        
        if(this.data[r][c]==0){
          return false;
        }
        
        if(c<this.CN-1
          &&this.data[r][c]
            ==this.data[r][c+1]){
          return false;
        }
        
        if(r<this.RN-1
          &&this.data[r][c]
            ==this.data[r+1][c]){
          return false;
        }
      }
    }
    return true;
  },
  moveLeft:function(){
    
    var before=String(this.data);
    
    for(var r=0;r<this.RN;r++){
      this.moveLeftInRow(r);
    }
    
    var after=String(this.data);
    
    if(before!=after){
      this.randomNum();
      
      if(this.isGameOver()){
        
        this.state=this.GAMEOVER;
      }
      this.updateView();
    }
  },
  moveLeftInRow:function(r){
    
    for(var c=0;c<this.CN-1;c++){
      
      var nextc=this.getNextInRow(r,c);
      
      if(nextc==-1){break;}
      else{
        
        if(this.data[r][c]==0){
          
          this.data[r][c]=
            this.data[r][nextc];
          
          this.data[r][nextc]=0;
          c--;
        }else if(this.data[r][c]==
                 this.data[r][nextc]){
        
          
          this.score+=
            (this.data[r][c]*=2);
          
          this.data[r][nextc]=0;
        }
      }
    }
  },
 
  getNextInRow:function(r,c){
    
    for(var nextc=c+1;
        nextc<this.CN;
        nextc++){
      
      if(this.data[r][nextc]!=0){
        return nextc;
      }
    }
    return -1;
  },
  moveRight:function(){
    
    var before=String(this.data);
    
    for(var r=0;r<this.RN;r++){
      this.moveRightInRow(r);
    }
    
    var after=String(this.data);
    
    if(before!=after){
      
      this.randomNum();
      
      if(this.isGameOver()){
        
        this.state=this.GAMEOVER;
      }
      this.updateView();
    }
  },
  moveRightInRow:function(r){
    
    for(var c=this.CN-1;c>0;c--){
      
      var prevc=this.getPrevInRow(r,c);
      
      if(prevc==-1){break;}
      else{
        
        if(this.data[r][c]==0){
          
          this.data[r][c]=
            this.data[r][prevc];
          
          this.data[r][prevc]=0;
          c++;
        }else if(this.data[r][c]==
                  this.data[r][prevc]){
        
          
          this.score+=
            (this.data[r][c]*=2);
          
          this.data[r][prevc]=0;
        }
      }
    }
  },
  getPrevInRow:function(r,c){
    
    for(var prevc=c-1;prevc>=0;prevc--){
      
      if(this.data[r][prevc]!=0){
        return prevc;
      }
    }
    return -1;
  },
  moveUp:function(){
    
    var before=String(this.data);
    
    for(var c=0;c<this.CN;c++){
      this.moveUpInCol(c);
    }
    
    var after=String(this.data);
    
    if(before!=after){
      
      this.randomNum();
      
      if(this.isGameOver()){
        
        this.state=this.GAMEOVER;
      }
      this.updateView();
    }
  },
  moveUpInCol:function(c){
    
    for(var r=0;r<this.RN-1;r++){
      
      var nextr=this.getNextInCol(r,c);
      
      if(nextr==-1){break;}
      else{
        
        if(this.data[r][c]==0){
          
          this.data[r][c]=
            this.data[nextr][c];
          
          this.data[nextr][c]=0;
          r--;
        }else if(this.data[r][c]==
                   this.data[nextr][c]){
        
          
          this.score+=
            (this.data[r][c]*=2);
          
          this.data[nextr][c]=0;
        }
      }
    }
  },
  getNextInCol:function(r,c){
    
    for(var nextr=r+1;nextr<this.RN;nextr++){
      
      if(this.data[nextr][c]!=0){
        return nextr;
      }
    }
    return -1;
  },
  moveDown:function(){
    
    var before=String(this.data);
    
    for(var c=0;c<this.CN;c++){
      this.moveDownInCol(c);
    }
    
    var after=String(this.data);
    
    if(before!=after){
      
      this.randomNum();
      
      if(this.isGameOver()){
        
        this.state=this.GAMEOVER;
      }
      this.updateView();
    }
  },
  moveDownInCol:function(c){
    
    for(var r=this.RN-1;r>0;r--){
      
      var prevr=this.getPrevInCol(r,c);
      
      if(prevr==-1){break;}
      else{
        
        if(this.data[r][c]==0){
          
          this.data[r][c]=
            this.data[prevr][c]
          
          this.data[prevr][c]=0;
          r++;
        }else if(this.data[r][c]==
                  this.data[prevr][c]){
        
          
          this.score+=
            (this.data[r][c]*=2);
          
          this.data[prevr][c]=0;
        }
      }
    }
  },
  getPrevInCol:function(r,c){
    
    for(var prevr=r-1;prevr>=0;prevr--){
      
      if(this.data[prevr][c]!=0){
        return prevr;
      }
    }
    return -1;
  }
}

window.onload=function(){game.start();}