import { getAllData } from '@/lib/store'
import { Navbar } from '@/components/ui/Navbar'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { SocialSection } from '@/components/sections/SocialSection'
import { TerminalSection } from '@/components/terminal/TerminalSection'

export const revalidate = 30

export default function HomePage() {
  const data = getAllData()
  const { theme } = data

  // Build inline CSS variables from saved theme
  const themeVars = `
    :root {
      --cyan: ${theme.cyan};
      --cyan-2: ${adjustColor(theme.cyan, -20)};
      --cyan-glow: ${theme.cyan}26;
      --purple: ${theme.purple};
      --green: ${theme.green};
      --green-2: ${adjustColor(theme.green, -20)};
      --green-glow: ${theme.green}1f;
      --bg-primary: ${theme.bgPrimary};
      --bg-secondary: ${theme.bgSecondary};
      --bg-tertiary: ${adjustColor(theme.bgSecondary, 10)};
      --surface: ${theme.surface};
      --surface-2: ${adjustColor(theme.surface, 8)};
      --surface-3: ${adjustColor(theme.surface, 16)};
      --border: ${theme.border};
      --border-2: ${adjustColor(theme.border, 15)};
      --text: ${theme.text};
      --text-2: ${adjustColor(theme.text, -40)};
      --text-3: ${theme.textMuted};
      --red: #ff4444;
      --amber: #fbbf24;
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeVars }} />
      <main className="relative z-10 min-h-screen">
        <Navbar profile={data.profile} />
        <HeroSection profile={data.profile} />
        <ProjectsSection projects={data.projects} />
        <SkillsSection skillGroups={data.skillGroups} />
        <SocialSection socialLinks={data.socialLinks} />
        <TerminalSection data={data} />
      </main>
    </>
  )
}

// Simple hex color adjustment
function adjustColor(hex: string, amount: number): string {
  try {
    const h = hex.replace('#', '')
    if (h.length !== 6) return hex
    const r = Math.max(0, Math.min(255, parseInt(h.slice(0, 2), 16) + amount))
    const g = Math.max(0, Math.min(255, parseInt(h.slice(2, 4), 16) + amount))
    const b = Math.max(0, Math.min(255, parseInt(h.slice(4, 6), 16) + amount))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  } catch { return hex }
}
