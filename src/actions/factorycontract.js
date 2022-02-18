import { ethers } from "ethers";
import { address, abi } from "../contractdetails/contractdetails";

export default function factorycontract(signerorprovider) {
    return new ethers.Contract(address, abi, signerorprovider);
}