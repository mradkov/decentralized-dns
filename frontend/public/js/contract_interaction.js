/**
 * Created by milenradkov on 8.03.18.
 */
$(document).ready(function() {
    let decentralizedDNSContract = '0xe37c3198ad5fcce17ac1ec4b13334050a7540a12';
    let decentralizedDNSContractABI = [{"anonymous":false,"inputs":[{"indexed":true,"name":"_currentOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"LogOwnershipTransfered","type":"event"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"}],"name":"destroyAndSend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"topLevel","type":"bytes12"},{"name":"newIp","type":"bytes15"}],"name":"edit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"domainName","type":"bytes"},{"indexed":false,"name":"topLevel","type":"bytes12"},{"indexed":false,"name":"newIp","type":"bytes15"}],"name":"LogDomainNameEdited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"domainName","type":"bytes"},{"indexed":false,"name":"topLevel","type":"bytes12"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"LogDomainNameTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"timestamp","type":"uint256"},{"indexed":true,"name":"_owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"LogPurchaseChangeReturned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"domainName","type":"bytes"},{"indexed":false,"name":"topLevel","type":"bytes12"},{"indexed":true,"name":"owner","type":"address"}],"name":"LogDomainNameRenewed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"domainName","type":"bytes"},{"indexed":false,"name":"topLevel","type":"bytes12"}],"name":"LogDomainNameRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"domainName","type":"bytes"},{"indexed":false,"name":"amountInWei","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"}],"name":"LogReceipt","type":"event"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"topLevel","type":"bytes12"},{"name":"ip","type":"bytes15"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"topLevel","type":"bytes12"}],"name":"renewDomainName","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"topLevel","type":"bytes12"},{"name":"newOwner","type":"address"}],"name":"transferDomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"BYTES_DEFAULT_VALUE","outputs":[{"name":"","type":"bytes1"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_EXPIRATION_DATE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_NAME_COST","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_NAME_COST_SHORT_ADDITION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_NAME_EXPENSIVE_LENGTH","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_NAME_MIN_LENGTH","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"domainNames","outputs":[{"name":"name","type":"bytes"},{"name":"topLevel","type":"bytes12"},{"name":"owner","type":"address"},{"name":"ip","type":"bytes15"},{"name":"expires","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"},{"name":"topLevel","type":"bytes12"}],"name":"getDomainHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"},{"name":"topLevel","type":"bytes12"}],"name":"getIP","outputs":[{"name":"","type":"bytes15"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"receiptKey","type":"bytes32"}],"name":"getReceipt","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"},{"name":"topLevel","type":"bytes12"}],"name":"getReceiptKey","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReceiptList","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"paymentReceipts","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"receiptDetails","outputs":[{"name":"amountPaidWei","type":"uint256"},{"name":"timestamp","type":"uint256"},{"name":"expires","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TOP_LEVEL_DOMAIN_MIN_LENGTH","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"}];

    if (typeof web3 === 'undefined')
        return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
    let ddnsContractInstance = web3.eth.contract(decentralizedDNSContractABI).at(decentralizedDNSContract);

    $('body').on('submit', '#buy', function (e) {
        e.preventDefault();

        let domainTopLevel = $(this).find('select[name="domainTopLevel"]').val();
        let domainName = $(this).find('input[name="domainName"]').val();
        let domainIP = $(this).find('input[name="domainIP"]').val();

        ddnsContractInstance.getPrice(domainName, domainTopLevel, function(err, result) {
            if (err) {
                console.log(err);
                return showError("Smart contract call failed");
            }

            console.log(result);
            let calculatedPrice = web3.fromWei(result, "ether").toString(10);

            ddnsContractInstance.register(domainName, domainTopLevel, domainIP, {value: web3.toWei(calculatedPrice, "ether")}, function (err, result) {
                if (err) {
                    console.log(err);
                    return showError("Smart contract call failed");
                }

                console.log(result);

                web3.eth.getTransactionReceipt(result, (err, result) => {
                    if (err) {
                        return showError("Smart contract call failed");
                    }

                    console.log(result);
                    showSuccess(`Domain successfully registered.`);
                });
            });
        });
    });

    $('body').on('submit', '#renew', function (e) {
        e.preventDefault();

        let domainTopLevel = $(this).find('select[name="domainTopLevel"]').val();
        let domainName = $(this).find('input[name="domainName"]').val();

        ddnsContractInstance.getPrice(domainName, domainTopLevel, function(err, result) {
            if (err){
                console.log(err);
                return showError("Smart contract call failed");
            }

            console.log(result);
            let calculatedPrice = web3.fromWei(result, "ether").toString(10);
            ddnsContractInstance.renewDomainName(domainName, domainTopLevel, {value: web3.toWei(calculatedPrice, "ether")}, function(err, result) {
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
                    showSuccess(`Domain successfully renewed.`);
                });
            });
        });
    });

    $('body').on('submit', '#edit', function (e) {
        e.preventDefault();

        let domainTopLevel = $(this).find('select[name="domainTopLevel"]').val();
        let domainName = $(this).find('input[name="domainName"]').val();
        let domainNewIp = $(this).find('input[name="domainIp"]').val();

        ddnsContractInstance.edit(domainName, domainTopLevel, domainNewIp, function(err, result) {
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
                showSuccess(`Domain successfully edited.`);
            });
        });
    });

    $('body').on('submit', '#transfer', function (e) {
        e.preventDefault();

        let domainTopLevel = $(this).find('select[name="domainTopLevel"]').val();
        let domainName = $(this).find('input[name="domainName"]').val();
        let newOwner = $(this).find('input[name="newOwner"]').val();

        ddnsContractInstance.transferDomain(domainName, domainTopLevel, newOwner, function(err, result) {
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
                showSuccess(`Domain successfully transferred.`);
            });
        });
    });

    $('body').on('submit', '#price', function (e) {
        e.preventDefault();

        let domainTopLevel = $(this).find('select[name="domainTopLevel"]').val();
        let domainName = $(this).find('input[name="domainName"]').val();

        ddnsContractInstance.getPrice(domainName, domainTopLevel, function(err, result) {
            if (err){
                console.log(err);
                return showError("Smart contract call failed");
            }

            let calculatedPrice = web3.fromWei(result, "ether").toString(10);
            console.log(calculatedPrice);

            web3.eth.getTransactionReceipt(result, (err, result) => {
                if (err) {
                    return showError("Smart contract call failed");
                }

                console.log(result);
                showInfo(`Price for the domain is: ${calculatedPrice} ETH.`);
            });
        });
    });

    $('body').on('submit', '#getip', function (e) {
        e.preventDefault();

        let domainTopLevel = $(this).find('select[name="domainTopLevel"]').val();
        let domainName = $(this).find('input[name="domainName"]').val();

        ddnsContractInstance.getIP(domainName, domainTopLevel, function(err, result) {
            if (err){
                console.log(err);
                return showError("Smart contract call failed");
            }

            let domainIP = web3.toUtf8(result);
            console.log(domainIP);

            web3.eth.getTransactionReceipt(result, (err, result) => {
                if (err) {
                    return showError("Smart contract call failed");
                }

                console.log(result);
                showInfo(`Domain IP: ${domainIP}`);
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
    }
});

