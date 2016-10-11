import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
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

const FirstChild = ({children}) => {
  return React.Children.toArray(children)[0] || null
}

export const SplitRight = ({children}) => {
  console.log(children)
  return (
    <div className={classNames('Split-right', {'Split-right--visible': children})}>
      <ReactCSSTransitionGroup
        component={FirstChild}
        transitionName='split'
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {children}
      </ReactCSSTransitionGroup>
    </div>
  )
}
