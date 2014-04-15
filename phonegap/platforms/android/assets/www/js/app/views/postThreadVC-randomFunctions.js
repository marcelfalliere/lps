"use strict";

// helper : get random placeholder

var randomPlaceholders = [
	'éh toi tabernac',
	'à vous',
	'je déteste quand ...',
	'j\'aime bien quant ...',
	'est-ce que je suis le seul à faire ça ?'
];

function getRandomPlaceholder(){
	var lastRandomPlaceholder = localStorage.getItem('lastRandomPlaceholder')
	if (lastRandomPlaceholder==null || lastRandomPlaceholder==undefined) {
		lastRandomPlaceholder=0;
	} else {
		lastRandomPlaceholder=parseInt(lastRandomPlaceholder,10);
	}

	var placeholder = '';
	if (lastRandomPlaceholder+1 < randomPlaceholders.length) {
		placeholder = randomPlaceholders[lastRandomPlaceholder+1];
		localStorage.setItem('lastRandomPlaceholder', lastRandomPlaceholder+1);
	} else {
		placeholder = randomPlaceholders[0];
		localStorage.setItem('lastRandomPlaceholder', 0);
	}

	return placeholder;
}
