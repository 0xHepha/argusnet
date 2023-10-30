import { useEffect, useState, useRef } from "react"
import Link from "next/link"

import Image from "next/image"

import PageIndex from "../../components/PageIndex.js"

const style_infoBlock =
    " flex flex-col gap-3 border border-gray-300 py-6 px-12 bg-white rounded w-[80rem] z-10 "
const style_drop =
    " flex text-grey-600 group cursor-pointer group p-2 justify-between "

export default function Nfts({ al, address }) {
    const [nfts, setNfts] = useState(0)
    const [show, setShow] = useState(false)
    const [pageIndex, setPageIndex] = useState(-1)
    const [content, setContent] = useState(0)
    const [nextPageKey, setNextPageKey] = useState(0)
    const [indexes, setIndexes] = useState([-1, -1, -1])

    useEffect(() => {
        // Set to 0 and hidden for each time the address changes
        setNfts(0)
        setShow(false)
        setContent(0)
    }, [address])

    async function getNFTs() {
        // Default options for the request
        let options = {
            excludeFilters: "SPAM",
            orderBy: "TRANSFERTIME",
        }

        // If there is pageKey add it to fetch the next page
        if (nextPageKey != 0) {
            options.pageKey = nextPageKey
        }

        // get the nfts
        const res = await al.nft.getNftsForOwner(address, options)

        // Update if there is another page to fetch
        if (res.pageKey != undefined) {
            setNextPageKey(res.pageKey)
        } else {
            setNextPageKey(0)
        }

        // IF first time, initialize the array with result
        // else , append it
        if (nfts == 0) {
            setNfts([res.ownedNfts])

            // Initialize nft contet element
            setContent([])

            // Force indexes update
            setPageIndex(0)
        } else {
            setNfts((prevState) => [...prevState, res.ownedNfts])
        }
    }

    useEffect(() => {
        if (nfts == 0) return
        // if there are more data pages that content pages
        // create new elements
        if (nfts.length > content.length) {
            let temp = createContent(nfts)
            setContent((prevState) => [...prevState, temp])
        }
    }, [nfts])

    useEffect(() => {
        if (content == 0) return

        let temp = [...indexes]

        // PREV
        if (pageIndex > 0) {
            temp[0] = pageIndex
        } else {
            temp[0] = -1
        }

        // ACTUAL
        temp[1] = pageIndex

        // NEXT
        if (content.length > pageIndex + 1 || nextPageKey != 0) {
            temp[2] = pageIndex + 2
        }

        setIndexes(temp)
    }, [content])

    useEffect(() => {
        // nextPage updates ASYNCHRONOUSLY
        // this is why is checked here if there is a next page to show as index
        if (nextPageKey == 0 && content.length <= pageIndex + 1) {
            let temp = [...indexes]
            temp[2] = -1
            setIndexes(temp)
        }
    }, [nextPageKey])

    function toggleShow(setFunction) {
        setFunction((prevState) => !prevState)
        if (nfts == 0) {
            getNFTs()
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
            getNFTs()
        }
        setPageIndex((prevState) => prevState + 1)
    }

    return (
        <div className={"text-sm " + style_infoBlock}>
            <div
                className={" border-b  hover:border-amber-500 " + style_drop}
                onClick={() => toggleShow(setShow)}
            >
                <div className="font-bold text-base">NTFs 🖼️</div>
                <div className="group-hover:text-amber-500">
                    {show ? "▲" : "▼"}
                </div>
            </div>
            {show && content != 0 && (
                <>
                    <PageIndex
                        key="1"
                        indexes={indexes}
                        prev={prevPage}
                        next={nextPage}
                    />
                    <div>{content}</div>
                    <PageIndex
                        key="2"
                        indexes={indexes}
                        prev={prevPage}
                        next={nextPage}
                    />
                </>
            )}
        </div>
    )
}

// sometimes there is litterally no way to make a unique key since they some nfts with all data the same

function createContent(nfts) {
    let data = nfts[nfts.length - 1]
    let res = []
    let tok, elem
    let values

    for (let i = 0; i < data.length; i++) {
        values = {}
        tok = data[i]

        // If the type is unknown, skip this nft
        if (tok.tokenType === "UNKNOWN") continue
        if (tok.tokenUri == undefined) continue

        // Set al values to avoid undefined and also shorten the values

        if (tok.media[0] == undefined) {
            values.image = tok.tokenUri.gateway
        } else {
            if (tok.media[0].thumbnail == undefined) {
                values.image = tok.media[0].gateway
            } else {
                values.image = tok.media[0].thumbnail
            }
        }

        if (tok.contract.name == undefined) continue
        if (tok.contract.name.length > 20) {
            values.name = tok.contract.name.slice(0, 20) + "..."
        } else {
            values.name = tok.contract.name
        }

        if (tok.contract.symbol.length > 7) {
            values.name += " (" + tok.contract.symbol.slice(0, 7) + "...)"
        } else {
            values.name += " (" + tok.contract.symbol + ")"
        }

        values.price = 0
        if (tok.contract.openSea.floorPrice != undefined) {
            values.price = tok.contract.openSea.floorPrice
        }
        if (tok.tokenId.length > 7) {
            values.tokenId = tok.tokenId.slice(0, 7) + "..."
        } else {
            values.tokenId = tok.tokenId
        }
        if (tok.title.length > 20) {
            values.title = tok.title.slice(0, 20) + "..."
        } else {
            values.title = tok.title
        }
        if (values.title.length <= 0) {
            values.title = "-"
        }

        elem = (
            <div
                className={
                    "rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transform hover:-translate-y-1 transition duration-300 w-72 h-auto mx-auto border border-gray-300"
                }
                key={values.title + "-" + i}
            >
                <div className="h-56 relative">
                    <Image
                        className="object-cover"
                        src={values.image}
                        layout="fill"
                        unoptimized
                        alt={tok.title + " logo"}
                    />
                </div>
                <div className={"flex text-xs flex-col justify-between p-4"}>
                    <div>
                        <div
                            className={
                                "font-bold text-amber-500 text-xs border border-amber-500 bg-amber-100 px-1"
                            }
                        >
                            {values.name}
                        </div>
                        <div className=" text-gray-700 mb-1 bg-gray-100 border px-1">
                            {values.title}
                        </div>
                    </div>
                    <div className={" mb-1 px-1"}>
                        Token ID:
                        <span className="text-amber-500">
                            {" "}
                            #{values.tokenId}
                        </span>
                    </div>
                    <div className={" mb-2 px-1"}>
                        Price:{" "}
                        <span className="text-green-500">
                            {values.price} ETH
                        </span>
                    </div>
                    <Link href={"/address/" + tok.contract.address}>
                        <span className=" hover:text-sky-600 text-sky-500 underline transition duration-300 cursor-pointer px-1">
                            {tok.contract.address.slice(0, 7) +
                                "..." +
                                tok.contract.address.slice(-5)}
                        </span>
                    </Link>
                </div>
            </div>
        )
        res.push(elem)
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {res}
        </div>
    )
}
