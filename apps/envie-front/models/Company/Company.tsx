import { ActivityType } from '../../enums/ActivityType';
import { VatRate } from '../../enums/VatRate';
import { User } from '../User/User';

export interface Company {
  id: number;
  activityType: ActivityType;
  name: string;
  siretNumber: string;
  street: string;
  zipCode: string;
  city: string;
  country: string;
  phoneNumber: string;
  mailAddress: string;
  vatRate: VatRate | null;
  storages: Storage[];
  users: User[];
}