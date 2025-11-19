
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Component/Layout/Layout'
import Home from './Component/Home/Home'

function App() {


  return (
    <>
    
      <Routes>
         <Route>
            <Route path="/" element={<Layout></Layout>}>
                <Route index element={<Home></Home>}></Route>
            </Route>
         </Route>
      </Routes>
    
    </>
  )
}

export default App
