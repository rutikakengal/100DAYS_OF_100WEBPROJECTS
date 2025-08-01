
function Direction(Choice){
// The choice of the first buttons 
    
    if(Choice == "left" || Choice == "right"){
        document.getElementById("result").innerHTML = "You chose to go " + Choice + "!<br><br>You open the door and come into a new room. <br>A voice pops up: 'I'm glad you didn't try to escape. This isn't over yet though. Choose the next door.' <br> <br> You hear growls coming from the left door and a man talking behind the right door. What do you do?";
        document.getElementById('left1').style.display = 'none';
        document.getElementById("right1").style.display = 'none';
        document.getElementById("escape1").style.display = 'none';
        document.getElementById("result").style.display = 'inline';
        document.getElementById('left2').style.display = 'inline';
        document.getElementById("right2").style.display = 'inline';
        document.getElementById("escape2").style.display = 'inline';
    }
    
    if(Choice == "escape"){
        document.getElementById("result").innerHTML = "<br> HA! Nice try, but you won't get out that easily. You find gap in the wall. If you squeeze you can fit through it... Or can you? You get stuck in the wall and die of starvation.<br> <br> Try again... if you dare!<br><br>";
        
       //making sure the right buttons are displayed
        document.getElementById('left1').style.display = 'none';
        document.getElementById("right1").style.display = 'none';
        document.getElementById("escape1").style.display = 'none';
        document.getElementById("tryagain").style.display = 'block';
        document.getElementById("result").style.display = 'inline';
        document.getElementById("loseGif1").style.display = 'block';
    }
}
        
function Direction2(Choice){

        if(Choice == 'left2'){
            document.getElementById("result2").innerHTML = '<br><br>You chose to go left. You have a death wish or what? Well, I guess you were smart because there actually is a puppy in front of you. CUDDLE IT!<br><br> Though you have to choose again...<br><br>In the next room are three buttons. Choose wisely...<br><br>Hint: My creator likes this letter.' ;
        document.getElementById('left2').style.display = 'none';
        document.getElementById("right2").style.display = 'none';
        document.getElementById("escape2").style.display = 'none';
        document.getElementById("result2").style.display = 'inline';
        document.getElementById('A').style.display = 'inline';
        document.getElementById("B").style.display = 'inline';
        document.getElementById("C").style.display = 'inline';
        
        }
        
        if(Choice == 'right2'){
            document.getElementById("result2").innerHTML = "<br><br>You chose to go right. I probably would too. The man in the room doesn't look too happy though... With a gun in his hands... <br> <br> And you're a dead man. Try again if you think you can beat me...<br>";
        document.getElementById('left2').style.display = 'none';
        document.getElementById("right2").style.display = 'none';
        document.getElementById("escape2").style.display = 'none';
        document.getElementById("tryagain").style.display = 'inline';
        document.getElementById("result2").style.display = 'inline';
        document.getElementById("loseGif1").style.display = 'block';
        }
        
        if(Choice == 'escape2'){
            document.getElementById("result2").innerHTML = "<br>You chose to go and find an escape. Didn't I just tell you not to try? I guess you're not too smart... <br><br>You died. Try again if you think you can beat me...<br>";
        document.getElementById('left2').style.display = 'none';
        document.getElementById("right2").style.display = 'none';
        document.getElementById("escape2").style.display = 'none';
        document.getElementById("tryagain").style.display = 'inline';
        document.getElementById("result2").style.display = 'inline';
        document.getElementById("loseGif1").style.display = 'block';
    }
}

function Direction3(Choice){

        if(Choice == "A"){
            document.getElementById("result3").innerHTML = "<br><br>Nice one! Or did you just guess like always? Congratulations either way, because you're still alive. You're doing better than I expected. Let's do something fun now. Choose your favourite colour. Let's hope for you that it's the right one.";
        document.getElementById('A').style.display = 'none';
        document.getElementById("B").style.display = 'none';
        document.getElementById("C").style.display = 'none';
        document.getElementById("result3").style.display = 'inline';
        document.getElementById('blue').style.display = 'inline';
        document.getElementById("red").style.display = 'inline';
        document.getElementById("yellow").style.display = 'inline';
        document.getElementById("green").style.display = 'inline';
        document.getElementById("pink").style.display = 'inline';
        }
        
        if(Choice == "B" || Choice == "C"){
        document.getElementById("result3").innerHTML = "<br><br>Nope! If you would've just looked up the name of my creator... Try again if you dare!<br>";
        document.getElementById('A').style.display = 'none';
        document.getElementById("B").style.display = 'none';
        document.getElementById("C").style.display = 'none';
        document.getElementById("tryagain").style.display = 'inline';
        document.getElementById("result3").style.display = 'inline';
        document.getElementById("loseGif1").style.display = 'block';
        }
        
}

