import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import bolao from './bolao';
import { Button,FormGroup,FormControl, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDonate } from '@fortawesome/free-solid-svg-icons'
import { faAward } from '@fortawesome/free-solid-svg-icons'
import { faFileContract } from '@fortawesome/free-solid-svg-icons'
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { faGift } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
library.add(faFileContract);
library.add(faDonate);
library.add(faAward);
library.add(faMoneyBillWave);
library.add(faGift);
library.add(faSpinner);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gerente: '',
      jogadores: [],
      apostas: [],
      saldo: '',
      value: '0',
      message: '',
      nome: '',
      ganhadorNome: ' ',
      ganhadorCarteira: '',
      jogadoresInfo: [],
      numApostas: 0,
      contractNumber: '',
      apostaButton: 'Faça sua aposta',
      fimDeJogoButton: 'Finalizar Apostas',
      semSaldo: false,
      loading: false,
      saldoCarteira: ''
    };

    this.getGerenteCB = this.getGerenteCB.bind(this);
    this.getJogadoresCB = this.getJogadoresCB.bind(this);
    this.getApostasCB = this.getApostasCB.bind(this);
    this.getSaldoCB = this.getSaldoCB.bind(this);
    this.getValorApostaCB = this.getValorApostaCB.bind(this);
    this.getJogadorPorIdCB = this.getJogadorPorIdCB.bind(this);
    this.entrarCB = this.entrarCB.bind(this);
    this.escolherGanhadorCB = this.escolherGanhadorCB.bind(this);
    this.getSaldoCarteiraCB = this.getSaldoCarteiraCB.bind(this);
  }

  /* Callbacks */

  getGerenteCB(error, _gerente) {
    if (error) {
      console.error(error);
    } else {
      this.setState({gerente: _gerente});
    }
  };

  getApostasCB(error, _apostas)
  {
      if (error) {
        console.error(error);
      }
      else {
        this.setState({apostas: _apostas});
        this.setState({numApostas: _apostas.length});
      }
  }

  getJogadoresCB(error, _jogadores)
  {
    if (error) {
      console.error(error);
    } else {
      for(var i=0; i< _jogadores.length; i++)
      {
        bolao.getJogadorPorId(_jogadores[i], this.getJogadorPorIdCB);
      }
    }
  };

  getJogadorPorIdCB(error, _jogadorInfo)
  {
    if (error) {
      console.error(error);
    } else {
      var _jog = {nome: _jogadorInfo[0],
	      	        carteira: _jogadorInfo[1],
                  apostas: _jogadorInfo[2].toNumber()};
      var _jogadoresInfo = this.state.jogadoresInfo;
      _jogadoresInfo.push(_jog);
      this.setState({ jogadoresInfo: _jogadoresInfo });
    }
  }

  getSaldoCB(error, _saldo)
  {
    if (error) {
      console.error(error);
    } else {
      this.setState({saldo: _saldo.toNumber()});
    }
  };

  getValorApostaCB(error, _value)
  {
    if (error) {
      console.error(error);
    } else {
      var valorAposta = web3.fromWei(_value.toNumber(), 'ether');
      this.setState({value: valorAposta});
    }
  };

  entrarCB(error, _transactionHash)
  {
    if (error) {
      console.error(error);
    }
  /*  } else {
      this.setState({ apostaButton: 'Faça sua aposta', loading: false });
    }*/
  }

  escolherGanhadorCB(error, response)
  {
    if (error) {
      console.error(error);
    }
  }

  getSaldoCarteiraCB(error, result){
    if (!error)
    {
      var saldoEther = web3.fromWei(result.toNumber(), 'ether');
	this.setState({saldoCarteira: saldoEther});
      /*if (saldoEther < 1.4)
      {
        this.setState({semSaldo: true, apostaButton: "Sem Saldo"});
      }*/
    }
  }

  ApostaEventCB(error, result){
      this.setState({saldo: result.args.premio.toNumber(), numApostas: result.args.apostasTotal.toNumber()});
      var changed = false;
      var _jogadoresInfo = this.state.jogadoresInfo;
      for(var i=0; i< _jogadoresInfo.length;i++)
      {
        if (_jogadoresInfo[i].carteira === result.args.carteira)
        {
          _jogadoresInfo[i].nome = result.args.nome;
          _jogadoresInfo[i].apostas = result.args.apostas.toNumber();
          changed = true;
        }
      }
      if (changed === false)
      {
        var _jog = {nome: result.args.nome,
  	      	        carteira: result.args.carteira,
                    apostas: result.args.apostas.toNumber()};
        _jogadoresInfo.push(_jog);
      }
    this.setState({ jogadoresInfo: _jogadoresInfo });
    const accounts = web3.eth.accounts;
      if (accounts[0] === result.args.carteira)
      {
        this.setState({ apostaButton: 'Faça sua aposta', loading: false });
      }
    this.renderJogadores();
  }

  FimDeJogoEventCB(error, result){
      if (!error)
      {
      	this.setState({ganhadorNome: result.args.ganhador, ganhadorCarteira: result.args.carteira});
        this.setState({ fimDeJogoButton: 'Fim' });
      }
  }


  async componentDidMount() {
    document.title = 'FIAP - Smart Contracts';
    this.setState({contractNumber: bolao.address});

    bolao.getGerente(this.getGerenteCB);
    bolao.getApostas(this.getApostasCB);
    bolao.getJogadores(this.getJogadoresCB);
    bolao.getSaldo(this.getSaldoCB);
    bolao.getValorAposta(this.getValorApostaCB);

    this.ApostaEvent = bolao.ApostaEvent({some: 'args'}, {fromBlock: bolao.defaultBlock, toBlock: 'latest'});
    //this.ApostaEvent = bolao.ApostaEvent({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
    this.ApostaEventCB = this.ApostaEventCB.bind(this);
    this.ApostaEvent.watch(this.ApostaEventCB);

    this.FimDeJogoEvent = bolao.FimDeJogoEvent({some: 'args'}, {fromBlock: bolao.defaultBlock, toBlock: 'latest'});
    this.FimDeJogoEventCB = this.FimDeJogoEventCB.bind(this);
    this.FimDeJogoEvent.watch(this.FimDeJogoEventCB);
  }

  /* Submetendo a aposta */
  onSubmit = async event => {

    event.preventDefault();

    const accounts = web3.eth.accounts;
    this.setState({ apostaButton: "Realizando aposta...", loading: true });

    bolao.entrar(this.state.nome, {
      from: accounts[0],
      value: web3.toWei(this.state.value, 'ether'),
      gasPrice: '100000000000'
    }, this.entrarCB);

    web3.eth.getBalance(accounts[0], this.getSaldoCarteiraCB);
  };

  onClick = async () => {
    const accounts = web3.eth.accounts;

    this.setState({ fimDeJogoButton: 'Sorteando um vencedor...' });

    bolao.escolherGanhador({
      from: accounts[0]
    }, this.escolherGanhadorCB);

  };

  mudarAposta = async () => {
    const accounts = web3.eth.accounts;

    bolao.setValorAposta(web3.toWei(this.state.value, 'ether'), {
      from: accounts[0],
      gasPrice: '100000000000'
    }, this.entrarCB);

  };

  renderPainel()
  {
    return(<div className="container">
            <div className="row">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <div className="card-header">
                      Número do Contrato <FontAwesomeIcon icon="file-contract" />
                    </div>
                    <div className="mt-2">{this.state.contractNumber}
                    { web3.eth.accounts[0] === this.state.gerente ? <Button className="btn-sm" variant="danger" onClick={this.onClick}>{this.state.fimDeJogoButton}</Button> : null }</div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <div className="card-header">
                      Valor da Aposta <FontAwesomeIcon icon="file-contract" />
                    </div>
                    { web3.eth.accounts[0] === this.state.gerente ? this.renderValorAposta() : <div className="mt-2">{this.state.value} ETH</div> }
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4">
                <div className="card">
                  <div className="card-body">
                    <div className="card-header text-center">
                      Apostas <FontAwesomeIcon icon="donate" />
                    </div>
                    <div className="mt-2 display-6 text-center">{this.state.numApostas}</div>
                  </div>
                </div>
              </div>
            <div className="col-sm-4">
              <div className="card">
                <div className="card-body">
                <div className="card-header text-center">Prêmio <FontAwesomeIcon icon="gift" /></div>
                <div className="mt-2 display-6 text-center">{web3.fromWei(this.state.saldo, 'ether')} ETH</div>
              </div>
            </div>
            </div>
            <div className="col-sm-4">
              <div className="card">
                <div className="card-body">
                <div className="card-header text-center">Ganhador <FontAwesomeIcon icon="award" /></div>
                <div className="mt-2 display-6 text-center">{this.state.ganhadorNome}</div>
              </div>
            </div>
            </div>
          </div>
        </div>);
  }

  renderValorAposta()
  {
    return (<div className="mt-2">
    <div class="form-group row">
      <div class="col-3"><FormControl
    type="text"
    required
    value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
    /> </div><div class="col-3">ETH</div>
    <div class="col-6">
      <Button className="btn" variant="primary" onClick={this.mudarAposta}>Mudar valor</Button>
      </div></div></div>);
  }

  renderApostaBox()
  {
	  return (<div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="card-header"><div className="card-title">Faça sua aposta! <FontAwesomeIcon icon="money-bill-wave" /> {this.state.saldoCarteira.length > 0 ? <b>(seu saldo em carteira: {this.state.saldoCarteira} ETH)</b> : null}</div></div>
              <form onSubmit={this.onSubmit}><FormGroup>
              <div className="container">
                <div className="row mt-2">
                  <fieldset className="form-group col-sm-8">
                  <FormControl
            		  type="text"
                  required
            		  value={this.state.nome}
            		  placeholder="Digite seu nome"
                              onChange={event => this.setState({ nome: event.target.value })}
                  disabled={ this.state.semSaldo === true ? "disabled" : false}
                  />
                  </fieldset>
                  <fieldset className="form-group col-sm-4">
            		    <Button className="btn" variant="primary" type="submit" disabled={ this.state.semSaldo === true ? "disabled" : false}>{this.state.loading === true ? <FontAwesomeIcon icon="spinner" spin /> : null} {this.state.apostaButton}</Button>
            		  <FormControl.Feedback />
                  </fieldset>
                  </div>
                </div>
            		  </FormGroup>
            		</form>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }

  renderJogadores() {
    return this.state.jogadoresInfo.map((jogInfo) => (
    <tr key={jogInfo.carteira}><td>{jogInfo.nome}</td><td>{jogInfo.carteira}</td><td>{jogInfo.apostas}</td></tr>));
    //return (<tr></tr>);
  }

  renderTabelaApostas()
  {
    return (<div className="container">
            <div className="row">
              <div className="col-sm-12">
                <Table responsive>
                  <thead>
                    <tr>
                      <th className="col-sm-5">Nome</th>
                      <th className="col-sm-5">Carteira</th>
                      <th className="col-sm-2">Apostas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderJogadores()}
                  </tbody>
                  </Table>
                </div>
              </div>
            </div>);
  }

  render() {
    //const { Header, Row, HeaderCell, Body } = Table;

    return (
      <div>
          {this.renderPainel()}
          {this.renderApostaBox()}
          {this.renderTabelaApostas()}
      </div>
      );
  }
}

export default App;
