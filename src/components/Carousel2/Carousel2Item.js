import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function Carousel2Item(props) {
  const { chassName: classNameProp, children, ...other } = props;
  const className = classnames('d-carousel2-item', classNameProp);
  return (
    <div className={className} {...other}>
      {children}
    </div>
  );
}

Carousel2Item.propTypes = {
  /**
   * ignore
   */
  className: PropTypes.string,
  /**
   * ignore
   */
  children: PropTypes.node,
};

export default Carousel2Item;
