import React, { Component } from 'react';
import firebase from 'firebase';
import creds from './firebase-creds';
import './Queue.css';

export default class Queue extends Component {
  constructor(props) {
    super(props);

    firebase.initializeApp(creds);

    this.state = {
      data: [],
    };
  }

  async componentDidMount() {
    firebase
      .database()
      .ref(`queuers/public/${this.props.match.params.uid}`)
      .on('value', snap => {
        const queuers = snap.val();
        const data = [];
        let query = new URLSearchParams(this.props.location.search); 
        for (const queuer in queuers) {
          const item = queuers[queuer];
          if (item.removed || item.seated || item.cancelled) continue;
          item.key = queuer;
          if (item.key === query.get('key')) item.name = `${item.name} \u2190`;
          data.push(item);
        }
        this.setState({data});
      });
  }

  queueItems() {
    const queuers = this.state.data;
    return queuers.map(
      queuer => (
        <li key={queuer.key} className="queuer">{queuer.name}</li>
      )
    );
  }

  render() {
    return (
      <div className="container">
        <div className="queue">
          <h1>Q</h1>
          <ol className="queue-items">
            {this.queueItems()}
          </ol>
        </div>
        <footer className="footer">
          <p>&copy; COPYRIGHT { new Date().getFullYear().toString() + ' // ' } <a href="https://www.queueup.site" target="_blank" rel="noopener noreferrer">Queue</a></p>
        </footer>
      </div>
    );
  }
}
