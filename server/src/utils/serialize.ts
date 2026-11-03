import { Types } from 'mongoose';

/** Converts a `.lean()` document into the API shape: `_id` → `id`, drop `__v`. */
export const toDTO = <T extends { _id: Types.ObjectId; __v?: number }>({
  _id,
  __v,
  ...rest
}: T) => ({
  id: String(_id),
  ...rest,
});
