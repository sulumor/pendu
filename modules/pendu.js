import { canvas } from "./canvas.js";
import { s, disableBtns } from "../script.js";

//Variables
let win = 0;
let play = 0;

export class pendu {
  constructor(mot) {
    this.word = mot;
    this.play = new Array(this.size()).fill("_");
    this.fault = 10;
    this.letters = [];
    this.canvas = new canvas();
    this.show();
  }

  size() {
    return this.word.length;
  }

  search(lettre) {
    lettre = lettre.toLowerCase();
    this.letters.push(lettre);
    document.getElementById("essais").textContent = `lettre${s(
      this.letters
    )} essayée${s(this.letters)} : ${this.letters.join(" ")}`;

    if (lettre === "e") lettre = "eéèê";
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
      this.addPlay();
      disableBtns();
      alert("Vous avez gagné");
    }
  }

  lose() {
    if (this.fault === 0) {
      this.addPlay();
      disableBtns();
      alert(`Vous avez perdu. Le mot recherché était ${this.word}`);
    }
  }

  miss() {
    this.fault--;
    document.getElementById("fault").textContent = `reste ${
      this.fault
    } essai${s(this.fault)}`;
    document.getElementById("indiceP").textContent = `Il vous reste ${
      this.fault
    } essai${s(this.fault)}`;
    this.canvas.draw(this.fault);

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

  reset() {
    if (this.word !== this.play.join("") && this.fault > 0) this.addPlay();
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
      if (this.play[i] === "_") {
        this.search(this.word[i]);
        for (let j = 0; j < 2; j++) {
          this.miss();
        }
        return;
      }
    }
  }
}
