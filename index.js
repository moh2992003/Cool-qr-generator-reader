const inpTxt = document.querySelector('#inp');
const homBtn = document.querySelector('.home-input');
let screen = document.querySelector('.screen');
const QrtoTxt = document.querySelector('#qr-data');


const removeQrtoTxt = () => { 
    QrtoTxt.innerHTML = '';
}

homBtn.addEventListener('click', (e) => {
    if (screen.childNodes) { 
        removeLoad();
        removeQrtoTxt();
    }
    if (inpTxt.value === '') {
        e.preventDefault();
    } else if (inpTxt) { 
        // Show loading icon immediately
        showLoadingIcon();
        // Initiate fetch after 5 seconds
        setTimeout(() => {
            GetQr(inpTxt.value); // function to fetch the data 
        }, 3000);
    }
});

const GetQr = (Txt) => { 
    fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${Txt}&size=256x430`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error: ${Error}`);
            }
            return response;
        })
        .then((response) => response.blob())
        .then((blob) => {
            // Convert blob to object URL
            const imgUrl = URL.createObjectURL(blob);
            qrImg(imgUrl);
            removeLoad(); // Remove loading icon after successful fetch
        })
        .catch((err) => { 
            removeLoad(err); 
        });
};

const qrImg = (url) => { 
    let img = document.createElement('img');
    img.setAttribute('src', url);
    screen.append(img);
};

const showLoadingIcon = () => {
    let loadingImg = document.createElement('img');
    loadingImg.setAttribute('src', './load icon.gif');
    loadingImg.setAttribute('alt', 'Loading...');
    loadingImg.id = 'loading-icon'; 
    let screen = document.querySelector('.screen');
    screen.append(loadingImg);
};

const removeLoad = (err) => { 
    screen.childNodes.forEach((e) => { 
        e.remove();
    })
    if (err) { 
        let errDiv = document.createElement('div');
        errDiv.style = 'color: white; font-size: 20px; padding: 15px';
        errDiv.innerHTML = `if you see this then there is an ${err}`;
        screen.appendChild(errDiv)
    }
}

// 
document.getElementById('qr-form').addEventListener('submit', function (event) {
    removeLoad();
    event.preventDefault(); // prevent the form from submitting normally

    var formData = new FormData(this); // create formData object
    var xhr = new XMLHttpRequest(); // create new XMLHttpRequest object

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // If request is successful, parse the response and access the "data" property
                var response = JSON.parse(xhr.responseText);
                if (Array.isArray(response) && response.length > 0) {
                    var data = response[0].symbol[0].data;
                    if (data) {
                        document.getElementById('qr-data').innerText = data;
                    } else {
                        document.getElementById('qr-data').innerText = 'QR code data not found in response.';
                    }
                } else {
                    document.getElementById('qr-data').innerText = 'QR code data not found in response.';
                }
            } else {
                // If there's an error, display error message
                document.getElementById('qr-data').innerText = 'Error occurred: ' + xhr.statusText;
            }
        }
    };

    xhr.open('POST', 'http://api.qrserver.com/v1/read-qr-code/', true); // open a POST request
    xhr.send(formData); // send formData object
});
