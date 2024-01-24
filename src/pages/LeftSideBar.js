import homeIcon from '../assets/icons/homeIcon.png'
import createIcon from '../assets/icons/createIcon.png'
import communityIcon from '../assets/icons/communityIcon.png'
import { Characters } from '../utilities/Characters'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LoginCreds } from '../utilities/loginCreds'

function LeftSideBar() {
  const navigate = useNavigate()
  const [personalitySelection, setPersonalitySelection] = useState('Snarky')
  const [categorySelection, setCategorySelection] = useState('')

  const handleNavigate = (index) => {
    switch(index) {
      case 0:
        navigate('/')
        break
      case 1:
        if(LoginCreds.devToken === '')
          navigate('/Login')
        else
          navigate('/CreateCharacter')
        break
      case 2:
        navigate('/Community')
        break
      default:
        navigate('/')
    }
  }

  const handleNavigateToCategory = (category) => {
    setCategorySelection(category.categoryName)
    navigate('/CategorySearch', { state: { selectedCategory: category }})
  }

  function LeftSideIcon({ icon, name, index }) {
    return (
      <div onClick={() => handleNavigate(index)} className='icon'>
        <img src={icon} alt='icon' />
        <p>{name}</p>
      </div>
    )
  }

  function LeftSideDropDown({ header }) {
    return(
      <div className='leftSideSelection'>
        {header === 'Category' && (
          <h2 style={{ marginBottom: '20px', marginTop: '40px'}}>Customize</h2>
        )}
        <h3>{header}</h3>
        {header === 'Category' ? (
          <select defaultValue={categorySelection}>
            <option value=''>-- Choose One --</option>
            {Characters.categories.map((category) => {
              return (
                <option key={category.categoryId} value={category.categoryName} onClick={() => handleNavigateToCategory(category)}>{category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1)}</option>
              )
            })}
          </select>
        ) : (
          <select value={personalitySelection} onChange={(e) => setPersonalitySelection(e.target.value)}>
            <option value='Snarky'>Snarky</option>
            <option value='Wise'>Wise</option>
            <option value='Humorous'>Humorous</option>
            <option value='Sarcastic'>Sarcastic</option>
          </select>
        )} 
      </div>
    )
  }

  return (
    <div className='leftSideBar'>
      <LeftSideIcon
        icon={homeIcon}
        name={'Home'}
        index={0}
      />
      <LeftSideIcon
        icon={createIcon}
        name={'Create'}
        index={1}
      />
      <LeftSideIcon
        icon={communityIcon}
        name={'Community'}
        index={2}
      />
    </div>
  )
}

export default LeftSideBar