
document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://localhost:7127/api/Booking/Admin/GetAllBookings';
    let token = localStorage.getItem('token'); // Retrieve token from local storage

    const rowsPerPage = 5;
    let currentPage = 1;
    let currentSort = '';

    const dataTableContainer = document.getElementById('dataTableContainer');
    const cardsContainer = document.getElementById('cardsContainer');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    async function fetchData() {
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    function filterData(data, query) {
        return data.filter(row => {
            return (
                row.bookingId.toString().toLowerCase().includes(query.toLowerCase()) ||
                row.flightId.toString().toLowerCase().includes(query.toLowerCase()) ||
                row.routeId.toString().toLowerCase().includes(query.toLowerCase()) ||
                row.noOfPersons.toString().toLowerCase().includes(query.toLowerCase()) ||
                row.totalAmount.toString().toLowerCase().includes(query.toLowerCase())
            );
        });
    }

    function sortData(data, sortBy) {
        if (sortBy === 'flightId') {
            return data.sort((a, b) => a.flightId - b.flightId);
        } else if (sortBy === 'bookingId') {
            return data.sort((a, b) => a.bookingId - b.bookingId);
        } else if (sortBy === 'noOfPersons') {
            return data.sort((a, b) => a.noOfPersons - b.noOfPersons);
        } else if (sortBy === 'routeId') {
            return data.sort((a, b) => a.routeId - b.routeId);
        } else if (sortBy === 'totalAmount') {
            return data.sort((a, b) => a.totalAmount - b.totalAmount);
        } else {
            return data; // No sorting
        }
    }

    async function renderTable(page, query = '', sortBy = '') {
        const data = await fetchData();
        let filteredData = filterData(data, query);

        if (sortBy) {
            filteredData = sortData(filteredData, sortBy);
            currentSort = sortBy;
        } else if (currentSort) {
            filteredData = sortData(filteredData, currentSort);
        }

        dataTableContainer.innerHTML = ''; // Clear previous table content
        cardsContainer.innerHTML = ''; // Clear previous card content

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = filteredData.slice(start, end);

        if (window.innerWidth >= 769) {
            // Display table on large screens
            dataTableContainer.style.display = 'block';
            cardsContainer.style.display = 'none';

            const table = document.createElement('table');
            table.id = 'dataTable';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Flight ID</th>
                        <th>Route ID</th>
                        <th>No. of Persons</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Data rows will be inserted here dynamically -->
                </tbody>
            `;

            dataTableContainer.appendChild(table);
            const tbody = table.querySelector('tbody');

            pageData.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.bookingId}</td>
                    <td>${row.flightId}</td>
                    <td>${row.routeId}</td>
                    <td>${row.noOfPersons}</td>
                    <td>${row.totalAmount}</td>
                `;
               
                tbody.appendChild(tr);
            });

        } else {
            // Display cards on small screens
            dataTableContainer.style.display = 'none';
            cardsContainer.style.display = 'flex';

            pageData.forEach(row => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <div class="card-details">
                        <strong>Booking ID:</strong> ${row.bookingId}<br>
                        <strong>Flight ID:</strong> ${row.flightId}<br>
                        <strong>Route ID:</strong> ${row.routeId}<br>
                        <strong>No. of Persons:</strong> ${row.noOfPersons}<br>
                        <strong>Total Amount:</strong> ${row.totalAmount}
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
        }

        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredData.length / rowsPerPage)}`;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === Math.ceil(filteredData.length / rowsPerPage);
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(currentPage, searchInput.value, currentSort);
        }
    });

    nextBtn.addEventListener('click', () => {
        fetchData().then(data => {
            const filteredData = filterData(data, searchInput.value);
            if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
                currentPage++;
                renderTable(currentPage, searchInput.value, currentSort);
            }
        });
    });

    searchInput.addEventListener('input', () => {
        currentPage = 1; // Reset to first page when searching
        renderTable(currentPage, searchInput.value, currentSort);
    });

    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        renderTable(currentPage, searchInput.value, sortBy);
    });

    window.addEventListener('resize', () => {
        renderTable(currentPage, searchInput.value, currentSort);
    });

    renderTable(currentPage);
});
