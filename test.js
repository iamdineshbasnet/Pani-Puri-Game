
const board = document.querySelector('#board');
const numberOfRows = 7;
const numberOfColumns = 7;
const imageList = ['TypeA', 'TypeB', 'TypeC', 'TypeD', 'TypeE', 'TypeF'];

initGame();

function generateRandomNumber() {
	const number = Math.floor(Math.random() * imageList.length);
	return number;
}

function initGame() {
	for (let i = 0; i < numberOfRows; i++) {
		for (let j = 0; j < numberOfColumns; j++) {
			const cell = document.createElement('div');
			const imageTag = document.createElement('img');
			imageTag.src = `./assets/${imageList[generateRandomNumber()]}.png`;
			imageTag.setAttribute('height', 45);
			imageTag.setAttribute('width', 45);
			cell.classList.add('cell');
			cell.append(imageTag);
			cell.setAttribute('data-cellIndex', `${i}${j}`);
			board.append(cell);
		}
	}
}

function formatNumber(num) {
	return num.toString().padStart(2, '0');
}

let element;
const cellEl = document.querySelectorAll('.cell');
cellEl?.forEach((cell) => {
	cell.addEventListener('click', (event) => {
        event.target.remove()
		// if (event.target.tagName.toLowerCase() === 'img') {
		// 	let cellIndex =
		// 		event.target.parentNode.getAttribute('data-cellIndex');
		// 	remove(cellIndex, event.target);
		// }
	});
});


// function remove(cellIndex, element) {
// 	if (cellIndex < 10) {
// 		removeImage(element);
// 	} else {
// 		replaceImage(element, cellIndex);
// 	}
// }
// function removeImage(imgElement) {
// 	imgElement.src = `./assets/${imageList[generateRandomNumber()]}.png`;
// }
// function replaceImage(element, cellIndex) {
// 	const newCellIndex = decreaseCellIndex(cellIndex);
// 	console.log(newCellIndex, 'newcellindex');
// 	const newElement = document.querySelector(
// 		`[data-cellIndex="${formatNumber(newCellIndex)}"]`
// 	);
// 	console.log(newElement, 'newElement');
// 	element.src = newElement.children[0].src;
// }

// function decreaseCellIndex(cellIndex) {
// 	cellIndex = cellIndex < 10 ? cellIndex : cellIndex - 10;
// 	return cellIndex;
// }



initGame();

// initialize game
function initGame() {
	fillCell();
}

// fill the checkbox with panipuri :)
function fillCell() {
	for (let i = 0; i < numberOfRows; i++) {
		for (let j = 0; j < numberOfColumns; j++) {
			const cell = document.createElement('div');
			const imageTag = document.createElement('img');
			imageTag.src = `./assets/${imageList[generateRandomNumber()]}.png`;
			imageTag.setAttribute('height', 45);
			imageTag.setAttribute('width', 45);
			cell.classList.add('cell');
			cell.append(imageTag);
			cell.setAttribute('data-cellIndex', `${i}${j}`);
			board.append(cell);
		}
	}
}

cellEl?.forEach((cell) => {
	// when click on particular cell image
    if(cell.hasChildNodes){
        cell.children[0].addEventListener('click', remove);
    }
});

// function to remove image when click
function remove(event) {
    const parent = event.target.parentNode
	moveImage(parent);
    
}

// function to move image from upper cell
function moveImage(targetElement) {
	for (let i = 0; i < numberOfRows; i++) {
		for (let j = 0; j < numberOfColumns; j++) {
			const element = getElementByDataAttribute(`${i}${j}`);
            
			const hasImage = checkEmptyCell(element);
            if(!hasImage){
                const getCellIndex = targetElement.getAttribute('data-cellIndex')
                console.log(getCellIndex, 'cell index')
                if(getCellIndex < 10){
                    generateNewImage(targetElement)
                }else{
                    getImageFromUpperIndex(targetElement)
                }
            }
		}
	}
}

// get image from upper index
function getImageFromUpperIndex(element){
    const cellIndex = element.getAttribute('data-cellIndex')
    console.log(cellIndex)
    const newCellIndex = decreaseNumberBy10(cellIndex)
    console.log(newCellIndex)
    const newElement = getElementByDataAttribute(newCellIndex)
}
// decrease number by 10
function decreaseNumberBy10(cellIndex){
    return cellIndex < 10 ? cellIndex : cellIndex - 10

}
// generate new image for the first row
function generateNewImage(element){
    let imageTag = document.createElement('img')
    imageTag.src = `./assets/${imageList[generateRandomNumber()]}.png`
    element.append(imageTag)
}

// check the empty cell
function checkEmptyCell(element) {
    console.log('check')
	return element.hasChildNodes();
}

// if number is between 0 and 9 add 0 at the beginning of number eg: 07
function formatNumber(num) {
	return num.toString().padStart(2, '0');
}

// generate random number
function generateRandomNumber() {
	const number = Math.floor(Math.random() * imageList.length);
	return number;
}

function getElementByDataAttribute(cellIndex) {
	const element = document.querySelector(`[data-cellIndex="${cellIndex}"]`);
	return element;
}
