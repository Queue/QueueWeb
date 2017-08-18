import React, { Component } from 'react';
import firebase from 'firebase';
import creds from './firebase-creds';

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
        console.log(snap.key);
        const queuers = snap.val();
        const data = [];
        for (const queuer in queuers) {
          const item = queuers[queuer];
          if (item.removed || item.seated || item.cancelled) continue;
          data.push(item);
          console.log(item);
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
        <ol>
          {this.queueItems()}
        </ol>
      </div>
    );
  }
}
