import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import bolao from './bolao';

class App extends Component {
  state = {
      gerente: ''
    };

    async componentDidMount() {
      const gerente = await bolao.methods.getGerente().call();

      this.setState({ gerente });
    }

  render() {
    //console.log(web3.version);
    //web3.eth.getAccounts().then(console.log);

    return (
      <div>
        <h2>Contrato do Bolão!</h2>
        <p>
          Este contrato é gerenciado por {this.state.gerente}.
        </p>
      </div>

    );
  }
}

export default App;
