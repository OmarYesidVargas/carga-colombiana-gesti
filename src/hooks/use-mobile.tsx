import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on mount
    checkMobile()
    
    // Add event listener
    window.addEventListener("resize", checkMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return !!isMobile
}

export function useTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }
    
    // Check on mount
    checkTablet()
    
    // Add event listener
    window.addEventListener("resize", checkTablet)
    
    // Clean up
    return () => window.removeEventListener("resize", checkTablet)
  }, [])

  return !!isTablet
}

// Keep the original function for backward compatibility
export function useIsMobile() {
  return useMobile()
}
