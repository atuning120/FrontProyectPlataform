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
            sugerencias
        </p>
        <div className="border border-gray-80 flex items-center gap-2 px-3 py-2 rounded-full">
            <input 
                type="email" 
                placeholder='Correo Electronico'
                className='pl-2 bg-gray-950 text-slate-200 w-full focus:outline-none'
            />
            <button className='text-slate-200'>
                <BiChevronRight size={20}/>
            </button>
        </div>
    </div>
    <div className="flex flex-col gap-4 flex-1">
        <p className='font-semibold uppercase tracking-tighter'>
            Descarga la APP
        </p>
        <nav className="flex flex-col gap-2 text-xs font-medium">
            <div className='text-slate-300'>Compatible solo con android</div>
            <a 
                href="https://download946.mediafire.com/es5o96dtd4rgxxMLTQjGIFZoxZHqSEB7sVjWf-yPFZRUSvjuclJDw5uIAxKDggU1WcLjmsc67CrPkPySQ8pK9ohamMrtyZZng3cmuTAko_QUeztrYVU16VX0Zrn9Y2WnmGUBT_TujYLDVX0QtjRL0zQD9bTB86fljrAK8aGkubzO/q3d85ibyctaycx2/app-release.apk" 
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