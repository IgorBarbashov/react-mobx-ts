import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { observable, computed, extendObservable } from 'mobx';
import { observer } from 'mobx-react';

const nickName = observable({
  firstName: 'Igor',
  age: 40,

  get nickName(): string {
    console.log('Generate nickName!');
    return `${this.firstName} (${this.age})`;
  },

  increment(): void {
    this.age += 1;
  },

  decrement(): void {
    this.age -= 1;
  },

  same(): void {
    this.age = this.age + 0;
  },
});

const todosListObs = observable([{ text: 'Task1' }, { text: 'Task2' }]);
const todosListNonObs = [{ text: 'Task1' }, { text: 'Task2' }];

interface CounterPropsInterface {
  store: typeof nickName;
  todosObs: typeof todosListObs;
  todosNonObs: typeof todosListNonObs;
}
@observer
class Counter extends Component<CounterPropsInterface, {}> {
  private handleIncrement = (): void => {
    const { store } = this.props;
    store.increment();
  };

  private handleDecrement = (): void => {
    const { store } = this.props;
    store.decrement();
  };

  private handleSame = (): void => {
    const { store } = this.props;
    store.same();
  };

  private handleAddElementToObs = (): void => {
    const { todosObs } = this.props;
    todosObs.push({ text: `Task ${todosObs.length + 1}` });
  };

  private handleAddElementToNonObs = (): void => {
    const { todosNonObs } = this.props;
    todosNonObs.push({ text: `Task ${todosNonObs.length + 1}` });
  };

  public render(): JSX.Element {
    const { store, todosObs, todosNonObs } = this.props;

    return (
      <div>
        <h1>Hello!</h1>
        <div>{store.nickName}</div>
        <div>{store.age}</div>
        <ul>
          Observable
          {todosObs.map(
            ({ text }): JSX.Element => (
              <li key={text}>{text}</li>
            ),
          )}
        </ul>
        <ul>
          Non-Observable
          {todosNonObs.map(
            ({ text }): JSX.Element => (
              <li key={text}>{text}</li>
            ),
          )}
        </ul>
        <button onClick={this.handleDecrement} type="button">
          - 1
        </button>
        <button onClick={this.handleIncrement} type="button">
          + 1
        </button>
        <button onClick={this.handleSame} type="button">
          same
        </button>
        <div>
          <button onClick={this.handleAddElementToObs} type="button">
            add element to Observable Array
          </button>
          <button onClick={this.handleAddElementToNonObs} type="button">
            add element to non-Observable Array
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Counter store={nickName} todosObs={todosListObs} todosNonObs={todosListNonObs} />,
  document.getElementById('root'),
);
