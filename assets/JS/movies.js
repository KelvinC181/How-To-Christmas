const globalVars = {
  currentPage: window.location.pathname
}

async function displayChristmasMovies() {
  const movieContainer = document.querySelector('.movie-container');
  if (!movieContainer) {
      console.error('Movie container not found');
      return;
  }

  try {
      const apiKey = 'a635907d86ee5951aace63e75f36b55a';
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=christmas`);
      
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

function init() {
  console.log('Current page:', globalVars.currentPage); // Debug log
  if (globalVars.currentPage.includes('movies.html')) {
      displayChristmasMovies();
  }
}

document.addEventListener('DOMContentLoaded', init);