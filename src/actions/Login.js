import { ethers } from "ethers";
import { chainIdHex, rpc, networkName } from '../contractdetails/contractdetails';
import factorycontract from "./factorycontract";


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

export default Login;