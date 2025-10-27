import Countries from './countries'
import Devices from './devices'
import Metrics from './metrics'
import Sources from './sources'
import TopBar from './top-bar'
import TopPages from './top-pages'

interface AnalyticsProps {
  showTopBar?: boolean
}

function Analytics({ showTopBar = true }: AnalyticsProps) {
  return (
    <div className="w-full lg:w-4xl mx-auto px-4 lg:px-0 flex flex-col gap-3 mt-10 mb-10">
      {showTopBar && <TopBar />}
      <div className="flex flex-col gap-3">
        <Metrics />
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-4xl">
            <Countries />
          </div>
          <div className="w-full lg:w-xl">
            <Devices />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-4xl">
            <TopPages />
          </div>
          <div className="w-full lg:w-xl">
            <Sources />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
