state = {
	cards: {
		currentCard1: '',
		currentCard2: '',
		currentVal1: '',
		currentVal2: '',
		id: '',
		drawn1: [],
		drawn2: [],
		pile1: '',
		pile2: '',
		wagerCards: ""
	},
	urls: {
		shuffle: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
		draw: '',
		drawIt1: '',
		drawIt2: '',
		discardIt1: '',
		discardIt2: '',
		pile1: '',
		pile2: '',
		attack1: '',
		attack2: '',
		discard1: '',
		discard2: ''
	},
	images: {
		cardBack: 'image/card back red.png'
	}
}

// API GET
function getDataFromApi(url, callback){
	$.getJSON(url, callback).fail(function(d) { 
		console.log("error"); 
	});
}

// The Event Listener will be used to control when animations happen,
// as well as helping to control div transitions.
var observer = {

    listeners:{},

    addEventListener:function(event, listener){
        this.listeners[event] = this.listeners[event]|| [];
        this.listeners[event].push(listener);
    },
    removeListener: function(event, listener){
        if(this.listeners[event]){
            this.listeners[event].filter(function(aListener){
                aListener !== listener;
            });
        }
    },
    onEvent: function(event, data){
        this.listeners[event].forEach(function(listener){
            listener(event, data);
        });
    }
}

// I needed numerical values for the face-cards.
function cardValue(card){
	if (card === "JACK"){
		return 11;
	} else if (card === "QUEEN"){
		return 12;
	} else if (card === "KING"){
		return 13;
	} else if (card === "ACE"){
		return 14;
	} else {
		return parseInt(card);
	}
}

// When a pile gets empty, this will swap which pile a player draws
// from, so that they aren't drawing from an empty pile.
// 3) test game

// Need to change player and ai discard to class cardContainer1 & cardContainer2
function swapPiles(data){
	if (data.piles.pile_1.remaining === 0) {
		state.urls.drawIt1 = "discard_1";
		state.urls.discardIt1 = "pile_1";
		$('.playerDiscard').animate({left: "43%", top: "75%"}, "fast", function(){
			$('.playerDiscard').addClass('cardContainer1');
			$('.playerDiscard').removeClass('playerDiscard');
			$('.cardContainer1 > .card').removeClass('flipped1');
			$('.cardContainer1 > .cardFront').removeClass('flipped2');
			$('.cardContainer1').css('z-index', 200-parseInt($('.cardContainer1').css('z-index')));
		})
	} if (data.piles.pile_2.remaining === 0){
		state.urls.drawIt2 = "discard_2";
		state.urls.discardIt2 = "pile_2";
		$('.aiDiscard').animate({left: "43%", top: "5%"}, "fast", function(){
			$('.aiDiscard').addClass('cardContainer2');
			$('.aiDiscard').removeClass('aiDiscard');
			$('.cardContainer2 > .card').removeClass('flipped1');
			$('.cardContainer2 > .cardFront').removeClass('flipped2');
			$('.cardContainer2').css('z-index', 200-parseInt($('.cardContainer2').css('z-index')));
		})
	} if (data.piles.discard_1 && data.piles.discard_1.remaining === 0){
		state.urls.drawIt1 = "pile_1";
		state.urls.discardIt1 = "discard_1";
		$('.playerDiscard').animate({left: "43%", top: "75%"}, "fast", function(){
			$('.playerDiscard').addClass('cardContainer1');
			$('.playerDiscard').removeClass('playerDiscard');
			$('.cardContainer1 > .card').removeClass('flipped1');
			$('.cardContainer1 > .cardFront').removeClass('flipped2');
			$('.cardContainer1').css('z-index', 200-parseInt($('.cardContainer1').css('z-index')));
		})
	} if (data.piles.discard_2 && data.piles.discard_2.remaining === 0){
		state.urls.drawIt2 = "pile_2";
		state.urls.discardIt2 = "discard_2";
		$('.aiDiscard').animate({left: "43%", top: "5%"}, "fast", function(){
			$('.aiDiscard').addClass('cardContainer2');
			$('.aiDiscard').removeClass('aiDiscard');
			$('.cardContainer2 > .card').removeClass('flipped1');
			$('.cardContainer2 > .cardFront').removeClass('flipped2');
			$('.cardContainer2').css('z-index', 200-parseInt($('.cardContainer2').css('z-index')));
		})
	}

// The urls are generated using variables from the state.  This
// uses the API to draw piles, and ensures that the correct pile 
// is being drawn from at all times.
	state.urls.attack1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
	state.urls.attack2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
	state.urls.discard1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt1 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
	state.urls.discard2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt2 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
	state.urls.war1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
	state.urls.war2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
}

