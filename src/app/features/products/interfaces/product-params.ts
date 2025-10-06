import { Gender } from './products-api-response';

export interface ProductParams {
  limit?: number;
  offset?: number;
  gender?: Gender;
}
