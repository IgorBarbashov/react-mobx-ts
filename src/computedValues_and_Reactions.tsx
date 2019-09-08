import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';

class UserNickName {
  @observable private firstName: string;

  @observable public age: number;

  public constructor() {
    this.firstName = 'Igor';
    this.age = 40;
  }

  @computed public get nickName(): string {
    console.log('Generate nickName!');
    return `${this.firstName} (${this.age})`;
  }

  public increment(): void {
    this.age += 1;
  }

  public decrement(): void {
    this.age -= 1;
  }

  @action public same(): void {
    this.age = this.age + 1000;
    this.age = this.age - 1000;
  }
}

interface CounterPropsInterface {
  store: UserNickName;
}

const nickName = new UserNickName();

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

  public render(): JSX.Element {
    const { store } = this.props;

    return (
      <div>
        <h1>Hello!</h1>
        <div>{store.nickName}</div>
        <div>{store.age}</div>
        <button onClick={this.handleDecrement} type="button">
          - 1
        </button>
        <button onClick={this.handleIncrement} type="button">
          + 1
        </button>
        <button onClick={this.handleSame} type="button">
          same
        </button>
      </div>
    );
  }
}

ReactDOM.render(<Counter store={nickName} />, document.getElementById('root'));
