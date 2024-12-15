document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prevGifts');
  const nextBtn = document.getElementById('nextGifts');
  let currentPage = 1;
  
  const ETSY_API_KEY = 'l797zxxf5y0ensp9h58r9whh';
  const ITEMS_PER_PAGE = 3;

  async function getEtsyData(page = 1) {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const url = `https://openapi.etsy.com/v3/application/listings/active?api_key=${ETSY_API_KEY}&limit=${ITEMS_PER_PAGE}&offset=${offset}&keywords=Christmas gifts novelty`;

      try {
          const response = await fetch(url, {
              headers: {
                  'x-api-key': ETSY_API_KEY,
                  'Accept': 'application/json'
              }
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          displayData(data);
          updatePaginationButtons(data.count);
      } catch (error) {
          console.error('Error fetching Etsy data:', error);
      }
  }

  function displayData(data) {
      const giftsRow = document.getElementById('test');
      if (!giftsRow) {
          console.error('Gifts row not found');
          return;
      }

      giftsRow.innerHTML = '';
      
      data.results.forEach(product => {
          const productDiv = document.createElement('div');
          productDiv.className = 'col-md-4 mb-4';
          productDiv.innerHTML = `
              <div class="card">
                  <img src="${product.images?.[0]?.url_570xN || ''}" class="card-img-top" alt="${product.title}">
                  <div class="card-body">
                      <h5 class="card-title">${product.title}</h5>
                      <p class="card-text">Price: ${product.price.amount / product.price.divisor} ${product.price.currency_code}</p>
                      <a href="${product.url}" target="_blank" class="btn btn-primary">View on Etsy</a>
                  </div>
              </div>
          `;
          giftsRow.appendChild(productDiv);
      });
  }

  function updatePaginationButtons(totalCount) {
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
  }

  prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
          currentPage--;
          getEtsyData(currentPage);
      }
  });

  nextBtn.addEventListener('click', () => {
      currentPage++;
      getEtsyData(currentPage);
  });

  // Initial load
  getEtsyData(currentPage);
});