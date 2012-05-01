var history=[];
var grid=[];
var rec=[];
var hisFlag=1;
var recFlag=0;
var max=50,size=15,speed=250;
var x,y;
var t,t2;
document.addEventListener("DOMContentLoaded", init, false);

function setSize(m,s,spd){
max=m;
size=s;
speed=spd;
document.getElementById("canv").width=max*size;
document.getElementById("canv").height=max*size;
loaded();
}

function init()
{var canvas = document.getElementById("canv");
canvas.addEventListener("mousedown", select, false);}

var loaded=function(){
	//draw the empty grid
	var canvas=document.getElementById('canv');
	var ctx=canvas.getContext("2d");
	ctx.strokeStyle="grey";
	for(var i=0;i<max;i++)
		for(var j=0;j<max;j++)
			ctx.strokeRect(i*size,j*size,size,size);
}


var toFlt=function(m,n){
	//all values to toFlt must be of 10th multilple, not the co-ordinates
	//eg:(50,120) instead of (5,12)
	//alert(flt);
	return parseFloat(m+'.'+(n+'').split('').reverse().join(''));
	//ok close your mouth ?:^P  see 'getXY' function for explantion of a simillar thing
}

function select(event){
	//to find the x and y position of click
	var x = new Number();
	var y = new Number();
	var canvas = document.getElementById("canv");
	
	if (event.x != undefined && event.y != undefined)
		{x = event.x;
		y = event.y;}
		
	else // Firefox method to get the position
		{x = event.clientX + document.body.scrollLeft +	document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;}
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	//the x and y values are the x and y co-ordinates of the click
	var ctx=canvas.getContext("2d");
	var m=parseInt(x/size);
	var n=parseInt(y/size);
	//making the start point to multiple of 10 ie. (12,21) and (14,27) are both (10,20)
	//alert(m+""+n);
	//to-do:check if the position is alive already
	//if so: delete the position
	//else: add it
	var flt=toFlt(m,n);
	var chumFlag=0;//chumma flag :P
	for(var i=0;i<grid.length;i++)
		if(grid[i]==flt){
			grid.splice(i,1);
			chumFlag=1;
		}
	
	if(chumFlag==0)
		grid.push(flt);
	//alert(grid);
	redraw();
	}

var getXY=function(flt){
	var m=Math.floor(flt);
	var n=(flt+"").split(".");
	//alert(n);
	if(n[1])
		n=parseInt(n[1].split("").reverse().join(""));
	//OK dont panic, first this splits the float using '.' and thus foo[1] is the decimal part
	//then it splits using ''(empty) which creates an array of charecters, reverses the array and joins it to form a string
	//in simple, it takes it decimal part and reverses it
	else
		n=0;	
	return [m,n];
}

function clearCanvas(context, canvas) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	var w = canvas.width;
	canvas.width = 1;
	canvas.width = w;
}

var redraw=function(){
var canvas=document.getElementById('canv');
var ctx=canvas.getContext("2d");
clearCanvas(ctx,canvas);
//alert(grid);
for(var i=0;i<grid.length;i++){
		//every element
		var m=getXY(grid[i])[0];
		var n=getXY(grid[i])[1];
		ctx.fillRect(m*size,n*size,size,size);
	}
	loaded();
}

