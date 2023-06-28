import { MOTS } from "./mots.js";

//Espace texte
const reponse = document.getElementById("reponse");
const essais = document.getElementById("essais");
const parties = document.getElementById("parties");

//Buttons
const submit = document.getElementById("testButton");
const newGame = document.getElementById("newGame");
const addLetter = document.getElementById("addLetter");

//Input
const test = document.getElementById("test");

//Erreurs
const fault = document.getElementById("fault");
const error = document.getElementById("error");

//Canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//Variables
let win = 0;
let play = 0;

class pendu {
  constructor() {
    this.word = MOTS[Math.round(Math.random() * MOTS.length)].toLowerCase();
    this.play = new Array(this.size()).fill("_");
    this.fault = 10;
    this.letters = [];
    this.show();
  }

  size() {
    return this.word.length;
  }

  search(lettre) {
    error.textContent = "";
    lettre = lettre.toLowerCase();
    this.letters.push(lettre);
    essais.textContent = `lettre${this.s(this.letters)} essayée${this.s(
      this.letters
    )} : ${this.letters.join(" ")}`;

    if (lettre === "e") lettre = "eéè";
    if (lettre === "c") lettre = "cç";

    if (!new RegExp(`[${lettre}]`, "g").test(this.word)) {
      this.miss();
      return;
    }

    for (let j = 0; j < lettre.length; j++) {
      for (let i = 0; i < this.size(); i++) {
        if (this.word[i] === lettre[j]) this.play.splice(i, 1, lettre[j]);
      }
    }

    this.show();
  }

  win() {
    if (this.word === this.play.join("")) {
      win++;
      this.disableBtns();
      alert("Vous avez gagné");
    }
  }

  lose() {
    if (this.fault === 0) {
      this.disableBtns();
      alert(`Vous avez perdu. Le mot recherché était ${this.word}`);
    }
  }

  miss() {
    this.fault--;
    fault.textContent = `reste ${this.fault} essai${this.s(this.fault)}`;
    this.draw(this.fault);

    if (this.word !== this.play.join("")) this.lose();
  }

  show() {
    if (reponse.hasChildNodes()) {
      while (reponse.firstChild) {
        reponse.removeChild(reponse.firstChild);
      }
    }
    for (let i = 0; i < this.size(); i++) {
      let p = document.createElement("p");
      p.textContent = this.play[i];
      reponse.append(p);
    }

    this.win();
    this.lose();
  }

  //? VOIR POUR FACTORISER

  reset() {
    if (this.word !== this.play.join("") && this.fault > 0) this.addPlay();
    while (reponse.firstChild) {
      reponse.removeChild(reponse.firstChild);
    }
    ctx.clearRect(0, 0, 400, 200);
    essais.textContent = "";
    fault.textContent = "";
    error.textContent = "";
    submit.removeAttribute("disabled");
    test.removeAttribute("disabled");
    addLetter.removeAttribute("disabled");
  }

  addPlay() {
    play++;
    parties.textContent = `${win} victoire${this.s(win)} 
      / ${play} partie${this.s(play)}`;
  }

  s(arg) {
    if (Array.isArray(arg)) return arg.length > 1 ? "s" : "";
    return arg > 1 ? "s" : "";
  }

  addLetter() {
    if (this.fault < 2)
      return (error.textContent = `Vous n'avez pas assez d'essais pour utiliser un indice`);
    for (let i = 0; i < this.size(); i++) {
      if (this.play[i] === "_") {
        this.search(this.word[i]);
        for (let j = 0; j < 2; j++) {
          this.miss();
        }
        return;
      }
    }
  }

  disableBtns() {
    this.addPlay();
    submit.setAttribute("disabled", "true");
    test.setAttribute("disabled", "true");
    addLetter.setAttribute("disabled", "true");
  }

  draw(nb) {
    switch (nb) {
      case 9:
        ctx.fillRect(50, 140, 200, 2);
        break;
      case 8:
        ctx.fillRect(90, 30, 3, 110);
        break;
      case 7:
        ctx.fillRect(90, 30, 100, 2);
        break;
      case 6:
        ctx.fillRect(190, 30, 3, 15);
        break;
      case 5:
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(192, 55, 10, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 4:
        ctx.fillRect(190, 65, 3, 35);
        break;
      case 3:
        ctx.fillRect(190, 75, 25, 2);
        break;
      case 2:
        ctx.moveTo(192, 100);
        ctx.lineTo(179, 110);
        ctx.stroke();
        break;
      case 1:
        ctx.fillRect(165, 75, 25, 2);
        break;
      case 0:
        ctx.moveTo(192, 100);
        ctx.lineTo(210, 110);
        ctx.stroke();
        break;
      default:
        break;
    }
  }
}

let partie = new pendu();

submit.addEventListener("click", () => {
  partie.search(test.value);
  test.value = "";
});

test.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    partie.search(test.value);
    test.value = "";
  }
});

newGame.addEventListener("click", () => {
  partie.reset();
  partie = new pendu();
});

addLetter.addEventListener("click", () => {
  partie.addLetter();
});
