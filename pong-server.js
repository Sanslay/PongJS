var os = require( 'os' );
var networkInterfaces = os.networkInterfaces( );

//console.log( networkInterfaces );
var port = 8080;
//On crée le serveur et tous le reste
var app = require('http').createServer(handler)

//On verifie si on a bien tous les modules
, io = require('socket.io').listen(app)
, fs = require('fs');
// logging		Je sais pas trop à quoi sa sert
io.set('log level', 1);
//Ecoute le port 8080
app.listen(port);
//On crée cette fonction pour envoyer les pages html voulues
function handler (req, res) {

    fs.readFile(__dirname + '/index.html',
	function (err, data) {
	    if (err) {
		res.writeHead(500);
		return res.end('Error loading client.html');
	    }
		    res.writeHead(200);
	    res.end(data);
	});
}

// parametre des trucs de base doit etre les memes que le client
var fieldWidth = 800;
var fieldHeight = 500;
var ballRadius = 20;
var playerWidth = 20;
var playerHeight = 100;
var ScoreBleu=0;
var ScoreRouge=0;
var Vitesse=1;
var vitesseJ1=0;
var vitesseJ2=0;
var games = [[]];
var nbj=0;
var nbvisiteur=0;

//Lorsque l'on envoie un message au client lorsqu'il vient de se connecter
io.sockets.on('connection', function (socket) {
	
// Mes événements lorsque le client est connecté !
	var address = socket.handshake.address;
	
	//On gere l'histoire des joueurs
    console.log('Connection d un nouveau joueur: '+ address.address + " : " + address.port);
    var players;
	
	

    if(games[games.length - 1].length >= 2) 
	{
		players = [];
		games.push(players);
    }
	else 
	{
		players = games[games.length - 1];
    }
	//On defini un joueur par son numero sa positio et son socket
    var player = {'number': players.length,'position': 0,'socket': socket}

	//Si il y a moins de 2 joueurs , il y a que 1 joueur possible en jeu 
	if(nbj<2)
	{
		players.push(player);
		nbj++;
		//console.log('Le nombre de j:'+nbj);
		    // On affiche sur le log le numero du joueur
    console.log('Connection Joueur numero: ' + player.number);
	//On envoi au server  comme donnée le numero du joueur 
    socket.emit('player-number', player.number);
		
	}
	//si il y a 2 joueurs on defini le joueur comme 3 ou encore visiteur
	else
	{
		player = {'number': 3,'position': 0,'socket': socket}
		socket.emit('player-number', 3);
		nbvisiteur++;
		console.log('Connection du visiteur: '+nbvisiteur);
		
	}
	console.log('Le nombre de joueur est de  '+ nbj);


    // On envoi la position du joueur a partir du moment ou il en a 2
    socket.on('player-position', function(data) 
	{
		if(players.length == 2) 
		{
			players[(player.number + 1) % 2].socket.emit('opponents-position', data);

			player.position = data;
		}
    });
	//On recoi les vitesses venant des joueurs
	socket.on('game-vitesse', function(data) 
	{
		if(nbj==2)
		{
				if(data[0]==0)
				{
					vitesseJ1=data[1];
				}
				if(data[0]==1)
				{
					vitesseJ2=data[1];
				}
			Vitesse=1+(vitesseJ1+vitesseJ2)/3;
			var Vitessepourcent = Vitesse*100
			
			players[0].socket.emit('vitesse-change', parseInt(Vitessepourcent));
			players[1].socket.emit('vitesse-change', parseInt(Vitessepourcent));
		}
    });

    //Quand un client ce deconnecte
    socket.on('disconnect', function(data) 
	{
		//On verifie si ce n'est pas une erreur 
		if(players.length <= 2 ) 
		{

			//On arrete le cycle du jeu si il est en fonctionnement
			clearInterval(Boucle);
			//score a 0
			ScoreBleu=0;
			ScoreRouge=0;
			//On donne une vitesse de 0 à la balle
			ballVector = [0, 0]
			
			//Si le joueur 1 se deconnecte
			
			if(player.number==1 ) 
			{
				nbj--;
				console.log('Deconnection joueur 1 ');
				data=player.number ;
				players[0].socket.emit('opponent-disconnected', data);
			}
			//Si le joueur 0 se deconnecte
			console.log('Le nombre de joueur est de  '+ nbj);
			if(player.number==0 )
			{
					if(nbj>1)
					{
						data=player.number ;
						players[1].socket.emit('opponent-disconnected', data);
					}
				nbj--;
				console.log('Deconnection joueur 0 ');
				

			}
			//Un visiteur se deco
			if(player.number==3)
			{
				console.log('Deconnection d un visiteur ');
				nbvisiteur--;
			}
		}
    });

    // Le jeu commmence

	//La position de la balle au depart en direction
    var ballVector = [2,2];
    ball = {
	'x': fieldWidth / 2, 
	'y': fieldHeight / 2
    };
	//Toute les interval de 5 msS on fait Boucle
    var Boucle = setInterval(function() {
	//On verifie si on a bien toujours 2 joueurs

	if(players.length == 2 && player.number == 0) {
		

		
	    if(ball.x < (playerWidth + ballRadius)) {		
			if(players[0].position >= ball.y || (players[0].position + playerHeight) <= ball.y) {
				//Le joueur 1 a perdu la partie
				//console.log('player 1 lost - reset ball posigion');
				ScoreBleu++;
				
				//On envoi les nouveaux score
				players[0].socket.emit('game-score', [ScoreBleu,ScoreRouge]);
				//players[1].socket.emit('game-score', [ScoreBleu,ScoreRouge]);
				socket.broadcast.emit('game-score', [ScoreBleu,ScoreRouge]);
				
				ball.x = fieldWidth/2,
				ball.y = fieldHeight/2
			} 

		//console.log('Touche la raquette J1');
		ballVector[0] = Math.abs(ballVector[0]);
		//On demande une animation
		squish();
	    }
		
		
	    if(ball.x > (fieldWidth - playerWidth - ballRadius)) {
		// player 2 side
			if(players[1].position >= ball.y || (players[1].position + playerHeight) <= ball.y) {
				// player 2 lost
				//console.log('player 2 lost - reset ball posigion');
				ScoreRouge++;
				
				players[0].socket.emit('game-score', [ScoreBleu,ScoreRouge]);
				//players[1].socket.emit('game-score', [ScoreBleu,ScoreRouge]);
				socket.broadcast.emit('game-score', [ScoreBleu,ScoreRouge]);
				
				
				ball.x = fieldWidth/2,
				ball.y = fieldHeight/2
			}
		//console.log('Touche la raquette J2');
		//console.log('negative vector.x');
		ballVector[0] = -Math.abs(ballVector[0]);
		//On demande une animation
		squish();
	    }
	    // losque l'on touche le mur en haut
	    if(ball.y <= ballRadius) {
		//console.log('mur en haut');
		ballVector[1] = Math.abs(ballVector[1]);
		//On demande une animation
		squish();
	    }
	    // losque l'on touche le mur en bas
	    if(ball.y >= (fieldHeight - ballRadius)) {
		//console.log('mur en bas');
		ballVector[1] = -Math.abs(ballVector[1]);
		//On demande une animation
		squish();
	    }
	    //console.log('player.number: ' + player.number + ', ball.x: ' + ball.x + ', ball.y: ' + ball.y + ', ballVector: ' + ballVector);
		
		//On met a jours la position de la balle
		Vitesse=1+(vitesseJ1+vitesseJ2)/3;
		
	    ball.x += ballVector[0]*Vitesse;
	    ball.y += ballVector[1]*Vitesse;
		//On envoi la position au client0 point d'origine du jeu
	    players[0].socket.emit('ball-position', { 'x': ball.x, 'y': ball.y});
		//envoi de la position de la ball a tous
		socket.broadcast.emit('ball-position', { 'x': ball.x, 'y': ball.y});
		//En option
	   // players[1].socket.emit('ball-position', { 'x': ball.x, 'y': ball.y});
	   

		
		//envoi de la position des raquettes a tous traité que par les spectateurs
		socket.broadcast.emit('position-raquette',[players[0].position,players[1].position]);


	}
    }, 1);

    function squish() {
	//console.log('squish');
	players[0].socket.emit('squish');
	players[1].socket.emit('squish');
    }

});
