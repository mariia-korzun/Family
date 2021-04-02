
let usersContainer = document.getElementById('users_container')
let searchUserInput = document.getElementById('search')
let searchIcon = document.getElementById('search_icon')
let stopSearchButton = document.getElementById('stop_search_button')



searchUserInput.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        searchUser()
    }
})

searchIcon.onclick = searchUser
stopSearchButton.onclick = ()=>{ loadUserFollowers(null)}
initiateUserDataLoading()


function initiateUserDataLoading() {
    let queryParams = window.location.search
    let idParam = 'id'
    // if (!queryParams) {
    //     loadUserData(null)
    //     return
    // }
    let param = new URLSearchParams(queryParams)
    if (param.has(idParam)) {
        loadUserFollowers(param.get('id'))
        return
    }
    loadUserFollowers(null)
}

function loadUserFollowers(id) {
    let loadUserDataPath = new URL(window.location.origin)
    loadUserDataPath.pathname = '/api/user/followers'
    if (id) { loadUserDataPath.searchParams.append('id', id) }
    fetch(loadUserDataPath.href, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'same-origin'
    }).then(response => {
        if (!(response.status == 200)) {
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
            renderFollowerList(body.Followers)
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

function clearContainer(container) {
    while (container.children[0]) {
        container.firstChild.remove()
    }
}


function renderFollowerList(followers) {

    clearContainer(usersContainer)

    if (followers.length === 0) {
        let message = document.createElement('li')
        message.textContent = "User hasn't followers"
        usersContainer.appendChild(message)
        return
    }
    renderList(followers, usersContainer)
}


function renderList(arrayOfUsers, container) {
    arrayOfUsers.forEach(user => {

        let followerLink = document.createElement('a')
        followerLink.setAttribute('href', `/html/home.html?id=${user.id}`)

        let userName = document.createElement('span')
        userName.textContent = `${user.firstName}` + ' ' + `${user.lastName}`
        let followerPhoto = document.createElement('img')
        followerPhoto.className = 'photo_avatar_small'

        if (user.Albums.length === 0) {
            followerPhoto.setAttribute('src', `/images/avatar.png`)
        }
        else {
            let photoId = user.Albums[0].Assets[user.Albums[0].Assets.length - 1].id
            followerPhoto.setAttribute('src', `/api/asset/${photoId}`)
        }

        followerLink.appendChild(followerPhoto)
        followerLink.appendChild(userName)

        let followerWrapper = document.createElement('li')
        followerWrapper.appendChild(followerLink)

        container.appendChild(followerWrapper)
    })
}

function renderSearchedUsersList(users) {

    clearContainer(usersContainer)

    if (users.length === 0) {
        let message = document.createElement('li')
        message.textContent = "There is no matches"
        usersContainer.appendChild(message)
        return
    }
    renderList(users, usersContainer)
}






function searchUser() {
    if (!searchUserInput.value) {
        alert('Please, insert name of user')
        return
    }
    let searchUserURL = new URL(window.location.origin)
    searchUserURL.pathname = '/api/user/searchUser'
    fetch(searchUserURL, {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({ name: searchUserInput.value }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!(response.status == 200)) {
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
            renderSearchedUsersList(body)
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