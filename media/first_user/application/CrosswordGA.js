"use strict";
var input_rows = document.getElementById("INPUT_ROWS");
var input_cols = document.getElementById("INPUT_COLS");
var input_population = document.getElementById("INPUT_POPULATION");
var input_chrom_num = document.getElementById("INPUT_CHROM_NUM");
var internal_variable_display = document.getElementById("INTERNAL_VARIABLE_DISPLAY");
var gaContainer = document.getElementById("GA_CONTAINER");
input_rows.addEventListener("input", rowsColsChangeEvent);
input_cols.addEventListener("input", rowsColsChangeEvent);
input_population.addEventListener("input", populationChangeEvent);
input_chrom_num.addEventListener("input", chromNumChangeEvent);
var right_panel = document.getElementById("RIGHT_PANEL");
var containerCrossword = document.getElementById("CROSSWORD_CONTAINER");
var charString = "QWERTYUIOPASDFGHJKLZXCVBNMETAOINSRHLDCETA";

var crossword = {
	rows : "",
	cols : "",
	container_element : "",
	cellClassName : "cell",
	cellDisplayElements : "",
	cellNumberClassName : "cell_number",
	cellNumber : "",
	cellTextClassName : "cell_text",
	cellInput : "",
	cellArray : [],
	wordItem : [],
	letters : "",
	words : [],
	totalWords : 0,
	totalFitness : 0,
	string : "",
	wordLengths : [],
	mapper : [],

	setRowsCols : function(rows, cols) {
		crossword.rows = parseInt(rows);
		crossword.cols = parseInt(cols);
		crossword.clearBlocks();
	},

	clearBlocks : function() {
		for (var i=0; i< crossword.rows; i++) {
			crossword.cellArray[i] = [];
			for (var j=0; j< crossword.cols; j++) {
				crossword.cellArray[i][j] = [i*crossword.cols + j+1, crossword.letters.charAt(i*crossword.cols + j) ,1,1,0,0];
			}
		}
	},

	putLetters : function(letters) {
		crossword.letters = letters;
		for (var i=0; i< crossword.rows; i++) {
			for (var j=0; j< crossword.cols; j++) {
				crossword.cellArray[i][j][1] = crossword.letters.charAt(i*crossword.cols + j);
			}
		}
		crossword.getWords();
	},

	toggleOccupy : function(e) {
		var id = parseInt(e.target.id);
		var numberOfLettersH = crossword.cellArray[Math.floor(id/crossword.cols)][id%crossword.cols][2];
		var numberOfLettersV = crossword.cellArray[Math.floor(id/crossword.cols)][id%crossword.cols][3];
		if (numberOfLettersH > 0) {
			crossword.cellArray[Math.floor(id/crossword.cols)][id%crossword.cols][2] = 0;
			crossword.cellArray[Math.floor(id/crossword.cols)][id%crossword.cols][3] = 0;
		}
		else {
			crossword.cellArray[Math.floor(id/crossword.cols)][id%crossword.cols][2] = 1;
			crossword.cellArray[Math.floor(id/crossword.cols)][id%crossword.cols][3] = 1;
		}
		crossword.cellArray[Math.floor(id/crossword.cols)][id%crossword.cols][4] = 0;
		crossword.cellArray[Math.floor(id/crossword.cols)][id%crossword.cols][5] = 0;
		crossword.getWordLengthH();
		crossword.getWordLengthV();
		crossword.getWords();
		crossword.putCellArrayNumbers();
	},

	getWordLengthH : function() {
		var currentBlock;
		var nextBlock;
		var previousBlock;
		for (var i=0; i<crossword.rows; i++) {
			for (var j=0; j<crossword.cols; j++) {
				currentBlock = crossword.cellArray[i][j][2];
				if (j<1) {
					previousBlock = 0;
				}
				else {
					previousBlock = crossword.cellArray[i][j-1][2];
				}
				if (j>=crossword.cols-1) {
					nextBlock = 0;
				}
				else {
					nextBlock = crossword.cellArray[i][j+1][2];
				}
				var wordLength = 1;
				if (previousBlock >= 0 && currentBlock > 0 && nextBlock ==0) {
					crossword.cellArray[i][j][2] = 1;	
				}
				if (previousBlock == 0 && currentBlock > 0 && nextBlock ==0) {
					crossword.cellArray[i][j][2] = 1;	
				}
				if (previousBlock >= 0 && currentBlock > 0 && nextBlock >=0) {
					crossword.cellArray[i][j][2] = 1;	
				}
				if (previousBlock == 0 && currentBlock > 0 && nextBlock !=0) {
					while (nextBlock != 0) {
					    if (j+wordLength > crossword.cols -1) {
					    	nextBlock = 0;
					    }
					    else {
					    	nextBlock = crossword.cellArray[i][j+wordLength][2];
					    }
						crossword.cellArray[i][j][2] = wordLength;
						wordLength = wordLength + 1;
					}	
				}
			}
		}
	},


	getWordLengthV : function() {
		var currentBlock;
		var nextBlock;
		var previousBlock;
		for (var i=0; i<crossword.rows; i++) {
			for (var j=0; j<crossword.cols; j++) {
				currentBlock = crossword.cellArray[i][j][3];
				if (i<1) {
					previousBlock = 0;
				}
				else {
					previousBlock = crossword.cellArray[i-1][j][3];
				}
				if (i>=crossword.rows-1) {
					nextBlock = 0;
				}
				else {
					nextBlock = crossword.cellArray[i+1][j][3];
				}
				var wordLength = 1;
				if (previousBlock >= 0 && currentBlock > 0 && nextBlock ==0) {
					crossword.cellArray[i][j][3] = 1;	
				}
				if (previousBlock == 0 && currentBlock > 0 && nextBlock ==0) {
					crossword.cellArray[i][j][3] = 1;	
				}
				if (previousBlock >= 0 && currentBlock > 0 && nextBlock >=0) {
					crossword.cellArray[i][j][3] = 1;	
				}
				if (previousBlock == 0 && currentBlock > 0 && nextBlock !=0) {
					while (nextBlock != 0) {
					    if (i+wordLength > crossword.rows -1) {
					    	nextBlock = 0;
					    }
					    else {
					    	nextBlock = crossword.cellArray[i+wordLength][j][3];
					    }
						crossword.cellArray[i][j][3] = wordLength;	
						wordLength = wordLength + 1;
					}	
				}
			}
		}
	},

	showCrosswordHTML : function() {
		if (crossword.rows < 21 && crossword.cols < 21){
			var inner_html;
			inner_html = "<table>";
			for (var i=0; i< crossword.rows; ++i) {
				inner_html += "<tr>";
				for (var j=0; j<crossword.cols; ++j) {
					inner_html += "<td class='" + crossword.cellClassName + "'></td>";
				}
				inner_html += "</tr>";
			}
			inner_html += "</table>";
			crossword.container_element.innerHTML = inner_html;
			crossword.cellDisplayElements = document.getElementsByClassName(crossword.cellClassName);
			for (var i = 0; i < crossword.rows*crossword.cols ; i++) {
				crossword.cellDisplayElements[i].innerHTML = crossword.cellInnerHTML(i+1);
				crossword.cellDisplayElements[i].addEventListener('click', cellClicked);
			}
			crossword.cellInput = document.getElementsByClassName(crossword.cellTextClassName);
			crossword.cellNumber = document.getElementsByClassName(crossword.cellNumberClassName);
		}
	},

	cellInnerHTML : function(number){
		var innerHTML;
		innerHTML = "<input id='" + (number-1) + "' class='cell_text' type='text'>" + "<div class='cell_number'></div>";
		return innerHTML;
	},

	updateTable : function(){
		var	number;		
		var letter;
		var hlength;
		var vlength;
		var variable3;
		var hitH;
		var hitV;
		for (var i=0; i<crossword.rows*crossword.cols; i++) {
			number = crossword.cellArray[Math.floor(i/crossword.cols)][(i%crossword.cols)][0];		
			letter = crossword.cellArray[Math.floor(i/crossword.cols)][(i%crossword.cols)][1];
			hlength = crossword.cellArray[Math.floor(i/crossword.cols)][(i%crossword.cols)][2];
			vlength = crossword.cellArray[Math.floor(i/crossword.cols)][(i%crossword.cols)][3];
			hitH = crossword.cellArray[Math.floor(i/crossword.cols)][(i%crossword.cols)][4];
			hitV = crossword.cellArray[Math.floor(i/crossword.cols)][(i%crossword.cols)][5];
			variable3 = crossword.words[i];
			crossword.cellNumber[i].innerHTML = number + "," + hitH + "," + hitV;
			if (hlength > 0 || vlength > 0) {
				crossword.cellInput[i].style.backgroundColor = 'white';
				crossword.cellInput[i].value = letter;
			}
			else {
				crossword.cellInput[i].style.backgroundColor = 'brown';
				crossword.cellInput[i].value = letter;
			}
			if (hlength == 1 && vlength == 1) {
				crossword.cellInput[i].style.backgroundColor = 'white';
				crossword.cellInput[i].value = letter;
			}
			if (hitH == 1) {
				crossword.cellInput[i].style.backgroundColor = 'lightgreen';
			}
			if (hitV == 1) {
				crossword.cellInput[i].style.backgroundColor = 'lightgreen';
			}
			if (hitH == 1 && hitV == 1) {
				crossword.cellInput[i].style.backgroundColor = 'yellow';
			}
		}
		var innerHTML = "<table class='table'>";
		innerHTML += "<tr><td></td><td>Word</td><td>Spelling</td><td>" + "digraph" + "</td><td>" + "trigraph" + "</td><td>" + crossword.totalFitness + "</td></tr>";
		for (var i=0; i< crossword.totalWords; i++) {
			innerHTML += "<tr><td>" + crossword.words[i][0] + "</td><td>" + crossword.words[i][1] + "</td><td>"  + crossword.words[i][2] + "</td><td>" + crossword.words[i][3] +  "</td><td>" + crossword.words[i][4] +  "</td><td>" + crossword.words[i][5] + "</td></tr>";
		}
		innerHTML += "</table>";
		internal_variable_display.innerHTML = innerHTML;
	},

	getWords : function() {
		var hwordCount = 0;
		var wwordCount = 0;
		for (var i=0; i< crossword.rows; i++) {
			for (var j=0; j<crossword.cols; j++) {
				if (crossword.cellArray[i][j][2] > 1) {
					for (var k=0; k< crossword.cellArray[i][j][2]; k++) {
						crossword.mapper[hwordCount] = [];
					}
					for (var k=0; k< crossword.cellArray[i][j][2]; k++) {
						crossword.mapper[hwordCount][k] = i*crossword.cols + j + k;
					}
					hwordCount = hwordCount + 1;
					crossword.wordLengths[hwordCount-1] = crossword.cellArray[i][j][2];
					crossword.cellArray[i][j][0] = hwordCount;
					crossword.wordItem[hwordCount-1] = hwordCount;
				}
			}
		}
		for (var i=0; i< crossword.rows; i++) {
			for (var j=0; j<crossword.cols; j++) {
				if (crossword.cellArray[i][j][3] > 1) {
					for (var k=0; k< crossword.cellArray[i][j][3]; k++) {
						crossword.mapper[wwordCount + hwordCount] = []; 
					}
					for (var k=0; k< crossword.cellArray[i][j][3]; k++) {
						crossword.mapper[wwordCount + hwordCount][k] = i*crossword.cols + j + (k*crossword.cols);
					}
					wwordCount = wwordCount + 1;
					crossword.wordLengths[wwordCount + hwordCount -1] = crossword.cellArray[i][j][3];
					crossword.cellArray[i][j][0] = wwordCount + hwordCount;
					crossword.wordItem[wwordCount + hwordCount-1] = wwordCount + hwordCount;
				}
			}
		}
		crossword.totalWords = hwordCount + wwordCount;
		for (var i = 0 ; i< crossword.totalWords; i++) {
			crossword.words[i] = [];
		}
		crossword.formWords();
	},

	formWords : function(){
		crossword.totalFitness = 0;
		for (var i = 0; i<crossword.totalWords;  i++) {
			var spellingFitness;
			var digraphFitness;
			var trigraphFitness;
			var total;

			var word = "";
			for (var j = 0; j<crossword.wordLengths[i]; j++) {
				word += crossword.letters.charAt(crossword.mapper[i][j]);
			}
			spellingFitness = crossword.fitnessSpelling(word);
			digraphFitness = crossword.fitnessDigraph(word);
			trigraphFitness = crossword.fitnessTrigraph(word);
			total = spellingFitness + digraphFitness + trigraphFitness;
			crossword.words[i] = [crossword.wordItem[i], word, spellingFitness, digraphFitness, trigraphFitness, total]; 
			crossword.totalFitness += crossword.words[i][5];
		}
	},

	putCellArrayNumbers : function(){
		var numberOfLettersH;
		var numberOfLettersV;
		var num = 1;
		for (var i=0; i< crossword.rows ; i++) {
			for (var j=0; j<crossword.cols; j++) {
				numberOfLettersH = crossword.cellArray[i][j][2];
				numberOfLettersV = crossword.cellArray[i][j][3];
				if (numberOfLettersH > 1 || numberOfLettersV > 1) {
					crossword.cellArray[i][j][0] = num;
					num = num + 1;
				}
				else {
					crossword.cellArray[i][j][0] = "";
				}
			}
		}
	},

	fitnessDigraph : function(word){
		var fitness = 0;
		var hit = 0;
		for (var i=0; i<digraph.length; i++){
			if (word.search(digraph[i].toUpperCase()) < 0) {
				hit = 0;
			}
			else {
				hit = digraph.length - i;
			}
			fitness += hit;
		}
		return fitness;
	},

	fitnessTrigraph : function(word){
		var fitness = 0;
		var hit = 0;
		for (var i=0; i<trigraph.length; i++){
			if (word.search(trigraph[i].toUpperCase()) < 0) {
				hit = 0;
			}
			else {
				hit = trigraph.length - i;
			}
			fitness += hit;
		}
		return fitness;
	},

	fitnessSpelling : function(word) {
		var fitness = 0;
		var hit = 0;
		var startSearchAt = 0;
		var endSearchAt = dictionary.length;
		for (var j = 0; j< 26; j++) {
			if (word.charAt(0) == bookMarker.letters.charAt(j) && j<25) {
				startSearchAt = bookMarker.letterIndexes[j];
				endSearchAt = bookMarker.letterIndexes[j+1];
			}
			if (word.charAt(0) == bookMarker.letters.charAt(j) && j == 25) {
				startSearchAt = bookMarker.letterIndexes[j];
				endSearchAt = dictionary.length;
			}
		}
		for (var i=startSearchAt; i<endSearchAt; i++){
			if (word == dictionary[i].toUpperCase()) {
				hit = word.length;
				return hit;
			}
			else {
				hit = 0;
			}
		}
		return hit;
	},
};

