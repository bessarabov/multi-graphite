'use strict';

const e = React.createElement;

class MultiGraphite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        json: '[\n  {\n    "value":123\n  },\n  {\n    "value":456\n  }\n]',
        jsonData: [{value:123},{value:456}],
        isValidJson: true,

        targets: '',

        url: '',

        from: '',
        to: '',
        lastN: '24h',

        width: '100',
        height: '100',
    };

    this.handleChange = this.handleOnChange.bind(this);
  }

  handleOnChange(event, what) {
    var newState = {};
    newState[what] = event.target.value

    this.setState(newState);

    if (what === 'json') {
        try {
            var parsed = JSON.parse(event.target.value);
            this.setState({jsonData: parsed});
            this.setState({isValidJson: true});
        } catch (error) {
            this.setState({isValidJson: false});
        }
    }
  }

  render() {

    var jsonBackgroundColor = '';
    if (this.state.isValidJson) {
        jsonBackgroundColor = 'white';
    } else {
        jsonBackgroundColor = '#ffc9c9';
    }


    return (
    <div>
        json:<br/>
        <textarea
            style={{backgroundColor: jsonBackgroundColor}}
            value={this.state.json}
            onChange={(event) => this.handleOnChange(event, 'json')}
            rows='12'
            cols='50'
        ></textarea>
        <br/>
        <br/>

        targets:<br/>
        <textarea
            value={this.state.targes}
            onChange={(event) => this.handleOnChange(event, 'targets')}
            rows='12'
            cols='50'
        ></textarea>
        <br/>
        <br/>

        graphite url:<br/>
        <input
            value={this.state.url}
            onChange={(event) => this.handleOnChange(event, 'url')}
            size='50'
        />
        <br/>
        <br/>

        from: <input value={this.state.from} onChange={(event) => this.handleOnChange(event, 'from')}/><br/>
        to: <input value={this.state.to} onChange={(event) => this.handleOnChange(event, 'to')}/><br/>
        last N: <input  value={this.state.lastN} onChange={(event) => this.handleOnChange(event, 'lastN')}/><br/>
        <br/>

        width: <input value={this.state.width} onChange={(event) => this.handleOnChange(event, 'width')}/><br/>
        height: <input value={this.state.height} onChange={(event) => this.handleOnChange(event, 'height')}/><br/>
        <br/>

    </div>
    );

  }
}

const domContainer = document.querySelector('#react_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(MultiGraphite));