var next=rec[0]=function(){
	//create a copy of grid as gridcopy
	var gridcopy=grid.slice(0);
	for(var i=0;i<gridcopy.length;i++){
		var m=getXY(gridcopy[i])[0];
		var n=getXY(gridcopy[i])[1];
		//alert(m+"_"+n+"\n"+grid);
		var count=0;//to count the number of alive cells around it
		
		for(var j=0;j<9;j++){
			//the 3x3 grid with m,n as center
			var p=Math.floor(j/3)-1;
			var q=j%3-1;
			if(j!=4){
				if(m+p<0)
					p=max-1-m;
				if(m+p>max-1)
					p=-m;
				if(n+q<0)
					q=max-1-n;
				if(n+q>max-1)
					q=-n;
				//all 8(9 minus itself) cells except out of boundaries
				//alert((m+p)+"-"+(n+q)+"\n"+p+","+q);
				liveFlag=0;//for checking if the cell is alive by checkin in gridcopy
				for(var k=0;k<gridcopy.length;k++){
					//each of gridcopy element ie(m+p,n+q)
					if(getXY(gridcopy[k])[0]==(m+p) && getXY(gridcopy[k])[1]==(n+q)){
						//if (one of the surounding item) is alive
						count+=1;
						liveFlag=1;
						break;
					}
				}
				if(liveFlag==0){
					//alert('dead cell: ('+(m+p)+','+(n+q)+')');
					//if the surrounding item(m+p,n+q) is dead in gridcopy
					var deathFlag=0;
					for(var l=0;l<grid.length;l++){
						if(getXY(grid[l])[0]==(m+p) && getXY(grid[l])[1]==(n+q)){
							//checking grid, if the element is present
							//this could be possible if the dead cell is changed to live from a previous position
							deathFlag=1;
						}
					}
					
					if(deathFlag==0){
						//ie. if the element isnt in grid. its dead in grid too..
						//so we need to check if the element could possibly become alive
						//copy of the previous lines with the changes below
						//j-l;p-r;q-s;m-m+p;n-n+q;k-o;count-deathCount
						var deathCount=0;//counts the number of alive cells around the dead cell
						for(var l=0;l<9;l++){
							var r=Math.floor(l/3)-1;
							var s=l%3-1;
							if(l!=4){
								if(m+p+r<0)
									r=max-1-m-p;
								if(m+p+r>max-1)
									r=-m-p;
								if(n+q+s<0)
									s=max-1-n-q;
								if(n+q+s>max-1)
									s=-n-q;
								//all 8(9-itself) cells
								//alert((m+p+r)+"="+(n+q+s)+"\n"+m+","+p+","+r+"|"+n+","+q+","+s);
								for(var o=0;o<gridcopy.length;o++){
									//each of gridcopy element ie(m+p+r,n+q+s)
									//check gridcopy if the neighbour of deadcell is alive
									if(getXY(gridcopy[o])[0]==(m+p+r) && getXY(gridcopy[o])[1]==(n+q+s)){
										//if (one of the surounding item) is alive
										deathCount+=1;
										break;
									}
								}
							}
						}
						//alert('dead cell: ('+(m+p)+','+(n+q)+') and count: '+deathCount);
						//the above code checks all the possible neighbour cells of our dead cell and gives out the number of alive cells
						if(deathCount==3){
							//alert('dead cell: ('+(m+p)+','+(n+q)+') and count: '+deathCount+"\ngrid:"+grid+"\nand gridcopy:"+gridcopy);
							//oh wow, this cell must be given birth
							//alert((m+p)+"w"+(n+q));
							grid.push(toFlt(m+p,n+q));
						}
					
					}
				}
			}
		}
	
		if(count<2 || count>3){
			for(var j=0;j<grid.length;j++){
				if(grid[j]==gridcopy[i]){
					grid.splice(j,1);
					//alert("grid-"+grid+"-"+	grid.length);
				}
			}
		}
	}
	if(hisFlag==1){
		if(history.length!=0)
			history.pop();
		history.push(gridcopy.slice(0));
		history.push(grid.slice(0));
	}
	redraw();//draws the grid array
	document.getElementById('gen').innerHTML=parseInt(document.getElementById('gen').innerHTML)+1;
}

