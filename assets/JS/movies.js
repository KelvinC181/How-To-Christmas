/** Create global variables .....
* This is against best practices but for the purpose of this project it is acceptable and likely
* unavoidable without overly complicating the code and adding unnecessary complexity
**/
const globalVars = {
  currentPage: window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1),
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
  const movieContainer = document.querySelector('.movie-container');
  if (!movieContainer) {
      console.error('Movie container not found');
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
              const movieCard = document.createElement('div');
              movieCard.classList.add('movie-card');
              movieCard.classList.add('w-50');
              
              movieCard.innerHTML = `
                  <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                       alt="${movie.title}" 
                       onerror="this.src='placeholder.jpg'"/>
                  <h2>${movie.title}</h2>
                  <p>Release Date: ${movie.release_date}</p>
                  <p>Rating: ${movie.vote_average}</p>
                  <p><a href="movies/movie.html?id=${movie.id}">View Details</a></p>
              `;
              movieContainer.appendChild(movieCard);
          });
      } else {
          movieContainer.innerHTML = '<p>No movies found</p>';
      }
  } catch (error) {
      console.error('Error fetching movies:', error);
      movieContainer.innerHTML = '<p>Error loading movies</p>';
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
        // set background image for the body
        document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${data.backdrop_path}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
          movieDetails.innerHTML = `
              <h1 class="text-white">${data.title}</h1>
              <img src="https://image.tmdb.org/t/p/w500${data.poster_path}"
                    alt="${data.title}"
                    onerror="this.src='placeholder.jpg'"/>
              <p class="text-white">${data.overview}</p>
              <p class="text-white">Rating: ${data.vote_average}</p>
              <p class="text-white">Release Date: ${data.release_date}</p>
              <p class="text-white">Runtime: ${data.runtime} minutes</p>
              <p class="text-white">Revenue: $${addCommasToNumber(data.revenue)}</p>
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
  if(!isNaN(number)) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return "NaN";
  }
}

document.addEventListener('DOMContentLoaded', init);