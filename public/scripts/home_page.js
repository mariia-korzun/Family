
let ownerOfPage = {}
let myPage = null
let doIFollowOwnerOfPage




const extentionsOfImages = [
    "image/jpeg",
    "image/png"
]
let postData

let textOfPostPlaceholder = document.getElementById('text_of_post')

textOfPostPlaceholder.oninput = function () { checkContent(this) }

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
        case 'input_upload_img': { establishedTypes = extentionsOfImages; break }
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
            postAsset(fileWrapper.file).then(body => {
                fileWrapper.id = body.id
                fileWrapper.path = body.path
                updateImagePreview(fileWrapper.path)
            }).catch(error => {
                console.log(error); alert(error)
                postData.fileWrappers.splice(i, 1)
            })
            // let request = new XMLHttpRequest()
            // request.onreadystatechange = function() {
            //     if (this.readyState == 4 && this.status == 201) {
            //         console.log(this.responseText)
            //     }
            //   }
            // request.open('POST', '/api/asset', true)
            // request.send(fileWrapper.file)
        }
    }
    this.value = ''
}


function postAsset(body) {
    return fetch('/api/asset', {
        method: 'POST',
        credentials: 'same-origin',
        body: body
    }).then(response => {
        if (!(response.status == 201)) {
            throw 'Oops! Something got broken'
        }
        else {
            return response.json()
        }
    }).then(responseBody => {
        if (!responseBody) {
            throw 'Oops! Body of response is undefined'
        }
        return responseBody
    })
}
class NewPostData {
    constructor() {
        this.fileWrappers = new Array()
        this.postText = document.getElementById('text_of_post')
    }
}

class FileWrapper {
    constructor(file) {
        this.file = file
        this.id = null
        this.path = null
    }
}
window.onload = () => {
    initiateUserDataLoading(true)
    document.getElementById('input_upload_img').onchange = postFiles;
    postData = new NewPostData()
}


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

function post() {
    if (postData.postText.textContent === '' && postData.fileWrappers.length == 0) {
        alert('There is no data to post!')
        return
    }
    if (postData.fileWrappers.length !== 0) {
        for (let i = 0; i < postData.fileWrappers.length; i++) {
            if (postData.fileWrappers[i].path === null) {
                alert('Wait a moment, your files are loading!')
                return
            }
        }
    }
    let submitPostButton = document.getElementById('submit_button')
    submitPostButton.disabled = true
    let sendedPostData = {
        fileId: postData.fileWrappers.map((item) => {
            return item.id
        }), postText: postData.postText.textContent,
        'recipient': ownerOfPage.id
    }
    fetch('/api/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(sendedPostData)
    }).then(response => {
        if (response.status != 201) {
            throw 'Oops! Something got broken'
        }
        let containerOfPreviews = document.getElementById('preview_of_content')
        while (containerOfPreviews.hasChildNodes()) {
            containerOfPreviews.removeChild(containerOfPreviews.firstChild)
        }
        submitPostButton.disabled = false
        postData.fileWrappers = new Array()
        postData.postText.textContent = ''
        updatePosts()
    }).catch(error => {
        submitPostButton.disabled = false;
        console.log(error); alert(error)
    })
}


function initiateUserDataLoading(postReloadinqRequired) {
    let queryParams = window.location.search
    let idParam = 'id'
    // if (!queryParams) {
    //     loadUserData(null)
    //     return
    // }
    let param = new URLSearchParams(queryParams)
    if (param.has(idParam)) {
        loadUserData(param.get('id'), postReloadinqRequired)
        return
    }
    loadUserData(null, postReloadinqRequired)
}

function loadUserData(id, postReloadinqRequired) {
    let loadUserDataPath = new URL(window.location.origin)
    loadUserDataPath.pathname = '/api/user/'
    if (id) { loadUserDataPath.searchParams.append('id', id) }
    fetch(loadUserDataPath.href, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'same-origin'
    }).then(response => {
        if (!(response.status == 200)) {
            throw 'Oops! Something got broken'
        }
        else if (response.redirected) { throw { url: response.url } }
        else {
            return response.json()
        }
    }).then(body => {
        if (!body) {
            throw 'Oops! Body of response is undefined'
        }
        else {
            ownerOfPage = body.ownerOfPage
            myPage = body.myPage
            doIFollowOwnerOfPage = body.doIFollowOwnerOfPage
            fillUserData()
            if (postReloadinqRequired) { updatePosts() }

        }
    }).catch(error => {
        if (error.url) {
            window.location.assign(error.url)
            return
        }
        console.log(error)
        alert(error)
    })
}


