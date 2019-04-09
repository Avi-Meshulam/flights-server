'use strict';

const serverURl = 'http://localhost:8080';
const FlightFields = {
    id: 'id',
    from: 'from',
    to: 'to',
    departure: 'departure',
    arrival: 'arrival',
    airline: 'airline', 
}

let flightsData = [];
let tableBody = document.querySelector('#flights-table tbody');

fetch(`${serverURl}/flights.json`)
    .then(res => res.json())
    .then(data => {
        flightsData = data;
        renderTable();
    });

document.querySelectorAll('th a').forEach(element => {
    element.onclick = function () {
        tableHeadClicked();
    }
});

function tableHeadClicked() {
    const fieldName = event.target.getAttribute('data-field');
    const sortOrder = event.target.getAttribute('sort-order') === 'asc' ? 'des' : 'asc';

    switch (fieldName) {
        case FlightFields.departure:
        case FlightFields.arrival:
            flightsData.sort(getSortFunc(sortOrder, (flight) => new Date(flight[fieldName])));
            break;
        default:
            flightsData.sort(getSortFunc(sortOrder, (flight) => flight[fieldName]));
            break;
    }

    event.target.setAttribute('sort-order', sortOrder);
    renderTable();
}

function getSortFunc(order = 'asc', itemFunc = (x) => x) {
    return order === 'asc' ? 
        (a, b) => itemFunc(a) >= itemFunc(b) ? 1 : -1 :
        (a, b) => itemFunc(a) <= itemFunc(b) ? 1 : -1;
}

function renderTable() {
    let tbody = document.createElement('tbody');

    flightsData.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry[FlightFields.id]}</td>
            <td>${entry[FlightFields.from]}</td>
            <td>${entry[FlightFields.to]}</td>
            <td>${entry[FlightFields.departure]}</td>
            <td>${entry[FlightFields.arrival]}</td>
            <td>${entry[FlightFields.airline]}</td>
        `;
        tbody.appendChild(tr)
    });

    tableBody.parentNode.replaceChild(tbody, tableBody)
    tableBody = tbody;
}