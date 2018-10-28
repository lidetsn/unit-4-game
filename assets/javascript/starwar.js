
var playerselected = false;
var defenderSelected = false;
var player = "";
var defender = "";
var baseAttackPower = 0;
   
var game = {
    
    characters:[{
        name: "Aemon-Gremm",
        imgsrc: "./assets/images/p1.jpeg",
        HealthPoints: 100,
        AttackPower: 10,
        CounterAttackPower: 5,
       
    },
    {
        name: "Agent-Gideon-Hask",
        imgsrc: "./assets/images/p2.jpeg",
        HealthPoints: 200,
        AttackPower: 50,
        CounterAttackPower: 30,
       
    },
    {
        name: "Anakin-Skywalker",
        imgsrc: "./assets/images/p3.jpeg",
        HealthPoints: 150,
        AttackPower: 15,
        CounterAttackPower: 2,
        
    },
    {
        name: "Baze-Malbus",
        imgsrc: "./assets/images/p4.jpeg",
        HealthPoints: 180,
        AttackPower: 30,
        CounterAttackPower: 12,
        
    }
       ],
 
    attack : function (pObj,dObj) {

            dObj.HealthPoints -=pObj.AttackPower;
            $("#attackInfo").html("You attacked   " +
            dObj.name + "  for <b>" + pObj.AttackPower +"</b>"+ " damage points.");
            game.increaseAttackPower(pObj);
        },

    increaseAttackPower :function (ob) {

             ob.AttackPower += baseAttackPower;
    },

    counterAttack :function (dObj,pObj) {

            pObj.HealthPoints -= dObj.CounterAttackPower;
            $("#counterAttackInfo").html(dObj.name + " counter attacked you for " +  dObj.CounterAttackPower + " damage points.");
    },

     setBaseAttackPower:function(ob){
              baseAttackPower=ob.AttackPower;
    },
    //******
     // it loads all the characters and display
    loadCharacters:function () {

            var coLength =12-(2*game.characters.length); //to allocate the col dynamically
            var lastImageTag="#characterimages" + " img:last-child";
            var lastDivTag="#characterimages" + " div:last-child";

            if(game.characters.length==2){
                $("#characterimages").append("<div>");// to make the remaining two characters center
                $(lastDivTag).addClass("col-1 mr-3");
                coLength=coLength-1;
            }

                game.characters.forEach(function(characterIn){ 

                $("#characterimages").append("<div>");//appendes a new div elemnt for each character and add a class card
                $(lastDivTag).addClass("card col-2 mx-3");
                $(lastDivTag).append("<img />");
                $(lastImageTag).attr("id", characterIn.name);
                $(lastImageTag).attr("class", "card-img-top");
                $(lastImageTag).attr("src", characterIn.imgsrc);
                $(lastImageTag).addClass("img-thumbnail");
                $(lastDivTag).append(characterIn.name + "<br>");
                $(lastDivTag).append("HP: " + characterIn.HealthPoints);              
                })
            $("#characterimages").append("<div>")// appends the remaining col for the last div
            $(lastDivTag).addClass("col-"+coLength);

            $("#characterimages").slideUp(1000).slideDown(1000)
     }//end of loading characters

}

//jquery code to launch the js 
///////////////////////////////////////////////////////////////////////////////////////
                $(document).ready(function () {
                    game.loadCharacters();
                    setvisibility("visibility:hidden","enemiesAvailable")
                    setvisibility("visibility:hidden","fight");
                });

