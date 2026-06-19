const mainForm = document.querySelector('.mainForm');
const mainInput = document.querySelector('.mainInput');
const listOfFilms = document.querySelector(".listOfFilms");
const arrOfFilms = ["Shrek", "The Amazing Digital Circus", "The Sopranos", "cats"]


window.addEventListener('load', async () => {
try {
const startFilms = await Promise.all(arrOfFilms.map(name => searchMovie(name)));

renderOfCards(startFilms.flat());
} catch(error) {
  console.log(error.message)
}
});

mainForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const searchNameOfFilm = mainInput.value;
  mainInput.value = "";

  showLoading("block");

  try {
    const movies = await searchMovie(searchNameOfFilm);
    
    renderOfCards(movies)
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


async function searchMovie(nameOfMovie) {

  const urlOfAPI = `http://www.omdbapi.com/?i=tt3896198&apikey=924627ad&s=${nameOfMovie}`;
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
