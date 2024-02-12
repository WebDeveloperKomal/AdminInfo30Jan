
function saveData() {
    var saveData = {
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        map: document.getElementById('map').value
    };

    // Retrieve JWT token from localStorage
    var jwtToken = localStorage.getItem('jwtToken');

    console.log('Request Data:', JSON.stringify(saveData));

    if (!saveData.address || !saveData.phone || !saveData.email) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!jwtToken) {
        // JWT token is missing, prompt user to log in again
        alert('JWT token is missing. Please log in again.');
        // Redirect user to login page or perform any other action as necessary
        return;
    }

    fetch('http://localhost:8181/ibg-infotech/auth/save-contact-us', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken,
        },
        body: JSON.stringify(saveData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
            // Show SweetAlert upon successful save
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Data has been saved successfully.',
            }).then((result) => {
                // Optionally, you can perform additional actions after the alert is closed
                // For example, you can clear form fields or reload data
                document.getElementById('address').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('email').value = '';
                document.getElementById('map').value = '';
                window.location.href = 'Contact-Us.html';
                // Reload data if needed
                // getData();
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Show SweetAlert for error
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save data. Please try again.',
            });
        });
}



var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);


function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/ibg-infotech/auth/get-all-contact-us', {
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


function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}


// Update the populateTable function to include data for name, title, description, and image
function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>${item.services}</td>
                <td>${item.text}</td>               
                <td>
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', function () {
                const id = editBtn.getAttribute('data-id');
                console.log("Edit button clicked for ID: " + id);
                // Fetch data for the selected item
                fetch(`http://localhost:8181/ibg-infotech/auth/get-contact-us/${id}`, {
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
                        // Store fetched data in local storage
                        localStorage.setItem('updateData', JSON.stringify(data.data));

                        // Redirect to update-services.html
                        window.location.href = 'update-contact.html';
                    })
                    .catch(error => {
                        console.error('Error fetching service data:', error);
                    });
            });

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


// ----------------------------------------delete by id-----------------------------------------------

function deleteService(id) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/ibg-infotech/auth/delete-contact-us/${id}`, {
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

// -----------------------------------update the data by id-------------------------------------------



function updateData() {
    var id = document.getElementById('id').value; // Fetch the ID from the form
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var services = document.getElementById('services').value;
    var text = document.getElementById('text').value;
    var phone = document.getElementById('phone').value;
    var jwtToken = localStorage.getItem('jwtToken');

    // Validate if the required fields are filled
    if (!name || !text || !email || !phone) {
        alert('Please fill in all required fields.');
        return;
    }

    // Validate JWT token
    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    // Prepare data object for submission
    var data = {
        name: name,
        email: email,
        services: services,
        text: text,
        phone: phone
    };

    fetch(`http://localhost:8181/ibg-infotech/auth/update-contact-us/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
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
            console.log('Server response:', data);
            if (data.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Data has been updated successfully.',
                }).then((result) => {
                    // Optionally redirect or perform other actions upon successful update
                    window.location.href = 'Contact-Us.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update data. ' + data.error,
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update data. Please try again.',
            });
        });
}
