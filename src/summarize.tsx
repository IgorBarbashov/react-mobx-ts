import React, { Component, Fragment, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { observable, computed, extendObservable, configure, action, decorate } from 'mobx';
import { observer } from 'mobx-react';

configure({ enforceActions: 'observed' });

interface DevInterface {
  name: string;
  sp: number;
}

class Store {
  public devsList: DevInterface[] = [
    { name: 'Jack', sp: 12 },
    { name: 'Max', sp: 10 },
    { name: 'Leo', sp: 8 },
  ];

  public filter: string = '';

  public get totalSum(): number {
    return this.devsList.reduce((acc, item): number => acc + item.sp, 0);
  }

  public get topPerformer(): string {
    if (this.devsList.length === 0) {
      return '';
    }
    const topDev = this.devsList.reduce(
      (acc, item): DevInterface => (item.sp > acc.sp ? item : acc),
    );
    const { name } = topDev;
    return name;
  }

  public get filteredDevs(): DevInterface[] {
    return this.devsList.filter((el): boolean => el.name.includes(this.filter));
  }

  public clearList = (): void => {
    this.devsList = [];
  };

  public addDev = (dev: DevInterface): void => {
    this.devsList.push(dev);
  };

  public updateFilter = (filter: string): void => {
    this.filter = filter;
  };
}

decorate(Store, {
  devsList: observable,
  filter: observable,
  totalSum: computed,
  topPerformer: computed,
  filteredDevs: computed,
  clearList: action,
  addDev: action,
  updateFilter: action,
});

interface PropsInterface {
  store: Store;
}

const globalStore = new Store();

const Row: React.FC<{ dev: DevInterface }> = ({ dev }): JSX.Element => {
  const { name, sp } = dev;
  return (
    <tr>
      <td>{name}</td>
      <td>{sp}</td>
    </tr>
  );
};

@observer
class DevsTable extends Component<PropsInterface, {}> {
  public render(): JSX.Element {
    const { store } = this.props;

    return (
      <Fragment>
        <table>
          <thead>
            <tr>
              <td>Name:</td>
              <td>SP:</td>
            </tr>
          </thead>
          <tbody>
            {store.devsList.map(
              (dev): JSX.Element => (
                <Row key={dev.name} dev={dev} />
              ),
            )}
          </tbody>
        </table>
        <div>
          <div>{`Total sp: ${store.totalSum}`}</div>
          <div>{`Top dev: ${store.topPerformer}`}</div>
          <ul>
            {store.filteredDevs.map(
              (dev): JSX.Element => (
                <li key={`li-${dev.name}`}>{`${dev.name}-${dev.sp}`}</li>
              ),
            )}
          </ul>
        </div>
      </Fragment>
    );
  }
}

@observer
class Controls extends Component<PropsInterface, {}> {
  private addDevHandler = (): void => {
    const {
      store: { addDev },
    } = this.props;
    const name = prompt('The name:') || '';
    const sp = prompt('The story points:') || '0';
    addDev({ name, sp: +sp });
  };

  private clearListHandler = (): void => {
    const {
      store: { clearList },
    } = this.props;
    clearList();
  };

  private filterHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const {
      store: { updateFilter },
    } = this.props;
    const {
      target: { value },
    } = e;
    updateFilter(value);
  };

  public render(): JSX.Element {
    const {
      store: { filter },
    } = this.props;

    return (
      <div>
        <button onClick={this.addDevHandler} type="button">
          Add record
        </button>
        <button onClick={this.clearListHandler} type="button">
          Clear records
        </button>
        <div>
          <input value={filter} onChange={this.filterHandler} type="text" />
        </div>
      </div>
    );
  }
}

const App: React.FC<PropsInterface> = ({ store }): JSX.Element => (
  <div>
    <h1>Sprint Table:</h1>
    <Controls store={store} />
    <DevsTable store={store} />
  </div>
);

ReactDOM.render(<App store={globalStore} />, document.getElementById('root'));
