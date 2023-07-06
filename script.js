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
const testWord = document.getElementById("testWord");
const cate = document.querySelector(".cate");

//Input
const test = document.getElementById("test");

//Image
const img = document.getElementById("img");
const croix = document.querySelector(".croix");

//Erreurs
const fault = document.getElementById("fault");
const error = document.getElementById("error");

//Initialisation
let toggleWord = false;
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
  if (typeof arg === "string") return arg.length > 2 ? "s" : "";
  return arg > 1 ? "s" : "";
}

export function disableBtns() {
  [submit, test, indiceBtn, testWord].forEach((btn) => {
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
  removeAtt([submit, test, indiceBtn, testWord], "disabled");
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

function toggleWordBtn() {
  if (!toggleWord) {
    testWord.textContent = "Essayer 1 lettre";
    test.placeholder = "Notifier le mot voulu";
    test.setAttribute("maxlength", "20");
    toggleWord = true;
    test.focus();
  } else {
    testWord.textContent = "Essayer un mot";
    test.placeholder = "Notifier 1 lettre";
    test.setAttribute("maxlength", "1");
    toggleWord = false;
    test.focus();
  }
}

submit.addEventListener("click", () => {
  partie.search(test.value);
  test.value = "";
  if (partie.fault < 2) indiceBtn.setAttribute("disabled", "true");
});

test.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (toggleWord) {
      partie.tryWord(test.value.toLowerCase());
      toggleWordBtn();
    } else {
      partie.search(test.value);
    }
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
  cate.style.display = "none";
});

indiceBtn.addEventListener("click", () => {
  toogleBtn();
});

testWord.addEventListener("click", () => {
  toggleWordBtn();
});

//voir lorsqu'il reste que 2 essais et faire indice lettre ok
