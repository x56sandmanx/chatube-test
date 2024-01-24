import { useEffect, useState } from 'react'
import { Characters } from '../utilities/Characters'
import { BaseURL } from '../utilities/BaseURL'
import { ToastContainer } from 'react-toastify'
import { UserPersonaTile } from '../utilities/CharacterTiles'

import arrowIcon from '../assets/icons/arrow.png'

import Footer from './Footer'
import '../css/Home.css'
import '../css/Home-Mobile.css'
import ChatubeHeader from './ChatubeHeader'
import LeftSideBar from './LeftSideBar'
import { LoginCreds } from '../utilities/loginCreds'

function Community() {
  const [userPersonas, setUserPersonas] = useState([])

  useEffect(() => {
    if(Characters.userPersonas.length < 2) {
      fetch(`${BaseURL}/getPublicUserPersonas`)
      .then((res) => res.json())
      .then((data) => { sortUserPersonas(data.response.userPersonas) })
    } else
      setUserPersonas(Characters.userPersonas)
  }, [])

  const sortUserPersonas = (userPersonas) => {
    const sortedPersonas = userPersonas.sort((a, b) => {
      if (b.userPersonaLikeCount !== a.userPersonaLikeCount)
        return b.userPersonaLikeCount - a.userPersonaLikeCount
      return new Date(a.userPersonaCreatedDate) - new Date(b.userPersonaCreatedDate)
    })

    Characters.userPersonas = sortedPersonas
    setUserPersonas(Characters.userPersonas)
  }

  const handleSendLike = (e, character) => {
    e.stopPropagation()
    fetch(`${BaseURL}/sendLike?devToken=${LoginCreds.devToken}&characterId=${character.userPersonaId}`)
    .then((res) => res.json())
    .then((data) => {
      const userPersonaIndex = Characters.userPersonas.findIndex((persona) => persona.userPersonaId === character.userPersonaId)
      Characters.userPersonas[userPersonaIndex].userPersonaLikeCount = data.response.updatedLikeCount
      setUserPersonas([...Characters.userPersonas])
      LoginCreds.userLikes.push(character.userPersonaId)
    })
  }

  const handleRemoveLike = (e, character) => {
    e.stopPropagation()
    fetch(`${BaseURL}/removeLike?devToken=${LoginCreds.devToken}&characterId=${character.userPersonaId}`)
    .then((res) => res.json())
    .then((data) => {
      const userPersonaIndex = Characters.userPersonas.findIndex((persona) => persona.userPersonaId === character.userPersonaId)
      Characters.userPersonas[userPersonaIndex].userPersonaLikeCount = data.response.updatedLikeCount
      setUserPersonas([...Characters.userPersonas])
      const index = LoginCreds.userLikes.findIndex((item) => item === character.userPersonaId)
      LoginCreds.userLikes.splice(index, 1)
    })
  }

  function ChatubeUserPersonas() {
    const [userPersonasPerPage, setCharactersPerPage] = useState(18)
    const [currentPage, setCurrentPage] = useState(() => {
      return parseInt(localStorage.getItem('currentCommunityPage')) || 1
    })
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
      window.addEventListener('resize', updateWindowWidth)

      return () => {
        window.removeEventListener('resize', updateWindowWidth)
      }
    }, [])

    useEffect(() => {
      const userPersonasPerRow = Math.floor(windowWidth / 200)
      let userPersonasPerPageCalculated = userPersonasPerRow * 2
      if (userPersonasPerPageCalculated < 4)
        userPersonasPerPageCalculated = 4

      setCharactersPerPage(userPersonasPerPageCalculated)
    }, [windowWidth])

    useEffect(() => {
      localStorage.setItem('currentCommunityPage', currentPage)
    }, [currentPage])

    const indexOfLastPersona = currentPage * userPersonasPerPage
    const indexOfFirstPersonas = indexOfLastPersona - userPersonasPerPage
    const currentUserPersonas = userPersonas.slice(indexOfFirstPersonas, indexOfLastPersona)
    const totalPages = Math.ceil(userPersonas.length / userPersonasPerPage)

    return (
      <div className='characters'>
        {userPersonas.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className='all-character-grid-container'>
            <h2 className='communityTitle'>Community</h2>
            <div className='all-character-grid'>
              {currentUserPersonas.map((userPersonaObj) => (
                <UserPersonaTile
                  key={userPersonaObj.userPersonaId}
                  character={userPersonaObj}
                  handleSendLike={handleSendLike}
                  handleRemoveLike={handleRemoveLike}
                />
              ))}
            </div>
            <div className='pagination'>
              <img className={`leftArrow ${currentPage === 1 ? 'disabled-arrow' : ''}`} onClick={() => setCurrentPage((prevPage) => Math.max(prevPage-1, 1))} src={arrowIcon} alt='arrowIcon'/>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <img className={`rightArrow ${currentPage === totalPages ? 'disabled-arrow' : ''}`} onClick={() => setCurrentPage((prevPage) => Math.min(prevPage+1, totalPages))} src={arrowIcon} alt='arrowIcon'/>
            </div>
          </div>
        )}
      </div>
    )
  }

  return(
    <div className='App'>
      <header className='App-header'>
        <ChatubeHeader />
        <LeftSideBar />
        <ChatubeUserPersonas />
        <ToastContainer />
        <Footer />
      </header>
    </div>
  )
}

export default Community
