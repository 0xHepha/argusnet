import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Header from "../components/Header"
import Footer from "../components/Footer"
import InfoBar from "../components/InfoBar"
import Roadmap from "../components/index/Roadmap"

export default function Home() {
    const router = useRouter()
    const [validTx, setValidTx] = useState(false)
    const [tx, setTx] = useState("")

    useEffect(() => {
        setValidTx(checkFormat(tx))
    }, [tx])

    function redirect() {
        const newPage = checkFormat(tx)
        if (newPage) {
            router.push("/" + newPage + "/" + tx)
        }
    }

    return (
        <div className="flex flex-col h-full w-full relative content-between justify-between bg-gray-900 bg-gradient-to-t from-gray-800 to-gray-600">
            <Header />
            <InfoBar />
            <main className="flex flex-col p-5 h-full w-full items-center justify-center gap-24 relative">
                <div className="bg-yellow-200 w-1/2 text-sm px-6 py-2 mr-24 rounded border border-red-600 shadow-lg text-red-600 absolute top-12 ">
                    ⚠️ This website is currently in the early stages of
                    development. As such, there are currently no robust security
                    measures in place to ensure the reliability of the data.
                    Users are solely responsible for any consequences resulting
                    from decisions made based on the information provided on
                    this website.
                </div>
                <div className="flex items-center gap-6 w-3/4 z-10 mt-64">
                    <input
                        type="text"
                        placeholder="block number // transaction hash // address"
                        className="py-2 px-4 text-center text-lg w-full text-blue-400 bg-gray-800 border border-gray-400 rounded-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                        value={tx}
                        onChange={(e) => setTx(e.target.value)}
                    />
                    <button
                        className="rounded-full  shadow-xl w-20 h-20 relative transition-transform transform hover:scale-110"
                        onClick={() => validTx && redirect()}
                    >
                        <div className="w-full h-full relative">
                            <Image
                                src={
                                    validTx
                                        ? "/eye_open.png"
                                        : "/eye_closed.png"
                                }
                                layout="fill"
                                alt={
                                    validTx
                                        ? "A digital open eye"
                                        : "A digital closed eye"
                                }
                            />
                        </div>
                    </button>
                </div>

                <Roadmap />
            </main>
            <Footer />
        </div>
    )
}

function checkFormat(tx) {
    const addressFormat = /^0x[a-zA-Z0-9]{40}$/
    const blockFormat = /^[0-9]+$/
    const txnFormat = /^0x[a-zA-Z0-9]{64}$/

    if (txnFormat.test(tx)) {
        return "transaction"
    }
    if (addressFormat.test(tx)) {
        return "address"
    }
    if (blockFormat.test(tx)) {
        return "block"
    }

    return false
}
