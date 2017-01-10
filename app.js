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
function swapPiles(data){
	if (data.piles.pile_1.remaining === 0) {
		state.urls.drawIt1 = "discard_1";
		state.urls.discardIt1 = "pile_1";
	} if (data.piles.pile_2.remaining === 0){
		state.urls.drawIt2 = "discard_2";
		state.urls.discardIt2 = "pile_2";
	} if (data.piles.discard_1 && data.piles.discard_1.remaining === 0){
		state.urls.drawIt1 = "pile_1";
		state.urls.discardIt1 = "discard_1";
	} if (data.piles.discard_2 && data.piles.discard_2.remaining === 0){
		state.urls.drawIt2 = "pile_2";
		state.urls.discardIt2 = "discard_2";
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
function warDiscard(data){
	swapPiles(data);
	state.cards.drawn1 = [];
	state.cards.drawn2 = [];
	state.cards.currentCard1 = "";
	state.cards.currentCard2 = "";
	console.log(data);
}

// This generates words telling you whether you've won or lost.
function endGame(data){
	if (data.piles.discard_1 && data.piles.pile_1.remaining === 0 && data.piles.discard_1.remaining === 0){
		$('.youLose').removeClass('hidden');
	} if (data.piles.discard_2 && data.piles.pile_2.remaining === 0 && data.piles.discard_2.remaining === 0){
		$('.youWin').removeClass('hidden');
	}
}

$(document).ready(function(){
	$('.shuffle').click(function(e){

// API shuffles the cards. Deck ID is stored in the state and 
// used for future callbacks. Each player draws half the deck and 
// the draw and discard variables are initially declared.
		getDataFromApi(state.urls.shuffle, function(data){
			state.cards.id = data.deck_id;
			state.urls.draw = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/draw/?count=26';
		drawToPile1();
		drawToPile2();
		$('.shuffle').addClass('hidden');
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
					$('.startDeck').append('<div class="cardContainer1"><img class="card" src="image/card back red.png" style="z-index:' + (index + 100) + 
						'; margin-left:' + ((index / 2) - 30) + 'px; margin-bottom:' + (index / 2) + 'px">' + 
						'<img class="cardFront" src="' + data.cards[index].image + '" style="z-index:' + (index + 100) + '; margin-left:' + ((index / 2) - 30) +
						'px; margin-bottom:' + (index / 2) + 'px"></div>');
				})
				$('.cardContainer1').appendTo('.playerBack');
				state.urls.pile1 = 'https://deckofcardsapi.com/api/deck/' + 
				state.cards.id + '/pile/pile_1/add/?cards=' + codeString;
				getDataFromApi(state.urls.pile1, function(data){
					state.cards.pile1 = data.piles.pile_1;
				})
			})
		};
		function drawToPile2(){
			getDataFromApi(state.urls.draw, function(data){
				var codeString = data.cards.map(function(card){
					return card.code;
				}).join();
				data.cards.forEach(function(item, index){
					$('.startDeck').append('<div class="cardContainer2"><img class="card" src="image/card back red.png" style="z-index:' + (index + 126) + 
						'; margin-left:' + ((index / 2) - 30) + 'px; margin-bottom:' + (index / 2) + 'px">' + 
						'<img class="cardFront" src="' + data.cards[index].image + '" style="z-index:' + (index + 100) + '; margin-left:' + ((index / 2) - 30) +
						'px; margin-bottom:' + (index / 2) + 'px"></div>');
				});
				$('.cardContainer2').appendTo('.aiBack');
				state.urls.pile2 = 'https://deckofcardsapi.com/api/deck/' + 
				state.cards.id + '/pile/pile_2/add/?cards=' + codeString;
				getDataFromApi(state.urls.pile2, function(data){
					state.cards.pile2 = data.piles.pile_2;
				})
			});
		}
	});

	function animate1Done(event, data){
		getDataFromApi(state.urls.attack2, function(data){
			swapPiles(data);
			state.cards.currentVal2 = cardValue(data.cards[0].value);
			state.cards.currentCard2 = data.cards[0].code;
			var cardDraw11 = $('.aiBack > .cardContainer2:last .card');
			var cardDraw22 = $('.aiBack > .cardContainer2:last .cardFront');
			cardDraw11.animate({top: "180px"}, "fast", function (){
				cardDraw22.animate({top: "180px"}, "fast", function(){
					cardDraw11.addClass('flipped1');
					cardDraw22.addClass('flipped2');
					$('.aiBack > .cardContainer2:last img.cardFront.flipped2').css('z-index',200-$('.aiBack > .cardContainer2:last img.cardFront.flipped2').css('z-index'));
					$('.aiBack > .cardContainer2:last img.cardFront.flipped1').css('z-index',200-$('.aiBack > .cardContainer2:last img.cardFront.flipped1').css('z-index'));
					$('.aiFront').append($('.aiBack > .cardContainer2:last')[0].outerHTML); 
					$('.aiBack > .cardContainer2:last').remove();
					observer.onEvent("animate2Done", data);
				});
			});
		});
	}

	function animate2Done(event, data){
		state.urls.discard1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt1 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
		state.urls.discard2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt2 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
		state.urls.war1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
		state.urls.war2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
		if (state.cards.currentVal1 > state.cards.currentVal2){
			getDataFromApi(state.urls.discard1, function(data){
				swapPiles(data);
				endGame(data);
				$('.playerFront > .cardContainer1 .cardFront').delay(500).animate({top: "0" , left: "30px"}, "fast", function(){
					$('.playerFront > .cardContainer1 .card').animate({top: "0" , left: "30px"}, "fast", function(){
						$('.aiFront > .cardContainer2 .cardFront').delay(0).animate({top: "0", left: "30px"}, "fast", function(){
							$('.aiFront > .cardContainer2 .card').delay(0).animate({top: "0", left: "30px"}, "fast", function(){
								$('.playerDiscard').append($('.playerFront > .cardContainer1'));
								$('.playerDiscard').append($('.aiFront > .cardContainer2'));
								$('.playerDiscard').append($('.playerFront > .cardContainer2'));
								$('.playerDiscard').append($('.aiFront > .cardContainer1'));
								$('.playerFront > .cardContainer1').remove();
								$('.playerFront > .cardContainer2').remove();
								$('.aiFront > .cardContainer1').remove();
								$('.aiFront > .cardContainer2').remove();
							});
						});
					});
				});
				state.cards.wagerCards = "";
				$('.attack').prop('disabled', false);
				console.log("you won it");
				console.log(data);
			})
		} else if (state.cards.currentVal1 < state.cards.currentVal2) {
			getDataFromApi(state.urls.discard2, function(data){
				swapPiles(data);
				endGame(data);
				$('.playerFront > .cardContainer1 .cardFront').delay(500).animate({top: "0" , left: "30px"}, "fast", function(){
					$('.playerFront > .cardContainer1 .card').animate({top: "0" , left: "30px"}, "fast", function(){
						$('.aiFront > .cardContainer2 .cardFront').delay(0).animate({top: "0", left: "30px"}, "fast", function(){
							$('.aiFront > .cardContainer2 .card').delay(0).animate({top: "0", left: "30px"}, "fast", function(){
								$('.aiDiscard').append($('.playerFront > .cardContainer1'));
								$('.aiDiscard').append($('.aiFront > .cardContainer2'));
								$('.aiDiscard').append($('.playerFront > .cardContainer2'));
								$('.aiDiscard').append($('.aiFront > .cardContainer1'));
								$('.playerFront > .cardContainer1').remove();
								$('.playerFront > .cardContainer2').remove();
								$('.aiFront > .cardContainer1').remove();
								$('.aiFront > .cardContainer2').remove();
							});
						});
					});
				});
				state.cards.wagerCards = "";
				$('.attack').prop('disabled', false);
				console.log("you lost it");
				console.log(data)
			})
		} else {
			console.log("it's a war!");
			if (data.piles.discard_1 && data.piles.pile_1.remaining === 0 && data.piles.discard_1.remaining === 0){
				getDataFromApi(state.urls.discard1, warDiscard)
				$('.attack').prop('disabled', false);
			} else if (data.piles.discard_2 && data.piles.pile_2.remaining === 0 && data.piles.discard_2.remaining ===0){
				getDataFromApi(state.urls.discard2, warDiscard)
				$('.attack').prop('disabled', false);
			} else {	
				getDataFromApi(state.urls.war1, function(data){
					state.cards.drawn1.push(data.cards[0].code);
					swapPiles(data);
					getDataFromApi(state.urls.war2, function(data){
					state.cards.drawn2.push(data.cards[0].code);
					swapPiles(data);
						if (data.piles.discard_1 && data.piles.pile_1.remaining === 0 && data.piles.discard_1.remaining === 0){
							getDataFromApi(state.urls.discard1, warDiscard)
							$('.attack').prop('disabled', false);
						} else if (data.piles.discard_2 && data.piles.pile_2.remaining === 0 && data.piles.discard_2.remaining ===0){
							getDataFromApi(state.urls.discard2, warDiscard)
							$('.attack').prop('disabled', false);
						} else {
						console.log("It's a War! 2")				
							getDataFromApi(state.urls.war1, function(data){
							state.cards.drawn1.push(data.cards[0].code);
							swapPiles(data);
								getDataFromApi(state.urls.war2, function(data){
								state.cards.drawn2.push(data.cards[0].code);
								swapPiles(data);
									if (data.piles.discard_1 && data.piles.pile_1.remaining === 0 && data.piles.discard_1.remaining === 0){
										getDataFromApi(state.urls.discard1, warDiscard)
										$('.attack').prop('disabled', false);
									} else if (data.piles.discard_2 && data.piles.pile_2.remaining === 0 && data.piles.discard_2.remaining ===0){
										getDataFromApi(state.urls.discard2, warDiscard)
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
								})
							})
						}
					})
				})
			}
		}
	}

	observer.addEventListener("animate2Done", animate2Done);
	observer.addEventListener("animate1Done", animate1Done);
	$('.attack').click(function(e){
		$('.attack').prop('disabled', true);
		state.urls.attack1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
		state.urls.attack2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
		getDataFromApi(state.urls.attack1, function(data){
			swapPiles(data);
			state.cards.currentVal1 = cardValue(data.cards[0].value);
			state.cards.currentCard1 = data.cards[0].code;
			var cardDraw1 = $('.playerBack > .cardContainer1:last .card');
			var cardDraw2 = $('.playerBack > .cardContainer1:last .cardFront');
			cardDraw1.animate({top: "-70px"}, "fast", function (){
				cardDraw2.animate({top: "-70px"}, "fast", function(){
					cardDraw1.addClass('flipped1');
					cardDraw2.addClass('flipped2');
					$('.playerBack > .cardContainer1:last img.cardFront.flipped2').css('z-index',200-$('.playerBack > .cardContainer1:last img.cardFront.flipped2').css('z-index'));
					$('.playerBack > .cardContainer1:last img.cardFront.flipped1').css('z-index',200-$('.playerBack > .cardContainer1:last img.cardFront.flipped1').css('z-index'));
					$('.playerFront').append($('.playerBack > .cardContainer1:last')[0].outerHTML); 
					$('.playerBack > .cardContainer1:last').remove();
					observer.onEvent("animate1Done", "");
				});
			});
		});
	});		
});