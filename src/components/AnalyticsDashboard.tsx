'use client'

import { analytics } from '@/utils/analytics'
import { BarChart, Card } from '@tremor/react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import React from 'react'
import ReactCountryFlag from 'react-country-flag'

interface AnalyticsDashboardProps {
    avgVisitorsPerDay: string
    amtVisitorsToday: number
    timeseriesPageViews: Awaited<ReturnType<typeof analytics.retrieveDays>>
    topCountries: [string, number][]
    avgExportsPerDay: string
    amtExportsToday: number
}

const Badge = ({percentage}: {percentage: number}) => {
    const isPostive = percentage > 0 
    const isNetural = percentage === 0
    const isNegative = percentage < 0

    if (isNaN(percentage)) return null

    const positiveClassname = 'text-green-400/25 bg-green-900/25 text-green-400 '
    const neturalClassname = 'text-slate-400/25 bg-slate-900/25 text-slate-400 '
    const negativeClassname = 'text-red-400/25 bg-red-900/25 text-slate-400 '
    
    return (
        <span className={`inline-flex gap-1 font-medium ring-inset ring-1
        items-center rounded-md px-2 py-1 text-xs ${isPostive ? positiveClassname : isNetural ? neturalClassname : negativeClassname}`}>
            {isPostive ? (
                <ArrowUpRight className='h-3 w-3'/>
            ): null}
            {isNetural ? (
                <ArrowUpRight className='h-3 w-3'/>
            ): null}
            {isNegative ? (
                <ArrowDownRight className='h-3 w-3'/>
            ) : null}
            
            {percentage.toFixed(0)}%
        </span>
    )
}

const AnalyticsDashboard = ({avgVisitorsPerDay, topCountries, amtExportsToday, avgExportsPerDay, timeseriesPageViews, amtVisitorsToday}: AnalyticsDashboardProps) => {
  return (
    <div className='flex flex-col gap-6'>
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-6">
              <Card className='w-full mx-auto max-w-xs'>
                  <p className=" text-tremor-default text-tremor-content">
                      Avg. visitors/day
                  </p>
                  <p className='text-3xl text-tremor-content-inverted font-semibold'>
                      {avgVisitorsPerDay}
                  </p>
              </Card>  

              <Card className='w-full mx-auto max-w-xs'>
                  <p className="flex gap-2.5 text-tremor-default text-tremor-content">
                      No. visitors/day
                      <Badge percentage={(amtVisitorsToday / Number (avgVisitorsPerDay) - 1) * 100}/>
                  </p>
                  <p className='text-3xl text-tremor-content-inverted font-semibold'>
                      {amtVisitorsToday}
                  </p>
              </Card>  

              <Card className='w-full mx-auto max-w-xs'>
                  <p className=" text-tremor-default text-tremor-content">
                      Avg. Exports/day
                  </p>
                  <p className='text-3xl text-tremor-content-inverted font-semibold'>
                      {avgExportsPerDay}
                  </p>
              </Card>  

              <Card className='w-full mx-auto max-w-xs'>
                  <p className="flex gap-2.5 text-tremor-default text-tremor-content">
                      No. export/day
                      <Badge percentage={(amtExportsToday / Number (avgExportsPerDay) - 1) * 100}/>
                  </p>
                  <p className='text-3xl text-tremor-content-inverted font-semibold'>
                      {amtExportsToday}
                  </p>
              </Card>  
          </div>
          
          <Card className='flex flex-col sm:grid grid-cols-4 gap-6'>
              <h2 className="w-full text-dark-tremor-content text-center sm:left font-semibold text-lg">
                  Top visitors this week:
              </h2>
              <div className="flex col-span-3 items-center flex-wrap justify-between gap-8">
                  {
                      topCountries?.map(([countryCode, number]) => {
                          return (
                              <div className="flex items-center gap-3 text-dark-tremor-content-strong" key={number}>
                                  <p className="hidden sm:block text-tremor-label text-tremor-content">
                                      {countryCode}
                                  </p>
                                  <ReactCountryFlag className='text-4xl sm:text-2xl'
                                      countryCode={countryCode} svg />
                                  <p className="text-tremor-label text-tremor-content sm:text-dark-tremor-content-strong">
                                      {number}
                                  </p>
                            </div>  
                          )
                      })
                  }
              </div>
          </Card>

              <Card>
                  {timeseriesPageViews ? (
                  <BarChart allowDecimals={false}
                      showAnimation
                          data={
                              timeseriesPageViews.map((day) => ({
                                  name: day.date,
                                  Visitors: day.events.reduce((acc, curr) => {
                                      return acc + Object.values(curr)[0]!
                                  }, 0),
                              }))
                          }
                          categories={['Visitors']}
                          index='name'
                      />
                  ): null}
              </Card>
    </div>
  )
}

export default AnalyticsDashboard
