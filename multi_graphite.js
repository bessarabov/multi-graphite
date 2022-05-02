'use strict';

const e = React.createElement;

class MultiGraphite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        json: '[\n  {\n    "value":123\n  },\n  {\n    "value":456\n  }\n]',
        jsonData: [{value:123},{value:456}],
        isValidJson: true,

        targets: 'ha.sensor.cpu_temperature.state\nha.sensor.processor_use.state',

        url: 'http://localhost',

        from: '',
        to: '',
        lastN: '24h',

        width: '300',
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

    var _this = this;

    var jsonBackgroundColor = '';
    if (this.state.isValidJson) {
        jsonBackgroundColor = 'white';
    } else {
        jsonBackgroundColor = '#ffc9c9';
    }

    var images = [];

    this.state.jsonData.forEach(function(el){

        var searchParams = new URLSearchParams();

        searchParams.append('from', '-' + _this.state.lastN);

        searchParams.append('width', _this.state.width);
        searchParams.append('height', _this.state.height);

        var targets = _this.state.targets.split(/\r?\n/);
        targets.forEach(function(t){
            if (!t.replace(/\s/g, '').length) {
                return;
            }

            if (t.trim().startsWith('#')) {
                return;
            }

            searchParams.append('target', t);
        });

        var image_url = _this.state.url + "/render/?" + searchParams;
        images.push(image_url);
    });


    var imagesTags = [];
    images.forEach(function(el){
        imagesTags.push(<div>{ el }</div>);
        imagesTags.push(<img src={ el }/>);
    });

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
            value={this.state.targets}
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

        <br/>
        { imagesTags }

    </div>
    );

  }
}

const domContainer = document.querySelector('#react_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(MultiGraphite));
