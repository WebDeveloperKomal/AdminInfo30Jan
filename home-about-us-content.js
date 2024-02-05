// --------------------get all the data------------------------------------------------------

document.addEventListener('DOMContentLoaded', getData);

// function arrayBufferToBase64(buffer) {
//     var binary = '';
//     var bytes = new Uint8Array(buffer);
//     var len = bytes.byteLength;
//     for (var i = 0; i < len; i++) {
//         binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
// }


function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/ibg-infotech/auth/get-all-home-about', {
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
                <td>${item.about}</td>
                <td>${item.about_title}</td>
                <td>${item.about_text}</td>
                <td><img src="data:image/png;base64,${item.imageFile}" width="100" height="100"></td>
                <td>
                    <a href="Update-home-about-content.html" class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i> Edit</a>
                    <a href="Home-about-us-content.html" class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i> Delete</a>
                </td>
            `;

            // Fetch image data for each item
            // fetchImage(item.id, row);

            tableBody.appendChild(row);

            // Convert byte data to base64 and set as image source
            // const imgElement = row.querySelector('img');
            // const base64String = arrayBufferToBase64(item.imageFile);
            // imgElement.src = 'data:image/jpeg;base64,' + base64String;

            // Add event listener to delete button
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = deleteBtn.getAttribute('data-id');
                deleteAboutContent(id);
            });
        });
    } else {
        console.error('Data received is not an array:', data);
    }
}


// function fetchImage(id, row) {

//     fetch(`http://localhost:8181/ibg-infotech/auth/get-about-image/${id}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.blob(); 
//         })
//         .then(blob => {

//             const imageUrl = URL.createObjectURL(blob);


//             const imgElement = row.querySelector('img');
//             imgElement.src = imageUrl;
//         })
//         .catch(error => {
//             console.error('Error fetching image:', error);
//         });
// }


// -----------------------------delete the data-----------------------------------------------------------


function deleteAboutContent(id) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/ibg-infotech/auth/delete-home-about/${id}`, {
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
            alert("Delete the data successfully");
        })

        .then((result) => {
            getData();
        })

        .catch(error => {
            console.error('Error deleting service:', error);
        });
}
