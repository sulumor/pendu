import { pendu } from "./modules/pendu.js";

//Espace texte
const reponse = document.getElementById("reponse");
const essais = document.getElementById("essais");
const categorie = document.getElementById("categorie");
const indices = document.getElementById("indices");
const accents = document.getElementById("accents");

//Buttons
const newGame = document.getElementById("newGame");
const addLetter = document.getElementById("addLetter");
const addCategorie = document.getElementById("addCategorie");
const indiceBtn = document.getElementById("indiceBtn");
const cate = document.querySelector(".cate");
const switchLabel = document.getElementById("switch");

//Input
const test = document.getElementById("test");

//Image
const img = document.getElementById("img");
const croix = document.querySelector(".croix");

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
  /*const response = await fetch("https://trouve-mot.fr/api/random/10", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (response.ok === true) {
    return response.json().then((datas) => {
      return datas;
    });
  }*/
  const { MOTS } = await import("./modules/mots.js");
  let elements = [];
  for (let i = 0; i < 10; i++) {
    elements[i] = MOTS[Math.round(Math.random() * MOTS.length)];
  }
  return elements;
}

export function s(arg) {
  if (typeof arg === "string") return arg.length > 2 ? "s" : "";
  return arg > 1 ? "s" : "";
}

export function disableBtns() {
  [test, indiceBtn].forEach((btn) => {
    btn.setAttribute("disabled", "true");
  });
}

function removeAtt([...queries], att) {
  queries.forEach((query) => {
    query.removeAttribute(att);
  });
}

function removeText([...queries]) {
  queries.forEach((query) => {
    query.textContent = "";
  });
}

function reboot() {
  while (reponse.firstChild) {
    reponse.removeChild(reponse.firstChild);
  }
  removeText([essais, fault, error]);
  removeAtt([categorie, cate], "style");
  removeAtt([test, indiceBtn], "disabled");
  document.getElementById("indiceP").textContent = `Il vous reste 10 essais`;
}

function toogleBtn() {
  if (indices.style.display === "block") {
    removeAtt([indices, img, indiceBtn, croix], "style");
    error.textContent = "";
  } else {
    indices.style.display = "block";
    indiceBtn.style.backgroundColor = "red";
    document.querySelector(".croix").style.display = "block";
    img.style.display = "none";
  }
}

function switchWord() {
  if (switchLabel.checked) {
    test.placeholder = "Notifier le mot voulu";
    test.setAttribute("maxlength", "20");
    accents.style.display = "block";
  } else {
    test.placeholder = "Notifier une lettre";
    test.setAttribute("maxlength", "1");
    accents.removeAttribute("style");
  }
  test.focus();
}

test.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    switchLabel.checked
      ? partie.tryWord(test.value.toLowerCase())
      : partie.search(test.value);
    test.value = "";
    switchLabel.checked = false;
    switchWord();
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
  cate.style.display = "none";
});

indiceBtn.addEventListener("click", toogleBtn);

switchLabel.addEventListener("click", switchWord);
