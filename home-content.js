// -----------------------get all the data-----------------------------------

document.addEventListener('DOMContentLoaded', getData);

function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/ibg-infotech/auth/get-all-home-content', {
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
            // alert("Get all the Successfully");
        })

        .catch(error => {
            console.error('Error fetching data:', error);
        })
}

function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.text}</td>
            <td>${item.text1}</td>
            <td>${item.text2}</td>
            <td>${item.facts}</td>
            <td>${item.facts_text}</td>
            <td>${item.nations}</td>
            <td>${item.members}</td>
            <td>${item.awards}</td>
            <td>${item.satisfied_customer}</td>
            <td>${item.middle_text}</td>
            <td>${item.middle_text1}</td>
            <td>${item.cus_review}</td>
            <td>${item.cus_review_text}</td>
            
            <td>
                <a href="Update-home-content.html" class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i> Edit</a>
                <a href="Home-content.html" class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i> Delete</a>
            </td>
        `;

            tableBody.appendChild(row);

            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = deleteBtn.getAttribute('data-id');
                deleteContent(id);
            });
        });
    } else {
        console.error('Data received is not an array:', data);
    }
}


// -----------------------------delete the data-------------------------------------------------------

function deleteContent(id) {
    jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/ibg-infotech/auth/delete-home-content/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
        },

    })

        .then(response => {
            if (!response.ok) {
                throw new error('Network respose was not ok');
            }
            return response.json();
        })

        .then(data => {
            console.log(data);
            alert("Delete the data successfully");
        })

        .then((result) => {
            getData();
        })

        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting service: ' + error.message);
        });
}  