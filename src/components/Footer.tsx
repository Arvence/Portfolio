import { useEffect, useRef } from 'react'
import Container from './Container'

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const updateHeight = () => {
      document.documentElement.style.setProperty('--footer-height', `${footer.getBoundingClientRect().height}px`)
    }
    const observer = new ResizeObserver(updateHeight)
    updateHeight()
    observer.observe(footer)

    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--footer-height')
    }
  }, [])

  return (
    <footer
      ref={footerRef}
      className="shrink-0 border-t border-white/5 bg-[#0c0d0f]/15 text-[var(--color-text-muted)] backdrop-blur-sm"
    >
      <Container wide className="relative flex min-h-14 items-center justify-center py-3">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] leading-5 sm:text-xs">
          <span>© 2026 Alper Senpacaci</span>
          <span aria-hidden="true" className="text-[#a5d2f0]/50">
            ·
          </span>
          <span className="transition-colors hover:text-[#d9e8f4]">Privacy</span>
          <span aria-hidden="true" className="text-[#a5d2f0]/50">
            ·
          </span>
          <span className="transition-colors hover:text-[#d9e8f4]">Status</span>
        </p>
      </Container>
    </footer>
  )
}
