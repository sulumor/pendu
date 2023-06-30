import { MOTS } from "./modules/mots.js";
import { pendu } from "./modules/pendu.js";

//Espace texte
const reponse = document.getElementById("reponse");
const essais = document.getElementById("essais");
const categorie = document.getElementById("categorie");
const indices = document.getElementById("indices");

//Buttons
const submit = document.getElementById("testButton");
const newGame = document.getElementById("newGame");
const addLetter = document.getElementById("addLetter");
const addCategorie = document.getElementById("addCategorie");
const indiceBtn = document.getElementById("indiceBtn");

//Input
const test = document.getElementById("test");

//Image
const img = document.getElementById("img");

//Erreurs
const fault = document.getElementById("fault");
const error = document.getElementById("error");

let mot = await newWord();
let partie = new pendu(mot);

async function newWord() {
  return fetch("https://trouve-mot.fr/api/random/1").then((response) => {
    if (response.status === 200) {
      return response.json().then((data) => {
        categorie.innerText = data[0].categorie;
        return data[0].name;
      });
    }
    document.querySelector(".cate").style.display = "none";
    return MOTS[Math.round(Math.random() * MOTS.length)].toLowerCase();
  });
}

export function s(arg) {
  if (Array.isArray(arg)) return arg.length > 1 ? "s" : "";
  return arg > 1 ? "s" : "";
}

export function disableBtns() {
  submit.setAttribute("disabled", "true");
  test.setAttribute("disabled", "true");
  addLetter.setAttribute("disabled", "true");
  indiceBtn.setAttribute("disabled", "true");
}

function reboot() {
  while (reponse.firstChild) {
    reponse.removeChild(reponse.firstChild);
  }
  essais.textContent = "";
  fault.textContent = "";
  error.textContent = "";
  categorie.removeAttribute("style");
  submit.removeAttribute("disabled");
  test.removeAttribute("disabled");
  addLetter.removeAttribute("disabled");
  indiceBtn.removeAttribute("disabled");
}

submit.addEventListener("click", () => {
  partie.search(test.value);
  test.value = "";
});

test.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    partie.search(test.value);
    test.value = "";
    if (partie.fault < 2) indiceBtn.setAttribute("disabled", "true");
  }
});

newGame.addEventListener("click", async () => {
  partie.reset();
  reboot();
  mot = await newWord();
  partie = new pendu(mot);
});

addLetter.addEventListener("click", () => {
  partie.addLetter();
  if (error.textContent === "") {
    indices.removeAttribute("style");
  }
});

addCategorie.addEventListener("click", () => {
  error.textContent = "";
  categorie.style.display = "block";
  partie.miss();
  indices.removeAttribute("style");
});

indiceBtn.addEventListener("click", () => {
  if (indices.style.display === "block") {
    indices.removeAttribute("style");
    img.removeAttribute("style");
    indiceBtn.removeAttribute("style");
    document.querySelector(".croix").removeAttribute("style");
    error.textContent = "";
  } else {
    indices.style.display = "block";
    indiceBtn.style.backgroundColor = "red";
    document.querySelector(".croix").style.display = "block";
    img.style.display = "none";
  }
});
