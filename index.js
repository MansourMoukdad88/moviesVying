const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey:'3396a1a3',
      s: searchTerm
    }
  });
  console.log(response.data);
}

const input = document.querySelector('input');


const onInput = (event)=> {
  fetchData(event.target.value);
}

input.addEventListener('input', debounce(onInput, 500));