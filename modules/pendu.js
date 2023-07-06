import { canvas } from "./canvas.js";
import { s, disableBtns } from "../script.js";

//Variables
let win = 0;
let play = 0;
let score = 0;

export class pendu {
  constructor(mot) {
    this.word = mot;
    this.fault = 10;
    this.letters = "";
    this.canvas = new canvas();
    this.show();
  }

  size() {
    return this.word.length;
  }

  search(lettre) {
    lettre = lettre.toLowerCase();
    this.letters += lettre + " ";
    document.getElementById("essais").textContent = `lettre${s(
      this.letters
    )} essayée${s(this.letters)} : ${this.letters}`;

    if (lettre === "e") lettre = "eéèê";
    if (lettre === "c") lettre = "cç";
    if (lettre === "u") lettre = "uù";
    if (lettre === "i") lettre = "iîï";
    if (lettre === "o") lettre = "oô";

    if (!new RegExp(`[${lettre}]`, "g").test(this.word)) {
      this.miss();
      return this.winOrLose();
    }

    for (let j = 0; j < lettre.length; j++) {
      for (let i = 0; i < this.size(); i++) {
        if (this.word[i] === lettre[j]) {
          reponse.childNodes[i].textContent = lettre[j];
        }
      }
    }
    this.winOrLose();
  }

  tryWord(w) {
    if (this.word !== w) {
      this.miss(3);
      return this.winOrLose();
    }
    this.show();
    this.win();
  }

  win() {
    win++;
    this.addPlay();
    disableBtns();
    score += this.fault * 10;
    document.getElementById("score").textContent = `Score : ${score}`;
    alert(`Vous avez gagné. Votre nouveau score : ${score}`);
  }

  lose() {
    this.addPlay();
    disableBtns();
    this.show();
    alert(`Vous avez perdu. Le mot recherché était ${this.word}`);
  }

  miss(repeat = 1) {
    let count = 0;
    while (count < repeat) {
      this.fault--;
      document.getElementById("fault").textContent = `reste ${
        this.fault
      } essai${s(this.fault)}`;
      document.getElementById("indiceP").textContent = `Il vous reste ${
        this.fault
      } essai${s(this.fault)}`;
      this.canvas.draw(this.fault);
      count++;
    }
  }

  show() {
    if (reponse.hasChildNodes()) {
      for (let i = 0; i < this.size(); i++) {
        reponse.childNodes[i].textContent = this.word[i];
      }
      return;
    }

    for (let i = 0; i < this.size(); i++) {
      let p = document.createElement("p");
      p.textContent = "_";
      reponse.append(p);
    }
  }

  reset() {
    if (!this.verification() && this.fault > 0) this.addPlay();
    this.canvas = new canvas();
  }

  addPlay() {
    play++;
    document.getElementById("parties").textContent = `${win} victoire${s(win)} 
        / ${play} partie${s(play)}`;
  }

  addLetter() {
    if (this.fault < 2)
      return (error.textContent = `Vous n'avez pas assez d'essais pour utiliser cette indice`);
    for (let i = 0; i < this.size(); i++) {
      if (reponse.childNodes[i].textContent === "_") {
        this.miss(2);
        this.search(this.word[i]);
        return;
      }
    }
  }

  verification() {
    for (let i = 0; i < this.size(); i++) {
      if (this.word[i] !== reponse.childNodes[i].textContent) return false;
    }
    return true;
  }

  winOrLose() {
    if (this.verification()) {
      return this.win();
    }
    if (this.fault <= 0) {
      return this.lose();
    }
  }
}
