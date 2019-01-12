import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { sum, pluck } from './utils';
import './index.css';

class Conversation extends Component {
  constructor() {
    super();

    // TODO: get rid of padding hardcode
    this.paddings = {
      bottom: 25,
    };

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

  setHeightForKey(key, height) {
    this.setState(state => ({
      childrenHeights: state.childrenHeights.concat({ key, height }),
    }));
  }

  calculateBottomForIndex(index) {
    return this.state.childrenHeights
      .slice(index + 1)
      .map(pluck('height'))
      .reduce(sum, this.paddings.bottom);
  }

  render() {
    const { children } = this.props;

    return (
      <div className="dialog">
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
