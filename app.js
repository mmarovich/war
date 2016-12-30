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
	$.getJSON(url, callback);
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
					$('.startDeck').append('<div class="card"><img class="card" src="image/card back red.png" style="z-index:' + (index + 100) + 
						'; margin-left:' + (index / 2) + 'px; margin-bottom:' + (index / 2) + 'px"></div>');
				})
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
					$('.startDeck').append('<div class="card"><img class="card" src="image/card back red.png" style="z-index:' + (index + 126) + 
						'; margin-left:' + (index / 2) + 'px; margin-bottom:' + (index / 2) + 'px"></div>');
				});
				state.urls.pile2 = 'https://deckofcardsapi.com/api/deck/' + 
				state.cards.id + '/pile/pile_2/add/?cards=' + codeString;
				getDataFromApi(state.urls.pile2, function(data){
					state.cards.pile2 = data.piles.pile_2;
				})
			});
		}
	});
	$('.attack').click(function(e){
		state.urls.attack1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
		state.urls.attack2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
		getDataFromApi(state.urls.attack1, function(data){
			state.cards.currentVal1 = cardValue(data.cards[0].value);
			state.cards.currentCard1 = data.cards[0].code;
			getDataFromApi(state.urls.attack2, function(data){
				state.cards.currentVal2 = cardValue(data.cards[0].value);
				state.cards.currentCard2 = data.cards[0].code;
				state.urls.discard1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt1 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
				state.urls.discard2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.discardIt2 + '/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2 + "," + state.cards.wagerCards;
				state.urls.war1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt1 + '/draw/';
				state.urls.war2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/' + state.urls.drawIt2 + '/draw/';
				if (state.cards.currentVal1 > state.cards.currentVal2){
					getDataFromApi(state.urls.discard1, function(data){
						if (data.piles.pile_1.remaining === 0) {
							state.urls.drawIt1 = "discard_1";
							state.urls.discardIt1 = "pile_1";
						} if (data.piles.pile_2.remaining === 0){
							state.urls.drawIt2 = "discard_2";
							state.urls.discardIt2 = "pile_2";
						}
						state.cards.wagerCards = "";
						console.log(data);
					})
				} else if (state.cards.currentVal1 < state.cards.currentVal2) {
					getDataFromApi(state.urls.discard2, function(data){
						if (data.piles.pile_1.remaining === 0) {
							state.urls.drawIt1 = "discard_1";
							state.urls.discardIt1 = "pile_1";
						} if (data.piles.pile_2.remaining === 0){
							state.urls.drawIt2 = "discard_2";
							state.urls.discardIt2 = "pile_2";
						}
						state.cards.wagerCards = "";
						console.log(data)
					})
				} else {
					$.when(
					$.getJSON(state.urls.war1, function(data){
						state.cards.drawn1.push(data.cards[0].code);
						if (data.piles.pile_1.remaining === 0) {
							state.urls.drawIt1 = "discard_1";
							state.urls.discardIt = "pile_1";
						} if (data.piles.pile_2.remaining === 0){
							state.urls.drawIt2 = "discard_2";
							state.urls.discardIt2 = "pile_2";
						}
					}),
					$.getJSON(state.urls.war1, function(data){
						state.cards.drawn1.push(data.cards[0].code);
						if (data.piles.pile_1.remaining === 0) {
							state.urls.drawIt1 = "discard_1";
							state.urls.discardIt = "pile_1";
						} if (data.piles.pile_2.remaining === 0){
							state.urls.drawIt2 = "discard_2";
							state.urls.discardIt2 = "pile_2";
						}
					}),
					$.getJSON(state.urls.war2, function(data){
						state.cards.drawn2.push(data.cards[0].code);
						if (data.piles.pile_1.remaining === 0) {
							state.urls.drawIt1 = "discard_1";
							state.urls.discardIt = "pile_1";
						} if (data.piles.pile_2.remaining === 0){
							state.urls.drawIt2 = "discard_2";
							state.urls.discardIt2 = "pile_2";
						}
					}),
					$.getJSON(state.urls.war2, function(data){
						state.cards.drawn2.push(data.cards[0].code);
						if (data.piles.pile_1.remaining === 0) {
							state.urls.drawIt1 = "discard_1";
							state.urls.discardIt = "pile_1";
						} if (data.piles.pile_2.remaining === 0){
							state.urls.drawIt2 = "discard_2";
							state.urls.discardIt2 = "pile_2";
						}
					})
					).then(function(){
						// display drawn cards
						state.cards.wagerCards += (state.cards.wagerCards.length > 0 ? "," : "") + state.cards.currentCard1 + "," + state.cards.currentCard2 + "," + state.cards.drawn1.join() + "," + state.cards.drawn2.join();
						state.cards.drawn1 = [];
						state.cards.drawn2 = [];
						state.cards.currentCard1 = "";
						state.cards.currentCard2 = "";
						console.log(state.cards.wagerCards);
					})
				}			
			})
		})
	})
});