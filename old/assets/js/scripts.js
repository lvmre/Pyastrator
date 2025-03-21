/**
 * Pyastrator - Main JavaScript File
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data if needed
    loadInitialData();
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Example: Toggle navigation on mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('nav-open');
        });
    }

    // Example: Form submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

/**
 * Handle form submissions
 * @param {Event} event - The form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    
    // Example AJAX submission
    fetch(event.target.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle successful response
        showNotification('Success', 'Your request was processed successfully');
    })
    .catch(error => {
        // Handle error
        showNotification('Error', 'There was a problem processing your request');
        console.error('Submission error:', error);
    });
}

/**
 * Load initial data for the application
 */
function loadInitialData() {
    // Example: Fetch data from an API
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            // Process the data
            updateUI(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
}

/**
 * Update the UI with data
 * @param {Object} data - The data to display
 */
function updateUI(data) {
    // Example: Update content based on data
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer && data) {
        // Process and display data
        // This would depend on your specific application needs
    }
}

/**
 * Display a notification to the user
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 */
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <h4>${title}</h4>
        <p>${message}</p>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}