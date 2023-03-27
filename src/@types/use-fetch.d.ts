declare module 'use-fetch' {
    import { Omited, Optionals, Combine } from 'utils';

    type Email = `${string}@${string}.${string}`;

    // model d'un schema open-api
    type Schema = {
        type: 
            | 'string' | 'boolean' 
            | 'number' | 'object',
        properties?: {
            [ k: string ]: {
                type?: 
                    | 'string' | 'boolean' 
                    | 'integer' | 'number',
                format?: 
                    | 'int32' | 'int64' 
                    | 'float' | 'double' 
                    | 'password' | 'email',
                $ref?: `#/components/schema/${string}`,
                required?: boolean
            }
        },
        required: string[]
    };

    type AllBasesUrl = Extract<OpenAPI['servers'][keyof OpenAPI['servers']], {
        url: string,
        description: string
    }>['url'];

    // génere le type associé à un schema de type objet
    type FromObjectSchema<
        S extends Schema['properties']
    > = {
        [K in keyof S]: 
            S[K]['type'] extends 'string' 
                ? (S[K]['format'] extends 'email' 
                    ? Email : string) : S[K]['type'] extends 'boolean' 
                        ? boolean : S[K]['type'] extends 'number' 
                            ? number : S[K]['type'] extends 'integer' 
                                ? number  : undefined;
    };

    // génere le type assocé à m'importe quel schema
    type FromSchema<S extends Schema> = 
        S['type'] extends 'string' ? 
            string : S['type'] extends 'boolean' 
                ? boolean : S['type'] extends 'number' 
                    ? number 
                        : FromObjectSchema<S['properties']>;

    type GetSchema<
        K extends keyof OpenAPI['components']['schemas']
    > = OpenAPI['components']['schemas'][K];

    // génere le type assocé à un schema grace à son nom
    type TypeFromSchema<
        K extends keyof OpenAPI['components']['schemas']
    > = TypeFromRef<`#/components/schema/${K}`>;

    // récupere le schema associé à une $ref
    type SchemaFromRef<
        S extends `#/components/schema/${keyof OpenAPI['components']['schemas']}` & string
    > = 
        S extends `#/components/schema/${infer R}` 
            ? OpenAPI['components']['schemas'][R]
                : string;
    
    // génere le type assocé à un schema sans prendre en comte les 
    // propriétés optionelles grace à au lien d'une $ref
    type TypeFromRefWithAllRequired<
        S extends `#/components/schema/${keyof OpenAPI['components']['schemas']}` & string
    > = 
        S extends `#/components/schema/${infer R}` 
            ? FromSchema<OpenAPI['components']['schemas'][R]>
                : string;
    
    // récupere les clé requises d'un schema
    type RequiredKeys<
        S extends Schema,
        P extends S['properties'] = S['properties'],
        KP extends keyof P = keyof P,
        R extends KP[] = S['required'],
        KR extends keyof R = keyof R
    > = Extract<R[KR], string> extends never ? undefined : Extract<R[KR], string>;

    // génere le type assocé à un schema en prenant en comte les 
    // propriétés optionelles grace à au lien d'une $ref
    type TypeFromRef<
        R extends `#/components/schema/${SchemaName}` & string = `#/components/schema/User`, 
        SchemaName extends keyof OpenAPI['components']['schemas'] 
            = keyof OpenAPI['components']['schemas'],
        Properties extends OpenAPI['components']['schemas'][SchemaName]['properties']
            = OpenAPI['components']['schemas'][SchemaName]['properties'],
        S extends SchemaFromRef<R> = SchemaFromRef<R>,
        T extends TypeFromRefWithAllRequired<R> = TypeFromRefWithAllRequired<R>,
        OptionalsKeys extends Exclude<
            keyof Properties, 
            RequiredKeys<OpenAPI['components']['schemas'][SchemaName]>
        > = Exclude<
            keyof Properties, 
            RequiredKeys<OpenAPI['components']['schemas'][SchemaName]>
        >
    > = Combine<
        {
            [K in Exclude<keyof Properties, OptionalsKeys>]: T[K]
        } & {
            [K in Exclude<keyof Properties, RequiredKeys<S>>]?: T[K]
        }
    >;

    type AvailableUris = keyof OpenAPI['paths'];

    type AvailableHttpMethods<URI extends AvailableUris> = 
        | keyof OpenAPI['paths'][URI]
        | Capitalize<keyof OpenAPI['paths'][URI]>
        | Uppercase<keyof OpenAPI['paths'][URI]>;

    type ResponseType<
        URI extends AvailableUris,
        HttpMethod extends AvailableHttpMethods<URI>,
        ResponseCode extends keyof Responses,
        ContentType extends keyof Path[ResponseCode]['content'],
        Responses extends OpenAPI['paths'][URI][HttpMethod]['responses'] 
            = OpenAPI['paths'][URI][HttpMethod]['responses'],
        Path extends { [K in keyof Responses]: Responses[K] } 
            = { [K in keyof Responses]: Responses[K] }
    > = Path[ResponseCode]['content'][ContentType];

    type InterpretedArrayResponseType<
        URI extends AvailableUris,
        HttpMethod extends AvailableHttpMethods<URI>,
        ResponseCode extends keyof Responses,
        ContentType extends keyof Path[ResponseCode]['content'],
        Responses extends OpenAPI['paths'][URI][HttpMethod]['responses'] 
            = OpenAPI['paths'][URI][HttpMethod]['responses'],
        Path extends { [K in keyof Responses]: Responses[K] } 
            = { [K in keyof Responses]: Responses[K] },
        Response extends ResponseType<URI, HttpMethod, ResponseCode, ContentType, Responses, Path> 
            = ResponseType<URI, HttpMethod, ResponseCode, ContentType, Responses, Path>
    > = 
        Response['schema']['items']['$ref'] extends `#/components/schemas/${infer T}` ?
            TypeFromSchema<T>[] : void;

    type InterpretedSimpleResponseType<
        URI extends AvailableUris,
        HttpMethod extends AvailableHttpMethods<URI>,
        ResponseCode extends keyof Responses,
        ContentType extends keyof Path[ResponseCode]['content'],
        Responses extends OpenAPI['paths'][URI][HttpMethod]['responses'] 
            = OpenAPI['paths'][URI][HttpMethod]['responses'],
        Path extends { [K in keyof Responses]: Responses[K] } 
            = { [K in keyof Responses]: Responses[K] },
        Response extends ResponseType<URI, HttpMethod, ResponseCode, ContentType, Responses, Path> 
            = ResponseType<URI, HttpMethod, ResponseCode, ContentType, Responses, Path>
    > = 
        Response['schema']['$ref'] extends `#/components/schemas/${infer T}` ?
            TypeFromSchema<T> : void;

    type ContentTypeFromUri<
        URI extends AvailableUris,
        HttpMethod extends keyof OpenAPI['paths'][URI]
    > = keyof OpenAPI['paths'][URI][HttpMethod]['requestBody']['content'] extends never ?
        undefined : keyof OpenAPI['paths'][URI][HttpMethod]['requestBody']['content'];

    type InterpretedRequestType<
        URI extends AvailableUris,
        HttpMethod extends AvailableHttpMethods<URI>,
        ContentType extends ContentTypeFromUri<URI, HttpMethod>,
        Request extends OpenAPI['paths'][URI][HttpMethod]['requestBody']['content']
            = OpenAPI['paths'][URI][HttpMethod]['requestBody']['content'],
        Schema extends Request[ContentType]['schema'] = Request[ContentType]['schema']
    > = Schema['type'] extends unknown 
        ? Schema['$ref'] extends `#/components/schemas/${infer T}` 
            ? TypeFromSchema<T> : undefined : undefined;

    type FetchInitObject<
        URI extends AvailableUris,
        HttpMethod extends keyof OpenAPI['paths'][URI],
        ContentType extends ContentTypeFromUri<URI, HttpMethod>,
    > = {
        method: HttpMethod,
        headers: {
            'Content-Type': ContentType
        }
    } & (InterpretedRequestType<
        URI, HttpMethod,
        ContentType
    > extends never ? {} : {
        body?: InterpretedRequestType<
            URI, HttpMethod,
            ContentType
        >
    });

    type InterpretedResponseType<
        URI extends AvailableUris,
        HttpMethod extends AvailableHttpMethods<URI>,
        ResponseCode extends keyof Responses,
        ContentType extends keyof Path[ResponseCode]['content'],
        Responses extends OpenAPI['paths'][URI][HttpMethod]['responses'] 
            = OpenAPI['paths'][URI][HttpMethod]['responses'],
        Path extends { [K in keyof Responses]: Responses[K] } 
            = { [K in keyof Responses]: Responses[K] },
        Response extends ResponseType<URI, HttpMethod, ResponseCode, ContentType, Responses, Path> 
            = ResponseType<URI, HttpMethod, ResponseCode, ContentType, Responses, Path>,
        _ResponseType extends Response['schema']['type'] = Response['schema']['type']
    > = 
        _ResponseType extends 'array' ?
            InterpretedArrayResponseType<
                URI, HttpMethod, ResponseCode, 
                ContentType, Responses, Path, 
                Response
            > : 
                (_ResponseType extends 'object' ?
                    InterpretedSimpleResponseType<
                        URI, HttpMethod, ResponseCode, 
                        ContentType, Responses, Path, 
                        Response
                    > : (_ResponseType extends unknown ?
                        (Response['schema']['$ref'] extends `#/components/schemas/${infer T}` ?
                            TypeFromSchema<T> : undefined) : undefined));

    type InitMethodObject<URI extends AvailableUris> = {
        method: keyof AvailableHttpMethods<URI>
    };

    type InitBodyObject<
        URI extends AvailableUris,
        HttpMethod extends AvailableHttpMethods<URI>,
        ResponseCode extends keyof Responses,
        ContentType extends keyof Path[ResponseCode]['content'],
        Responses extends OpenAPI['paths'][URI][HttpMethod]['responses'] 
            = OpenAPI['paths'][URI][HttpMethod]['responses'],
        Path extends { [K in keyof Responses]: Responses[K] } 
            = { [K in keyof Responses]: Responses[K] },
        Response extends ResponseType<URI, HttpMethod, ResponseCode, ContentType, Responses, Path> 
            = ResponseType<URI, HttpMethod, ResponseCode, ContentType, Responses, Path>,
        _ResponseType extends Response['schema']['type'] = Response['schema']['type']
    > = HttpMethod extends 'get' 
        ? never : InterpretedResponseType<
            URI, HttpMethod, ResponseCode, 
            ContentType, Responses, Path, 
            Response, _ResponseType
        >;

    type FetchReturnType<
        URI extends AvailableUris,
        HttpMethod extends keyof OpenAPI['paths'][URI],
        ContentType extends ContentTypeFromUri<URI, HttpMethod>,
        HttpReturnCode extends AvailableHttpCodes
            = AvailableHttpCodes,
        Body extends InterpretedRequestType<URI, HttpMethod, ContentType>
            = InterpretedRequestType<URI, HttpMethod, ContentType>,
        Path extends OpenAPI['paths'][URI][HttpMethod] 
            = OpenAPI['paths'][URI][HttpMethod],
    > = InterpretedResponseType<
        URI, 
        HttpMethod,
        HttpReturnCode,
        'application/json'
    >;

    type FetchReturnTypes<
        URI extends AvailableUris,
        HttpMethod extends keyof OpenAPI['paths'][URI],
        Responses extends OpenAPI['paths'][URI][HttpMethod]['responses']
            = OpenAPI['paths'][URI][HttpMethod]['responses']
    > = {
        [K in keyof Responses]: InterpretedResponseType<URI, HttpMethod, K, 'application/json'>// TypeFromSchema<Responses[K]['content']['application/json']['schema']>;
    }[keyof {
        [K in keyof Responses]: InterpretedResponseType<URI, HttpMethod, K, 'application/json'>// TypeFromSchema<Responses[K]['content']['application/json']['schema']>;
    }];

    type AvailableHttpCodes<
        URI extends AvailableUris = keyof OpenAPI['paths'],
        HttpMethod extends keyof OpenAPI['paths'][URI] 
            = keyof OpenAPI['paths'][URI]
    > = keyof OpenAPI['paths'][URI][HttpMethod]['responses'];

    type FetchReturnHook<
        URI extends AvailableUris,
        HttpMethod extends keyof OpenAPI['paths'][URI],
        ContentType extends ContentTypeFromUri<URI, HttpMethod>,
        Return extends FetchReturnTypes<
            URI, HttpMethod
        > = FetchReturnTypes<
            URI, HttpMethod
        >,
        Body extends InterpretedRequestType<URI, HttpMethod, ContentType>
            = InterpretedRequestType<URI, HttpMethod, ContentType>
    > = Body extends undefined ? {
        //fetch(options: {} = {}): Promise<Exclude<Return, undefined>>;
        fetch(): Promise<Exclude<Return, undefined>>;
        abort(): void;
    } : {
        // fetch(options: { body: Body }): Promise<Exclude<Return, undefined>>;
        fetch(body: Body): Promise<Exclude<Return, undefined>>;
        abort(): void;
    }

    type T = FetchReturnHook<'/users', 'get', 'application/json'>
}