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

  if (!arr || arr.length === 0) {
    listOfFilms.innerHTML = `
      <div class="zeroSearch">
        <div class="zeroMessage">Ничего не нашлось</div>
        <img src="img/photo_2026-03-13_23-11-37.jpg" alt="" class="imgZeroMessage">

      </div>
    `
  }

  arr.forEach((movie) => {
    const div = document.createElement("div");

    div.innerHTML = `
    
          <div class="cardOfFilm" data-id=${movie.imdbID}>
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

const modalClose = document.querySelector(".modalClose");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");

listOfFilms.addEventListener("click", async (e) => {
  if (e.target.closest('.cardOfFilm')) {
    const cardImdbID = e.target.closest('.cardOfFilm')

    const movie = await searchForMovieByID(cardImdbID);
    console.log(movie)
    renderModal(movie)
    showModal()


  }

});

function showModal() {
  overlay.style.display = "flex";
  modal.style.display = "block";

}

function closeModal() {
  overlay.style.display = "none"
  modal.style.display = "none"
}

overlay.addEventListener("click", (e) => {
  if (e.target.classList.contains("modalClose")) {
    closeModal()
  } else if (e.target === overlay) {
    closeModal()
  }
})

function renderModal(arr) {
  modal.innerHTML = "";
  const div = document.createElement("div");
  const rotTom = arr.Ratings.find(rating => rating.Source === "Rotten Tomatoes");
  const metacr = arr.Ratings.find(rating => rating.Source === "Metacritic");


  div.innerHTML = `

              <div class="modalCard">
                 <button class="modalClose">X</button>
              <div class="modalPosterOfFilm">
                <img src=${arr.Poster} alt="Poster">
              </div>

              <div class="modalInfo">
                <div class="modalNameOfFilm">${arr.Title}</div>
                <div class="modalAgeOfFilm">${arr.Year}</div>
                <div class="modalGrade">
                <hr>
                  <div>Рейтинги :</div>
                 <div> Rotten Tomatoes : ${rotTom ? rotTom.Value : "Нет данных"}</div>
                 <div> Metacritic : ${metacr ? metacr.Value : "Нет данных"}</div>
                </div>
              </div>
              <hr>
              <div class="modalStory">${arr.Plot}</div>
  `
  modal.append(div);
}

async function searchForMovieByID(imdbID) {
  let idSearch = `http://www.omdbapi.com/?i=${imdbID.dataset.id}&apikey=924627ad`
  const response = await fetch(idSearch);
  const data = await response.json();

  if (data.Response === "False") {
    return [];
  }

  return data
}
