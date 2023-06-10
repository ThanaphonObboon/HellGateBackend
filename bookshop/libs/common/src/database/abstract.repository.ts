// import { Logger, NotFoundException } from '@nestjs/common';
// import {
//   FilterQuery,
//   Model,
//   Types,
//   UpdateQuery,
//   SaveOptions,
//   Connection,
// } from 'mongoose';
// import { AbstractDocument } from './abstract.schema';
// import { RequestPageParam } from 'models/pagination-model/request-pagination';

// export abstract class AbstractRepository<T extends AbstractDocument> {
//   // protected abstract readonly logger: Logger;

//   constructor(
//     protected readonly model: Model<T>,
//     private readonly connection: Connection,
//   ) {}

//   async create(document: Omit<T, '_id'>, options?: SaveOptions): Promise<T> {
//     const createdDocument = new this.model({
//       ...document,
//       _id: new Types.ObjectId(),
//     });
//     return (await createdDocument.save(options)).toJSON() as unknown as T;
//   }

//   async findOne(filterQuery: FilterQuery<T>): Promise<T> {
//     const document = await this.model.findOne(filterQuery, {}, { lean: true });

//     if (!document) {
//       // this.logger.warn('Document not found with filterQuery', filterQuery);
//       throw new NotFoundException('Document not found.');
//     }

//     return document;
//   }

//   async findOneAndUpdate(filterQuery: FilterQuery<T>, update: UpdateQuery<T>) {
//     const document = await this.model.findOneAndUpdate(filterQuery, update, {
//       lean: true,
//       new: true,
//     });

//     if (!document) {
//       // this.logger.warn(`Document not found with filterQuery:`, filterQuery);
//       throw new NotFoundException('Document not found.');
//     }

//     return document;
//   }

//   async upsert(filterQuery: FilterQuery<T>, document: Partial<T>) {
//     return this.model.findOneAndUpdate(filterQuery, document, {
//       lean: true,
//       upsert: true,
//       new: true,
//     });
//   }

//   async find(filterQuery: FilterQuery<T> = {}) {
//     return this.model.find(filterQuery, {}, { lean: true });
//   }

//   async count(filterQuery: FilterQuery<T> = {}) {
//     return this.model.find(filterQuery, {}, { lean: true }).countDocuments();
//   }

//   async startTransaction() {
//     const session = await this.connection.startSession();
//     session.startTransaction();
//     return session;
//   }
// }
