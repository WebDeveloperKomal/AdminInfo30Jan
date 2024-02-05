// -------------------------save the data----------------------------------------------------

function previewImage() {
    const imageFile = document.getElementById('imageFile').files[0];
    const imagePreview = document.getElementById('imagePreview');

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(imageFile);

        document.getElementById('imagePath').value = imageFile.name;
    } else {
        imagePreview.style.display = 'none';
    }
}


function saveData() {

    var about = document.getElementById('about').value;
    var about_title = document.getElementById('about_title').value;
    var about_text = document.getElementById('about_text').value;
    var imageFile = document.getElementById('imageFile').files[0];

    var formData = new FormData();
    formData.append('data', JSON.stringify({
        about: about,
        about_title: about_title,
        about_text: about_text
    }));

    formData.append('imageFile', imageFile);

    var jwtToken = localStorage.getItem('jwtToken');

    if (!about || !about_title || !about_text || !imageFile) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    fetch('http://localhost:8181/ibg-infotech/auth/save-home-about', {
        method: 'POST',
        body: formData,
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
            console.log('Server response:', data);
            alert('Save Data Successfully!');
            window.location.href = 'Home-about-us-content.html'
        })

        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save data. please try again.');
        });
}
