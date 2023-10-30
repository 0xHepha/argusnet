import Image from "next/image"
import CopyToClipboardButton from "./CopyToClipboardButton"

export default function Footer() {
    return (
        <div className="text-gray-100 w-full flex justify-between py-2 px-12 text-xs items-center mt-12">
            <div className="flex gap-6">
                <div>© 2023 Hepha Studios</div>
                <div>Content licensed under CC BY-NC</div>
            </div>
            <div className="flex gap-12 items-center">
                <div className="text-amber-600">Created by: </div>
                <div className="flex gap-1 items-center">
                    <div className="relative h-6 w-6">
                        <Image
                            className="object-contain"
                            src="/discord_logo.png"
                            layout="fill"
                            alt="Website logo, a digital eye"
                            priority
                        />
                    </div>
                    <div>0xhepha</div>
                    <CopyToClipboardButton textToCopy="0xhepha" />
                </div>
                <div className="flex gap-1 items-center">
                    <div className="relative h-6 w-6">
                        <Image
                            className="object-contain"
                            src="/email_logo.png"
                            layout="fill"
                            alt="Website logo, a digital eye"
                            priority
                        />
                    </div>
                    <div>0xHepha@gmail.com</div>
                    <CopyToClipboardButton textToCopy="0xHepha@gmail.com" />
                </div>
            </div>
        </div>
    )
}
