import './App.css'
import { NavBar, HeroSection, Footer } from "./components/Homepage"
import { ArticleSection } from "./components/ArticleSection"
// Main App component - Combines NavBar and HeroSection
function App() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </>
  )
}

export default App