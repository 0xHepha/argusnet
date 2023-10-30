import React from "react"
import Image from "next/image"

const style_block = " w-fit"
const style_top = "h-32 items-center justify-center flex"
const style_eye = "w-20 h-20 relative"
const style_bottom =
    "border border-gray-300 rounded-lg shadow-xl text-sm w-80 flex flex-col gap-4 p-4 "
const style_title = "text-2xl font-bold text-center mb-2 underline"
const style_line = " text-gray-900 text-center "

export default function Roadmap() {
    return (
        <div className="relative w-3/4">
            <div className="absolute w-5/6 h-4 top-14 right-0 border-4 rounded border-r-0 border-gray-600 ">
                <div className="h-full w-1/4 bg-amber-600"></div>
            </div>
            <div className="flex gap-2 justify-around">
                <div className={" " + style_block}>
                    <div className={" " + style_top}>
                        <div className={" " + style_eye}>
                            <Image
                                src="/eye_open.png"
                                layout="fill"
                                alt="A digital open eye"
                            />
                        </div>
                    </div>
                    <div className={"bg-gray-100 " + style_bottom}>
                        <h3 className={"text-sky-500 " + style_title}>
                            Base functions
                        </h3>

                        <li className={" " + style_line}>
                            Basic functionality of the website
                        </li>
                        <li className={" " + style_line}>
                            Search for transactions, blocks, and addresses
                        </li>
                        <li className={" " + style_line}>
                            Basic style and design
                        </li>
                    </div>
                </div>
                <div className={" " + style_block}>
                    <div className={" " + style_top}>
                        <div className={" " + style_eye}>
                            <Image
                                src="/eye_closed.png"
                                layout="fill"
                                alt="A digital open eye"
                            />
                        </div>
                    </div>
                    <div className={"bg-gray-400 " + style_bottom}>
                        <h3 className={" " + style_title}>Search Modes</h3>

                        <li className={" " + style_line}>
                            Security measures for data integrity
                        </li>
                        <li className={" " + style_line}>
                            Simple User Mode: Information simplified and
                            explained for the average user
                        </li>
                        <li className={" " + style_line}>
                            Developer Mode: Access to the raw data and
                            executions, information decoding and interpretation
                        </li>
                        <li className={" " + style_line}>
                            Trader Mode: Incorporated tools for price analysis
                            and data manipulation/calculations on the fly with
                            simple clics
                        </li>
                        <li className={" " + style_line}>
                            Tracker Mode: UI for tracking and monitoring of
                            funds accross the blockchain
                        </li>
                    </div>
                </div>
                <div className={" " + style_block}>
                    <div className={" " + style_top}>
                        <div className={" " + style_eye}>
                            <Image
                                src="/eye_closed.png"
                                layout="fill"
                                alt="A digital open eye"
                            />
                        </div>
                    </div>
                    <div className={"bg-gray-400 " + style_bottom}>
                        <h3 className={" " + style_title}>Data analysis</h3>

                        <li className={" " + style_line}>
                            Showcase of Big data analysis and data mining
                            information of the blockchain
                        </li>
                        <li className={" " + style_line}>
                            Train prediction models with your own parameters and
                            selected data
                        </li>
                        <li className={" " + style_line}>
                            Set complex alerts and notifications systems
                        </li>
                        <li className={" " + style_line}>
                            Create personalyzed filters to execute transactions
                            automatically
                        </li>
                    </div>
                </div>
            </div>
        </div>
    )
}
