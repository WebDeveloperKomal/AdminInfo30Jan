// -----------------------get all the data-----------------------------------------

var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);

function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/ibg-infotech/auth/get-all-about-us-content', {
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
            populateTable(data.data);
        })

        .catch(error => {
            console.log('Error fetching data:', error);
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




function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.heading}</td>
            <td>${item.text1}</td>
            <td>${item.text2}</td>
            <td>${item.mission}</td>
            <td>${item.vision}</td>
            <td>${item.value}</td>
            <td>${item.experience}</td>
            <td>${item.award_text}</td>
            <td>${item.member_count}</td>
            <td>${item.awards_count}</td>
            <td>${item.project}</td>
            <td>${item.client_review}</td>
            <td>${item.terminal}</td>

            <td><img src="data:image/jpeg;base64,${item.image}" width="100" height="100"></td>
            <td>
                <a class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i>Edit</a>
                <a class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i>Delete</a>
            </td>
        `;

            tableBody.appendChild(row);

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                console.log("Edit button clicked for ID:" + id);

                fetch(`http://localhost:8181/ibg-infotech/auth/get-about-us-content/${id}`, {
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
                        if (data) {
                            localStorage.setItem('updateData', JSON.stringify(data.data));
                            window.location.href = 'update-about-us.html';
                        } else {
                            console.error('Data received from server is invalid:', data);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching about us content data:', error);
                    });
            });

            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = deleteBtn.getAttribute('data-id');
                deleteAboutUsContent(id);
            });
        });

    } else {
        console.error('Data received is not an array:', data);
    }

}


// ---------------------------------delete the data--------------------------------------------------------


function deleteAboutUsContent(id) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/ibg-infotech/auth/delete-about-us-content/${id}`, {
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
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'About us has been deleted successfully.',
            }).then((result) => {

                getData();
            });
        })

        .catch(error => {
            console.error('Error:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete the About us. Please try again later.',
            });
        });
}

// --------------------update the data by id-------------------------------------------------

