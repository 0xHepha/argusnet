import React, { useState } from "react"

const CopyToClipboardButton = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false)

    const copyText = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy)
            setCopied(true)
            setTimeout(() => setCopied(false), 1000) // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy: ", err)
        }
    }

    return (
        <button
            onClick={copyText}
            className={`w-6 h-6 text-white font-semibold rounded text-base ${
                copied ? "bg-green-500" : "bg-gray-500"
            }`}
        >
            {copied ? "✔️" : "🗎"}
        </button>
    )
}

export default CopyToClipboardButton
