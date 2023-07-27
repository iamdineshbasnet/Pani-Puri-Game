const boardElement = document.querySelector('#board');
const scoreElement = document.querySelector('#score span');
const missionElement = document.querySelector('#mission');
const progressPercentageElement = document.querySelector(
	'.progress-wrapper .progress-percentage'
);
const iconElement = document.querySelectorAll('.progress .icon');
const progressTextElement = document.querySelector('.progress-text');
const gameOverScreen = document.querySelector("#game-over-screen") 
const playAgainButton = gameOverScreen.querySelector('.play-again')
const gameOverText = gameOverScreen.querySelector(".final-score")

const successAudio = new Audio('./assets/crack.mp3');
const failAudio = new Audio('./assets/wrong.mp3')
const gameOverAudio = new Audio('./assets/gameover.wav')

const defaultRows = 7;
const defaultColumns = 7;
const puriOptions = ['TypeA', 'TypeB', 'TypeC', 'TypeD', 'TypeE', 'TypeF'];
let board = [];
let score = 0;
let puriCrushed = 0;
let goal;
let increasedScoreBy = 3;
let decreasedScoreBy = 3;
let progressPercentage = 68;
let missionOptions = {};
let previousMissionOptions = {};
let isMultiple10 = false;
let multiplyScoreBy = 10;
let isMistake = false;

window.addEventListener('load', () => {
	initGame();
	createMission();
});

// Function to reset game
function resetGame() {
	score = 0;
	puriCrushed = 0;
	progressPercentage = 68;
	scoreElement.innerText = score;
	progressPercentageElement.style.width = `${progressPercentage}%`;
	progressPercentageElement.style.transition = `all .5s`;
}
// play game again
playAgainButton.addEventListener('click', playAgain)

// function to play game again
function playAgain(){
	gameOverScreen.classList.remove('gameOver')
	resetGame()
}
// function to show x10
function showMultiple10() {
	progressTextElement.classList.add('show');
	isMultiple10 = true;

	if (isMistake) {
		progressTextElement.classList.remove('show');
		progressPercentage = 68;
		isMultiple10 = false;
		progressPercentageElement.style.width = `${progressPercentage}%`;
		progressPercentageElement.style.transition = `all .5s`;
	} else {
		setTimeout(() => {
			progressTextElement.classList.remove('show');
			progressPercentage = 68;
			isMultiple10 = false;
			progressPercentageElement.style.width = `${progressPercentage}%`;
			progressPercentageElement.style.transition = `all .5s`;
		}, 10000);
	}
}

// Function to start the game
function initGame() {
	for (let row = 0; row < defaultRows; row++) {
		let rowList = [];
		for (let col = 0; col < defaultColumns; col++) {
			let cell = document.createElement('img');
			cell.id = row.toString() + '-' + col.toString();
			cell.src = `./assets/${puriOptions[generateRandomPuri()]}.svg`;
			boardElement.append(cell);
			rowList.push(cell);
			// Click functionality
			cell.addEventListener('click', crushPuri);
		}
		board.push(rowList);
		progressPercentageElement.style.width = `${progressPercentage}%`;
		progressPercentageElement.style.transition = `all .5s`;
	}
}

// Function to generate random puries
function generateRandomPuri() {
	return Math.floor(Math.random() * puriOptions.length);
}

// Function to recursively crush adjacent puries of the same type
function crushAdjacentPuri(row, column, src) {
	if (
		row < 0 ||
		row >= defaultRows ||
		column < 0 ||
		column >= defaultColumns
	) {
		return;
	}

	const cell = board[row][column];

	// Different puri type
	if (cell.src !== src) {
		return;
	}

	// Already crushed
	if (cell.src.includes('blank')) {
		return;
	}

	// Crush the current cell
	cell.src = './assets/blank.png';
	puriCrushed++;

	// Recursively check adjacent cells in all directions
	crushAdjacentPuri(row, column - 1, src); // Left
	crushAdjacentPuri(row, column + 1, src); // Right
	crushAdjacentPuri(row - 1, column, src); // Upper
	crushAdjacentPuri(row + 1, column, src); // Lower
}

