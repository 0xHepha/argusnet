import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import PageIndex from "../../components/PageIndex.js"

const style_infoBlock =
    " flex flex-col gap-3 border border-gray-300 py-6 px-12 bg-white rounded w-[80rem] z-10 "
const style_drop =
    " flex text-grey-600 group cursor-pointer group p-2 justify-between "

export default function Tokens({ al, address }) {
    const [tokens, setTokens] = useState(0)
    const [show, setShow] = useState(false)
    const [pageIndex, setPageIndex] = useState(-1)
    const [content, setContent] = useState(0)
    const [nextPageKey, setNextPageKey] = useState(0)
    const [indexes, setIndexes] = useState([-1, -1, -1])

    useEffect(() => {
        // Set to 0 and hidden for each time the address changes
        setTokens(0)
        setShow(false)
        setContent(0)
    }, [address])

    async function getTokens() {
        // Default options for the request
        let options = {
            excludeFilters: "SPAM",
        }

        // If there is pageKey add it to fetch the next page
        if (nextPageKey != 0) {
            options.pageKey = nextPageKey
        }

        // Get the tokens
        const res = await al.getTokensForOwner(address, options)

        // Set the next page key if there is one
        if (res.pageKey != undefined) {
            setNextPageKey(res.pageKey)
        } else {
            setNextPageKey(0)
        }

        // If first time, initialize the array with result
        if (tokens == 0) {
            setTokens([res.tokens])

            // Initialize token contet element
            setContent([])

            // force the index and arrows to update at the first time

            setPageIndex(0)
        } else {
            // Add the new tokens to the array
            setTokens((prevState) => [...prevState, res.tokens])
        }
    }

    // Creates new pages for tokens each time the tokens array increases
    useEffect(() => {
        if (tokens == 0) return
        if (tokens.length > content.length) {
            // a new page needs to be added
            let temp = createContent(tokens)
            setContent((prevState) => [...prevState, temp])
        }
    }, [tokens])

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

        if (tokens == 0) {
            getTokens()
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
            getTokens()
        }
        setPageIndex((prevState) => prevState + 1)
    }

    return (
        <div className={"text-sm " + style_infoBlock}>
            <div
                className={" border-b  hover:border-amber-500 " + style_drop}
                onClick={toggleShow}
            >
                <div className="font-bold text-base">ERC20 Tokens 💎</div>
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

function createContent(tokens) {
    let data = tokens[tokens.length - 1]
    let res = []
    let tok, elem
    let logo = ""
    let values

    elem = (
        <div
            className={
                "grid grid-cols-3 justify-between p-3 bg-gray-200 font-bold"
            }
            key="0"
        >
            <div className="flex justify-start">Name</div>
            <div className="flex justify-center">Balance</div>
            <div className="flex justify-end">Token Address</div>
        </div>
    )
    res.push(elem)
    for (let i = 0; i < data.length; i++) {
        values = {}
        tok = data[i]
        if (tok.symbol == undefined) continue

        // Set the info previously to avoid infinite texts
        if (tok.name.length > 20) {
            values.name = tok.name.slice(0, 20) + "..."
        } else {
            values.name = tok.name
        }
        if (tok.symbol.length > 7) {
            values.name += " (" + tok.symbol.slice(0, 7) + "..."
        } else {
            values.name += " (" + tok.symbol + ")"
        }

        if (tok.logo != undefined) {
            logo = (
                <div className="relative h-6 w-6 ">
                    <Image
                        className="object-contain"
                        src={tok.logo}
                        layout="fill"
                        unoptimized
                        alt={tok.name + " logo"}
                    />
                </div>
            )
        } else {
            logo = ""
        }
        elem = (
            <div
                className={
                    "grid grid-cols-3 justify-between p-3 border-b border-gray-300 hover:bg-gray-100"
                }
                key={values.name + "" + i}
            >
                <div className={"flex justify-start space-x-2"}>
                    {logo}
                    <div>{values.name}</div>
                </div>
                <div className={"flex justify-center"}>{tok.balance}</div>
                <div className="flex justify-end">
                    <Link href={"/address/" + tok.contractAddress}>
                        <span className="hover:text-sky-600 text-sky-500 underline transition duration-300 cursor-pointer">
                            {tok.contractAddress.slice(0, 7) +
                                "..." +
                                tok.contractAddress.slice(-5)}
                        </span>
                    </Link>
                </div>
            </div>
        )
        res.push(elem)
    }

    return res
}
