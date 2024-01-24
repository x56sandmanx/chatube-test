import ReactDOM from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'
import Home from './pages/Home'
import CharacterPage from './pages/CharacterPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import CategorySearch from './pages/CategorySearch'
import CreateCharacter from './pages/CreateCharacter'
import EditCustomizedCharacter from './pages/EditCustomizedCharacter'
import ProfilePage from './pages/ProfilePage'
import CreatePersona from './pages/CreatePersona'
import EditPersona from './pages/EditPersona'
import Community from './pages/Community'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signUp' element={<SignUp />}/>
        {/* Added :characterId to the CharacterPage path */}
        <Route path='/CharacterPage/:characterId' element={<CharacterPage />}/>
        <Route path='/CharacterPage/' element={<CharacterPage />}/>
        <Route path='/CategorySearch' element={<CategorySearch />}/>
        <Route path='/CreateCharacter' element={<CreateCharacter />}/>
        <Route path='/EditCharacter' element={<EditCustomizedCharacter />}/>
        <Route path='/ProfilePage' element={<ProfilePage />}/>
        <Route path='/CreatePersona' element={<CreatePersona />}/>
        <Route path='/EditPersona' element={<EditPersona />}/>
        <Route path='/Community' element={<Community />}/>
      </Routes>
    </HashRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
