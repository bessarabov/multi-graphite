'use strict';

URLSearchParams.prototype.appendIfValid = function(name, value) {
  if (value !== '') {
    this.append(name, value);
  }
};

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

        hashObj[key] = value;
      });
    }

    var state = this.getDefaultState();

    var mergedState = {...state, ...hashObj};

    try {
      var parsed = JSON.parse(mergedState.json);
      mergedState.jsonData = parsed;
      mergedState.isValidJson = true;
    } catch (error) {
      mergedState.isValidJson = false;
    }

    this.state = mergedState;

    document.title = mergedState.title;

  }

  handleControlChange(event, what) {
    var newState = {};
    var value = event.target.value;
    newState[what] = value;

    if (what === 'json') {
        try {
          var parsed = JSON.parse(value);
          newState.jsonData = parsed;
          newState.isValidJson = true;
        } catch (error) {
          newState.isValidJson = false;
        }
    }

    if (what === 'title') {
      document.title = value;
    }

    this.setState(newState, this.changeURL);
  }

  handleTimeTypeChange(event, what) {
    this.setState({timeType: what}, this.changeURL);
  }

  handleDateButtonClick(event, from, until) {
    this.setState({from: from, until, until}, this.changeURL);
  }

  handleRecentButtonClick(event, what) {
    this.setState({recent: what}, this.changeURL);
  }

  getWithExpandedMacroses(str, obj) {
    for (const p in obj) {
        var re = new RegExp("{\\s*" + p + "\\s*}", "g");
        str = str.replace(re, obj[p]);
    }

    return str;
  }

  getGraphiteTimeDateFromNameType(name, type) {

    var d = new Date();

    // today
    if (name === "today" && type === "from") {
      return "00:00_" + this.getYYYYMMDD(d);
    }
    if (name === "today" && type === "until") {
      return "23:59_" + this.getYYYYMMDD(d);
    }

    // yesterday
    if (name === "yesterday" && type === "from") {
      return "00:00_" + this.getYYYYMMDD(new Date(Date.now() - 86400000));
    }
    if (name === "yesterday" && type === "until") {
      return "23:59_" + this.getYYYYMMDD(new Date(Date.now() - 86400000));
    }

    // yesterday & today
    if (name === "yesterday & today" && type === "from") {
      return "00:00_" + this.getYYYYMMDD(new Date(Date.now() - 86400000));
    }
    if (name === "yesterday & today" && type === "until") {
      return "23:59_" + this.getYYYYMMDD(d);
    }

    // this month
    if (name === "this month" && type === "from") {
      return "00:00_" + this.getYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), 1));
    }
    if (name === "this month" && type === "until") {
      return "23:59_" + this.getYYYYMMDD(new Date(d.getFullYear(), d.getMonth()+1, 0));
    }

    // previous month
    if (name === "previous month" && type === "from") {
      return "00:00_" + this.getYYYYMMDD(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
    if (name === "previous month" && type === "until") {
      return "23:59_" + this.getYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), 0));
    }

    return "NOT IMPLEMENTED";
  }

  changeURL() {
    var _this = this;

    if (_this.state.isValidJson) {
      var searchParams = new URLSearchParams();
      var ignoreElemtns = [
          "jsonData",
          "isValidJson",
          "dateButtons",
          "recentButtons",
      ];

      Object.keys(this.state).forEach(function(el) {
          if (ignoreElemtns.includes(el)) {
            return;
          }

          searchParams.append(el, _this.state[el]);
      });

      window.history.pushState("", "", '#/?' + searchParams);
    }
  }

  getYYYYMMDD(d) {
    var date = d.getDate();
    if (date < 10) {
        date = "0" + date;
    } else {
        date = "" + date;
    }

    var month = d.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    } else {
        month = "" + month;
    }

    var yyyymmdd = d.getFullYear() + month + date;

    return yyyymmdd;
  }

  getDefaultState() {
    var yyyymmdd = this.getYYYYMMDD(new Date());

    var state = {

        title: 'multi-graphite',

        json: '[]',
        jsonData: [],
        isValidJson: true,

        targets: '',

        url: 'http://localhost',

        width: '930',
        height: '300',

        timeType: 'range', // enum 'range' or 'recent'
        from: '00:00_' + yyyymmdd,
        until: '23:59_' + yyyymmdd,
        recent: '24h',

        dateButtons: [
            [
                "today",
                "yesterday",
            ],
            [
                "yesterday & today",
            ],
            [
                "this month",
                "previous month",
            ],
        ],

        recentButtons: [
            "30min",
            "1h",
            "4h",
            "12h",
            "24h",
            "48h",
            "7d",
            "14d",
            "28d",
        ],

    };

    return state;
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
            searchParams.appendIfValid('from', _this.getWithExpandedMacroses(_this.state.from, obj));
            searchParams.appendIfValid('until', _this.getWithExpandedMacroses(_this.state.until, obj));
        } else if (_this.state.timeType === 'recent' && _this.state.recent !== '') {
            searchParams.appendIfValid('from', '-' + _this.getWithExpandedMacroses(_this.state.recent, obj));
        }

        searchParams.appendIfValid('width', _this.getWithExpandedMacroses(_this.state.width, obj));
        searchParams.appendIfValid('height', _this.getWithExpandedMacroses(_this.state.height, obj));

        var targets = _this.state.targets.split(/\r?\n/);
        targets.forEach(function(t){
            if (!t.replace(/\s/g, '').length) {
                return;
            }

            if (t.trim().startsWith('#')) {
                return;
            }

            searchParams.appendIfValid('target', _this.getWithExpandedMacroses(t, obj));
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
                <input className="input" type="text" placeholder="From" value={this.state.from} onChange={(event) => this.handleControlChange(event, 'from')}/>
              </p>
            </div>
            <div className="field">
              <p className="control is-expanded">
                <input className="input" type="text" placeholder="Until" value={this.state.until} onChange={(event) => this.handleControlChange(event, 'until')}/><br/>
              </p>
            </div>
          </div>
        </div>
      );

      this.state.dateButtons.forEach(function(row) {
        var buttons = [];
        row.forEach(function(el) {
          var n = "timeButtonInactive"

          var from = _this.getGraphiteTimeDateFromNameType(el, 'from');
          var until = _this.getGraphiteTimeDateFromNameType(el, 'until');

          if (_this.state.from === from && _this.state.until === until) {
            n = "timeButtonSelected"
          }

          buttons.push(
            <span
              onClick={(event) => _this.handleDateButtonClick(event, from, until)}
              className={ n }
            >{ el }</span>
          );
        });

        timeControls.push(
          <div className="field">
            <div className="control">
              { buttons }
            </div>
          </div>
        );

      });

    } else if (this.state.timeType === 'recent') {
      recentClassName = 'is-active';
      timeControls.push(
        <div className="field">
          <div className="control">
            <input className="input" type="text" value={this.state.recent} onChange={(event) => this.handleControlChange(event, 'recent')}/><br/>
          </div>
        </div>
      );

      var buttons = [];

      this.state.recentButtons.forEach(function(el) {
        var n = "timeButtonInactive"

        if (_this.state.recent === el) {
          n = "timeButtonSelected"
        }

        buttons.push(
          <span
            onClick={(event) => _this.handleRecentButtonClick(event, el)}
            className={ n }
          >{ el }</span>
        );
      });

      timeControls.push(
        <div className="field">
          <div className="control">
            { buttons }
          </div>
        </div>
      );

    }

    return (
    <div>
    <section style={{ paddingTop: '18px', paddingLeft: '18px', paddingRight: '0' }} className="section">

      <div className="columns">

        <div className="column is-one-third">

          <div className="field">
            <label className="label">Title:</label>
            <div className="control">
              <input
                  className="input"
                  type="text"
                  value={this.state.title}
                  onChange={(event) => this.handleControlChange(event, 'title')}
                  size='50'
              />
            </div>
          </div>

          <div className="field">
            <label className="label">JSON:</label>
            <div className="control">
              <textarea
                  className="textarea"
                  style={{backgroundColor: jsonBackgroundColor}}
                  value={this.state.json}
                  onChange={(event) => this.handleControlChange(event, 'json')}
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
                  onChange={(event) => this.handleControlChange(event, 'targets')}
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
                  onChange={(event) => this.handleControlChange(event, 'url')}
                  size='50'
              />
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Size:</label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control is-expanded">
                  <input className="input" type="text" placeholder="Width" value={this.state.width} onChange={(event) => this.handleControlChange(event, 'width')}/><br/>
                </p>
              </div>
              <div className="field">
                <p className="control is-expanded">
                  <input className="input" type="text" placeholder="Height" value={this.state.height} onChange={(event) => this.handleControlChange(event, 'height')}/><br/>
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

    <footer className="footer">
      <div className="content has-text-centered">
        <p>Version: dev</p>
        <p><a href="https://github.com/bessarabov/multi-graphite">GitHub</a></p>
      </div>
    </footer>

    </div>
    );

  }
}

const domContainer = document.querySelector('#react_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(MultiGraphite));
