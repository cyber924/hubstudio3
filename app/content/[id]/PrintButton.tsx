'use client';
import {Download} from 'lucide-react';
export default function PrintButton(){return <button className="outlined" onClick={()=>window.print()}><Download size={16}/>PDF 저장</button>;}
