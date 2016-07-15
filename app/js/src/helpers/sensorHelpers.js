import * as SensorLocation from '../constants/sensorLocations';
import shower from '../assets/shower_head.jpg';
import bathroomSink from '../assets/bathroom_sink.jpg';
import kitchenSink from '../assets/kitchen_sink.jpg';
import garden from '../assets/garden.jpg';


export function retreiveFriendlyLocationName(location) {
  switch (location) {
    case SensorLocation.BATHROOM_SINK:
      return 'Bathroom Sink';
    case SensorLocation.GARDEN:
      return 'Garden';
    case SensorLocation.KITCHEN_SINK:
      return 'Kitchen Sink';
    case SensorLocation.SHOWER:
      return 'Shower';
  }
}

export function retrieveClassName(location) {
  switch (location) {
    case SensorLocation.BATHROOM_SINK:
      return 'bathroom_sink';
    case SensorLocation.GARDEN:
      return 'garden';
    case SensorLocation.KITCHEN_SINK:
      return 'kitchen_sink';
    case SensorLocation.SHOWER:
      return 'shower';
  }
}


export function retrieveImage(location) {
  switch (location) {
    case SensorLocation.BATHROOM_SINK:
      return bathroomSink;
    case SensorLocation.GARDEN:
      return garden;
    case SensorLocation.KITCHEN_SINK:
      return kitchenSink;
    case SensorLocation.SHOWER:
      return shower;
  }
}
