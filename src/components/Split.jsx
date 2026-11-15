import { Fragment } from 'react'

// Splits a heading into masked words so GSAP can rise them in, line by line,
// while keeping the full sentence readable for screen readers.
export function Split({ text, as: Tag = 'span', className = '', ...rest }) {
  const words = text.split(' ')
  return (
    <Tag className={`split ${className}`} aria-label={text} {...rest}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span className="wi">{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
