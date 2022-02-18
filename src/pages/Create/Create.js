import React, { useContext, useState } from "react";
import { stateContext } from "../../App";
import "./Create.css"

export default function Create() {
    let _stateContext = useContext(stateContext);

    const [tokenData, setTokenData] = useState({
        tokenName: "",
        symbol: "",
        totalSupply: 0
    })


    const handleState = (e) => {

        switch (e.target.name) {
            case 'tokenname':
                setTokenData({ ...tokenData, tokenName: e.target.value })

                break;
            case 'symbol':
                setTokenData({ ...tokenData, symbol: e.target.value })

                break;
            case 'supply':
                setTokenData({ ...tokenData, totalSupply: e.target.value })

                break;
            default:
                break;
        }

    };

    const createToken = async (e) => {
        e.preventDefault();
        let state_ = await _stateContext.appState;
        let reciept = await state_.erc20factory.deployNewERC20Token(tokenData.tokenName, tokenData.symbol, tokenData.totalSupply);
        console.log(reciept);

        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );

        setTokenData({
            tokenName: "",
            symbol: "",
            totalSupply: 0
        })

    }

    return (
        <div className="box">
            <form className="formbox">
                <fieldset className="inputgroup">
                    <label>Token Name:</label>
                    <input type="text" name="tokenname" placeholder="name of your coin, ex. uniswap" size={50} onChange={handleState} />
                </fieldset>
                <fieldset className="inputgroup">
                    <label>Token Symbol:</label>
                    <input type="text" name="symbol" placeholder="symbol of your coin, ex. UNI" onChange={handleState} />
                </fieldset>
                <fieldset className="inputgroup">
                    <label>Total Supply:</label>
                    <input type="text" name="supply" placeholder="supply of your coin, ex. 10000000000" onChange={handleState} />
                </fieldset>
                <button type="submit" className="submitbutton" onClick={createToken} >Create Token</button>
            </form>
        </div>
    )
}