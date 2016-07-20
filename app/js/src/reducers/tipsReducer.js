import {
  CLOSE_TIPS_MODAL,
  FLIP_TIP_CARD,
  LOADING_TIPS,
  NEXT_TIP,
  OPEN_TIPS_MODAL,
  PREV_TIP,
  RECEIVED_TIPS,
  RESET
} from '../constants/actionTypes';
import Immutable from 'immutable';
import * as SensorLocation from '../constants/sensorLocations';

const initialState = Immutable.fromJS({
  cards: [{
      title: 'Recent',
      isFlipped: false
    }, {
      title: SensorLocation.KITCHEN_SINK,
      isFlipped: false
    }, {
      title: SensorLocation.GARDEN,
      isFlipped: false
    }, {
      title: SensorLocation.BATHROOM_SINK,
      isFlipped: false
  }],
  kitchen_sink: {
    msg: [{
      short: 'Use a vegetable brush',
      read: 1,
      image: 'vegetable_brush',
      msg: 'Clean veggies with a vegetable brush instead of in running water.',
      location: 'kitchen',
      date: '07/01 14:16:12',
      moreInfo: 'http://www.walmart.com/ip/Progressive-International-Fruit-and-Vegetable-Mesh-Brush/19330860?action=product_interest&action_type=title&item_id=19330860&placement_id=irs-106-t1&strategy=PWVAV&visitor_id&category&client_guid=bbbc6f32-f965-4c81-ad9e-68ed301b20a1&customer_id_enc&config_id=106&parent_item_id=16565410&parent_anchor_item_id=16565410&guid=a38e7aec-5ebe-49e3-b687-2e5543a41a84&bucket_id=irsbucketdefault&beacon_version=1.0.1&findingMethod=p13n'
    }]
  },
  bathroom_sink: {
    msg: [{
      short: 'Low-flow Shower Head',
      read: 1,
      image: 'shower_head',
      msg: 'Your average daily shower time in the last month was 16 mins. By installing a low flow shower head, you save 30% on the shower and your payback period is 1.5 months, and then enjoy savings about $15/month without reducing your showering time.',
      location: 'bathroom_sink',
      date: '07/01 14:16:12',
      moreInfo: 'https://www.amazon.ca/Niagara-Earth-Massage-1-25GPM-showerhead/dp/B003UQ17O4/'
   }, {
      short: 'Efficient Faucet Aerators',
      read: 1,
      image: 'faucet_aerator',
      msg: 'Reduces overall water usage by changing the flow structure',
      location: 'bathroom_sink',
      date: '07/01 14:16:12',
      moreInfo: 'https://www.amazon.com/Niagara-N3205T-Dual-Threaded-Aerator/dp/B0034UMZA6'
   }]
  },
  garden: {
    msg: [{
      short: 'Spray Nozzle',
      read: 1,
      image: 'nozzle',
      msg: 'By installing a spray nozzle, you can control the water flow by pressing the trigger.',
      location: 'garden',
      date: '07/01 14:16:12',
      moreInfo: 'https://www.amazon.com/gp/product/B001GJ3FIS/ref=s9_top_hd_bw_b2K72_g263_i2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-2&pf_rd_r=05YA69GEBPZJJTXWGMNS&pf_rd_t=101&pf_rd_p=2223035742&pf_rd_i=553972'
    }, {
      short: 'Soil Moisture Meter',
      read: 1,
      image: 'moisture_meter',
      msg: 'The soil moisture meter will help you identify good times to water your garden.',
      location: 'garden',
      date: '07/01 14:16:12',
      moreInfo: 'http://www.canadiantire.ca/en/pdp/soil-moisture-meter-0594502p.html'
   }]
  },
  recent: [],
  loading: false,
  isOpen: false,
  tipLocationToShow: 'kitchen_sink',
  tipNumber: 0
});

export default function tipReducer(state = initialState, action) {
  switch (action.type) {
    case FLIP_TIP_CARD:
      return state.setIn(['cards', action.index, 'isFlipped'], action.status);

    case RESET:
      return state.map((obj) => obj.set('isFlipped', false));

    case LOADING_TIPS:
      return state.set('loading', true);

    case RECEIVED_TIPS:
      return state.set('loading', false).set('recent', Immutable.fromJS(action.data));

    case OPEN_TIPS_MODAL:
      return state.set('isOpen', true).set('tipLocationToShow', action.tipsToShow);

    case CLOSE_TIPS_MODAL:
      return state.updateIn([state.get('tipLocationToShow').toLowerCase(), 'msg'], (element) => element.map(item => item.set('read', 1)))
                  .set('isOpen', false).set('tipNumber', 0);

    case PREV_TIP:
      return state.update('tipNumber', (tip) => tip - 1);

    case NEXT_TIP:
      return state.update('tipNumber', (tip) => tip + 1);

    default:
      return state;
  }
}
