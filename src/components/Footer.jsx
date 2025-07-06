import React from 'react'
import { BiChevronRight } from 'react-icons/bi';
import logoUCN from "../assets/logoUCNblancoNegro.png";

const Footer = () => {
  return  <footer className='py-16 bg-gray-950 px-12 flex justify-between gap-10 text-slate-200 text-sm flex-wrap md:flex-nowrap'>
    <div  className={`text-2x1 font-bold tracking-tighter transition-all text-white flex-1`}>
        FISIM
    </div>

    <div className="flex flex-col gap-4 flex-1">
        <p className="font-semibold uppercase tracking-tighter">
            Contacto
        </p>
        <p className="text-xs font-medium">
            silasglauco@gmail.com
        </p>
         <p className="text-xs font-medium">
            cristian.ignacio.nunez@gmail.com
        </p>
         <p className="text-xs font-medium">
            benjagilberto44@gmail.com
        </p>
    </div>
    <div className="flex flex-col gap-4 flex-1">
        <p className='font-semibold uppercase tracking-tighter'>
            Descarga la APP
        </p>
        <nav className="flex flex-col gap-2 text-xs font-medium">
            <div className='text-slate-300'>Compatible solo con android</div>
            <a 
                href="https://www.mediafire.com/file/qdhzws3qjh8t4qf/Fisim.apk/file" 
                target="_blank" 
                rel="noopener noreferrer"
                className='text-slate-300 hover:text-white cursor-pointer'
            >
                DESCARGA AQUÍ
            </a>
        </nav>
    </div>
    <div className="flex flex-col gap-4 flex-1">
    <div className="w-full flex justify-normal mt-8">
            <img src={logoUCN} alt="Logo UCN" className="w-20 h-auto" />
        </div>
    </div>
  </footer>
}

export default Footer