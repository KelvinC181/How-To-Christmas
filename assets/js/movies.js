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
async function displayChristmasMovies(page = 1) {

  // Show loading spinner if not already showing
  const spinner = document.querySelector('.spinner');
  if (spinner) {
    spinner.classList.remove('d-none', 'spinner-hidden');
  }

  const movieRow = document.querySelector('#movieRow');
  const paginationContainer = document.querySelector('#pagination');
  const resultsPerPage = 9;
  
  if (!movieRow) {
    console.error('Movie row not found');
    return;
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${globalVars.api.apiKey}&language=en-US&sort_by=popularity.desc&with_keywords=207317&page=${page}&per_page=${resultsPerPage}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const movies = data.results.slice(0, resultsPerPage);
    movieRow.innerHTML = '';

    if (movies.length > 0) {
      movies.forEach(movie => {
        const movieImage = movie.poster_path !== null ? 
          `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
          'assets/img/movie-placeholder.webp';

        const movieCard = document.createElement('div');
        movieCard.classList.add('col-md-4', 'mb-4');

        movieCard.innerHTML = `
          <div class="movie-card card h-100 rounded shadow-lg">
            <img src="${movieImage}" class="card-img-top" alt="${movie.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bolder">${movie.title}</h5>
              <p class="card-text">Release Date: ${movie.release_date}</p>
              <p class="card-text pb-2">Rating: ${movie.vote_average}</p>
              <p class="mt-auto"><a href="movies/movie.html?id=${movie.id}" class="primary-btn p-2 text-decoration-none">View Details</a></p>
            </div>
          </div>
        `;

        movieRow.appendChild(movieCard);
      });

      const totalPages = Math.ceil(data.total_results / resultsPerPage);
      paginationContainer.innerHTML = `
        <button class="primary-btn px-3 py-2" ${page === 1 ? 'disabled' : ''} onclick="displayChristmasMovies(${page - 1})">Previous</button>
        <span class="mx-3">Page ${page} of ${totalPages}</span>
        <button class="primary-btn px-3 py-2" ${page === totalPages ? 'disabled' : ''} onclick="displayChristmasMovies(${page + 1})">Next</button>
      `;
        setTimeout(() => {
          const spinner = document.querySelector('.spinner');
          spinner.classList.add('spinner-hidden');
          setTimeout(() => {
              spinner.classList.add('d-none');
          }, 1000);
      }, 1000);
    }
  } catch (error) {
    console.error('Error:', error);
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