import React from 'react'
import classNames from 'classnames'

export const Split = ({className, children}) => {
  return (
    <div className={className + ' Split'}>
      {children}
    </div>
  )
}

export const SplitLeft = ({children}) => {
  return (
    <div className='Split-left'>
      {children}
    </div>
  )
}

export const SplitRight = ({children}) => {
  return (
    <div className={classNames('Split-right', {'Split-right--visible': children})}>
      {children}
    </div>
  )
}
