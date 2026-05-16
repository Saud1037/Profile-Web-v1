import { getAllSiteData } from '@/lib/data'
import { Navbar } from '@/components/ui/Navbar'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { SocialSection } from '@/components/sections/SocialSection'
import { TerminalSection } from '@/components/terminal/TerminalSection'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const data = await getAllSiteData()

  return (
    <main className="relative z-10 min-h-screen">
      <Navbar profile={data.profile} />
      <HeroSection profile={data.profile} />
      <ProjectsSection projects={data.projects} />
      <SkillsSection skillGroups={data.skillGroups} />
      <SocialSection socialLinks={data.socialLinks} />
      <TerminalSection data={data} />
    </main>
  )
}
