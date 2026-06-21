const mainForm = document.querySelector('.mainForm');
const mainInput = document.querySelector('.mainInput');
const mainLogo = document.querySelector(".mainLogo");
const listOfFilms = document.querySelector(".listOfFilms");
const arrOfFilms = ["Shrek", "The Amazing Digital Circus", "The Sopranos", "cats"]
const choiceMenu = document.querySelector('.choiceMenu')
const choiceFilms = document.querySelector('.choiceFilms');
const choiceSeries = document.querySelector('.choiceSeries');
let choiceType = "all";
let searchNameOfFilm = '';

window.addEventListener('load', updateCenter);

mainForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  searchNameOfFilm = mainInput.value;
  mainInput.value = "";

  showLoading("block");

  try {
    await updateCenter();
  }
  catch (error) {
    console.log(error.message);
    showError("block");

    setTimeout(() => {
      showError("")
    }, 3000);

  } finally {
    showLoading("")
  }

})


async function searchMovie(nameOfMovie, type) {
  let urlOfAPI = `http://www.omdbapi.com/?i=tt3896198&apikey=924627ad&s=${nameOfMovie}`;

  if (type !== "all") {
    urlOfAPI += `&type=${type}`
  }

  const response = await fetch(urlOfAPI);
  const data = await response.json();

  if (data.Response === "False") {
    return [];
  }

  return data.Search
}

function showLoading(display) {
  const loadingSearch = document.querySelector(".loadingSearch");
  loadingSearch.style.display = display;
}

function showError(display) {
  const errorSearch = document.querySelector(".errorSearch");
  errorSearch.style.display = display;
}

function renderOfCards(arr) {
  listOfFilms.innerHTML = "";

  arr.forEach((movie) => {
    const div = document.createElement("div");

    div.innerHTML = `
          <div class="cardOfFilm">
            <div class="posterOfFilm">
              <img src="${movie.Poster}" alt="Poster">
            </div>
            <div class="nameOfFilm">${movie.Title}</div>
            <div class="ageOfFilm">${movie.Year}</div>
          </div>
  `
    listOfFilms.append(div);
  })
}

choiceMenu.addEventListener("click", (e) => {
  if (e.target.classList.contains('choiceFilms')) {
    choiceType = "movie"
  } else if (e.target.classList.contains('choiceSeries')) {
    choiceType = "series"
  }

  updateCenter()
})

async function updateCenter() {
  let movies;
  if (searchNameOfFilm == "") {
    movies = (await Promise.all(arrOfFilms.map(name => searchMovie(name, choiceType)))).flat();
  } else {
    movies = await searchMovie(searchNameOfFilm, choiceType)
  }

  renderOfCards(movies)
}

mainLogo.addEventListener("click", () => {
  searchNameOfFilm = '';
  choiceType = "all";

  updateCenter();
})