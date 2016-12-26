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
		drawToPile1();
		drawToPile2();
		$('.shuffle').addClass('hidden');
		$('.attack').removeClass('hidden');
		});
		function drawToPile1(){
			getDataFromApi(state.urls.draw, function(data){
				state.urls.pile1 = 'https://deckofcardsapi.com/api/deck/' + 
				state.cards.id + '/pile/pile_1/add/?cards=' + data.cards[0].code + ',' + data.cards[1].code + 
				',' + data.cards[2].code + ',' + data.cards[3].code + ',' + data.cards[4].code + ',' + data.cards[5].code +
				',' + data.cards[6].code + ',' + data.cards[7].code + ',' + data.cards[8].code + ',' + data.cards[9].code + 
				',' + data.cards[10].code + ',' + data.cards[11].code + ',' + data.cards[12].code + ',' + data.cards[13].code + 
				',' + data.cards[14].code + ',' + data.cards[15].code + ',' + data.cards[16].code + ',' + data.cards[17].code + 
				',' + data.cards[18].code + ',' + data.cards[19].code + ',' + data.cards[20].code + ',' + data.cards[21].code + 
				',' + data.cards[22].code + ',' + data.cards[23].code + ',' + data.cards[24].code + ',' + data.cards[25].code;
				getDataFromApi(state.urls.pile1, function(data){
					console.log(data.cards);
					})
				})
			}
		function drawToPile2(){
			getDataFromApi(state.urls.draw, function(data){
				state.urls.pile2 = 'https://deckofcardsapi.com/api/deck/' + 
				state.cards.id + '/pile/pile_2/add/?cards=' + data.cards[0].code + ',' + data.cards[1].code + 
				',' + data.cards[2].code + ',' + data.cards[3].code + ',' + data.cards[4].code + ',' + data.cards[5].code +
				',' + data.cards[6].code + ',' + data.cards[7].code + ',' + data.cards[8].code + ',' + data.cards[9].code + 
				',' + data.cards[10].code + ',' + data.cards[11].code + ',' + data.cards[12].code + ',' + data.cards[13].code + 
				',' + data.cards[14].code + ',' + data.cards[15].code + ',' + data.cards[16].code + ',' + data.cards[17].code + 
				',' + data.cards[18].code + ',' + data.cards[19].code + ',' + data.cards[20].code + ',' + data.cards[21].code + 
				',' + data.cards[22].code + ',' + data.cards[23].code + ',' + data.cards[24].code + ',' + data.cards[25].code;
				getDataFromApi(state.urls.pile2, function(data){
					console.log(data.cards);
				})
			});
		}
	});
});
