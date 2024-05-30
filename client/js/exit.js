document.getElementById('logout-button').addEventListener('click', function () {
  axios.post(`${baseURL}/api/logout`)
    .then(response => {
      console.log(response.data);
      window.location.href = "index.html";
    })
    .catch(error => {
      console.error(error);
    });
});