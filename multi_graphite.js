'use strict';

const e = React.createElement;

class MultiGraphite extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {

    return (
    <div>
        json:<br/>
        <textarea>
        </textarea>
        <br/>
        <br/>

        targets:<br/>
        <textarea>
        </textarea>
        <br/>
        <br/>

        graphite url:<br/>
        <input />
        <br/>
        <br/>

        from: <input /><br/>
        to: <input /><br/>
        last N: <input /><br/>
        <br/>

        width: <input /><br/>
        height: <input /><br/>
        <br/>

      <button onClick={() => this.setState({ liked: true })}>
        Like
      </button>
    </div>
    );

  }
}

const domContainer = document.querySelector('#react_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(MultiGraphite));
