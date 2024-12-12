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

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
};

async function fetchAPIData(endpoint) {
  const API_KEY = globalVars.api.apiKey;
  const API_URL = globalVars.api.apiUrl;

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&languages=en-us`
  );
  const data = await response.json();
  return data;
}

/**
 * Initialise the appropriate code block based on the current page 
 **/
function init() {
  switch (globalVars.currentPage) {
    case '':
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