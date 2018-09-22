import '../css/RotableText.css'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class RotableText extends Component {

    static propTypes = {
        text: PropTypes.string,
        options: PropTypes.array.isRequired,
        defaultOption: PropTypes.number,
        timeout: PropTypes.number,
        mode: PropTypes.oneOf(["manual", "auto", "loop"])
    }

    static defaultProps = {
        defaultOption: 0,
        timeout: 2,
        mode: "auto"
    }

    state = {
        selected: this.props.defaultOption
    }

    componentDidMount() {
        this._autoUpdate();
    }

    _autoUpdate() {
        setTimeout(this._update.bind(this), this.props.timeout * 1000);
    }

    _update() {
        const { mode, options } = this.props;
        const { selected } = this.state;
        let next = selected + 1;

        if (mode === "loop" || (mode === "auto" && next < options.length)) {
            this.setState({ selected: next % options.length });
            this._autoUpdate();
        }
    }

    render() {
        const { text, options } = this.props;
        const { selected } = this.state;

        return (
            <div className="rotable-text">
                {
                    text &&
                    (<span>{text}</span>)
                }
                <div
                    className="options"
                    style={{
                        transform: "translate(0, " + (selected * -1.2) + "em)"
                    }}
                >
                    {
                        options &&
                        options.map((text, index) => (
                            <span key={index}>{text}</span>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default RotableText;