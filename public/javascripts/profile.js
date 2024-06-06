document.addEventListener("DOMContentLoaded", async () => {
    const profileUserId = getUserIdFromURL();
    const followButton = document.getElementById("followButton");

    try {
      const response = await fetch(
        `/dashboard/is-following/${profileUserId}`
      );
      const data = await response.json();

      if (data.isFollowing) {
        followButton.textContent = "Unfollow-";
        followButton.classList.add("bg-red-600");
      } else {
        followButton.textContent = "Follow+";
        followButton.classList.add("bg-blue-600");
      }
    } catch (error) {
      console.error("Error adding followbutton text:", error);
    }

    const userPost = document.getElementById('userPost');
    const userFollower = document.getElementById('userFollower');
    const userFollowing = document.getElementById('userFollowing');
  
    const userPostDiv = document.getElementById('userPostDiv');
    const userFollowerDiv = document.getElementById('userFollowerDiv');
    const userFollowingDiv = document.getElementById('userFollowingDiv');
  
    userPost.addEventListener('click', function() {
      userFollowerDiv.classList.add('hidden');
      userFollower.classList.remove('shadow-sm', 'border-2', 'p-1');
      
      userFollowingDiv.classList.add('hidden');
      userFollowing.classList.remove('shadow-sm', 'border-2', 'p-1');
  
      userPostDiv.classList.remove('hidden');
      userPost.classList.add('shadow-sm', 'border-2', 'p-1');
    });
    
  
    userFollower.addEventListener('click', function() {
      userPostDiv.classList.add('hidden');
      userPost.classList.remove('shadow-sm','border-2','p-1');
      
      userFollowingDiv.classList.add('hidden');
      userFollowing.classList.remove('shadow-sm', 'border-2', 'p-1');
  
      userFollowerDiv.classList.remove('hidden');
      userFollower.classList.add('shadow-sm', 'border-2', 'p-1');
  
    });
  
    userFollowing.addEventListener('click', function() {
      userPostDiv.classList.add('hidden');
      userPost.classList.remove('shadow-sm', 'border-2', 'p-1');
  
      userFollowerDiv.classList.add('hidden');
      userFollower.classList.remove('shadow-sm', 'border-2', 'p-1');
  
      userFollowingDiv.classList.remove('hidden');
      userFollowing.classList.add('shadow-sm', 'border-2', 'p-1');
  
    });
  
  });

  const followButton = document.getElementById("followButton");

  // Function to extract user ID from the URL
  function getUserIdFromURL() {
    const urlParts = window.location.pathname.split("/");
    return urlParts[urlParts.length - 1];
  }

  followButton.addEventListener("click", function () {
    // const UserId = profileUser._id;
    // Extract user ID
    const UserId = getUserIdFromURL();
    console.log(UserId);

    if (followButton.innerText === "Follow+") {
      fetch(`/dashboard/follow/${UserId}`, { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            followButton.innerText = "Unfollow-";
            followButton.classList.add("bg-red-600");
            alert("You are following this user.");
          } else {
            alert("Error following user.");
          }
        })
        .catch((error) => {
          console.error("Error following user:", error);
        });
    } else {
      fetch(`/dashboard/unfollow/${UserId}`, { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            followButton.innerText = "Follow+";
            followButton.classList.add("bg-blue-600");
            alert("You are Un-following this user.");
          } else {
            alert("Error Un-following user.");
          }
        })
        .catch((error) => {
          console.error("Error Un-following user:", error);
        });
    }
  });


  
