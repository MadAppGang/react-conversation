import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { sum, pluck, scrollBottom } from './utils';
import './index.css';

class Conversation extends Component {
  constructor() {
    super();

    // TODO: get rid of hardcode
    this.viewportHeight = 450;

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

  componentDidUpdate() {
    // TODO: scroll bottom only if were in the bottom before update
    // possibly use the "getSnapshotBeforeUpdate" lifecycle method
    scrollBottom(this.ref);
  }

  setHeightForKey(key, height) {
    this.setState(state => ({
      childrenHeights: state.childrenHeights.concat({ key, height }),
    }));
  }

  calculateBottomForIndex(index) {
    return this.state.childrenHeights
      .slice(index + 1)
      .map(pluck('height'))
      .reduce(sum, 0);
  }

  calculateContainerHeight() {
    const height = this.calculateBottomForIndex(-1);
    
    if (height < this.viewportHeight) {
      return this.viewportHeight;
    }

    return height;
  }

  render() {
    const { children } = this.props;

    return (
      <div
        className="dialog"
        style={{ height: `${this.viewportHeight}px` }}
        ref={el => this.ref = el}
      >
        <div
          className="dialog-wrapper"
          style={{ height: `${this.calculateContainerHeight()}px` }}
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
};

Conversation.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Conversation;
