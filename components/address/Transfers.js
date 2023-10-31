import { useEffect, useState } from "react"
import Link from "next/link"

import PageIndex from "../../components/PageIndex.js"

const style_infoBlock =
    " flex flex-col gap-3 border border-gray-300 py-6 px-12 bg-white rounded w-[80rem] z-10 "
const style_drop =
    " flex text-grey-600 group cursor-pointer group p-2 justify-between "

export default function Transfers({ al, address, isSender }) {
    const [transfers, setTransfers] = useState(0)
    const [show, setShow] = useState(false)
    const [pageIndex, setPageIndex] = useState(-1)
    const [content, setContent] = useState(0)
    const [nextPageKey, setNextPageKey] = useState(0)
    const [indexes, setIndexes] = useState([-1, -1, -1])

    useEffect(() => {
        setTransfers(0)
        setShow(false)
        setContent(0)
    }, [address])

    async function getTransfers() {
        let options = {
            category: ["external", "internal", "erc20", "erc721", "erc1155"],
            maxCount: 100,
            order: "desc",
            withMetadata: true,
        }
        if (isSender) {
            options.fromAddress = address
        } else {
            options.to = address
        }

        // If there is pageKey add it to fetch the next page
        if (nextPageKey != 0) {
            options.pageKey = nextPageKey
        }

        // Get the transactions
        const res = await al.core.getAssetTransfers(options)

        // Set the next page key if there is one
        if (res.pageKey != undefined) {
            setNextPageKey(res.pageKey)
        } else {
            setNextPageKey(0)
        }

        // If first time, initialize the array with result
        if (transfers == 0) {
            setTransfers([res.transfers])

            // Initialize token contet element
            setContent([])

            // force the index and arrows to update at the first time

            setPageIndex(0)
        } else {
            // Add the new tokens to the array
            setTransfers((prevState) => [...prevState, res.transfers])
        }
    }
    // Creates new pages for tokens each time the tokens array increases
    useEffect(() => {
        if (transfers == 0) return
        if (transfers.length > content.length) {
            // a new page needs to be added
            let temp = createContent(transfers, isSender)
            setContent((prevState) => [...prevState, temp])
        }
    }, [transfers])

    useEffect(() => {
        // the values of temp[] are adjusted to start from 1
        if (pageIndex == -1) return
        let temp = [...indexes]

        // PREV: If the page is the first one, there is no prev
        if (pageIndex > 0) {
            temp[0] = pageIndex
        } else {
            temp[0] = -1
        }

        // ACTUAL:
        temp[1] = pageIndex + 1

        // NEXT:
        // If the page is the last one, there is no next
        // Also check if there is a next page key
        if (content.length > pageIndex + 1 || nextPageKey != 0) {
            temp[2] = pageIndex + 2
        } else {
            temp[2] = -1
        }

        setIndexes(temp)
    }, [pageIndex])

    useEffect(() => {
        // nextPage update in ASYNC time
        // there are times when pageIndexes is updated before nextPageKey is set
        // this is a workaround to fix that and hide the next arrow when there is no next page
        if (nextPageKey == 0 && content.length <= pageIndex + 1) {
            let temp = [...indexes]
            temp[2] = -1
            setIndexes(temp)
        }
    }, [nextPageKey])

    function toggleShow() {
        setShow((prevState) => !prevState)

        if (transfers == 0) {
            getTransfers()
        }
    }

    function prevPage() {
        setPageIndex((prevState) => {
            if (prevState <= 0) return prevState
            else return prevState - 1
        })
    }
    function nextPage() {
        if (pageIndex < content.length && nextPageKey != 0) {
            // If the next page is not loaded, and there is a next page key, load it
            getTransfers()
        }
        setPageIndex((prevState) => prevState + 1)
    }

    return (
        <div className={"text-sm " + style_infoBlock}>
            <div
                className={" border-b  hover:border-amber-500 " + style_drop}
                onClick={toggleShow}
            >
                <div className="font-bold text-base">
                    {isSender ? "Sent 📤" : "Received 📥"}
                </div>
                <div className="group-hover:text-amber-500">
                    {show ? "▲" : "▼"}
                </div>
            </div>
            {show && content != 0 && (
                <>
                    <PageIndex
                        indexes={indexes}
                        prev={prevPage}
                        next={nextPage}
                    />
                    <div>{content[pageIndex]}</div>

                    <PageIndex
                        indexes={indexes}
                        prev={prevPage}
                        next={nextPage}
                    />
                </>
            )}
        </div>
    )
}

function createContent(transfers, isSender) {
    let data = transfers[transfers.length - 1]
    let res = []
    let tran, elem
    let values = {}

    elem = (
        <div
            className={
                "grid grid-cols-6 justify-between p-3 bg-gray-200 font-bold"
            }
            key="0"
        >
            <div>Time</div>
            <div>Tx</div>
            <div>{isSender ? "To" : "From"}</div>
            <div>Amount</div>
            <div>Asset</div>
            <div>Asset Contract</div>
        </div>
    )
    res.push(elem)

    for (let i = 0; i < data.length; i++) {
        tran = data[i]
        let toFrom = isSender ? tran.to : tran.from

        if (tran.rawContract.address == undefined) {
            values.contract = ""
        } else {
            values.contract =
                tran.rawContract.address.slice(0, 7) +
                "..." +
                tran.rawContract.address.slice(-5)
        }

        values.name = tran.asset
        if (tran.category != "external") {
            values.name += " (" + tran.category + ")"
        }

        const timestamp = new Date(tran.metadata.blockTimestamp)

        const date = timestamp.toLocaleDateString()
        const time = timestamp.toLocaleTimeString()

        elem = (
            <div
                className={
                    "grid grid-cols-6 justify-between p-3 border-b border-gray-300 hover:bg-gray-100"
                }
                key={tran.asset + "" + i}
            >
                <div className="flex flex-col">
                    <div>{time}</div>
                    <div>{date}</div>
                </div>
                <Link href={"/transaction/" + tran.hash}>
                    <span className="hover:text-sky-600 text-sky-500 underline transition duration-300 cursor-pointer">
                        {tran.hash.slice(0, 7) + "..." + tran.hash.slice(-5)}
                    </span>
                </Link>

                <Link href={"/address/" + tran.from}>
                    <span className="hover:text-sky-600 text-sky-500 underline transition duration-300 cursor-pointer">
                        {toFrom.slice(0, 5) + "..." + toFrom.slice(-3)}
                    </span>
                </Link>
                <div className="overflow-auto">
                    {toNonExponential(tran.value)}
                </div>
                <div>{values.name}</div>

                <div className="flex ">
                    <Link href={"/transaction/" + tran.rawContract.address}>
                        <span className="hover:text-sky-600 text-sky-500 underline transition duration-300 cursor-pointer">
                            {values.contract}
                        </span>
                    </Link>
                </div>
            </div>
        )

        res.push(elem)
    }

    return res
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
