import AnalyticsDashboard from "@/components/AnalyticsDashboard"
import { getDate } from "@/utils"
import { analytics } from "@/utils/analytics"

const Page = async () => {
    const TRACKING_DAYS = 7

    const pageviews = await analytics.retrieveDays("pageview", TRACKING_DAYS)
    const exportsData = await analytics.retrieveDays("exports", TRACKING_DAYS)
    

    const totalExports = exportsData.reduce((acc, curr) => {
        return (
            acc + curr.events.reduce((acc, curr) => {
                return acc + Object.values(curr)[0]!
            }, 0)
        )
    }, 0)

    const avgExportsPerDay = (totalExports / TRACKING_DAYS).toFixed(1)

    const amtExportsToday = exportsData.filter((ev) => ev.date === getDate()).reduce
        ((acc, curr) => {
            return (
               acc + curr.events.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0) 
            )
        }, 0)
    

    const totalPageViews = pageviews.reduce((acc, curr) => {
        return (
            acc + curr.events.reduce((acc, curr) => {
                return acc + Object.values(curr)[0]!
            }, 0)
        )
    }, 0)

    const avgVisitorsPerDay = (totalPageViews / TRACKING_DAYS).toFixed(1)

    const amtVisitorsToday = pageviews.filter((ev) => ev.date === getDate()).reduce
        ((acc, curr) => {
            return (
               acc + curr.events.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0) 
            )
        }, 0)
    
    const topCountriesMap = new Map<string, number>()

    for (let i = 0; i < pageviews.length; i++) {
        const day = pageviews[i]; 
        if (!day) continue;

        for (let j = 0; j < day.events.length; j++) {
            const event = day.events[j];
            if (!event) continue;

            const key = Object.keys(event)[0]!
            const value = Object.values(event)[0]!

            const parsedKey = JSON.parse(key)
            const country = parsedKey?.country

            if (country) {
                if (topCountriesMap.has(country)) {
                    const prevValue = topCountriesMap.get(country)! 
                    topCountriesMap.set(country, prevValue + value)
                } else {
                    topCountriesMap.set(country, value)
                }
            }
        }
    }

    const topCountries = [...topCountriesMap.entries()].sort((a, b) => {
        if (a[1] > b[1]) return -1
        else return 1
    }).slice(0, 5)

    

    return (
        <div className="w-full flex items-center justify-center min-h-screen py-12">
            <div className="relative mx-auto text-white max-w-6xl w-full">
                <AnalyticsDashboard
                    amtVisitorsToday={amtVisitorsToday}
                    avgVisitorsPerDay={avgVisitorsPerDay}
                    avgExportsPerDay={avgExportsPerDay}
                    amtExportsToday={amtExportsToday}
                    timeseriesPageViews={pageviews}
                    topCountries ={topCountries}
                />
            </div>
       </div>
    )
}

export default Page