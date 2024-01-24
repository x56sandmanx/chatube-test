import { React } from 'react'
import { useEffect, useState } from 'react'
import { LoginCreds } from '../utilities/loginCreds'
import { Characters } from '../utilities/Characters'
import { BaseURL } from '../utilities/BaseURL'
import { ToastContainer } from 'react-toastify'
import { CharacterTile, MyCharacter } from '../utilities/CharacterTiles'
import ChatubeHeader from './ChatubeHeader'
import LeftSideBar from './LeftSideBar'
import Footer from './Footer'

import 'react-toastify/dist/ReactToastify.css'
import '../css/Home.css'
import '../css/Home-Mobile.css'

import arrowIcon from '../assets/icons/arrow.png'
import { SetLoginCreds } from '../utilities/Extensions'

function Home() {
  const [customizedCharacters, setCustomizedCharacters] = useState([])
  const [sortedCharacters, setSortedCharacters] = useState([])
  const [categoryCharacters, setCategories] = useState([])
  const [selectedButton, setSelectedButton] = useState(-1)
  const [loading, setLoading] = useState(true)
  var categoryButtons = []

  useEffect(() => {
    setLoading(true)
    const devToken = localStorage.getItem('devToken')

    if(devToken !== null && LoginCreds.devToken === '') {
      fetch(`${BaseURL}/loginWithDevToken?devToken=${devToken}`)
      .then((res) => res.json())
      .then((data) => { 
        SetLoginCreds(data.response.account)
        fetch(`${BaseURL}/getUserLikes?devToken=${devToken}`)
        .then((res) => res.json())
        .then((data) => { LoginCreds.userLikes = data.response.userLikes })
      })
    }

    if(Characters.allCharacters.length === 0) {
      if(LoginCreds.devToken !== '' || devToken !== null) {
        fetch(`${BaseURL}/getCustomizedCharacters?devToken=${LoginCreds.devToken !== '' ? LoginCreds.devToken : devToken}`)
        .then((res) => res.json())
        .then((data) => {
          if(data.response.customizedCharacters) {
            Characters.customizedCharacters = data.response.customizedCharacters
            setCustomizedCharacters(Characters.customizedCharacters)
          }
        })
      }

      fetch(`${BaseURL}/getAllCategories`)
      .then((res) => res.json())
      .then((data) => {
        
        Characters.categories = data.response.categories
        data.response.categories.forEach((category) => {
          const categoryObject = {categoryId: category.categoryId, categoryName: category.categoryName, characters: []}
          categoryButtons.push(categoryObject)
        })
        fetch(`${BaseURL}/getAllTags`)
        .then((res) => res.json())
        .then((data) => {
          Characters.tags = data.response.tags

          fetch(`${BaseURL}/getAllCharacters`)
          .then((res) => res.json())
          .then((data) => { sortCharacters(data.response.allCharacters.baseCharacters.concat(data.response.allCharacters.publicCustomizedCharacters)) })
        })
      })
    } else {
      setCustomizedCharacters(Characters.customizedCharacters)
      setSortedCharacters(Characters.sortedCharacters)
      setCategories(Characters.categoryCharacters)
    }
    setTimeout(() => {
      setLoading(false)
    }, 100)
    
  }, [])

  const sortCharacters = (characters) => {
    Characters.allCharacters = characters
    sortAllCharacters()
    sortCategoryCharacters(characters)
  }

  const sortAllCharacters = () => {
    const sortedCharacters = Characters.allCharacters.sort((a, b) => {
      if (b.characterLikeCount !== a.characterLikeCount)
        return b.characterLikeCount - a.characterLikeCount
      return new Date(a.characterCreatedDate) - new Date(b.characterCreatedDate)
    })

    Characters.sortedCharacters = sortedCharacters

    setSortedCharacters(sortedCharacters)
  }

  const sortCategoryCharacters = (characters) => {
    characters.forEach((character) => {
      categoryButtons.forEach((category) => {
        character.categoryIds.forEach((categoryId) => {
          if(categoryId === category.categoryId)
            category.characters.push(character)
        })
      })
    })

    categoryButtons.forEach((category) => {
      category.characters.sort((a, b) => b.characterLikeCount - a.characterLikeCount)
    })

    Characters.categoryCharacters = categoryButtons
    setCategories(categoryButtons)
  }

  const handleSendLike = (e, character, characterVariant) => {
    e.stopPropagation()
    fetch(`${BaseURL}/sendLike?devToken=${LoginCreds.devToken}&characterId=${character.characterId}`)
    .then((res) => res.json())
    .then((data) => {
      if(characterVariant === 0) {
        const characterIndex = Characters.categoryCharacters[selectedButton].characters.findIndex((char) => char.characterId === character.characterId)
        Characters.categoryCharacters[selectedButton].characters[characterIndex].characterLikeCount = data.response.updatedLikeCount
        setCategories([...Characters.categoryCharacters])
      } else {
        const characterIndex = Characters.sortedCharacters.findIndex((char) => char.characterId === character.characterId)
        Characters.sortedCharacters[characterIndex].characterLikeCount = data.response.updatedLikeCount
        setSortedCharacters([...Characters.sortedCharacters])
      }
      LoginCreds.userLikes.push(character.characterId)
    })
  }

  const handleRemoveLike = (e, character, characterVariant) => {
    e.stopPropagation()
    fetch(`${BaseURL}/removeLike?devToken=${LoginCreds.devToken}&characterId=${character.characterId}`)
    .then((res) => res.json())
    .then((data) => {
      if(characterVariant === 0) {
        const characterIndex = Characters.categoryCharacters[selectedButton].characters.findIndex((char) => char.characterId === character.characterId)
        Characters.categoryCharacters[selectedButton].characters[characterIndex].characterLikeCount = data.response.updatedLikeCount
        setCategories([...Characters.categoryCharacters])
      } else {
        const characterIndex = Characters.sortedCharacters.findIndex((char) => char.characterId === character.characterId)
        Characters.sortedCharacters[characterIndex].characterLikeCount = data.response.updatedLikeCount
        setSortedCharacters([...Characters.sortedCharacters])
      }
      const index = LoginCreds.userLikes.findIndex((item) => item === character.characterId)
      LoginCreds.userLikes.splice(index, 1)
    })
  }

  function ChatubeMyCharacters() {
    return (
      <div className='characters'>
        <h3>My Characters</h3>
        {customizedCharacters.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className='character-grid'>
            {customizedCharacters.map((character) => (
              <MyCharacter
                character={character}
                setCustomizedCharacters={setCustomizedCharacters}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  function CategoryButton({ title, id }) {
    return (
      <button onClick={() => setSelectedButton(id)} className={selectedButton === id ? 'selectedCategoryButton' : 'categoryButton'}>{title}</button>
    )
  }

  function CategoryButtons() {
    return (
      <div className='categoryButtons'>
        {categoryCharacters.map((category) => (
          <CategoryButton
            key={category.categoryId}
            title={category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1)}
            id={category.categoryId}
          />
        ))}
      </div>
    )
  }

  

  function SelectedCategory({index}) {
    const characterHeader = categoryCharacters[index].categoryName+" Category"

    return (
      <div id="moga-characters" className='characters'>
        <h3>{characterHeader.charAt(0).toUpperCase() + characterHeader.slice(1)}</h3>
        {categoryCharacters[index].characters.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className='character-grid'>
            {categoryCharacters[index].characters.map((characterObj) => (
              <CharacterTile
                key={characterObj.characterId}
                character={characterObj}
                characterVariant={0}
                handleSendLike={handleSendLike}
                handleRemoveLike={handleRemoveLike}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  function ChatubeCharacters() {
    const [charactersPerPage, setCharactersPerPage] = useState(18)
    const [currentPage, setCurrentPage] = useState(() => {
      return parseInt(localStorage.getItem('currentHomePage')) || 1
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
      const charactersPerRow = Math.floor(windowWidth / 255)
      let charactersPerPageCalculated = charactersPerRow * 2
      if (charactersPerPageCalculated < 4)
        charactersPerPageCalculated = 4

      setCharactersPerPage(charactersPerPageCalculated)
    }, [windowWidth])

    useEffect(() => {
      localStorage.setItem('currentHomePage', currentPage)
    }, [currentPage])

    const indexOfLastCharacter = currentPage * charactersPerPage
    const indexOfFirstCharacters = indexOfLastCharacter - charactersPerPage
    const currentCharacters = sortedCharacters.slice(indexOfFirstCharacters, indexOfLastCharacter)
    const totalPages = Math.ceil(sortedCharacters.length / charactersPerPage)

    return (
      <div className='characters'>
        {sortedCharacters.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className='all-character-grid-container'>
            <div className='all-character-grid'>
              {currentCharacters.map((characterObj) => (
                <CharacterTile
                  key={characterObj.characterId}
                  character={characterObj}
                  characterVariant={1}
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
        {!loading && (
          <>
            <ChatubeHeader />
            <LeftSideBar />
            {customizedCharacters.length !== 0 && (
              <ChatubeMyCharacters />
            )}
            {selectedButton !== -2 && (
              <>
                <CategoryButtons />
                {selectedButton !== -1 && (
                  <SelectedCategory
                    index={selectedButton}
                  />
                )}
              </>
            )}
            <ChatubeCharacters />
            <ToastContainer />
            <Footer />
          </>
        )}
        
      </header>
    </div>
  )
}

export default Home