function Direction4(Choice){
        document.getElementById("result4").innerHTML = "<br><br>Pfew, you survived! That was a hard one, wasn't it? Good thing every answer would've been right then ;)<br><br> Now onto the fun part! At least... Fun for me! So how is your memory? I hope it's doing alright. What was the first option in the last question?";
        document.getElementById('blue').style.display = 'none';
        document.getElementById("red").style.display = 'none';
        document.getElementById("yellow").style.display = 'none';
        document.getElementById("pink").style.display = 'none';
        document.getElementById("green").style.display = 'none';
        document.getElementById("result4").style.display = 'inline';
        document.getElementById('blue2').style.display = 'inline';
        document.getElementById("red2").style.display = 'inline';
        document.getElementById("yellow2").style.display = 'inline';
        document.getElementById("pink2").style.display = 'inline';
        document.getElementById("green2").style.display = 'inline';
    }
    
function Direction5(Choice){
    
    if(Choice == "red2"){
        document.getElementById("result5").innerHTML = "<br><br>Looks like you're almost out! Just one last question. Will you give this code a like?";
        document.getElementById("result5").style.display = 'inline';
        document.getElementById('blue2').style.display = 'none';
        document.getElementById("red2").style.display = 'none';
        document.getElementById("yellow2").style.display = 'none';
        document.getElementById("pink2").style.display = 'none';
        document.getElementById("green2").style.display = 'none';
        document.getElementById("yes").style.display = 'inline';
        document.getElementById("no").style.display = 'inline';
    }
    
    if(Choice == "blue2" || Choice == "yellow2" || Choice == "pink2" || Choice == "green2"){
         document.getElementById("result5").innerHTML = "<br><br>Pfft. You're not even paying attention? Get your mind working and try again...";
        document.getElementById("result5").style.display = 'inline';
        document.getElementById('blue2').style.display = 'none';
        document.getElementById("red2").style.display = 'none';
        document.getElementById("yellow2").style.display = 'none';
        document.getElementById("pink2").style.display = 'none';
        document.getElementById("green2").style.display = 'none';
        document.getElementById("tryagain").style.display = 'inline';
        document.getElementById("loseGif1").style.display = 'block';
    }
}

function Direction6(Choice){
    if(Choice == "yes"){
        document.getElementById("result6").innerHTML = "<br><br>WOOOOO YOU MADE IT! CONGRATS! *gives high five* Don't forget to actually give a like now ;)<br>";
        document.getElementById("yes").style.display = 'none';
        document.getElementById("no").style.display = 'none';
        document.getElementById("winGif").style.display = 'block';
    }
    
    if(Choice == "no"){
        document.getElementById("result6").innerHTML = "<br><br>Shame I can't let you out now... Try again when you're ready...";
        document.getElementById("yes").style.display = 'none';
        document.getElementById("no").style.display = 'none';
        document.getElementById("tryagain").style.display = 'inline';
        document.getElementById("loseGif1").style.display = 'block';
    }
}
    
function TryAgain(){ //running the whole code again 
    Direction();
    document.getElementById("result3").style.display = 'none';
    document.getElementById("result4").style.display = 'none';
    document.getElementById("result5").style.display = 'none';
    document.getElementById("result6").style.display = 'none';
    document.getElementById('left1').style.display = 'inline';
    document.getElementById("right1").style.display = 'inline';
    document.getElementById("escape1").style.display = 'inline';
    document.getElementById('left2').style.display = 'none';
    document.getElementById("right2").style.display = 'none';
    document.getElementById("escape2").style.display = 'none';
    document.getElementById('result').style.display = 'none';
    document.getElementById("result2").style.display = 'none';
    document.getElementById('tryagain').style.display = 'none';
    document.getElementById("loseGif1").style.display = 'none';
}