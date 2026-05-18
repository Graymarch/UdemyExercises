buttonColors = ["red", "blue", "green", "yellow"];
gamePattern = []
gamePattern.push(Math.floor(Math.random() * Math.floor(buttonColors.length)))
audioElement = document.createElement("audio");
cursor = 0;
const delay = (ms) => new Promise(res => setTimeout(res, ms));

function addColor(){
    gamePattern.push(Math.floor(Math.random() * Math.floor(buttonColors.length)))
    console.log(gamePattern)
}

function playSound(id){
    $(audioElement).attr("src", "/Sec.20/sounds/" + id + ".mp3");
    audioElement.play()
}

function flash(obj){
    obj.fadeOut(150).fadeIn(150);
}

function isCorrect(id){
    target = buttonColors[gamePattern[cursor]];
    correct = target == id;
    
    if(id == target){
        cursor++;
        if(cursor >= gamePattern.length){
            cursor = 0;
            addColor();
            playPattern();
        }
    }else{
        gameOver();
        $("#level-title").text("Game Over. Press any key to restart.")
        $(document).one("keypress", function(){
            $(this).text("Level " + gamePattern.length);
            gamePattern = [];
            gamePattern.push(Math.floor(Math.random() * Math.floor(buttonColors.length)));
            playPattern();
            $("#level-title").text("Level " + gamePattern.length);
        });
    }

    return correct;
}

async function gameOver() {
    $("body").addClass("game-over");
    await delay(200);
    $("body").removeClass("game-over");
}

async function playPattern(){
    await delay(1000);
    for(i of gamePattern){
        flash($("#" + buttonColors[i]));
        playSound(buttonColors[i]);
        await delay(500);
    }
}

$(document).one("keypress", function(){
    playPattern();
    $("#level-title").text("Level " + gamePattern.length);

    $(".btn").on("click", function(){
        if(isCorrect($(this).attr("id"))){
            flash($(this));
            id = $(this).attr("id");
            playSound(id);
            $("#level-title").text("Level " + gamePattern.length);
        }
    });
})