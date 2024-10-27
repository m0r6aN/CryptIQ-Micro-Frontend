import React from 'react'
import Image from 'next/image'
import CryptoData from '../lib/types'
import { Table } from 'lucide-react'
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './Table'


interface CryptoTableProps {
  data: CryptoData[]
}

const CryptoTable: React.FC<CryptoTableProps> = ({ data }) => {
  return (
    <Table>
      <TableCaption>Cryptocurrency Market Data</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Coin</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Market Cap</TableHead>
          <TableHead>24h Volume</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((coin) => (
          <TableRow key={`${coin.from_symbol}-${coin.to_symbol}`}>
            <TableCell className="font-medium">
              <div className="flex items-center">
                <Image 
                  src={coin.image_url} 
                  alt={coin.from_symbol} 
                  width={24} 
                  height={24} 
                  className="mr-2"
                />
                {coin.from_symbol}
              </div>
            </TableCell>
            <TableCell>{coin.price.toFixed(2)} {coin.to_symbol}</TableCell>
            <TableCell>{coin.mktcap.toLocaleString()} {coin.to_symbol}</TableCell>
            <TableCell>{coin.total_volume_24hr.toLocaleString()} {coin.to_symbol}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default CryptoTable