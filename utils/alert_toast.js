function showAlert(message, className) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className} mt-5 text-center`; // Bootstrap classes
    alertDiv.style.position = 'fixed'; // Fixed positioning
    alertDiv.style.top = '10%'; // Adjust position
    alertDiv.style.left = '50%'; // Center horizontally
    alertDiv.style.transform = 'translate(-50%, -10%)'; // Center using translate method
    alertDiv.style.zIndex = '1000'; // Higher z-index to ensure it's on top
    alertDiv.style.border = '2px solid black'; // Light gray border for a card-like look
    alertDiv.style.borderRadius = '10px'; // Rounded corners
    alertDiv.style.padding = '20px'; // Padding inside the card
    alertDiv.style.backgroundColor = '#fff'; // White background
    
    alertDiv.style.maxWidth = '600px'; // Maximum width
    alertDiv.style.textAlign = 'center'; // Center text
    alertDiv.style.whiteSpace='nowrap';

    // Add the message to the alert
    alertDiv.appendChild(document.createTextNode(message));
    document.body.appendChild(alertDiv);

    // Remove the alert after 3 seconds
    setTimeout(function () {
        alertDiv.remove();
    }, 3000);
}
