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

    type Test = APIBody<'/api/agents', 'get', 'application/json'>;

    const useFetch = async <
        U extends APIPath, 
        M extends APIMethod<U>,
        Accept extends APIContentType<Responses<U, M>> = APIContentType<Responses<U, M>>,
        Code extends APIHttpCode<U, M> = APIHttpCode<U, M>,
        FinalResponse = APIResponse<U, M, Accept, Code>,
        Headers extends APIHeaders<U, M, Accept> = APIHeaders<U, M, Accept>,
        Body extends APIBody<U, M, Accept> = APIBody<U, M, Accept>,
        Params = (Body extends any ? [
            url: U | `${APIServers}${U}`, 
            method: M, 
            headers: Headers
        ] : [
            url: U | `${APIServers}${U}`, 
            method: M, 
            headers: Headers,
            body: Body
        ]),
        Return = {
            code: Code,
            accept: Accept,
            response: FinalResponse
        },
    >(...args: Params): Promise<Return> => {
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
        Body extends APIBody<U, M, Accept> = APIBody<U, M, Accept>,
        Params = {
            url: U | `${APIServers}${U}`,
            method: M,
            headers: Headers,
            body: Body
        },
        Return = {
            code: Code,
            accept: Accept,
            response: FinalResponse
        },
        FetchParams = { [K in keyof Params as Params[K] extends never ? never : K]: Params[K] }
    >(args: FetchParams): Promise<Return> => {
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

    
    const useFetch3 = async <
        U extends APIPath, 
        M extends APIMethod<U>,
        Accept extends APIContentType<Responses<U, M>> = APIContentType<Responses<U, M>>,
        Code extends APIHttpCode<U, M> = APIHttpCode<U, M>,
        FinalResponse = APIResponse<U, M, Accept, Code>,
        Headers extends APIHeaders<U, M, Accept> = APIHeaders<U, M, Accept>,
        Body extends APIBody<U, M, Accept> = APIBody<U, M, Accept>,
        Params = {
            method: M,
            headers: Headers,
            body: Body
        },
        FetchParams = { [K in keyof Params as Params[K] extends never ? never : K]: Params[K] },
        Return = {
            code: Code,
            accept: Accept,
            response: FinalResponse
        },
    >(url: U | `${APIServers}${U}`, { method, headers, body = undefined }: FetchParams): Promise<Return> => {
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