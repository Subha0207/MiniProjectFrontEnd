document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://localhost:7127/api/Booking/Admin/GetAllBookings';
    let token = localStorage.getItem('token'); // Retrieve token from local storage

    const rowsPerPage = 5;
    let currentPage = 1;
    let currentSort = '';

    const dataTableContainer = document.getElementById('dataTableContainer');
    const dataTable = document.getElementById('dataTable');
    const cardsContainer = document.getElementById('cardsContainer');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const notFoundFrame = document.getElementById('notFoundFrame');
    const blankPageFrame = document.getElementById('blankPageFrame');
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
            if (data.length==0){
                blankPageFrame.style.display = 'block';
            }
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

  

    async function renderTable(page, query = '') {
        const data = await fetchData();
        if (data.length === 0) {
            // Display blankpage.html as an iframe when API returns empty result
            const iframe = document.createElement('iframe');
            iframe.src = 'blankpage.html';
            iframe.style.width = '100%';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';

            // Hide other elements and display the iframe
            dataTableContainer.style.display = 'none';
            cardsContainer.style.display = 'none';
            notFoundFrame.style.display = 'none';
            blankPageFrame.style.display = 'block';
            blankPageFrame.innerHTML = '';
            blankPageFrame.appendChild(iframe);
            return;
        }
        let filteredData = filterData(data, query);

        if (filteredData.length === 0) {
            notFoundFrame.style.display = 'block';
            dataTableContainer.style.display = 'none';
            cardsContainer.style.display = 'none'; // Ensure cards are hidden if table is hidden
        } else {
            notFoundFrame.style.display = 'none';
            if (window.innerWidth >= 769) {
                dataTableContainer.style.display = 'block';
                cardsContainer.style.display = 'none';
            } else {
                dataTableContainer.style.display = 'none';
                cardsContainer.style.display = 'flex';
            }
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
                        <th>User ID</th>
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
                    <td>${row.userId}</td>
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
            renderTable(currentPage, searchInput.value);
        }
    });

    nextBtn.addEventListener('click', () => {
        fetchData().then(data => {
            const filteredData = filterData(data, searchInput.value);
            if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
                currentPage++;
                renderTable(currentPage, searchInput.value);
            }
        });
    });

    searchInput.addEventListener('input', () => {
        currentPage = 1; // Reset to first page when searching
        renderTable(currentPage, searchInput.value);
    });

  

    window.addEventListener('resize', () => {
        renderTable(currentPage, searchInput.value);
    });

    renderTable(currentPage);
});
