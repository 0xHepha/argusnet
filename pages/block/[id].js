import Link from "next/link"
import { useEffect, useState } from "react"
const { Network, Alchemy, Utils } = require("alchemy-sdk")
require("dotenv").config()

import Header from "../../components/Header.js"
import CopyToClipboardButton from "../../components/CopyToClipboardButton.js"
import Footer from "../../components/Footer.js"

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
}

const alchemy = new Alchemy(settings)
const al = alchemy.core

// Tailwind style variables
const style_link = " underline text-sky-500 hover:text-sky-600 "
const style_infoBlock =
    " flex flex-col gap-3 border border-gray-300 bg-white rounded w-3/4 z-10 "
const style_infoline = " flex flex-row gap-2 "
const style_infoName = " w-1/4 "
const style_infoData = " overflow-y-auto "
const style_drop =
    " flex text-grey-600 group cursor-pointer group p-2 justify-between "
const style_transactionBase = " grid grid-flow-col grid-cols-4 gap-2 w-full "
const style_transactionLineTitle =
    " text-xl font-bold mb-2 " + style_transactionBase
const style_transactionLine = " even:bg-gray-100 py-2 " + style_transactionBase
const style_transactionElement = " w-fit "

export default function block({ id, isBlock }) {
    const [bd, setBd] = useState(0)
    const [blockNumber, setBlockNumber] = useState(0)
    const [blockStatus, setBlockStatus] = useState()
    const [blockDate, setBlockDate] = useState()
    const [miner, setMiner] = useState()
    const [gasUsed, setGasUsed] = useState(0)
    const [gasPercentage, setGasPercentage] = useState(0)
    const [baseFeePerGas, setBaseFeePerGas] = useState(0)
    const [totalSpent, setTotalSpent] = useState()

    const [showTransfers, setShowTransfers] = useState(false)
    const [showCalls, setShowCalls] = useState(false)
    const [showCreations, setShowCreations] = useState(false)
    const [transactions, setTransactions] = useState(0)
    const [transactionContent, setTransactionsContent] = useState(0)

    // Tailwin style var

    function toggleShow(setFunction) {
        setFunction((prevState) => !prevState)
    }

    useEffect(() => {
        async function getBlockNumber() {
            setBlockNumber(await al.getBlockNumber())
        }
        async function getBlock() {
            setBd(await al.getBlockWithTransactions(Number(id)))
        }
        getBlockNumber().then(() => {
            getBlock()
        })
    }, [id])

    useEffect(() => {
        if (bd == undefined || bd == 0) return
        // SET GENERAL INFO
        if (blockNumber - id < 25) {
            setBlockStatus("Propagating")
        } else if (blockNumber - id < 90) {
            setBlockStatus("Safe")
        } else {
            setBlockStatus("Finalized")
        }
        setBlockDate(getDate(bd.timestamp * 1000))
        setMiner(bd.miner)

        // SET GAS INFO
        setGasUsed(BigInt(bd.gasUsed._hex).toLocaleString("en-US"))
        setGasPercentage(
            ((parseInt(bd.gasUsed._hex) * 100) / 15000000).toFixed(0)
        )

        if (bd.baseFeePerGas != undefined) {
            setBaseFeePerGas(
                hexToValue(bd.baseFeePerGas._hex, "gwei").toFixed(4)
            )
        }

        setTotalSpent(
            hexToValue(totalValueSent(bd.transactions), "ether").toFixed(2)
        )

        setTransactions(getTransactionTypes(bd.transactions))
    }, [bd])

    useEffect(() => {
        if (transactions == 0) return
        let trans = [[], [], []]

        trans[0] = getTransactionElements(transactions[0])
        trans[1] = getTransactionElements(transactions[1])
        trans[2] = getTransactionElements(transactions[2])

        setTransactionsContent(trans)
    }, [transactions])

    return (
        <div className="flex relative content-between justify-between text-sm flex-col min-h-screen w-full bg-gray-900 text-gray-900 items-center gap-3 bg-gradient-to-t from-gray-800 to-gray-600 ">
            <Header />
            {isBlock && (
                <main className="flex flex-col w-full h-full items-center justify-center gap-6">
                    <div className="  mb-3 text-center flex text-2xl font-bold text-gray-300 z-10 gap-2 items-center ">
                        Block <div className="text-amber-500">#{id}</div>{" "}
                        <CopyToClipboardButton textToCopy={id} />
                    </div>

                    <div className={"p-6 " + style_infoBlock}>
                        <div className="grid grid-flow-col gap-6">
                            <div className="grid gap-3 border border-gray-300 p-4">
                                <div className="text-2xl border-b mb-3 border-orange-300 text-orange-300">
                                    General Info
                                </div>
                                <div className={"" + style_infoline}>
                                    <div className={"" + style_infoName}>
                                        Block Number
                                    </div>
                                    <div
                                        className={
                                            " flex items-center gap-2" +
                                            style_infoData
                                        }
                                    >
                                        <Link
                                            className="text-lg hover:shadow "
                                            href={"" + (parseInt(id) - 1)}
                                        >
                                            ◁
                                        </Link>
                                        {id}
                                        {parseInt(id) + 1 <= blockNumber && (
                                            <Link
                                                className="text-lg hover:shadow"
                                                href={"" + (parseInt(id) + 1)}
                                            >
                                                ▷
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className={"" + style_infoline}>
                                    <div className={"" + style_infoName}>
                                        Status
                                    </div>

                                    {blockStatus == "Propagating" && (
                                        <div
                                            className={
                                                " text-gray-500 border border-gray-500 rounded px-2 w-fit " +
                                                style_infoData
                                            }
                                        >
                                            {blockStatus}
                                        </div>
                                    )}
                                    {blockStatus == "Safe" && (
                                        <div
                                            className={
                                                " text-amber-500 border border-amber-500 rounded px-2 w-fit " +
                                                style_infoData
                                            }
                                        >
                                            {blockStatus}
                                        </div>
                                    )}
                                    {blockStatus == "Finalized" && (
                                        <div
                                            className={
                                                " text-green-500 border border-green-500 rounded px-2 w-fit " +
                                                style_infoData
                                            }
                                        >
                                            {blockStatus}
                                        </div>
                                    )}
                                </div>
                                <div className={"" + style_infoline}>
                                    <div className={"" + style_infoName}>
                                        TimeStamp
                                    </div>
                                    <div className={"" + style_infoData}>
                                        {blockDate}
                                    </div>
                                </div>
                                <div className={"" + style_infoline}>
                                    <div className={"" + style_infoName}>
                                        Miner address
                                    </div>
                                    <Link
                                        href={"/address/" + miner}
                                        className={
                                            " underline text-sky-500 w-fit " +
                                            style_infoData +
                                            style_link
                                        }
                                    >
                                        {miner}{" "}
                                    </Link>
                                    <CopyToClipboardButton textToCopy={miner} />
                                </div>
                                <div className={"" + style_infoline}>
                                    <div className={"" + style_infoName}>
                                        Transactions Amount
                                    </div>
                                    <div className={"" + style_infoData}>
                                        {bd && bd.transactions.length}
                                    </div>
                                </div>
                                <div className={"" + style_infoline}>
                                    <div className={"" + style_infoName}>
                                        Total Sent
                                    </div>
                                    <div className={"" + style_infoData}>
                                        {totalSpent}
                                        {" ETH"}
                                    </div>
                                </div>
                            </div>
                            <div className="border border-gray-300 p-4 flex flex-col gap-3 ">
                                <div className="text-2xl border-b mb-3 border-orange-300 text-orange-300">
                                    Gas Info
                                </div>{" "}
                                <div className={" " + style_infoline}>
                                    <div className={"" + style_infoName}>
                                        Gas Used
                                    </div>
                                    <div
                                        className={
                                            " flex gap-2 items-center" +
                                            style_infoData
                                        }
                                    >
                                        {gasUsed}
                                        {" ⛽"}
                                        {gasPercentage && (
                                            <div
                                                className={
                                                    "text-sm px-2 rounded " +
                                                    (gasPercentage > 100
                                                        ? "bg-red-200"
                                                        : "bg-green-200")
                                                }
                                            >
                                                {gasPercentage} % of gas target
                                                (15M)
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={"" + style_infoline}>
                                    <div className={"" + style_infoName}>
                                        Base Fee per Gas
                                    </div>
                                    <div className={"" + style_infoData}>
                                        {baseFeePerGas} Gwei
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={" px-12 py-3 " + style_infoBlock}>
                        <div
                            className={
                                " border-b  hover:border-amber-500 " +
                                style_drop
                            }
                            onClick={() => toggleShow(setShowTransfers)}
                        >
                            <div>
                                {transactions != 0 && transactions[0].length}{" "}
                                ETH transfers
                            </div>
                            <div className="group-hover:text-amber-500">
                                {showTransfers ? "▲" : "▼"}
                            </div>
                        </div>
                        {showTransfers && transactionContent != 0 && (
                            <div>{transactionContent[0]}</div>
                        )}
                    </div>
                    <div className={" px-12 py-3 " + style_infoBlock}>
                        <div
                            className={
                                " border-b  hover:border-amber-500 " +
                                style_drop
                            }
                            onClick={() => toggleShow(setShowCalls)}
                        >
                            <div>
                                {transactions != 0 && transactions[1].length}{" "}
                                Contract Calls
                            </div>
                            <div className="group-hover:text-amber-500">
                                {showCalls ? "▲" : "▼"}
                            </div>
                        </div>
                        {showCalls && transactionContent != 0 && (
                            <div>{transactionContent[1]}</div>
                        )}
                    </div>
                    <div className={" px-12 py-3 " + style_infoBlock}>
                        <div
                            className={
                                " border-b  hover:border-amber-500 " +
                                style_drop
                            }
                            onClick={() => toggleShow(setShowCreations)}
                        >
                            <div>
                                {transactions != 0 && transactions[2].length}{" "}
                                New Contracts
                            </div>
                            <div className="group-hover:text-amber-500">
                                {showCreations ? "▲" : "▼"}
                            </div>
                        </div>
                        {showCreations && transactionContent != 0 && (
                            <div>{transactionContent[2]}</div>
                        )}
                    </div>
                </main>
            )}
            {!isBlock && <div>INVALID Block id: {id}</div>}
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params

    const blockFormat = /^[0-9]+$/
    let isBlock = true
    if (!blockFormat.test(id)) {
        isBlock = false
    }

    return { props: { id, isBlock } }
}

function totalValueSent(transactions) {
    let total = 0
    for (let i = 0; i < transactions.length; i++) {
        total += parseInt(transactions[i].value._hex)
    }

    return total
}

function getTransactionTypes(transactions) {
    let res = [[], [], []] // 0: transaction,  1: contract call, 2: contract creation,
    let tran
    for (let i = 0; i < transactions.length; i++) {
        tran = transactions[i]

        // check if has value
        if (tran.to == null) {
            res[2].push(tran)
        } else if (tran.data != "0x") {
            res[1].push(tran)
        } else {
            res[0].push(tran)
        }
    }
    return res
}

function getTransactionElements(data) {
    let tran, elem
    let res = []

    elem = (
        <div className={"" + style_transactionLineTitle} key="0">
            <div>Tx Hash</div>
            <div>From</div>
            <div>To</div>
            <div>Value Sent</div>
        </div>
    )
    res.push(elem)

    for (let i = 0; i < data.length; i++) {
        tran = data[i]
        if (tran.to == null) {
            tran.to = "0x0"
        }
        elem = (
            <div
                className={"" + style_transactionLine}
                key={tran.hash + "-" + i}
            >
                <Link
                    href={"/transaction/" + tran.hash}
                    className={" " + style_link + style_transactionElement}
                >
                    {tran.hash.slice(0, 7) + "..." + tran.hash.slice(-3)}
                </Link>
                <Link
                    href={"/address/" + tran.from}
                    className={" " + style_link + style_transactionElement}
                >
                    {tran.from.slice(0, 5) + "..." + tran.from.slice(-3)}
                </Link>
                <Link
                    href={"/address/" + tran.to}
                    className={" " + style_link + style_transactionElement}
                >
                    {tran.to.slice(0, 5) + "..." + tran.to.slice(-3)}
                </Link>
                <div className={" " + style_transactionElement}>
                    {hexToValue(tran.value._hex, "ether").toFixed(5)} ETH
                </div>
            </div>
        )
        res.push(elem)
    }

    return res
}

// GENERIC FUNCTIONS

function getDate(timestamp) {
    let date = new Date(timestamp)
    let day = date.getDate()
    let month = date.getMonth() + 1 // Months are zero-based in JS.
    let year = date.getFullYear()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    const base = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`

    const now = Date.now()
    const diff = now - timestamp // Difference in milliseconds

    seconds = Math.floor(diff / 1000)
    minutes = Math.floor(seconds / 60)
    seconds = seconds % 60 // Remainder after subtracting minutes

    hours = Math.floor(minutes / 60)
    minutes = minutes % 60 // Remainder after subtracting hours

    let days = Math.floor(hours / 24)
    hours = hours % 24 // Remainder after subtracting days

    let weeks = Math.floor(days / 7)
    days = days % 7 // Remainder after subtracting weeks

    let months = Math.floor(weeks / 4) // Using 4 as an average weeks per month
    weeks = weeks % 4 // Remainder after subtracting months

    let years = Math.floor(months / 12)
    months = months % 12 // Remainder after subtracting years

    let extra = []
    if (years) extra.push(years === 1 ? "1 year" : `${years} years`)
    if (months) extra.push(months === 1 ? "1 month" : `${months} months`)
    if (weeks) extra.push(weeks === 1 ? "1 week" : `${weeks} weeks`)
    if (days) extra.push(days === 1 ? "1 day" : `${days} days`)
    if (hours) extra.push(hours === 1 ? "1 hour" : `${hours} hours`)
    if (minutes) extra.push(minutes === 1 ? "1 minute" : `${minutes} minutes`)
    if (seconds) extra.push(seconds === 1 ? "1 second" : `${seconds} seconds`)

    return `${base} (${extra} ago)`
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
