import React, { Component, Children } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './index.css';

class Dialog extends Component {
  constructor() {
    super();

    this.timeout = 300;
    this.paddings = {
      bottom: 25,
      left: 25,
    };

    this.state = {
      childrenHeights: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.children.length < state.childrenHeights.length) {
      const index = state.childrenHeights.findIndex((obj) => {
        return !props.children.map(child => child.key).includes(obj.key);
      });

      const nextHeights = [...state.childrenHeights];

      nextHeights.splice(index, 1);

      return {
        childrenHeights: nextHeights,
      };
    }

    return null;
  }

  setHeightForIndex(index, key, height) {
    const { childrenHeights } = this.state;
    const nextHeights = [...childrenHeights];

    nextHeights[index] = { key, height };

    this.setState({
      childrenHeights: nextHeights,
    });
  }

  render() {
    const { children } = this.props;

    return (
      <div className="dialog">
        <TransitionGroup>
          {Children.map(children, (child, index) => {

            const bottom = this.state.childrenHeights
              .slice(index + 1)
              .map(obj => obj.height)
              .reduce((a, b) => a + b, this.paddings.bottom);

            return (
              <CSSTransition
                timeout={this.timeout}
                classNames="message"
              >
                {React.cloneElement(child, {
                  bottom,
                  onHeight: height => this.setHeightForIndex(index, child.key, height),
                })}
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    );
  }
}

export default Dialog;
