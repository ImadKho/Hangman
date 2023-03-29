const tabLettres = document.getElementsByClassName("lettre");
var clickedLetter;
var nbHeart = 10;
const tabHearts = document.querySelectorAll(".image > img");
var tabMots = ["POMME", "ESQUIMAU", "MARINADE", "ESTUDIANTIN", "CORAN", "ALLIGATOR"]
var numMot = 0;
var nbMotTrouve=0;
var motNonMasque;
var motMasque;
var motMasqueH2; 

//Initialiser le 1er mot
initMot();

//Detecter une lettre appuyée par le user (div)
const handleClick = e => {
  e.target.className = e.target.className + " lettreAprClick"
  e.target.removeEventListener("click", handleClick)

  clickedLetter = e.target.innerText;
  if(motNonMasque.includes(clickedLetter))
  {
    preAffichage(motNonMasque, clickedLetter);
  }
  else
  {
    tabHearts[nbHeart-1].src = "./HeartMC/emptyHeartMC.png";
    tabHearts[nbHeart-1].parentNode.className += " empty";
    nbHeart--;
    if(nbHeart === 2)
    {
      tabHearts[nbHeart-1].parentNode.className += " bps"
      tabHearts[nbHeart-2].parentNode.className += " bps"
    }
    if(nbHeart === 1)
    {
      console.log(tabHearts[nbHeart].parentNode.className)
      tabHearts[nbHeart].parentNode.className = "image empty"
      console.log(tabHearts[nbHeart].parentNode.className)
      tabHearts[nbHeart-1].parentNode.className += " bps"
    }
    if(nbHeart === 0)
      motNonTrouve();
  }
}

//Detecter une touche entree par le user (clavier)
var doneLetters = [];
document.onkeydown = e => {
  clickedLetter = e.key.toUpperCase()
  //Pour ne pas prendre un click en considération il faut soit que la touche ne soit pas une lettre
  //OU qu'elle soit une lettre déjà saisie. 
  if(!isLetter(clickedLetter) || doneLetters.includes(clickedLetter))
  {
    return;
  }
  doneLetters.push(clickedLetter);
  for(lettre of tabLettres)
  {
    if(!lettre.className.includes("zombie"))
    {
      if(lettre.innerText === clickedLetter)
      {
        lettre.className = lettre.className + " lettreAprClick"
        lettre.removeEventListener("click", handleClick)
      }
    }
  }


  if(motNonMasque.includes(clickedLetter))
  {
    preAffichage(motNonMasque, clickedLetter);
  }
  else
  {
    tabHearts[nbHeart-1].src = "./HeartMC/emptyHeartMC.png";
    tabHearts[nbHeart-1].parentNode.className += " empty";
    nbHeart--;
    if(nbHeart === 2)
    {
      tabHearts[nbHeart-1].parentNode.className += " bps"
      tabHearts[nbHeart-2].parentNode.className += " bps"
    }
    if(nbHeart === 1)
    {
      console.log(tabHearts[nbHeart].parentNode.className)
      tabHearts[nbHeart].parentNode.className = "image empty"
      console.log(tabHearts[nbHeart].parentNode.className)
      tabHearts[nbHeart-1].parentNode.className += " bps"
    }
    if(nbHeart === 0)
      motNonTrouve();
  }
}

//Add event listener sur les div
for(lettre of tabLettres)
{
  if(!lettre.className.includes("zombie"))
  {
    lettre.addEventListener("click", handleClick);
  }
}


//Fin de partie
function finGame(){
  if(numMot === 6)
  {
    Swal.fire({
      title: `Merci d'avoir jouer !`,
      text: `Score : ${nbMotTrouve}/6`,
    }).then(() =>{
      window.location.replace("http://127.0.0.1:5500/Game/game.html");
    })   
  }
}

//Initialiser le mot
function initMot(){
  if(numMot !== 6)
  {
    motNonMasque = tabMots[numMot];
    //Initialiser motMasque (qui va contenir les étoiles)
    motMasque = "";
    for(let i=0; i<motNonMasque.length; i++)
    {
      motMasque = motMasque + "*";
    }
    //L'ancrer dans l'HTML
    motMasqueH2 = document.querySelector(".motMasqueContainer > h2");
    motMasqueH2.innerText = motMasque;
  }
}

const preAffichage = (motNonMasque, clickedLetter)=>{
  //Fonction qui servira à détecter les diff positions de clickedLetter dans motNonMasque pour afficher 
  //chaque occurence de clickedLettre dans motMasque en appellant la fonction afficherLettre
  let posChar = -1;
  do {
    posChar = motNonMasque.indexOf(clickedLetter, posChar+1);
    if(posChar !== -1)
    {
      motMasque = afficherLettre(motMasque, posChar, clickedLetter);
    }
  } while (posChar !== motNonMasque.length-1 && posChar !== -1);
  motTrouve();
}

const afficherLettre = (motMasque, posChar, clickedLetter) =>{
  //Demasquer la lettre trouvée
  motMasque = setCharAt(motMasque, posChar, clickedLetter)
  //Ancrer la MAJ de motMasque dans l'HTML
  motMasqueH2.innerText = motMasque;
  return motMasque;
}

const motTrouve = () => {
  if(motMasque === motNonMasque)
  {
    Swal.fire({
        icon : "success",
        title: "Mot trouvé !",
        text: motNonMasque,
        confirmButtonColor: "#88e057",
    }).then(() => {
      finGame();
    })
    //LANCER LE PROCHAIN MOT
    for(lettre of tabLettres)
    {
      if(!lettre.className.includes("zombie"))
      {
        lettre.className = "lettre";
        lettre.addEventListener("click", handleClick);
      }
    }
    nbHeart = 10;
    for(heart of tabHearts)
    {
      heart.src = "./HeartMC/heartMC.png";
      heart.parentNode.className = "image";
    }
    doneLetters = [];
    nbMotTrouve++;
    numMot++;
    initMot();
  }
}

const motNonTrouve = () => {
    Swal.fire({
        icon : "error",
        title: "Le mot était : ",
        text: motNonMasque,
        confirmButtonColor: "#f27474",
        footer: `<a href="https://www.google.com/search?q=${motNonMasque}" target = "_blank">Définition du mot</a>`,
        customClass: {
          footer: 'footer-class'
        }
    }).then(() => {
      finGame()
    })
    //POUR LANCER LE PROCHAIN MOT
    for(lettre of tabLettres)
    {
      if(!lettre.className.includes("zombie"))
      {
        lettre.className = "lettre";
        lettre.addEventListener("click", handleClick);
      }
    }
    nbHeart = 10;
    for(heart of tabHearts)
    {
      heart.src = "./HeartMC/heartMC.png";
      heart.parentNode.className = "image";
    }
    doneLetters = [];
    numMot++;
    initMot();
  }

function setCharAt(str, index, char) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + char + str.substring(index+1);
  }

function isLetter(char){
  let alpha = Array.from(Array(26)).map((e, i) => i + 65);
  let alphabet = alpha.map((x) => String.fromCharCode(x));
  
  if(alphabet.includes(char))
    return true;
  else 
    return false;
}
