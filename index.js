const fetchData = async () => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey:'3396a1a3',
      s: 'dart'
    }
  });
  console.log(response.data);
}