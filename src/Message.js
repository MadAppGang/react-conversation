import React, { Component } from 'react';
import classnames from 'classnames';

class Message extends Component {
  componentDidMount() {
    this.props.onHeight(this.ref.clientHeight + 2);
  }

  render() {
    const { text, me, bottom } = this.props;

    const className = classnames({
      'dialog-message': true,
      'dialog-message--me': me,
    });

    const style = {
      bottom: `${bottom}px`,
    };

    return (
      <div
        ref={el => this.ref = el}
        className={className}
        style={style}
        onClick={this.props.onClick}
      >
        <span className="dialog-message__text">
          {text}
        </span>
      </div>
    );
  }
}

Message.defaultProps = {
  bottom: 0,
};

export default Message;
