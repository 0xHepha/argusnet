const { Network, Alchemy, Utils } = require("alchemy-sdk")
import Link from "next/link"
import { useEffect, useState } from "react"

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
}

const alchemy = new Alchemy(settings)
const al = alchemy.core

export default function InfoBar() {
    const [blockNumber, setBlockNumber] = useState()
    const [gasPrice, setGasPrice] = useState()

    useEffect(() => {
        async function getBlockNumber() {
            setBlockNumber(await al.getBlockNumber())
        }

        async function getGasPrice() {
            const res = await al.getGasPrice()
            setGasPrice(Utils.formatUnits(res.toString(), "gwei"))
        }

        getBlockNumber()
        getGasPrice()
    }, [])

    return (
        <div className="bg-gray-800 p-2 w-full flex gap-6 justify-center text-white border-t text-xs">
            <div className="gap-2 flex items-center">
                <span>Network:</span>
                <span className="text-sky-400">ETH Mainet</span>
            </div>
            <div className="flex items-center gap-2">
                <span role="img" aria-label="pickaxe">
                    ⛏️
                </span>{" "}
                Last minted block:
                <Link href={"/block/" + blockNumber}>
                    <span className="underline text-amber-600 hover:text-sky-400 cursor-pointer transition-colors duration-200">
                        {blockNumber}
                    </span>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <span role="img" aria-label="fuel pump">
                    ⛽
                </span>{" "}
                Recomended price:
                <span className="text-amber-600">
                    {gasPrice && gasPrice.slice(0, 5)} Gwei
                </span>
            </div>
        </div>
    )
}
