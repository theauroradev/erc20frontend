import React, { useContext, useEffect, useState } from "react";
import {
    useParams
} from "react-router-dom";
import { stateContext } from "../../App";
import { erc20abi } from "../../contractdetails/contractdetails";
import { ethers } from "ethers";
import "./Token.css"

export default function Token() {
    const { address } = useParams();
    let _stateContext = useContext(stateContext);
    const [contract, setContract] = useState({
        contract: null,
        userAddress: '',
        minter: false,
        balance: 0
    });
    const [callData, setCallData] = useState({
        trasnferaddress: "",
        transferamount: 0,
        mintaddress: "",
        mintamount: 0
    })

    useEffect(() => {
        async function fetchContract() {
            let _state = await _stateContext.appState;
            let _signer = await _state.signer;
            if (_signer) {
                let _contract = new ethers.Contract(address, erc20abi, _signer)
                let userAddress = await _signer.getAddress();
                let balance = await _contract.balanceOf(userAddress);
                let minter = await _contract.checkIfMinter(userAddress);
                console.log(userAddress);
                setContract({
                    contract: _contract,
                    userAddress: userAddress,
                    minter: minter,
                    balance: balance.toNumber()
                });
            }
        }
        fetchContract();
    }, [_stateContext, address])

    const handleState = (e) => {

        switch (e.target.name) {
            case 'trasnferaddress':
                setCallData({ ...callData, trasnferaddress: e.target.value })
                // console.log(e.target.value)
                console.log(callData.trasnferaddress)
                break;
            case 'transferamount':
                setCallData({ ...callData, transferamount: e.target.value })
                console.log(e.target.value)
                break;
            case 'mintaddress':
                setCallData({ ...callData, mintaddress: e.target.value })
                console.log(e.target.value)
                break;
            case 'mintamount':
                setCallData({ ...callData, mintamount: e.target.value })
                console.log(e.target.value)
                break;
            default:
                break;
        }

    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        console.log(callData.mintaddress)
        let reciept = await contract.contract.transfer(callData.trasnferaddress, callData.transferamount);
        console.log(reciept);
        console.log('clicked')

        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );

        setCallData({
            trasnferaddress: "",
            transferamount: 0,
            mintaddress: "",
            mintamount: 0
        })
    }

    const handleMint = async (e) => {
        e.preventDefault();
        console.log('clicked')
        let reciept = await contract.contract.mint(callData.mintaddress, callData.mintamount);
        console.log(reciept);

        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );

        setCallData({
            trasnferaddress: "",
            transferamount: 0,
            mintaddress: "",
            mintamount: 0
        })
    }

    return (
        <>
            {contract.contract ?
                <div className="container">
                    <div className="balance">
                        <h2>Your Balance: {contract.balance}</h2>
                    </div>
                    <div className="formgroup">
                        <h3>Transfer Tokens</h3>
                        <form>
                            <div className="transfertoken">
                                <fieldset className="tokenfieldset">
                                    <label>Send To</label>
                                    <input type={"text"} className="tokeninput" name="trasnferaddress" onChange={handleState}></input>
                                </fieldset>
                                <fieldset className="tokenfieldset">
                                    <label>Amount</label>
                                    <input type={"text"} className="tokeninput" name="transferamount" onChange={handleState}></input>
                                </fieldset>
                            </div>
                            <button type="submit" className="submitbutton" onClick={handleTransfer}>Transfer Tokens</button>
                        </form>
                    </div>
                    {contract.minter ?
                        <>
                            <h2>You have minter role for this token</h2>
                            <div className="formgroup">
                                <h3>Mint Tokens</h3>
                                <form>
                                    <div className="transfertoken">
                                        <fieldset className="tokenfieldset">
                                            <label>Send Minted Tokens To</label>
                                            <input type={"text"} className="tokeninput" name="mintaddress" onChange={handleState}></input>
                                        </fieldset>
                                        <fieldset className="tokenfieldset">
                                            <label>Amount</label>
                                            <input type={"text"} className="tokeninput" name="mintamount" onChange={handleState}></input>
                                        </fieldset>
                                    </div>
                                    <button type="submit" className="submitbutton" onClick={handleMint}>Mint Tokens</button>
                                </form>
                            </div>
                        </>: <></>
                    }
                </div>
                : <p>please login</p>}
        </>
    )
}