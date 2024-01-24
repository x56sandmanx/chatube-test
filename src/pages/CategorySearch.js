import { React, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../css/CategorySearch.css'
import ChatubeHeader from './ChatubeHeader'
import LeftSideBar from './LeftSideBar'
import Footer from './Footer'

import backButton from '../assets/icons/backButton.png'
import { Characters } from '../utilities/Characters'

function CategorySearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const category = location.state.selectedCategory
  const characters = Characters.categoryCharacters[category.categoryId].characters

  function CharacterGrid({character}) {
    return(
      <div className='characterGrid' key={character.id} onClick={() => navigate('/CharacterPage', { state: { character: character, characterVariant: character.characterIsPublic ? 1 : 0 } })}>
        <img src={character.characterImage} alt='avatarImg' />
        <p>{character.characterName}</p>
        <p className='characterDescription'>{character.characterDesc.length > 80 ? `${character.characterDesc.slice(0,80)}...` : character.characterDesc}</p>
      </div>
    )
  }

  return (
    <div className='App'>
      <div className='App-header'>
        <ChatubeHeader/>
        <LeftSideBar />
        <div className='categorySearchContainer'>
          <div className='categorySearchHeader'>
            <img onClick={() => navigate('/')} className='categoryBackButton' src={backButton} alt='backButton' />
            <h1>{category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1)} Category</h1>
          </div>
          <div className='categorySearchGrid'>
          {characters.map((character) => {
              return (
                <CharacterGrid
                  key={character.characterId}
                  character={character}
                />
              )
            })}
          </div>
        </div>
        <Footer />
      </div>
    </div> 
  )
}

export default CategorySearch