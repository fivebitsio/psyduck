import Countries from './countries'
import Devices from './devices'
import Metrics from './metrics'
import Sources from './sources'
import TopBar from './top-bar'
import TopPages from './top-pages'

function Analytics() {
  return (
    <div className="w-4xl m-auto flex flex-col gap-3 mt-20 mb-10">
      <TopBar />
      <div className="flex flex-col gap-3">
        <Metrics />
        <div className="flex gap-3">
          <div className="w-4xl">
            <Countries />
          </div>
          <div className="w-xl">
            <Devices />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-4xl h-[500px]">
            <TopPages />
          </div>
          <div className="w-xl h-[500px]">
            <Sources />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