var bookMarker = {
	letters : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	letterIndexes : [],

	getIndexes : function() {
		for (var i=0; i<26; i++) {
			for (var j=0; j<dictionary.length; j++) {
				if (dictionary[j].charAt(0).toUpperCase() == bookMarker.letters.charAt(i)) {
					bookMarker.letterIndexes[i] = j;
					break;
				}
			}
		}
	}
}


var geneticAlgorithm = {
	population : 10,
	chromosomes : [],
	crossoverRate : 10, 
	mutationRate : 10,
	maxGeneration : 100,
	displayContainer : "",

	createPopulation : function(number) {
		var num = parseInt(number);
		geneticAlgorithm.population = num;
		for (var i=0; i<num; i++) {
			geneticAlgorithm.chromosomes[i] = [createChromosome(parseInt(input_rows.value)*parseInt(input_cols.value)),0];
		}
	},

	getToTalFitness : function() {
		for (var i=0; i<geneticAlgorithm.population; i++) {
			crossword.putLetters(geneticAlgorithm.chromosomes[i][0]);
			geneticAlgorithm.chromosomes[i] = [geneticAlgorithm.chromosomes[i][0], crossword.totalFitness];
		}
	},

	show : function() {
		var innerHTML = "";
		innerHTML += "<table>";
		for (var i =0; i<geneticAlgorithm.population; i++) {
			innerHTML += "<tr><td>" + geneticAlgorithm.chromosomes[i][0] + "</td><td>" + geneticAlgorithm.chromosomes[i][1]  + "</td></tr>";
		}
		innerHTML += "</table>";
		geneticAlgorithm.displayContainer.innerHTML = innerHTML;
	}
};

