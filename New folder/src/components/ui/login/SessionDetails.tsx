'use client'

import { JSX, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface SessionDetailsProps {
  sessionDetails: {
    sid: string;
    userCreated: boolean;
    lastActive?: string;
  } | null;
}

const SessionDetails = ({ sessionDetails }: SessionDetailsProps): JSX.Element | null => {
  const [showDetails, setShowDetails] = useState<boolean>(false)
  
  if (!sessionDetails) return null;
  
  return (
    <motion.div
      className='w-full'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div
        className='flex items-center cursor-pointer text-sm font-medium mb-2 text-primary'
        onClick={() => setShowDetails(!showDetails)}
      >
        <span>Session Details</span>
        <motion.div
          animate={{ rotate: showDetails ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className='ml-1'
        >
          <ChevronDown className='h-4 w-4' />
        </motion.div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='overflow-hidden'
          >
            <div className='mb-3'>
              <h3 className='text-xs font-medium mb-1 text-muted-foreground'>
                Session ID:
              </h3>
              <div className='bg-muted/30 p-2 rounded text-xs font-mono break-all border border-border/50 text-foreground max-h-24 overflow-y-auto'>
                {sessionDetails.sid}
              </div>
            </div>

            <div>
              <h3 className='text-xs font-medium mb-1 text-muted-foreground'>
                Test User Created:
              </h3>
              <div className='bg-muted/30 p-2 rounded text-xs font-mono break-all border border-border/50 text-foreground'>
                {sessionDetails.userCreated ? 'Success' : 'Failed'}
              </div>
            </div>

            {sessionDetails.lastActive && (
              <div className='mt-3'>
                <h3 className='text-xs font-medium mb-1 text-muted-foreground'>
                  Last Activity:
                </h3>
                <div className='bg-muted/30 p-2 rounded text-xs font-mono break-all border border-border/50 text-foreground'>
                  {new Date(sessionDetails.lastActive).toLocaleString()}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SessionDetails
