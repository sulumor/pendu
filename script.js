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
const error = document.getElementById("error");
const fault = document.getElementById("fault");

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
      alert("Vous avez gagné");
    }
  }

  miss() {
    this.fault--;
    if (this.fault !== 0) {
      fault.textContent =
        this.fault === 1 ? "reste 1 essai" : `reste ${this.fault} essais`;
      return;
    }
    alert(`Vous avez perdu. Le mot recherché était ${this.word}`);
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
    play++;
    while (reponse.firstChild) {
      reponse.removeChild(reponse.firstChild);
    }
    essais.textContent = "";
    fault.textContent = "";
    parties.textContent = `${win} ${win.length > 1 ? "victoires" : "victoire"} 
      / ${play} ${play.length > 1 ? "parties" : "partie"}`;
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
