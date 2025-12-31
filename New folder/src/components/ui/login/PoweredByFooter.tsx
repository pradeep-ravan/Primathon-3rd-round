'use client'

import { motion } from 'framer-motion'
import { JSX } from 'react'

const PoweredByFooter = (): JSX.Element => {
  return (
    <motion.div
      className='mt-6 text-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ delay: 0.8 }}
    >
      {/* Modern "Powered by" badge with subtle glow effect */}
      <div className='flex justify-center items-center gap-1.5 text-xs text-muted-foreground'>
        <span className='opacity-70'>Powered by</span>
        <span className='px-2 py-0.5 rounded-full bg-muted/50 dark:bg-gray-800/50 border border-emerald-600/40 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400/90 font-medium flex items-center'>
          <span className='mr-1 w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse'></span>
          EMOR
        </span>
      </div>

      {/* Copyright */}
      <p className='text-muted-foreground text-xs mt-3'>
        © 2025 Emor Services. All rights reserved.
      </p>
    </motion.div>
  )
}

export default PoweredByFooter
