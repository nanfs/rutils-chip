import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { addEventListener, ownerWindow } from 'dom-helpers'
import debounce from 'lodash/debounce'
import { Icon } from 'antd'

class Carousel1 extends React.Component {
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
    const carouselWidth = carouselNode.clientWidth
    this.setState({
      carouselWidth
    })
  }, 166)

  handlePrev = () => {
    let currentIndex = this.getCurrentIndex()
    currentIndex--
    if (currentIndex >= 0) {
      this.requestCurrentIndex(currentIndex)
    }
  }

  handleNext = () => {
    let currentIndex = this.getCurrentIndex()
    const len = this.getLen()
    currentIndex++
    if (currentIndex < len) {
      this.requestCurrentIndex(currentIndex)
    }
  }

  getCurrentIndex = () => {
    return this.isControlled ? this.props.currentIndex : this.state.currentIndex
  }

  getLen = () => {
    const { children, shwoNum } = this.props

    const childNum = Array.isArray(children) ? children.length : 1
    const len = childNum - shwoNum + 1
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
      shwoNum,
      defaultCurrentIndex,
      currentIndex: currentIndexProp,
      ...other
    } = this.props
    const { carouselWidth } = this.state
    const itemWidth = carouselWidth / shwoNum
    const className = classnames('d-carousel1', classNameProp)
    const currentIndex = this.getCurrentIndex()
    const style = {
      left: -1 * currentIndex * itemWidth
    }
    const total = Array.isArray(children) ? children.length : 1
    return (
      <div
        className={className}
        ref={node => (this.carousel = node)}
        {...other}
      >
        <div className="d-carousel1-wrapper" style={style}>
          {React.Children.map(children, child => {
            if (this.mounted) {
              return React.cloneElement(child, {
                style: {
                  ...child.style,
                  width: itemWidth
                }
              })
            }
            return child
          })}
        </div>
        <Icon
          type="left"
          className={classnames(
            'd-carousel1-prev',
            currentIndex === 0 ? 'disabled' : null
          )}
          onClick={this.handlePrev}
          title={currentIndex === 0 ? '没有更多了' : null}
        />
        <Icon
          type="right"
          className={classnames(
            'd-carousel1-next',
            total - currentIndex === shwoNum ? 'disabled' : null
          )}
          onClick={this.handleNext}
          title={total - currentIndex === shwoNum ? '没有更多了' : null}
        />
      </div>
    )
  }
}

Carousel1.propTypes = {
  /**
   * ignore
   */
  className: PropTypes.string,
  /**
   * ignore
   */
  children: PropTypes.node,
  shwoNum: PropTypes.number,
  currentIndex: PropTypes.number,
  defaultCurrentIndex: PropTypes.number,
  onCurrentIndexChange: PropTypes.func
}

Carousel1.defaultProps = {
  shwoNum: 3,
  defaultCurrentIndex: 0
}

export default Carousel1