// This empties all state variables that accumulate card codes for
// the API urls.
function warDiscard1(data){
	swapPiles(data);
	$('.played').delay(1000).animate({left: "10%", top: "75%"}, "fast", function(){
		$('.played').css('z-index', 200-parseInt($('.played').css('z-index')));
		$('.game').append($('.played'));
		$('.played').addClass('playerDiscard');
		$('.played').removeClass('played');
		$('.attack').prop('disabled', false);
	});
	state.cards.drawn1 = [];
	state.cards.drawn2 = [];
	state.cards.currentCard1 = "";
	state.cards.currentCard2 = "";
	state.cards.wagerCards = "";
	console.log(data);
}

function warDiscard2(data){
	swapPiles(data);
	$('.played').delay(1000).animate({left: "10%", top: "5%"}, "fast", function(){
		$('.played').css('z-index', 200-parseInt($('.played').css('z-index')));
		$('.game').append($('.played'));
		$('.played').addClass('aiDiscard');
		$('.played').removeClass('played');
		$('.attack').prop('disabled', false);
	});
	state.cards.drawn1 = [];
	state.cards.drawn2 = [];
	state.cards.currentCard1 = "";
	state.cards.currentCard2 = "";
	state.cards.wagerCards = "";
}

// This generates words telling you whether you've won or lost.
function endGame(data){
	if (data.piles.discard_1 && data.piles.pile_1.remaining === 0 && data.piles.discard_1.remaining === 0){
		$('.youLose').removeClass('hidden');
		$('.startOver').removeClass('hidden');
		$('.attack').addClass('hidden');
	} if (data.piles.discard_2 && data.piles.pile_2.remaining === 0 && data.piles.discard_2.remaining === 0){
		$('.youWin').removeClass('hidden');
		$('.startOver').removeClass('hidden');
		$('.attack').addClass('hidden');
	}
}

function maxPlayed (){
	var played = $('.played');
	var currentMax = parseInt(played.css('z-index'));
	played.each(function(i, e){
		var zIndex = parseInt($(this).css('z-index'));
		if (zIndex > currentMax) {
			currentMax = zIndex;
		} 
	})
	return currentMax + 1;
}

function playerScoring (data){
	if (!data.piles.discard_1){
		$('.playerScore').html((parseInt(data.piles.pile_1.remaining)));
		$('.aiScore').html((parseInt(data.piles.pile_2.remaining) + parseInt(data.piles.discard_2.remaining)));
	} else if (!data.piles.discard_2) {
		$('.playerScore').html((parseInt(data.piles.pile_1.remaining) + parseInt(data.piles.discard_1.remaining)));
		$('.aiScore').html((parseInt(data.piles.pile_2.remaining)));
	} else {
		$('.playerScore').html((parseInt(data.piles.pile_1.remaining) + parseInt(data.piles.discard_1.remaining)));
		$('.aiScore').html((parseInt(data.piles.pile_2.remaining) + parseInt(data.piles.discard_2.remaining)));
	}
}

