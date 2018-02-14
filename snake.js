window.onload = function(){ //on load guard

//GLOBAL VARS
const canvas = document.getElementById("window")
const context= canvas.getContext("2d")
const pauseButton = document.getElementById("pause")
const scoreBox = document.getElementById("score")

const SNAKE_SIZE = { width: 30, height: 30 }

const spawnPoint = { x: canvas.width/2, y: canvas.height/2 }

const direction = { north: 0, south: 1, east: 2, west: 3 }

const SLEEP_TIME = 100

var isPaused = false

var snake
var gameLoop
var food
var score 

pauseButton.onclick = function(){
	isPaused = !isPaused
}



function update(delta){
	if(isPaused){ return }
	moveSnake()
	updateDirections()
	checkForHit()
	draw()
}

function checkForHit(){
	//food on head
	if(intersectingSnake(food,1,0)){
		incrementSnake()
		spawnFood()
		scoreBox.innerHTML = "Score " + ++score
	}
	//head on body
	if(intersectingSnake({x: snake[0].x, y: snake[0].y, w: SNAKE_SIZE.width, h: SNAKE_SIZE.height}, snake.length, 1)){
		decreaseSnake(snake.length-2)
		score = 0
		scoreBox.innerHTML = "Score " + score
	}
}


function updateDirections(){
	var recentDirection
	for(var i = snake.length-1; i > 0; i--){
		if(snake[i].direction != snake[i -1].direction && recentDirection != snake[i-1].direction){
			snake[i].direction = snake[i-1].direction
			recentDirection = snake[i-1].direction
		}
	}
}

window.addEventListener("keydown", function (event) {
	if(isPaused){ return }
		switch(event.key){
			case "a":
			if(snake[0].direction != direction.east){
				snake[0].direction = direction.west 
			}
			break
			case "d":
			if(snake[0].direction != direction.west){
				snake[0].direction = direction.east
			}
			break
			case "s":
			if(snake[0].direction != direction.north){
				snake[0].direction = direction.south
			}
			break
			case "w":
			if(snake[0].direction != direction.south){
				snake[0].direction = direction.north
			}
			break
			default:
			break
		}


		event.preventDefault();
	}, true);




function moveSnake(){
	for(var i = 0; i < snake.length; i++){
		switch(snake[i].direction){
			case direction.north:
			snake[i].y -= SNAKE_SIZE.height
			break
			case direction.east:
			snake[i].x += SNAKE_SIZE.width
			break
			case direction.south:
			snake[i].y += SNAKE_SIZE.height
			break
			case direction.west:
			snake[i].x -= SNAKE_SIZE.width
			break
			default:
			break
		} 
		if(snake[i].x < 0){
			snake[i].x = canvas.width
		}
		if(snake[i].x > canvas.width){
			snake[i].x = 0
		}
		if(snake[i].y < 0){
			snake[i].y = canvas.height
		}
		if(snake[i].y > canvas.height){ 
			snake[i].y = 0
		}
	}
}

function draw(){
	clearCanvas()
	//redrawing
	context.fillStyle="#FFFFFF";
	//drawing the snake
	for(var i = 0; i < snake.length; i++){
		context.fillRect(snake[i].x,snake[i].y,SNAKE_SIZE.width,SNAKE_SIZE.height)
	}
	//drawing food
	context.fillRect(food.x,food.y,SNAKE_SIZE.width,SNAKE_SIZE.height)
}

function start(){

	snake = []
	score = 0

	//start off the snake 4 long i guess
	for(var i = 0; i < 6; i++){
		incrementSnake()
	}

	spawnFood()

	gameLoop = setInterval(update, SLEEP_TIME) 
}

function spawnFood(){
	var foodT = { x: ((((canvas.width/SNAKE_SIZE.width)-4)*Math.random())+2) * SNAKE_SIZE.width, y: ((((canvas.height/SNAKE_SIZE.height)-4)*Math.random())+2) * SNAKE_SIZE.height, w: SNAKE_SIZE.width, h: SNAKE_SIZE.height }
	if(intersectingSnake(foodT, snake.length, 0)){
		incrementSnake()
		spawnFood()
	}else{
		food = foodT
	}
}

function intersectingSnake(args, length, start){
	var intersect = { x : args.x +args.w/2, y : args.y+args.h/2} 
	
	for(var i = start; i < length; i++){
		if(snake[i].x < intersect.x && snake[i].x + SNAKE_SIZE.width > intersect.x && snake[i].y < intersect.y && snake[i].y + SNAKE_SIZE.height > intersect.y){
			return true
		}
	}
	return false
}


function decreaseSnake(length){
	if(snake.length < 2){ return }
		snake.splice(snake.length-length,length)
}




function incrementSnake(){
	if(snake.length == 0){
		snake.push({x: spawnPoint.x, y: spawnPoint.y, direction: direction.north })
	}else{
		switch(snake[snake.length-1].direction){
			case direction.north:
			snake.push({x: snake[snake.length-1].x, y: snake[snake.length-1].y + SNAKE_SIZE.height, direction: direction.north})
			break
			case direction.east:
			snake.push({x: snake[snake.length-1].x - SNAKE_SIZE.width, y: snake[snake.length-1].y, direction: direction.east})
			break
			case direction.south:
			snake.push({x: snake[snake.length-1].x, y: snake[snake.length-1].y - SNAKE_SIZE.height, direction: direction.south})
			break
			case direction.west:
			snake.push({x: snake[snake.length-1].x + SNAKE_SIZE.width, y: snake[snake.length-1].y, direction: direction.west})
			break
			default:
			break
		}
	}
}

function clearCanvas(){
	//redrawing
	context.fillStyle="#000000";
	//coloring backgrounds
	context.fillRect(0,0,canvas.width,canvas.height)
}

function verbose(args){
	console.log(args)
}

start()

}