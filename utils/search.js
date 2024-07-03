// Function to handle search input
function handleSearchInput(placeholder, tableId) {
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');

    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', placeholder);
    searchInput.classList.add('search-input');
    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll(`#${tableId} tbody tr`);
        let hasVisibleRows = false;

        rows.forEach(row => {
            let rowContainsSearchValue = false;
            Array.from(row.children).forEach(cell => {
                const cellText = cell.textContent.trim().toLowerCase();
                if (cellText.includes(searchValue)) {
                    rowContainsSearchValue = true;
                }
            });

            if (rowContainsSearchValue) {
                row.style.display = ''; // Show row if search value matches any cell
                hasVisibleRows = true;
            } else {
                row.style.display = 'none'; // Hide row if search value does not match any cell
            }
        });

        const notFoundFrame = document.getElementById('notFoundFrame');
        const table = document.getElementById(tableId);
        if (!hasVisibleRows) {
            if (notFoundFrame) {
                notFoundFrame.style.display = 'block';
            }
            table.style.display = 'none';
        } else {
            if (notFoundFrame) {
                notFoundFrame.style.display = 'none';
            }
            table.style.display = 'table';
        }
    });

    searchContainer.appendChild(searchInput);
    return searchContainer;
}
