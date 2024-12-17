import Link from "next/link"
import { Home, PieChart, TrendingUp, DollarSign, Settings } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl uppercase text-green-500 font-bold">Pro-tfolio</h1>
      </div>
      <ul className="flex flex-col py-4">
        <li>
          <Link href="/dashboard" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-green-500">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><Home /></span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/investments" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-green-500">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><PieChart /></span>
            <span className="text-sm font-medium">Investments</span>
          </Link>
        </li>
        <li>
          <Link href="/pension" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-green-500">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><TrendingUp /></span>
            <span className="text-sm font-medium">Pension</span>
          </Link>
        </li>
        <li>
          <Link href="/stocks" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-green-500">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><DollarSign /></span>
            <span className="text-sm font-medium">Stocks</span>
          </Link>
        </li>
        <li>
          <Link href="/settings" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-green-500">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><Settings /></span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

