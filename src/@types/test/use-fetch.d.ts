declare module 'tests/use-fetch' {
    import type {
        UnionFromOneOf,
        IsAPIPathParameterRequired,
        APIPathParameters,
        APIResponse, APIRequest,
        FromSchemaToType,
        From$RefToType,
        APIContentType,
        Requests, Responses, APIHeaders, APIResponses, APIHttpCode, APIServers, APIBody
    } from 'use-fetch';

    type TestAPIServers = APIServers;

    type TestUnionFromOneOf = UnionFromOneOf<[
        {
            "type": "string"
        },
        {
            "type": "object",
            "properties": {
                "@vocab": {
                    "type": "string"
                },
                "hydra": {
                    "type": "string",
                    "enum": [
                        "http://www.w3.org/ns/hydra/core#"
                    ]
                }
            },
            "required": [
                "@vocab",
                "hydra"
            ],
            "additionalProperties": true
        }
    ]>;

    type TestIsAPIPathParameterRequired = IsAPIPathParameterRequired<'/api/agents/{id}', 'get', 'id'>;

    type TestAPIPathParameters = APIPathParameters<"/api/agents/{id}", 'get'>;

    type TestAPIResponse = APIResponse<'/api/agents/{id}', 'get', 'application/json', 200>;
    type TestAPIResponse2 = APIResponse<'/api/agents/{id}', 'get', 'application/json'>;
    type TestApiResponse3 = APIResponse<'/api/agents', 'get', 'application/ld+json', 200>;

    type TestAPIRequest = APIRequest<'/api/authentication-token', 'post', 'application/json'>;

    type TestFromSchemaToType = FromSchemaToType<{
        "type": "object",
        "properties": {
            "@vocab": {
                "type": "string"
            },
            "hydra": {
                "type": "string",
                "enum": [
                    "http://www.w3.org/ns/hydra/core#"
                ]
            }
        },
        "required": [
            "@vocab",
            "hydra"
        ],
        "additionalProperties": true
    }>;
    type TestFromSchemaToType2 = FromSchemaToType<{
        "type": "string"
    }>;

    type TestFrom$RefToType = From$RefToType<'#/components/schemas/Adresse'>;
    type TestFrom$RefToType2 = From$RefToType<'#/components/schemas/Agent.jsonld-user.read'>;
    type TestFrom$RefToType3 = From$RefToType<"#/components/schemas/StatutEnum.jsonld-user.read">;

    type TestRequest = Requests<'/api/collaborateurs/{id}', 'put'>;
    type TestRequestAPIContentType = APIContentType<Requests<'/api/collaborateurs/{id}', 'put'>>;

    type TestResponse = Responses<'/api/collaborateurs/{id}', 'put'>;
    type TestResponseAPIContentType = APIContentType<Responses<'/api/collaborateurs/{id}', 'put'>>;

    type TestCT = APIContentType<Requests<'/api/collaborateurs/{id}', 'get'>>;
    type TestAccept = APIContentType<Responses<'/api/collaborateurs/{id}', 'get'>>;
    
    type TestAPIHeaders = APIHeaders<'/api/collaborateurs/{id}', 'get'>
    type TestAPIHeaders2 = APIHeaders<'/api/authentication-token', 'post'>;

    type TestAPIHttpCode = APIHttpCode<'/api/agents', 'get'>;

    type TestAPIPathParameters = APIPathParameters<'/api/authentication-token', 'post'>;
    type TestAPIRequest = APIRequest<'/api/authentication-token', 'post', 'application/json'>;

    type TestAPIBody = APIBody<'/api/authentication-token', 'post', 'application/json'>;
    type TestBody = TestAPIPathParameters & TestAPIRequest
}