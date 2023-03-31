declare module 'use-fetch' {
    type Schema = {
        type: 'string' | 'boolean' | 'number' | 'integer' | 'double'
    } | {
        type: 'object',
        properties: Record<string, Record<string, any>>,
        required?: string[],
        additionalProperties: boolean
    };

    type StringToTypeT = {
        type: 'string' | 'boolean' | 'number' | 'integer' | 'double',
    } | { 
        type: 'array',
        items: {
            type: 'string' | 'boolean' | 'number' | 'integer' | 'double'
        }
    } | {
        $ref: `#/components/schemas/${string}`
    } | { 
        type: 'array',
        items: {
            $ref: `#/components/schemas/${string}`
        }
    } | 'string' | 'boolean' | 'number' | 'integer' | 'double';

    type Responses<
        U extends APIPath,
        M extends APIMethod<U>,
        Tmp = {
            [K in keyof OpenAPI['paths'][U][M]['responses'] as OpenAPI['paths'][U][M]['responses'][K]['content'] extends object ? K : never]: 
                OpenAPI['paths'][U][M]['responses'][K]
        }
    > = Tmp[keyof Tmp];

    type Requests<
        U extends APIPath,
        M extends APIMethod<U>
    > = OpenAPI['paths'][U][M]['requestBody'];

    type APIContentType<T> = keyof T['content'];

    type APIHttpCode<U extends APIPath, M extends APIMethod<U>> = keyof OpenAPI['paths'][U][M]['responses'];

    type APIServers<
        Tmp = {
            [K in Exclude<keyof OpenAPI['servers'], string | symbol>]: OpenAPI['servers'][K]['url'] extends `${infer URL}/` ? URL : OpenAPI['servers'][K]['url']
        }
    > = Tmp[keyof Tmp];

    type StringToType<T extends StringToTypeT, D = T> 
        = T extends string
            ? T extends 'string' ? string 
                : T extends 'boolean' ? boolean 
                    : T extends 'number' ? number 
                        : T extends 'integer' ? number
                            : T extends 'double' ? number
                                : D
            : T['$ref'] extends `#/components/schemas/${infer S}` 
                ? From$RefToType<T['$ref'], S>
                : T['type'] extends 'string'
                    ? T['format'] extends 'email' 
                        ? `${string}@${string}.${string}`
                        : T['enum'] extends string[]
                            ? T['enum'][Extract<keyof T['enum'], number>]
                            : StringToType<T['type'], D>
                    : T['type'] extends  | 'boolean' | 'number' | 'integer' | 'double' 
                        ? StringToType<T['type'], D>
                        : T['type'] extends 'array'
                            ? T['items']['type'] extends string 
                                ? T['items']['type'] extends 'object'
                                    ? FromSchemaToType<T['items']>[]
                                    : StringToType<T['items']['type'], D>[] 
                                : From$RefToType<T['items']['$ref'], D>[]
                            : D[];

    type UnionFromOneOf<
        OneOf extends Schema[],
        Tmp = { [K in keyof OneOf]: {type: FromSchemaToType<OneOf[K]>} }
    > = Exclude<Tmp[keyof Tmp], Function | number>['type'];

    type APIPath = keyof OpenAPI['paths'];

    type APIMethod<P extends APIPath> = Exclude<keyof OpenAPI['paths'][P], 'parameters'>;

    type IsAPIPathParameterRequired<
        P extends APIPath, 
        M extends APIMethod<P>,
        KParameters extends Parameters[keyof Parameters]['name'],
        Parameters extends OpenAPI['paths'][P][M]['parameters'] 
            = OpenAPI['paths'][P][M]['parameters'],
        Tmp = {
            [K in keyof Parameters as Exclude<Parameters[K], Function> extends never ? never : Parameters[K]['name']]: 
                Exclude<Parameters[K], Function>
        }
    > = {
        [K in keyof Tmp]: Extract<Tmp[K], { name: K }>['required'] extends true ? true : false
    }[KParameters];

    type APIPathParametersTmp<
        P extends APIPath, 
        M extends APIMethod<P>,
        Parameters = OpenAPI['paths'][P][M]['parameters'],
        KParameters extends keyof Parameters = keyof Parameters,
        Final = {
            [K in keyof Parameters]: {
                name: Parameters[K]['name'],
                schema: Parameters[K]['schema'],
                nullable: Parameters[K]['nullable'] extends boolean ? Parameters[K]['nullable'] : false,
                required: Parameters[K]['required'] extends boolean ? Parameters[K]['required'] : false
            }
        },
    > = {
        [K in Final[keyof Final] as K['schema'] extends object ? K['name'] : never]: FromSchemaToType<K['schema']>
    };

    type APIPathParameters<
        P extends APIPath, 
        M extends APIMethod<P>,
        Parameters extends OpenAPI['paths'][P][M]['parameters'] = OpenAPI['paths'][P][M]['parameters'],
        KParameters extends keyof Parameters = keyof Parameters,
        Tmp = {
            [K in keyof APIPathParametersTmp<P, M, Parameters, KParameters> as APIPathParametersTmp<P, M, Parameters, KParameters>[K] extends never ? never : K]: 
                APIPathParametersTmp<P, M, Parameters, KParameters>[K]
        },
        OptionalParameters = {
            [K in keyof Tmp as IsAPIPathParameterRequired<P, M, K, Parameters> extends false ? K : never]?: Tmp[K] 
        },
        NonOptionalParameters = {
            [K in keyof Tmp as IsAPIPathParameterRequired<P, M, K, Parameters> extends true ? K : never]: Tmp[K]
        },
        Final = OptionalParameters & NonOptionalParameters
    > = { [K in keyof Final]: Final[K] };

    type APIResponse<
        P extends APIPath, 
        M extends APIMethod<P>,
        ContentType = APIContentType<Responses[HttpCode]>,
        HttpCode extends keyof Responses = keyof Responses,
        Responses = OpenAPI['paths'][P][M]['responses'],
        Tmp = {
            [K in HttpCode]: 
                Responses[K]['content'] extends object 
                    ? Responses[K]['content'] : never
        }[HttpCode],
        Tmp2 = {
            [K in keyof Tmp as Tmp[K] extends never ? never : K]: Tmp[K]
        },
        Tmp3 = Tmp2[ContentType],
        Response = Tmp3['schema']
    > = Response extends object 
        ? Response['$ref'] extends string 
            ? From$RefToType<Response['$ref']> 
            : FromSchemaToType<Response> 
        : StringToType<Tmp[HttpCode][ContentType], undefined>

    type APIRequest<
        P extends APIPath, 
        M extends APIMethod<P>,
        ContentType extends APIContentType<Request>,
        Request = OpenAPI['paths'][P][M]['requestBody']
    > = Request extends object 
        ? Request['content'][ContentType]['schema']['$ref'] extends string 
            ? From$RefToType<Request['content'][ContentType]['schema']['$ref']> 
            : FromSchemaToType<Request['content'][ContentType]> 
        : StringToType<Request['content'][ContentType], undefined>;

    type FromSchemaToType<
        T extends Schema,
        RequiredKeys = Extract<T['required'][keyof T['required']], string>,
        OptionalKeys = Exclude<Extract<keyof T['properties'], string>, RequiredKeys>,
        Tmp = T['type'] extends 'object' 
            ? T['properties'] extends object
                ? ({
                    [K in RequiredKeys]: 
                        T['properties'][K]['nullable'] extends true 
                            ? T['properties'][K]['type'] extends string 
                                ? T['properties'][K]['type'] extends 'object'
                                    ? (FromSchemaToType<T['properties'][K]> | null)
                                    : (StringToType<T['properties'][K], never> | null)
                                : K extends `is${Uppercase<string>}` 
                                    ? (boolean | null) 
                                    : (undefined | null)
                            : T['properties'][K]['type'] extends string 
                                ? T['properties'][K]['type'] extends 'object'
                                    ? FromSchemaToType<T['properties'][K]>
                                    : StringToType<T['properties'][K], never>
                                : K extends `is${Uppercase<string>}` 
                                    ? boolean 
                                    : StringToType<T['properties'][K], undefined>
                } & {
                    [K in OptionalKeys]?:
                        T['properties'][K]['nullable'] extends true 
                            ? T['properties'][K]['type'] extends string 
                                ? T['properties'][K]['type'] extends 'object'
                                    ? (FromSchemaToType<T['properties'][K]> | null)
                                    : (StringToType<T['properties'][K], never> | null)
                                : K extends `is${Uppercase<string>}` 
                                    ? (boolean | null) 
                                    : (undefined | null)
                            : T['properties'][K]['type'] extends string 
                                ? T['properties'][K]['type'] extends 'object'
                                    ? FromSchemaToType<T['properties'][K]>
                                    : StringToType<T['properties'][K], never>
                                : K extends `is${string}` 
                                    ? boolean 
                                    : StringToType<T['properties'][K], undefined>
                })
                : {}
            : T['oneOf'] extends Schema[] 
                ? UnionFromOneOf<T['oneOf']> 
                : StringToType<T, undefined>
    > = Tmp extends object ? { [K in keyof Tmp]: Tmp[K] } : Tmp;
    
    type From$RefToType<
        T extends `#/components/schemas/${keyof OpenAPI['components']['schemas']}`,
        S = T extends `#/components/schemas/${infer _S}` ? _S : never,
        RequiredKeys = Extract<Schemas[S]['required'][keyof OpenAPI['components']['schemas'][S]['required']], string>,
        OptionalKeys = Exclude<Extract<keyof OpenAPI['components']['schemas'][S]['properties'], string>, RequiredKeys>,
        Schemas = OpenAPI['components']['schemas'],
        Tmp = T extends `#/components/schemas/${infer _S}` 
            ? Schemas[_S]['type'] extends 'object' 
                ? FromSchemaToType<Schemas[_S]>
                : StringToType<Schemas[_S], never>
            : never
    > = { [K in keyof Tmp]: Tmp[K] };

    type APIHeaders<
        U extends APIPath,
        M extends APIMethod<U>,
        Accept extends APIContentType<Responses<U, M>> 
            = APIContentType<Responses<U, M>>,
        Tmp = {
            'Content-Type': APIContentType<Requests<U, M>>,
            Accept: Accept
        }
    > = {
        [K in keyof Tmp as Tmp[K] extends never ? never : K]: Tmp[K]
    };

    type APIOptions<
        U extends APIPath,
        M extends APIMethod<U>,
        Tmp = {
            body: APIPathParameters<U, M>
        }
    > = {
        [K in keyof Tmp as Tmp[K] extends never ? never : K]: Tmp[K]
    };
}
