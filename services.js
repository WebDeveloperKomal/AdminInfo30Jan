

document.addEventListener('DOMContentLoaded', getData);

function getData() {

    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/ibg-infotech/auth/get-all-services-content', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })

        .then(data => {
            console.log(data);
            populateTable(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');

    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.title}</td>
                <td>${item.information}</td>
                <td>${item.active ? 'Active' : 'Inactive'}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.error('Data received is not an array:', data);
    }
}
//load the page
// populateTable(); 