'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle } from 'lucide-react'
import { JSX } from 'react';

interface StatusAlertProps {
  error: string | null;
  user: { isAuthenticated: boolean; email?: string } | null;
  getErrorMessage: () => string;
}

const StatusAlert = ({ error, user, getErrorMessage }: StatusAlertProps): JSX.Element => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            variant='destructive'
            className='border-red-500/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 backdrop-blur-sm'
          >
            <XCircle className='h-4 w-4' />
            <AlertTitle className='font-semibold'>
              Authentication Error
            </AlertTitle>
            <AlertDescription className={undefined}>{getErrorMessage()}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {user && user.isAuthenticated && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className='border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 backdrop-blur-sm' variant={undefined}>
            <CheckCircle2 className='h-4 w-4' />
            <AlertTitle className='font-semibold'>Success!</AlertTitle>
            <AlertDescription className={undefined}>
              {user.email && <p>Logged in as: {user.email}</p>}
              <p className='text-xs mt-1'>Redirecting to dashboard...</p>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StatusAlert
