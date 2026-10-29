import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
  wide?: boolean
}

export default function Container({ children, className = '', wide = false }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${wide ? 'max-w-[1600px]' : 'max-w-[1100px]'} ${className}`}>
      {children}
    </div>
  )
}
