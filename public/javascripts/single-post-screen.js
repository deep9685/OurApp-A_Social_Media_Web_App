const deleteIcon = document.getElementById('deleteIcon');

    // Add click event listener to the delete icon
    deleteIcon.addEventListener('click', function() {
        // Show confirmation dialog

        const postId = deleteIcon.dataset.postId;

        const isConfirmed = confirm('Are you sure you want to delete this post?');
        
        // If user confirms deletion
        if (isConfirmed) {
            // Perform deletion action (replace this with your deletion logic)
            deletePost(postId);
        }
    });


     // Function to delete the post
     function deletePost(postId) {
        // Send a request to delete the post (replace this with your actual delete request)
        // Example using fetch API
        fetch(`/dashboard/${postId}`, {
            method: 'DELETE',
            // Additional options like headers or body can be added here
        })
        .then(response => {
            // Handle response accordingly
            if (response.ok) {
                // Post deleted successfully
                // Redirect to a different page or update UI as needed
                console.log("deleted");
                const userId = localStorage.getItem('loggedUserId');
                window.location.href = `/dashboard/profile/${userId}`;    
                // response.redirected("/dashboard/profile");
            } else {
                // Error occurred while deleting post
                // Handle error scenario
            }
        })
        .catch(error => {
            // Handle error scenario
            console.error   ('Error deleting post:', error);
        });
    }


    // For edit the post
const editIcon = document.getElementById('editIcon');

editIcon.addEventListener('click', function() {
    const postId = editIcon.dataset.postId;
    // Redirect to edit page with postId as query parameter
    window.location.href = `/dashboard/edit-post/${postId}`;
});
