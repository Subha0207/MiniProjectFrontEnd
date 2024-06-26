document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.step');
    const contents = document.querySelectorAll('.step-content');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const finishBtn = document.getElementById('finish-btn');
    const filterIcon = document.getElementById('filter-icon');
    const leftContainer = document.getElementById('left-container');
    function setActiveStep(step) {
        steps.forEach((elem) => {
            elem.classList.remove('active');
            elem.classList.remove('completed');
            if (parseInt(elem.getAttribute('data-step')) < step) {
                elem.classList.add('completed');
            }
            if (parseInt(elem.getAttribute('data-step')) === step) {
                elem.classList.add('active');
            }
        });
    
        contents.forEach((elem) => {
            elem.classList.remove('active');
            if (parseInt(elem.getAttribute('data-step')) === step) {
                elem.classList.add('active');
            }
        });
        // Show the filter icon only for step 1
        if (step === 1) {
            filterIcon.style.display = 'flex';
        } else {
            filterIcon.style.display = 'none';
        }
        if (step === 2 && window.innerWidth >= 900) {
            leftContainer.style.display = 'none';
        } else {
            leftContainer.style.display = 'flex';
        }
    
        // Retrieve flight details for step 2
        if (step === 2) {
            const selectedFlight = JSON.parse(localStorage.getItem('selectedFlight'));
            if (selectedFlight) {
                displaySelectedFlightDetails(selectedFlight);
            }
        }
    }
    
    prevBtn.addEventListener('click', function () {
        setActiveStep(1);
    });
    
    nextBtn.addEventListener('click', function () {
        // Get the selected flight details
        const selectedFlightId = document.querySelector('input[name="flight"]:checked').value;
        const selectedFlight = allFlights.find(flight => flight.FlightId === selectedFlightId);
        localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
    
        setActiveStep(2);
    });
    
    finishBtn.addEventListener('click', function () {
        alert('Booking process completed!');
        setActiveStep(1);
        localStorage.removeItem('selectedFlight'); // Clear the selected flight details after booking is completed
    });
    
    async function displayFlights(flights) {
        const flightCardsContainer = document.getElementById('flight-cards');
        flightCardsContainer.innerHTML = ''; // Clear previous cards
    
        try {
            const allFlights = Object.values(flights).flat(); // Flatten arrays of flights
    
            for (const [index, flight] of allFlights.entries()) {
                const flightName = await fetchFlightName(flight.FlightId);
    
                const flightCard = document.createElement('label');
                flightCard.classList.add('flight-card');
                flightCard.htmlFor = `flight-${index}`;
    
                const duration = calculateDuration(flight.ArrivalDateTime, flight.DepartureDateTime);
    
                flightCard.innerHTML = `
                    <input type="radio" name="flight" id="flight-${index}" value="${flight.FlightId}">
                    <div class="flight-content">
                        <div class="flight-header">
                            <h3>${flightName}</h3>
                            <span><strong>Flight ID:</strong> ${flight.FlightId}</span>
                        </div>
                        <div class="flight-details">
                            <div class="flight-times">
                                <div class="time">
                                    <strong>Departure Details:</strong>
                                    <p>${flight.DepartureLocation}</p>
                                    <p>${new Date(flight.DepartureDateTime).toLocaleDateString()}</p>
                                    <p>${new Date(flight.DepartureDateTime).toLocaleTimeString()}</p>
                                </div>
                                <div class="duration-container">
                                    <p class="duration-text"><strong>Duration:</strong> ${duration}</p>
                                </div>
                                <div class="time">
                                    <strong>Arrival Details:</strong>
                                    <p>${flight.ArrivalLocation}</p>
                                    <p>${new Date(flight.ArrivalDateTime).toLocaleDateString()}</p>
                                    <p>${new Date(flight.ArrivalDateTime).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div class="other-info">
                                <p><strong>Seats Available:</strong> ${flight.SeatsAvailable}</p>
                                <p><strong>Price Per Person:</strong> ${flight.PricePerPerson}</p>
                            </div>
                        </div>
                    </div>
                `;
    
                flightCardsContainer.appendChild(flightCard);
            }
        } catch (error) {
            console.error('Error displaying flights:', error);
        }
    }
    
    function displaySelectedFlightDetails(flight) {
        const selectedFlightDetailsContainer = document.getElementById('selected-flight-details');
        selectedFlightDetailsContainer.innerHTML = `
            <h3>Selected Flight</h3>
            <p><strong>Flight ID:</strong> ${flight.FlightId}</p>
            <p><strong>Flight Name:</strong> ${flight.FlightName}</p>
            <p><strong>Departure Location:</strong> ${flight.DepartureLocation}</p>
            <p><strong>Departure Time:</strong> ${new Date(flight.DepartureDateTime).toLocaleString()}</p>
            <p><strong>Arrival Location:</strong> ${flight.ArrivalLocation}</p>
            <p><strong>Arrival Time:</strong> ${new Date(flight.ArrivalDateTime).toLocaleString()}</p>
            <p><strong>Seats Available:</strong> ${flight.SeatsAvailable}</p>
            <p><strong>Price Per Person:</strong> ${flight.PricePerPerson}</p>
        `;
    }
    
    async function fetchFlights() {
        try {
            const response = await fetch('https://localhost:7127/api/Flight/GetAllDirectFlights');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const flights = await response.json();

            displayFlights(flights);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    async function fetchFlightName(flightId) {
        try {
            const response = await fetch(`https://localhost:7127/api/Flight/GetFlight/${flightId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const flightDetails = await response.json();
            return flightDetails.flightName;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return 'Unknown';
        }
    }

   
    function calculateDuration(arrivalDateTime, departureDateTime) {
        var arrivalTime = new Date(arrivalDateTime);
        var departureTime = new Date(departureDateTime);
        var durationMs = arrivalTime.getTime() - departureTime.getTime();

        var durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
        var durationHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        var durationString = "";
        if (durationDays > 0) {
            durationString += durationDays + "d ";
        }
        if (durationHours > 0) {
            durationString += durationHours + "h ";
        }
        if (durationMinutes > 0) {
            durationString += durationMinutes + "m";
        }

        return durationString.trim();
    }

    fetchFlights();
});
document.addEventListener('DOMContentLoaded', function () {
    const boxes = document.querySelectorAll('.box');

    boxes.forEach(box => {
        box.addEventListener('click', function () {
            this.classList.toggle('selected');
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://localhost:7127/api/Flight/GetAllFlights')
        .then(response => response.json())
        .then(data => {
            const flightList = document.getElementById('flight-list');
            const uniqueFlights = [];

            data.forEach(flight => {
                if (!uniqueFlights.some(f => f.flightId === flight.flightId)) {
                    uniqueFlights.push(flight);
                }
            });

            uniqueFlights.forEach(flight => {
                const flightItem = document.createElement('div');
                flightItem.className = 'flight-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `flight-${flight.flightId}`;
                checkbox.name = 'flights';
                checkbox.value = flight.flightId;

                const label = document.createElement('label');
                label.htmlFor = `flight-${flight.flightId}`;
                label.textContent = `${flight.flightName} (Seats: ${flight.seatCapacity})`;

                flightItem.appendChild(checkbox);
                flightItem.appendChild(label);
                flightList.appendChild(flightItem);
            });
        })
        .catch(error => console.error('Error fetching flight data:', error));
});




$(function () {
    // Function to fetch data from the API
    function fetchFlightCosts() {
        return $.ajax({
            url: "https://localhost:7127/api/Route/FlightCost",
            method: "GET",
            dataType: "json"
        });
    }

    // Initialize the slider after fetching data
    fetchFlightCosts().done(function (data) {
        // Assuming data is an array of flight costs
        let sortedData = data.sort((a, b) => a - b);
        let minVal = sortedData[0];
        let maxVal = sortedData[sortedData.length - 1];

        $("#min-value").text("$" + minVal);
        $("#max-value").text("$" + maxVal);

        $("#slider-range").slider({
            range: true,
            min: minVal,
            max: maxVal,
            values: [minVal, maxVal],
            slide: function (event, ui) {
                $("#min-amount").text("Min: Rs. " + ui.values[0]);
                $("#max-amount").text("Max: Rs. " + ui.values[1]);
            }
        });

        $("#min-amount").text("Min: Rs. " + $("#slider-range").slider("values", 0));
        $("#max-amount").text("Max: Rs. " + $("#slider-range").slider("values", 1));
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Failed to fetch flight costs: ", textStatus, errorThrown);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const leftContainer = document.getElementById('left-container');
    const floatingIcon = document.getElementById('filter-icon');

    floatingIcon.addEventListener('click', function () {
        leftContainer.classList.toggle('open');
    });
});



