import React, { useEffect, useContext, useState } from "react";
import "./Home.css";

// import {ethers} from "ethers";
import { stateContext } from "../../App";
import { useNavigate } from "react-router-dom";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Home() {
    let _stateContext = useContext(stateContext);
    const navigate = useNavigate();
    let [list, setList] = useState([]);



    const convertBN = (bn) => {
        return bn.toNumber()
    }

    useEffect(() => {
        const loadcontract = async () => {
            let state = await _stateContext.appState;
            let contract = state.erc20factory;
            let result;
            try{
                result = await contract.queryFilter("ERC20TokenCreated")
            } finally {
                setList(result.map((val) => {
                    return val.args;
                }))
            }

        }

        loadcontract()
    }, [_stateContext])
    return (
        <div className="table">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <caption>A basic table example with a caption</caption>
                    <TableHead>
                        <TableRow>
                            <TableCell>Token Address</TableCell>
                            <TableCell align="right">Symbol</TableCell>
                            <TableCell align="right">Cap</TableCell>
                            <TableCell align="right"></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((row) => (
                            <TableRow key={row.tokenAddress}>
                                <TableCell component="th" scope="row">
                                    {row.tokenAddress}
                                </TableCell>
                                <TableCell align="right">{row.symbol}</TableCell>
                                <TableCell align="right">{convertBN(row.cap)}</TableCell>
                                <TableCell align="right"><button
                                    onClick={() => navigate(`/token/${row.tokenAddress}`)}
                                    className="button-home"
                                >Go to Token</button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}