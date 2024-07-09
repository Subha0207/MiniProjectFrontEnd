document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.step');
    const contents = document.querySelectorAll('.step-content');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const finishBtn = document.getElementById('finish-btn');
    const filterIcon = document.getElementById('floating-icon');
    const leftContainer = document.getElementById('left-container');
    const notFoundFrame = document.getElementById('notFoundFrame');
    const storedDepartureLocation = localStorage.getItem('departureLocation');
    const storedArrivalLocation = localStorage.getItem('arrivalLocation');

    let allFlights = [];


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
        filterIcon.style.display = step === 1 ? 'flex' : 'none';
        leftContainer.style.display = step === 2 || window.innerWidth >= 900 ? 'none' : 'flex';
    }

    prevBtn.addEventListener('click', function () {
        setActiveStep(1);
    });

    nextBtn.addEventListener('click', function () {
        const selectedFlightElement = document.querySelector('input[name="flight"]:checked');
        console.log(selectedFlightElement);
        if (selectedFlightElement) {
            const flightIndex = parseInt(selectedFlightElement.id.split('-')[1]); // Extract index from ID
            console.log('Selected flight index:', flightIndex);
    
            // Get flight ID and route ID from the selected flight element
            const flightId = selectedFlightElement.value;
            const routeId = selectedFlightElement.getAttribute('data-route-id'); // Get route ID from data attribute
       
            console.log('Selected flight ID:', flightId);
            console.log('Selected route ID:', routeId);
         
    
            // if (seatsAvailable <= 0) {
            //     alert("No seats available for your selected flight. Try to make a different selection.");
            // } else {
                // Store flight ID, route ID, and seats available in local storage
                localStorage.setItem('selectedFlightId', flightId);
                localStorage.setItem('selectedRouteId', routeId);
               

    
                setActiveStep(2); // Move to the next step in your process
           // }
        } else {
            alert('Please select a flight before continuing.');
        }
    });

    finishBtn.addEventListener('click', function () {
        // Create a popup container
        const popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '0';
        popupContainer.style.left = '0';
        popupContainer.style.width = '100%';
        popupContainer.style.height = '100%';
        popupContainer.style.background = 'rgba(0, 0, 0, 0.5)';
        popupContainer.style.display = 'flex';
        popupContainer.style.justifyContent = 'center';
        popupContainer.style.alignItems = 'center';
        popupContainer.style.zIndex = '9999'; 
    
       
        const image = document.createElement('img');
        image.src = '/images/Success.gif'; 
        image.style.width = '80%';
        image.style.maxWidth = '800px'; 
        image.style.height = 'auto';
    
        
        popupContainer.appendChild(image);
    
       
        document.body.appendChild(popupContainer);
    
        numberOfPersons = 1;
        numberOfPersonsElement.textContent = numberOfPersons;
        localStorage.setItem('numberOfPersons', numberOfPersons);
        setTimeout(function () {
            document.body.removeChild(popupContainer);
            window.location.href = '/user_part/user_home/user_home.html'; // Redirect after image display
        }, 5000); 
    });
    
 
    let numberOfPersons = parseInt(localStorage.getItem('numberOfPersons')) || 1;
    const decrementBtn = document.getElementById('decrement-btn');
    const incrementBtn = document.getElementById('increment-btn');
    const numberOfPersonsElement = document.getElementById('no-of-persons');


    numberOfPersonsElement.textContent = numberOfPersons;

    decrementBtn.addEventListener('click', function () {
        if (numberOfPersons > 1) {
            numberOfPersons--;
            numberOfPersonsElement.textContent = numberOfPersons;
            localStorage.setItem('numberOfPersons', numberOfPersons); // Update localStorage
        
        }
    });

   
    incrementBtn.addEventListener('click', function () {
        numberOfPersons++;
        numberOfPersonsElement.textContent = numberOfPersons;
        localStorage.setItem('numberOfPersons', numberOfPersons); // Update localStorage
    });

    const bookBtn = document.getElementById('book-btn');

    bookBtn.addEventListener('click', function () {
        const selectedFlightElement = document.querySelector('input[name="flight"]:checked');
        if (selectedFlightElement) {
            
            let numberOfPersons = parseInt(localStorage.getItem('numberOfPersons')) || 1;
            const seat = localStorage.getItem('seat');
            if (numberOfPersons > seat) {
                alert('Insufficient seats available for the selected flight. Please adjust the number of persons or select a different flight.');
                return;
            }
            const userId = localStorage.getItem('userId');
            const routeId = selectedFlightElement.getAttribute('data-route-id');
            const flightId = selectedFlightElement.value;
         //   let numberOfPersons = parseInt(localStorage.getItem('numberOfPersons')) || 1;
            const costPerPerson = parseFloat(selectedFlightElement.getAttribute('data-cost-per-person'));
            const totalCost = costPerPerson * numberOfPersons;
            localStorage.setItem('numberOfPersons', numberOfPersons);
            localStorage.setItem('totalCost', totalCost);

            // Create booking object
            const bookingData = {
                userId: parseInt(userId),
                flightId: parseInt(flightId),
                routeId: parseInt(routeId),
                noOfPersons: numberOfPersons
            };

            // Log booking data to ensure it's correctly formatted
            console.log('Booking Data:', bookingData);


            // Send booking data to the API
            fetch('https://localhost:7127/api/Booking/User/AddBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            })
                .then(response => {
                    // Check if the response is not ok (e.g., status is not in the range 200-299)
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            // Throw an error containing the error data
                            throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    // Assuming the API returns the generated booking ID in the response
                    const bookingId = data.bookingId;
                    localStorage.setItem('bookingId', bookingId);

                    alert(`Booked for ${numberOfPersons} person(s) at a total cost of ${totalCost.toFixed(2)}. Booking ID: ${bookingId}`);

                    enablePaymentOptions();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to book the flight. Please try again. ' + error.message);
                });
        } else {
            alert('Please select a flight before booking.');
        }
    });


    const payBtn = document.getElementById('pay-btn');
    const paymentOptions = document.querySelectorAll('.payment-option');

    paymentOptions.forEach(option => {
        option.addEventListener('click', function () {

            paymentOptions.forEach(opt => opt.classList.remove('selected'));

            this.classList.add('selected');
        });
    });
    payBtn.addEventListener('click', async function () {
        if (!payBtn.classList.contains('disabled')) {
            const selectedPaymentOption = document.querySelector('.payment-option.selected');
            if (selectedPaymentOption) {
                const paymentMethod = selectedPaymentOption.textContent;
                const departureLocation = localStorage.getItem('departureLocation');
                const arrivalLocation = localStorage.getItem('arrivalLocation');
                const selectedFlightId = localStorage.getItem('selectedFlightId');
                const numberOfPersons = localStorage.getItem('numberOfPersons');
                const totalCost = localStorage.getItem('totalCost');
                const bookingId = localStorage.getItem('bookingId'); // Fetch bookingId from local storage

                if (departureLocation) {
                    const paymentData = {
                        bookingId: parseInt(bookingId, 10), // Ensure bookingId is an integer
                        paymentMethod: paymentMethod
                    };

                    try {
                        // Make the POST request to the API
                        const response = await fetch('https://localhost:7127/api/Payment/AddPayment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(paymentData)
                        });

                        if (response.ok) {
                            const result = await response.json();

                            localStorage.setItem('paymentId', result.paymentId);
                            localStorage.setItem('paymentMethod', paymentMethod);
                            showCustomAlert(`<h2>Payment successful</h2>
                                            Selected Flight ID: ${selectedFlightId}
                                            Departure Location: ${departureLocation}
                                            Arrival Location: ${arrivalLocation}
                                            Number of Persons: ${numberOfPersons}
                                            Total Cost: ${totalCost}
                                            Booking ID: ${bookingId}
                                            Payment ID: ${result.paymentId}
                                            Payment Method: ${paymentMethod}`);
                        } else {
                            const error = await response.json();
                            alert(`Payment failed: ${error.message}`);
                        }
                    } catch (err) {
                        console.error('Error:', err);
                        alert('An error occurred while processing the payment.');
                    }
                } else {
                    alert('One or more details (departure location, arrival location, flight ID, number of persons, total cost, booking ID, or payment method) are missing.');
                }
            } else {
                alert('Please select a payment method before proceeding.');
            }
        }
    });


    function showCustomAlert(message) {
        const alertBox = document.getElementById('customAlert');
        const alertMessage = document.getElementById('alertMessage');

        // Split message into lines and create HTML for each line
        const messageLines = message.split('\n');
        alertMessage.innerHTML = messageLines.map(line => `<p>${line}</p>`).join('');

        alertBox.style.display = 'block';

        // Close alert when close icon is clicked
        const closeBtn = document.getElementsByClassName('close-alert')[0];
        closeBtn.onclick = function () {
            alertBox.style.display = 'none';
        };

        // Close alert if user clicks outside of it
        window.onclick = function (event) {
            if (event.target === alertBox) {
                alertBox.style.display = 'none';
            }
        };
    }




    function enablePaymentOptions() {
        paymentOptions.forEach(option => option.classList.remove('disabled'));
        payBtn.classList.remove('disabled');
        displayTotalCost();
    }
    function displayTotalCost() {
        const totalCost = localStorage.getItem('totalCost');
        if (totalCost) {
            const totalCostElement = document.createElement('div');
            totalCostElement.id = 'total-cost';
            totalCostElement.textContent = `Total Cost:Rs. ${parseFloat(totalCost).toFixed(2)}`;
            const paymentOptionsElement = document.getElementById('payment-options');

            paymentOptionsElement.appendChild(totalCostElement);
        }
    }

    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
  
    async function displayFlights(flights) {
        const flightCardsContainer = document.getElementById('flight-cards');
        flightCardsContainer.innerHTML = ''; // Clear previous cards   
        try {
            const allFlights = Object.values(flights).flat(); // Flatten arrays of flights
            let hasFlights = false;
            for (const [index, flight] of allFlights.entries()) {
                if (flight.DepartureLocation.toLowerCase() === storedDepartureLocation.toLowerCase() &&
                    flight.ArrivalLocation.toLowerCase() === storedArrivalLocation.toLowerCase()) {
    
                    const flightName = await fetchFlightName(flight.FlightId);
                    const duration = calculateDuration(flight.ArrivalDateTime, flight.DepartureDateTime);
    
                    const flightCard = document.createElement('label');
                    flightCard.classList.add('flight-card');
                    flightCard.htmlFor = `flight-${index}`;
            
                    flightCard.setAttribute('data-price', flight.PricePerPerson);
                    flightCard.setAttribute('data-stops', flight.NoOfStops);
                   flightCard.setAttribute('data-seats', flight.SeatsAvailable);
                  localStorage.setItem('seat',flight.SeatsAvailable);
                    flightCard.innerHTML = `
                        <div class="flight-content">
                            <input type="radio" name="flight" id="flight-${index}" value="${flight.FlightId}" class="flight-radio" data-route-id="${flight.RouteId}" data-cost-per-person="${flight.PricePerPerson}" data-seats="${flight.SeatsAvailable}">
                            <div>
                                <h3>Departure Details:</h3>
                                <p class="departure-location">${flight.DepartureLocation}</p>
                                <p>${new Date(flight.DepartureDateTime).toLocaleDateString()}</p>
                                <p class="departure-time">${formatTime(new Date(flight.DepartureDateTime))}</p>
                            </div>
                            <div class="duration-container">
                                <p class="duration-text"><strong>Duration:</strong> ${duration}</p>
                            </div>
                            <div>
                                <strong>Arrival Details:</strong>
                                <p class="arrival-location">${flight.ArrivalLocation}</p>
                                <p>${new Date(flight.ArrivalDateTime).toLocaleDateString()}</p>
                                <p class="arrival-time">${formatTime(new Date(flight.ArrivalDateTime))}</p>
                            </div>
                        </div>
                        <div class="other-info">
                            <p><strong>Seats Available:</strong> ${flight.SeatsAvailable}</p>
                            <p><strong>Price Per Person:</strong> ${flight.PricePerPerson}</p>
                        </div>
                        <div class="flight-names">
                            <h3>FlightName: ${flightName}</h3>
                            <p><strong>Stops:</strong> ${flight.NoOfStops}</p>
                        </div>
                        <div class="additional-info">
                         
                            <div class="flight-header">
                              
                               
                            </div>
                        </div>
                    `;
                
                    flightCardsContainer.appendChild(flightCard);
                    hasFlights = true;
                  
                }
            }
         
            attachStopFilterEventListeners();
            if (!hasFlights) {
                notFoundFrame.style.display = 'block';
            } else {
                notFoundFrame.style.display = 'none';
            }
        } catch (error) {
            console.error('Error displaying flights:', error);
        }
    }
 
    async function fetchFlights() {
        try {
            const response = await fetch('https://localhost:7127/api/Flight/GetAllDirectFlights');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const flights = await response.json();
            console.log(flights);
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

    function attachStopFilterEventListeners() {
        const stopCheckboxes = document.querySelectorAll('input[name="stops"]');
        const flightCards = document.querySelectorAll('.flight-card');

        stopCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const selectedStops = Array.from(stopCheckboxes)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => parseInt(checkbox.value, 10));

                flightCards.forEach(card => {
                    const stops = parseInt(card.getAttribute('data-stops'), 10);
                    if (selectedStops.length === 0 || selectedStops.includes(stops)) {
                        card.style.display = 'block';
                        notFoundFrame.style.display = 'none';
                    } else {
                        card.style.display = 'none';
                        notFoundFrame.style.display = 'block';
                    }
                });
            });
        });
    }

    $(function () {
        // Function to fetch data from the API
        function fetchFlightCosts() {
            return $.ajax({
                url: "https://localhost:7127/api/Route/FlightCost",
                method: "GET",
                dataType: "json"
            });
        }

        fetchFlightCosts().done(function (data) {

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

                    // Filter flight cards based on the selected price range
                    filterFlightsByPrice(ui.values[0], ui.values[1]);
                }
            });

            $("#min-amount").text("Min: Rs. " + $("#slider-range").slider("values", 0));
            $("#max-amount").text("Max: Rs. " + $("#slider-range").slider("values", 1));
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Failed to fetch flight costs: ", textStatus, errorThrown);
        });

        function filterFlightsByPrice(minPrice, maxPrice) {
            const flightCards = document.querySelectorAll('.flight-card');
            flightCards.forEach(card => {
                const price = parseFloat(card.getAttribute('data-price'));
                if (price >= minPrice && price <= maxPrice) {
                    card.style.display = 'block';
                    notFoundFrame.style.display = 'none';
                } else {
                    card.style.display = 'none';
                    notFoundFrame.style.display = 'block';

                }
            });
        }
    });




});
document.addEventListener('DOMContentLoaded', function () {
    console.log('JavaScript loaded');
    const leftContainer = document.getElementById('left-container');
    const floatingIcon = document.getElementById('floating-icon');

    floatingIcon.addEventListener('click', function () {
        console.log('Filter icon clicked');
        leftContainer.classList.toggle('open');
    });
});