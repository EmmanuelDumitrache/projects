document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("transactionForm");
    const tableBody = document.getElementById("table_body");
    const roiChartElement = document.getElementById("roiChart");
    let roiChartCanvas;
    let roiChart; // Store the chart instance

    // Ensure Canvas Exists for Chart.js
    if (roiChartElement) {
        roiChartCanvas = roiChartElement.getContext("2d");
    } else {
        console.error("Chart canvas not found!");
    }

    // Load transactions from localStorage when page loads
    loadTransactions();
    updateChart(); // Generate the chart on page load

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload
    
        // Get form values
        const date = document.getElementById("inputDate").value;
        const bought = parseFloat(document.getElementById("inputBought").value);
        const sold = parseFloat(document.getElementById("inputSold").value);
        const remaining = parseFloat(document.getElementById("inputRemaining").value);
        const crypto = document.getElementById("inputCrypto").value;
        const buyPrice = parseFloat(document.getElementById("inputPriceAtTime").value);
        const sellPrice = parseFloat(document.getElementById("inputSoldPrice").value);

        // Error Handling - Validation
        if (!date || isNaN(bought) || isNaN(sold) || isNaN(remaining) || isNaN(buyPrice) || isNaN(sellPrice)) {
            alert("Please enter valid numerical values in all fields.");
            return;
        }

        if (bought < 0 || sold < 0 || remaining < 0 || buyPrice <= 0 || sellPrice <= 0) {
            alert("Values must be positive numbers. Buy Price must be greater than 0.");
            return;
        }

        if (sellPrice < buyPrice) {
            alert("Warning: Sell Price is lower than Buy Price. ROI will be negative.");
        }

        // Calculate ROI %
        const roi = ((sellPrice - buyPrice) / buyPrice) * 100;
        const roiFormatted = roi.toFixed(2) + "%"; // Round to 2 decimal places

        // Create transaction object
        const transaction = { date, bought, sold, remaining, crypto, buyPrice, sellPrice, roi: roiFormatted };

        // Save transaction in localStorage
        saveTransaction(transaction);

        // Add transaction to the table
        addTransactionToTable(transaction);

        // Update the ROI Chart
        updateChart();

        // Reset form fields
        form.reset();
    });

    function saveTransaction(transaction) {
        let transactions = JSON.parse(localStorage.getItem("transactions")) || []; // Get stored transactions or create an empty array
        transactions.push(transaction); // Add new transaction
        localStorage.setItem("transactions", JSON.stringify(transactions)); // Save back to localStorage
    }

    function loadTransactions() {
        let transactions = JSON.parse(localStorage.getItem("transactions")) || []; // Get saved transactions
        transactions.forEach(transaction => addTransactionToTable(transaction)); // Display them in table
    }

    function addTransactionToTable(transaction) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.bought}</td>
            <td>${transaction.sold}</td>
            <td>${transaction.remaining}</td>
            <td>${transaction.crypto}</td>
            <td>$${transaction.buyPrice}</td>
            <td>$${transaction.sellPrice}</td>
            <td>${transaction.roi}</td>
        `;
        tableBody.appendChild(newRow);
    }

    // Function to extract ROI data and update the Chart
    function updateChart() {
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

        // Extract Dates & ROI values
        const dates = transactions.map(t => t.date);
        const roiValues = transactions.map(t => (t.roi ? parseFloat(t.roi.replace("%", "")) : 0));

        console.log("Chart Data:", { dates, roiValues });

        // Check if canvas exists before trying to create the chart
        if (!roiChartCanvas) {
            console.error("Chart.js: Canvas context not found!");
            return;
        }

        // Destroy previous chart instance if it exists
        if (roiChart) {
            roiChart.destroy();
        }

        // Create new ROI Chart
        roiChart = new Chart(roiChartCanvas, {
            type: "line",
            data: {
                labels: dates,
                datasets: [{
                    label: "ROI % 🚀",
                    data: roiValues,
                    borderColor: "blue",
                    borderWidth: 3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false // Allow negative ROI values
                    }
                }
            }
        });
    }
});
