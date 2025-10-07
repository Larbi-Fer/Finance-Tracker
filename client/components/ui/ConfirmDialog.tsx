import React, { Dispatch, SetStateAction } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog"

type ConfirmDialogProps = {
  title?: string;
  description: string;
  children?: React.ReactNode
  continueText?: string;
  onConfirm: () => void;
}

const ConfirmDialog = ({ children, description, title, onConfirm, continueText}: ConfirmDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || 'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-700 hover:bg-red-500 text-white">{continueText || 'Continue'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDialog