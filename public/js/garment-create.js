const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('uploadPreview');
const cropBtn = document.getElementById('cropBtn');

let cropper = null;

/* ===========================
   Inicializar Cropper
=========================== */

imageInput.addEventListener('change', function (e) {

    const file = e.target.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    preview.src = url;
    preview.style.display = 'block';

    preview.onload = function () {

        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(preview, {
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 1,
            responsive: true,
            background: false
        });

    };

});


/* ===========================
   Crop Photo
=========================== */

cropBtn.addEventListener('click', function () {

    if (!cropper) {
        alert('Select an image first');
        return;
    }

    const canvas = cropper.getCroppedCanvas({
        maxWidth: 1200,
        maxHeight: 1200
    });

    canvas.toBlob(function(blob){

        const croppedFile = new File(
            [blob],
            'cropped-image.png',
            {
                type: 'image/png'
            }
        );

        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(croppedFile);

        imageInput.files = dataTransfer.files;

        preview.src = canvas.toDataURL();

        cropper.destroy();

        cropper = null;

        alert('Photo cropped successfully');

    }, 'image/png');

});