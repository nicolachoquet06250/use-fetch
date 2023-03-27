declare module 'use-fetch-tests' {
    import { Omited, Optionals } from 'utils';

    import { 
        FromSchema, TypeFromSchema, 
        SchemaFromRef, TypeFromRef, 
        RequiredKeys, AvailableHttpMethods,
        ResponseType, InterpretedResponseType,
        ContentTypeFromUri, InterpretedRequestType,
        FetchReturnType, FetchReturnTypes
    } from 'use-fetch';

    type TestOmited = Omited<
        TestSchemaFromRef, 
        TestRequiredKeys
    >;
    type TestOptionals = Optionals<
        TestSchemaFromRef, 
        TestRequiredKeys
    >;
    type TestOptionalsOmit = TestOptionals & TestOmited;
    
    type TestFromSchema = FromSchema<
        OpenAPI['components']['schemas']['User']
    >;
    
    type TestTypeFromSchema = TypeFromSchema<'User'>;
    
    type TestSchemaFromRef = SchemaFromRef<
        `#/components/schema/User`
    >;

    type TestRequiredKeys = RequiredKeys<
        OpenAPI['components']['schemas']['User']
    >;

    type TestOptionalsKeys = Exclude<
        keyof OpenAPI['components']['schemas']['User']['properties'],
        TestRequiredKeys
    >;
    
    type TestTypeFromRef = TypeFromRef;

    type TestAvailableHttpMethods = AvailableHttpMethods<'/users'>;

    type TestResponseType = ResponseType<
        '/users', 
        'get', 
        '200', 
        'application/json'
    >;

    type TestInterpretedResponseType = InterpretedResponseType<
        '/users', 
        'post', 
        '201', 
        'application/json'
    >;

    type TestContentTypeFromUri = ContentTypeFromUri<'/users', 'post'>;

    type TestInterpretedRequestType = InterpretedRequestType<'/users', 'post', 'application/json'>;

    type TestFetchReturnType = FetchReturnType<
        '/users', 
        'post', 
        'application/json',
        '201'
    >;
    
    type TestFetchReturnType2 = FetchReturnType<
        '/users', 
        'get', 
        'application/json',
        '200'
    >;

    type TestFetchReturnTypes = FetchReturnTypes<'/users', 'get'>;
}