function rowsColsChangeEvent() {
	var rows = parseInt(input_rows.value);
	var cols = parseInt(input_cols.value);
	crossword.setRowsCols(rows, cols);
	crossword.showCrosswordHTML();
	crossword.updateTable();
}

function populationChangeEvent() {
	initGeneticAlgorithm();
	crossword.putLetters(geneticAlgorithm.chromosomes[0][0]);
	crossword.showCrosswordHTML();
	crossword.updateTable();
	input_chrom_num.value = 0;
	geneticAlgorithm.displayContainer = gaContainer;
	geneticAlgorithm.getToTalFitness();
	geneticAlgorithm.show();
}	

function chromNumChangeEvent() {
	var index = parseInt(input_chrom_num.value);
	if (index > geneticAlgorithm.population-1) {
		index = geneticAlgorithm.population-1;
		input_chrom_num.value = index;
	}
	crossword.putLetters(geneticAlgorithm.chromosomes[index][0]);
	crossword.formWords();
	crossword.updateTable();
}

	//crossword1  = new Crossword(5,8);
	//var containerElement = document.getElementById("CROSSWORD_CONTAINER");
	//crossword1.container_element = containerElement;
	//crossword1.letters = createChromosome(crossword1.rows*crossword1.cols);
	//crossword1.clearBlocks();
	//crossword1.showCrosswordHTML();
	//crossword1.updateTable();


