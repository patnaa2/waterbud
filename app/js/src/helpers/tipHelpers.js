import dishes from '../assets/dishes.jpg';
import faucetAerator from '../assets/faucet_aerator.jpg';
import gardenBed from '../assets/garden_bed.jpg';
import moistureMeter from '../assets/moisture_meter.jpg';
import nozzle from '../assets/nozzle.png';
import razor from '../assets/razor.jpg';
import shower from '../assets/shower_head.jpg';
import tap from '../assets/bathroom_sink.jpg';
import vegetableBrush from '../assets/vegetable_brush.jpg';
import veggiePrep from '../assets/veggie_prep.jpg';

import logo from '../assets/waterbud_logo.png';

export function retrieveTipImage(image) {
  switch(image) {
    case 'faucet_aerator':
      return faucetAerator;
    case 'nozzle':
      return nozzle;
    case 'shaving':
      return razor;
    case 'moisture_meter':
      return moistureMeter;
    case 'garden':
      return gardenBed;
    case 'dishes':
      return dishes;
    case 'prep':
      return veggiePrep;
    case 'tap':
      return tap;
    case 'shower_head':
      return shower;
    case 'vegetable_brush':
      return vegetableBrush;
    default:
    return logo;
  }
}
