'use strict';

const serverURl = 'http://localhost:8080';
let flightsData = [];
let tableBody = document.querySelector('#flights-table tbody');

fetch(`${serverURl}/flights.json`)
    .then(res => res.json())
    .then(data => {
        flightsData = data;
        renderTable();
    });

function renderTable() {
    let tbody = document.createElement('tbody');

    flightsData.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.id}</td>
            <td>${entry.from}</td>
            <td>${entry.to}</td>
            <td>${entry.departure}</td>
            <td>${entry.arrival}</td>
            <td>${entry.by}</td>
        `;
        tbody.appendChild(tr)
    });

    tableBody.parentNode.replaceChild(tbody, tableBody)
    tableBody = tbody;
}