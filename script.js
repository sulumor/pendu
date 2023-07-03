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

//Initialisation
let r = 0;
let mots = await newWord();
let partie = mot();

function mot() {
  categorie.textContent = mots[r].categorie;
  return new pendu(mots[r].name.toLowerCase());
}

async function newWord() {
  const response = await fetch("https://trouve-mot.fr/api/random/10", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (response.ok === true) {
    return response.json().then((datas) => {
      return datas;
    });
  }
  const { MOTS } = await import("./modules/mots.js");
  let elements = [];
  for (let i = 0; i < 10; i++) {
    elements[i] = MOTS[Math.round(Math.random() * MOTS.length)];
  }
  return elements;
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
  document.getElementById("indiceP").textContent = `Il vous reste 10 essais`;
  categorie.removeAttribute("style");
  document.querySelector(".cate").removeAttribute("style");
  submit.removeAttribute("disabled");
  test.removeAttribute("disabled");
  addLetter.removeAttribute("disabled");
  indiceBtn.removeAttribute("disabled");
}

function toogleBtn() {
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
  r++;
  partie = mot();
  if (r === 9) {
    mots = await newWord();
    r = -1;
  }
});

addLetter.addEventListener("click", () => {
  partie.addLetter();
  if (error.textContent === "") {
    toogleBtn();
  }
});

addCategorie.addEventListener("click", () => {
  error.textContent = "";
  categorie.style.display = "block";
  partie.miss();
  toogleBtn();
  document.querySelector(".cate").style.display = "none";
});

indiceBtn.addEventListener("click", () => {
  toogleBtn();
});
