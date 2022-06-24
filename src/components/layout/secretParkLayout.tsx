import { ReactNode, useEffect } from 'react';
import React from 'react';
import Router, { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const _SecretParkLayout = dynamic(() => import("./_secretParkLayout"), {ssr: false})

const SecretParkLayout = ({ children }: { children?: ReactNode }) => {
  const router = useRouter()

  useEffect(() => {
    if (document.referrer.indexOf(`${process.env.NEXT_PUBLIC_URL}/secret`) != 0) {
      if (process.env.DEBUG != "true") {
        
      }
      // sessionStorage.removeItem("history")
      // sessionStorage.removeItem("historyNum")
    }
  }, [])

  return (<_SecretParkLayout>{children}</_SecretParkLayout>);
};

export default SecretParkLayout;