$(document).ready(function(){

	$("form").submit(function(){
        return;
    });

	$('.shuffle').click(function(e){
		$('.shuffle').css({
			'border-radius': '50%', 
			'box-shadow': '1px 1px 1px black', 
			'height': '0', 
			'width': '0',
			'padding': '0',
			'font-size': '0',
			'background-color': 'red',
			'top': '50%',
			'left': '50%'});
		$('.background').css({
			'transform': 'scale(3)'
		})

// API shuffles the cards. Deck ID is stored in the state and 
// used for future callbacks. Each player draws half the deck and 
// the draw and discard variables are initially declared.
		getDataFromApi(state.urls.shuffle, function(data){
			state.cards.id = data.deck_id;
			state.urls.draw = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/draw/?count=26';
		drawToPile1();
		drawToPile2();
		// $('.shuffle').addClass('hidden');
		$('.attack').removeClass('hidden');
		state.urls.drawIt1 = "pile_1";
		state.urls.drawIt2 = "pile_2";
		state.urls.discardIt1 = "discard_1";
		state.urls.discardIt2 = "discard_2";
		});

// Uses the API to draw 26 cards (have the deck). In
// order to specify which cards go into each player's pile, it's 
// necessary to grab the code of each card, to tell the 
		function drawToPile1(){
			getDataFromApi(state.urls.draw, function(data){
				console.log(data);
				var codeString = data.cards.map(function(card){
					return card.code;
				}).join();
				data.cards.forEach(function(item, index){
					$('.game').append('<div class="cardContainer1" style="z-index:' + (index + 100) + '"><img class="card" src="image/card back red.png" style="margin-left:' +
						((index / 2) - 30) + 'px; margin-bottom:' + (index / 2) + 'px">' + 
						'<img class="cardFront" src="' + data.cards[index].image + '" style="margin-left:' + ((index / 2) - 30) +
						'px; margin-bottom:' + (index / 2) + 'px"></div>');
				})
				state.urls.pile1 = 'https://deckofcardsapi.com/api/deck/' + 
				state.cards.id + '/pile/pile_1/add/?cards=' + codeString;
				getDataFromApi(state.urls.pile1, function(data){
					state.cards.pile1 = data.piles.pile_1;
					$('.playerScore').html("" + data.piles.pile_1.remaining + "");
				})
			})
		};
		function drawToPile2(){
			getDataFromApi(state.urls.draw, function(data){
				var codeString = data.cards.map(function(card){
					return card.code;
				}).join();
				data.cards.forEach(function(item, index){
					$('.game').append('<div class="cardContainer2" style="z-index:' + (index + 100) + '"><img class="card" src="image/card back red.png" style="margin-left:' +
						((index / 2) - 30) + 'px; margin-bottom:' + (index / 2) + 'px">' + 
						'<img class="cardFront" src="' + data.cards[index].image + '" style="margin-left:' + ((index / 2) - 30) +
						'px; margin-bottom:' + (index / 2) + 'px"></div>');
				});
				state.urls.pile2 = 'https://deckofcardsapi.com/api/deck/' + 
				state.cards.id + '/pile/pile_2/add/?cards=' + codeString;
				getDataFromApi(state.urls.pile2, function(data){
					state.cards.pile2 = data.piles.pile_2;
					$('.aiScore').html("" + data.piles.pile_1.remaining + "");
				})
			});
		}
	});

	function attackPlayer1Done(event){
		getDataFromApi(state.urls.attack2, function(data){
			state.cards.currentVal2 = cardValue(data.cards[0].value);
			state.cards.currentCard2 = data.cards[0].code;
			var cardImage = data.cards[0].image;
			var cardDraw1 = $('.game > .cardContainer2:last');
			var cardFlipped1 = $('.game > .cardContainer2:last > .card');
			var cardFlipped2 = $('.game > .cardContainer2:last > .cardFront');
			cardFlipped2.attr("src", cardImage);
			cardDraw1.animate({top: "30%", left: "43%"}, "fast", function (){
				cardFlipped1.addClass('flipped1');
				cardFlipped2.addClass('flipped2');
				setTimeout(function () {
					  new Audio('audio/cardFlip.wav').play();
					}, 150);
				cardDraw1.addClass('played');
				cardDraw1.removeClass('cardContainer2');
				cardDraw1.css('z-index', maxPlayed());
				swapPiles(data);
				observer.onEvent("attackPlayer2Done", data);
			});
		});
	}

	function attackPlayer2Done(event, data){
		state.urls.discard1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt1 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
		state.urls.discard2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt2 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
		state.urls.war1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
		state.urls.war2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
		if (state.cards.currentVal1 > state.cards.currentVal2){
			getDataFromApi(state.urls.discard1, function(data){
				swapPiles(data);
				endGame(data);
				playerScoring(data);
				$('.played').delay(1000).animate({left: "10%", top: "75%"}, "fast", function(){
					$('.played').css('z-index', (parseInt($('.playerDiscard:last').css('z-index')) + 1));
					$('.game').append($('.played'));
					$('.played').addClass('playerDiscard');
					$('.played').removeClass('played');
					$('.attack').prop('disabled', false);

				});
				state.cards.wagerCards = "";
				console.log("you won it");
				console.log(data);
			})
		} else if (state.cards.currentVal1 < state.cards.currentVal2) {
			getDataFromApi(state.urls.discard2, function(data){
				swapPiles(data);
				endGame(data);
				playerScoring(data);
				$('.played').delay(1000).animate({left: "10%", top: "5%"}, "fast", function(){
					$('.played').css('z-index', (parseInt($('.aiDiscard:last').css('z-index')) + 1));
					$('.game').append($('.played'));
					$('.played').addClass('aiDiscard');
					$('.played').removeClass('played');
					$('.attack').prop('disabled', false);
				});
				state.cards.wagerCards = "";
				console.log("you lost it");
				console.log(data)
			})
		} else {
			console.log("it's a war!");
			if (data.piles.discard_1 && data.piles.pile_1.remaining === 0 && data.piles.discard_1.remaining === 0){
				getDataFromApi(state.urls.discard1, warDiscard1)
				$('.attack').prop('disabled', false);
			} else if (data.piles.discard_2 && data.piles.pile_2.remaining === 0 && data.piles.discard_2.remaining ===0){
				getDataFromApi(state.urls.discard2, warDiscard2)
				swapPiles(data);
				$('.played').delay(1000).animate({left: "10%", top: "5%"}, "fast", function(){
					$('.played').css('z-index', 200-parseInt($('.played').css('z-index')));
					$('.game').append($('.played'));
					$('.played').addClass('aiDiscard');
					$('.played').removeClass('played');
					$('.attack').prop('disabled', false);
				});
				state.cards.wagerCards = "";
				$('.attack').prop('disabled', false);
			} else {	
				getDataFromApi(state.urls.war1, function(data){
					state.cards.drawn1.push(data.cards[0].code);
					swapPiles(data);
					var cardImage = data.cards[0].image;
					var warDraw11 = $('.game > .cardContainer1:last');
					var cardFlipped1 = $('.game > .cardContainer1:last > .card');
					var cardFlipped2 = $('.game > .cardContainer1:last > .cardFront');
					cardFlipped2.attr("src", cardImage);
					warDraw11.animate({top: "45%", left: "35%"}, "fast", function (){
						warDraw11.addClass('played');
						warDraw11.removeClass('cardContainer1');
						cardFlipped1.addClass('flipped1');
						cardFlipped2.addClass('flipped2');
						setTimeout(function () {
							  new Audio('audio/cardFlip.wav').play();
							}, 150);
						warDraw11.css('z-index', maxPlayed());
						observer.onEvent("playerWager1Done", "");
					})
				})
			}
		}
	}

	function playerWager1Done(event, data){
		getDataFromApi(state.urls.war2, function(data){
			state.cards.drawn2.push(data.cards[0].code);
			swapPiles(data);
			var cardImage = data.cards[0].image;
			var warDraw21 = $('.game > .cardContainer2:last');
			var cardFlipped1 = $('.game > .cardContainer2:last > .card');
			var cardFlipped2 = $('.game > .cardContainer2:last > .cardFront');
			cardFlipped2.attr("src", cardImage);
			warDraw21.delay(200).animate({top: "45%", left: "51%"}, "fast", function (){
				warDraw21.addClass('played');
				warDraw21.removeClass('cardContainer2');
				cardFlipped1.addClass('flipped1');
				cardFlipped2.addClass('flipped2');
				setTimeout(function () {
					  new Audio('audio/cardFlip.wav').play();
					}, 150);
				warDraw21.css('z-index', maxPlayed());
				observer.onEvent("aiWager1Done", data);
			});
		});
	}
			
	function aiWager1Done(event, data){	
		if (data.piles.discard_1 && data.piles.pile_1.remaining === 0 && data.piles.discard_1.remaining === 0){
			getDataFromApi(state.urls.discard1, warDiscard1)
			swapPiles(data);
				$('.played').delay(1000).animate({left: "10%", top: "75%"}, "fast", function(){
					$('.played').css('z-index', 200-parseInt($('.played').css('z-index')));
					$('.game').append($('.played'));
					$('.played').addClass('playerDiscard');
					$('.played').removeClass('played');
					$('.attack').prop('disabled', false);
				});
				state.cards.wagerCards = "";
			$('.attack').prop('disabled', false);
		} else if (data.piles.discard_2 && data.piles.pile_2.remaining === 0 && data.piles.discard_2.remaining ===0){
			getDataFromApi(state.urls.discard2, warDiscard2)
			$('.attack').prop('disabled', false);
		} else {				
			getDataFromApi(state.urls.war1, function(data){
				state.cards.drawn1.push(data.cards[0].code);
				swapPiles(data);
				var cardImage = data.cards[0].image;
				var warDraw12 = $('.game > .cardContainer1:last');
				var cardFlipped1 = $('.game > .cardContainer1:last > .card');
				var cardFlipped2 = $('.game > .cardContainer1:last > .cardFront');
				cardFlipped2.attr("src", cardImage);
				warDraw12.delay(500).animate({top: "45%", left: "16%"}, "fast", function (){
					warDraw12.addClass('played');
					warDraw12.removeClass('cardContainer1');
					cardFlipped1.addClass('flipped1');
					cardFlipped2.addClass('flipped2');
					setTimeout(function () {
					  new Audio('audio/cardFlip.wav').play();
					}, 150);
					warDraw12.css('z-index', maxPlayed());
					observer.onEvent("playerWager2Done", "");
				});
			});
		}
	}

	function playerWager2Done(event, data){
		getDataFromApi(state.urls.war2, function(data){
			state.cards.drawn2.push(data.cards[0].code);
			swapPiles(data);
			var cardImage = data.cards[0].image;
			var warDraw22 = $('.game > .cardContainer2:last');
			var cardFlipped1 = $('.game > .cardContainer2:last > .card');
			var cardFlipped2 = $('.game > .cardContainer2:last > .cardFront');
			cardFlipped2.attr("src", cardImage);
			warDraw22.delay(700).animate({top: "45%", left: "68%"}, "fast", function (){
				warDraw22.addClass('played');
				warDraw22.removeClass('cardContainer2');
				cardFlipped1.addClass('flipped1');
				cardFlipped2.addClass('flipped2');
				setTimeout(function () {
					  new Audio('audio/cardFlip.wav').play();
					}, 150);
				warDraw22.css('z-index', maxPlayed());
				observer.onEvent("aiWager2Done", data);
			});
		});
	}

	function aiWager2Done(event, data){
		if (data.piles.discard_1 && data.piles.pile_1.remaining === 0 && data.piles.discard_1.remaining === 0){
			getDataFromApi(state.urls.discard1, warDiscard1)
			$('.attack').prop('disabled', false);
		} else if (data.piles.discard_2 && data.piles.pile_2.remaining === 0 && data.piles.discard_2.remaining ===0){
			getDataFromApi(state.urls.discard2, warDiscard2)
			$('.attack').prop('disabled', false);
		} else {
		// display drawn cards
		state.cards.wagerCards += (state.cards.wagerCards.length > 0 ? "," : "") + state.cards.currentCard1 + "," + state.cards.currentCard2 + "," + state.cards.drawn1.join() + "," + state.cards.drawn2.join();
		state.cards.drawn1 = [];
		state.cards.drawn2 = [];
		state.cards.currentCard1 = "";
		state.cards.currentCard2 = "";
		$('.attack').prop('disabled', false);
		console.log(state.cards.wagerCards);
		}
	}

	observer.addEventListener("attackPlayer2Done", attackPlayer2Done);
	observer.addEventListener("attackPlayer1Done", attackPlayer1Done);
	observer.addEventListener("playerWager1Done", playerWager1Done);
	observer.addEventListener("aiWager1Done", aiWager1Done);
	observer.addEventListener("playerWager2Done", playerWager2Done);
	observer.addEventListener("aiWager2Done", aiWager2Done);

// Attack function for human player.

	$('.attack').click(function(e){
		$('.attack').prop('disabled', true);
		state.urls.attack1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
		state.urls.attack2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
		getDataFromApi(state.urls.attack1, function(data){
			state.cards.currentVal1 = cardValue(data.cards[0].value);
			state.cards.currentCard1 = data.cards[0].code;
			var cardImage = data.cards[0].image;
			var cardDraw1 = $('.game > .cardContainer1:last');
			var cardFlipped1 = $('.game > .cardContainer1:last > .card');
			var cardFlipped2 = $('.game > .cardContainer1:last > .cardFront');
			cardFlipped2.attr("src", cardImage);	
			cardDraw1.animate({top: "55%", left: "43%"}, "fast", function (){
				cardFlipped1.addClass('flipped1');
				cardFlipped2.addClass('flipped2');
				setTimeout(function () {
					  new Audio('audio/cardFlip.wav').play();
					}, 150);
				cardDraw1.addClass('played');
				cardDraw1.removeClass('cardContainer1');
				cardDraw1.css('z-index', maxPlayed());
				swapPiles(data);
				observer.onEvent("attackPlayer1Done", "");
			});
		});
	});		
});