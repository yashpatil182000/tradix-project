import './landing.css'
import { AmbientBackground } from './components/effects/AmbientBackground'
import { JournalToast } from './components/effects/JournalToast'
import { MouseSpotlight } from './components/effects/MouseSpotlight'
import { ScrollProgress } from './components/effects/ScrollProgress'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ProductVisualization } from './components/ProductVisualization'
import { ProblemSection } from './components/ProblemSection'
import { HowItWorks } from './components/HowItWorks'
import { FeatureShowcase } from './components/FeatureShowcase'
import { AnalyticsPreview } from './components/AnalyticsPreview'
import { JournalPreview } from './components/JournalPreview'
import { RiskSection } from './components/RiskSection'
import { InsightsSection } from './components/InsightsSection'
import { DashboardPreview } from './components/DashboardPreview'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'

export function LandingPage() {
  return (
    <div className="landing-page dark relative min-h-svh bg-[#0B0B0C] text-[#F4F4F5] antialiased">
      <AmbientBackground />
      <MouseSpotlight />
      <ScrollProgress />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <ProductVisualization />
          <ProblemSection />
          <HowItWorks />
          <FeatureShowcase />
          <AnalyticsPreview />
          <JournalPreview />
          <RiskSection />
          <InsightsSection />
          <DashboardPreview />
          <FinalCTA />
        </main>
        <Footer />
      </div>
      <JournalToast />
    </div>
  )
}