//*********************************************************************************************** 
//start selecting player and defender
$(document).on("click", "img", function () {

// Stores the first clicked character as a player  and removes it from characters array
    if (!playerselected) {
        
         for (var i = 0; i < game.characters.length; i++) {
            if (game.characters[i].name == (this).id) {//id of the clicked imag with name of the object
                player = game.characters[i]; // sets current player which is an object
                game.setBaseAttackPower(player);
                game.characters.splice(i, 1);//removes the the clicked image from characters array
                playerselected = true;              
            }
         }
       //display the selected player 
       
    $("#playerDiv").addClass("card-deck card ");
    $("#playerDiv").append(this);
    $("#playerDiv").append(player.name + "<br>");
    $("#playerDiv").append("HP: " + player.HealthPoints);//

    $("#playerDiv").animate({left: "+=500px"},1000);
    $("#playerDiv").animate({left: "0px"}, 1000);

              cleardiv();
              setvisibility("visiblity:visible","enemiesAvailable")
              game.loadCharacters();//loadcharacrers for enemies 
              
    }
    // Stores the second clicked character as a defender  and removes it from the characters array
    if (playerselected && !defenderSelected && (this.id != player.name)) {
        for (var j = 0; j < game.characters.length; j++) {
             if (game.characters[j].name == (this).id) {
                 defender = game.characters[j]; // sets defender
                 game.characters.splice(j, 1);
                 defenderSelected = true;
                
                     }
                }   
       //display the selected defender
    $("#defenderDiv").show();
    $("#defenderDiv").addClass("card card-deck");   
    $("#defenderDiv").append(this);        
    $("#defenderDiv").append(defender.name + "<br>");
    $("#defenderDiv").append("HP: " + defender.HealthPoints); 
    
    $("#defenderDiv").animate({height: '700px'}, 1000);
    $("#defenderDiv").animate({width: '900px'}, 1000);
    $("#defenderDiv").animate({height: '260px'}, 1000);
    $("#defenderDiv").animate({width: '280px'}, 1000);
    
     getScoreInfo();//side display of info        
     cleardiv();
     game.loadCharacters();           
     setvisibility("visibility:visible","fight")    
                    
     }
    

});//end of img click event

//start attacking
$(document).on("click", "#attack", function () {
    if (playerselected && defenderSelected) {
        if (isAlive(player) && isAlive(defender)) {
           game.attack(player,defender);
           game.counterAttack(defender,player);           
                getScoreInfo();
        }
                
         if (!isAlive(player)) {//passed
                var btn= $("#attack").html("Restart Game");
                $("#message").append("<h4>YOU LOST THE GAME!</h4><h5>Try again...</h5>");
                $("#message").append("<img /><br>");
                $("img").attr("src", defender.imgsrc);
                $("img").addClass("rounded-circle");
                $("#message").append(btn);

                $("#maindiv").hide();                           
                $("#message").animate({// animation****************
                    left: '400px',
                    height: '+=90px',
                    width: '+=190px'
                });   
                $("#message").slideUp(2000).slideDown(2000) 
                                   
                $(document).on("click", "#attack", function () { // restarts game
                    location.reload();
                });           
        }//end of player loss

        if (!isAlive(defender)) {
             $("#counterAttackInfo").html("<h5>pick another enemy!</h5>");
             $("#attackInfo").html("<h3>Enemy defeated!</h3>"); 
             $("#counterAttackInfo,#attackInfo").slideUp(1000).slideDown(1000)   
             $("#defenderDiv").fadeOut(2000);
             $("#defenderDiv").html("");
             $("#defenderHealthDiv").html("");
             defenderSelected = false;

            if (isWinner()) {   
                var btn= $("#attack").html("Restart Game");
                $("#message").append("<h2>CONGRATULATIONS!<h2>  "+player.name);
                $("#message").append("<img /><br>");
                $("img").attr("src", player.imgsrc);
                $("img").addClass("rounded-circle");
                $("#message").append(btn);

                $("#maindiv").hide();                           
                $("#message").animate({// animation****************
                    left: '400px',
                    height: '+=90px',
                    width: '+=190px'
                });  
                $("#message").slideUp(2000).slideDown(2000)   
                                   
                $(document).on("click", "#attack", function () { // restarts game
                    location.reload();
                });              
                       
            }
        }
    }
});//end of attack event


function isWinner() {
    if ((game.characters.length == 0 && player.HealthPoints > 0) || (game.characters.length == 0 && player.HealthPoints>defender.HealthPoints))
        return true;
    else return false;
}
function isAlive(Obj) {
    if (Obj.HealthPoints > 0) {
        
        return true;
    }
    return false;
}
function getScoreInfo(){
    $("#playerScoreInfo").html("<h3>Player <br>HP:" + player.HealthPoints+"</h3>"); 
    $("#defenderScoreInfo").html("<h3>Defender HP:"  + defender.HealthPoints+"</h3>");
}


function setvisibility(vis,id) {
    document.getElementById(id).style = vis;
   
}
function cleardiv(){
 document.getElementById("characterimages").innerHTML="";
document.getElementById("attackInfo").innerHTML="";
document.getElementById("counterAttackInfo").innerHTML="";
}

function clearScreen(){
    $(".div1").hide();        
}

    

    