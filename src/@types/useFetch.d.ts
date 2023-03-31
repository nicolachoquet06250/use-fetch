declare module 'useFetch' {
    import type {
        APIBody,
        APIContentType,
        APIHeaders,
        APIHttpCode,
        APIMethod, APIPath,
        APIPathParameters,
        APIRequest,
        APIResponse,
        APIServers,
        Responses
    } from "use-fetch";

    type UseFetchParams<
        U extends APIPath, 
        M extends APIMethod<U>,
        Accept extends APIContentType<Responses<U, M>>,
        Headers extends APIHeaders<U, M, Accept> 
            = APIHeaders<U, M, Accept>,
        Body extends APIBody<U, M, Accept> 
            = APIBody<U, M, Accept>,
        Params = [
            url: U | `${APIServers}${U}`,
            httpVerb: M,
            headers: Headers
        ]
    > = Body extends never ? Params : Params & [
        body: Body
    ];

    type TestUseFetchParams = UseFetchParams<
        '/api/authentication-token', 
        'post', 
        'application/json'
    >;

    type UseFetchParams2<
        U extends APIPath, 
        M extends APIMethod<U>,
        Accept extends APIContentType<Responses<U, M>>,
        Headers extends APIHeaders<U, M, Accept> 
            = APIHeaders<U, M, Accept>,
        Body extends APIBody<U, M, Accept> 
            = APIBody<U, M, Accept>,
        Params = {
            url: U | `${APIServers}${U}`,
            method: M,
            headers: Headers,
            body: Body
        }
    > = {
        [K in keyof Params as Params[K] extends never 
            ? never : K]: Params[K]
    };

    type TestUseFetchParams2 = UseFetchParams2<
        '/api/authentication-token', 
        'post', 
        'application/json'
    >;

    const useFetch = async <
        U extends APIPath, 
        M extends APIMethod<U>,
        Accept extends APIContentType<Responses<U, M>> = APIContentType<Responses<U, M>>,
        Code extends APIHttpCode<U, M> = APIHttpCode<U, M>,
        FinalResponse = APIResponse<U, M, Accept, Code>,
        Headers extends APIHeaders<U, M, Accept> = APIHeaders<U, M, Accept>,
        Return = {
            code: Code,
            accept: Accept,
            response: FinalResponse
        }
    >(
        ...args: UseFetchParams<U, M, Accept, Headers>
    ): Promise<Return> => {
        const [url, method, headers, body = undefined] = args;
        const bodyObj = body ? { body: body as BodyInit } : {};

        const options: RequestInit = {
            method: method as string, 
            headers: headers as HeadersInit,
            ...bodyObj
        };

        return await fetch(url, options)
            .then((r: Response) => {
                return {
                    code: `${r.status}` as Code,
                    accept: (headers as unknown as { Accept: string }).Accept as Accept,
                    response: r[
                        (headers as unknown as { Accept: string }).Accept.startsWith('text/') 
                            || (headers as unknown as { Accept: string }).Accept === 'plain/text' 
                            ? 'text' : 'json'
                    ]() as FinalResponse
                };
            });
    };

    const useFetch2 = async <
        U extends APIPath, 
        M extends APIMethod<U>,
        Accept extends APIContentType<Responses<U, M>> = APIContentType<Responses<U, M>>,
        Code extends APIHttpCode<U, M> = APIHttpCode<U, M>,
        FinalResponse = APIResponse<U, M, Accept, Code>,
        Headers extends APIHeaders<U, M, Accept> = APIHeaders<U, M, Accept>,
        Return = {
            code: Code,
            accept: Accept,
            response: FinalResponse
        }
    >(
        args: UseFetchParams2<U, M, Accept, Headers>
    ): Promise<Return> => {
        const {
            url,
            method,
            headers,
            body = undefined
        } = args;
        const bodyObj = body ? { body: body as BodyInit } : {};

        const options: RequestInit = {
            method: method as string, 
            headers: headers as HeadersInit,
            ...bodyObj
        };

        return await fetch(url, options)
            .then((r: Response) => {
                return {
                    code: `${r.status}` as Code,
                    accept: (headers as unknown as { Accept: string }).Accept as Accept,
                    response: r[
                        (headers as unknown as { Accept: string }).Accept.startsWith('text/') 
                            || (headers as unknown as { Accept: string }).Accept === 'plain/text' 
                            ? 'text' : 'json'
                    ]() as FinalResponse
                };
            });
    };
}