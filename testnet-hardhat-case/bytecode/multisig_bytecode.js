const multisig_bytecode = "0x610c7b61003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100405760003560e01c80634771dd5314610045578063f8be14681461006d575b600080fd5b610058610053366004610983565b61008d565b60405190151581526020015b60405180910390f35b61008061007b366004610983565b610203565b6040516100649190610ae3565b6000806000806100d36040518060e00160405280606081526020016060815260200160608152602001606081526020016060815260200160608152602001606081525090565b6100dc8c61035e565b81526100e78b61035e565b60208201526100f58a610605565b604082015261010389610605565b606082015261011188610605565b608082015261011f8761035e565b60a082015261012d86610605565b60c0820181905281516020808401516040808601516060870151608088015160a089015193516101669897969394929391929101610afd565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c80850182905283518086039091018152605c909401909252825192019190912090945092506101d4838e610742565b73ffffffffffffffffffffffffffffffffffffffff908116908f16149450505050509998505050505050505050565b6060600080600061024a6040518060e00160405280606081526020016060815260200160608152602001606081526020016060815260200160608152602001606081525090565b6102538c61035e565b815261025e8b61035e565b602082015261026c8a610605565b604082015261027a89610605565b606082015261028888610605565b60808201526102968761035e565b60a08201526102a486610605565b60c0820181905281516020808401516040808601516060870151608088015160a089015193516102dd9897969394929391929101610afd565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c80850182905283518086039091018152605c9094019092528251920191909120909450925061034b838e610742565b50519d9c50505050505050505050505050565b604080518082018252601081527f303132333435363738396162636465660000000000000000000000000000000060208201528151602a808252606082810190945273ffffffffffffffffffffffffffffffffffffffff85169291600091602082018180368337019050509050600360fc1b816000815181106103f157634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061042e57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060005b60148110156105fa578260048561046084600c610b94565b6020811061047e57634e487b7160e01b600052603260045260246000fd5b1a60f81b6001600160f81b031916901c60f81c60ff16815181106104b257634e487b7160e01b600052603260045260246000fd5b01602001517fff0000000000000000000000000000000000000000000000000000000000000016826104e5836002610bf1565b6104f0906002610b94565b8151811061050e57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350828461053283600c610b94565b6020811061055057634e487b7160e01b600052603260045260246000fd5b825191901a600f1690811061057557634e487b7160e01b600052603260045260246000fd5b01602001517fff0000000000000000000000000000000000000000000000000000000000000016826105a8836002610bf1565b6105b3906003610b94565b815181106105d157634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350806105f281610c27565b915050610448565b50925050505b919050565b60608161062a57506040805180820190915260018152600360fc1b6020820152610600565b8160005b8115610654578061063e81610c27565b915061064d9050600a83610bd1565b915061062e565b60008167ffffffffffffffff81111561067d57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156106a7576020820181803683370190505b509050815b85156105fa576106bd600182610c10565b905060006106cc600a88610bd1565b6106d790600a610bf1565b6106e19088610c10565b6106ec906030610bac565b905060008160f81b90508084848151811061071757634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350610739600a89610bd1565b975050506106ac565b600081516041146107c05760405162461bcd60e51b815260206004820152602d60248201527f496e636f7272656374207369676e6174757265206c656e6774682c206c656e6760448201527f7468206d7573742062652036350000000000000000000000000000000000000060648201526084015b60405180910390fd5b60208201516040830151604184015160ff168015806107e257508060ff166001145b806107f057508060ff16601b145b806107fe57508060ff16601c145b6108705760405162461bcd60e51b815260206004820152602660248201527f5265636f76657220762076616c75652069732066756e64616d656e74616c6c7960448201527f2077726f6e67000000000000000000000000000000000000000000000000000060648201526084016107b7565b601b8160ff16101561088a57610887601b82610bac565b90505b8060ff16601b148061089f57508060ff16601c145b6108f75760405162461bcd60e51b815260206004820152602360248201527f5265636f76657220762076616c7565206572726f723a204e6f74203237206f7260448201526204064760eb1b60648201526084016107b7565b60408051600081526020810180835288905260ff831691810191909152606081018490526080810183905260019060a0016020604051602081039080840390855afa15801561094a573d6000803e3d6000fd5b5050604051601f190151979650505050505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461060057600080fd5b60008060008060008060008060006101208a8c0312156109a1578485fd5b6109aa8a61095f565b985060208a013567ffffffffffffffff808211156109c6578687fd5b818c0191508c601f8301126109d9578687fd5b8135818111156109eb576109eb610c58565b604051601f8201601f19908116603f01168101908382118183101715610a1357610a13610c58565b816040528281528f6020848701011115610a2b57898afd5b82602086016020830137918201602001899052509950610a5091505060408b0161095f565b9650610a5e60608b0161095f565b955060808a0135945060a08a0135935060c08a01359250610a8160e08b0161095f565b91506101008a013590509295985092959850929598565b60008151808452815b81811015610abd57602081850181015186830182015201610aa1565b81811115610ace5782602083870101525b50601f01601f19169290920160200192915050565b600060208252610af66020830184610a98565b9392505050565b600060e08252610b1060e083018a610a98565b8281036020840152610b22818a610a98565b90508281036040840152610b368189610a98565b90508281036060840152610b4a8188610a98565b90508281036080840152610b5e8187610a98565b905082810360a0840152610b728186610a98565b905082810360c0840152610b868185610a98565b9a9950505050505050505050565b60008219821115610ba757610ba7610c42565b500190565b600060ff821660ff84168060ff03821115610bc957610bc9610c42565b019392505050565b600082610bec57634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615610c0b57610c0b610c42565b500290565b600082821015610c2257610c22610c42565b500390565b6000600019821415610c3b57610c3b610c42565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea164736f6c6343000802000a";
module.exports = { multisig_bytecode };