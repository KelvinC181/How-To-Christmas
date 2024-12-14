/** Create global variables .....
* This is against best practices but for the purpose of this project it is acceptable and likely
* unavoidable without overly complicating the code and adding unnecessary complexity
**/
const globalVars = {
  currentPage: window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1),
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'a635907d86ee5951aace63e75f36b55a',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

/**
 * Retrieve movie details from the API 
 * @returns {void}
 */
async function displayChristmasMovies() {
  const movieRow = document.querySelector('#movieRow'); // Get the movie row to append cards
  if (!movieRow) {
    console.error('Movie row not found');
    return;
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${globalVars.api.apiKey}&query=christmas`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      data.results.forEach(movie => {
        const movieImage = movie.poster_path !== null ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'assets/img/movie-placeholder.webp';

        const movieCard = document.createElement('div');
        movieCard.classList.add('col');

        movieCard.innerHTML = `
          <div class="movie-card card rounded shadow-lg">
            <img src="${movieImage}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
              <h5 class="card-title fw-bolder">${movie.title}</h5>
              <p class="card-text">Release Date: ${movie.release_date}</p>
              <p class="card-text pb-2">Rating: ${movie.vote_average}</p>
              <p><a href="movies/movie.html?id=${movie.id}" class="primary-btn p-2 text-decoration-none">View Details</a></p>
            </div>
          </div>
        `;

        movieRow.appendChild(movieCard);
        setTimeout(() => {
          const spinner = document.querySelector('.spinner');
          spinner.classList.add('spinner-hidden');
          setTimeout(() => {
              spinner.classList.add('d-none');
          }, 1000);
      }, 1000);

        
      });
    } else {
      movieRow.innerHTML = '<p>No movies found</p>';
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    movieRow.innerHTML = '<p>Error loading movies</p>';
  }
}


async function retrieveMovieDetails() {
  const movieId = new URLSearchParams(window.location.search).get('id');
  if (!movieId) {
    console.error('Movie ID not found');
    return;
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${globalVars.api.apiKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const movieDetails = document.querySelector('.movie-details');

    if (movieDetails) {
      const movieImage = data.backdrop_path !== null ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}` : '../assets/img/movie-placeholder.webp';
      const moviePoster  = data.poster_path !== null ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '../assets/img/movie-placeholder.webp';
      // set background image for the body
      document.body.style.backgroundImage = `url('${movieImage}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
      movieDetails.innerHTML = `
              <h1 class="text-white">${data.title}</h1>
              <img class="mb-3 img-fluid movie-img" src="${moviePoster}"
                alt="${data.title}"
              />
              <p class="text-white">${data.overview}</p>
              ${data.genres ? `<p class="text-white">Genres: ${data.genres.map(genre => genre.name).join(', ')}</p>` : ''}
              ${data.vote_average !== 0 ? `<p class="text-white">Rating: ${data.vote_average}</p>` : ''}
              ${data.release_date ? `<p class="text-white">Release Date: ${data.release_date}</p>` : ''}
              ${data.runtime ? `<p class="text-white">Runtime: ${data.runtime} minutes</p>` : ''}
              <p class="text-white">
                Revenue: ${data.revenue ? `$${addCommasToNumber(data.revenue)}` : 'No data available'}
              </p>
              <p class="text-white">
                Budget: ${data.budget ? `$${addCommasToNumber(data.budget)}` : 'No data available'}
              </p>
              <p class="text-white">Tagline: ${data.tagline}</p>
              <p class="text-white">Status: ${data.status}</p>
              <p class="text-white">
                ${data.homepage ? `Homepage: <a href="${data.homepage}" target="_blank">${data.homepage}</a></p>` : ''}
              <p class="mt-5"><a href="../movies/movies.html" class="primary-btn p-2 text-decoration-none">Back to Movies</a></p>
          `;
    }
  }
  catch (error) {
    console.error('Error fetching movie details:', error);
  }
}

/**
 * Switch to determine current page and call the appropriate function
 * @returns {void}
 */
function init() {
  console.log('Current page:', globalVars.currentPage);
  switch (globalVars.currentPage) {
    case 'movies.html':
      displayChristmasMovies();
      break;
    case 'movie.html':
      retrieveMovieDetails();
      break;
    default:
      break;
  }
}

/**
 * Add commas to a number
 * @param {Number} number - The number to add commas to
 * @returns {String} - The number with commas 
 **/
function addCommasToNumber(number) {
  if (!isNaN(number)) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return "NaN";
  }
}

document.addEventListener('DOMContentLoaded', init);