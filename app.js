state = {
	cards: {
		currentCard1: '',
		currentCard2: '',
		currentVal1: '',
		currentVal2: '',
		id: '',
		drawn1: '',
		drawn2: '',
		pile1: '',
		pile2: ''
	},
	urls: {
		shuffle: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
		draw: '',
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

$(document).ready(function(){
	
	$('.shuffle').click(function(e){
		getDataFromApi(state.urls.shuffle, function(data){
			state.cards.id = data.deck_id;
			state.urls.draw = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/draw/?count=26';
		drawToPile1();
		drawToPile2();
		$('.shuffle').addClass('hidden');
		$('.attack').removeClass('hidden');
		});
		function drawToPile1(){
			getDataFromApi(state.urls.draw, function(data){
				var codeString = data.cards.map(function(card){
					return card.code;
				}).join();
				data.cards.forEach(function(item, index){
					$('.startDeck').append('<div class="card"><img class="card" src="image/card back red.png" style="z-index:' + index + 
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
				state.urls.pile2 = 'https://deckofcardsapi.com/api/deck/' + 
				state.cards.id + '/pile/pile_2/add/?cards=' + codeString;
				getDataFromApi(state.urls.pile2, function(data){
					state.cards.pile2 = data.piles.pile_2;
				})
			});
		}
	});
	$('.attack').click(function(e){
		state.urls.attack1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/pile_1/draw/';
		state.urls.attack2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/pile_2/draw/';
		getDataFromApi(state.urls.attack1, function(data){
			if (data.cards[0].value === "JACK"){
				state.cards.currentVal1 = "11";
			} else if (data.cards[0].value === "QUEEN"){
				state.cards.currentVal1 = "12";
			} else if (data.cards[0].value === "KING"){
				state.cards.currentVal1 = "13";
			} else if (data.cards[0].value === "ACE"){
				state.cards.currentVal1 = "14";
			} else {
				state.cards.currentVal1 = data.cards[0].value;
			}
			state.cards.currentCard1 = data.cards[0].code;
			console.log(state.cards.currentVal1);
		})
		getDataFromApi(state.urls.attack2, function(data){
			if (data.cards[0].value === "JACK"){
				state.cards.currentVal2 = "11";
			} else if (data.cards[0].value === "QUEEN"){
				state.cards.currentVal2 = "12";
			} else if (data.cards[0].value === "KING"){
				state.cards.currentVal2 = "13";
			} else if (data.cards[0].value === "ACE"){
				state.cards.currentVal2 = "14";
			} else {
				state.cards.currentVal2 = data.cards[0].value;
			}
			state.cards.currentCard2 = data.cards[0].code;
			console.log(state.cards.currentVal2);
		})
		state.urls.discard1 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/discard_1/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2;
		state.urls.discard2 = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/pile/discard_2/add/?cards=' + state.cards.currentCard1 + ',' + state.cards.currentCard2;
		if (state.cards.currentVal1 > state.cards.currentVal2){
			getDataFromApi(state.urls.discard1, function(data){
				console.log(data);
			})
		} else if (state.cards.currentVal1 < state.cards.currentVal2) {
			getDataFromApi(state.urls.discard2, function(data){
				console.log(data)
			})
		}
	})
});
