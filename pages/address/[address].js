import { useEffect, useState } from "react"

const { Network, Alchemy, Utils } = require("alchemy-sdk")
require("dotenv").config()

import Header from "../../components/Header.js"
import Tokens from "../../components/address/Tokens.js"
import Nfts from "../../components/address/Nfts.js"
import Transfers from "../../components/address/Transfers.js"
import CopyToClipboardButton from "/components/CopyToClipboardButton.js"
import Footer from "@/components/Footer.js"

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
}

const alchemy = new Alchemy(settings)
const al = alchemy

const style_infoBlock =
    " flex flex-col gap-3 border border-gray-300 py-6 px-12 bg-white rounded w-[80rem] z-10 "
const style_infoline = " flex flex-row gap-2 "
const style_infoName = " w-1/4 "
const style_infoData = " w-3/4 overflow-y-auto "

export default function address({ address, isAddress }) {
    const [balance, setBalance] = useState(0)
    const [isContract, setIsContract] = useState(false)

    // UPDATES when page is load or address changes
    useEffect(() => {
        async function getBalance() {
            const balance = await al.core.getBalance(address)
            setBalance(hexToValue(balance._hex, "ether"))
        }
        async function getIsAccount() {
            const res = await al.core.isContractAddress(address)
            setIsContract(res)
        }

        getIsAccount()
        getBalance()
    }, [address])

    return (
        <div className="flex relative content-between justify-between text-sm flex-col min-h-screen w-full bg-gray-900 text-gray-900 items-center gap-3 bg-gradient-to-t from-gray-800 to-gray-600 ">
            <Header />
            {isAddress && (
                <main className="flex flex-col w-full h-full items-center justify-center gap-6">
                    <div className="  mt-6 text-center z-10">
                        <div className="text-2xl font-bold text-gray-300  ">
                            Address
                        </div>

                        <div className="text-base text-amber-500 flex gap-2 items-center">
                            {address}
                            <CopyToClipboardButton textToCopy={address} />
                        </div>
                    </div>
                    <div className={" mt-6 pb-9" + style_infoBlock}>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Balance 💸
                            </div>
                            <div className={"" + style_infoData}>
                                {balance} ETH
                            </div>
                        </div>
                        <div className={"" + style_infoline}>
                            <div className={"" + style_infoName}>
                                Address type
                            </div>
                            <div
                                className={
                                    " w-fit px-2 py-1 text-sm border bg-gray-100" +
                                    style_infoData
                                }
                            >
                                {isContract ? (
                                    <div>Contract</div>
                                ) : (
                                    <div>User Account (EOA)</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Tokens al={al.core} address={address} />
                    <Nfts al={al} address={address} />
                    <Transfers al={al} address={address} isSender={true} />
                    <Transfers al={al} address={address} isSender={false} />
                </main>
            )}
            {!isAddress && <div>not a valid address</div>}
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context) {
    const { address } = context.params
    const addressFormat = /^0x[a-zA-Z0-9]{40}$/

    let isAddress = true
    if (!addressFormat.test(address)) {
        isAddress = false
    }

    return { props: { address, isAddress } }
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
