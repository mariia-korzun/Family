const extentionsOfImages = [
    "image/jpeg",
    "image/png"
]
function checkContent(object) {

    var placeholderStyle = document.getElementById('placeholder').style
    if (object.textContent == '') {
        placeholderStyle.display = 'initial'
    }
    else {
        placeholderStyle.display = 'none'
    }
}


function onfocusPlaceholder() {
    document.getElementById('placeholder').style.color = '#b1b0b0'
}
function onblurPlaceholder() {
    document.getElementById('placeholder').style.color = '#5e5b5b'
}

function postFiles() {
    let establishedTypes
    switch (this.id) {
        case 'input_load_img': { establishedTypes = extentionsOfImages; break }
        default: break;
    }
    for (let i = 0; i < this.files.length; i++) {
        if (!verifyTypeOfFiles(establishedTypes, this.files[i])) {
            let error = document.createElement('p')
            error.innerText = `Extention of ${this.files[i].name} is not allowed`
            let errorContainer = document.getElementById('errors_of_content')
            errorContainer.appendChild(error)
        }
        else {
            let fileWrapper = new FileWrapper(this.files[i])
            postData.fileWrappers.push(fileWrapper)
            fetch('/api/asset', {
                method: 'POST',
                credentials: 'same-origin',
                body: fileWrapper.file
            }).then(response => {
                if (!(response.status == 201)) {
                    throw 'Oops! Something got broken'
                }
                else {
                    return response.json()
                }
            }).then(body => {
                if (!body) {
                    throw 'Oops! Body of response is undefined'
                }
                else {
                    fileWrapper.id = body.id
                    fileWrapper.path = body.path
                    updateImagePreview(fileWrapper.path)
                }
            }).catch(error => { console.log(error); alert(error) })
        }
    }
}
class NewPostData {
    fileWrappers = new Array()
}
let postData = new NewPostData()

class FileWrapper {
    constructor(file) {
        this.file = file
    }
}
window.onload = () => { document.getElementById('input_load_img').onchange = postFiles }


function verifyTypeOfFiles(establishedTypes, file) {
    if (!establishedTypes.includes(file.type)) {
        return false
    }
    return true
}

function updateImagePreview(path) {
    let previewImage = document.createElement('img')
    previewImage.className = 'preview_image'
    previewImage.setAttribute('src', path)

    let deletePreviewImageButton = document.createElement('img')
    deletePreviewImageButton.className = 'delete_view_image_button'
    deletePreviewImageButton.setAttribute('src', '/images/assets/delete-button.svg')
    deletePreviewImageButton.onclick = deletePreviewAndFileWrapper

    let previewWrapper = document.createElement('div')
    previewWrapper.className = 'preview_wrapper'
    previewWrapper.appendChild(previewImage)
    previewWrapper.appendChild(deletePreviewImageButton)

    let containerOfPreviews = document.getElementById('preview_of_content')
    containerOfPreviews.appendChild(previewWrapper)
}
function deletePreviewAndFileWrapper() {
    let previewWrapper = this.parentElement
    let path = previewWrapper.firstElementChild.getAttribute('src')
    for (i = 0; i < postData.fileWrappers.length; i++) {
        if (postData.fileWrappers[i].path === path) {
            postData.fileWrappers.splice(i, 1)
            previewWrapper.remove()
        }
    }
}

