import type { OrderDocument } from "./mongodb";
import { getOrdersCollection } from "./mongodb";

export type OrderInput = Omit<OrderDocument, "_id">;

export async function insertOrder(order: OrderInput): Promise<void> {
  const coll = await getOrdersCollection();
  await coll.insertOne(order as Omit<OrderDocument, "_id">);
}

export async function getOrders(): Promise<OrderDocument[]> {
  const coll = await getOrdersCollection();
  const cursor = coll.find({}).sort({ created_at: -1 });
  const list = await cursor.toArray();
  return list.map((doc) => {
    const { _id, ...rest } = doc;
    return rest as OrderDocument;
  });
}
