import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import HorizontalDivider from './HorizontalDivider';

const Modal = ({ title, subtitle, onConfirm, onCancel, onClose, isAlert }) => {
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";

  useEffect(() => {
    document.body.appendChild(modalRoot);
    return () => {
      document.body.removeChild(modalRoot);
    };
  }, []);

  return ReactDOM.createPortal(
    <div onClick={onClose} className="absolute bg-slate-950/80 w-screen h-screen flex justify-center items-center top-0 left-0 text-zinc-100">
      <div onClick={(e)=>e.stopPropagation()} className="p-5 bg-zinc-800 rounded-lg flex flex-col z-20">
        <header className='mb-3 relative'>
          <h1 className='font-bold max-w-[97%] overflow-hidden'>{title}</h1>
          <IoMdClose onClick={onClose} className='absolute top-1 right-1 cursor-pointer text-zinc-100' />
        </header>
        <HorizontalDivider />
        <main className='text-zinc-300 mb-5'>{subtitle}</main>


        <footer className="flex justify-end items-center gap-2">
          {isAlert ? (
            <div onClick={onClose} className='bg-blue-800 p-2 w-fit px-5 rounded-md text-sm cursor-pointer'>Ok</div>
          ) : (
            <>
              <div onClick={onCancel} className='bg-red-800 p-2 w-fit px-5 rounded-md text-sm cursor-pointer'>Cancelar</div>
              <div onClick={onConfirm} className='bg-blue-800 p-2 w-fit px-5 rounded-md text-sm cursor-pointer'>Confirmar</div>
            </>
          )}
        </footer>
      </div>
    </div>,
    document.body
  );
};

const useModal = () => {
  const [modalProps, setModalProps] = useState(null);

  const modalConfirm = (title, subtitle, onConfirm = () => { }, onCancel = () => { }) => {
    setModalProps({ title, subtitle, onConfirm, onCancel, isAlert: false });
  };

  const modalAlert = (title, subtitle, onClose = () => { }) => {
    setModalProps({ title, subtitle, onClose, isAlert: true });
  };


  const closeModal = () => setModalProps(null);

  return {
    modal: modalProps ? (
      <Modal
        {...modalProps}
        onConfirm={() => { modalProps.onConfirm(); closeModal(); }}
        onCancel={() => { modalProps.onCancel(); closeModal(); }}
        onClose={() => { modalProps.onClose(); closeModal(); }}
      />
    ) : null,
    modalConfirm,
    modalAlert
  };
};

export default useModal;
