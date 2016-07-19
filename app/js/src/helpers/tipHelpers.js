import faucetAerator from '../assets/faucet_aerator.jpg';
import moistureMeter from '../assets/moisture_meter.jpg';
import nozzle from '../assets/nozzle.png';
import razor from '../assets/razor.jpg';
import gardenBed from '../assets/garden_bed.jpg';
import dishes from '../assets/dishes.jpg';
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
    default:
    return logo;
  }
}
