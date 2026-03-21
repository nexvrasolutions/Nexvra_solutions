import { cn } from '@/utils/lib'
import React from 'react'

export const Badge = ({text, className}:{text:string, className?:string}) => {
    return (
        <p className={cn("text-secondary font-secondary mb-6 flex items-center gap-2 font-medium", className)}>
            <span className="w-2 h-2 bg-[#A4FF00] rounded-full"></span>
            {text}
        </p>
    )
}
