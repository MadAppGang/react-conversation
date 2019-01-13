import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { px } from './utils';

class Message extends Component {
  componentDidMount() {
    // TODO: get rid of margin hardcode
    this.props.onHeight(this.ref.clientHeight + 2);
  }

  render() {
    const className = classnames({
      'conversation-message': true,
      'conversation-message--me': this.props.me,
    });

    const style = {
      bottom: px(this.props.bottom),
    };

    return (
      <div ref={el => this.ref = el} className={className} style={style}>
        {this.props.children}
      </div>
    );
  }
}

Message.defaultProps = {
  bottom: 0,
  me: false,
  onHeight: () => {},
};

Message.propTypes = {
  me: PropTypes.bool,
  bottom: PropTypes.number,
  onHeight: PropTypes.func,
};

export default Message;
