import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './Layout/Home'
import Header from './Components/Header'
import Footer from './Components/Footer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {/* <Header />
        <Home />
        <Footer /> */}
      </div>
    </>
  )
}

export default App
