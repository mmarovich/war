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


function getDataFromApi(url, callback){
	$.getJSON(url, callback).fail(function(d) { 
		console.log("error"); 
	});
}

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
	state.urls.attack1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
	state.urls.attack2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
	state.urls.discard1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt1 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
	state.urls.discard2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt2 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
	state.urls.war1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
	state.urls.war2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
}

function warDiscard(data){
	swapPiles(data);
	state.cards.drawn1 = [];
	state.cards.drawn2 = [];
	state.cards.currentCard1 = "";
	state.cards.currentCard2 = "";
	console.log(data);
}

function endGame(data){
	if (data.piles.discard_1 && data.piles.pile_1.remaining === 0 && data.piles.discard_1.remaining === 0){
		$('.youLose').removeClass('hidden');
	} if (data.piles.discard_2 && data.piles.pile_2.remaining === 0 && data.piles.discard_2.remaining === 0){
		$('.youWin').removeClass('hidden');
	}
}

$(document).ready(function(){
	
	$('.shuffle').click(function(e){
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
			cardDraw1.animate({top: "-70px"}, "slow", function (){
				cardDraw2.animate({top: "-70px"}, "slow", function(){
				cardDraw1.addClass('flipped1');
				cardDraw2.addClass('flipped2');
				$('.playerFront').append($('.cardContainer1:last')[0].outerHTML); 
				$('.cardContainer1:last').remove();
				});
			});
			getDataFromApi(state.urls.attack2, function(data){
				swapPiles(data);
				state.cards.currentVal2 = cardValue(data.cards[0].value);
				state.cards.currentCard2 = data.cards[0].code;
				var cardDraw11 = $('.aiBack > .cardContainer2:last .card');
				var cardDraw22 = $('.aiBack > .cardContainer2:last .cardFront');
				cardDraw11.animate({top: "180px"}, "slow", function (){
					cardDraw22.animate({top: "180px"}, "slow", function(){
					cardDraw11.addClass('flipped1');
					cardDraw22.addClass('flipped2');
					$('.aiFront').append($('.cardContainer2:last')[0].outerHTML); 
					$('.cardContainer2:last').remove();
					});
				});
				state.urls.discard1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt1 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
				state.urls.discard2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt2 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
				state.urls.war1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
				state.urls.war2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
				if (state.cards.currentVal1 > state.cards.currentVal2){
					getDataFromApi(state.urls.discard1, function(data){
						swapPiles(data);
						endGame(data);
						$('.playerDiscard').append($('.playerFront').innerHTML);
						state.cards.wagerCards = "";
						$('.attack').prop('disabled', false);
						console.log("you won it");
						console.log(data);
					})
				} else if (state.cards.currentVal1 < state.cards.currentVal2) {
					getDataFromApi(state.urls.discard2, function(data){
						swapPiles(data);
						endGame(data);
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
			})
		})
	})
});