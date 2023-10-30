import Link from "next/link"
import React from "react"
import Image from "next/image"

export default function Header({}) {
    return (
        <div className="flex items-center justify-between gap-2 bg-gray-800 text-amber-600 text-3xl text-shadow px-1 py-2 w-full shadow-lg z-10">
            <Link href="/" className="flex items-center gap-2">
                <div className="relative h-20 w-20">
                    <Image
                        className="object-contain"
                        src="/main_logo.png"
                        layout="fill"
                        alt="Website logo, a digital eye"
                        priority
                    />
                </div>
                <div className="underline cursor-pointer w-fit">ArgusNet</div>
            </Link>
        </div>
    )
}
