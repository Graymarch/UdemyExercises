function deletePost() {
    function deleteItem(postIndex) {
        if (confirm("Are you sure?")) {
            // Send native DELETE request via Fetch API
            fetch(`/delete?postIndex=${postIndex}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    location.reload(); // Refresh to update UI
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }
}