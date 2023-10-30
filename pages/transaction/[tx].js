import { useEffect, useState } from "react"
import Link from "next/link"
const { Network, Alchemy, Utils } = require("alchemy-sdk")
require("dotenv").config()

import Header from "../../components/Header.js"
import CopyToClipboardButton from "../../components/CopyToClipboardButton.js"
import Footer from "@/components/Footer.js"

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
}

const alchemy = new Alchemy(settings)
const al = alchemy.core

const style_link = " underline text-sky-500 hover:text-sky-600 "
const style_infoBlock =
    " flex flex-col gap-3 border border-gray-300 py-6 px-12 bg-white rounded w-[80rem] z-10 "
const style_infoline = " flex flex-row gap-2 "
const style_infoName = " w-1/4 "
const style_infoData = " w-3/4 overflow-y-auto "

export default function transaction({ tx, isTxn }) {
    const [receipt, setReceipt] = useState(0)

    // General INFO
    const [from, setFrom] = useState(0)
    const [nonce, setNonce] = useState(0)
    const [to, setTo] = useState(0)
    const [action, setAction] = useState("")
    const [value, setValue] = useState(0)
    const [status, setStatus] = useState(0)

    // Transaction INFO
    const [blockNumber, setBlockNumber] = useState(0)
    const [callData, setCallData] = useState(0)
    const [confirmations, setConfirmations] = useState(0)
    const [blockIndex, setBlockIndex] = useState(0)
    const [type, setType] = useState(0)

    // GAS INFO
    const [gasPrice, setGasPrice] = useState(0)
    const [gasLimit, setGasLimit] = useState(0)
    const [maxFeePerGas, setMaxFeePerGas] = useState(0)
    const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState(0)

    // Security INFO
    const [secS, setSecS] = useState(0)
    const [secR, setSecR] = useState(0)
    const [secV, setSecV] = useState(0)

    useEffect(() => {
        async function getBalance() {
            const res = await al.getTransaction(tx)
            setReceipt(res)
        }
        getBalance()
    }, [tx])

    useEffect(() => {
        if (receipt == 0) return

        console.log(receipt)

        // General INFO
        setTo(receipt.to)
        setFrom(receipt.from)
        if (receipt.to == null) {
            setAction("📄 Contract Creation")
        } else if (receipt.data == "0x") {
            setAction("💸 Transfer")
        } else {
            setAction("▶️ Contract Call")
        }

        setValue(hexToValue(receipt.value._hex, "ether"))
        setNonce(receipt.nonce)

        // Transaction INFO
        setBlockNumber(receipt.blockNumber)
        setCallData(receipt.data)
        setConfirmations(receipt.confirmations)
        setBlockIndex(receipt.transactionIndex)
        setType(receipt.type)

        if (receipt.confirmations == 0) {
            setStatus("Unconfirmed")
        } else if (receipt.confirmations < 6) {
            setStatus("Pending")
        } else {
            setStatus("Confirmed")
        }

        // GAS INFO
        setGasPrice(hexToValue(receipt.gasPrice._hex, "gwei"))
        setGasLimit(Number(receipt.gasLimit._hex))
        if (receipt.maxFeePerGas != null) {
            setMaxFeePerGas(hexToValue(receipt.maxFeePerGas._hex, "gwei"))
        }
        if (receipt.maxPriorityFeePerGas != null) {
            setMaxPriorityFeePerGas(
                hexToValue(receipt.maxPriorityFeePerGas._hex, "gwei")
            )
        }

        // Security INFO
        setSecS(receipt.s)
        setSecR(receipt.r)
        setSecV(receipt.v)
    }, [receipt])

    return (
        <div className="flex relative content-between justify-between text-sm flex-col min-h-screen w-full bg-gray-900 text-gray-900 items-center gap-3 bg-gradient-to-t from-gray-800 to-gray-600 ">
            <Header />
            {isTxn && (
                <main className="flex flex-col w-full h-full items-center justify-center gap-6">
                    <div className="  mt-6 text-center z-10 ">
                        <div className="text-2xl text-gray-300 font-bold">
                            Transaction
                        </div>

                        <div className="text-base text-amber-500  flex items-center gap-2">
                            {tx} <CopyToClipboardButton textToCopy={tx} />
                        </div>
                    </div>

                    <div className={" mt-6 pb-9" + style_infoBlock}>
                        <div className="text-2xl border-b mt-3 border-orange-300 text-orange-300">
                            General Info
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>From</div>
                            <div className={" flex gap-2" + style_infoData}>
                                <Link
                                    href={"/address/" + from}
                                    className={" " + style_link}
                                >
                                    {from}
                                </Link>
                                <CopyToClipboardButton textToCopy={from} />
                                <div className="border text-xs px-2 py-1 rounded bg-gray-100 w-fit">
                                    {" "}
                                    Address Nonce: {nonce}
                                </div>
                            </div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>To</div>
                            <Link
                                href={"/address/" + to}
                                className={
                                    " w-fit " + style_link + style_infoData
                                }
                            >
                                {to}
                            </Link>
                            <CopyToClipboardButton textToCopy={to} />
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>Action</div>
                            <div className={"" + style_infoData}>{action}</div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>Value</div>
                            <div className={"" + style_infoData}>
                                {value} ETH
                            </div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>Status</div>

                            {status == "Unconfirmed" && (
                                <div
                                    className={
                                        " text-gray-500 border border-gray-500 rounded px-2 py-1 w-fit "
                                    }
                                >
                                    {status}
                                </div>
                            )}
                            {status == "Pending" && (
                                <div
                                    className={
                                        " text-amber-500 border border-amber-500 rounded px-2 py-1 w-fit "
                                    }
                                >
                                    {status}
                                </div>
                            )}
                            {status == "Confirmed" && (
                                <div
                                    className={
                                        " text-green-500 border border-green-500 rounded px-2 py-1 w-fit "
                                    }
                                >
                                    {status}
                                </div>
                            )}
                        </div>
                        <div className="text-2xl border-b mt-3 border-orange-300 text-orange-300">
                            Transaction Details
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>Call Data</div>
                            <div className={"" + style_infoData}>
                                {callData}
                            </div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Confirmations
                            </div>
                            <div className={"" + style_infoData}>
                                {confirmations}
                            </div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>Block Id</div>
                            <Link
                                href={"/block/" + blockNumber}
                                className={
                                    " w-fit " + style_link + style_infoData
                                }
                            >
                                {blockNumber}
                            </Link>
                            <CopyToClipboardButton textToCopy={blockNumber} />
                        </div>

                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Index in Block
                            </div>
                            <div className={"" + style_infoData}>
                                {blockIndex}
                            </div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Transaction Type
                            </div>
                            <div className={"" + style_infoData}>{type}</div>
                        </div>
                        <div className="text-2xl border-b mt-3 border-orange-300 text-orange-300">
                            Gas Info
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>Gas Price</div>
                            <div className={"" + style_infoData}>
                                {gasPrice} Gwei
                            </div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>Gas Limit</div>
                            <div className={"" + style_infoData}>
                                {gasLimit} units
                            </div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Max Fee per Gas
                            </div>
                            <div className={"" + style_infoData}>
                                {maxFeePerGas} Gwei
                            </div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Max PRIORITY Fee per Gas
                            </div>
                            <div className={"" + style_infoData}>
                                {maxPriorityFeePerGas} Gwei
                            </div>
                        </div>
                        <div className="text-2xl border-b mt-3 border-orange-300 text-orange-300">
                            Security Details
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Singature S
                            </div>
                            <div className={"" + style_infoData}>{secS}</div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Singature R
                            </div>
                            <div className={"" + style_infoData}>{secR}</div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Singature V
                            </div>
                            <div className={"" + style_infoData}>{secV}</div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>Nonce</div>
                            <div className={"" + style_infoData}>{nonce}</div>
                        </div>
                    </div>
                </main>
            )}
            {!isTxn && <div>INVALID Transaction tx: {tx}</div>}
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context) {
    const { tx } = context.params
    const txnFormat = /^0x[a-zA-Z0-9]{64}$/
    let isTxn = true
    if (!txnFormat.test(tx)) {
        isTxn = false
    }

    return { props: { tx, isTxn } }
}

function hexToValue(hex, type) {
    return Number(
        Utils.formatUnits(toNonExponential(Number(hex)).toString(), type)
    )
}
function toNonExponential(value) {
    let data = String(value).split(/[eE]/)
    if (data.length == 1) return data[0]

    let z = "",
        sign = value < 0 ? "-" : "",
        str = data[0].replace(".", ""),
        mag = Number(data[1]) + 1

    if (mag < 0) {
        z = sign + "0."
        while (mag++) z += "0"
        return z + str.replace(/^\-/, "")
    }
    mag -= str.length
    while (mag--) z += "0"
    return str + z
}
