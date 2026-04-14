import React from 'react'

interface KedLoaderProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  className?: string
}

const KedLoader: React.FC<KedLoaderProps> = ({ size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-pulse`}>
        <img 
          src="/IamKed.png" 
          alt="Loading..." 
          className="w-full h-full object-contain animate-spin"
          style={{
            animation: 'spin 2s linear infinite'
          }}
        />
      </div>
    </div>
  )
}

export default KedLoader