// Function to crush puries
function crushPuri() {
	currentCell = this;
	let currentCoordinates = currentCell.id.split('-'); // id="0-5" => ["0", "5"]
	let row = parseInt(currentCoordinates[0]);
	let column = parseInt(currentCoordinates[1]);
	let src = currentCell.src;

	if (currentCell.src.includes('blank')) {
		slidePuri();
		generateNewPuri(column);
		return;
	}

	puriCrushed = 0; // Reset the number of crushed puris before each crush

	crushAdjacentPuri(row, column, src);
	slidePuri();
	generateNewPuri(column);

	// Check if the mission type matches the current puri type and the goal is reached
	if (
		src.includes(missionOptions.type[0]) &&
		puriCrushed === missionOptions.goal
	) {
		if (isMultiple10) {
			score += multiplyScoreBy * puriCrushed;
		} else {
			score += increasedScoreBy * puriCrushed;
		}
		successAudio.play();
		progressPercentage += increasedScoreBy * puriCrushed;
		isMistake = false;
	} else {
		isMistake = true;
		if (!isMultiple10) {
			progressPercentage -= decreasedScoreBy * puriCrushed;
		}
		failAudio.play()
		// Show the cross icon at the clicked puri place for 5 seconds
		const crossIcon = document.createElement('div');
		crossIcon.innerHTML = '<img src="./assets/cross.svg" alt="">';
		crossIcon.className = 'cross-icon';
		currentCell.appendChild(crossIcon);
		setTimeout(() => {
			crossIcon.remove();
		}, 5000);
	}

	createMission();
	missionElement.classList.add('active');

	scoreElement.innerText = score;
	progressPercentageElement.style.width = `${progressPercentage}%`;
	progressPercentageElement.style.transition = `all .5s`;
	if (progressPercentage < 0) {
		gameOverAudio.play()
		gameOverScreen.classList.add('gameOver')
		gameOverText.innerText = score
		missionElement.innerHTML = ""
	} else if (progressPercentage > 100) {
		showMultiple10();
	}
}

// Function to slide puri in a column
function slidePuri() {
	for (let col = 0; col < defaultColumns; col++) {
		let emptyCells = 0;
		let index = defaultRows - 1;

		for (let row = defaultRows - 1; row >= 0; row--) {
			if (!board[row][col].src.includes('blank')) {
				board[index][col].src = board[row][col].src;
				index -= 1;
			} else {
				emptyCells++;
			}
		}

		for (let row = index; row >= 0; row--) {
			board[row][col].src = './assets/blank.png';
		}

		// Generate new puri for columns with empty cells
		if (emptyCells > 0) {
			generateNewPuri(col, emptyCells);
		}
	}
}

// Function to generate new puri for a column
function generateNewPuri(column, emptyCells) {
	for (let row = 0; row < emptyCells; row++) {
		const cell = board[row][column];
		if (cell.src.includes('blank')) {
			cell.src = `./assets/${puriOptions[generateRandomPuri()]}.svg`;
		}
	}
}

// Function to create a new mission
function createMission() {
	// Clear previous mission
	missionElement.innerHTML = '';

	let randomRow = Math.floor(Math.random() * defaultRows);
	let randomColumn = Math.floor(Math.random() * defaultColumns);
	let puriSrc = board[randomRow][randomColumn].src;

	const allPossibleMissions = getAllPossibleMissions(
		randomRow,
		randomColumn,
		puriSrc
	);

	let missionType = document.createElement('img');
	let missionText = document.createElement('span');

	if (allPossibleMissions.length > 0) {
		// Extract the type and goal from the found missions
		const missionTypes = allPossibleMissions.map(
			(cell) => cell.src.split('/').pop().split('.')[0]
		);
		const missionGoal = allPossibleMissions.length;

		// Check if the new mission is different from the previous one
		if (
			missionTypes[0] === previousMissionOptions.type &&
			missionGoal === previousMissionOptions.goal
		) {
			// Generate a new mission if it is the same as the previous one
			return createMission();
		}

		// Assign the mission options
		missionOptions.type = missionTypes;
		missionOptions.goal = missionGoal;

		// Set the src attribute of missionType element using the first element from missionTypes array
		missionType.src = `./assets/${missionOptions.type[0]}.svg`;
		missionText.innerText = missionOptions.goal;

		// Store the current mission options as the previous ones
		previousMissionOptions.type = missionTypes[0];
		previousMissionOptions.goal = missionGoal;
	} else {
		// If no missions found, set default mission options
		missionOptions.type = ['TypeA'];
		missionOptions.goal = 1;
		// Set the src attribute of missionType element using the default mission type
		missionType.src = `./assets/${missionOptions.type[0]}.svg`;
		missionText.innerText = missionOptions.goal;
	}

	setTimeout(() => {
		missionElement.append(missionText);
		missionElement.append(missionType);
		missionElement.classList.remove('active');
	}, 300);
}

// Function to get all possible missions
function getAllPossibleMissions(row, column, src) {
	const missions = [];

	// Helper function to recursively find adjacent puris of the same type
	function findAdjacentPuris(r, c, s, visited) {
		if (
			r < 0 ||
			r >= defaultRows ||
			c < 0 ||
			c >= defaultColumns ||
			visited[r][c] ||
			board[r][c].src !== s
		) {
			return;
		}

		visited[r][c] = true;
		missions.push(board[r][c]);

		findAdjacentPuris(r, c - 1, s, visited); // Left
		findAdjacentPuris(r, c + 1, s, visited); // Right
		findAdjacentPuris(r - 1, c, s, visited); // Upper
		findAdjacentPuris(r + 1, c, s, visited); // Lower
	}

	// Initialize the visited array
	const visited = Array.from(Array(defaultRows), () =>
		Array(defaultColumns).fill(false)
	);

	// Start finding missions from the random row and column
	findAdjacentPuris(row, column, src, visited);

	return missions;
}
