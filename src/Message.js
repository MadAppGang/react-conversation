import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Message extends Component {
  componentDidMount() {
    // TODO: get rid of margin hardcode
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

    // TODO: delegate rendering to outside
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
  me: false,
  text: '',
  onClick: () => {},
  onHeight: () => {},
};

Message.propTypes = {
  me: PropTypes.bool,
  bottom: PropTypes.number,
  text: PropTypes.string,
  onHeight: PropTypes.func,
  onClick: PropTypes.func,
};

export default Message;
