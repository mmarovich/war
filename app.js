state = {
	cards: {
		currentCard: '',
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
		pile2: ''
	}
}


function getDataFromApi(url, callback){
	$.getJSON(url, callback);
}



$(document).ready(function(){
	
// cards are shuffled and distributed evenly between two players.
	$('.shuffle').click(function(e){
		getDataFromApi(state.urls.shuffle, function(data){
			state.cards.id = data.deck_id;
			state.urls.draw = 'https://deckofcardsapi.com/api/deck/' + state.cards.id + '/draw/?count=26';	
		drawToPile();
		drawToPile();
		$('.shuffle').addClass('hidden');
		$('.attack').removeClass('hidden');
		});
		function drawToPile(){
			getDataFromApi(state.urls.draw, function(data){
				state.urls.pile1 = 'https://deckofcardsapi.com/api/deck/' + 
				state.cards.id + '/pile/pile_1/add/';
				getDataFromApi(state.urls.pile1, function(data){
					state.cards.pile1 = data.cards;
					console.log(state.cards.pile1);
				})
			})
		}
	});
});
