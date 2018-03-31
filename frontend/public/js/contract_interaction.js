/**
 * Created by milenradkov on 8.03.18.
 */
$(document).ready(function() {
    let hashHuntersContract = '0xf204a4ef082f5c04bb89f7d5e6568b796096735a';
    let hashHuntersContractABI = [ { "constant": true, "inputs": [], "name": "getHashPuzzles", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "hashPuzzleContracts", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_hashPuzzleAddress", "type": "address" } ], "name": "increaseBounty", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newFee", "type": "uint8" } ], "name": "changeFee", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "hashAlgorithmAddresses", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "amount", "type": "uint256" } ], "name": "sendBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getContractOwnerFee", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "message", "type": "bytes" }, { "name": "hashPuzzleAddress", "type": "address" } ], "name": "solveHashPuzzle", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_name", "type": "bytes32" }, { "name": "_address", "type": "address" } ], "name": "addNewHashAlgorithm", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "hashAlgorithms", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_hashPuzzleAddress", "type": "address" } ], "name": "getHashPuzzleData", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "bytes" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "string" }, { "name": "", "type": "string" }, { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_hash", "type": "bytes" }, { "name": "_hashAlgorithmName", "type": "bytes32" }, { "name": "_description", "type": "string" } ], "name": "newHashPuzzle", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "inputs": [ { "name": "_fee", "type": "uint8" } ], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" } ];

    if (typeof web3 === 'undefined')
        return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
    let hashHuntersContractInstance = web3.eth.contract(hashHuntersContractABI).at(hashHuntersContract);

    let hashPuzzleContractABI = [ { "constant": true, "inputs": [], "name": "checkFee", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "increaseBounty", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "checkBounty", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "checkPercentsFee", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_message", "type": "bytes" } ], "name": "solve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "_keccak256OfHash", "type": "bytes32" }, { "name": "_hashAlgAddress", "type": "address" }, { "name": "_percentsFee", "type": "uint8" } ], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "crackedBy", "type": "address" }, { "indexed": false, "name": "bounty", "type": "uint256" }, { "indexed": false, "name": "message", "type": "bytes" }, { "indexed": false, "name": "keccak256OfHash", "type": "bytes32" }, { "indexed": false, "name": "keccak256OfCalcHash", "type": "bytes32" } ], "name": "HashCracked", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "source", "type": "address" }, { "indexed": false, "name": "message", "type": "bytes" }, { "indexed": false, "name": "keccak256OfHash", "type": "bytes32" }, { "indexed": false, "name": "keccak256OfCalcHash", "type": "bytes32" } ], "name": "AttemptFailed", "type": "event" } ];

    hashHuntersContractInstance.getHashPuzzles(function(err, result) {
        if (err){
            console.log(err);
            return;
        }

        console.log(result);
        let i = 0;
        result.forEach(function(index){

            hashHuntersContractInstance.getHashPuzzleData(index, function(err, info) {
               if (err){
                   console.log(err);
               }
               //
               let hashBytesString = info[1].substring(2);
                console.log(hashBytesString);

                console.log(info);

               let hashPuzzle = {
                   bounty: info[0].toString(10),
                   hash: (hashBytesString),
                   hashAlgorithm: web3.toUtf8(info[2]),
                   description: info[3],
                   password: info[4],
                   solved: info[5],
               }

                console.log(hashPuzzle);
                $('#hashPuzzles').append(
                    `
                    <tr>
                    <td>${++i}</td>
                    <td style="max-width: 430px;word-wrap: break-word;">${hashPuzzle.hash}</td>
                    <td>${hashPuzzle.hashAlgorithm}</td>
                    <td class="${hashPuzzle.solved == true ? "status-cracked" : "status-pending"}">${hashPuzzle.solved == true ? "Cracked" : "Pending"}</td>
                    <td></td>
                    <td style="word-wrap:break-word;">${hashPuzzle.description}</td>
                    <td><span class="badge badge-light">${web3.fromWei(hashPuzzle.bounty, "ether")} ETH</span></td>
                    <td><a href="/submit?hash=${index}" class="btn btn-success">Submit solution</a></td>
                </tr>
                    `
                );
            })
        })
    });

    // var events = hashHuntersContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
    // events.get(function(error, result){
    //     console.log("EVENTS");
    //     console.log(result);
    // });

    // var filter = web3.eth.filter({
    //     fromBlock: 0,
    //     toBlock: 'latest',
    //     address: "0xf204a4ef082f5c04bb89f7d5e6568b796096735a",
    //     topics: ["0x6f7459d46b3db399270c820c0b80dc1782b4a1927d33f98935c130705083e363"]
    // });
    //
    //
    // // watch for changes
    // filter.watch(function(error, result){
    //     if (!error)
    //
    //     console.log("EVENT");
    //     console.log(result);
    //
    //     web3.eth.getBlock(result, function(error, result){
    //         result.transactions.forEach(function(index) {
    //             web3.eth.getTransactionReceipt(index, function(error, result) {
    //                 console.log(result);
    //             })
    //         })
    //     })
    // });

    $('body').on('submit', '#submitSolve', function (e) {
        e.preventDefault();

        let solveBytes = $(this).find('input[name="hexSolution"]').val();
        let puzzleAddress = getUrlParameter('hash');
        let hash = new Buffer(solveBytes, 'hex');

        console.log(hash);

        let hash2 = solveBytes.toString(16).split('').map(function (c) { return c.charCodeAt (0); })
        console.log(hash2);

        let newHashArray = [48];
        // hash.forEach(function(index) {
        //     let element = index.toString(16)
        //     newHashArray.push(element)
        // })

        let hashPuzzleInstance = web3.eth.contract(hashPuzzleContractABI).at(puzzleAddress);

        console.log(hashPuzzleInstance);

        console.log(newHashArray);
        console.log(puzzleAddress);

        hashHuntersContractInstance.solveHashPuzzle(newHashArray, puzzleAddress, function(err, result) {
            if (err){
                console.log(err);
                return showError("Smart contract call failed");
            }

            web3.eth.getTransactionReceipt(result, (err, result) => {
                if (err) {
                    return showError("Smart contract call failed");
                }

                console.log(result);
                showInfo(`Credit successfully requested.`);

                var events = hashPuzzleInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
                events.get(function(error, result){
                    console.log("EVENTS");
                    console.log(result);
                });

            });
        });
    });

    $('body').on('submit', '#publishHash', function (e) {
        e.preventDefault();

        let hunterAlgorithm = $(this).find('select[name="algorithm"]').val();
        let hunterHex = $(this).find('input[name="hex"]').val();
        let hunterDescription = $(this).find('textarea[name="description"]').val();
        let bounty = $(this).find('input[name="bounty"]').val();

        let hash = new Buffer(hunterHex, 'hex');
        let algoHex = getBytes(hunterAlgorithm);
        let algorithm = new Buffer(algoHex, 'hex');

        let newHashArray = [];
        hash.forEach(function(index) {
            let element = `0x${index.toString(16)}`
            newHashArray.push(element)
        })

        let algoArray = [];
        algorithm.forEach(function(index) {
            let element = `0x${index.toString(16)}`
            algoArray.push(element)
        })

        console.log(newHashArray);
        console.log(algoArray);

        let hashTosend = ["0xda", "0x39", "0xa3", "0xee", "0x5e", "0x6b", "0x4b", "0x0d", "0x32", "0x55", "0xbf", "0xef", "0x95", "0x60", "0x18", "0x90", "0xaf", "0xd8", "0x07", "0x09"];
        let description = "паролата е празен стринг";
        let correctShaALGO = ["0x53", "0x48", "0x41", "0x31", "0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00"];

        hashHuntersContractInstance.newHashPuzzle(hashTosend, correctShaALGO, description, {from: web3.eth.coinbase, gas: 6385876, gasPrice: 100000000000, value: web3.toWei(bounty, "ether")}, function(err, result) {
            if (err){
                console.log(err);
                return showError("Smart contract call failed");
            }

            console.log(result);

            web3.eth.getTransactionReceipt(result, (err, result) => {
                if (err) {
                    return showError("Smart contract call failed");
                }

                console.log(result);
                showInfo(`Credit successfully requested.`);
            });
        });
    });

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    function showSuccess(message) {
        swal({
            type: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500
        })
    }

    function showInfo(message) {
        swal(
            'Info?',
            message,
            'question'
        )
        console.log(message);
    }
    //
    function showError(errorMsg) {
        swal({
            type: 'error',
            title: 'Oops...',
            text: errorMsg,
        })
        console.log(errorMsg);
    }

    function getUrlParameter(sParam) {
        let sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    function getBytes(str) {
        var bytes = [];
        for (var i = 0; i < str.length; ++i) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    };

    function hex2a(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    function bin2string(array){
        var result = "";
        for(var i = 0; i < array.length; ++i){
            result+= (String.fromCharCode(array[i]));
        }
        return result;
    }
});

