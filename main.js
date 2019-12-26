(function () {

  const uslBase = "https://lighthouse-user-api.herokuapp.com/api/v1/users"
  const userContainer = document.querySelector('.userContainer')
  const memberTotal = document.querySelector('#memberTotal')
  const data = []
  const list = JSON.parse(localStorage.getItem('favoriteFriend')) || []
  let currentPage = 'home'

  axios.get(uslBase)
    .then(function (response) {
      data.push(...response.data.results)
      displayMembers(data)
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })

  //rendor data
  function displayMembers(data) {

    //total member amount
    let memberNr = data.length
    memberTotal.innerText = `(${memberNr})`
    //list all members in HTML
    let memberHTML = ``
    data.forEach((dataInfo) => {
      memberHTML += `
            <div class="col-auto card shadow p-3 mb-5 bg-white rounded" id="memberBox" style = "width: 13rem;" data-id="${dataInfo.id}">
            <img src="${dataInfo.avatar}" data-id="${dataInfo.id}" class="card-img-top memberAvatar" data-toggle="modal" data-target="#memberModal">
            <div class="card-body" data-id="${dataInfo.id}">
            <p class="card-text font-weight-bold text-center" data-id="${dataInfo.id}">${dataInfo.name} ${dataInfo.surname}</p>
            </div>
            <div class="locate d-flex justify-content-center" data-id="${dataInfo.id}">
            <div class="fas fa-map-marker-alt" data-id="${dataInfo.id}"></div>
            <div class="region" data-id="${dataInfo.id}">${dataInfo.region}</div>
            <i id="heartIcon" data-id="${dataInfo.id}" class="${iconCheck(dataInfo.id)}"></i>
            </div>
            </div>
            `
      userContainer.innerHTML = memberHTML
    })
  }

  //rendor favorite page data
  function favoritePage(data) {

    //total member amount
    let memberNr = data.length
    memberTotal.innerText = `(${memberNr})`

    //list all members in HTML
    let memberHTML = ''
    data.forEach((dataInfo) => {
      memberHTML += `
            <div class="col-auto card shadow p-3 mb-5 bg-white rounded" id="memberBox" style = "width: 13rem;" data-id="${dataInfo.id}">
            <img src="${dataInfo.avatar}" data-id="${dataInfo.id}" class="card-img-top memberAvatar" data-toggle="modal" data-target="#memberModal">
            <div class="card-body" data-id="${dataInfo.id}">
            <p class="card-text font-weight-bold text-center" data-id="${dataInfo.id}">${dataInfo.name} ${dataInfo.surname}</p>
            </div>
            <div class="locate d-flex justify-content-center" data-id="${dataInfo.id}">
            <div class="fas fa-map-marker-alt" data-id="${dataInfo.id}"></div>
            <div class="region" data-id="${dataInfo.id}">${dataInfo.region}</div>
            <i id="heartIcon" data-id="${dataInfo.id}" class="fas fa-heart"></i>
            </div>
            </div>
            `
    })
    userContainer.innerHTML = memberHTML
  }

  // add to favorite friend list
  function addFriend(id) {


    const friend = data.find(item => item.id === Number(id))


    if (list.some(item => item.id === Number(id))) {
      alert(`${friend.name} is already in your favorite list.`)
    } else {
      list.push(friend)
    }
    localStorage.setItem('favoriteFriend', JSON.stringify(list))
  }

  //remove from favorite friend list
  function removeFriend(id) {
    // find movie by id
    const index = list.findIndex(item => item.id === Number(id))
    if (index === -1) return

    // removie movie & update localStorage
    list.splice(index, 1)
    localStorage.setItem('favoriteFriend', JSON.stringify(list))

    //refresh the page only at favorite page
    if (currentPage === 'favorite') {
      favoritePage(list)
    }
  }

  //home & favorite page
  const nav = document.querySelector('nav')
  nav.addEventListener('click', (event) => {
    if (event.target.matches('#favoritePage')) {
      currentPage = 'favorite'
      favoritePage(list)
    } if (event.target.matches('#homePage')) {
      currentPage = 'home'
      displayMembers(data)
    }
  })

  //userContainer event listener
  userContainer.addEventListener('click', (event) => {

    //heart icon
    const heartIcon = event.target
    const friendId = event.target.dataset.id

    if (heartIcon.matches('.far')) {
      heartIcon.className = "fas fa-heart"
      addFriend(friendId)

    } else if (heartIcon.matches('.fas')) {
      heartIcon.className = "far fa-heart"
      removeFriend(friendId)
    }

    //modal
    const userId = event.target.dataset.id
    const modalHTML = document.querySelector('.modal')
    const showIdUrl = uslBase + '/' + userId

    axios.get(showIdUrl)
      .then(function (response) {
        const { birthday, name, surname, email, region, avatar, age, currentUpdate, gender } = response.data;

        function genderCheck() {
          if (gender === 'male') {
            let genderIcon = 'fas fa-male'
            return genderIcon
          } else if (gender === 'female') {
            let genderIcon = 'fas fa-female'
            return genderIcon
          }
        }

        let modalInnerHTML = `
        <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title">${name} ${surname}</h5>
        <div class="${genderCheck()} genderIcon align-self-center"></div>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="modal-body d-flex flex-column justify-content-center">
        <img src="${avatar}" class="modalAvatar rounded-circle img-thumbnail" alt="">
        <div class="birth d-flex">
        <i class="fas fa-birthday-cake d-flex align-items-center"></i>
        <div class="birthText">${birthday} (${age})</div>
              </div>
              <div class="modalLocate d-flex align-items-center">
              <i class="fas fa-map-marker-alt"></i>
              <div class="regionText">${region}</div>
              </div>
              <div class="modalEmail d-flex align-items-center">
              <i class="far fa-envelope"></i>
              <div class="emailText">${email}</div>
              </div>
              <div class="modalcurrent d-flex align-items-center">
              <i class="fas fa-user-edit"></i>
              <div class="currentText">current updated time: <br> ${currentUpdate}</div>
              </div>
              </div>
              <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
              </div>
              </div>
              `
        modalHTML.innerHTML = modalInnerHTML
      })
      .catch(function (error) {
        console.log(error)
      })
  })

  $('#memberModal').on('hidden.bs.modal', function () {
    document.querySelector('.modal').innerHTML = ''
  })

  //check id to mark as favorite icon
  function iconCheck(id) {
    if (list.some((el) => el.id === id)) {
      return 'fas fa-heart'
    } else {
      return 'far fa-heart'
    }
  }

})()


