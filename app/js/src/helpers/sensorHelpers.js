import * as SensorLocation from '../constants/sensorLocations';

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
