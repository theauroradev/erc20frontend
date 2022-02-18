import React, { useContext, useState } from "react";
import "./Header.css";

import { Link, useNavigate } from "react-router-dom";
import { stateContext } from "../../App";

import { ethers } from "ethers";
import { chainIdHex, rpc, networkName } from '../../contractdetails/contractdetails';
import factorycontract from "../../actions/factorycontract";

function Header() {
    const [ signer, setSigner] = useState(null);
    const _stateContract = useContext(stateContext);

    const navigate = useNavigate();

    const Login = async (_stateContract) => {
        if (window.ethereum) {
    
            const provider = new ethers.providers.Web3Provider(
                window.ethereum,
                "any"
            );
    
            await provider.send("eth_requestAccounts", []);
    
            try {
                await provider.send(
                    'wallet_switchEthereumChain',
                    [{ chainId: `${chainIdHex}` }],
                );
                console.log("switched");
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await provider.send(
                            "wallet_addEthereumChain",
                            [{
                                chainId: `${chainIdHex}`,
                                chainName: `${networkName}`,
                                rpcUrls: [`${rpc}`],
                                nativeCurrency: {
                                    name: 'ETH',
                                    symbol: 'ETH',
                                    decimals: 18
                                },
                            }],
                        );
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
            let _signer = await provider.getSigner()
            setSigner(_signer);
            let erc20factory = await factorycontract(_signer);
            console.log(_signer)
            return await _stateContract.appDispatch({
                type: 'login',
                payload: {
                    erc20factory: erc20factory,
                    signer: _signer
                }
            });
        }
    }

    return(
        <h1 className="header">
            <p><Link to={`/`}>Mintty</Link></p>
            {signer?
                <button
                    onClick={() => navigate("/create")}
                    className="button"
                >Create Token</button>
            :   <button
                    onClick={() => {
                        Login(_stateContract)
                        console.log(_stateContract.appState);
                    }}
                    className="button"
                >login</button>}
        </h1>
    )
}

export default Header;