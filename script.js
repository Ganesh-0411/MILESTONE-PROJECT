// ================= GLOBAL VARIABLES =================
let selectedEvent = null;

// ================= EVENT LIST =================
const events = [
    { name: "Music Concert", price: 500, image: "image/Music.jpeg", date: "15 March 2026", time: "6:00 PM" },
    { name: "Tech Conference", price: 800, image: "image/Tech.jpeg", date: "22 March 2026", time: "10:00 AM" },
    { name: "Food Festival", price: 300, image: "image/Food.jpeg", date: "5 April 2026", time: "12:00 PM" },
    { name: "Comedy Show", price: 400, image: "image/Comedy.jpeg", date: "18 April 2026", time: "7:30 PM" },
    { name: "Actress Meet", price: 1000, image: "image/Actress Meet.jpeg", date: "25 April 2026", time: "5:00 PM" },
    { name: "Art Exhibition", price: 600, image: "image/Art.jpeg", date: "2 May 2026", time: "11:00 AM" },
    { name: "Movie Pre-Release", price: 700, image: "image/Movie.jpeg", date: "10 May 2026", time: "3:00 PM" },
    { name: "Gaming Tournament", price: 900, image: "image/Game.jpeg", date: "20 May 2026", time: "4:00 PM" }
];

// ================= GENERATE BOOKING ID =================
function generateBookingID() {
    const random = Math.floor(1000 + Math.random() * 9000);
    const date = new Date().getTime().toString().slice(-4);
    return "EVT" + random + date;
}

// ================= DISPLAY EVENTS =================
function displayEvents(filteredEvents = null) {
    const container = document.getElementById("eventContainer");
    if (!container) return;

    container.innerHTML = "";
    const eventList = filteredEvents || events;

    eventList.forEach((event, index) => {
        const originalIndex = events.findIndex(e => e.name === event.name);

        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event-card");

        eventDiv.innerHTML = `
            <img src="${event.image}" alt="${event.name}">
            <h3>${event.name}</h3>
            <p>📅 ${event.date}</p>
            <p>⏰ ${event.time}</p>
            <p>💰 ₹${event.price}</p>
            <button onclick="selectEvent(${originalIndex})">Book Now</button>
        `;

        container.appendChild(eventDiv);

        eventDiv.style.opacity = 0;
        setTimeout(() => {
            eventDiv.style.transition = "opacity 0.4s ease";
            eventDiv.style.opacity = 1;
        }, 100 * index);
    });
}

// ================= SELECT EVENT =================
function selectEvent(index) {
    selectedEvent = events[index];

    document.getElementById("selectedEventName").innerText = selectedEvent.name;
    document.getElementById("bookingModal").style.display = "flex";
    document.getElementById("tickets").value = "";
}

// ================= CLOSE MODAL =================
function closeModal() {
    document.getElementById("bookingModal").style.display = "none";
}

// ================= CONFIRM BOOKING =================
async function confirmBooking() {
    const name = document.getElementById("name").value;
    const tickets = parseInt(document.getElementById("tickets").value);

    if (!name || !tickets || tickets <= 0) {
        alert("Please enter valid details!");
        return;
    }

    if (!selectedEvent) {
        alert("No event selected!");
        return;
    }

    const totalAmount = tickets * selectedEvent.price;
    const bookingID = generateBookingID();

    try {
        const response = await fetch("http://localhost:5000/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: name,
                eventName: selectedEvent.name,
                tickets,
                totalAmount,
                bookingID
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Booking failed.");
            return;
        }

        // ===== PREMIUM ANIMATED TICKET =====
        document.getElementById("confirmation").innerHTML = `
            <div class="ticket-wrapper">
                <div class="ticket-card">

                    <div class="ticket-left">
                        <h2>🎟 EVENT PASS</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Event:</strong> ${selectedEvent.name}</p>
                        <p><strong>Date:</strong> ${selectedEvent.date}</p>
                        <p><strong>Time:</strong> ${selectedEvent.time}</p>
                        <p><strong>Tickets:</strong> ${tickets}</p>
                    </div>

                    <div class="divider"></div>

                    <div class="ticket-right">
                        <div class="booking-id">Booking ID: ${bookingID}</div>
                        <p>Total Paid</p>
                        <h3>₹${totalAmount}</h3>
                        <div class="barcode"></div>
                        <p class="thank-you">Enjoy the Event 🎉</p>
                    </div>

                </div>
            </div>
        `;

        closeModal();

    } catch (error) {
        console.error("Booking Error:", error);
        alert("Server not responding.");
    }
}

// ================= REGISTER =================
async function register() {
    const username = document.getElementById("regUser").value;
    const password = document.getElementById("regPass").value;

    if (!username || !password) {
        alert("Enter valid username and password.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message);
        showLogin();

    } catch (error) {
        console.error("Registration Error:", error);
        alert("Server not running.");
    }
}

// ================= LOGIN =================
async function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;

    if (!username || !password) {
        alert("Enter valid username and password.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success || (data.message && data.message.toLowerCase().includes("successful"))) {

            document.getElementById("authContainer").style.display = "none";
            document.getElementById("bookingContainer").style.display = "block";

            displayEvents();
            alert(data.message);

        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error("Login Error:", error);
        alert("Server not running.");
    }
}

// ================= SEARCH =================
function searchEvents() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = events.filter(event =>
        event.name.toLowerCase().includes(query)
    );
    displayEvents(filtered);
}

// ================= LOAD EVENTS =================
document.addEventListener("DOMContentLoaded", () => {
    displayEvents();
});