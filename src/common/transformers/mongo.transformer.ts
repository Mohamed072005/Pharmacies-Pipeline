export class MongoTransformer {
  static toJson(document: any) {

    const { _id, __v, ...rest } = document.toObject();
    return {rest ,_id,__v};
  }
}
