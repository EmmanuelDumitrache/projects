document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("transactionForm");
    const tableBody = document.getElementById("table_body");

    // load transactions from localstorage when page loads
    loadTransactions();

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        // Get form values
        const date = document.getElementById("inputDate").value;
        const bought = document.getElementById("inputBought").value;
        const sold = document.getElementById("inputSold").value;
        const remaining = document.getElementById("inputRemaining").value;
        const crypto = document.getElementById("inputCrypto").value;
        const priceAtTime = document.getElementById("inputPriceAtTime").value;
        const roi = document.getElementById("inputROI").value;

        // Create new row
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${date}</td>
            <td>${bought}</td>
            <td>${sold}</td>
            <td>${remaining}</td>
            <td>${crypto}</td>
            <td>${priceAtTime}</td>
            <td>${roi}</td>
        `;

        // Append row to table
        tableBody.appendChild(newRow);

        // Reset form fields
        form.reset();
    });
});