var next1=rec[1]=function(){
//create a copy of grid as gridcopy
var gridcopy=grid.slice(0);
for(var i=0;i<gridcopy.length;i++){
	var m=getXY(gridcopy[i])[0];
	var n=getXY(gridcopy[i])[1];
	//alert(m+"_"+n);
	var count=0;//to count the number of alive cells around it
	
	for(var j=0;j<9;j++){
		//the 3x3 grid with m,n as center
		var p=Math.floor(j/3)-1;
		var q=j%3-1;
		if(j!=4 && m+p>=0 && m+p<max && n+q>=0 && n+q<max){
			//all 8(9 minus itself) cells except out of boundaries
			//alert((m+p)+"-"+(n+q));
			liveFlag=0;//for checking if the cell is alive by checkin in gridcopy
			for(var k=0;k<gridcopy.length;k++){
				//each of gridcopy element ie(m+p,n+q)
				if(getXY(gridcopy[k])[0]==(m+p) && getXY(gridcopy[k])[1]==(n+q)){
					//if (one of the surounding item) is alive
					count+=1;
					liveFlag=1;
					break;
				}
			}
			if(liveFlag==0){
				//alert('dead cell: ('+(m+p)+','+(n+q)+')');
				//if the surrounding item(m+p,n+q) is dead in gridcopy
				var deathFlag=0;
				for(var l=0;l<grid.length;l++){
					if(getXY(grid[l])[0]==(m+p) && getXY(grid[l])[1]==(n+q)){
						//checking grid, if the element is present
						//this could be possible if the dead cell is changed to live from a previous position
						deathFlag=1;
					}
				}
				
				if(deathFlag==0){
					//ie. if the element isnt in grid. its dead in grid too..
					//so we need to check if the element could possibly become alive
					//copy of the previous lines with the changes below
					//j-l;p-r;q-s;m-m+p;n-n+q;k-o;count-deathCount
					var deathCount=0;//counts the number of alive cells around the dead cell
					for(var l=0;l<9;l++){
						var r=Math.floor(l/3)-1;
						var s=l%3-1;
						if(l!=4 && m+p+r>=0 && m+p+r<max && n+q+s>=0 && n+q+s<max){
							//all 8(9-itself) cells except 'out of boundaries'
							//alert((m+p+p)+"-"+(n+q+q));
							for(var o=0;o<gridcopy.length;o++){
								//each of gridcopy element ie(m+p+r,n+q+s)
								//check gridcopy if the neighbour of deadcell is alive
								if(getXY(gridcopy[o])[0]==(m+p+r) && getXY(gridcopy[o])[1]==(n+q+s)){
									//if (one of the surounding item) is alive
									deathCount+=1;
									break;
								}
							}
						}
					}
					//alert('dead cell: ('+(m+p)+','+(n+q)+') and count: '+deathCount);
					//the above code checks all the possible neighbour cells of our dead cell and gives out the number of alive cells
					if(deathCount==3){
						//alert('dead cell: ('+(m+p)+','+(n+q)+') and count: '+deathCount+"\ngrid:"+grid+"\nand gridcopy:"+gridcopy);
						//oh wow, this cell must be given birth
						grid.push(toFlt(m+p,n+q));
					}
					
				}
			}
		}
	}
	
	if(count<2 || count>3){
		for(var j=0;j<grid.length;j++){
			if(grid[j]==gridcopy[i]){
				grid.splice(j,1);
				//alert("grid-"+grid+"-"+	grid.length);
			}
		}
	}
	
	
}
if(hisFlag==1){
	if(history.length!=0)
		history.pop();
	history.push(gridcopy.slice(0));
	history.push(grid.slice(0));
}
redraw();//draws the grid array
	document.getElementById('gen').innerHTML=parseInt(document.getElementById('gen').innerHTML)+1;
}


var editValues=function(){
stop();
document.getElementById('celledit').style.display='inline';
document.getElementById('cellset').style.display='none';
document.getElementById('speededit').style.display='inline';
document.getElementById('speedset').style.display='none';
document.getElementById('sizeedit').style.display='inline';
document.getElementById('sizeset').style.display='none';

document.getElementById('size').disabled=true;
document.getElementById('speed').disabled=true;
document.getElementById('cell').disabled=true;

var s=document.getElementById('cell').value;
var spd=document.getElementById('speed').value;
var m=document.getElementById('size').value;
if(!m)
m=20;
if(!s)
s=10;
if(!spd)
spd=250;

m=parseInt(m);
s=parseInt(s);
spd=parseInt(spd);

if(!m || !s || !spd)	
	alert('sorry, only numbers (and hot chicks) allowed');
else{
	setSize(m,s,spd);
	redraw();
	}
}

var run=function(){
//rec[recFlag]();
clearInterval(t);
t=setInterval("rec[recFlag]();",speed);
}

var stopCount=function(){
document.getElementById('gen').innerHTML=0;
stop();
}

var stop=function(){
document.getElementById('pause').style.display='none';
document.getElementById('play').style.display='inline';
clearInterval(t);
//alert('tadaaa');
}

var clearGrid=function(){
stop();
if(hisFlag==1)
	history.push(grid.slice(0));
grid=[];
redraw();
}

var prev=function(){
stop();
if(hisFlag==0)
return;
if(history.length>1){
	history.pop();
	grid=history[history.length-1].slice(0);
	}
else 
	if(history.length==1){
	grid=history.pop().slice(0);
	}
redraw();
document.getElementById('gen').innerHTML=parseInt(document.getElementById('gen').innerHTML)-1;
}

var clearHis=function(){
history=[];
document.getElementById('toast').style.display='inline';
document.getElementById('toastClose').style.display='inline';
setTimeout("document.getElementById('toast').style.display='none';document.getElementById('toastClose').style.display='none';",10000);
}

var nextStep=function(){
rec[recFlag]();
}

var changeHisFlag=function(x){
hisFlag=x;
return;
}

var changeRecFlag=function(x){
recFlag=x;
return;}

var luvu=function(){
stop();
if(t2!=0){
	clearInterval(t2);
	t2=0;}
else
	t2=setInterval("grid=[0.1,1,1.1,1.2,2,2.1,2.2,2.3,3.1,3.2,3.3,3.4,4,4.1,4.2,4.3,5,5.1,5.2,6.1];redraw();setTimeout('rec[recFlag]();',500);",1000);
}