function placeToCrossword() {
	crossword.letters = geneticAlgorithm.chromosomes[0][0]
}

function cellClicked(e) {
	crossword.toggleOccupy(e);
	crossword.putLetters(geneticAlgorithm.chromosomes[0][0]);
	crossword.showCrosswordHTML();
	crossword.updateTable();
	geneticAlgorithm.getToTalFitness();
	geneticAlgorithm.show();
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


function createChromosome(length){
	var chromosome = ""
	for (var i=0; i<length; i++) {
		chromosome += charString.charAt(getRndInteger(0,40));
	}
	return chromosome;
}


function initCrossword(){
	crossword.setRowsCols(input_rows.value, input_cols.value);
	crossword.clearBlocks();
	crossword.putCellArrayNumbers();
	crossword.container_element = containerCrossword;
	crossword.cellClassName = "cell";
	crossword.cellNumberClassName = "cell_number";
	crossword.cellTextClassName = "cell_text";
	crossword.getWordLengthH();
	crossword.getWordLengthV();
	crossword.getWords();
	crossword.putCellArrayNumbers();
}

function initGeneticAlgorithm(){
	geneticAlgorithm.createPopulation(input_population.value)
	geneticAlgorithm.displayContainer = gaContainer;
}

window.onload = function () {
	initCrossword();
	initGeneticAlgorithm();
	bookMarker.getIndexes();
	crossword.putLetters(geneticAlgorithm.chromosomes[0][0]);
	crossword.showCrosswordHTML();
	crossword.updateTable();
}


