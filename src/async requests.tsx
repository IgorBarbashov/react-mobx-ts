import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import {
  observable,
  computed,
  extendObservable,
  configure,
  action,
  decorate,
  runInAction,
} from 'mobx';
import { observer } from 'mobx-react';

configure({ enforceActions: 'observed' });

type UserInterface = {
  login: { username: string };
} | null;

class Store {
  public user: UserInterface = null;

  public getUser(): void {
    fetch('https://randomuser.me/api/')
      .then(res => res.json())
      .then(json => {
        if (json.results) {
          const [newUser] = json.results;
          // this.setUser(newUser);
          runInAction(() => {
            this.user = newUser;
          });
        }
      })
      .catch(error => {});
  }

  // public setUser(fetchedUser: UserInterface): void {
  //   this.user = fetchedUser;
  // }
}

decorate(Store, {
  user: observable,
  getUser: action.bound,
  // setUser: action,
});

const appStore = new Store();

@observer
class App extends PureComponent<{ store: Store }, {}> {
  public render(): JSX.Element {
    const { store } = this.props;

    return (
      <div>
        <div>{`User: ${store.user ? store.user.login.username : ''}`}</div>
        <button onClick={store.getUser} type="button">
          New user
        </button>
      </div>
    );
  }
}

ReactDOM.render(<App store={appStore} />, document.getElementById('root'));
