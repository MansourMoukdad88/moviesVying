const autoCompleteConfig = {
  renderOption(movie){
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}">
    ${movie.Title} (${movie.Year})
    `;
  },
  onOptionSelect(movie) {
    document.querySelector('.mainBadge').classList.add('is-hidden')
    onMovieSelect(movie)
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey:'3396a1a3',
        s: searchTerm
      }
    });
    if(response.data.Error) {
      return [];
    }
    return response.data.Search;
  }
}

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.mainBadge').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
  }
})
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.mainBadge').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
  }
});

let leftMovie;
let rightMovie;

const onMovieSelect = async(movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey:'3396a1a3',
      i: movie.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);
  if(side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if(leftMovie && rightMovie) {
    runComparison()
  }
};

const runComparison = () => {
  console.log('Time for comparison');
};


const movieTemplate = (movieDetails) => {
  const dollars =  parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
  const metascore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
  
  const awards = movieDetails.Awards.split(' ').reduce((prev,word) => {
    const value = parseInt(word);
    if(isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0)
  console.log(awards);
  // console.log(dollars, metascore, imdbRating,imdbVotes);

  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetails.Poster}" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetails.Title}</h1>
        <h4>${movieDetails.Genre}</h4>
        <p>${movieDetails.Plot}</p>
      </div>
    </div>
  </article>

  <article class="notification is-primary">
    <p class="title">${movieDetails.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  
  <article class="notification is-primary">
    <p class="title">${movieDetails.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>

  <article class="notification is-primary">
    <p class="title">${movieDetails.Metascore}</p>
    <p class="subtitle">MetaScore</p>
  </article>

  <article class="notification is-primary">
    <p class="title">${movieDetails.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  
  <article class="notification is-primary">
    <p class="title">${movieDetails.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};