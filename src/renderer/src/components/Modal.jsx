import { useState } from 'react';
import { HorizontalDivider } from './HorizontalDivider';
import { IoMdClose } from "react-icons/io";

export const Modal = ({ headerTitle, bodyMessage, btnDanger, btnConfirm, btnDangerText, btnConfirmText, modalShow, setModalShow}) => {

  if (!modalShow) return null;

  return (
    <div
      onClick={() => setModalShow(false)}
      className="absolute w-screen h-screen z-10 bg-zinc-950/90 top-0 left-0 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-5 bg-zinc-800 rounded-lg flex flex-col z-20"
      >
        <header className='mb-3 relative'>
          <h1 className='font-bold max-w-[97%] overflow-hidden'>{headerTitle}</h1>
          <IoMdClose onClick={() => setModalShow(false)} className='absolute top-1 right-1 cursor-pointer' />
        </header>
        <HorizontalDivider />
        <main className='text-zinc-300 mb-5'>{bodyMessage}</main>
        <footer className='flex justify-end items-center gap-2'>
          {btnDanger &&
            <div onClick={()=> btnDanger()} className='bg-red-800 p-2 w-fit px-5 rounded-md text-sm cursor-pointer'>{btnDangerText}</div>
          }
          {btnConfirm &&
            <div onClick={()=>btnConfirm()} className='bg-blue-800 p-2 w-fit px-5 rounded-md text-sm cursor-pointer'>{btnConfirmText}</div>
          }
        </footer>
      </div>
    </div>
  );
}


export default Modal
