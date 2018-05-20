import web3 from './web3';

const address = '0xA1B3500B7670d1DF1D21e9C0c1d5591d5B388E98';

const abi = [
   {
      "constant":true,
      "inputs":[

      ],
      "name":"getJogadores",
      "outputs":[
         {
            "name":"",
            "type":"address[]"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":false,
      "inputs":[

      ],
      "name":"escolherGanhador",
      "outputs":[

      ],
      "payable":false,
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "constant":false,
      "inputs":[

      ],
      "name":"entrar",
      "outputs":[

      ],
      "payable":true,
      "stateMutability":"payable",
      "type":"function"
   },
   {
      "constant":true,
      "inputs":[

      ],
      "name":"getGerente",
      "outputs":[
         {
            "name":"",
            "type":"address"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[

      ],
      "payable":false,
      "stateMutability":"nonpayable",
      "type":"constructor"
   }
];

export default new web3.eth.Contract(abi, address);
