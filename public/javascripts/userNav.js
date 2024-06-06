document.getElementById("searchIcon").addEventListener("click", function () {
    const searchModal = document.getElementById("searchModal");
    // searchDiv.classList.remove('hidden');
    searchModal.classList.remove("hidden");
    searchModal.classList.add("flex");
  });

  document.getElementById("closeModal").addEventListener("click", function () {
    const searchModal = document.getElementById("searchModal");
    searchModal.classList.add("hidden");
  });

  document.getElementById('searchBar').addEventListener('input', function() {
    const query = this.value;

    if(query.length > 2){
        fetch(`/search?query=${query}`)
            .then(response => response.json())
                .then(data => {
                    const resultsDiv = document.getElementById('searchResults');
                    resultsDiv.innerHTML = '';
                    data.users.forEach(user => {
                        const userDiv = document.createElement('div');
                        userDiv.className = 'user-result border border-gray-300 p-2 rounded-md m-2 text-black';
                        userDiv.innerHTML = `<a href="/dashboard/profile/${user._id}"><p>${user.userName}</p></a>`;
                        resultsDiv.appendChild(userDiv);
                    });
                })
                .catch(error => {
                    console.error('Error searching users: ', error);
                });
    } else{
        document.getElementById('searchResults').innerHTML = ''; // Clear results if query is too short
    }
  });

  const profileLogo = document.getElementById('profileLogo');

  profileLogo.addEventListener('click', function() {

    const userId = localStorage.getItem('loggedUserId');

    if(userId){
        window.location.href = `/dashboard/profile/${userId}`;
    }
  });

  document.getElementById('OurAppLogo').addEventListener('click', function() {
    window.location.href = '/dashboard';
  });