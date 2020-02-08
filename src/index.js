import createApp from '../mint'
import reduxFormReducer from '@/components/ReduxForm/reducer'
import axios from 'axios'

import 'rxjs/add/observable/of'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch'

import globalModel from './models/global'
import router from './router'

const app = createApp({
  extraReducers: {
    form: reduxFormReducer
  }
})

app.model(globalModel)
app.router(router)
axios.defaults.withCredentials = true

app.start('app')
export default app._store
