const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey:'3396a1a3',
      s: searchTerm
    }
  });
  if(response.data.Error) {
    return [];
  }
  // console.log(response.data.Search[0].imdbID);
  
  return response.data.Search;
}

const root = document.querySelector('#autocomplete');
root.innerHTML = `
  <label><b>Search for a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async event => {
  const movies = await fetchData(event.target.value);

  if(!movies.length) {  // to close the dropdown in case it's empty
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML = "";
  dropdown.classList.add('is-active');

  for(let movie of movies) {
    // console.log(movie.imdbID); 

    const option = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    option.classList.add('dropdown-item')
    option.innerHTML = `
    <img src="${imgSrc}">
    ${movie.Title}
    `;

    option.addEventListener('click', ()=> {
      dropdown.classList.remove('is-active');
      input.value = movie.Title;
      // console.log("movie details", movie);

      onMovieSelect(movie)
    })
    
    resultsWrapper.appendChild(option)
  }
}

input.addEventListener('input', debounce(onInput, 500));
document.addEventListener('click', event => {
  if(!root.contains(event.target)) {
    dropdown.classList.remove('is-active')
    // input.value = " "  // Clear the input if we click out of dropdown
  }
})

const onMovieSelect = async(movie) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey:'3396a1a3',
      i: movie.imdbID
    }
  });
  console.log(response.data);
  
}