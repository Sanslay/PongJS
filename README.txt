Maxime D.	Chef de projet/Developpeur du Serveur
Julien T.	Developpeur du Client
EI5 IAIE

Projet PONG-JS
HTML CSS JAVASCRIPT NODE  SOCKET IO COLOR RAPHAEL 
Le jeu Pong en reseau avec node Js
2 clients joueurs
Clients Spectateurs
/********MODE D'EMPLOI**********/

Etape1:
Récupéré l'adresse IP de l'ordinateur qui héberge le serveur. 
 
Etape2:
Changer la valeur de la variable serverAddr à la ligne 20 dans le fichier index.html, mettez à la place  l’adresse IP de l'ordinateur qui héberge le serveur.
Elle doit avoir la forme : ‘000.000.000.000 :8080/’
Si cette étape n’est pas faite les clients ne fonctionneront pas!

Etape3 :
Lancer le serveur avec un Node.js command prompt. Et vérifié qu’il n’indique pas d’erreur.
Le serveur peut indiquer une erreur d’affichage au départ, elle n’est pas à prendre en compte.
Si il vous manque des packages, utiliser les commandes npm.

Etape 4 :
Lancer  votre navigateur web, entrer une des adresses : localhost :8080 ou ipserveur :8080
Pour information  Raphael est optimisé pour une utilisation sur CHROME!
La première  connexion peut être longue il est absolument nécessaire d'avoir INTERNET sur le poste du serveur et du client.

Etape 5 :
La page index.html s’affiche, vérifier dans les log du serveur si un client est bien connecté.
Dans le cas contraire appuyer  sur  « Recharger la page »
Si c’est bien les cas un formulaire avec l’indication «  Vous etes le joueur bleu / rouge » s’affiche en bas à gauche de la page.
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
Pour le moment : Il est impératif que le joueur bleu indique qu’il soit prêt en premier,  le serveur indique une exception socket si ce n’est pas le cas.  En cas d’erreur quitter le serveur et TOUS les clients pour relancer le serveur.
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
Il faut que chacun des joueurs remplissent le formulaire est indique qu’il soit prêt pour que le jeu commence. 
Dans le formulaire :
Name : indiquez votre nom de joueur.
Difficulté : la difficulté du jeu pour le joueur X, la difficulté global du jeu sera calculé en fonction du choix des deux joueurs.
Score : le score  du jeu pour le joueur X, le score  à atteindre pour gagner sera calculé en fonction du choix des deux joueurs.


Etape 6 :
Une fois que tous les joueurs sont prêts le jeu se lance.
La difficulté augmente à chaque fois que la balle touche la raquette d’un joueur.
Un joueur gagne quand il atteint le score à atteindre.
Le jeu se relance quand un joueur gagne.
Si l’on connecte un troisième client ou plus il deviendra un spectateur est peu ainsi observer le jeu.
Un tchat est disponible pour discuter avec les autres joueurs et les clients.


