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
    <section className="section">

      <div className="columns">

        <div className="column is-one-third">

          <div className="field">
            <label className="label">JSON:</label>
            <div className="control">
              <textarea
                  className="textarea"
                  style={{backgroundColor: jsonBackgroundColor}}
                  value={this.state.json}
                  onChange={(event) => this.handleOnChange(event, 'json')}
                  rows='8'
              ></textarea>
            </div>
          </div>

          <div className="field">
            <label className="label">Targets:</label>
            <div className="control">
              <textarea
                  className="textarea"
                  value={this.state.targets}
                  onChange={(event) => this.handleOnChange(event, 'targets')}
                  rows='4'
              ></textarea>
            </div>
          </div>

          <div className="field">
            <label className="label">Graphite url:</label>
            <div className="control">
              <input
                  className="input"
                  type="text"
                  value={this.state.url}
                  onChange={(event) => this.handleOnChange(event, 'url')}
                  size='50'
              />
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-body">
              <div className="field">
                <p className="control is-expanded">
                  <input className="input" type="text" placeholder="From" value={this.state.from} onChange={(event) => this.handleOnChange(event, 'from')}/>
                </p>
              </div>
              <div className="field">
                <p className="control is-expanded">
                  <input className="input" type="text" placeholder="To" value={this.state.to} onChange={(event) => this.handleOnChange(event, 'to')}/><br/>
                </p>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Last:</label>
            <div className="control">
              <input className="input" type="text" value={this.state.lastN} onChange={(event) => this.handleOnChange(event, 'lastN')}/><br/>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Size</label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control is-expanded">
                  <input className="input" type="text" placeholder="Width" value={this.state.width} onChange={(event) => this.handleOnChange(event, 'width')}/><br/>
                </p>
              </div>
              <div className="field">
                <p className="control is-expanded">
                  <input className="input" type="text" placeholder="Height" value={this.state.height} onChange={(event) => this.handleOnChange(event, 'height')}/><br/>
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="column">
          { imagesTags }
        </div>

      </div>

    </section>
    );

  }
}

const domContainer = document.querySelector('#react_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(MultiGraphite));
