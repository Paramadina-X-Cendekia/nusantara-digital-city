import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = {
    base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants: {
        variant: {
            default: "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90",
            destructive: "bg-red-500 text-neutral-50 hover:bg-red-500/90",
            outline: "border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900",
            secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
            ghost: "hover:bg-neutral-100 hover:text-neutral-900",
            link: "text-neutral-900 underline-offset-4 hover:underline",
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
}

const Button = React.forwardRef(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        const variantClass = buttonVariants.variants.variant[variant] || buttonVariants.variants.variant.default
        const sizeClass = buttonVariants.variants.size[size] || buttonVariants.variants.size.default

        return (
            <Comp
                className={cn(buttonVariants.base, variantClass, sizeClass, className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
