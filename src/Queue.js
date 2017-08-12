import React, { Component } from 'react';
import creds from './firebase-creds';
import firebase from 'firebase';;

export default class Queue extends Component {
  constructor(props) {
    super(props);

    firebase.initializeApp(creds);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref(`queuers/${this.props.match.params.uid}`)
      .on('value', snap => {
        const queuers = snap.val();
        const data = [];
        for (const queuer in queuers) {
          const item = queuers[queuer];
          if (item.removed || item.seated) continue;
          data.push(item);
        }
        this.setState({data});
      });
  }

  queueItems() {
    const queuers = this.state.data;
    return queuers.map(
      queuer => (
        <li key={queuer.name}>{queuer.name}</li>
      )
    );
  }

  render() {
    return (
      <div className="queue">
        <h1>QUEUE</h1>
        <ul>
          {this.queueItems()}
        </ul>
      </div>
    );
  }
}
