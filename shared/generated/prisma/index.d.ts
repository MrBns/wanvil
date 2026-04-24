
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model RunHistory
 * 
 */
export type RunHistory = $Result.DefaultSelection<Prisma.$RunHistoryPayload>
/**
 * Model LastConfig
 * 
 */
export type LastConfig = $Result.DefaultSelection<Prisma.$LastConfigPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more RunHistories
 * const runHistories = await prisma.runHistory.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more RunHistories
   * const runHistories = await prisma.runHistory.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.runHistory`: Exposes CRUD operations for the **RunHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RunHistories
    * const runHistories = await prisma.runHistory.findMany()
    * ```
    */
  get runHistory(): Prisma.RunHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lastConfig`: Exposes CRUD operations for the **LastConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LastConfigs
    * const lastConfigs = await prisma.lastConfig.findMany()
    * ```
    */
  get lastConfig(): Prisma.LastConfigDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    RunHistory: 'RunHistory',
    LastConfig: 'LastConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "runHistory" | "lastConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      RunHistory: {
        payload: Prisma.$RunHistoryPayload<ExtArgs>
        fields: Prisma.RunHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RunHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RunHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload>
          }
          findFirst: {
            args: Prisma.RunHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RunHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload>
          }
          findMany: {
            args: Prisma.RunHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload>[]
          }
          create: {
            args: Prisma.RunHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload>
          }
          createMany: {
            args: Prisma.RunHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RunHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload>[]
          }
          delete: {
            args: Prisma.RunHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload>
          }
          update: {
            args: Prisma.RunHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload>
          }
          deleteMany: {
            args: Prisma.RunHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RunHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RunHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload>[]
          }
          upsert: {
            args: Prisma.RunHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RunHistoryPayload>
          }
          aggregate: {
            args: Prisma.RunHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRunHistory>
          }
          groupBy: {
            args: Prisma.RunHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<RunHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.RunHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<RunHistoryCountAggregateOutputType> | number
          }
        }
      }
      LastConfig: {
        payload: Prisma.$LastConfigPayload<ExtArgs>
        fields: Prisma.LastConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LastConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LastConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload>
          }
          findFirst: {
            args: Prisma.LastConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LastConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload>
          }
          findMany: {
            args: Prisma.LastConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload>[]
          }
          create: {
            args: Prisma.LastConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload>
          }
          createMany: {
            args: Prisma.LastConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LastConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload>[]
          }
          delete: {
            args: Prisma.LastConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload>
          }
          update: {
            args: Prisma.LastConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload>
          }
          deleteMany: {
            args: Prisma.LastConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LastConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LastConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload>[]
          }
          upsert: {
            args: Prisma.LastConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LastConfigPayload>
          }
          aggregate: {
            args: Prisma.LastConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLastConfig>
          }
          groupBy: {
            args: Prisma.LastConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<LastConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.LastConfigCountArgs<ExtArgs>
            result: $Utils.Optional<LastConfigCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    runHistory?: RunHistoryOmit
    lastConfig?: LastConfigOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model RunHistory
   */

  export type AggregateRunHistory = {
    _count: RunHistoryCountAggregateOutputType | null
    _avg: RunHistoryAvgAggregateOutputType | null
    _sum: RunHistorySumAggregateOutputType | null
    _min: RunHistoryMinAggregateOutputType | null
    _max: RunHistoryMaxAggregateOutputType | null
  }

  export type RunHistoryAvgAggregateOutputType = {
    id: number | null
  }

  export type RunHistorySumAggregateOutputType = {
    id: number | null
  }

  export type RunHistoryMinAggregateOutputType = {
    id: number | null
    created_at: Date | null
    label: string | null
    args_json: string | null
    fork_url: string | null
    fork_block_number: string | null
    mnemonic: string | null
  }

  export type RunHistoryMaxAggregateOutputType = {
    id: number | null
    created_at: Date | null
    label: string | null
    args_json: string | null
    fork_url: string | null
    fork_block_number: string | null
    mnemonic: string | null
  }

  export type RunHistoryCountAggregateOutputType = {
    id: number
    created_at: number
    label: number
    args_json: number
    fork_url: number
    fork_block_number: number
    mnemonic: number
    _all: number
  }


  export type RunHistoryAvgAggregateInputType = {
    id?: true
  }

  export type RunHistorySumAggregateInputType = {
    id?: true
  }

  export type RunHistoryMinAggregateInputType = {
    id?: true
    created_at?: true
    label?: true
    args_json?: true
    fork_url?: true
    fork_block_number?: true
    mnemonic?: true
  }

  export type RunHistoryMaxAggregateInputType = {
    id?: true
    created_at?: true
    label?: true
    args_json?: true
    fork_url?: true
    fork_block_number?: true
    mnemonic?: true
  }

  export type RunHistoryCountAggregateInputType = {
    id?: true
    created_at?: true
    label?: true
    args_json?: true
    fork_url?: true
    fork_block_number?: true
    mnemonic?: true
    _all?: true
  }

  export type RunHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RunHistory to aggregate.
     */
    where?: RunHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunHistories to fetch.
     */
    orderBy?: RunHistoryOrderByWithRelationInput | RunHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RunHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RunHistories
    **/
    _count?: true | RunHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RunHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RunHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RunHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RunHistoryMaxAggregateInputType
  }

  export type GetRunHistoryAggregateType<T extends RunHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateRunHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRunHistory[P]>
      : GetScalarType<T[P], AggregateRunHistory[P]>
  }




  export type RunHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RunHistoryWhereInput
    orderBy?: RunHistoryOrderByWithAggregationInput | RunHistoryOrderByWithAggregationInput[]
    by: RunHistoryScalarFieldEnum[] | RunHistoryScalarFieldEnum
    having?: RunHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RunHistoryCountAggregateInputType | true
    _avg?: RunHistoryAvgAggregateInputType
    _sum?: RunHistorySumAggregateInputType
    _min?: RunHistoryMinAggregateInputType
    _max?: RunHistoryMaxAggregateInputType
  }

  export type RunHistoryGroupByOutputType = {
    id: number
    created_at: Date
    label: string
    args_json: string
    fork_url: string
    fork_block_number: string
    mnemonic: string
    _count: RunHistoryCountAggregateOutputType | null
    _avg: RunHistoryAvgAggregateOutputType | null
    _sum: RunHistorySumAggregateOutputType | null
    _min: RunHistoryMinAggregateOutputType | null
    _max: RunHistoryMaxAggregateOutputType | null
  }

  type GetRunHistoryGroupByPayload<T extends RunHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RunHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RunHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RunHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], RunHistoryGroupByOutputType[P]>
        }
      >
    >


  export type RunHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    label?: boolean
    args_json?: boolean
    fork_url?: boolean
    fork_block_number?: boolean
    mnemonic?: boolean
  }, ExtArgs["result"]["runHistory"]>

  export type RunHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    label?: boolean
    args_json?: boolean
    fork_url?: boolean
    fork_block_number?: boolean
    mnemonic?: boolean
  }, ExtArgs["result"]["runHistory"]>

  export type RunHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    label?: boolean
    args_json?: boolean
    fork_url?: boolean
    fork_block_number?: boolean
    mnemonic?: boolean
  }, ExtArgs["result"]["runHistory"]>

  export type RunHistorySelectScalar = {
    id?: boolean
    created_at?: boolean
    label?: boolean
    args_json?: boolean
    fork_url?: boolean
    fork_block_number?: boolean
    mnemonic?: boolean
  }

  export type RunHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "created_at" | "label" | "args_json" | "fork_url" | "fork_block_number" | "mnemonic", ExtArgs["result"]["runHistory"]>

  export type $RunHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RunHistory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      created_at: Date
      label: string
      args_json: string
      fork_url: string
      fork_block_number: string
      mnemonic: string
    }, ExtArgs["result"]["runHistory"]>
    composites: {}
  }

  type RunHistoryGetPayload<S extends boolean | null | undefined | RunHistoryDefaultArgs> = $Result.GetResult<Prisma.$RunHistoryPayload, S>

  type RunHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RunHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RunHistoryCountAggregateInputType | true
    }

  export interface RunHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RunHistory'], meta: { name: 'RunHistory' } }
    /**
     * Find zero or one RunHistory that matches the filter.
     * @param {RunHistoryFindUniqueArgs} args - Arguments to find a RunHistory
     * @example
     * // Get one RunHistory
     * const runHistory = await prisma.runHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RunHistoryFindUniqueArgs>(args: SelectSubset<T, RunHistoryFindUniqueArgs<ExtArgs>>): Prisma__RunHistoryClient<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RunHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RunHistoryFindUniqueOrThrowArgs} args - Arguments to find a RunHistory
     * @example
     * // Get one RunHistory
     * const runHistory = await prisma.runHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RunHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, RunHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RunHistoryClient<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RunHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunHistoryFindFirstArgs} args - Arguments to find a RunHistory
     * @example
     * // Get one RunHistory
     * const runHistory = await prisma.runHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RunHistoryFindFirstArgs>(args?: SelectSubset<T, RunHistoryFindFirstArgs<ExtArgs>>): Prisma__RunHistoryClient<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RunHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunHistoryFindFirstOrThrowArgs} args - Arguments to find a RunHistory
     * @example
     * // Get one RunHistory
     * const runHistory = await prisma.runHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RunHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, RunHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__RunHistoryClient<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RunHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RunHistories
     * const runHistories = await prisma.runHistory.findMany()
     * 
     * // Get first 10 RunHistories
     * const runHistories = await prisma.runHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const runHistoryWithIdOnly = await prisma.runHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RunHistoryFindManyArgs>(args?: SelectSubset<T, RunHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RunHistory.
     * @param {RunHistoryCreateArgs} args - Arguments to create a RunHistory.
     * @example
     * // Create one RunHistory
     * const RunHistory = await prisma.runHistory.create({
     *   data: {
     *     // ... data to create a RunHistory
     *   }
     * })
     * 
     */
    create<T extends RunHistoryCreateArgs>(args: SelectSubset<T, RunHistoryCreateArgs<ExtArgs>>): Prisma__RunHistoryClient<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RunHistories.
     * @param {RunHistoryCreateManyArgs} args - Arguments to create many RunHistories.
     * @example
     * // Create many RunHistories
     * const runHistory = await prisma.runHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RunHistoryCreateManyArgs>(args?: SelectSubset<T, RunHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RunHistories and returns the data saved in the database.
     * @param {RunHistoryCreateManyAndReturnArgs} args - Arguments to create many RunHistories.
     * @example
     * // Create many RunHistories
     * const runHistory = await prisma.runHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RunHistories and only return the `id`
     * const runHistoryWithIdOnly = await prisma.runHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RunHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, RunHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RunHistory.
     * @param {RunHistoryDeleteArgs} args - Arguments to delete one RunHistory.
     * @example
     * // Delete one RunHistory
     * const RunHistory = await prisma.runHistory.delete({
     *   where: {
     *     // ... filter to delete one RunHistory
     *   }
     * })
     * 
     */
    delete<T extends RunHistoryDeleteArgs>(args: SelectSubset<T, RunHistoryDeleteArgs<ExtArgs>>): Prisma__RunHistoryClient<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RunHistory.
     * @param {RunHistoryUpdateArgs} args - Arguments to update one RunHistory.
     * @example
     * // Update one RunHistory
     * const runHistory = await prisma.runHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RunHistoryUpdateArgs>(args: SelectSubset<T, RunHistoryUpdateArgs<ExtArgs>>): Prisma__RunHistoryClient<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RunHistories.
     * @param {RunHistoryDeleteManyArgs} args - Arguments to filter RunHistories to delete.
     * @example
     * // Delete a few RunHistories
     * const { count } = await prisma.runHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RunHistoryDeleteManyArgs>(args?: SelectSubset<T, RunHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RunHistories
     * const runHistory = await prisma.runHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RunHistoryUpdateManyArgs>(args: SelectSubset<T, RunHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RunHistories and returns the data updated in the database.
     * @param {RunHistoryUpdateManyAndReturnArgs} args - Arguments to update many RunHistories.
     * @example
     * // Update many RunHistories
     * const runHistory = await prisma.runHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RunHistories and only return the `id`
     * const runHistoryWithIdOnly = await prisma.runHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RunHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, RunHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RunHistory.
     * @param {RunHistoryUpsertArgs} args - Arguments to update or create a RunHistory.
     * @example
     * // Update or create a RunHistory
     * const runHistory = await prisma.runHistory.upsert({
     *   create: {
     *     // ... data to create a RunHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RunHistory we want to update
     *   }
     * })
     */
    upsert<T extends RunHistoryUpsertArgs>(args: SelectSubset<T, RunHistoryUpsertArgs<ExtArgs>>): Prisma__RunHistoryClient<$Result.GetResult<Prisma.$RunHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RunHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunHistoryCountArgs} args - Arguments to filter RunHistories to count.
     * @example
     * // Count the number of RunHistories
     * const count = await prisma.runHistory.count({
     *   where: {
     *     // ... the filter for the RunHistories we want to count
     *   }
     * })
    **/
    count<T extends RunHistoryCountArgs>(
      args?: Subset<T, RunHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RunHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RunHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RunHistoryAggregateArgs>(args: Subset<T, RunHistoryAggregateArgs>): Prisma.PrismaPromise<GetRunHistoryAggregateType<T>>

    /**
     * Group by RunHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RunHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RunHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RunHistoryGroupByArgs['orderBy'] }
        : { orderBy?: RunHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RunHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRunHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RunHistory model
   */
  readonly fields: RunHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RunHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RunHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RunHistory model
   */
  interface RunHistoryFieldRefs {
    readonly id: FieldRef<"RunHistory", 'Int'>
    readonly created_at: FieldRef<"RunHistory", 'DateTime'>
    readonly label: FieldRef<"RunHistory", 'String'>
    readonly args_json: FieldRef<"RunHistory", 'String'>
    readonly fork_url: FieldRef<"RunHistory", 'String'>
    readonly fork_block_number: FieldRef<"RunHistory", 'String'>
    readonly mnemonic: FieldRef<"RunHistory", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RunHistory findUnique
   */
  export type RunHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * Filter, which RunHistory to fetch.
     */
    where: RunHistoryWhereUniqueInput
  }

  /**
   * RunHistory findUniqueOrThrow
   */
  export type RunHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * Filter, which RunHistory to fetch.
     */
    where: RunHistoryWhereUniqueInput
  }

  /**
   * RunHistory findFirst
   */
  export type RunHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * Filter, which RunHistory to fetch.
     */
    where?: RunHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunHistories to fetch.
     */
    orderBy?: RunHistoryOrderByWithRelationInput | RunHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RunHistories.
     */
    cursor?: RunHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunHistories.
     */
    distinct?: RunHistoryScalarFieldEnum | RunHistoryScalarFieldEnum[]
  }

  /**
   * RunHistory findFirstOrThrow
   */
  export type RunHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * Filter, which RunHistory to fetch.
     */
    where?: RunHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunHistories to fetch.
     */
    orderBy?: RunHistoryOrderByWithRelationInput | RunHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RunHistories.
     */
    cursor?: RunHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunHistories.
     */
    distinct?: RunHistoryScalarFieldEnum | RunHistoryScalarFieldEnum[]
  }

  /**
   * RunHistory findMany
   */
  export type RunHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * Filter, which RunHistories to fetch.
     */
    where?: RunHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RunHistories to fetch.
     */
    orderBy?: RunHistoryOrderByWithRelationInput | RunHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RunHistories.
     */
    cursor?: RunHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RunHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RunHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RunHistories.
     */
    distinct?: RunHistoryScalarFieldEnum | RunHistoryScalarFieldEnum[]
  }

  /**
   * RunHistory create
   */
  export type RunHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * The data needed to create a RunHistory.
     */
    data: XOR<RunHistoryCreateInput, RunHistoryUncheckedCreateInput>
  }

  /**
   * RunHistory createMany
   */
  export type RunHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RunHistories.
     */
    data: RunHistoryCreateManyInput | RunHistoryCreateManyInput[]
  }

  /**
   * RunHistory createManyAndReturn
   */
  export type RunHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many RunHistories.
     */
    data: RunHistoryCreateManyInput | RunHistoryCreateManyInput[]
  }

  /**
   * RunHistory update
   */
  export type RunHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * The data needed to update a RunHistory.
     */
    data: XOR<RunHistoryUpdateInput, RunHistoryUncheckedUpdateInput>
    /**
     * Choose, which RunHistory to update.
     */
    where: RunHistoryWhereUniqueInput
  }

  /**
   * RunHistory updateMany
   */
  export type RunHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RunHistories.
     */
    data: XOR<RunHistoryUpdateManyMutationInput, RunHistoryUncheckedUpdateManyInput>
    /**
     * Filter which RunHistories to update
     */
    where?: RunHistoryWhereInput
    /**
     * Limit how many RunHistories to update.
     */
    limit?: number
  }

  /**
   * RunHistory updateManyAndReturn
   */
  export type RunHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * The data used to update RunHistories.
     */
    data: XOR<RunHistoryUpdateManyMutationInput, RunHistoryUncheckedUpdateManyInput>
    /**
     * Filter which RunHistories to update
     */
    where?: RunHistoryWhereInput
    /**
     * Limit how many RunHistories to update.
     */
    limit?: number
  }

  /**
   * RunHistory upsert
   */
  export type RunHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * The filter to search for the RunHistory to update in case it exists.
     */
    where: RunHistoryWhereUniqueInput
    /**
     * In case the RunHistory found by the `where` argument doesn't exist, create a new RunHistory with this data.
     */
    create: XOR<RunHistoryCreateInput, RunHistoryUncheckedCreateInput>
    /**
     * In case the RunHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RunHistoryUpdateInput, RunHistoryUncheckedUpdateInput>
  }

  /**
   * RunHistory delete
   */
  export type RunHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
    /**
     * Filter which RunHistory to delete.
     */
    where: RunHistoryWhereUniqueInput
  }

  /**
   * RunHistory deleteMany
   */
  export type RunHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RunHistories to delete
     */
    where?: RunHistoryWhereInput
    /**
     * Limit how many RunHistories to delete.
     */
    limit?: number
  }

  /**
   * RunHistory without action
   */
  export type RunHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RunHistory
     */
    select?: RunHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the RunHistory
     */
    omit?: RunHistoryOmit<ExtArgs> | null
  }


  /**
   * Model LastConfig
   */

  export type AggregateLastConfig = {
    _count: LastConfigCountAggregateOutputType | null
    _avg: LastConfigAvgAggregateOutputType | null
    _sum: LastConfigSumAggregateOutputType | null
    _min: LastConfigMinAggregateOutputType | null
    _max: LastConfigMaxAggregateOutputType | null
  }

  export type LastConfigAvgAggregateOutputType = {
    id: number | null
  }

  export type LastConfigSumAggregateOutputType = {
    id: number | null
  }

  export type LastConfigMinAggregateOutputType = {
    id: number | null
    fork_url: string | null
    fork_block_number: string | null
    mnemonic: string | null
  }

  export type LastConfigMaxAggregateOutputType = {
    id: number | null
    fork_url: string | null
    fork_block_number: string | null
    mnemonic: string | null
  }

  export type LastConfigCountAggregateOutputType = {
    id: number
    fork_url: number
    fork_block_number: number
    mnemonic: number
    _all: number
  }


  export type LastConfigAvgAggregateInputType = {
    id?: true
  }

  export type LastConfigSumAggregateInputType = {
    id?: true
  }

  export type LastConfigMinAggregateInputType = {
    id?: true
    fork_url?: true
    fork_block_number?: true
    mnemonic?: true
  }

  export type LastConfigMaxAggregateInputType = {
    id?: true
    fork_url?: true
    fork_block_number?: true
    mnemonic?: true
  }

  export type LastConfigCountAggregateInputType = {
    id?: true
    fork_url?: true
    fork_block_number?: true
    mnemonic?: true
    _all?: true
  }

  export type LastConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LastConfig to aggregate.
     */
    where?: LastConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LastConfigs to fetch.
     */
    orderBy?: LastConfigOrderByWithRelationInput | LastConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LastConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LastConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LastConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LastConfigs
    **/
    _count?: true | LastConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LastConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LastConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LastConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LastConfigMaxAggregateInputType
  }

  export type GetLastConfigAggregateType<T extends LastConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateLastConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLastConfig[P]>
      : GetScalarType<T[P], AggregateLastConfig[P]>
  }




  export type LastConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LastConfigWhereInput
    orderBy?: LastConfigOrderByWithAggregationInput | LastConfigOrderByWithAggregationInput[]
    by: LastConfigScalarFieldEnum[] | LastConfigScalarFieldEnum
    having?: LastConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LastConfigCountAggregateInputType | true
    _avg?: LastConfigAvgAggregateInputType
    _sum?: LastConfigSumAggregateInputType
    _min?: LastConfigMinAggregateInputType
    _max?: LastConfigMaxAggregateInputType
  }

  export type LastConfigGroupByOutputType = {
    id: number
    fork_url: string
    fork_block_number: string
    mnemonic: string
    _count: LastConfigCountAggregateOutputType | null
    _avg: LastConfigAvgAggregateOutputType | null
    _sum: LastConfigSumAggregateOutputType | null
    _min: LastConfigMinAggregateOutputType | null
    _max: LastConfigMaxAggregateOutputType | null
  }

  type GetLastConfigGroupByPayload<T extends LastConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LastConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LastConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LastConfigGroupByOutputType[P]>
            : GetScalarType<T[P], LastConfigGroupByOutputType[P]>
        }
      >
    >


  export type LastConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fork_url?: boolean
    fork_block_number?: boolean
    mnemonic?: boolean
  }, ExtArgs["result"]["lastConfig"]>

  export type LastConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fork_url?: boolean
    fork_block_number?: boolean
    mnemonic?: boolean
  }, ExtArgs["result"]["lastConfig"]>

  export type LastConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fork_url?: boolean
    fork_block_number?: boolean
    mnemonic?: boolean
  }, ExtArgs["result"]["lastConfig"]>

  export type LastConfigSelectScalar = {
    id?: boolean
    fork_url?: boolean
    fork_block_number?: boolean
    mnemonic?: boolean
  }

  export type LastConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fork_url" | "fork_block_number" | "mnemonic", ExtArgs["result"]["lastConfig"]>

  export type $LastConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LastConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      fork_url: string
      fork_block_number: string
      mnemonic: string
    }, ExtArgs["result"]["lastConfig"]>
    composites: {}
  }

  type LastConfigGetPayload<S extends boolean | null | undefined | LastConfigDefaultArgs> = $Result.GetResult<Prisma.$LastConfigPayload, S>

  type LastConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LastConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LastConfigCountAggregateInputType | true
    }

  export interface LastConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LastConfig'], meta: { name: 'LastConfig' } }
    /**
     * Find zero or one LastConfig that matches the filter.
     * @param {LastConfigFindUniqueArgs} args - Arguments to find a LastConfig
     * @example
     * // Get one LastConfig
     * const lastConfig = await prisma.lastConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LastConfigFindUniqueArgs>(args: SelectSubset<T, LastConfigFindUniqueArgs<ExtArgs>>): Prisma__LastConfigClient<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LastConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LastConfigFindUniqueOrThrowArgs} args - Arguments to find a LastConfig
     * @example
     * // Get one LastConfig
     * const lastConfig = await prisma.lastConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LastConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, LastConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LastConfigClient<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LastConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LastConfigFindFirstArgs} args - Arguments to find a LastConfig
     * @example
     * // Get one LastConfig
     * const lastConfig = await prisma.lastConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LastConfigFindFirstArgs>(args?: SelectSubset<T, LastConfigFindFirstArgs<ExtArgs>>): Prisma__LastConfigClient<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LastConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LastConfigFindFirstOrThrowArgs} args - Arguments to find a LastConfig
     * @example
     * // Get one LastConfig
     * const lastConfig = await prisma.lastConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LastConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, LastConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__LastConfigClient<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LastConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LastConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LastConfigs
     * const lastConfigs = await prisma.lastConfig.findMany()
     * 
     * // Get first 10 LastConfigs
     * const lastConfigs = await prisma.lastConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lastConfigWithIdOnly = await prisma.lastConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LastConfigFindManyArgs>(args?: SelectSubset<T, LastConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LastConfig.
     * @param {LastConfigCreateArgs} args - Arguments to create a LastConfig.
     * @example
     * // Create one LastConfig
     * const LastConfig = await prisma.lastConfig.create({
     *   data: {
     *     // ... data to create a LastConfig
     *   }
     * })
     * 
     */
    create<T extends LastConfigCreateArgs>(args: SelectSubset<T, LastConfigCreateArgs<ExtArgs>>): Prisma__LastConfigClient<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LastConfigs.
     * @param {LastConfigCreateManyArgs} args - Arguments to create many LastConfigs.
     * @example
     * // Create many LastConfigs
     * const lastConfig = await prisma.lastConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LastConfigCreateManyArgs>(args?: SelectSubset<T, LastConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LastConfigs and returns the data saved in the database.
     * @param {LastConfigCreateManyAndReturnArgs} args - Arguments to create many LastConfigs.
     * @example
     * // Create many LastConfigs
     * const lastConfig = await prisma.lastConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LastConfigs and only return the `id`
     * const lastConfigWithIdOnly = await prisma.lastConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LastConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, LastConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LastConfig.
     * @param {LastConfigDeleteArgs} args - Arguments to delete one LastConfig.
     * @example
     * // Delete one LastConfig
     * const LastConfig = await prisma.lastConfig.delete({
     *   where: {
     *     // ... filter to delete one LastConfig
     *   }
     * })
     * 
     */
    delete<T extends LastConfigDeleteArgs>(args: SelectSubset<T, LastConfigDeleteArgs<ExtArgs>>): Prisma__LastConfigClient<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LastConfig.
     * @param {LastConfigUpdateArgs} args - Arguments to update one LastConfig.
     * @example
     * // Update one LastConfig
     * const lastConfig = await prisma.lastConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LastConfigUpdateArgs>(args: SelectSubset<T, LastConfigUpdateArgs<ExtArgs>>): Prisma__LastConfigClient<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LastConfigs.
     * @param {LastConfigDeleteManyArgs} args - Arguments to filter LastConfigs to delete.
     * @example
     * // Delete a few LastConfigs
     * const { count } = await prisma.lastConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LastConfigDeleteManyArgs>(args?: SelectSubset<T, LastConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LastConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LastConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LastConfigs
     * const lastConfig = await prisma.lastConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LastConfigUpdateManyArgs>(args: SelectSubset<T, LastConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LastConfigs and returns the data updated in the database.
     * @param {LastConfigUpdateManyAndReturnArgs} args - Arguments to update many LastConfigs.
     * @example
     * // Update many LastConfigs
     * const lastConfig = await prisma.lastConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LastConfigs and only return the `id`
     * const lastConfigWithIdOnly = await prisma.lastConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LastConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, LastConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LastConfig.
     * @param {LastConfigUpsertArgs} args - Arguments to update or create a LastConfig.
     * @example
     * // Update or create a LastConfig
     * const lastConfig = await prisma.lastConfig.upsert({
     *   create: {
     *     // ... data to create a LastConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LastConfig we want to update
     *   }
     * })
     */
    upsert<T extends LastConfigUpsertArgs>(args: SelectSubset<T, LastConfigUpsertArgs<ExtArgs>>): Prisma__LastConfigClient<$Result.GetResult<Prisma.$LastConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LastConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LastConfigCountArgs} args - Arguments to filter LastConfigs to count.
     * @example
     * // Count the number of LastConfigs
     * const count = await prisma.lastConfig.count({
     *   where: {
     *     // ... the filter for the LastConfigs we want to count
     *   }
     * })
    **/
    count<T extends LastConfigCountArgs>(
      args?: Subset<T, LastConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LastConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LastConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LastConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LastConfigAggregateArgs>(args: Subset<T, LastConfigAggregateArgs>): Prisma.PrismaPromise<GetLastConfigAggregateType<T>>

    /**
     * Group by LastConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LastConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LastConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LastConfigGroupByArgs['orderBy'] }
        : { orderBy?: LastConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LastConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLastConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LastConfig model
   */
  readonly fields: LastConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LastConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LastConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LastConfig model
   */
  interface LastConfigFieldRefs {
    readonly id: FieldRef<"LastConfig", 'Int'>
    readonly fork_url: FieldRef<"LastConfig", 'String'>
    readonly fork_block_number: FieldRef<"LastConfig", 'String'>
    readonly mnemonic: FieldRef<"LastConfig", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LastConfig findUnique
   */
  export type LastConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * Filter, which LastConfig to fetch.
     */
    where: LastConfigWhereUniqueInput
  }

  /**
   * LastConfig findUniqueOrThrow
   */
  export type LastConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * Filter, which LastConfig to fetch.
     */
    where: LastConfigWhereUniqueInput
  }

  /**
   * LastConfig findFirst
   */
  export type LastConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * Filter, which LastConfig to fetch.
     */
    where?: LastConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LastConfigs to fetch.
     */
    orderBy?: LastConfigOrderByWithRelationInput | LastConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LastConfigs.
     */
    cursor?: LastConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LastConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LastConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LastConfigs.
     */
    distinct?: LastConfigScalarFieldEnum | LastConfigScalarFieldEnum[]
  }

  /**
   * LastConfig findFirstOrThrow
   */
  export type LastConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * Filter, which LastConfig to fetch.
     */
    where?: LastConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LastConfigs to fetch.
     */
    orderBy?: LastConfigOrderByWithRelationInput | LastConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LastConfigs.
     */
    cursor?: LastConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LastConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LastConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LastConfigs.
     */
    distinct?: LastConfigScalarFieldEnum | LastConfigScalarFieldEnum[]
  }

  /**
   * LastConfig findMany
   */
  export type LastConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * Filter, which LastConfigs to fetch.
     */
    where?: LastConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LastConfigs to fetch.
     */
    orderBy?: LastConfigOrderByWithRelationInput | LastConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LastConfigs.
     */
    cursor?: LastConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LastConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LastConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LastConfigs.
     */
    distinct?: LastConfigScalarFieldEnum | LastConfigScalarFieldEnum[]
  }

  /**
   * LastConfig create
   */
  export type LastConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a LastConfig.
     */
    data: XOR<LastConfigCreateInput, LastConfigUncheckedCreateInput>
  }

  /**
   * LastConfig createMany
   */
  export type LastConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LastConfigs.
     */
    data: LastConfigCreateManyInput | LastConfigCreateManyInput[]
  }

  /**
   * LastConfig createManyAndReturn
   */
  export type LastConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * The data used to create many LastConfigs.
     */
    data: LastConfigCreateManyInput | LastConfigCreateManyInput[]
  }

  /**
   * LastConfig update
   */
  export type LastConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a LastConfig.
     */
    data: XOR<LastConfigUpdateInput, LastConfigUncheckedUpdateInput>
    /**
     * Choose, which LastConfig to update.
     */
    where: LastConfigWhereUniqueInput
  }

  /**
   * LastConfig updateMany
   */
  export type LastConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LastConfigs.
     */
    data: XOR<LastConfigUpdateManyMutationInput, LastConfigUncheckedUpdateManyInput>
    /**
     * Filter which LastConfigs to update
     */
    where?: LastConfigWhereInput
    /**
     * Limit how many LastConfigs to update.
     */
    limit?: number
  }

  /**
   * LastConfig updateManyAndReturn
   */
  export type LastConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * The data used to update LastConfigs.
     */
    data: XOR<LastConfigUpdateManyMutationInput, LastConfigUncheckedUpdateManyInput>
    /**
     * Filter which LastConfigs to update
     */
    where?: LastConfigWhereInput
    /**
     * Limit how many LastConfigs to update.
     */
    limit?: number
  }

  /**
   * LastConfig upsert
   */
  export type LastConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the LastConfig to update in case it exists.
     */
    where: LastConfigWhereUniqueInput
    /**
     * In case the LastConfig found by the `where` argument doesn't exist, create a new LastConfig with this data.
     */
    create: XOR<LastConfigCreateInput, LastConfigUncheckedCreateInput>
    /**
     * In case the LastConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LastConfigUpdateInput, LastConfigUncheckedUpdateInput>
  }

  /**
   * LastConfig delete
   */
  export type LastConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
    /**
     * Filter which LastConfig to delete.
     */
    where: LastConfigWhereUniqueInput
  }

  /**
   * LastConfig deleteMany
   */
  export type LastConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LastConfigs to delete
     */
    where?: LastConfigWhereInput
    /**
     * Limit how many LastConfigs to delete.
     */
    limit?: number
  }

  /**
   * LastConfig without action
   */
  export type LastConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LastConfig
     */
    select?: LastConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LastConfig
     */
    omit?: LastConfigOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RunHistoryScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    label: 'label',
    args_json: 'args_json',
    fork_url: 'fork_url',
    fork_block_number: 'fork_block_number',
    mnemonic: 'mnemonic'
  };

  export type RunHistoryScalarFieldEnum = (typeof RunHistoryScalarFieldEnum)[keyof typeof RunHistoryScalarFieldEnum]


  export const LastConfigScalarFieldEnum: {
    id: 'id',
    fork_url: 'fork_url',
    fork_block_number: 'fork_block_number',
    mnemonic: 'mnemonic'
  };

  export type LastConfigScalarFieldEnum = (typeof LastConfigScalarFieldEnum)[keyof typeof LastConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type RunHistoryWhereInput = {
    AND?: RunHistoryWhereInput | RunHistoryWhereInput[]
    OR?: RunHistoryWhereInput[]
    NOT?: RunHistoryWhereInput | RunHistoryWhereInput[]
    id?: IntFilter<"RunHistory"> | number
    created_at?: DateTimeFilter<"RunHistory"> | Date | string
    label?: StringFilter<"RunHistory"> | string
    args_json?: StringFilter<"RunHistory"> | string
    fork_url?: StringFilter<"RunHistory"> | string
    fork_block_number?: StringFilter<"RunHistory"> | string
    mnemonic?: StringFilter<"RunHistory"> | string
  }

  export type RunHistoryOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrder
    label?: SortOrder
    args_json?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
  }

  export type RunHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RunHistoryWhereInput | RunHistoryWhereInput[]
    OR?: RunHistoryWhereInput[]
    NOT?: RunHistoryWhereInput | RunHistoryWhereInput[]
    created_at?: DateTimeFilter<"RunHistory"> | Date | string
    label?: StringFilter<"RunHistory"> | string
    args_json?: StringFilter<"RunHistory"> | string
    fork_url?: StringFilter<"RunHistory"> | string
    fork_block_number?: StringFilter<"RunHistory"> | string
    mnemonic?: StringFilter<"RunHistory"> | string
  }, "id">

  export type RunHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrder
    label?: SortOrder
    args_json?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
    _count?: RunHistoryCountOrderByAggregateInput
    _avg?: RunHistoryAvgOrderByAggregateInput
    _max?: RunHistoryMaxOrderByAggregateInput
    _min?: RunHistoryMinOrderByAggregateInput
    _sum?: RunHistorySumOrderByAggregateInput
  }

  export type RunHistoryScalarWhereWithAggregatesInput = {
    AND?: RunHistoryScalarWhereWithAggregatesInput | RunHistoryScalarWhereWithAggregatesInput[]
    OR?: RunHistoryScalarWhereWithAggregatesInput[]
    NOT?: RunHistoryScalarWhereWithAggregatesInput | RunHistoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RunHistory"> | number
    created_at?: DateTimeWithAggregatesFilter<"RunHistory"> | Date | string
    label?: StringWithAggregatesFilter<"RunHistory"> | string
    args_json?: StringWithAggregatesFilter<"RunHistory"> | string
    fork_url?: StringWithAggregatesFilter<"RunHistory"> | string
    fork_block_number?: StringWithAggregatesFilter<"RunHistory"> | string
    mnemonic?: StringWithAggregatesFilter<"RunHistory"> | string
  }

  export type LastConfigWhereInput = {
    AND?: LastConfigWhereInput | LastConfigWhereInput[]
    OR?: LastConfigWhereInput[]
    NOT?: LastConfigWhereInput | LastConfigWhereInput[]
    id?: IntFilter<"LastConfig"> | number
    fork_url?: StringFilter<"LastConfig"> | string
    fork_block_number?: StringFilter<"LastConfig"> | string
    mnemonic?: StringFilter<"LastConfig"> | string
  }

  export type LastConfigOrderByWithRelationInput = {
    id?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
  }

  export type LastConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LastConfigWhereInput | LastConfigWhereInput[]
    OR?: LastConfigWhereInput[]
    NOT?: LastConfigWhereInput | LastConfigWhereInput[]
    fork_url?: StringFilter<"LastConfig"> | string
    fork_block_number?: StringFilter<"LastConfig"> | string
    mnemonic?: StringFilter<"LastConfig"> | string
  }, "id">

  export type LastConfigOrderByWithAggregationInput = {
    id?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
    _count?: LastConfigCountOrderByAggregateInput
    _avg?: LastConfigAvgOrderByAggregateInput
    _max?: LastConfigMaxOrderByAggregateInput
    _min?: LastConfigMinOrderByAggregateInput
    _sum?: LastConfigSumOrderByAggregateInput
  }

  export type LastConfigScalarWhereWithAggregatesInput = {
    AND?: LastConfigScalarWhereWithAggregatesInput | LastConfigScalarWhereWithAggregatesInput[]
    OR?: LastConfigScalarWhereWithAggregatesInput[]
    NOT?: LastConfigScalarWhereWithAggregatesInput | LastConfigScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LastConfig"> | number
    fork_url?: StringWithAggregatesFilter<"LastConfig"> | string
    fork_block_number?: StringWithAggregatesFilter<"LastConfig"> | string
    mnemonic?: StringWithAggregatesFilter<"LastConfig"> | string
  }

  export type RunHistoryCreateInput = {
    created_at?: Date | string
    label: string
    args_json: string
    fork_url: string
    fork_block_number: string
    mnemonic: string
  }

  export type RunHistoryUncheckedCreateInput = {
    id?: number
    created_at?: Date | string
    label: string
    args_json: string
    fork_url: string
    fork_block_number: string
    mnemonic: string
  }

  export type RunHistoryUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: StringFieldUpdateOperationsInput | string
    args_json?: StringFieldUpdateOperationsInput | string
    fork_url?: StringFieldUpdateOperationsInput | string
    fork_block_number?: StringFieldUpdateOperationsInput | string
    mnemonic?: StringFieldUpdateOperationsInput | string
  }

  export type RunHistoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: StringFieldUpdateOperationsInput | string
    args_json?: StringFieldUpdateOperationsInput | string
    fork_url?: StringFieldUpdateOperationsInput | string
    fork_block_number?: StringFieldUpdateOperationsInput | string
    mnemonic?: StringFieldUpdateOperationsInput | string
  }

  export type RunHistoryCreateManyInput = {
    id?: number
    created_at?: Date | string
    label: string
    args_json: string
    fork_url: string
    fork_block_number: string
    mnemonic: string
  }

  export type RunHistoryUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: StringFieldUpdateOperationsInput | string
    args_json?: StringFieldUpdateOperationsInput | string
    fork_url?: StringFieldUpdateOperationsInput | string
    fork_block_number?: StringFieldUpdateOperationsInput | string
    mnemonic?: StringFieldUpdateOperationsInput | string
  }

  export type RunHistoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: StringFieldUpdateOperationsInput | string
    args_json?: StringFieldUpdateOperationsInput | string
    fork_url?: StringFieldUpdateOperationsInput | string
    fork_block_number?: StringFieldUpdateOperationsInput | string
    mnemonic?: StringFieldUpdateOperationsInput | string
  }

  export type LastConfigCreateInput = {
    fork_url: string
    fork_block_number: string
    mnemonic: string
  }

  export type LastConfigUncheckedCreateInput = {
    id?: number
    fork_url: string
    fork_block_number: string
    mnemonic: string
  }

  export type LastConfigUpdateInput = {
    fork_url?: StringFieldUpdateOperationsInput | string
    fork_block_number?: StringFieldUpdateOperationsInput | string
    mnemonic?: StringFieldUpdateOperationsInput | string
  }

  export type LastConfigUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    fork_url?: StringFieldUpdateOperationsInput | string
    fork_block_number?: StringFieldUpdateOperationsInput | string
    mnemonic?: StringFieldUpdateOperationsInput | string
  }

  export type LastConfigCreateManyInput = {
    id?: number
    fork_url: string
    fork_block_number: string
    mnemonic: string
  }

  export type LastConfigUpdateManyMutationInput = {
    fork_url?: StringFieldUpdateOperationsInput | string
    fork_block_number?: StringFieldUpdateOperationsInput | string
    mnemonic?: StringFieldUpdateOperationsInput | string
  }

  export type LastConfigUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    fork_url?: StringFieldUpdateOperationsInput | string
    fork_block_number?: StringFieldUpdateOperationsInput | string
    mnemonic?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type RunHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    label?: SortOrder
    args_json?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
  }

  export type RunHistoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RunHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    label?: SortOrder
    args_json?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
  }

  export type RunHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    label?: SortOrder
    args_json?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
  }

  export type RunHistorySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type LastConfigCountOrderByAggregateInput = {
    id?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
  }

  export type LastConfigAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type LastConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
  }

  export type LastConfigMinOrderByAggregateInput = {
    id?: SortOrder
    fork_url?: SortOrder
    fork_block_number?: SortOrder
    mnemonic?: SortOrder
  }

  export type LastConfigSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}