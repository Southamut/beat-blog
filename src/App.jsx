import './App.css'
import { NavBar, HeroSection, Footer, ArticleSection } from "./components/Homepage"
// Main App component - Combines NavBar and HeroSection
function App() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <ArticleSection  />
      <Footer />
    </>
  )
}

export default App