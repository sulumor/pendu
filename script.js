import { MOTS } from "./mots.js";

//Espace texte
const reponse = document.getElementById("reponse");
const essais = document.getElementById("essais");
const parties = document.getElementById("parties");

//Buttons
const submit = document.getElementById("testButton");
const newGame = document.getElementById("newGame");

//Input
const test = document.getElementById("test");

//Erreurs
const fault = document.getElementById("fault");

//Canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//Variables
let win = 0;
let play = 0;

class pendu {
  constructor() {
    this.word = MOTS[Math.floor(Math.random() * MOTS.length)]
      .toLowerCase()
      .replace(/ç/, "c")
      .replaceAll(/é|è/g, "e");
    this.play = this.init();
    this.fault = 10;
    this.character = [];
    this.show();
  }

  size() {
    return this.word.length;
  }

  init() {
    let arr = new Array(this.size());
    for (let i = 0; i < arr.length; i++) {
      arr[i] = "_";
    }
    return arr;
  }

  search(lettre) {
    lettre = lettre.toLowerCase();
    if (this.character.includes(lettre)) this.miss();
    this.character.push(lettre);
    let s = this.character.length > 1 ? "s" : "";
    essais.textContent = `lettre${s} essayée${s} : ${this.character.join(" ")}`;
    if (!this.word.includes(lettre)) {
      this.miss();
      return;
    }
    for (let i = 0; i < this.size(); i++) {
      if (this.word[i] === lettre) this.play.splice(i, 1, lettre);
    }
    this.show();
    this.win();
  }

  win() {
    if (this.word === this.play.join("")) {
      win++;
      play++;
      alert("Vous avez gagné");
      submit.setAttribute("disabled", "true");
      test.setAttribute("disabled", "true");
      parties.textContent = `${win} ${win > 1 ? "victoires" : "victoire"} 
      / ${play} ${play > 1 ? "parties" : "partie"}`;
    }
  }

  miss() {
    this.fault--;
    fault.textContent =
      this.fault === 1 ? "reste 1 essai" : `reste ${this.fault} essais`;
    this.draw(this.fault);

    if (this.fault === 0) {
      play++;
      alert(`Vous avez perdu. Le mot recherché était ${this.word}`);
      submit.setAttribute("disabled", "true");
      test.setAttribute("disabled", "true");
      parties.textContent = `${win} ${win > 1 ? "victoires" : "victoire"} 
      / ${play} ${play > 1 ? "parties" : "partie"}`;
    }
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
  }

  reset() {
    while (reponse.firstChild) {
      reponse.removeChild(reponse.firstChild);
    }
    ctx.clearRect(0, 0, 400, 200);
    essais.textContent = "";
    fault.textContent = "";
    submit.removeAttribute("disabled");
    test.removeAttribute("disabled");
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

let essai = new pendu();

submit.addEventListener("click", () => {
  essai.search(test.value);
  test.value = "";
});

test.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    essai.search(test.value);
    test.value = "";
  }
});

newGame.addEventListener("click", () => {
  essai.reset();
  essai = new pendu();
});
