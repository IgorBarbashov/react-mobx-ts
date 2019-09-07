// computed_and_reactions
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

interface CounterStateInterface {
  count: number;
  increment: () => void;
  decrement: () => void;
}

interface CounterStateProps {
  store: CounterStateInterface;
}

const counterState: CounterStateInterface = observable({
  count: 0,
  increment(): void {
    this.count += 1;
  },
  decrement(): void {
    this.count -= 1;
  },
});

@observer
class Counter extends Component<CounterStateProps, {}> {
  private handleIncrement = (): void => {
    const { store } = this.props;
    store.increment();
  };

  private handleDecrement = (): void => {
    const { store } = this.props;
    store.decrement();
  };

  public render(): JSX.Element {
    const { store } = this.props;

    return (
      <div>
        <h1>Hello!</h1>
        <div>{store.count}</div>
        <button onClick={this.handleDecrement} type="button">
          - 1
        </button>
        <button onClick={this.handleIncrement} type="button">
          + 1
        </button>
      </div>
    );
  }
}

ReactDOM.render(<Counter store={counterState} />, document.getElementById('root'));
