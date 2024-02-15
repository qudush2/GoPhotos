import { ReactNode } from "react"

type DiscoverLayoutProps = {
    children?: ReactNode
}

export default function DiscoverLayout({ children }: DiscoverLayoutProps) {
    return (
        <div>
            {children}
        </div>
    )
}