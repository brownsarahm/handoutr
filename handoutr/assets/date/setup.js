const dateInput = document.querySelector('input[type="date"]');
const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
dateInput.value = today;