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
        populateTable(data.data); // Assuming your data object has a 'data' property containing the array
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
                <td>
                    <a href="#" class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i> Edit</a>
                    <a href="Services.html" class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i> Delete</a>
                </td>
            `;
            tableBody.appendChild(row);

            // Add event listener to delete button
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = deleteBtn.getAttribute('data-id');
                deleteService(id);
            });
        });
    } else {
        console.error('Data received is not an array:', data);
    }
}


function deleteService(id) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/ibg-infotech/auth/delete-services-content/${id}`, {
        method: 'DELETE',
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
        // Show SweetAlert upon successful deletion
        Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Service has been deleted successfully.',
        }).then((result) => {
            // Reload the data or update the UI as needed
            // For example, you can remove the deleted row from the table
            getData(); // Reload the data after deletion
        });
    })
    .catch(error => {
        console.error('Error deleting service:', error);
        // Show SweetAlert for error
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to delete the service. Please try again later.',
        });
    });
}
