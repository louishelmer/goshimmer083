(self.webpackChunkdoc_ops=self.webpackChunkdoc_ops||[]).push([[1290],{3905:function(e,t,n){"use strict";n.d(t,{Zo:function(){return d},kt:function(){return m}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,l=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),p=c(n),m=r,g=p["".concat(l,".").concat(m)]||p[m]||u[m]||s;return n?a.createElement(g,o(o({ref:t},d),{},{components:n})):a.createElement(g,o({ref:t},d))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,o=new Array(s);o[0]=p;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var c=2;c<s;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},207:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return d},default:function(){return p}});var a=n(2122),r=n(9756),s=(n(7294),n(3905)),o=["components"],i={},l="How to send transaction",c={unversionedId:"tutorials/send_transaction",id:"tutorials/send_transaction",isDocsHomePage:!1,title:"How to send transaction",description:"The simplest and easiest way for creating transaction is to use ready solution, such us GUI wallets: pollen-wallet and Dr-Electron ElectricShimmer",source:"@site/docs/tutorials/send_transaction.md",sourceDirName:"tutorials",slug:"/tutorials/send_transaction",permalink:"/docs/tutorials/send_transaction",editUrl:"https://github.com/iotaledger/Goshimmer/tree/develop/docOps/docs/tutorials/send_transaction.md",version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Setting up a GoShimmer node",permalink:"/docs/tutorials/setup"},next:{title:"Command Line Wallet",permalink:"/docs/tutorials/wallet-library"}},d=[{value:"Funds",id:"funds",children:[]},{value:"Preparing transaction",id:"preparing-transaction",children:[{value:"Seed",id:"seed",children:[]},{value:"Transaction essence",id:"transaction-essence",children:[]},{value:"Signing transaction",id:"signing-transaction",children:[]}]},{value:"Sending transaction",id:"sending-transaction",children:[]},{value:"Code examples",id:"code-examples",children:[{value:"Creating the transaction",id:"creating-the-transaction",children:[]},{value:"Post the transaction",id:"post-the-transaction",children:[]}]}],u={toc:d};function p(e){var t=e.components,n=(0,r.Z)(e,o);return(0,s.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"how-to-send-transaction"},"How to send transaction"),(0,s.kt)("p",null,"The simplest and easiest way for creating transaction is to use ready solution, such us GUI wallets: ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/iotaledger/pollen-wallet/tree/master"},"pollen-wallet")," and ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/Dr-Electron/ElectricShimmer"},"Dr-Electron ElectricShimmer"),"\nor command line wallet ",(0,s.kt)("a",{parentName:"p",href:"/docs/tutorials/wallet-library"},"Command Line Wallet"),". However, there is also an option to create a transaction directly with Go client library, which will be main focus of this tutorial."),(0,s.kt)("p",null,"For code examples you can go directly to ",(0,s.kt)("a",{parentName:"p",href:"/docs/tutorials/send_transaction#code-examples"},"Code examples"),"."),(0,s.kt)("h2",{id:"funds"},"Funds"),(0,s.kt)("p",null,"To create a transaction, firstly we need to be in possession of tokens. We can receive them from other network users or request them from the faucet. For more details on how to request funds, see ",(0,s.kt)("a",{parentName:"p",href:"/docs/tutorials/obtain_tokens"},"this")," tutorial."),(0,s.kt)("h2",{id:"preparing-transaction"},"Preparing transaction"),(0,s.kt)("p",null,"A transaction is built from two parts: a transaction essence, and the unlock blocks. The transaction essence contains, among other information, the amount, the origin and where the funds should be sent. The unlock block makes sure that only the owner of the funds being transferred is allowed to successfully perform this transaction."),(0,s.kt)("h3",{id:"seed"},"Seed"),(0,s.kt)("p",null,"In order to send funds we need to have a private key that can be used to prove that we own the funds and consequently unlock them. If you want to use an existing seed from one of your wallets, just use the backup seed showed during a wallet creation. With this, we can decode the string with the ",(0,s.kt)("inlineCode",{parentName:"p"},"base58")," library and create the ",(0,s.kt)("inlineCode",{parentName:"p"},"seed.Seed")," instance. That will allow us to retrieve the wallet addresses (",(0,s.kt)("inlineCode",{parentName:"p"},"mySeed.Address()"),") and the corresponding private and public keys (",(0,s.kt)("inlineCode",{parentName:"p"},"mySeed.KeyPair()"),")."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},'seedBytes, _ := base58.Decode("BoDjAh57RApeqCnoGnHXBHj6wPwmnn5hwxToKX5PfFg7") // ignoring error\nmySeed := walletseed.NewSeed(seedBytes)\n')),(0,s.kt)("p",null,"Another option is to generate a completely new seed and addresses."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},'mySeed := walletseed.NewSeed()\nfmt.Println("My secret seed:", myWallet.Seed.String())\n')),(0,s.kt)("p",null,"We can obtain the addresses from the seed by providing their index, in our example it is ",(0,s.kt)("inlineCode",{parentName:"p"},"0"),". Later we will use the same index to retrieve the corresponding keys."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"myAddr := mySeed.Address(0)\n")),(0,s.kt)("p",null,"Additionally, we should make sure that unspent outputs we want to use are already confirmed.\nIf we use a wallet, this information will be available along with the wallet balance. We can also use the dashboard and look up for our address in the explorer. To check the confirmation status with Go use ",(0,s.kt)("inlineCode",{parentName:"p"},"PostAddressUnspentOutputs()")," API method to get the outputs and check their inclusion state."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},'resp, _ := goshimAPI.PostAddressUnspentOutputs([]string{myAddr.Base58()}) // ignoring error\nfor _, output := range resp.UnspentOutputs[0].Outputs {\n        fmt.Println("outputID:", output.Output.OutputID.Base58, "confirmed:", output.InclusionState.Confirmed)\n}\n')),(0,s.kt)("h3",{id:"transaction-essence"},"Transaction essence"),(0,s.kt)("p",null,"The transaction essence can be created with:\n",(0,s.kt)("inlineCode",{parentName:"p"},"NewTransactionEssence(version, timestamp, accessPledgeID, consensusPledgeID, inputs, outputs)"),"\nWe need to provide the following arguments:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"var version TransactionEssenceVersion\nvar timestamp time.Time\nvar accessPledgeID identity.ID\nvar consensusPledgeID identity.ID\nvar inputs ledgerstate.Inputs\nvar outputs ledgerstate.Outputs\n")),(0,s.kt)("h4",{id:"version-and-timestamp"},"Version and timestamp"),(0,s.kt)("p",null,"We use ",(0,s.kt)("inlineCode",{parentName:"p"},"0")," for a version and provide the current time as a timestamp of the transaction."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"version = 0\ntimestamp = time.Now()\n")),(0,s.kt)("h4",{id:"mana-pledge-ids"},"Mana pledge IDs"),(0,s.kt)("p",null,"We also need to specify the nodeID to which we want to pledge the access and consensus mana. We can use two different nodes for each type of mana.\nWe can retrieve an identity instance by converting base58 encoded node ID as in the following example:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"pledgeID, err := mana.IDFromStr(base58encodedNodeID)\naccessPledgeID = pledgeID\nconsensusPledgeID = pledgeID\n")),(0,s.kt)("p",null,"or discard mana by pledging it to the empty nodeID:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"accessPledgeID = identity.ID{}\nconsensusPledgeID = identity.ID{}\n")),(0,s.kt)("h4",{id:"inputs"},"Inputs"),(0,s.kt)("p",null,"As inputs for the transaction we need to provide unspent outputs.\nTo get unspent outputs of the address we can use the following example."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"resp, _ := goshimAPI.GetAddressUnspentOutputs(myAddr.Base58())  // ignoring error\n// iterate over unspent outputs of an address\nfor _, output := range resp2.Outputs {\n    var out ledgerstate.Output\n    out, _ = output.ToLedgerstateOutput()  // ignoring error\n}\n")),(0,s.kt)("p",null,"To check the available output's balance use ",(0,s.kt)("inlineCode",{parentName:"p"},"Balances()")," method and provide the token color. We use the default, IOTA color."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"balance, colorExist := out.Balances().Get(ledgerstate.ColorIOTA)\nfmt.Println(balance, exist)\n")),(0,s.kt)("p",null,"or iterate over all colors and balances:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},'out.Balances().ForEach(func(color ledgerstate.Color, balance uint64) bool {\n            fmt.Println("Color:", color.Base58())\n            fmt.Println("Balance:", balance)\n            return true\n        })\n')),(0,s.kt)("p",null,"At the end we need to wrap the selected output to match the interface of the inputs:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"inputs = ledgerstate.NewInputs(ledgerstate.NewUTXOInput(out))\n")),(0,s.kt)("h4",{id:"outputs"},"Outputs"),(0,s.kt)("p",null,"To create the most basic type of output use\n",(0,s.kt)("inlineCode",{parentName:"p"},"ledgerstate.NewSigLockedColoredOutput()")," and provide it with a balance and destination address. Important is to provide the correct balance value. The total balance with the same color has to be equal for input and output."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"balance := ledgerstate.NewColoredBalances(map[ledgerstate.Color]uint64{\n                            ledgerstate.ColorIOTA: uint64(100),\n                        })\noutputs := ledgerstate.NewOutputs(ledgerstate.NewSigLockedColoredOutput(balance, destAddr.Address()))\n")),(0,s.kt)("p",null,"The same as in case of inputs we need to adapt it with ",(0,s.kt)("inlineCode",{parentName:"p"},"ledgerstate.NewOutputs()")," before passing to the ",(0,s.kt)("inlineCode",{parentName:"p"},"NewTransactionEssence")," function."),(0,s.kt)("h3",{id:"signing-transaction"},"Signing transaction"),(0,s.kt)("p",null,"After preparing the transaction essence, we should sign it and put the signature to the unlock block part of the transaction.\nWe can retrieve private and public key pairs from the seed by providing it with indexes corresponding to the addresses that holds the unspent output that we want to use in our transaction."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"kp := *mySeed.KeyPair(0)\ntxEssence := NewTransactionEssence(version, timestamp, accessPledgeID, consensusPledgeID, inputs, outputs)\n")),(0,s.kt)("p",null,"We can sign the transaction in two ways: with ED25519 or BLS signature. The wallet seed library uses ",(0,s.kt)("inlineCode",{parentName:"p"},"ed25519")," package and keys, so we will use ",(0,s.kt)("inlineCode",{parentName:"p"},"Sign()")," method along with ",(0,s.kt)("inlineCode",{parentName:"p"},"ledgerstate.ED25519Signature")," constructor to sign the transaction essence bytes.\nNext step is to create the unlock block from our signature."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"signature := ledgerstate.NewED25519Signature(kp.PublicKey, kp.PrivateKey.Sign(txEssence.Bytes())\nunlockBlock := ledgerstate.NewSignatureUnlockBlock(signature)\n")),(0,s.kt)("p",null,"Putting it all together, now we are able to create transaction with previously created transaction essence and adapted unlock block."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},"tx := ledgerstate.NewTransaction(txEssence, ledgerstate.UnlockBlocks{unlockBlock})\n")),(0,s.kt)("h2",{id:"sending-transaction"},"Sending transaction"),(0,s.kt)("p",null,"There are two web API methods that allows us to send the transaction:\n",(0,s.kt)("inlineCode",{parentName:"p"},"PostTransaction()")," and ",(0,s.kt)("inlineCode",{parentName:"p"},"IssuePayload()"),". The second one is a more general method that sends the attached payload. We are going to use the first one that will additionally check the transaction validity before issuing and wait with sending the response until the message is booked.\nThe method accepts a byte array, so we need to call ",(0,s.kt)("inlineCode",{parentName:"p"},"Bytes()"),".\nIf the transaction will be booked without any problems, we should be able to get the transaction ID from the API response."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-Go"},'resp, err := goshimAPI.PostTransaction(tx.Bytes())\nif err != nil {\n    return\n}\nfmt.Println("Transaction issued, txID:", resp.TransactionID)\n')),(0,s.kt)("h2",{id:"code-examples"},"Code examples"),(0,s.kt)("h3",{id:"creating-the-transaction"},"Creating the transaction"),(0,s.kt)("p",null,"Constructing a new ",(0,s.kt)("inlineCode",{parentName:"p"},"ledgerstate.Transaction"),". "),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-go"},'import (\n    "fmt"\n    "net/http"\n    "time"\n\n    "github.com/iotaledger/goshimmer/client"\n    walletseed "github.com/iotaledger/goshimmer/client/wallet/packages/seed"\n    "github.com/iotaledger/goshimmer/packages/ledgerstate"\n    "github.com/iotaledger/goshimmer/packages/mana"\n)\n\nfunc buildTransaction() (tx *ledgerstate.Transaction, err error) {\n    // node to pledge access mana.\n    accessManaPledgeIDBase58 := "2GtxMQD94KvDH1SJPJV7icxofkyV1njuUZKtsqKmtux5"\n    accessManaPledgeID, err := mana.IDFromStr(accessManaPledgeIDBase58)\n    if err != nil {\n        return\n    }\n\n    // node to pledge consensus mana.\n    consensusManaPledgeIDBase58 := "1HzrfXXWhaKbENGadwEnAiEKkQ2Gquo26maDNTMFvLdE3"\n    consensusManaPledgeID, err := mana.IDFromStr(consensusManaPledgeIDBase58)\n    if err != nil {\n        return\n    }\n     \n        /**\n        N.B to pledge mana to the node issuing the transaction, use empty pledgeIDs.\n        emptyID := identity.ID{}\n        accessManaPledgeID, consensusManaPledgeID := emptyID, emptyID\n        **/      \n\n    // destination address.\n    destAddressBase58 := "your_base58_encoded_address"\n    destAddress, err := ledgerstate.AddressFromBase58EncodedString(destAddressBase58)\n    if err != nil {\n        return\n    }\n\n    // output to consume.\n    outputIDBase58 := "your_base58_encoded_outputID"\n    out, err := ledgerstate.OutputIDFromBase58(outputIDBase58)\n    if err != nil {\n        return\n    }\n    inputs := ledgerstate.NewInputs(ledgerstate.NewUTXOInput(out))\n\n    // UTXO output.\n    output := ledgerstate.NewSigLockedColoredOutput(ledgerstate.NewColoredBalances(map[ledgerstate.Color]uint64{\n        ledgerstate.ColorIOTA: uint64(1337),\n    }), destAddress)\n    outputs := ledgerstate.NewOutputs(output)\n\n    // build tx essence.\n    txEssence := ledgerstate.NewTransactionEssence(0, time.Now(), accessManaPledgeID, consensusManaPledgeID, inputs, outputs)\n\n    // sign.\n    seed := walletseed.NewSeed([]byte("your_seed"))\n    kp := seed.KeyPair(0)\n    sig := ledgerstate.NewED25519Signature(kp.PublicKey, kp.PrivateKey.Sign(txEssence.Bytes()))\n    unlockBlock := ledgerstate.NewSignatureUnlockBlock(sig)\n\n    // build tx.\n    tx = ledgerstate.NewTransaction(txEssence, ledgerstate.UnlockBlocks{unlockBlock})\n    return\n}\n')),(0,s.kt)("h3",{id:"post-the-transaction"},"Post the transaction"),(0,s.kt)("p",null,"There are 2 available options to post the created transaction."),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"GoShimmer client lib"),(0,s.kt)("li",{parentName:"ul"},"Web API")),(0,s.kt)("h4",{id:"post-via-client-lib"},"Post via client lib"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-go"},'func postTransactionViaClientLib() (res string , err error) {\n    // connect to goshimmer node\n    goshimmerClient := client.NewGoShimmerAPI("http://127.0.0.1:8080", client.WithHTTPClient(http.Client{Timeout: 60 * time.Second}))\n\n    // build tx from previous step\n    tx, err := buildTransaction()\n    if err != nil {\n        return\n    }\n\n    // send the tx payload.\n    res, err = goshimmerClient.PostTransaction(tx.Bytes())\n    if err != nil {\n        return\n    }\n    return\n}\n')),(0,s.kt)("h4",{id:"post-via-web-api"},"Post via web API"),(0,s.kt)("p",null,"First, get the transaction bytes."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-go"},"// build tx from previous step\ntx, err := buildTransaction()\nif err != nil {\n    return\n}\nbytes := tx.Bytes()\n\n// print bytes\nfmt.Println(string(bytes))\n")),(0,s.kt)("p",null,"Then, post the bytes."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-shell",metastring:"script",script:!0},"curl --location --request POST 'http://localhost:8080/ledgerstate/transactions' \\\n--header 'Content-Type: application/json' \\\n--data-raw '{\n    \"tx_bytes\": \"bytes...\"\n}'\n")))}p.isMDXComponent=!0}}]);