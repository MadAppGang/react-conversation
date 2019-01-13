import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { px, sum, pluck } from './utils';
import './index.css';

class Conversation extends Component {
  constructor() {
    super();

    this.state = {
      childrenHeights: [],
    };
  }

  static getDerivedStateFromProps({ children }, { childrenHeights }) {
    const didChildrenDecrease = children.length < childrenHeights.length;

    if (didChildrenDecrease) {
      const removedChildIndex = childrenHeights.findIndex(({ key }) => {
        return !children.map(pluck('key')).includes(key);
      });

      return {
        childrenHeights: childrenHeights.filter((_, i) => i !== removedChildIndex),
      };
    }

    return null;
  }

  getSnapshotBeforeUpdate() {
    if (this.isScrolledToBottom()) {
      return null;
    }

    return this.ref.scrollHeight - this.ref.scrollTop;
  }

  componentDidUpdate(s, p, prevScroll) {
    const { scrollHeight } = this.ref;

    if (prevScroll) {
      this.scroll(scrollHeight - prevScroll);
    } else {
      this.scroll(scrollHeight);
    }
  }

  scroll(position) {
    this.ref.scrollTop = position;
  }

  isScrolledToBottom() {
    const { scrollTop, scrollHeight, clientHeight } = this.ref;

    return scrollHeight - scrollTop === clientHeight;
  }

  setHeightForKey(key, height) {
    const record = {
      key,
      height: height + this.props.gap,
    };

    this.setState(state => ({
      childrenHeights: state.childrenHeights.concat(record),
    }));
  }

  calculateBottomForIndex(index) {
    return this.state.childrenHeights
      .slice(index + 1)
      .map(pluck('height'))
      .reduce(sum, 0);
  }

  calculateContainerHeight() {
    const { viewport } = this.props;
    const height = this.calculateBottomForIndex(-1);
    
    if (height < viewport.height) {
      return viewport.height;
    }

    return height;
  }

  render() {
    const { children, viewport, paddings, scrollable } = this.props;

    const viewportStyle = {
      height: px(viewport.height),
      width: px(viewport.width),
      paddingTop: px(paddings.top),
      paddingBottom: px(paddings.bottom),
      paddingLeft: px(paddings.left),
      paddingRight: px(paddings.right),
      overflowY: scrollable ? 'scroll' : 'hidden',
    };

    return (
      <div style={viewportStyle} className="conversation" ref={el => this.ref = el}>
        <div
          className="conversation-wrapper"
          style={{ height: px(this.calculateContainerHeight()) }}
        >
          <TransitionGroup>
            {Children.map(children, (child, index) => (
              <CSSTransition
                timeout={300}
                classNames="message"
              >
                {React.cloneElement(child, {
                  bottom: this.calculateBottomForIndex(index),
                  onHeight: height => this.setHeightForKey(child.key, height),
                })}
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

Conversation.defaultProps = {
  children: [],
  viewport: {
    height: 450,
    width: 500,
  },
  paddings: {},
  scrollable: true,
  gap: 5,
};

Conversation.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  viewport: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  paddings: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),
  gap: PropTypes.number,
  scrollable: PropTypes.bool,
};

export default Conversation;