function fillUserData() {
    let nameOfOwnerPage = document.getElementById('name')
    nameOfOwnerPage.textContent = `${ownerOfPage.firstName}` + ' ' + `${ownerOfPage.lastName}`
    let bithdayOfOwnerPage = document.getElementById('user_birthday')
    bithdayOfOwnerPage.textContent = `${ownerOfPage.dataOfBirth}`

    let profilePhoto = document.getElementById('profile_photo')
    let smallProfilePhoto = document.getElementById('photo_avatar_small')

    if (ownerOfPage.Albums.length !== 0) {

        let avatarPhoto = ownerOfPage.Albums[0].Assets[ownerOfPage.Albums[0].Assets.length - 1]
        profilePhoto.setAttribute('src', `/api/asset/${avatarPhoto.id}`)
        smallProfilePhoto.setAttribute('src', `/api/asset/${avatarPhoto.id}`)
    }
    else {
        profilePhoto.setAttribute('src', `/images/avatar.png`)
        smallProfilePhoto.setAttribute('src', `/images/avatar.png`)
    }

    if (!myPage) {
        let followButtonContainer = document.getElementById('button_container')
        let followUserButton = document.getElementById('follow_button')
        fillfollowUserButtonText(followUserButton)
        displayToggle(followButtonContainer)

        let followersButton = document.getElementById('followers_button')
        followersButton.onclick = () => {
            window.location.assign(`followers.html?id=${ownerOfPage.id}`)
        }

        followUserButton.onclick = () => {
            followUserButton.disabled = true
            let loadUserDataPath = new URL(window.location.origin)
            loadUserDataPath.pathname = '/api/user/follow'
            loadUserDataPath.searchParams.append('id', ownerOfPage.id)
            loadUserDataPath.searchParams.append('setfollow', !doIFollowOwnerOfPage)
            fetch(loadUserDataPath.href, {
                method: 'POST',
                redirect: 'error',
                credentials: 'same-origin'
            }).then(response => {
                if (!(response.status == 200)) {
                    throw 'Oops! Something got broken'
                }
                //     return response.json()
                // }).then(body => {
                //     if (!body) {
                //         throw 'Oops! Body of response is undefined'
                //     }
                else {
                    doIFollowOwnerOfPage = !doIFollowOwnerOfPage
                    fillfollowUserButtonText(followUserButton)
                }
                followUserButton.disabled = false
            }).catch(error => {
                console.log(error)
                alert(error)
            })
        }
    }
    else {
        let addProfilePhotoButton = document.getElementById('add_profile_photo_button')
        addProfilePhotoButton.style.display = 'initial'
        let addProfilePhotoInput = document.getElementById('profile_photo_input')
        addProfilePhotoInput.onchange = postAvatar
        // () => {
        //     this
        //     postAvatar(this.files)
        // }
    }
}

function postAvatar() {
    if (!verifyTypeOfFiles(extentionsOfImages, this.files[0])) {
        alert('Forbidden extention of file, please, pick up other')
        return
    }
    let assetData
    postAsset(this.files[0]).then(body => {
        assetData = body
        return addAssetToAlbum(assetData)

    }).then(() => {
        initiateUserDataLoading(false)
    }).catch(error => {
        console.log(error); alert(error)
    })
}

function addAssetToAlbum(assetData) {
    let addAssetToAlbumURL = new URL(window.location.origin)
    addAssetToAlbumURL.pathname = '/api/asset/setavatar'
    return fetch(addAssetToAlbumURL.href, {
        method: 'POST',
        redirect: 'error',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ id: assetData.id })
    }).then(response => {
        if (response.status !== 200) {
            throw new Error('Unexpected response status')
        }
    })
}

function fillfollowUserButtonText(button) {
    button.textContent = doIFollowOwnerOfPage ? 'Unfollow' : 'Follow'
}

function displayToggle(element) {
    element.classList.toggle('display_toggle')
}

function updatePosts() {
    let postURL = new URL(window.location.origin)
    postURL.pathname = '/api/post'
    postURL.searchParams.append('id', ownerOfPage.id)
    fetch(postURL.href,
        {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => {
            if (response.status !== 200) {
                throw new Error('Unexpected response status')
            }
            return response.json()
        }).then(postArray => {
            renderPosts(postArray)
        })

}

function renderPosts(postArray) {
    let allPostsContainer = document.getElementById('all_posts_container')
    while (allPostsContainer.hasChildNodes()) {
        allPostsContainer.removeChild(allPostsContainer.firstChild)
    }
    postArray.forEach(post => {
        let postContainer = document.createElement('div')
        postContainer.classList.add('content_block', 'content_bg_color', 'post')

        let nameOfPostOwner = document.createElement('a')

        // let iconOfPosrOwner = document.createElement('img') 
        // iconOfPosrOwner.setAttribute('src', ``)

        nameOfPostOwner.textContent = `${post.Owner.firstName}` + ' ' + `${post.Owner.lastName}`
        let postOwnerURL = new URL(window.location.origin)
        postOwnerURL.pathname = '/html/home.html'
        postOwnerURL.searchParams.append('id', `${post.Owner.id}`)
        nameOfPostOwner.setAttribute('href', `${postOwnerURL.href}`)

        let nameOfPostOwnerContainer = document.createElement('div')
        nameOfPostOwnerContainer.classList.add('username_post')
        nameOfPostOwnerContainer.append(nameOfPostOwner)
        postContainer.appendChild(nameOfPostOwnerContainer)

        let textOfPost = document.createElement('p')
        textOfPost.textContent = `${post.text}`
        postContainer.appendChild(textOfPost)

        let postAssetsContainer = document.createElement('div')
        postAssetsContainer.classList.add('post_asset_container')
        post.Assets.forEach(asset => {
            let assetView = document.createElement('img')
            assetView.className = 'asset_view_img'
            assetView.setAttribute('src', `${asset.path}`)
            postAssetsContainer.appendChild(assetView)
        })
        postContainer.appendChild(postAssetsContainer)

        allPostsContainer.appendChild(postContainer)
    })
}



