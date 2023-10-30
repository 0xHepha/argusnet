import React from "react"

export default function PageIndex({ indexes, prev, next }) {
    const showPrev = indexes[0] == -1 ? false : true
    const showNext = indexes[2] == -1 ? false : true

    return (
        <div className="flex items-center justify-center justify-items-center gap-4 text-lg">
            {showPrev && (
                <div
                    onClick={() => prev()}
                    className="rounded w-8 h-8 cursor-pointer items-center text-center text-blue-300 hover:text-blue-600  border border-blue-300 hover:border-blue-600 "
                >
                    ⫷
                </div>
            )}
            <div>{showPrev && indexes[0]}</div>
            <div className="font-bold underline">{indexes[1]}</div>
            <div>{showNext && indexes[2]}</div>
            {showNext && (
                <div
                    onClick={() => next()}
                    className="rounded w-8 h-8 cursor-pointer items-center text-center text-blue-300 hover:text-blue-600  border border-blue-300 hover:border-blue-600 "
                >
                    ⫸
                </div>
            )}
        </div>
    )
}
