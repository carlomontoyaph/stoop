import { useEffect } from 'react'
import { StoreProvider, useStore } from './store/index.js'
import { useNavigation, APP_VIEWS } from './store/navigation.js'
import AppLayout from './components/AppLayout.jsx'
import Toast from './components/Toast.jsx'
import Landing     from './screens/Landing.jsx'
import Onboarding  from './screens/Onboarding.jsx'
import Dashboard   from './screens/Dashboard.jsx'
import Tenants     from './screens/Tenants.jsx'
import Rent        from './screens/Rent.jsx'
import Leases      from './screens/Leases.jsx'
import Maintenance from './screens/Maintenance.jsx'
import Settings    from './screens/Settings.jsx'
import Feedback    from './screens/Feedback.jsx'

function AppRouter() {
  const { data, reset } = useStore()
  const { view, go, toastMsg, toast } = useNavigation()

  useEffect(() => {
    if (APP_VIEWS.includes(view) && !data) reset()
  }, [view, data, reset])

  if (view === 'landing')    return <Landing    onStart={() => go('onboarding')} />
  if (view === 'onboarding') return <Onboarding onFinish={() => go('dashboard')} />
  if (!data) return null

  const SCREENS = {
    dashboard:   <Dashboard   go={go} toast={toast} />,
    tenants:     <Tenants     toast={toast} />,
    rent:        <Rent        toast={toast} />,
    leases:      <Leases      toast={toast} />,
    maintenance: <Maintenance toast={toast} />,
    settings:    <Settings    toast={toast} />,
    feedback:    <Feedback    toast={toast} />,
  }

  return (
    <>
      <AppLayout view={view} go={go}>
        {SCREENS[view] || SCREENS.dashboard}
      </AppLayout>
      <Toast msg={toastMsg} />
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  )
}
