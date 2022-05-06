'use strict';

const e = React.createElement;

class MultiGraphite extends React.Component {
  constructor(props) {
    super(props);

    var hash = location.hash.substr(3);
    var hashObj = {}

    if (hash) {
      hash = hash.replace(/\+/g, '%20');
      hash.split("&").forEach(function(pair){
        var kv = pair.split('=');
        var key = kv[0];
        var value = decodeURIComponent(kv[1]);

        if (key === 'debug') {
          value = value === 'true' ? true : false;
        }

        hashObj[key] = value;
      });
    }

    var d = new Date();
    var date = d.getDate();
    if (date < 10) {
        date = "0" + date;
    }

    var month = d.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }

    var yyyymmdd = d.getFullYear() + month + date;

    var state = {
        json: '[\n  {\n    "value":123\n  },\n  {\n    "value":456\n  }\n]',

        targets: 'ha.sensor.cpu_temperature.state\nha.sensor.processor_use.state',

        url: 'http://localhost',

        timeType: 'range', // enum 'range' or 'recent'
        from: '00:00_' + yyyymmdd,
        until: '23:59_' + yyyymmdd,
        recent: '24h',

        width: '930',
        height: '300',

        debug: false,
    };

    var mergedState = {...state, ...hashObj};

    try {
      var parsed = JSON.parse(mergedState.json);
      mergedState.jsonData = parsed;
      mergedState.isValidJson = true;
    } catch (error) {
      mergedState.isValidJson = false;
    }

    this.state = mergedState;

    this.handleChange = this.handleOnChange.bind(this);
    this.handleTimeTypeChange = this.handleTimeTypeChange.bind(this);
    this.getWithExpandedMacroses = this.getWithExpandedMacroses.bind(this);
    this.changeURL = this.changeURL.bind(this);
  }

  handleOnChange(event, what) {
    var newState = {};
    newState[what] = event.target.value

    if (what === 'json') {
        try {
          var parsed = JSON.parse(event.target.value);
          newState.jsonData = parsed;
          newState.isValidJson = true;
        } catch (error) {
          newState.isValidJson = false;
        }
    }

    this.setState(newState, this.changeURL);
  }

  handleTimeTypeChange(event, what) {
    this.setState({timeType: what}, this.changeURL);
  }

  getWithExpandedMacroses(str, obj) {
    for (const p in obj) {
        var re = new RegExp("{\\s*" + p + "\\s*}", "g");
        str = str.replace(re, obj[p]);
    }

    return str;
  }

  changeURL() {
    var _this = this;

    var searchParams = new URLSearchParams();

    Object.keys(this.state).forEach(function(el) {
        if (el === "jsonData") {
          return;
        }
        if (el === "isValidJson") {
          return;
        }

        searchParams.append(el, _this.state[el]);
    });

    window.history.pushState("", "", '#/?' + searchParams);
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

    this.state.jsonData.forEach(function(obj){

        var searchParams = new URLSearchParams();

        if (_this.state.timeType === 'range') {
            searchParams.append('from', _this.getWithExpandedMacroses(_this.state.from, obj));
            searchParams.append('until', _this.getWithExpandedMacroses(_this.state.until, obj));
        } else if (_this.state.timeType === 'recent') {
            searchParams.append('from', '-' + _this.getWithExpandedMacroses(_this.state.recent, obj));
        }

        searchParams.append('width', _this.getWithExpandedMacroses(_this.state.width, obj));
        searchParams.append('height', _this.getWithExpandedMacroses(_this.state.height, obj));

        var targets = _this.state.targets.split(/\r?\n/);
        targets.forEach(function(t){
            if (!t.replace(/\s/g, '').length) {
                return;
            }

            if (t.trim().startsWith('#')) {
                return;
            }

            searchParams.append('target', _this.getWithExpandedMacroses(t, obj));
        });

        var time = new Date().getTime() / 1000;
        searchParams.append('_salt', time);

        var image_url = _this.getWithExpandedMacroses(_this.state.url, obj) + "/render/?" + searchParams;
        images.push({
            image_url: image_url,
            width: _this.getWithExpandedMacroses(_this.state.width, obj),
            height: _this.getWithExpandedMacroses(_this.state.height, obj),
        });
    });


    var imagesTags = [];
    images.forEach(function(el){
        if (_this.state.debug) {
            imagesTags.push(<div>{ el.image_url }</div>);
        }
        imagesTags.push(
            <img
                src={ el.image_url }
                style={{ marginRight: '5px' }}
                width={ el.width }
                height={ el.height }
            />
        );
    });

    var rangeClassName;
    var recentClassName;
    var timeControls = [];

    if (this.state.timeType === 'range') {
      rangeClassName = 'is-active';
      timeControls.push(
        <div className="field is-horizontal">
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded">
                <input className="input" type="text" placeholder="From" value={this.state.from} onChange={(event) => this.handleOnChange(event, 'from')}/>
              </p>
            </div>
            <div className="field">
              <p className="control is-expanded">
                <input className="input" type="text" placeholder="Until" value={this.state.until} onChange={(event) => this.handleOnChange(event, 'until')}/><br/>
              </p>
            </div>
          </div>
        </div>
      );
    } else if (this.state.timeType === 'recent') {
      recentClassName = 'is-active';
      timeControls.push(
        <div className="field">
          <div className="control">
            <input className="input" type="text" value={this.state.recent} onChange={(event) => this.handleOnChange(event, 'recent')}/><br/>
          </div>
        </div>
      );
    }

    return (
    <section style={{ paddingTop: '18px', paddingLeft: '18px', paddingRight: '0' }} className="section">

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

          <div className="tabs is-boxed">
            <ul>
              <li className={rangeClassName}>
                <a onClick={(event) => this.handleTimeTypeChange(event, 'range')}>
                  <span>Date range</span>
                </a>
              </li>
              <li className={recentClassName}>
                <a onClick={(event) => this.handleTimeTypeChange(event, 'recent')}>
                  <span>Recent data</span>
                </a>
              </li>
            </ul>
          </div>

          { timeControls }

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
