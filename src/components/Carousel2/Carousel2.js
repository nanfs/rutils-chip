import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { ownerWindow, addEventListener } from 'dom-helpers'
import debounce from 'lodash/debounce'

class Carousel2 extends React.Component {
  constructor(props) {
    super(props)
    this.mounted = false
    this.isControlled = this.props.currentIndex !== undefined
    this.state = {
      carouselWidth: null,
      currentIndex: this.props.defaultCurrentIndex
    }
  }

  componentDidMount() {
    const carouselNode = ReactDOM.findDOMNode(this.carousel)
    this.mounted = true
    const win = ownerWindow(carouselNode)
    this.onResizeListener = addEventListener(win, 'resize', this.handleResize)
    this.handleResize()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.change === 'true') {
      this.setState({ currentIndex: 0 })
    }
  }

  componentWillUnmount() {
    this.onResizeListener.remove()
  }

  handleResize = debounce(() => {
    const carouselNode = ReactDOM.findDOMNode(this.carousel)
    const len = this.getLen()
    let carouselWidth = carouselNode ? carouselNode.clientWidth : '1000'
    if (len) {
      carouselWidth -= 18 // 减去pading-left
    }
    this.setState({
      carouselWidth
    })
  }, 166)

  handleDotClick = currentIndex => {
    this.requestCurrentIndex(currentIndex)
  }

  getCurrentIndex = () => {
    return this.isControlled ? this.props.currentIndex : this.state.currentIndex
  }

  getLen = () => {
    const { children, shwoNum } = this.props

    const childNum = Array.isArray(children) ? children.length : 1
    const len = Math.ceil(childNum / shwoNum)
    return len
  }

  requestCurrentIndex = currentIndex => {
    if (!this.isControlled) {
      this.setState({ currentIndex })
    }
    if (this.props.onCurrentIndexChange) {
      this.props.onCurrentIndexChange(currentIndex)
    }
  }

  render() {
    const {
      className: classNameProp,
      children,
      style: styleProp,
      shwoNum,
      height,
      defaultCurrentIndex,
      currentIndex: currentIndexProp,
      ...other
    } = this.props

    const { carouselWidth } = this.state
    const itemWidth = carouselWidth / shwoNum
    const itemMaxWidth = `${100 / shwoNum}%`
    const len = this.getLen()
    const className = classnames('d-carousel2', classNameProp, {
      'has-dots': len > 0
    })
    const currentIndex = this.getCurrentIndex()
    const style = {
      ...(style || {}),
      height
    }
    const wrapperStyle = {
      top: -1 * currentIndex * height
    }
    const dots = []
    for (let i = 0; i < len; i++) {
      const dotClassName = classnames('d-carousel2-dot', {
        active: currentIndex === i
      })
      const dot = (
        <div
          key={i}
          className={dotClassName}
          style={{ height: Math.floor(height / len) }}
          onClick={this.handleDotClick.bind(null, i)}
        />
      )
      dots.push(dot)
    }
    return (
      <div
        style={style}
        className={className}
        ref={node => (this.carousel = node)}
        {...other}
      >
        <div className="d-carousel2-wrapper clearfix" style={wrapperStyle}>
          {React.Children.map(children, (child, index) => {
            const childStyle = {
              ...child.style,
              height
            }
            if (this.mounted) {
              childStyle.width = itemWidth
              childStyle.maxWidth = itemMaxWidth
            }
            return React.cloneElement(child, {
              key: index,
              style: childStyle
            })
          })}
        </div>
        {children.length - 4 > 0 && (
          <div className="d-carousel2-dots">{dots}</div>
        )}
      </div>
    )
  }
}

Carousel2.propTypes = {
  /**
   * ignore
   */
  className: PropTypes.string,
  /**
   * ignore
   */
  children: PropTypes.node,
  /**
   * ignore
   */
  style: PropTypes.object,
  shwoNum: PropTypes.number,
  height: PropTypes.number,
  currentIndex: PropTypes.number,
  defaultCurrentIndex: PropTypes.number,
  onCurrentIndexChange: PropTypes.func
}

Carousel2.defaultProps = {
  shwoNum: 4,
  defaultCurrentIndex: 0
}

export default Carousel2
