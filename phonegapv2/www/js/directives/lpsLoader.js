
angular.module('lps.directives')

.directive('lpsLoader', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/lpsLoader.html',
		link:function(scope) {
			var messages = [
				'Chargement des derniers trucs à voir ici bas',
				'Fermez les yeux, ça vient',
				'Chérie ça vous charger',
				'Réfléchissez sur votre existence pendant que je télécharge vos photos dégeux',
				'Euh oué je pense pas avoir été... un jour aussi long à charger !'
			];

			var anims = [
				'pendulum',
				'rotatey',
				'balancoire'
			]


			scope.next = function(){
				scope.message = messages[Math.floor(Math.random()*messages.length)];
				scope.anim = anims[Math.floor(Math.random()*anims.length)];
			}

			scope.next();

		}
	}
})


.directive('lpsLoaderIcon', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/lpsLoaderIcon.html'
	}
})
