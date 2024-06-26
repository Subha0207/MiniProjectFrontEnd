function toggleMenu() {
    var menu = document.querySelector('.nav-menu');
    menu.classList.toggle('active');
}

function closeMenu() {
    var menu = document.querySelector('.nav-menu');
    menu.classList.remove('active');
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
});



// Function to get the current user ID (implement this according to your application's logic)
function getCurrentUserId() {
    // Example: Assuming the user ID is stored in a cookie or local storage
    return localStorage.getItem('userId');  // Replace with your actual logic
}

document.addEventListener("DOMContentLoaded", function () {
    // Fetch departure locations
    fetch('https://localhost:7127/api/Route/departure-locations')
        .then(response => response.json())
        .then(locations => {
            // Sort locations alphabetically
            locations.sort();
            // Populate dropdown
            const departureDropdown = document.getElementById('departureLocations');
            // Clear existing options
            departureDropdown.innerHTML = '';
            // Add default option
            let defaultOption = document.createElement('option');
            defaultOption.text = 'From Location';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            departureDropdown.add(defaultOption);
            // Add fetched locations
            locations.forEach(location => {
                let option = document.createElement('option');
                option.text = location;
                departureDropdown.add(option);
            });
        })
        .catch(error => console.error('Error fetching departure locations:', error));

    // Fetch arrival locations
    fetch('https://localhost:7127/api/Route/arrival-locations')
        .then(response => response.json())
        .then(locations => {
            // Sort locations alphabetically
            locations.sort();
            // Populate dropdown
            const arrivalDropdown = document.getElementById('arrivalLocations');
            // Clear existing options
            arrivalDropdown.innerHTML = '';
            // Add default option
            let defaultOption = document.createElement('option');
            defaultOption.text = 'To Location';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            arrivalDropdown.add(defaultOption);
            // Add fetched locations
            locations.forEach(location => {
                let option = document.createElement('option');
                option.text = location;
                arrivalDropdown.add(option);
            });
        })
        .catch(error => console.error('Error fetching arrival locations:', error));
});

