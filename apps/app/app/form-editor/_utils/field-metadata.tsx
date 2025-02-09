import type { FormField } from '@repo/schema-types/types';
import {
  Baseline,
  Calendar,
  CalendarCog,
  CircleHelp,
  Hash,
  LetterText,
  Mail,
  MapPin,
  Phone,
  Signature,
  SlidersHorizontal,
  Star,
} from 'lucide-react';

export function fieldMetadata(field: FormField) {
  switch (field.type) {
    case 'text':
      return {
        label: 'Text',
        color: '#8E7AB5',
        icon: Baseline,
      };
    case 'email':
      return {
        label: 'Email',
        icon: Mail,
        color: '#8E7AB5',
      };
    case 'textarea':
      return {
        label: 'Textarea',
        icon: LetterText,
        color: '#8E7AB5',
      };
    case 'phone':
      return {
        Label: 'Phone',
        icon: Phone,
        color: '#8E7AB5',
      };
    case 'number':
      return {
        label: 'Number',
        icon: Hash,
        color: '#8E7AB5',
      };
    case 'rating':
      return {
        label: 'Rating',
        icon: Star,
        color: '#789DBC',
      };
    case 'signature':
      return {
        label: 'Signature',
        icon: Signature,
        color: '#EF9C66',
      };
    case 'date':
      return {
        label: 'Date',
        icon: Calendar,
        color: '#B5C18E',
      };
    case 'location':
      return {
        label: 'Location',
        icon: MapPin,
        color: '#618264',
      };
    case 'slider':
      return {
        label: 'Slider',
        icon: SlidersHorizontal,
        color: '#FF8080',
      };

    case 'smartDatetime':
      return {
        label: 'Smart Datetime',
        icon: CalendarCog,
        color: '#B5C18E',
      };
    default:
      return {
        label: 'Unknown',
        icon: CircleHelp,
        color: '#8E7AB5',
      };
  }
}
