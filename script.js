// This file can be used for any dynamic functionality.

// A simple example to show it's linked correctly.
console.log("Hello, EduDonate!");

// Example of an interactive feature:
// You could add a function here to handle a mobile menu toggle,
// form validation, or scroll-based animations.

document.addEventListener('DOMContentLoaded', () => {
    // This code will run after the page content is fully loaded.
    console.log("The page has finished loading.");

    // Donation form logic
    const donationForm = document.querySelector('.donation-form');
    if (donationForm) {
        const customAmountInput = document.getElementById('custom-amount-input');
        const donationAmountRadios = document.querySelectorAll('input[name="donation-amount"]');
        const impactRadios = document.querySelectorAll('input[name="impact"]');
        const amountTypeRadios = document.querySelectorAll('input[name="amount-type"]');
        const summaryAmount = document.querySelector('.donation-summary h4');
        const summaryDetails = document.querySelector('.summary-details');
        const finalAmountHidden = document.getElementById('final-amount');
        const impactAmount = document.querySelector('.donation-impact-text b');

        // Function to update summary
        function updateSummary() {
            const selectedImpact = document.querySelector('input[name="impact"]:checked').value;
            const selectedType = document.querySelector('input[name="amount-type"]:checked').value;
            const customValue = parseFloat(customAmountInput.value) || 0;
            const selectedAmountRadio = document.querySelector('input[name="donation-amount"]:checked');
            const presetValue = selectedAmountRadio ? parseFloat(selectedAmountRadio.value) : 0;
            const finalAmount = customValue > 0 ? customValue : presetValue;

            // Update hidden field
            finalAmountHidden.value = finalAmount;

            // Update display
            const impactText = selectedImpact.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const typeText = selectedType === 'monthly' ? '/month' : '';
            summaryAmount.textContent = `₹${finalAmount} ${typeText}`;
            summaryDetails.textContent = `${impactText} • ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Donation`;

            // Update impact text amount
            if (impactAmount) {
                impactAmount.textContent = `₹${finalAmount}`;
            }
        }

        // Event listeners
        customAmountInput.addEventListener('input', () => {
            if (customAmountInput.value) {
                // Uncheck preset radios
                donationAmountRadios.forEach(radio => radio.checked = false);
            }
            updateSummary();
        });

        donationAmountRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                customAmountInput.value = radio.value; // Fill custom input with selected amount
                updateSummary();
            });
        });

        impactRadios.forEach(radio => radio.addEventListener('change', updateSummary));
        amountTypeRadios.forEach(radio => radio.addEventListener('change', updateSummary));

        // Initial update
        updateSummary();

        // Form validation
        donationForm.addEventListener('submit', (e) => {
            const firstName = document.querySelector('input[name="first-name"]').value.trim();
            const email = document.querySelector('input[name="email"]').value.trim();
            const finalAmount = parseFloat(finalAmountHidden.value);

            if (!firstName || !email) {
                alert('Please fill in all required fields.');
                e.preventDefault();
                return;
            }
            if (finalAmount <= 0) {
                alert('Please select or enter a valid donation amount.');
                e.preventDefault();
                return;
            }
            
        });
    }
});

